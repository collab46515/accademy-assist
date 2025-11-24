
-- Add RLS policy to allow authenticated users to update document status for verification
-- This allows anyone authenticated to verify documents (can be restricted later if needed)
CREATE POLICY "Authenticated users can verify documents"
ON application_documents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Alternative: If you want only staff to verify, use this instead:
-- CREATE POLICY "Staff can verify documents"
-- ON application_documents
-- FOR UPDATE
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM user_roles ur
--     WHERE ur.user_id = auth.uid()
--     AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin')
--     AND ur.is_active = true
--   )
-- )
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM user_roles ur
--     WHERE ur.user_id = auth.uid()
--     AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin')
--     AND ur.is_active = true
--   )
-- );
