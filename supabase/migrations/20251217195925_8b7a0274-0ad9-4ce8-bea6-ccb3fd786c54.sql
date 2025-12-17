-- Drop existing policies
DROP POLICY IF EXISTS "Teachers and admins can insert attendance summaries" ON attendance_session_summaries;
DROP POLICY IF EXISTS "Teachers and admins can update attendance summaries" ON attendance_session_summaries;

-- Create updated INSERT policy that allows global super_admins
CREATE POLICY "Teachers and admins can insert attendance summaries" 
ON attendance_session_summaries 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.is_active = true
    AND (
      (ur.school_id = attendance_session_summaries.school_id AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin'))
      OR (ur.school_id IS NULL AND ur.role = 'super_admin')
    )
  )
);

-- Create updated UPDATE policy that allows global super_admins
CREATE POLICY "Teachers and admins can update attendance summaries" 
ON attendance_session_summaries 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.is_active = true
    AND (
      (ur.school_id = attendance_session_summaries.school_id AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin'))
      OR (ur.school_id IS NULL AND ur.role = 'super_admin')
    )
  )
);