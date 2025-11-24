-- Create RLS policies for application_documents table
-- Allow users to view documents for applications in their school
CREATE POLICY "Users can view documents for applications in their school"
ON application_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications
    WHERE enrollment_applications.id = application_documents.application_id
    AND enrollment_applications.school_id IN (
      SELECT school_id FROM user_roles WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to insert documents for applications in their school
CREATE POLICY "Users can upload documents for applications in their school"
ON application_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enrollment_applications
    WHERE enrollment_applications.id = application_documents.application_id
    AND enrollment_applications.school_id IN (
      SELECT school_id FROM user_roles WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to update documents for applications in their school
CREATE POLICY "Users can update documents for applications in their school"
ON application_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications
    WHERE enrollment_applications.id = application_documents.application_id
    AND enrollment_applications.school_id IN (
      SELECT school_id FROM user_roles WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to delete documents for applications in their school
CREATE POLICY "Users can delete documents for applications in their school"
ON application_documents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications
    WHERE enrollment_applications.id = application_documents.application_id
    AND enrollment_applications.school_id IN (
      SELECT school_id FROM user_roles WHERE user_id = auth.uid()
    )
  )
);