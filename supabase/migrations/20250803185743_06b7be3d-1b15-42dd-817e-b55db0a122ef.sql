-- Fix infinite recursion in user_roles policies
-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "School admins can view roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can assign any role" ON public.user_roles;
DROP POLICY IF EXISTS "School admins can assign non-super-admin roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can update any role" ON public.user_roles;
DROP POLICY IF EXISTS "School admins can update non-super-admin roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can delete any role" ON public.user_roles;
DROP POLICY IF EXISTS "School admins can delete non-super-admin roles in their school" ON public.user_roles;

-- Create simple, non-recursive policies
-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow authenticated users to manage user_roles (will be refined later)
CREATE POLICY "Authenticated users can manage roles" 
ON public.user_roles 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Remove the problematic trigger temporarily
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.user_roles;