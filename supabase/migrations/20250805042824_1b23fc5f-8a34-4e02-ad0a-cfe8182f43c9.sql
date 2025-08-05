-- Create demo user accounts for the application
-- These accounts will be used for testing and demonstration purposes

-- Insert demo users with their credentials
-- Note: In production, passwords should be properly hashed
-- These are for demo purposes only

-- Create demo profiles for the demo users
-- We'll need to create these after the auth users are created via the Supabase dashboard

-- Create some sample user roles for the demo accounts
INSERT INTO user_roles (user_id, role, school_id, department, is_active) VALUES
-- Admin role - will be linked to admin@school.edu user
('00000000-0000-0000-0000-000000000001'::uuid, 'school_admin', '00000000-0000-0000-0000-000000000001'::uuid, NULL, true),
-- Teacher role - will be linked to teacher@school.edu user  
('00000000-0000-0000-0000-000000000002'::uuid, 'teacher', '00000000-0000-0000-0000-000000000001'::uuid, 'Mathematics', true),
-- HOD role - will be linked to hod@school.edu user
('00000000-0000-0000-0000-000000000003'::uuid, 'hod', '00000000-0000-0000-0000-000000000001'::uuid, 'Science', true)
ON CONFLICT (user_id, school_id, role) DO NOTHING;

-- Create a demo school if it doesn't exist
INSERT INTO schools (id, name, address, phone, email, principal_name) VALUES
('00000000-0000-0000-0000-000000000001'::uuid, 'Demo School', '123 Education Street', '+44 20 1234 5678', 'info@demoschool.edu', 'Dr. Jane Smith')
ON CONFLICT (id) DO NOTHING;