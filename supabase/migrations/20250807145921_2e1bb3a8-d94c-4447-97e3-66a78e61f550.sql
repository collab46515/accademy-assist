-- Fix the existing demo user - confirm email and add super_admin role
-- Update auth user to confirm email  
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'demo@pappaya.academy';

-- Add super_admin role to existing user (without ON CONFLICT since no unique constraint)
INSERT INTO user_roles (
  user_id,
  role,
  is_active,
  assigned_at
) 
SELECT 
  '54590306-f285-4ad9-9788-4e84ac453271',
  'super_admin',
  true,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = '54590306-f285-4ad9-9788-4e84ac453271' 
  AND role = 'super_admin'
);