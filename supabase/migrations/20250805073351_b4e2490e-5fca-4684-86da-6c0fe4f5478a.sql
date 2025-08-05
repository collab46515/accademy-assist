-- Create demo students with the correct school ID
WITH demo_students AS (
  INSERT INTO profiles (user_id, email, first_name, last_name, phone, must_change_password)
  VALUES 
    ('11111111-1111-1111-1111-111111111111', 'student1@demo.school.com', 'Emma', 'Johnson', '+447123456001', true),
    ('22222222-2222-2222-2222-222222222222', 'student2@demo.school.com', 'Liam', 'Smith', '+447123456002', true),
    ('33333333-3333-3333-3333-333333333333', 'student3@demo.school.com', 'Olivia', 'Brown', '+447123456003', true),
    ('44444444-4444-4444-4444-444444444444', 'student4@demo.school.com', 'Noah', 'Davis', '+447123456004', true),
    ('55555555-5555-5555-5555-555555555555', 'student5@demo.school.com', 'Ava', 'Wilson', '+447123456005', true),
    ('66666666-6666-6666-6666-666666666666', 'student6@demo.school.com', 'Oliver', 'Miller', '+447123456006', true),
    ('77777777-7777-7777-7777-777777777777', 'student7@demo.school.com', 'Sophia', 'Garcia', '+447123456007', true),
    ('88888888-8888-8888-8888-888888888888', 'student8@demo.school.com', 'Elijah', 'Martinez', '+447123456008', true),
    ('99999999-9999-9999-9999-999999999999', 'student9@demo.school.com', 'Isabella', 'Anderson', '+447123456009', true),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'student10@demo.school.com', 'Mason', 'Taylor', '+447123456010', true)
  RETURNING user_id, first_name, last_name
)
INSERT INTO students (
  user_id, 
  school_id, 
  student_number, 
  year_group, 
  form_class, 
  date_of_birth, 
  admission_date, 
  is_enrolled,
  emergency_contact_name, 
  emergency_contact_phone
)
SELECT 
  ds.user_id,
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
  'STU' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
  CASE (ROW_NUMBER() OVER() - 1) % 6
    WHEN 0 THEN 'Year 7'
    WHEN 1 THEN 'Year 8' 
    WHEN 2 THEN 'Year 9'
    WHEN 3 THEN 'Year 10'
    WHEN 4 THEN 'Year 11'
    ELSE 'Year 12'
  END,
  CASE (ROW_NUMBER() OVER() - 1) % 8
    WHEN 0 THEN '7A'
    WHEN 1 THEN '7B'
    WHEN 2 THEN '8A'
    WHEN 3 THEN '8B'
    WHEN 4 THEN '9A'
    WHEN 5 THEN '9B'
    WHEN 6 THEN '10A'
    ELSE '10B'
  END,
  CURRENT_DATE - INTERVAL '12 years' - ((ROW_NUMBER() OVER()) * INTERVAL '30 days'),
  CURRENT_DATE - INTERVAL '1 year',
  true,
  'Emergency Contact for ' || ds.first_name,
  '+447700900' || LPAD((ROW_NUMBER() OVER())::text, 3, '0')
FROM demo_students ds;