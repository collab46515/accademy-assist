-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  attachment_urls TEXT[],
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('homework', 'classwork', 'project', 'assessment')),
  curriculum_topic_id UUID,
  lesson_plan_id UUID,
  subject TEXT NOT NULL,
  year_group TEXT NOT NULL,
  created_by UUID NOT NULL,
  school_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  submission_type TEXT NOT NULL DEFAULT 'both' CHECK (submission_type IN ('file_upload', 'text_entry', 'both')),
  allow_late_submissions BOOLEAN DEFAULT true,
  late_penalty_percentage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignment_submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE,
  submission_text TEXT,
  attachment_urls TEXT[],
  marks_awarded INTEGER,
  feedback TEXT,
  voice_feedback_url TEXT,
  graded_by UUID,
  graded_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'not_submitted' CHECK (status IN ('not_submitted', 'in_progress', 'submitted', 'graded', 'late', 'returned')),
  is_late BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "School staff can manage assignments"
ON public.assignments
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = assignments.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

CREATE POLICY "Students can view published assignments"
ON public.assignments
FOR SELECT
USING (
  status = 'published' AND (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.user_id = auth.uid()
      AND s.school_id = assignments.school_id
      AND s.year_group = assignments.year_group
    )
  )
);

-- RLS Policies for assignment_submissions
CREATE POLICY "Teachers can manage all submissions"
ON public.assignment_submissions
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM assignments a
    JOIN user_roles ur ON ur.school_id = a.school_id
    WHERE a.id = assignment_submissions.assignment_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

CREATE POLICY "Students can view own submissions"
ON public.assignment_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = assignment_submissions.student_id
  )
);

CREATE POLICY "Students can create own submissions"
ON public.assignment_submissions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = assignment_submissions.student_id
  )
);

CREATE POLICY "Students can update own submissions"
ON public.assignment_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = assignment_submissions.student_id
  ) AND status IN ('not_submitted', 'in_progress')
);

-- Create indexes for performance
CREATE INDEX idx_assignments_school_id ON public.assignments(school_id);
CREATE INDEX idx_assignments_created_by ON public.assignments(created_by);
CREATE INDEX idx_assignments_status ON public.assignments(status);
CREATE INDEX idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student_id ON public.assignment_submissions(student_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_submissions_updated_at
BEFORE UPDATE ON public.assignment_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();