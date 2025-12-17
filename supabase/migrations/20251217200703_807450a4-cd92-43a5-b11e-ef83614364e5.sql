-- Use security definer helper to avoid RLS visibility issues when policies query user_roles
CREATE OR REPLACE FUNCTION public.can_manage_attendance_summary(target_school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.school_id = target_school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role,'school_admin'::app_role,'hod'::app_role,'super_admin'::app_role])
  )
  OR public.is_super_admin(auth.uid());
$$;

-- Replace policies to use the helper
DROP POLICY IF EXISTS "Teachers and admins can insert attendance summaries" ON public.attendance_session_summaries;
DROP POLICY IF EXISTS "Teachers and admins can update attendance summaries" ON public.attendance_session_summaries;

CREATE POLICY "Teachers and admins can insert attendance summaries"
ON public.attendance_session_summaries
FOR INSERT
WITH CHECK (public.can_manage_attendance_summary(school_id));

CREATE POLICY "Teachers and admins can update attendance summaries"
ON public.attendance_session_summaries
FOR UPDATE
USING (public.can_manage_attendance_summary(school_id))
WITH CHECK (public.can_manage_attendance_summary(school_id));