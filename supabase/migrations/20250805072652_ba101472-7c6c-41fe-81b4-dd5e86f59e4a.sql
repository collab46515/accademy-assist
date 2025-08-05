-- Clear existing data and create proper demo data
DELETE FROM students;
DELETE FROM profiles WHERE user_id != auth.uid();

-- Create demo school if it doesn't exist
INSERT INTO schools (id, name, code, address, contact_phone, contact_email, is_active)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Pappaya Secondary School', 'PSS', '123 Education Lane, London', '+44 20 1234 5678', 'admin@pappayasecondary.edu', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  address = EXCLUDED.address,
  contact_phone = EXCLUDED.contact_phone,
  contact_email = EXCLUDED.contact_email;

-- Create demo student profiles
INSERT INTO profiles (user_id, first_name, last_name, email, avatar_url, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Emma', 'Johnson', 'emma.johnson@email.com', null, now(), now()),
('22222222-2222-2222-2222-222222222222', 'Liam', 'Williams', 'liam.williams@email.com', null, now(), now()),
('33333333-3333-3333-3333-333333333333', 'Olivia', 'Brown', 'olivia.brown@email.com', null, now(), now()),
('44444444-4444-4444-4444-444444444444', 'Noah', 'Davis', 'noah.davis@email.com', null, now(), now()),
('55555555-5555-5555-5555-555555555555', 'Ava', 'Miller', 'ava.miller@email.com', null, now(), now()),
('66666666-6666-6666-6666-666666666666', 'William', 'Wilson', 'william.wilson@email.com', null, now(), now()),
('77777777-7777-7777-7777-777777777777', 'Sophia', 'Moore', 'sophia.moore@email.com', null, now(), now()),
('88888888-8888-8888-8888-888888888888', 'James', 'Taylor', 'james.taylor@email.com', null, now(), now()),
('99999999-9999-9999-9999-999999999999', 'Isabella', 'Anderson', 'isabella.anderson@email.com', null, now(), now()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Benjamin', 'Thomas', 'benjamin.thomas@email.com', null, now(), now()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mia', 'Jackson', 'mia.jackson@email.com', null, now(), now()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Lucas', 'White', 'lucas.white@email.com', null, now(), now())
ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email;

-- Create corresponding student records with correct column names
INSERT INTO students (
    id, user_id, school_id, student_number, year_group, form_class, 
    date_of_birth, admission_date, emergency_contact_name, emergency_contact_phone, 
    medical_notes, is_enrolled, created_at, updated_at
) VALUES
('s1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'PSS001', 'Year 7', '7A', '2011-05-15', '2024-09-01', 'Sarah Johnson', '+44 20 1111 1111', '', true, now(), now()),
('s2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440000', 'PSS002', 'Year 8', '8A', '2010-08-22', '2023-09-01', 'Mark Williams', '+44 20 2222 2222', '', true, now(), now()),
('s3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440000', 'PSS003', 'Year 9', '9B', '2009-12-03', '2022-09-01', 'Lisa Brown', '+44 20 3333 3333', 'Asthma', true, now(), now()),
('s4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440000', 'PSS004', 'Year 10', '10A', '2008-04-18', '2021-09-01', 'Robert Davis', '+44 20 4444 4444', '', true, now(), now()),
('s5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '550e8400-e29b-41d4-a716-446655440000', 'PSS005', 'Year 11', '11A', '2007-09-30', '2020-09-01', 'Jennifer Miller', '+44 20 5555 5555', '', true, now(), now()),
('s6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440000', 'PSS006', 'Year 7', '7B', '2011-01-12', '2024-09-01', 'David Wilson', '+44 20 6666 6666', '', true, now(), now()),
('s7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440000', 'PSS007', 'Year 8', '8B', '2010-06-25', '2023-09-01', 'Michelle Moore', '+44 20 7777 7777', 'Diabetes', true, now(), now()),
('s8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440000', 'PSS008', 'Year 9', '9A', '2009-11-08', '2022-09-01', 'Michael Taylor', '+44 20 8888 8888', '', true, now(), now()),
('s9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440000', 'PSS009', 'Year 10', '10B', '2008-03-14', '2021-09-01', 'Amanda Anderson', '+44 20 9999 9999', '', true, now(), now()),
('saaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440000', 'PSS010', 'Year 11', '11B', '2007-07-21', '2020-09-01', 'Thomas Johnson', '+44 20 1010 1010', '', true, now(), now()),
('sbbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '550e8400-e29b-41d4-a716-446655440000', 'PSS011', 'Year 7', '7A', '2011-10-05', '2024-09-01', 'Patricia Jackson', '+44 20 1111 1010', '', true, now(), now()),
('scccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '550e8400-e29b-41d4-a716-446655440000', 'PSS012', 'Year 8', '8A', '2010-02-28', '2023-09-01', 'Christopher White', '+44 20 1212 1212', 'Allergies', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  student_number = EXCLUDED.student_number,
  year_group = EXCLUDED.year_group,
  form_class = EXCLUDED.form_class;