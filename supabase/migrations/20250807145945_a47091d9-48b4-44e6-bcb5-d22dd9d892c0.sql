-- Fix the existing demo user - confirm email and add super_admin role  
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'demo@pappaya.academy';

-- Add super_admin role with school_id
INSERT INTO user_roles (
  user_id,
  school_id,
  role,
  is_active,
  assigned_at
) 
SELECT 
  '54590306-f285-4ad9-9788-4e84ac453271',
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
  'super_admin',
  true,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = '54590306-f285-4ad9-9788-4e84ac453271' 
  AND role = 'super_admin'
);