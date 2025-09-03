-- Comprehensive cleanup of all mock/demo data from the database
-- Clear all existing demo data

-- Clear timetable data (already done but ensuring it's clean)
TRUNCATE TABLE timetable_entries CASCADE;
TRUNCATE TABLE timetable_periods CASCADE;

-- Clear all HR demo data
DELETE FROM employees WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%';
DELETE FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%';
DELETE FROM user_roles WHERE user_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%'
);

-- Clear demo attendance records
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

-- Clear demo student data  
DELETE FROM students WHERE school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';
DELETE FROM student_parents WHERE parent_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%@demo.school.com'
);

-- Clear demo school
DELETE FROM schools WHERE id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';

-- Clear any remaining demo profiles
DELETE FROM profiles WHERE email LIKE '%@demo.school.com' OR email LIKE '%demo%' OR email LIKE '%mock%';

-- Clear any orphaned user roles
DELETE FROM user_roles WHERE user_id NOT IN (SELECT user_id FROM profiles);

-- Reset sequences if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'receipt_number_seq') THEN
        ALTER SEQUENCE receipt_number_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'application_number_seq') THEN
        ALTER SEQUENCE application_number_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'incident_sequence') THEN
        ALTER SEQUENCE incident_sequence RESTART WITH 1;
    END IF;
END $$;

-- Ensure RLS is enabled on all necessary tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records_hr ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_surveys ENABLE ROW LEVEL SECURITY;