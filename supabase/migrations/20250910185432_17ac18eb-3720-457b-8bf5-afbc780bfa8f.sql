-- Create simplified RLS policies for enrollment_applications table

-- Policy for allowing anyone to insert enrollment applications (for public enrollment)
CREATE POLICY "Allow public enrollment application submission" 
ON public.enrollment_applications 
FOR INSERT 
WITH CHECK (true);

-- Policy for allowing anyone to view applications (for demo purposes)
CREATE POLICY "Allow public access to view applications" 
ON public.enrollment_applications 
FOR SELECT 
USING (true);

-- Policy for allowing updates to draft applications
CREATE POLICY "Allow updates to draft applications" 
ON public.enrollment_applications 
FOR UPDATE 
USING (status = 'draft')
WITH CHECK (status = 'draft');