-- Create gradebook_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.gradebook_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_id UUID,
  assessment_id UUID,
  grade_text TEXT NOT NULL,
  grade_points NUMERIC,
  percentage NUMERIC,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('assignment', 'exam', 'quiz', 'project', 'coursework')),
  subject TEXT NOT NULL,
  year_group TEXT NOT NULL,
  term TEXT NOT NULL,
  recorded_by UUID NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, topic_id)
);

-- Enable RLS
ALTER TABLE public.gradebook_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gradebook_records
CREATE POLICY "Teachers can manage gradebook records"
ON public.gradebook_records
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

CREATE POLICY "Students can view their own gradebook records"
ON public.gradebook_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = gradebook_records.student_id
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gradebook_records_student_id ON public.gradebook_records(student_id);
CREATE INDEX IF NOT EXISTS idx_gradebook_records_topic_id ON public.gradebook_records(topic_id);
CREATE INDEX IF NOT EXISTS idx_gradebook_records_assessment_id ON public.gradebook_records(assessment_id);

-- Create updated_at trigger
CREATE TRIGGER update_gradebook_records_updated_at
BEFORE UPDATE ON public.gradebook_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();