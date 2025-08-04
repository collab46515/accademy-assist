-- Create report_cards table
CREATE TABLE IF NOT EXISTS public.report_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  school_id UUID NOT NULL,
  academic_term TEXT NOT NULL, -- 'autumn_2025', 'spring_2025', etc.
  academic_year TEXT NOT NULL, -- '2024-2025'
  class_name TEXT NOT NULL,
  teacher_id UUID NOT NULL,
  teacher_name TEXT NOT NULL,
  
  -- Report metadata
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  generated_by UUID NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NULL,
  
  -- Student info snapshot
  student_name TEXT NOT NULL,
  student_photo_url TEXT NULL,
  year_group TEXT NOT NULL,
  
  -- Report content (JSON structure)
  grades_data JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of subject grades
  comments_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Teacher comments per subject
  effort_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Effort ratings per subject
  attendance_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Attendance summary
  curriculum_coverage JSONB NOT NULL DEFAULT '{}'::jsonb, -- Coverage percentages
  targets JSONB NOT NULL DEFAULT '[]'::jsonb, -- Targets for next term
  
  -- File storage
  pdf_url TEXT NULL,
  pdf_generated_at TIMESTAMP WITH TIME ZONE NULL,
  
  -- Parent access
  parent_access_enabled BOOLEAN DEFAULT true,
  parent_viewed_at TIMESTAMP WITH TIME ZONE NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_bank table
CREATE TABLE IF NOT EXISTS public.comment_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL, -- 'GDS', 'WA', 'WT', etc.
  comment_template TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'academic', -- 'academic', 'effort', 'behaviour'
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint for subject + grade + category
  UNIQUE(school_id, subject, grade_level, category)
);

-- Enable RLS
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_bank ENABLE ROW LEVEL SECURITY;

-- RLS Policies for report_cards
CREATE POLICY "Teachers can manage reports for their students" 
ON public.report_cards 
FOR ALL 
USING (
  teacher_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = report_cards.school_id
    AND ur.role IN ('school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Parents can view their children's reports" 
ON public.report_cards 
FOR SELECT 
USING (
  status = 'published' AND
  parent_access_enabled = true AND
  EXISTS (
    SELECT 1 FROM student_parents sp
    WHERE sp.parent_id = auth.uid()
    AND sp.student_id = report_cards.student_id
  )
);

CREATE POLICY "Students can view their own reports" 
ON public.report_cards 
FOR SELECT 
USING (
  status = 'published' AND
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = report_cards.student_id
  )
);

-- RLS Policies for comment_bank
CREATE POLICY "School staff can manage comment bank" 
ON public.comment_bank 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = comment_bank.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create indexes
CREATE INDEX idx_report_cards_student_id ON public.report_cards(student_id);
CREATE INDEX idx_report_cards_school_term ON public.report_cards(school_id, academic_term);
CREATE INDEX idx_report_cards_teacher_id ON public.report_cards(teacher_id);
CREATE INDEX idx_report_cards_status ON public.report_cards(status);
CREATE INDEX idx_comment_bank_subject_grade ON public.comment_bank(subject, grade_level);
CREATE INDEX idx_comment_bank_school_id ON public.comment_bank(school_id);

-- Create triggers for updated_at
CREATE TRIGGER update_report_cards_updated_at
BEFORE UPDATE ON public.report_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comment_bank_updated_at
BEFORE UPDATE ON public.comment_bank
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate report card data
CREATE OR REPLACE FUNCTION public.generate_report_card_data(
  p_student_id UUID,
  p_academic_term TEXT,
  p_academic_year TEXT
)
RETURNS JSONB AS $$
DECLARE
  student_info RECORD;
  grades_array JSONB := '[]'::jsonb;
  attendance_summary JSONB := '{}'::jsonb;
  coverage_summary JSONB := '{}'::jsonb;
  grade_record RECORD;
  attendance_stats RECORD;
BEGIN
  -- Get student information
  SELECT s.*, p.first_name, p.last_name,
         CONCAT(p.first_name, ' ', p.last_name) as full_name
  INTO student_info
  FROM students s
  JOIN profiles p ON p.user_id = s.user_id
  WHERE s.id = p_student_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found';
  END IF;
  
  -- Get aggregated grades for the term
  FOR grade_record IN 
    SELECT 
      subject_id,
      subject_id as subject_name, -- You might want to join with subjects table
      grade_text,
      AVG(grade_numeric) as avg_numeric,
      COUNT(*) as assessment_count,
      MAX(date_recorded) as latest_assessment
    FROM gradebook_records
    WHERE student_id = p_student_id
    AND academic_period = p_academic_term
    AND grade_numeric IS NOT NULL
    GROUP BY subject_id, grade_text
    ORDER BY subject_name
  LOOP
    grades_array := grades_array || jsonb_build_object(
      'subject', grade_record.subject_name,
      'grade', grade_record.grade_text,
      'average_numeric', grade_record.avg_numeric,
      'assessment_count', grade_record.assessment_count,
      'latest_assessment', grade_record.latest_assessment
    );
  END LOOP;
  
  -- Get attendance summary for the term
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'present') as present_count,
    COUNT(*) FILTER (WHERE status = 'absent') as absent_count,
    COUNT(*) FILTER (WHERE status = 'late') as late_count,
    ROUND(
      (COUNT(*) FILTER (WHERE status = 'present')::numeric / 
       NULLIF(COUNT(*), 0) * 100), 2
    ) as attendance_percentage
  INTO attendance_stats
  FROM attendance_records
  WHERE student_id = p_student_id
  AND date >= (CURRENT_DATE - INTERVAL '3 months'); -- Approximate term length
  
  attendance_summary := jsonb_build_object(
    'total_sessions', COALESCE(attendance_stats.total_sessions, 0),
    'present_count', COALESCE(attendance_stats.present_count, 0),
    'absent_count', COALESCE(attendance_stats.absent_count, 0),
    'late_count', COALESCE(attendance_stats.late_count, 0),
    'percentage', COALESCE(attendance_stats.attendance_percentage, 0)
  );
  
  -- Return compiled data
  RETURN jsonb_build_object(
    'student_info', row_to_json(student_info),
    'grades', grades_array,
    'attendance', attendance_summary,
    'coverage', coverage_summary,
    'generated_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default comment bank templates
INSERT INTO public.comment_bank (school_id, subject, grade_level, comment_template, category, created_by) VALUES
-- Mathematics comments
(gen_random_uuid(), 'Mathematics', 'GDS', '{{$name}} is working at Greater Depth in Mathematics. {{$he_she}} confidently applies mathematical concepts and explains {{$his_her}} reasoning clearly.', 'academic', gen_random_uuid()),
(gen_random_uuid(), 'Mathematics', 'WA', '{{$name}} is working at age-related expectations in Mathematics. With continued practice, {{$he_she}} will deepen {{$his_her}} understanding of key concepts.', 'academic', gen_random_uuid()),
(gen_random_uuid(), 'Mathematics', 'WT', '{{$name}} is working towards age-related expectations in Mathematics. Targeted support is helping {{$him_her}} build core mathematical skills.', 'academic', gen_random_uuid()),

-- English comments  
(gen_random_uuid(), 'English', 'GDS', '{{$name}} demonstrates exceptional ability in English. {{$he_she}} reads with fluency and writes with creativity and technical accuracy.', 'academic', gen_random_uuid()),
(gen_random_uuid(), 'English', 'WA', '{{$name}} is working at age-related expectations in English. {{$he_she}} shows good comprehension skills and writes clearly.', 'academic', gen_random_uuid()),
(gen_random_uuid(), 'English', 'WT', '{{$name}} is working towards age-related expectations in English. {{$he_she}} is making steady progress with reading and writing skills.', 'academic', gen_random_uuid()),

-- Science comments
(gen_random_uuid(), 'Science', 'GDS', '{{$name}} shows excellent scientific understanding. {{$he_she}} asks thoughtful questions and demonstrates deep knowledge of scientific concepts.', 'academic', gen_random_uuid()),
(gen_random_uuid(), 'Science', 'WA', '{{$name}} is working at age-related expectations in Science. {{$he_she}} engages well with practical investigations and shows good understanding.', 'academic', gen_random_uuid()),
(gen_random_uuid(), 'Science', 'WT', '{{$name}} is working towards age-related expectations in Science. With support, {{$he_she}} is developing {{$his_her}} scientific knowledge and skills.', 'academic', gen_random_uuid())

ON CONFLICT (school_id, subject, grade_level, category) DO NOTHING;