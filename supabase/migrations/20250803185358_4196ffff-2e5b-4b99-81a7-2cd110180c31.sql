-- Add super_admin role for the current user (simplified version)
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
        -- Insert the super_admin role for this user
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (current_user_id, 'super_admin'::app_role, true)
        ON CONFLICT (user_id, role) DO UPDATE SET
            is_active = true;
            
        RAISE NOTICE 'Super admin role assigned to user: %', current_user_id;
    ELSE
        RAISE NOTICE 'No users found in the system';
    END IF;
END $$;