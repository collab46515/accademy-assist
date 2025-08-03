-- Add pathway-specific fields to enrollment_applications table
ALTER TABLE public.enrollment_applications 
ADD COLUMN IF NOT EXISTS pathway_data jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS draft_data jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_draft boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS progress_step integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_steps integer DEFAULT 6,
ADD COLUMN IF NOT EXISTS auto_saved_at timestamp with time zone DEFAULT now();

-- Create enrollment_documents table for file uploads
CREATE TABLE IF NOT EXISTS public.enrollment_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES public.enrollment_applications(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_name text NOT NULL,
  file_path text,
  file_size integer,
  mime_type text,
  is_required boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  uploaded_by uuid,
  verified_by uuid,
  uploaded_at timestamp with time zone DEFAULT now(),
  verified_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'
);

-- Enable RLS on enrollment_documents
ALTER TABLE public.enrollment_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for enrollment_documents
CREATE POLICY "Users can view documents for their applications" 
ON public.enrollment_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = enrollment_documents.application_id 
    AND (ea.submitted_by = auth.uid() OR has_permission(auth.uid(), ea.school_id, 'admissions', 'read'))
  )
);

CREATE POLICY "Users can upload documents for their applications" 
ON public.enrollment_documents 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = enrollment_documents.application_id 
    AND (ea.submitted_by = auth.uid() OR has_permission(auth.uid(), ea.school_id, 'admissions', 'write'))
  )
);

CREATE POLICY "Admins can manage all documents" 
ON public.enrollment_documents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = enrollment_documents.application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions', 'write')
  )
);

-- Create storage bucket for enrollment documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('enrollment-docs', 'enrollment-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for enrollment documents
CREATE POLICY "Users can upload enrollment documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'enrollment-docs' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view their enrollment documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'enrollment-docs' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Admins can manage all enrollment documents" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'enrollment-docs' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('super_admin', 'school_admin', 'dsl') 
    AND ur.is_active = true
  )
);

-- Add trigger for updated_at on enrollment_applications
CREATE OR REPLACE FUNCTION update_enrollment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.auto_saved_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrollment_applications_updated_at
  BEFORE UPDATE ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollment_applications_pathway ON public.enrollment_applications(pathway);
CREATE INDEX IF NOT EXISTS idx_enrollment_applications_status ON public.enrollment_applications(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_applications_school_pathway ON public.enrollment_applications(school_id, pathway);
CREATE INDEX IF NOT EXISTS idx_enrollment_applications_draft ON public.enrollment_applications(is_draft);
CREATE INDEX IF NOT EXISTS idx_enrollment_documents_application ON public.enrollment_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_documents_type ON public.enrollment_documents(document_type);