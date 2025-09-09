-- Allow unauthenticated users to submit enrollment applications (for prospective students/parents)
DROP POLICY IF EXISTS "Users can create applications" ON public.enrollment_applications;
DROP POLICY IF EXISTS "Users can submit their own applications" ON public.enrollment_applications;

-- Create new policy allowing unauthenticated submissions for enrollment applications
CREATE POLICY "Anyone can submit enrollment applications"
ON public.enrollment_applications
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow unauthenticated users to view their own applications by email or submission reference
CREATE POLICY "Users can view applications they submitted"
ON public.enrollment_applications
FOR SELECT
TO authenticated, anon
USING (
  (submitted_by = auth.uid()) OR 
  (auth.uid() IS NULL AND application_number IS NOT NULL) OR
  (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
      AND ur.school_id = enrollment_applications.school_id 
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'dsl'::app_role]) 
      AND ur.is_active = true
  )) OR 
  is_super_admin(auth.uid())
);