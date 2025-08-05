-- Fix RLS policies for report_cards table (which broke after revert)
CREATE POLICY "Teachers can manage their class report cards" 
ON public.report_cards 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = report_cards.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Students can view their own report cards" 
ON public.report_cards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.id = report_cards.student_id 
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Parents can view their children's report cards" 
ON public.report_cards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM student_parents sp
    WHERE sp.student_id = report_cards.student_id 
    AND sp.parent_id = auth.uid()
  )
);

-- Add missing RLS policies for enrollment_applications table
CREATE POLICY "School staff can manage enrollment applications" 
ON public.enrollment_applications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = enrollment_applications.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);