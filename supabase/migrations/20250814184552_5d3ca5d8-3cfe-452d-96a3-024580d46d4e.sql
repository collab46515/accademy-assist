-- =================================================================
-- FIX REMAINING FUNCTIONS WITH MISSING SEARCH PATH 
-- =================================================================

CREATE OR REPLACE FUNCTION public.create_employee_with_user(employee_data jsonb, created_by uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.create_student_with_user(student_data jsonb, school_id uuid, created_by uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := 'APP' || DATE_PART('year', NOW()) || 
                              LPAD(NEXTVAL('application_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  year_part TEXT;
  sequence_part TEXT;
  receipt_num TEXT;
BEGIN
  -- Get current year
  year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  -- Get next sequence number and format with leading zeros
  sequence_part := LPAD(nextval('receipt_number_seq')::TEXT, 5, '0');
  
  -- Combine into final format
  receipt_num := 'RCP-' || year_part || '-' || sequence_part;
  
  RETURN receipt_num;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_report_card_data(p_student_id uuid, p_academic_term text, p_academic_year text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  student_info RECORD;
  grades_array JSONB := '[]'::jsonb;
  attendance_summary JSONB := '{}'::jsonb;
  coverage_summary JSONB := '{}'::jsonb;
  grade_record RECORD;
  attendance_stats RECORD;
BEGIN
  -- Get student information
  SELECT s.*, p.first_name, p.last_name,
         CONCAT(p.first_name, ' ', p.last_name) as full_name
  INTO student_info
  FROM students s
  JOIN profiles p ON p.user_id = s.user_id
  WHERE s.id = p_student_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found';
  END IF;
  
  -- Get aggregated grades for the term
  FOR grade_record IN 
    SELECT 
      subject_id,
      subject_id as subject_name, -- You might want to join with subjects table
      grade_text,
      AVG(grade_numeric) as avg_numeric,
      COUNT(*) as assessment_count,
      MAX(date_recorded) as latest_assessment
    FROM gradebook_records
    WHERE student_id = p_student_id
    AND academic_period = p_academic_term
    AND grade_numeric IS NOT NULL
    GROUP BY subject_id, grade_text
    ORDER BY subject_name
  LOOP
    grades_array := grades_array || jsonb_build_object(
      'subject', grade_record.subject_name,
      'grade', grade_record.grade_text,
      'average_numeric', grade_record.avg_numeric,
      'assessment_count', grade_record.assessment_count,
      'latest_assessment', grade_record.latest_assessment
    );
  END LOOP;
  
  -- Get attendance summary for the term
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'present') as present_count,
    COUNT(*) FILTER (WHERE status = 'absent') as absent_count,
    COUNT(*) FILTER (WHERE status = 'late') as late_count,
    ROUND(
      (COUNT(*) FILTER (WHERE status = 'present')::numeric / 
       NULLIF(COUNT(*), 0) * 100), 2
    ) as attendance_percentage
  INTO attendance_stats
  FROM attendance_records
  WHERE student_id = p_student_id
  AND date >= (CURRENT_DATE - INTERVAL '3 months'); -- Approximate term length
  
  attendance_summary := jsonb_build_object(
    'total_sessions', COALESCE(attendance_stats.total_sessions, 0),
    'present_count', COALESCE(attendance_stats.present_count, 0),
    'absent_count', COALESCE(attendance_stats.absent_count, 0),
    'late_count', COALESCE(attendance_stats.late_count, 0),
    'percentage', COALESCE(attendance_stats.attendance_percentage, 0)
  );
  
  -- Return compiled data
  RETURN jsonb_build_object(
    'student_info', row_to_json(student_info),
    'grades', grades_array,
    'attendance', attendance_summary,
    'coverage', coverage_summary,
    'generated_at', now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.request_password_reset(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Check if the requesting user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'school_admin') 
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  -- Update the target user's profile to require password change
  UPDATE public.profiles 
  SET 
    must_change_password = true,
    password_reset_at = now()
  WHERE user_id = target_user_id;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := generate_receipt_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Prevent self-assignment of super_admin role unless user is already super_admin
  IF NEW.role = 'super_admin' AND NEW.user_id = auth.uid() THEN
    IF NOT is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Cannot self-assign super_admin role';
    END IF;
  END IF;
  
  -- Ensure school_id is provided for non-super_admin roles
  IF NEW.role != 'super_admin' AND NEW.school_id IS NULL THEN
    RAISE EXCEPTION 'School ID required for non-super-admin roles';
  END IF;
  
  RETURN NEW;
END;
$function$;