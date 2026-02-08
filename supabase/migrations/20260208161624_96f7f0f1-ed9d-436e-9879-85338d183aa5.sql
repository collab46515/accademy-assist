-- Drop the existing policy that's missing WITH CHECK
DROP POLICY "School staff can manage assignments" ON public.assignments;

-- Recreate with proper WITH CHECK clause for INSERT/UPDATE
CREATE POLICY "School staff can manage assignments"
ON public.assignments
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = assignments.school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = assignments.school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);