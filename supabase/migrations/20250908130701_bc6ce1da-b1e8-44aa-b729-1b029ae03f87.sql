-- Fix Master Data by avoiding duplicate policies and properly enabling student creation

-- First, let's make user_id nullable for students so Master Data creation works
ALTER TABLE students ALTER COLUMN user_id DROP NOT NULL;

-- Check existing policies and add missing ones
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students; 
DROP POLICY IF EXISTS "Admins can delete students" ON students;

-- Add comprehensive students management policies
CREATE POLICY "Admins can insert students" ON students
FOR INSERT 
WITH CHECK (
  is_super_admin(auth.uid())
  OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = students.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

CREATE POLICY "Admins can update students" ON students
FOR UPDATE
USING (
  is_super_admin(auth.uid()) 
  OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = students.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
)
WITH CHECK (
  is_super_admin(auth.uid())
  OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = students.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

CREATE POLICY "Admins can delete students" ON students
FOR DELETE
USING (
  is_super_admin(auth.uid()) 
  OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = students.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Test student creation
INSERT INTO students (
  school_id, 
  student_number,
  year_group,
  form_class,
  is_enrolled
) VALUES (
  '2f21656b-0848-40ee-bbec-12e5e8137545',
  'TEST001',
  'Year 7',
  '7A', 
  true
) RETURNING id, student_number;

-- Test class creation  
INSERT INTO classes (
  school_id,
  class_name,
  year_group,
  capacity,
  current_enrollment,
  is_active,
  academic_year
) VALUES (
  '2f21656b-0848-40ee-bbec-12e5e8137545',
  'Test Class 7A',
  'Year 7',
  30,
  0,
  true,
  '2024-2025'
) RETURNING id, class_name;