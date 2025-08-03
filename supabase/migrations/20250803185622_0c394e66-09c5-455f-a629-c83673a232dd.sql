-- Fix the trigger function and add super admin role
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.user_roles;

-- Fix the function to properly reference the enum
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Add super_admin role for the current user
DO $$
DECLARE
    current_user_id UUID;
    system_school_id UUID;
BEGIN
    -- Get the first user from auth.users (assuming this is you)
    SELECT id INTO current_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- Get the system school ID
    SELECT id INTO system_school_id
    FROM schools 
    WHERE name = 'System Admin School'
    LIMIT 1;
    
    -- If we found both user and school, assign super_admin role
    IF current_user_id IS NOT NULL AND system_school_id IS NOT NULL THEN
        -- Delete any existing roles for this user to avoid conflicts
        DELETE FROM public.user_roles WHERE user_id = current_user_id;
        
        -- Insert the super_admin role
        INSERT INTO public.user_roles (user_id, role, school_id, is_active)
        VALUES (current_user_id, 'super_admin', system_school_id, true);
        
        RAISE NOTICE 'Super admin role assigned to user: % for school: %', current_user_id, system_school_id;
    ELSE
        RAISE NOTICE 'User ID: %, School ID: %', current_user_id, system_school_id;
    END IF;
END $$;

-- Re-enable the trigger
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();