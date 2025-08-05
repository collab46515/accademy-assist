-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);

-- Create grading rubrics table
CREATE TABLE public.grading_rubrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  point_scale JSONB NOT NULL DEFAULT '{"max": 4, "labels": ["Needs Improvement", "Developing", "Proficient", "Advanced"]}'::jsonb,
  is_template BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table for file uploads
CREATE TABLE public.student_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  assignment_id UUID,
  student_id UUID NOT NULL,
  submitted_by UUID NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'text',
  content TEXT,
  file_urls JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  processing_status TEXT DEFAULT 'pending',
  processed_content TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grading results table for detailed tracking
CREATE TABLE public.grading_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  assignment_id UUID,
  submission_id UUID NOT NULL,
  rubric_id UUID,
  graded_by UUID NOT NULL,
  grading_type TEXT NOT NULL DEFAULT 'ai',
  overall_grade TEXT,
  total_marks NUMERIC,
  max_marks NUMERIC,
  question_grades JSONB DEFAULT '[]'::jsonb,
  rubric_scores JSONB DEFAULT '[]'::jsonb,
  feedback JSONB DEFAULT '{}'::jsonb,
  class_analytics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class analytics table
CREATE TABLE public.class_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  assignment_id UUID NOT NULL,
  class_id TEXT NOT NULL,
  analytics_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  insights JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.grading_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for grading_rubrics
CREATE POLICY "School staff can manage rubrics" 
ON public.grading_rubrics 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = grading_rubrics.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS policies for student_submissions
CREATE POLICY "Students can create their own submissions" 
ON public.student_submissions 
FOR INSERT 
WITH CHECK (
  submitted_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid() AND s.id = student_submissions.student_id
  )
);

CREATE POLICY "School staff can view submissions" 
ON public.student_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = student_submissions.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Students can view their own submissions" 
ON public.student_submissions 
FOR SELECT 
USING (submitted_by = auth.uid());

-- RLS policies for grading_results
CREATE POLICY "School staff can manage grading results" 
ON public.grading_results 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = grading_results.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS policies for class_analytics
CREATE POLICY "School staff can view class analytics" 
ON public.class_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = class_analytics.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Storage policies for submissions bucket
CREATE POLICY "Students can upload their submissions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'submissions' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own submissions" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'submissions' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "School staff can view all submissions" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'submissions' AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  )
);

-- Add updated_at triggers
CREATE TRIGGER update_grading_rubrics_updated_at
  BEFORE UPDATE ON public.grading_rubrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_submissions_updated_at
  BEFORE UPDATE ON public.student_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grading_results_updated_at
  BEFORE UPDATE ON public.grading_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();