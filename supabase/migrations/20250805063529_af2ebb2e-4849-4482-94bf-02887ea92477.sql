-- Fix RLS policies for core tables and create proper data flows

-- First, let's ensure we have proper RLS policies for students table
CREATE POLICY "School staff can manage students" 
ON public.students 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = students.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Students can view their own data
CREATE POLICY "Students can view own data" 
ON public.students 
FOR SELECT 
USING (user_id = auth.uid());

-- Parents can view their children's data
CREATE POLICY "Parents can view children data" 
ON public.students 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM student_parents sp 
    WHERE sp.parent_id = auth.uid() 
    AND sp.student_id = students.id
  )
);

-- RLS policies for employees table  
CREATE POLICY "HR can manage employees" 
ON public.employees 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Employees can view their own data
CREATE POLICY "Employees can view own data" 
ON public.employees 
FOR SELECT 
USING (user_id = auth.uid());

-- RLS policies for profiles table
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "System can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Function to create a new student with proper user and profile setup
CREATE OR REPLACE FUNCTION create_student_with_user(
  student_data jsonb,
  school_id uuid,
  created_by uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  new_student_id uuid;
  student_email text;
  student_password text;
  result jsonb;
BEGIN
  -- Extract data
  student_email := student_data->>'email';
  student_password := COALESCE(student_data->>'password', 'TempPass123!');
  
  -- Create auth user
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
    student_email,
    student_data->>'first_name',
    student_data->>'last_name', 
    student_data->>'phone',
    true  -- Force password change on first login
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
    medical_notes
  ) VALUES (
    new_user_id,
    school_id,
    student_data->>'student_number',
    student_data->>'year_group',
    student_data->>'form_class',
    (student_data->>'date_of_birth')::date,
    COALESCE((student_data->>'admission_date')::date, CURRENT_DATE),
    student_data->>'emergency_contact_name',
    student_data->>'emergency_contact_phone',
    student_data->>'medical_notes'
  ) RETURNING id INTO new_student_id;
  
  -- Create default user role
  INSERT INTO user_roles (
    user_id,
    school_id,
    role,
    assigned_by
  ) VALUES (
    new_user_id,
    school_id,
    'student'::app_role,
    created_by
  );
  
  -- Return result
  result := jsonb_build_object(
    'success', true,
    'student_id', new_student_id,
    'user_id', new_user_id,
    'email', student_email,
    'temp_password', student_password
  );
  
  return result;
END;
$$;

-- Function to create a new employee/teacher with proper user and profile setup
CREATE OR REPLACE FUNCTION create_employee_with_user(
  employee_data jsonb,
  created_by uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  new_employee_id uuid;
  employee_email text;
  employee_password text;
  result jsonb;
BEGIN
  -- Extract data
  employee_email := employee_data->>'email';
  employee_password := COALESCE(employee_data->>'password', 'TempPass123!');
  
  -- Create user id
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
    employee_email,
    employee_data->>'first_name',
    employee_data->>'last_name',
    employee_data->>'phone', 
    true  -- Force password change on first login
  );
  
  -- Insert into employees
  INSERT INTO employees (
    user_id,
    employee_id,
    first_name,
    last_name,
    email,
    phone,
    department_id,
    position,
    manager_id,
    start_date,
    salary,
    work_type,
    location,
    emergency_contact_name,
    emergency_contact_phone
  ) VALUES (
    new_user_id,
    employee_data->>'employee_id',
    employee_data->>'first_name',
    employee_data->>'last_name',
    employee_email,
    employee_data->>'phone',
    (employee_data->>'department_id')::uuid,
    employee_data->>'position',
    (employee_data->>'manager_id')::uuid,
    (employee_data->>'start_date')::date,
    (employee_data->>'salary')::numeric,
    COALESCE(employee_data->>'work_type', 'full_time'),
    employee_data->>'location',
    employee_data->>'emergency_contact_name',
    employee_data->>'emergency_contact_phone'
  ) RETURNING id INTO new_employee_id;
  
  -- Create default user role based on position
  INSERT INTO user_roles (
    user_id,
    role,
    assigned_by
  ) VALUES (
    new_user_id,
    CASE 
      WHEN LOWER(employee_data->>'position') LIKE '%teacher%' THEN 'teacher'::app_role
      WHEN LOWER(employee_data->>'position') LIKE '%admin%' THEN 'school_admin'::app_role
      WHEN LOWER(employee_data->>'position') LIKE '%head%' THEN 'hod'::app_role
      ELSE 'teacher'::app_role
    END,
    created_by
  );
  
  -- Return result
  result := jsonb_build_object(
    'success', true,
    'employee_id', new_employee_id,
    'user_id', new_user_id,
    'email', employee_email,
    'temp_password', employee_password
  );
  
  return result;
END;
$$;