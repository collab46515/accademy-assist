-- Simple approach to assign super_admin role to dominic@pappayacloud.com
DO $$
DECLARE
    user_uuid UUID;
    default_school_id UUID;
BEGIN
    -- Get the user ID from profiles table
    SELECT user_id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'dominic@pappayacloud.com';
    
    -- If user not found, raise exception
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with email dominic@pappayacloud.com not found';
    END IF;
    
    -- Get or create a default school for super admin
    SELECT id INTO default_school_id 
    FROM public.schools 
    LIMIT 1;
    
    -- If no school exists, create a default one
    IF default_school_id IS NULL THEN
        INSERT INTO public.schools (name, code, contact_email)
        VALUES ('System Admin School', 'SYS-ADMIN', 'dominic@pappayacloud.com')
        RETURNING id INTO default_school_id;
    END IF;
    
    -- Check if role already exists
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_uuid AND role = 'super_admin' AND school_id = default_school_id
    ) THEN
        -- Insert super_admin role for the user
        INSERT INTO public.user_roles (user_id, role, school_id, is_active)
        VALUES (user_uuid, 'super_admin', default_school_id, true);
    ELSE
        -- Update existing role to be active
        UPDATE public.user_roles 
        SET is_active = true 
        WHERE user_id = user_uuid AND role = 'super_admin' AND school_id = default_school_id;
    END IF;
    
END $$;