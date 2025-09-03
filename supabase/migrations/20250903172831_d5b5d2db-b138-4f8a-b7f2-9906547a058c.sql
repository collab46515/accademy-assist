-- Update create_employee_with_user to include school_id from employee_data for user_roles insertion
CREATE OR REPLACE FUNCTION public.create_employee_with_user(employee_data jsonb, created_by uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_user_id uuid;
  new_employee_id uuid;
  employee_email text;
  employee_password text;
  result jsonb;
  target_school_id uuid;
BEGIN
  -- Extract data
  employee_email := employee_data->>'email';
  employee_password := COALESCE(employee_data->>'password', 'TempPass123!');
  target_school_id := NULLIF(employee_data->>'school_id','')::uuid;
  
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
  
  -- Create default user role based on position; require school_id for non-super-admin roles
  INSERT INTO user_roles (
    user_id,
    school_id,
    role,
    assigned_by
  ) VALUES (
    new_user_id,
    target_school_id,
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
$function$;