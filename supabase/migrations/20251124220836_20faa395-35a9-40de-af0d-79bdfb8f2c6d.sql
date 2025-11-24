
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view documents for applications in their school" ON application_documents;
DROP POLICY IF EXISTS "Users can upload documents for applications in their school" ON application_documents;
DROP POLICY IF EXISTS "Users can update documents for applications in their school" ON application_documents;
DROP POLICY IF EXISTS "Users can delete documents for applications in their school" ON application_documents;

-- Create updated RLS policies for application_documents table
-- Allow super_admins and users to view documents for applications in their school
CREATE POLICY "Users can view documents for applications in their school"
ON application_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (
      user_roles.role = 'super_admin'
      OR user_roles.school_id IN (
        SELECT school_id FROM enrollment_applications
        WHERE enrollment_applications.id = application_documents.application_id
      )
    )
  )
);

-- Allow super_admins and users to insert documents for applications in their school
CREATE POLICY "Users can upload documents for applications in their school"
ON application_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (
      user_roles.role = 'super_admin'
      OR user_roles.school_id IN (
        SELECT school_id FROM enrollment_applications
        WHERE enrollment_applications.id = application_documents.application_id
      )
    )
  )
);

-- Allow super_admins and users to update documents for applications in their school
CREATE POLICY "Users can update documents for applications in their school"
ON application_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (
      user_roles.role = 'super_admin'
      OR user_roles.school_id IN (
        SELECT school_id FROM enrollment_applications
        WHERE enrollment_applications.id = application_documents.application_id
      )
    )
  )
);

-- Allow super_admins and users to delete documents for applications in their school
CREATE POLICY "Users can delete documents for applications in their school"
ON application_documents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND (
      user_roles.role = 'super_admin'
      OR user_roles.school_id IN (
        SELECT school_id FROM enrollment_applications
        WHERE enrollment_applications.id = application_documents.application_id
      )
    )
  )
);
