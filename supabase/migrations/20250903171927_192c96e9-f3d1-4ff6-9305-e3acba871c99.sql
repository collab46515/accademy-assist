-- Simple cleanup of mock/demo data

-- First handle foreign key constraints
UPDATE enrollment_applications 
SET submitted_by = NULL, created_by = NULL
WHERE submitted_by IN (SELECT user_id FROM profiles WHERE email LIKE '%demo%' OR email LIKE '%mock%')
   OR created_by IN (SELECT user_id FROM profiles WHERE email LIKE '%demo%' OR email LIKE '%mock%');

-- Clear all HR and demo data tables
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

-- Clear demo employees and students
DELETE FROM employees WHERE email LIKE '%demo%' OR email LIKE '%mock%';
DELETE FROM students WHERE school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';
DELETE FROM student_parents WHERE parent_id IN (SELECT user_id FROM profiles WHERE email LIKE '%demo%');
DELETE FROM schools WHERE id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';

-- Clear demo user roles and profiles last
DELETE FROM user_roles WHERE user_id IN (SELECT user_id FROM profiles WHERE email LIKE '%demo%' OR email LIKE '%mock%');
DELETE FROM profiles WHERE email LIKE '%demo%' OR email LIKE '%mock%';

-- Clean up orphaned data
DELETE FROM user_roles WHERE user_id NOT IN (SELECT user_id FROM profiles);