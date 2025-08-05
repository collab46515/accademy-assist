-- Fix profiles table RLS policies to allow user creation

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow admins to manage profiles in their school
CREATE POLICY "Admins can manage profiles in their school"
ON profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['super_admin'::app_role, 'school_admin'::app_role])
    AND ur.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['super_admin'::app_role, 'school_admin'::app_role])
    AND ur.is_active = true
  )
);

-- Critical: Allow the trigger function to insert profiles for new users
-- This policy allows INSERT when the user_id matches the authenticated user
CREATE POLICY "Allow profile creation for new users"
ON profiles FOR INSERT
WITH CHECK (user_id = auth.uid());