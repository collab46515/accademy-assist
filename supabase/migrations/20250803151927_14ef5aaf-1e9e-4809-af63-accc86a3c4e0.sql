-- Insert British curriculum subjects with proper color coding
INSERT INTO public.subjects (school_id, subject_name, subject_code, color_code, periods_per_week, requires_lab) VALUES
-- Core subjects
((SELECT id FROM schools LIMIT 1), 'English Language', 'ENG', '#E11D48', 5, false),
((SELECT id FROM schools LIMIT 1), 'English Literature', 'LIT', '#BE185D', 4, false),
((SELECT id FROM schools LIMIT 1), 'Mathematics', 'MAT', '#DC2626', 5, false),
((SELECT id FROM schools LIMIT 1), 'Science (Combined)', 'SCI', '#16A34A', 6, true),
((SELECT id FROM schools LIMIT 1), 'Biology', 'BIO', '#059669', 4, true),
((SELECT id FROM schools LIMIT 1), 'Chemistry', 'CHE', '#0891B2', 4, true),
((SELECT id FROM schools LIMIT 1), 'Physics', 'PHY', '#7C3AED', 4, true),

-- Foundation subjects
((SELECT id FROM schools LIMIT 1), 'Art & Design', 'ART', '#F59E0B', 3, false),
((SELECT id FROM schools LIMIT 1), 'Citizenship', 'CIT', '#6B7280', 2, false),
((SELECT id FROM schools LIMIT 1), 'Computing', 'COM', '#3B82F6', 3, true),
((SELECT id FROM schools LIMIT 1), 'Design & Technology', 'DT', '#EF4444', 3, true),
((SELECT id FROM schools LIMIT 1), 'Geography', 'GEO', '#10B981', 3, false),
((SELECT id FROM schools LIMIT 1), 'History', 'HIS', '#8B5CF6', 3, false),
((SELECT id FROM schools LIMIT 1), 'Modern Foreign Languages', 'MFL', '#F97316', 4, false),
((SELECT id FROM schools LIMIT 1), 'Music', 'MUS', '#EC4899', 2, false),
((SELECT id FROM schools LIMIT 1), 'Physical Education', 'PE', '#22C55E', 3, false),
((SELECT id FROM schools LIMIT 1), 'Religious Education', 'RE', '#A855F7', 2, false),

-- Additional subjects
((SELECT id FROM schools LIMIT 1), 'Drama', 'DRA', '#F472B6', 2, false),
((SELECT id FROM schools LIMIT 1), 'Business Studies', 'BUS', '#0EA5E9', 3, false),
((SELECT id FROM schools LIMIT 1), 'Economics', 'ECO', '#06B6D4', 3, false),
((SELECT id FROM schools LIMIT 1), 'Psychology', 'PSY', '#8B5CF6', 3, false),
((SELECT id FROM schools LIMIT 1), 'Sociology', 'SOC', '#84CC16', 3, false),
((SELECT id FROM schools LIMIT 1), 'Form Time', 'FORM', '#6B7280', 5, false),
((SELECT id FROM schools LIMIT 1), 'Assembly', 'ASSM', '#64748B', 1, false)
ON CONFLICT (school_id, subject_code) DO NOTHING;

-- Insert British school periods (typical UK secondary school structure)
INSERT INTO public.school_periods (school_id, period_number, period_name, start_time, end_time, days_of_week) VALUES
((SELECT id FROM schools LIMIT 1), 1, 'Period 1', '08:30:00', '09:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 2, 'Period 2', '09:30:00', '10:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 3, 'Break', '10:30:00', '10:45:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 4, 'Period 3', '10:45:00', '11:45:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 5, 'Period 4', '11:45:00', '12:45:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 6, 'Lunch', '12:45:00', '13:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 7, 'Period 5', '13:30:00', '14:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
((SELECT id FROM schools LIMIT 1), 8, 'Period 6', '14:30:00', '15:30:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
ON CONFLICT (school_id, period_number) DO NOTHING;

-- Insert British curriculum classrooms
INSERT INTO public.classrooms (school_id, room_name, room_type, capacity) VALUES
-- Science labs
((SELECT id FROM schools LIMIT 1), 'Science Lab 1', 'laboratory', 30),
((SELECT id FROM schools LIMIT 1), 'Science Lab 2', 'laboratory', 30),
((SELECT id FROM schools LIMIT 1), 'Physics Lab', 'laboratory', 24),
((SELECT id FROM schools LIMIT 1), 'Chemistry Lab', 'laboratory', 24),
((SELECT id FROM schools LIMIT 1), 'Biology Lab', 'laboratory', 24),

-- Specialist rooms
((SELECT id FROM schools LIMIT 1), 'Computer Suite 1', 'computer_lab', 30),
((SELECT id FROM schools LIMIT 1), 'Computer Suite 2', 'computer_lab', 25),
((SELECT id FROM schools LIMIT 1), 'DT Workshop', 'workshop', 20),
((SELECT id FROM schools LIMIT 1), 'Art Studio 1', 'art_room', 28),
((SELECT id FROM schools LIMIT 1), 'Art Studio 2', 'art_room', 25),
((SELECT id FROM schools LIMIT 1), 'Music Room 1', 'music_room', 25),
((SELECT id FROM schools LIMIT 1), 'Music Room 2', 'music_room', 20),
((SELECT id FROM schools LIMIT 1), 'Drama Studio', 'drama_studio', 30),
((SELECT id FROM schools LIMIT 1), 'Sports Hall', 'gymnasium', 60),
((SELECT id FROM schools LIMIT 1), 'Library', 'library', 40),

-- General classrooms
((SELECT id FROM schools LIMIT 1), 'Room 101', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 102', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 103', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 201', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 202', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 203', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 301', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Room 302', 'classroom', 30),
((SELECT id FROM schools LIMIT 1), 'Main Hall', 'assembly_hall', 200)
ON CONFLICT (school_id, room_name) DO NOTHING;