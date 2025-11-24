-- Create profile with user_id and assign user as school_admin
DO $$
DECLARE
  current_user_uuid uuid;
  current_school_uuid uuid;
  user_email text;
  user_first_name text;
  user_last_name text;
BEGIN
  -- Get current user from last login
  SELECT id, email, raw_user_meta_data->>'first_name', raw_user_meta_data->>'last_name'
  INTO current_user_uuid, user_email, user_first_name, user_last_name
  FROM auth.users
  ORDER BY last_sign_in_at DESC
  LIMIT 1;
  
  -- Get the first school
  SELECT id INTO current_school_uuid
  FROM schools
  LIMIT 1;
  
  IF current_user_uuid IS NOT NULL AND current_school_uuid IS NOT NULL THEN
    -- Create profile if it doesn't exist (with user_id field)
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = current_user_uuid) THEN
      INSERT INTO profiles (id, user_id, email, first_name, last_name)
      VALUES (
        current_user_uuid,
        current_user_uuid,
        user_email, 
        COALESCE(user_first_name, 'Admin'),
        COALESCE(user_last_name, 'User')
      );
    END IF;
    
    -- Create user role if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = current_user_uuid 
      AND school_id = current_school_uuid 
      AND role = 'school_admin'
    ) THEN
      INSERT INTO user_roles (user_id, school_id, role, is_active)
      VALUES (current_user_uuid, current_school_uuid, 'school_admin', true);
    ELSE
      UPDATE user_roles 
      SET is_active = true 
      WHERE user_id = current_user_uuid 
      AND school_id = current_school_uuid 
      AND role = 'school_admin';
    END IF;
    
    RAISE NOTICE 'User % (%) assigned as school_admin for school %', user_email, current_user_uuid, current_school_uuid;
  END IF;
END $$;