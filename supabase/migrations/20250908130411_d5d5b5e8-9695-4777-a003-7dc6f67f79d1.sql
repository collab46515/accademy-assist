-- Test INSERT operations to see what fails
-- First, let's try to create a test student
INSERT INTO students (
  user_id,
  school_id, 
  student_number,
  year_group,
  form_class,
  is_enrolled
) VALUES (
  gen_random_uuid(),
  '2f21656b-0848-40ee-bbec-12e5e8137545',
  'TEST001',
  'Year 7',
  '7A', 
  true
) RETURNING id, student_number;