-- Add a test user role for demonstration
-- This will be temporary until you sign up with real users
INSERT INTO user_roles (user_id, role, school_id, is_active)
SELECT 
  auth.users.id,
  'teacher',
  '00000000-0000-0000-0000-000000000001',  -- Placeholder school ID
  true
FROM auth.users 
WHERE email = 'test@example.com'
ON CONFLICT (user_id, role, school_id) DO NOTHING;