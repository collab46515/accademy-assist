-- Fix the create_complete_student_enrollment function with better error handling
CREATE OR REPLACE FUNCTION public.create_complete_student_enrollment(student_data jsonb, parent_data jsonb, school_id uuid, application_id uuid, created_by uuid DEFAULT auth.uid())
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_student_user_id uuid;
  new_parent_user_id uuid;
  new_student_record_id uuid;
  student_email text;
  student_password text;
  parent_email text;
  parent_password text;
  existing_student_count integer;
  new_student_number text;
  result jsonb;
  target_school_id uuid := school_id; -- Use explicit variable to avoid ambiguity
BEGIN
  -- Extract data
  student_email := student_data->>'email';
  student_password := COALESCE(student_data->>'password', 'Student123!');
  parent_email := parent_data->>'email';
  parent_password := COALESCE(parent_data->>'password', 'Parent123!');
  
  -- Generate unique student number for this school
  SELECT COUNT(*) INTO existing_student_count 
  FROM students 
  WHERE students.school_id = target_school_id;
  
  new_student_number := COALESCE(
    student_data->>'student_number',
    'STU' || LPAD((existing_student_count + 1)::text, 4, '0')
  );
  
  -- Ensure student number is unique within school
  WHILE EXISTS (
    SELECT 1 FROM students 
    WHERE students.school_id = target_school_id 
    AND students.student_number = new_student_number
  ) LOOP
    existing_student_count := existing_student_count + 1;
    new_student_number := 'STU' || LPAD((existing_student_count + 1)::text, 4, '0');
  END LOOP;
  
  -- Create student user account ID
  new_student_user_id := gen_random_uuid();
  
  -- Insert student profile
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
    true
  );
  
  -- Insert into students table and get the record ID
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
    target_school_id,
    new_student_number,
    student_data->>'year_group',
    student_data->>'form_class',
    (student_data->>'date_of_birth')::date,
    COALESCE((student_data->>'admission_date')::date, CURRENT_DATE),
    student_data->>'emergency_contact_name',
    student_data->>'emergency_contact_phone',
    student_data->>'medical_notes'
  ) RETURNING id INTO new_student_record_id;
  
  -- Verify student record was created
  IF new_student_record_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create student record';
  END IF;
  
  -- Create student user role
  INSERT INTO user_roles (
    user_id,
    school_id,
    role,
    assigned_by
  ) VALUES (
    new_student_user_id,
    target_school_id,
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
      true
    );
    
    -- Create parent user role
    INSERT INTO user_roles (
      user_id,
      school_id,
      role,
      assigned_by
    ) VALUES (
      new_parent_user_id,
      target_school_id,
      'parent'::app_role,
      created_by
    );
    
    -- Link parent to student - CRITICAL FIX: Use the correct student record ID
    -- Verify the student record exists before linking
    IF NOT EXISTS (SELECT 1 FROM students WHERE id = new_student_record_id) THEN
      RAISE EXCEPTION 'Student record with ID % does not exist', new_student_record_id;
    END IF;
    
    INSERT INTO student_parents (
      student_id,  -- This must reference students.id (the primary key)
      parent_id,   -- This references the parent's user_id 
      relationship
    ) VALUES (
      new_student_record_id,  -- students.id (UUID primary key from students table)
      new_parent_user_id,     -- parent's user_id (profiles.user_id)
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
      'student_record_id', new_student_record_id,
      'student_user_id', new_student_user_id,
      'parent_user_id', new_parent_user_id,
      'credentials_generated', true
    )
  WHERE id = application_id;
  
  -- Return comprehensive result
  result := jsonb_build_object(
    'success', true,
    'student_record_id', new_student_record_id,
    'student_user_id', new_student_user_id,
    'student_email', student_email,
    'student_temp_password', student_password,
    'student_number', new_student_number,
    'parent_user_id', new_parent_user_id,
    'parent_email', parent_email,
    'parent_temp_password', parent_password,
    'enrollment_complete', true
  );
  
  return result;
END;
$function$;