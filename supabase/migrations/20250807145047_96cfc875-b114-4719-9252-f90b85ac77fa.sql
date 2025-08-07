-- First, let's just make sure we have a demo school without the phone column
INSERT INTO schools (
  id, 
  name, 
  address, 
  email, 
  website, 
  establishment_type, 
  status, 
  created_at
) VALUES (
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Pappaya Demo School',
  '123 Education Street, Demo City, DC1 2ED',
  'info@pappaya.academy',
  'https://www.pappaya.academy',
  'secondary',
  'active',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Create a working demo user profile without password requirements
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

-- Give demo user admin role
INSERT INTO user_roles (
  id,
  user_id,
  school_id,
  role,
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  'demo-user-uuid-fixed-1234-567890abcdef',
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'school_admin',
  true,
  NOW()
) ON CONFLICT (user_id, school_id, role) DO UPDATE SET
  is_active = true;