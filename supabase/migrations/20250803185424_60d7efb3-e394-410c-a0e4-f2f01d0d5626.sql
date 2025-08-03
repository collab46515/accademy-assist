-- Add super_admin role for the current user (simple insert)
DO $$
DECLARE
    current_user_id UUID;
    role_exists INTEGER;
BEGIN
    -- Get the first user from auth.users (assuming this is you)
    SELECT id INTO current_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- If we found a user, check if role already exists
    IF current_user_id IS NOT NULL THEN
        SELECT COUNT(*) INTO role_exists
        FROM public.user_roles 
        WHERE user_id = current_user_id AND role = 'super_admin'::app_role;
        
        -- Only insert if role doesn't exist
        IF role_exists = 0 THEN
            INSERT INTO public.user_roles (user_id, role, is_active)
            VALUES (current_user_id, 'super_admin'::app_role, true);
            
            RAISE NOTICE 'Super admin role assigned to user: %', current_user_id;
        ELSE
            -- Update existing role to be active
            UPDATE public.user_roles 
            SET is_active = true 
            WHERE user_id = current_user_id AND role = 'super_admin'::app_role;
            
            RAISE NOTICE 'Super admin role updated for user: %', current_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'No users found in the system';
    END IF;
END $$;