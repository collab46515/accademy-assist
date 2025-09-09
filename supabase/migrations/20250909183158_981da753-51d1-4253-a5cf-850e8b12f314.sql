-- Fix the core issue: Give the current user access to the existing school
-- The user already has super_admin role, now let's give them school access

-- Give the user school_admin role for the existing St Joseph school
INSERT INTO user_roles (user_id, role, school_id, is_active)
VALUES (
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'school_admin',
  '2f21656b-0848-40ee-bbec-12e5e8137545',
  true
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET
  is_active = true;

-- Also create a demo school as fallback with correct column names
INSERT INTO schools (id, name, code, address, contact_phone, contact_email, website, establishment_type, is_active)
VALUES (
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  'Demo School',
  'DEMO',
  '123 Education Street, Learning City, LC1 2ED',
  '+44 20 7123 4567',
  'info@demo.school.com',
  'https://www.demo.school.com',
  'secondary',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  address = EXCLUDED.address,
  contact_phone = EXCLUDED.contact_phone,
  contact_email = EXCLUDED.contact_email,
  website = EXCLUDED.website,
  establishment_type = EXCLUDED.establishment_type,
  is_active = EXCLUDED.is_active;

-- Give the user school_admin role for the demo school too
INSERT INTO user_roles (user_id, role, school_id, is_active)
VALUES (
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'school_admin',
  'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f',
  true
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET
  is_active = true;