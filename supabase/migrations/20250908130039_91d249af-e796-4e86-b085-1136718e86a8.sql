-- Fix subjects RLS policy to properly handle super_admin users
-- The current policy fails because super_admin users have school_id = NULL
-- but the policy tries to match ur.school_id = subjects.school_id

DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;

-- Create new policy that handles super_admin users correctly
CREATE POLICY "Admins can manage subjects" ON subjects
FOR ALL
USING (
  -- Super admins can access any subject
  is_super_admin(auth.uid()) 
  OR 
  -- School admins/HODs can only access subjects in their school
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = subjects.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
)
WITH CHECK (
  -- Super admins can create subjects for any school
  is_super_admin(auth.uid())
  OR 
  -- School admins/HODs can only create subjects in their school
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = subjects.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Also create an INSERT-specific policy for super admins to create subjects
CREATE POLICY "Super admins can insert subjects" ON subjects
FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));