-- Fix the existing demo user
-- Confirm the email and give super_admin role

-- Update the auth user to confirm email
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'demo@pappaya.academy';

-- Add super_admin role to existing user
INSERT INTO user_roles (
  user_id,
  role,
  is_active,
  assigned_at
) VALUES (
  '54590306-f285-4ad9-9788-4e84ac453271',
  'super_admin',
  true,
  NOW()
) ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true;