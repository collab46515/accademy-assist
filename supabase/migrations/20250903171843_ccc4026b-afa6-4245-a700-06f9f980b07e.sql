-- Safer cleanup of mock/demo data handling foreign key constraints

-- First, clean up dependent records that reference profiles
UPDATE enrollment_applications 
SET submitted_by = NULL 
WHERE submitted_by IN (
    SELECT user_id FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%'
);

UPDATE enrollment_applications 
SET created_by = NULL 
WHERE created_by IN (
    SELECT user_id FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%'
);

-- Clear HR demo data safely
DELETE FROM attendance_records_hr;
DELETE FROM leave_requests;
DELETE FROM payroll_records;
DELETE FROM time_entries;
DELETE FROM expense_reports;
DELETE FROM travel_requests;
DELETE FROM performance_goals;
DELETE FROM performance_reviews;
DELETE FROM job_postings;
DELETE FROM job_applications;
DELETE FROM training_courses;
DELETE FROM training_enrollments;
DELETE FROM benefit_plans;
DELETE FROM company_assets;
DELETE FROM projects;
DELETE FROM engagement_surveys;
DELETE FROM onboarding_progress;
DELETE FROM background_checks;

-- Clear demo employees
DELETE FROM employees WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%';

-- Clear demo student data  
DELETE FROM students WHERE school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';
DELETE FROM student_parents WHERE parent_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%@demo.school.com'
);

-- Clear demo school
DELETE FROM schools WHERE id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';

-- Clear user roles for demo users
DELETE FROM user_roles WHERE user_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%'
);

-- Now safely delete demo profiles
DELETE FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%';

-- Clear any orphaned user roles
DELETE FROM user_roles WHERE user_id NOT IN (SELECT user_id FROM profiles);

-- Ensure all HR tables have proper RLS policies
CREATE POLICY IF NOT EXISTS "HR users can manage employees" ON employees
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
        AND ur.is_active = true
    )
);

CREATE POLICY IF NOT EXISTS "HR users can manage time entries" ON time_entries
FOR ALL USING (
    employee_id = (SELECT id FROM employees WHERE user_id = auth.uid())
    OR EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
        AND ur.is_active = true
    )
);

CREATE POLICY IF NOT EXISTS "HR users can manage projects" ON projects
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
        AND ur.is_active = true
    )
);