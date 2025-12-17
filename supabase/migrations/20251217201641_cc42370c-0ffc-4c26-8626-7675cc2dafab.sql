-- Fix SELECT policy to include super admins
DROP POLICY IF EXISTS "Users can view attendance summaries for their school" ON public.attendance_session_summaries;

CREATE POLICY "Users can view attendance summaries for their school"
ON public.attendance_session_summaries
FOR SELECT
USING (
  public.is_super_admin(auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = attendance_session_summaries.school_id
      AND ur.is_active = true
  )
);