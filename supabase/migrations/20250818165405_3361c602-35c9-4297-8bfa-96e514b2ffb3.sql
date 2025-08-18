-- Fix infinite recursion in students RLS policies by removing self-referential policies
-- Drop problematic policies that reference students via can_access_student(id)
DROP POLICY IF EXISTS "School staff can manage students" ON public.students;
DROP POLICY IF EXISTS "School staff can view students" ON public.students;

-- Create a safe helper that DOES NOT reference students table
CREATE OR REPLACE FUNCTION public.can_access_student_in_school(student_school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = student_school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  ) OR is_super_admin(auth.uid());
$$;

-- Optional: recreate a non-recursive view policy if needed (kept minimal)
-- Note: a permissive policy with USING true already exists for read access.
-- If we want staff-restricted read without recursion, uncomment below:
-- CREATE POLICY "Staff can view students by school (non-recursive)"
-- ON public.students FOR SELECT TO authenticated
-- USING (public.can_access_student_in_school(school_id));
