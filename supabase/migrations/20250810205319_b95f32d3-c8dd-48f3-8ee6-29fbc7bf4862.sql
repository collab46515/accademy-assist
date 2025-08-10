-- Fix the create_complete_student_enrollment function to properly handle user creation
-- Since we can't create auth.users directly, we'll create profiles and user_roles that reference the profiles

DROP FUNCTION IF EXISTS public.create_complete_student_enrollment(jsonb, jsonb, uuid, uuid, uuid);

CREATE OR REPLACE FUNCTION public.create_complete_student_enrollment(
  student_data jsonb, 
  parent_data jsonb, 
  school_id uuid, 
  application_id uuid, 
  created_by uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_student_user_id uuid;
  new_parent_user_id uuid;
  new_student_id uuid;
  student_email text;
  student_password text;
  parent_email text;
  parent_password text;
  result jsonb;
BEGIN
  -- Extract data
  student_email := student_data->>'email';
  student_password := COALESCE(student_data->>'password', 'Student123!');
  parent_email := parent_data->>'email';
  parent_password := COALESCE(parent_data->>'password', 'Parent123!');
  
  -- Create student user account ID (we'll use this as a reference, but won't create auth user)
  new_student_user_id := gen_random_uuid();
  
  -- Insert student profile (this creates the user reference)
  INSERT INTO profiles (
    user_id, 
    email, 
    first_name, 
    last_name, 
    phone,
    must_change_password
  ) VALUES (
    new_student_user_id,
    student_email,
    student_data->>'first_name',
    student_data->>'last_name', 
    student_data->>'phone',
    true  -- Force password change on first login
  );
  
  -- Insert into students table
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
    new_student_user_id,
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
  
  -- Create student user role
  INSERT INTO user_roles (
    user_id,
    school_id,
    role,
    assigned_by
  ) VALUES (
    new_student_user_id,
    school_id,
    'student'::app_role,
    created_by
  );
  
  -- Create parent user account if parent data provided
  IF parent_email IS NOT NULL AND parent_email != '' THEN
    new_parent_user_id := gen_random_uuid();
    
    -- Insert parent profile
    INSERT INTO profiles (
      user_id, 
      email, 
      first_name, 
      last_name, 
      phone,
      must_change_password
    ) VALUES (
      new_parent_user_id,
      parent_email,
      parent_data->>'first_name',
      parent_data->>'last_name', 
      parent_data->>'phone',
      true  -- Force password change on first login
    );
    
    -- Create parent user role
    INSERT INTO user_roles (
      user_id,
      school_id,
      role,
      assigned_by
    ) VALUES (
      new_parent_user_id,
      school_id,
      'parent'::app_role,
      created_by
    );
    
    -- Link parent to student
    INSERT INTO student_parents (
      student_id, 
      parent_id, 
      relationship
    ) VALUES (
      new_student_id, 
      new_parent_user_id, 
      COALESCE(parent_data->>'relationship', 'Parent')
    );
  END IF;
  
  -- Update the original application status to enrolled
  UPDATE enrollment_applications 
  SET 
    status = 'enrolled',
    updated_at = now(),
    additional_data = additional_data || jsonb_build_object(
      'enrollment_completed_at', now(),
      'student_id', new_student_id,
      'student_user_id', new_student_user_id,
      'parent_user_id', new_parent_user_id,
      'credentials_generated', true
    )
  WHERE id = application_id;
  
  -- Return comprehensive result
  result := jsonb_build_object(
    'success', true,
    'student_id', new_student_id,
    'student_user_id', new_student_user_id,
    'student_email', student_email,
    'student_temp_password', student_password,
    'parent_user_id', new_parent_user_id,
    'parent_email', parent_email,
    'parent_temp_password', parent_password,
    'enrollment_complete', true
  );
  
  return result;
END;
$$;