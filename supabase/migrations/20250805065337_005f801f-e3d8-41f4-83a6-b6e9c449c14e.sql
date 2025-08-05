-- First, let's ensure we have a demo school
INSERT INTO schools (id, name, code, address, phone, email, principal_name, website, logo_url, timezone, academic_year_start, academic_year_end)
VALUES (
  '1e109f61-4780-4071-acf0-aa746ab119ca',
  'Riverside Academy',
  'DEMO-001', 
  '123 Education Lane, Learning City, LC1 2AB',
  '+44 20 1234 5678',
  'info@riversideacademy.edu',
  'Dr. Sarah Thompson',
  'https://riversideacademy.edu',
  null,
  'Europe/London',
  '2024-09-01',
  '2025-08-31'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  principal_name = EXCLUDED.principal_name;

-- Create comprehensive demo students with proper user/profile setup
CREATE OR REPLACE FUNCTION generate_comprehensive_demo_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  demo_school_id uuid := '1e109f61-4780-4071-acf0-aa746ab119ca';
  student_record RECORD;
  employee_record RECORD;
  i INTEGER;
  new_user_id uuid;
  new_student_id uuid;
  new_employee_id uuid;
  year_groups text[] := ARRAY['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];
  departments text[] := ARRAY['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'PE'];
  positions text[] := ARRAY['Teacher', 'Senior Teacher', 'Head of Department', 'Assistant Principal', 'Principal'];
BEGIN
  -- Generate 100 demo students
  FOR i IN 1..100 LOOP
    new_user_id := gen_random_uuid();
    
    -- Insert into profiles
    INSERT INTO profiles (
      user_id,
      email, 
      first_name,
      last_name,
      phone,
      must_change_password
    ) VALUES (
      new_user_id,
      'student' || i || '@demo.edu',
      CASE (i % 20)
        WHEN 0 THEN 'Emma'
        WHEN 1 THEN 'Oliver'
        WHEN 2 THEN 'Sophia'
        WHEN 3 THEN 'William'
        WHEN 4 THEN 'Isabella'
        WHEN 5 THEN 'James'
        WHEN 6 THEN 'Charlotte'
        WHEN 7 THEN 'Benjamin'
        WHEN 8 THEN 'Amelia'
        WHEN 9 THEN 'Lucas'
        WHEN 10 THEN 'Mia'
        WHEN 11 THEN 'Henry'
        WHEN 12 THEN 'Harper'
        WHEN 13 THEN 'Alexander'
        WHEN 14 THEN 'Evelyn'
        WHEN 15 THEN 'Michael'
        WHEN 16 THEN 'Abigail'
        WHEN 17 THEN 'Daniel'
        WHEN 18 THEN 'Emily'
        ELSE 'Grace'
      END,
      CASE (i % 15)
        WHEN 0 THEN 'Smith'
        WHEN 1 THEN 'Johnson'
        WHEN 2 THEN 'Williams'
        WHEN 3 THEN 'Brown'
        WHEN 4 THEN 'Jones'
        WHEN 5 THEN 'Garcia'
        WHEN 6 THEN 'Miller'
        WHEN 7 THEN 'Davis'
        WHEN 8 THEN 'Rodriguez'
        WHEN 9 THEN 'Martinez'
        WHEN 10 THEN 'Hernandez'
        WHEN 11 THEN 'Lopez'
        WHEN 12 THEN 'Gonzalez'
        WHEN 13 THEN 'Wilson'
        ELSE 'Anderson'
      END,
      '+44 7' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
      false
    );
    
    -- Insert into students
    INSERT INTO students (
      user_id,
      school_id,
      student_number,
      year_group,
      form_class,
      date_of_birth,
      admission_date,
      emergency_contact_name,
      emergency_contact_phone,
      is_enrolled
    ) VALUES (
      new_user_id,
      demo_school_id,
      'STU' || LPAD(i::TEXT, 4, '0'),
      year_groups[(i % 7) + 1],
      CASE (i % 7) + 1
        WHEN 1 THEN '7A'
        WHEN 2 THEN '8B' 
        WHEN 3 THEN '9C'
        WHEN 4 THEN '10A'
        WHEN 5 THEN '11B'
        WHEN 6 THEN '12A'
        ELSE '13A'
      END,
      CURRENT_DATE - INTERVAL '12 years' - (i % 6 || ' years')::INTERVAL,
      CURRENT_DATE - (i % 365 || ' days')::INTERVAL,
      'Emergency Contact ' || i,
      '+44 7' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
      true
    ) RETURNING id INTO new_student_id;
    
    -- Create user role
    INSERT INTO user_roles (
      user_id,
      school_id,
      role
    ) VALUES (
      new_user_id,
      demo_school_id,
      'student'::app_role
    );

    -- Create parent records
    INSERT INTO student_parents (
      student_id,
      parent_id,
      parent_name,
      parent_email,
      parent_phone,
      relationship,
      is_primary_contact
    ) VALUES (
      new_student_id,
      gen_random_uuid(),
      'Parent of Student ' || i,
      'parent' || i || '@demo.edu',
      '+44 7' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
      CASE (i % 2) WHEN 0 THEN 'Mother' ELSE 'Father' END,
      true
    );

    -- Create fee assignments
    INSERT INTO student_fee_assignments (
      student_id,
      fee_structure_id,
      academic_year,
      term,
      assigned_date,
      status
    ) VALUES (
      new_student_id,
      (SELECT id FROM fee_structures WHERE school_id = demo_school_id LIMIT 1),
      '2024-25',
      'Autumn',
      CURRENT_DATE,
      'active'
    );
  END LOOP;

  -- Generate 50 demo employees
  FOR i IN 1..50 LOOP
    new_user_id := gen_random_uuid();
    
    -- Insert into profiles
    INSERT INTO profiles (
      user_id,
      email,
      first_name, 
      last_name,
      phone,
      must_change_password
    ) VALUES (
      new_user_id,
      'staff' || i || '@demo.edu',
      CASE (i % 15)
        WHEN 0 THEN 'Sarah'
        WHEN 1 THEN 'David'
        WHEN 2 THEN 'Michelle'
        WHEN 3 THEN 'Robert'
        WHEN 4 THEN 'Jennifer'
        WHEN 5 THEN 'Christopher'
        WHEN 6 THEN 'Jessica'
        WHEN 7 THEN 'Matthew'
        WHEN 8 THEN 'Ashley'
        WHEN 9 THEN 'Joshua'
        WHEN 10 THEN 'Amanda'
        WHEN 11 THEN 'Andrew'
        WHEN 12 THEN 'Stephanie'
        WHEN 13 THEN 'Kenneth'
        ELSE 'Rachel'
      END,
      CASE (i % 12)
        WHEN 0 THEN 'Thompson'
        WHEN 1 THEN 'White'
        WHEN 2 THEN 'Harris'
        WHEN 3 THEN 'Martin'
        WHEN 4 THEN 'Jackson'
        WHEN 5 THEN 'Clark'
        WHEN 6 THEN 'Lewis'
        WHEN 7 THEN 'Robinson'
        WHEN 8 THEN 'Walker'
        WHEN 9 THEN 'Perez'
        WHEN 10 THEN 'Hall'
        ELSE 'Young'
      END,
      '+44 7' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
      false
    );
    
    -- Insert into employees
    INSERT INTO employees (
      user_id,
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      start_date,
      salary,
      work_type,
      location,
      emergency_contact_name,
      emergency_contact_phone,
      status
    ) VALUES (
      new_user_id,
      'EMP' || LPAD(i::TEXT, 4, '0'),
      (SELECT first_name FROM profiles WHERE user_id = new_user_id),
      (SELECT last_name FROM profiles WHERE user_id = new_user_id),
      'staff' || i || '@demo.edu',
      '+44 7' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
      positions[(i % 5) + 1],
      CURRENT_DATE - (i % 1000 || ' days')::INTERVAL,
      25000 + (i % 30) * 1000,
      CASE (i % 3) WHEN 0 THEN 'full_time' WHEN 1 THEN 'part_time' ELSE 'contract' END,
      'Riverside Academy',
      'Emergency Contact for Staff ' || i,
      '+44 7' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
      'active'
    ) RETURNING id INTO new_employee_id;
    
    -- Create user role
    INSERT INTO user_roles (
      user_id,
      school_id,
      role,
      department
    ) VALUES (
      new_user_id,
      demo_school_id,
      CASE 
        WHEN i <= 5 THEN 'school_admin'::app_role
        WHEN i <= 15 THEN 'hod'::app_role  
        ELSE 'teacher'::app_role
      END,
      departments[(i % 8) + 1]
    );
  END LOOP;

  RAISE NOTICE 'Successfully created demo data: 100 students and 50 employees';
END;
$function$;

-- Execute the function to generate demo data
SELECT generate_comprehensive_demo_data();