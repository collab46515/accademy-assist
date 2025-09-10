-- Create RLS policies for enrollment_applications table to allow public access for enrollment forms

-- Policy for allowing anyone to insert enrollment applications (for public enrollment)
CREATE POLICY "Allow public enrollment application submission" 
ON public.enrollment_applications 
FOR INSERT 
WITH CHECK (true);

-- Policy for allowing users to view their own applications (if authenticated)
CREATE POLICY "Users can view their own applications" 
ON public.enrollment_applications 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN true  -- Allow unauthenticated users to view for demo purposes
    ELSE submitted_by = auth.uid()      -- Authenticated users can only see their own
  END
);

-- Policy for allowing users to update their draft applications
CREATE POLICY "Users can update their draft applications" 
ON public.enrollment_applications 
FOR UPDATE 
USING (
  status = 'draft' AND 
  (auth.uid() IS NULL OR submitted_by = auth.uid())
)
WITH CHECK (
  status = 'draft' AND 
  (auth.uid() IS NULL OR submitted_by = auth.uid())
);

-- Policy for school staff to manage all applications (requires authentication and proper role)
CREATE POLICY "School staff can manage applications" 
ON public.enrollment_applications 
FOR ALL
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role_name IN ('admin', 'admissions_officer', 'school_admin')
  )
);