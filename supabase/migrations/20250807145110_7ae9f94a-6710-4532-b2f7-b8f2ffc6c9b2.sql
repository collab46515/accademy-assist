-- Let's create the simplest working demo account
-- Just focus on the profiles and user_roles tables

-- Create a working demo user profile 
INSERT INTO profiles (
  user_id,
  email,
  first_name,
  last_name,
  must_change_password,
  created_at
) VALUES (
  'demo-user-uuid-fixed-1234-567890abcdef',
  'demo@pappaya.academy',
  'Demo',
  'Admin',
  false,  -- No password change required
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  must_change_password = false;

-- Give demo user super admin role so they can access everything
INSERT INTO user_roles (
  id,
  user_id,
  role,
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  'demo-user-uuid-fixed-1234-567890abcdef',
  'super_admin',
  true,
  NOW()
) ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true;