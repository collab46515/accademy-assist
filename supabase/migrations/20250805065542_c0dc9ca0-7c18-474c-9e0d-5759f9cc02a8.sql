-- Fix the relationship between students and profiles by adding foreign key
ALTER TABLE students 
ADD CONSTRAINT students_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Also add foreign key for employees to profiles  
ALTER TABLE employees 
ADD CONSTRAINT employees_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Update your user to be associated with the demo school instead of system admin school
UPDATE user_roles 
SET school_id = (SELECT id FROM schools WHERE name = 'Demo High School' LIMIT 1)
WHERE user_id = 'dbe5589f-d4a3-46f1-9112-07cdf908fcbe' 
AND role = 'super_admin';

-- Let's also check if the demo data was actually created
SELECT 
  (SELECT COUNT(*) FROM students WHERE school_id = (SELECT id FROM schools WHERE name = 'Demo High School' LIMIT 1)) as student_count,
  (SELECT COUNT(*) FROM employees) as employee_count,
  (SELECT COUNT(*) FROM profiles) as profile_count,
  (SELECT id, name FROM schools WHERE name LIKE '%Demo%' LIMIT 1) as demo_school;