-- Fix RLS policies for timetable viewing

-- Allow users to view classes for timetable purposes
CREATE POLICY "Users can view classes for timetable"
ON public.classes
FOR SELECT
TO authenticated
USING (
  -- Super admins can see everything
  is_super_admin(auth.uid()) OR 
  -- School staff can see classes in their school
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = classes.school_id 
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'student', 'parent')
    AND (ur.is_active IS TRUE OR ur.is_active IS NULL)
  )
);

-- Allow users to view students for timetable class selection
CREATE POLICY "Users can view students for timetables"
ON public.students  
FOR SELECT
TO authenticated
USING (
  -- Super admins can see everything
  is_super_admin(auth.uid()) OR
  -- School staff can see students in their school
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = students.school_id 
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'student', 'parent')
    AND (ur.is_active IS TRUE OR ur.is_active IS NULL)
  ) OR
  -- Students can view their own record
  students.user_id = auth.uid() OR
  -- Parents can view their children
  EXISTS (
    SELECT 1 FROM student_parents sp 
    WHERE sp.student_id = students.id 
    AND sp.parent_id = auth.uid()
  )
);

-- Ensure timetable entries are viewable for class selection
-- (This should already exist but making sure)
DROP POLICY IF EXISTS "Users can view timetable entries" ON public.timetable_entries;
CREATE POLICY "Users can view timetable entries"
ON public.timetable_entries
FOR SELECT  
TO authenticated
USING (
  -- Super admins can see everything
  is_super_admin(auth.uid()) OR
  -- School staff can see entries in their school
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = timetable_entries.school_id 
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'student', 'parent')
    AND (ur.is_active IS TRUE OR ur.is_active IS NULL)
  )
);