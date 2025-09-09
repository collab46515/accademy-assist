-- Self-serve school creation for first-time users without roles
-- Creates a school and assigns the creator as school_admin in that school
-- Uses SECURITY DEFINER to bypass RLS safely with validations

-- Function: self_serve_create_school(school_data jsonb)
CREATE OR REPLACE FUNCTION public.self_serve_create_school(school_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_school_id uuid := gen_random_uuid();
  v_name text := NULLIF(school_data->>'name','');
  v_code text := NULLIF(school_data->>'code','');
  v_address text := COALESCE(school_data->>'address', '');
  v_contact_phone text := COALESCE(school_data->>'contact_phone', '');
  v_contact_email text := NULLIF(school_data->>'contact_email','');
  v_website text := COALESCE(school_data->>'website', '');
  v_establishment_type text := COALESCE(school_data->>'establishment_type', 'secondary');
BEGIN
  -- Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Only allow completely new users (no active roles) to self-serve create a school
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
  ) THEN
    RAISE EXCEPTION 'You already have roles assigned. Contact an administrator to create new schools.';
  END IF;

  -- Basic validations
  IF v_name IS NULL OR v_code IS NULL OR v_contact_email IS NULL THEN
    RAISE EXCEPTION 'Missing required fields: name, code, contact_email are required';
  END IF;

  -- Ensure school code uniqueness (case-insensitive)
  IF EXISTS (
    SELECT 1 FROM public.schools s WHERE lower(s.code) = lower(v_code)
  ) THEN
    RAISE EXCEPTION 'A school with code % already exists', v_code;
  END IF;

  -- Create school
  INSERT INTO public.schools (
    id, name, code, address, contact_phone, contact_email, website, establishment_type, is_active
  ) VALUES (
    new_school_id, v_name, v_code, v_address, v_contact_phone, v_contact_email, v_website, v_establishment_type, true
  );

  -- Assign creator as school_admin for the new school
  INSERT INTO public.user_roles (
    user_id, school_id, role, is_active
  ) VALUES (
    auth.uid(), new_school_id, 'school_admin'::app_role, true
  );

  RETURN new_school_id;
END;
$$;
