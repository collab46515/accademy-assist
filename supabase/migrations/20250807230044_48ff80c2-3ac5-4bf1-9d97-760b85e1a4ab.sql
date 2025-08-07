-- Insert sample departments for the school system
INSERT INTO departments (id, name, description, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Mathematics', 'Mathematics and Statistics Department', NOW(), NOW()),
(gen_random_uuid(), 'English', 'English Language and Literature Department', NOW(), NOW()),
(gen_random_uuid(), 'Science', 'General Science and Laboratory Department', NOW(), NOW()),
(gen_random_uuid(), 'History', 'History and Social Studies Department', NOW(), NOW()),
(gen_random_uuid(), 'Arts', 'Creative Arts and Design Department', NOW(), NOW()),
(gen_random_uuid(), 'Physical Education', 'Sports and Physical Education Department', NOW(), NOW()),
(gen_random_uuid(), 'Languages', 'Foreign Languages Department', NOW(), NOW()),
(gen_random_uuid(), 'Administration', 'School Administration and Management', NOW(), NOW()),
(gen_random_uuid(), 'IT Support', 'Information Technology and Systems', NOW(), NOW()),
(gen_random_uuid(), 'Student Services', 'Student Support and Counseling', NOW(), NOW())
ON CONFLICT DO NOTHING;