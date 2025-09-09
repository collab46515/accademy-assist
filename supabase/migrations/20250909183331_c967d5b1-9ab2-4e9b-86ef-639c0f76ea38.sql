-- Fix the user access issue by directly inserting the school roles
-- First delete any existing conflicting entries and re-insert

DELETE FROM user_roles 
WHERE user_id = 'dbe5589f-d4a3-46f1-9112-07cdf908fcbe' 
AND school_id IN ('2f21656b-0848-40ee-bbec-12e5e8137545', 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f');

-- Create a demo school as fallback with correct column names
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
) ON CONFLICT (id) DO NOTHING;

-- Now insert the school roles for both schools
INSERT INTO user_roles (user_id, role, school_id, is_active)
VALUES 
  ('dbe5589f-d4a3-46f1-9112-07cdf908fcbe', 'school_admin', '2f21656b-0848-40ee-bbec-12e5e8137545', true),
  ('dbe5589f-d4a3-46f1-9112-07cdf908fcbe', 'school_admin', 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f', true);