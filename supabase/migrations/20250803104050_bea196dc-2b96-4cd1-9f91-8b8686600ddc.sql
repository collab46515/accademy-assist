-- First, let's find and assign super_admin role to dominic@pappayacloud.com
-- We'll need to get the user ID first, then assign roles

-- Create a temporary function to assign admin role safely
CREATE OR REPLACE FUNCTION assign_super_admin_to_user(user_email TEXT)
RETURNS void AS $$
DECLARE
    user_uuid UUID;
    default_school_id UUID;
BEGIN
    -- Get the user ID from profiles table
    SELECT user_id INTO user_uuid 
    FROM public.profiles 
    WHERE email = user_email;
    
    -- If user not found, raise exception
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Get or create a default school for super admin
    SELECT id INTO default_school_id 
    FROM public.schools 
    LIMIT 1;
    
    -- If no school exists, create a default one
    IF default_school_id IS NULL THEN
        INSERT INTO public.schools (name, code, contact_email)
        VALUES ('System Admin School', 'SYS-ADMIN', user_email)
        RETURNING id INTO default_school_id;
    END IF;
    
    -- Insert super_admin role for the user
    INSERT INTO public.user_roles (user_id, role, school_id, is_active)
    VALUES (user_uuid, 'super_admin', default_school_id, true)
    ON CONFLICT (user_id, role, school_id) 
    DO UPDATE SET is_active = true;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assign super admin role to dominic@pappayacloud.com
SELECT assign_super_admin_to_user('dominic@pappayacloud.com');

-- Drop the temporary function
DROP FUNCTION assign_super_admin_to_user(TEXT);