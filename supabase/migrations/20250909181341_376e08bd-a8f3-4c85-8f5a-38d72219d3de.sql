-- Add RLS policies for employees table to allow proper CRUD operations
DROP POLICY IF EXISTS "Authenticated users can access employees" ON employees;

CREATE POLICY "HR can manage employees" ON employees
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role])
    AND ur.is_active = true
  )
);

-- Ensure enrollment applications can be submitted properly
CREATE POLICY "Users can submit their own applications" ON enrollment_applications
FOR INSERT
WITH CHECK (
  submitted_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = enrollment_applications.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role])
    AND ur.is_active = true
  )
);