-- Fix the core issue: User needs proper school access
-- First, let's create a demo school if none exists
INSERT INTO schools (id, name, address, phone, email, website, establishment_type, status)
VALUES (
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Demo School',
  '123 Education Street, Learning City, LC1 2ED',
  '+44 20 7123 4567',
  'info@demo.school.com',
  'https://www.demo.school.com',
  'secondary',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  establishment_type = EXCLUDED.establishment_type,
  status = EXCLUDED.status;

-- Give the current user super_admin role first
INSERT INTO user_roles (user_id, role, school_id, is_active)
VALUES (
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'super_admin',
  null,
  true
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET
  is_active = true;

-- Also give the user school_admin role for the demo school
INSERT INTO user_roles (user_id, role, school_id, is_active)
VALUES (
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'school_admin',
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  true
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET
  is_active = true;