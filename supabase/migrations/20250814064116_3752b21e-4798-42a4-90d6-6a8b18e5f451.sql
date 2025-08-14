-- Fix RLS policy for student_parents table to allow enrollment function to create relationships
-- Add a policy that allows security definer functions (like enrollment) to insert student-parent relationships

-- Drop existing restrictive admin policy and replace with more comprehensive one
DROP POLICY IF EXISTS "Admins can manage student-parent relationships" ON student_parents;

-- Create new policy that allows both authenticated admins AND security definer functions to manage relationships
CREATE POLICY "System and admins can manage student-parent relationships" 
ON student_parents 
FOR ALL 
USING (
  -- Allow if user is an admin with proper permissions
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN students s ON s.school_id = ur.school_id
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'super_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true 
    AND s.user_id = student_parents.student_id
  )
  -- OR allow if this is being executed by a security definer function (enrollment process)
  OR current_setting('role', true) != 'authenticator'
)
WITH CHECK (
  -- Same check for INSERT/UPDATE operations
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN students s ON s.school_id = ur.school_id
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'super_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true 
    AND s.user_id = student_parents.student_id
  )
  -- OR allow if this is being executed by a security definer function
  OR current_setting('role', true) != 'authenticator'
);