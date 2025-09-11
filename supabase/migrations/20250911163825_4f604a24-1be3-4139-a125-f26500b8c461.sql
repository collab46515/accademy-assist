-- Create application_notes table for storing notes on enrollment applications
CREATE TABLE public.application_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Staff',
  category TEXT DEFAULT 'General',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for application notes
CREATE POLICY "School staff can manage application notes"
ON public.application_notes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = application_notes.application_id
      AND ur.user_id = auth.uid()
      AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create index for performance
CREATE INDEX idx_application_notes_application_id ON public.application_notes(application_id);

-- Add foreign key constraint (if enrollment_applications exists)
ALTER TABLE public.application_notes 
ADD CONSTRAINT fk_application_notes_application_id 
FOREIGN KEY (application_id) REFERENCES public.enrollment_applications(id) ON DELETE CASCADE;

-- Add trigger for updated_at
CREATE TRIGGER update_application_notes_updated_at
  BEFORE UPDATE ON public.application_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();