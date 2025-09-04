-- Bootstrap dominic@pappayacloud.com as super_admin
-- This will create the user profile and assign super_admin role

-- Insert the super admin profile
INSERT INTO profiles (
  user_id, 
  email, 
  first_name, 
  last_name, 
  must_change_password,
  is_active
) VALUES (
  gen_random_uuid(),
  'dominic@pappayacloud.com',
  'Dominic',
  'Smith',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Get the user_id for the profile we just created/exists
WITH admin_profile AS (
  SELECT user_id FROM profiles WHERE email = 'dominic@pappayacloud.com'
)
-- Insert super_admin role
INSERT INTO user_roles (
  user_id,
  role,
  is_active
) 
SELECT 
  user_id,
  'super_admin'::app_role,
  true
FROM admin_profile
ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;

-- Verify the setup
SELECT 
  p.email,
  p.first_name,
  p.last_name,
  ur.role,
  ur.is_active
FROM profiles p
JOIN user_roles ur ON ur.user_id = p.user_id
WHERE p.email = 'dominic@pappayacloud.com';