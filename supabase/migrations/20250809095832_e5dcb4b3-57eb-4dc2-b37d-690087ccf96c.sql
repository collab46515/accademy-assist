-- Create storage bucket for application documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'application-documents', 
  'application-documents', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create storage policies for application documents
CREATE POLICY "Authenticated users can upload their documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "School staff can view all documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'application-documents' 
  AND EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "School staff can update documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'application-documents' 
  AND EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  )
);

-- Create application_documents table to track document metadata
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on application_documents
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for application_documents
CREATE POLICY "Users can upload documents for their applications" 
ON application_documents 
FOR INSERT 
WITH CHECK (
  uploaded_by = auth.uid()
);

CREATE POLICY "Users can view documents they uploaded" 
ON application_documents 
FOR SELECT 
USING (
  uploaded_by = auth.uid()
);

CREATE POLICY "School staff can manage all documents" 
ON application_documents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_application_documents_updated_at
  BEFORE UPDATE ON application_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();