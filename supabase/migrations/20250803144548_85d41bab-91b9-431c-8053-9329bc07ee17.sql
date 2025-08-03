-- Create attendance-related tables for school attendance system

-- Attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  school_id UUID NOT NULL,
  date DATE NOT NULL,
  period INTEGER NULL, -- NULL for daily attendance, number for period-based
  subject TEXT NULL, -- Subject name for period-based attendance
  teacher_id UUID NOT NULL, -- Who marked the attendance
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'left_early')),
  reason TEXT NULL, -- Reason for absence/lateness
  notes TEXT NULL,
  is_excused BOOLEAN DEFAULT FALSE,
  excused_by UUID NULL, -- Who approved the excuse
  excused_at TIMESTAMP WITH TIME ZONE NULL,
  excuse_document_url TEXT NULL,
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Ensure one record per student per date per period
  UNIQUE(student_id, date, period)
);

-- Attendance excuses submitted by parents
CREATE TABLE public.attendance_excuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendance_record_id UUID NOT NULL,
  submitted_by UUID NOT NULL, -- Parent who submitted
  excuse_reason TEXT NOT NULL,
  supporting_document_url TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE NULL,
  review_notes TEXT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Attendance settings per school
CREATE TABLE public.attendance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL UNIQUE,
  late_threshold_minutes INTEGER DEFAULT 15, -- How many minutes late = marked late
  attendance_mode TEXT DEFAULT 'daily' CHECK (attendance_mode IN ('daily', 'period')),
  auto_mark_weekends BOOLEAN DEFAULT FALSE,
  alert_after_days INTEGER DEFAULT 1, -- Send alert after X consecutive absences
  require_excuse_approval BOOLEAN DEFAULT TRUE,
  enable_qr_checkin BOOLEAN DEFAULT FALSE,
  enable_biometric_checkin BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Attendance alerts/notifications
CREATE TABLE public.attendance_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  school_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('absence', 'late', 'consecutive_absence', 'pattern')),
  message TEXT NOT NULL,
  recipients JSONB NOT NULL, -- Array of user IDs to notify
  sent_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Timetable periods for period-based attendance
CREATE TABLE public.school_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  period_number INTEGER NOT NULL,
  period_name TEXT NOT NULL, -- e.g., "Period 1", "Math Period"
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL, -- Array of day numbers (1=Monday, 7=Sunday)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(school_id, period_number)
);

-- Class schedules (which students are in which period)
CREATE TABLE public.class_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  period_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  subject TEXT NOT NULL,
  room TEXT NULL,
  year_group TEXT NOT NULL,
  form_class TEXT NULL,
  student_ids UUID[] NOT NULL, -- Array of student IDs in this class
  days_of_week INTEGER[] NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_excuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance_records
CREATE POLICY "Teachers can view attendance in their school" ON public.attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = attendance_records.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Teachers can mark attendance" ON public.attendance_records
  FOR INSERT WITH CHECK (
    teacher_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = attendance_records.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Teachers can update attendance they marked" ON public.attendance_records
  FOR UPDATE USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = attendance_records.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Students can view their own attendance" ON public.attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.user_id = auth.uid() 
      AND s.user_id = attendance_records.student_id
    )
  );

CREATE POLICY "Parents can view their children's attendance" ON public.attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents sp 
      WHERE sp.parent_id = auth.uid() 
      AND sp.student_id = attendance_records.student_id
    )
  );

-- RLS Policies for attendance_excuses
CREATE POLICY "Teachers and admins can view excuses" ON public.attendance_excuses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM attendance_records ar
      JOIN user_roles ur ON ur.school_id = ar.school_id
      WHERE ar.id = attendance_excuses.attendance_record_id
      AND ur.user_id = auth.uid()
      AND ur.role IN ('teacher', 'school_admin', 'hod')
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Parents can submit excuses for their children" ON public.attendance_excuses
  FOR INSERT WITH CHECK (
    submitted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM attendance_records ar
      JOIN student_parents sp ON sp.student_id = ar.student_id
      WHERE ar.id = attendance_excuses.attendance_record_id
      AND sp.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view excuses they submitted" ON public.attendance_excuses
  FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "Teachers can update excuse status" ON public.attendance_excuses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM attendance_records ar
      JOIN user_roles ur ON ur.school_id = ar.school_id
      WHERE ar.id = attendance_excuses.attendance_record_id
      AND ur.user_id = auth.uid()
      AND ur.role IN ('teacher', 'school_admin', 'hod')
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for other tables
CREATE POLICY "School staff can manage attendance settings" ON public.attendance_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = attendance_settings.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "School staff can view alerts" ON public.attendance_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = attendance_alerts.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "School staff can manage periods" ON public.school_periods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = school_periods.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "School staff can manage schedules" ON public.class_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = class_schedules.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create indexes for performance
CREATE INDEX idx_attendance_records_student_date ON public.attendance_records(student_id, date);
CREATE INDEX idx_attendance_records_school_date ON public.attendance_records(school_id, date);
CREATE INDEX idx_attendance_records_teacher ON public.attendance_records(teacher_id);
CREATE INDEX idx_attendance_excuses_record ON public.attendance_excuses(attendance_record_id);
CREATE INDEX idx_attendance_alerts_student ON public.attendance_alerts(student_id);
CREATE INDEX idx_class_schedules_teacher ON public.class_schedules(teacher_id);

-- Create triggers for updated_at
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_excuses_updated_at
  BEFORE UPDATE ON public.attendance_excuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_settings_updated_at
  BEFORE UPDATE ON public.attendance_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_periods_updated_at
  BEFORE UPDATE ON public.school_periods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at
  BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();