-- Fix all Master Data RLS policies for comprehensive functionality

-- 1. ADD MISSING STUDENTS POLICIES (only had SELECT policies!)
CREATE POLICY "Super admins can insert students" ON students
FOR INSERT 
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Admins can manage students" ON students
FOR ALL
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

-- 2. FIX CLASSES POLICIES (ensure super_admin can create)
DROP POLICY IF EXISTS "Admins can manage classes" ON classes;

CREATE POLICY "Admins can manage classes" ON classes
FOR ALL
USING (
  is_super_admin(auth.uid()) 
  OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = classes.school_id
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
    AND ur.school_id = classes.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- 3. ADD SUPER ADMIN INSERT POLICY FOR CLASSES
CREATE POLICY "Super admins can insert classes" ON classes
FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));

-- 4. CREATE A SIMPLIFIED APPROACH FOR STUDENT CREATION
-- Instead of linking to auth.users, we'll make user_id nullable temporarily
-- and add proper student management later

ALTER TABLE students ALTER COLUMN user_id DROP NOT NULL;

-- 5. TEST INSERTIONS
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