-- Create exam_results table to store student exam results
CREATE TABLE public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  marks_obtained NUMERIC,
  total_marks NUMERIC NOT NULL,
  percentage NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN total_marks > 0 THEN ROUND((marks_obtained / total_marks) * 100, 2)
      ELSE 0 
    END
  ) STORED,
  grade TEXT,
  rank INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID,
  graded_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  is_absent BOOLEAN DEFAULT false,
  absence_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Create policies for exam_results
CREATE POLICY "Students can view their own results"
ON public.exam_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid() AND s.id = exam_results.student_id
  )
);

CREATE POLICY "Parents can view their children's results"
ON public.exam_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_parents sp
    WHERE sp.parent_id = auth.uid() AND sp.student_id = exam_results.student_id
  )
);

CREATE POLICY "Teachers can manage results for their school"
ON public.exam_results
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM exams e
    JOIN user_roles ur ON (ur.school_id = e.school_id)
    WHERE e.id = exam_results.exam_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create exam_students table to track which students are enrolled in exams
CREATE TABLE public.exam_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  enrolled_by UUID,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(exam_id, student_id)
);

-- Enable RLS
ALTER TABLE public.exam_students ENABLE ROW LEVEL SECURITY;

-- Create policies for exam_students
CREATE POLICY "Students can view their exam enrollments"
ON public.exam_students
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid() AND s.id = exam_students.student_id
  )
);

CREATE POLICY "Teachers can manage exam enrollments"
ON public.exam_students
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM exams e
    JOIN user_roles ur ON (ur.school_id = e.school_id)
    WHERE e.id = exam_students.exam_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Add updated_at trigger for both tables
CREATE TRIGGER update_exam_results_updated_at
BEFORE UPDATE ON public.exam_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_exam_results_exam_id ON public.exam_results(exam_id);
CREATE INDEX idx_exam_results_student_id ON public.exam_results(student_id);
CREATE INDEX idx_exam_students_exam_id ON public.exam_students(exam_id);
CREATE INDEX idx_exam_students_student_id ON public.exam_students(student_id);