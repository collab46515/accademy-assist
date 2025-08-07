-- Create a simple working demo account
-- First, let's ensure we have a demo school
INSERT INTO schools (
  id, 
  name, 
  address, 
  phone, 
  email, 
  website, 
  establishment_type, 
  status, 
  created_at
) VALUES (
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Pappaya Demo School',
  '123 Education Street, Demo City, DC1 2ED',
  '+44 20 7123 4567',
  'info@pappaya.academy',
  'https://www.pappaya.academy',
  'secondary',
  'active',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Create a simple demo user profile (this will work without auth.users complications)
-- Use a fixed UUID for the demo user
INSERT INTO profiles (
  user_id,
  email,
  first_name,
  last_name,
  phone,
  must_change_password,
  created_at
) VALUES (
  'demo-user-uuid-fixed-1234-567890abcdef',
  'demo@pappaya.academy',
  'Demo',
  'User',
  '+44 20 7123 4567',
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

-- Create some sample students for the demo
INSERT INTO students (
  id,
  user_id,
  school_id,
  student_number,
  year_group,
  form_class,
  date_of_birth,
  admission_date,
  created_at
) VALUES 
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
    'STU001',
    'Year 10',
    '10A',
    '2008-05-15',
    '2023-09-01',
    NOW()
  ),
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
    'STU002',
    'Year 11',
    '11B',
    '2007-03-22',
    '2022-09-01',
    NOW()
  ),
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
    'STU003',
    'Year 9',
    '9A',
    '2009-11-08',
    '2023-09-01',
    NOW()
  )
ON CONFLICT DO NOTHING;