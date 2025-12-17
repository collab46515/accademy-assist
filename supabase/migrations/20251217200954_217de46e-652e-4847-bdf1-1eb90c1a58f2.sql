DROP POLICY IF EXISTS "Super admins can manage attendance summaries" ON public.attendance_session_summaries;

CREATE POLICY "Super admins can manage attendance summaries"
ON public.attendance_session_summaries
FOR ALL
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));