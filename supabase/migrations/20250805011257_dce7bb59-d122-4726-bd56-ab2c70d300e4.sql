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

-- Add missing RLS policies for other tables that need them
-- Check if enrollment_applications table exists and add policies
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

-- Add missing RLS policies for emergency_contacts table
CREATE POLICY "School staff can manage emergency contacts" 
ON public.emergency_contacts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN user_roles ur ON ur.school_id = s.school_id
    WHERE s.id = emergency_contacts.student_id
    AND ur.user_id = auth.uid() 
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Parents can view their children's emergency contacts" 
ON public.emergency_contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM student_parents sp
    WHERE sp.student_id = emergency_contacts.student_id 
    AND sp.parent_id = auth.uid()
  )
);