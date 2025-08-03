-- Create timetable system tables

-- Timetable periods/slots definition
CREATE TABLE public.timetable_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  period_number INTEGER NOT NULL,
  period_name TEXT NOT NULL, -- e.g., "Period 1", "Morning Break", "Lunch"
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_break BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(school_id, period_number)
);

-- Subject definitions
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL, -- e.g., "MATH", "ENG", "SCI"
  color_code TEXT DEFAULT '#3B82F6', -- Hex color for display
  requires_lab BOOLEAN DEFAULT FALSE,
  periods_per_week INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(school_id, subject_code)
);

-- Teacher subject assignments
CREATE TABLE public.teacher_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  year_groups TEXT[] NOT NULL, -- Which year groups they can teach
  max_periods_per_week INTEGER DEFAULT 22,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(teacher_id, subject_id)
);

-- Classroom/Room definitions
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  room_name TEXT NOT NULL, -- e.g., "Room 101", "Science Lab 1"
  room_type TEXT DEFAULT 'classroom', -- 'classroom', 'lab', 'gym', 'library'
  capacity INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(school_id, room_name)
);

-- Main timetable entries
CREATE TABLE public.timetable_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  class_id TEXT NOT NULL, -- e.g., "Grade-8A", "Year-10B"
  period_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  classroom_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1=Monday, 5=Friday
  academic_year TEXT NOT NULL, -- e.g., "2024-2025"
  term TEXT DEFAULT 'Term 1', -- "Term 1", "Term 2", "Term 3"
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Ensure no conflicts
  UNIQUE(school_id, teacher_id, period_id, day_of_week, academic_year, term),
  UNIQUE(school_id, classroom_id, period_id, day_of_week, academic_year, term),
  UNIQUE(school_id, class_id, period_id, day_of_week, academic_year, term)
);

-- Enable RLS on all tables
ALTER TABLE public.timetable_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for timetable_periods
CREATE POLICY "School staff can view periods" ON public.timetable_periods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = timetable_periods.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Admins can manage periods" ON public.timetable_periods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = timetable_periods.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for subjects
CREATE POLICY "School staff can view subjects" ON public.subjects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = subjects.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = subjects.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for teacher_subjects
CREATE POLICY "Teachers can view their subjects" ON public.teacher_subjects
  FOR SELECT USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Admins can manage teacher subjects" ON public.teacher_subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for classrooms
CREATE POLICY "School staff can view classrooms" ON public.classrooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = classrooms.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Admins can manage classrooms" ON public.classrooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = classrooms.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for timetable_entries
CREATE POLICY "Students can view their class timetable" ON public.timetable_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.user_id = auth.uid() 
      AND (s.form_class = timetable_entries.class_id OR s.year_group = timetable_entries.class_id)
      AND s.school_id = timetable_entries.school_id
    )
  );

CREATE POLICY "Parents can view their children's timetable" ON public.timetable_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN students s ON s.user_id = sp.student_id
      WHERE sp.parent_id = auth.uid() 
      AND (s.form_class = timetable_entries.class_id OR s.year_group = timetable_entries.class_id)
      AND s.school_id = timetable_entries.school_id
    )
  );

CREATE POLICY "Teachers can view relevant timetables" ON public.timetable_entries
  FOR SELECT USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = timetable_entries.school_id 
      AND ur.role IN ('teacher', 'school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Admins can manage timetable entries" ON public.timetable_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = timetable_entries.school_id 
      AND ur.role IN ('school_admin', 'hod') 
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create indexes for performance
CREATE INDEX idx_timetable_entries_class_day ON public.timetable_entries(school_id, class_id, day_of_week);
CREATE INDEX idx_timetable_entries_teacher_day ON public.timetable_entries(school_id, teacher_id, day_of_week);
CREATE INDEX idx_timetable_entries_period_day ON public.timetable_entries(school_id, period_id, day_of_week);

-- Create triggers for updated_at
CREATE TRIGGER update_timetable_periods_updated_at
  BEFORE UPDATE ON public.timetable_periods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at
  BEFORE UPDATE ON public.classrooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timetable_entries_updated_at
  BEFORE UPDATE ON public.timetable_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();