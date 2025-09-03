-- Safer cleanup of mock/demo data without violating constraints

-- Clear timetable data (already done but ensuring it's clean)
TRUNCATE TABLE timetable_entries CASCADE;
TRUNCATE TABLE timetable_periods CASCADE;

-- Clear HR data safely
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

-- Clear demo employees (this should be safe as we're not touching profiles)
DELETE FROM employees WHERE email LIKE '%@demo%' OR employee_id LIKE 'EMP%';

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