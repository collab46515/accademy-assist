-- Fix RLS policy for attendance_records to allow super_admin users
DROP POLICY IF EXISTS "Teachers can mark attendance" ON attendance_records;

CREATE POLICY "Teachers can mark attendance" 
ON attendance_records 
FOR INSERT 
WITH CHECK (
  (teacher_id = auth.uid()) AND 
  (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = attendance_records.school_id 
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
      AND ur.is_active = true
    ) 
    OR is_super_admin(auth.uid())
  )
);