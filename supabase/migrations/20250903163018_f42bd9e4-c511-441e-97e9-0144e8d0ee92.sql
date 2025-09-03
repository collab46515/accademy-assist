-- Temporarily allow authenticated users to create exams for any school for testing
DROP POLICY IF EXISTS "Users can create exams for their school" ON public.exams;

CREATE POLICY "Authenticated users can create exams" 
ON public.exams 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Also update the select policy to be more permissive
DROP POLICY IF EXISTS "Users can view exams from their school" ON public.exams;

CREATE POLICY "Authenticated users can view exams" 
ON public.exams 
FOR SELECT 
USING (auth.uid() IS NOT NULL);