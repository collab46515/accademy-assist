-- Create report_cards table
CREATE TABLE public.report_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  academic_year TEXT NOT NULL,
  term TEXT NOT NULL,
  year_group TEXT NOT NULL,
  class_name TEXT,
  teacher_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  grades JSONB DEFAULT '[]'::jsonb,
  attendance_data JSONB DEFAULT '{}'::jsonb,
  behavior_comments TEXT,
  areas_for_development TEXT[],
  targets TEXT[],
  teacher_comments TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own report cards" 
ON public.report_cards 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can create report cards" 
ON public.report_cards 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can update report cards" 
ON public.report_cards 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can delete draft report cards" 
ON public.report_cards 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND status = 'draft');

-- Function to generate comprehensive report card data
CREATE OR REPLACE FUNCTION public.generate_comprehensive_report_card_data(
  p_student_id UUID,
  p_academic_year TEXT,
  p_term TEXT
)
RETURNS JSONB AS $$
DECLARE
  report_data JSONB := '{}';
  grades_data JSONB := '[]';
  attendance_data JSONB := '{}';
  student_info JSONB;
BEGIN
  -- Get student information
  SELECT to_jsonb(s.*) INTO student_info
  FROM public.students s
  WHERE s.id = p_student_id;
  
  -- Get grades from gradebook_records
  SELECT jsonb_agg(
    jsonb_build_object(
      'subject', gr.subject,
      'assignment_type', gr.assignment_type,
      'grade', gr.grade,
      'percentage', gr.percentage,
      'effort', COALESCE(gr.effort, 'Good'),
      'comments', gr.comments,
      'date_recorded', gr.date_recorded
    )
  ) INTO grades_data
  FROM public.gradebook_records gr
  WHERE gr.student_id = p_student_id
    AND gr.academic_year = p_academic_year
    AND gr.term = p_term;
  
  -- Get attendance data
  SELECT jsonb_build_object(
    'total_days', COUNT(*),
    'present_days', COUNT(*) FILTER (WHERE status = 'present'),
    'absent_days', COUNT(*) FILTER (WHERE status = 'absent'),
    'late_days', COUNT(*) FILTER (WHERE status = 'late'),
    'attendance_percentage', 
      CASE 
        WHEN COUNT(*) > 0 THEN 
          ROUND((COUNT(*) FILTER (WHERE status = 'present')::numeric / COUNT(*)::numeric) * 100, 1)
        ELSE 0 
      END
  ) INTO attendance_data
  FROM public.attendance_records ar
  WHERE ar.student_id = p_student_id
    AND ar.academic_year = p_academic_year
    AND ar.term = p_term;
  
  -- Combine all data
  report_data := jsonb_build_object(
    'student_info', student_info,
    'grades', COALESCE(grades_data, '[]'::jsonb),
    'attendance', COALESCE(attendance_data, '{}'::jsonb),
    'academic_year', p_academic_year,
    'term', p_term
  );
  
  RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create report card from compiled data
CREATE OR REPLACE FUNCTION public.create_report_card_from_data(
  p_student_id UUID,
  p_academic_year TEXT,
  p_term TEXT,
  p_year_group TEXT DEFAULT NULL,
  p_class_name TEXT DEFAULT NULL,
  p_teacher_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  report_id UUID;
  comprehensive_data JSONB;
  student_year_group TEXT;
  student_class TEXT;
BEGIN
  -- Generate comprehensive data
  comprehensive_data := public.generate_comprehensive_report_card_data(
    p_student_id, p_academic_year, p_term
  );
  
  -- Get student's year group and class if not provided
  IF p_year_group IS NULL OR p_class_name IS NULL THEN
    SELECT year_group, class INTO student_year_group, student_class
    FROM public.students
    WHERE id = p_student_id;
  END IF;
  
  -- Insert report card
  INSERT INTO public.report_cards (
    student_id,
    academic_year,
    term,
    year_group,
    class_name,
    teacher_name,
    grades,
    attendance_data,
    status
  ) VALUES (
    p_student_id,
    p_academic_year,
    p_term,
    COALESCE(p_year_group, student_year_group),
    COALESCE(p_class_name, student_class),
    p_teacher_name,
    comprehensive_data->'grades',
    comprehensive_data->'attendance',
    'draft'
  )
  RETURNING id INTO report_id;
  
  RETURN report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_report_cards_updated_at
BEFORE UPDATE ON public.report_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_report_cards_student_id ON public.report_cards(student_id);
CREATE INDEX idx_report_cards_academic_year_term ON public.report_cards(academic_year, term);
CREATE INDEX idx_report_cards_status ON public.report_cards(status);