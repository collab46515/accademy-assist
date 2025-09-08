-- Clean up test data and verify Master Data functionality works

-- Remove test records 
DELETE FROM students WHERE student_number = 'TEST001';
DELETE FROM classes WHERE class_name = 'Test Class 7A';

-- Test student creation with unique number
INSERT INTO students (
  school_id, 
  student_number,
  year_group,
  form_class,
  is_enrolled
) VALUES (
  '2f21656b-0848-40ee-bbec-12e5e8137545',
  'STU' || LPAD((EXTRACT(EPOCH FROM NOW())::bigint % 10000)::text, 4, '0'),
  'Year 8',
  '8A', 
  true
) RETURNING id, student_number, school_id;

-- Test class creation with unique name
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
  '8A Mathematics - ' || EXTRACT(EPOCH FROM NOW())::text,
  'Year 8',
  25,
  0,
  true,
  '2024-2025'  
) RETURNING id, class_name, school_id;