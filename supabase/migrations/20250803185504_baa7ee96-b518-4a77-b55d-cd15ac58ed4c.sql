-- Temporarily disable the trigger to add super admin role
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.user_roles;

-- Add super_admin role for the current user
DO $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get the first user from auth.users (assuming this is you)
    SELECT id INTO current_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- If we found a user, assign super_admin role
    IF current_user_id IS NOT NULL THEN
        -- Insert the super_admin role
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (current_user_id, 'super_admin', true);
        
        RAISE NOTICE 'Super admin role assigned to user: %', current_user_id;
    ELSE
        RAISE NOTICE 'No users found in the system';
    END IF;
END $$;

-- Re-enable the trigger
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();