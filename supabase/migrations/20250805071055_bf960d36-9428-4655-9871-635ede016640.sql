-- Create the demo data generation function
CREATE OR REPLACE FUNCTION generate_comprehensive_demo_data()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  school_uuid uuid := 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';
  student_count integer := 0;
  employee_count integer := 0;
  i integer;
  new_user_id uuid;
  temp_password text := 'TempPass123!';
BEGIN
  -- Clear existing demo data
  DELETE FROM user_roles WHERE user_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%demo.school.com'
  );
  DELETE FROM students WHERE user_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%demo.school.com'
  );
  DELETE FROM employees WHERE user_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%demo.school.com'
  );
  DELETE FROM student_parents WHERE parent_id IN (
    SELECT user_id FROM profiles WHERE email LIKE '%demo.school.com'
  );
  DELETE FROM profiles WHERE email LIKE '%demo.school.com';

  -- Generate 100 students with parents and fees
  FOR i IN 1..100 LOOP
    -- Generate student
    new_user_id := gen_random_uuid();
    
    INSERT INTO profiles (
      user_id, email, first_name, last_name, phone, must_change_password
    ) VALUES (
      new_user_id,
      'student' || i || '@demo.school.com',
      (ARRAY['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'])[((i-1) % 20) + 1],
      (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'])[((i-1) % 20) + 1],
      '+44' || (7000000000 + i)::text,
      true
    );

    INSERT INTO students (
      user_id, school_id, student_number, year_group, form_class,
      date_of_birth, admission_date
    ) VALUES (
      new_user_id,
      school_uuid,
      'STU' || LPAD(i::text, 4, '0'),
      (ARRAY['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'])[((i-1) % 7) + 1],
      (ARRAY['7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B', '13A', '13B'])[((i-1) % 14) + 1],
      CURRENT_DATE - INTERVAL '12 years' - (i * INTERVAL '10 days'),
      CURRENT_DATE - INTERVAL '1 year' + (i * INTERVAL '2 days')
    );

    INSERT INTO user_roles (user_id, school_id, role, assigned_by)
    VALUES (new_user_id, school_uuid, 'student', auth.uid());

    student_count := student_count + 1;

    -- Generate parent for each student
    new_user_id := gen_random_uuid();
    
    INSERT INTO profiles (
      user_id, email, first_name, last_name, phone, must_change_password
    ) VALUES (
      new_user_id,
      'parent' || i || '@demo.school.com',
      (ARRAY['Mark', 'Sarah', 'David', 'Emma', 'Paul', 'Sophie', 'Andrew', 'Rachel', 'Simon', 'Claire'])[((i-1) % 10) + 1],
      (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'])[((i-1) % 10) + 1],
      '+44' || (8000000000 + i)::text,
      true
    );

    INSERT INTO user_roles (user_id, school_id, role, assigned_by)
    VALUES (new_user_id, school_uuid, 'parent', auth.uid());

    -- Link parent to student
    INSERT INTO student_parents (student_id, parent_id, relationship)
    VALUES (
      (SELECT id FROM students WHERE user_id = (SELECT user_id FROM profiles WHERE email = 'student' || i || '@demo.school.com')),
      new_user_id,
      (ARRAY['Mother', 'Father', 'Guardian'])[((i-1) % 3) + 1]
    );
  END LOOP;

  -- Generate 50 employees
  FOR i IN 1..50 LOOP
    new_user_id := gen_random_uuid();
    
    INSERT INTO profiles (
      user_id, email, first_name, last_name, phone, must_change_password
    ) VALUES (
      new_user_id,
      'staff' || i || '@demo.school.com',
      (ARRAY['Alice', 'Bob', 'Carol', 'Daniel', 'Eva', 'Frank', 'Grace', 'Henry', 'Isabel', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Ruby', 'Sam', 'Tara'])[((i-1) % 20) + 1],
      (ARRAY['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Green', 'Harris', 'Irving', 'Johnson', 'King', 'Lewis', 'Moore', 'Nelson', 'Owen', 'Parker', 'Quinn', 'Roberts', 'Scott', 'Turner'])[((i-1) % 20) + 1],
      '+44' || (9000000000 + i)::text,
      true
    );

    INSERT INTO employees (
      user_id, employee_id, first_name, last_name, email, phone,
      position, start_date, salary, work_type
    ) VALUES (
      new_user_id,
      'EMP' || LPAD(i::text, 4, '0'),
      (SELECT first_name FROM profiles WHERE user_id = new_user_id),
      (SELECT last_name FROM profiles WHERE user_id = new_user_id),
      'staff' || i || '@demo.school.com',
      '+44' || (9000000000 + i)::text,
      (ARRAY['Teacher', 'Assistant Teacher', 'Head Teacher', 'Department Head', 'Administrator', 'Support Staff'])[((i-1) % 6) + 1],
      CURRENT_DATE - INTERVAL '2 years' + (i * INTERVAL '10 days'),
      25000 + (i * 500),
      'full_time'
    );

    INSERT INTO user_roles (user_id, school_id, role, assigned_by)
    VALUES (
      new_user_id, 
      school_uuid, 
      CASE 
        WHEN i <= 5 THEN 'hod'
        WHEN i <= 10 THEN 'school_admin'
        ELSE 'teacher'
      END::app_role,
      auth.uid()
    );

    employee_count := employee_count + 1;
  END LOOP;

  RETURN 'Demo data generated successfully: ' || student_count || ' students (with parents) and ' || employee_count || ' employees created.';
END;
$$;