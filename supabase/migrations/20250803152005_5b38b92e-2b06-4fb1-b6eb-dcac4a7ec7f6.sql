-- Insert British Curriculum Subjects
INSERT INTO subjects (school_id, subject_name, subject_code, color_code, periods_per_week, requires_lab) VALUES
-- Core Subjects
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'English Language', 'ENG-LANG', '#10B981', 4, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'English Literature', 'ENG-LIT', '#059669', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Mathematics', 'MATHS', '#3B82F6', 5, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Biology', 'BIO', '#10B981', 3, true),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Chemistry', 'CHEM', '#F59E0B', 3, true),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Physics', 'PHYS', '#EF4444', 3, true),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Religious Education', 'RE', '#8B5CF6', 2, false),

-- Foundation Subjects
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'History', 'HIST', '#F97316', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Geography', 'GEOG', '#06B6D4', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Design & Technology', 'DT', '#84CC16', 2, true),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Computing', 'COMP', '#6366F1', 2, true),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Art & Design', 'ART', '#EC4899', 2, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Music', 'MUS', '#A855F7', 2, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Physical Education', 'PE', '#22C55E', 2, false),

-- Modern Foreign Languages
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'French', 'FR', '#EF4444', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Spanish', 'ES', '#F59E0B', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'German', 'DE', '#6B7280', 3, false),

-- Additional Subjects
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Drama', 'DRAMA', '#BE185D', 2, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Business Studies', 'BUS', '#0F766E', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Psychology', 'PSYC', '#7C3AED', 3, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Form Time', 'FORM', '#6B7280', 5, false),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Assembly', 'ASSEM', '#6B7280', 2, false);

-- Insert British School Classrooms
INSERT INTO classrooms (school_id, room_name, room_type, capacity) VALUES
-- General Classrooms
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Room 101', 'classroom', 30),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Room 102', 'classroom', 30),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Room 103', 'classroom', 30),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Room 201', 'classroom', 28),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Room 202', 'classroom', 28),

-- Science Labs
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Biology Lab', 'laboratory', 24),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Chemistry Lab', 'laboratory', 24),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Physics Lab', 'laboratory', 24),

-- Specialist Rooms
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Computer Suite 1', 'computer_lab', 20),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Computer Suite 2', 'computer_lab', 20),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'DT Workshop', 'workshop', 16),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Art Studio', 'art_room', 20),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Music Room', 'music_room', 25),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Drama Studio', 'drama_studio', 30),

-- Sports Facilities
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Main Gym', 'gym', 60),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Sports Hall', 'gym', 80),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Fitness Suite', 'gym', 20),

-- Common Areas
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Main Hall', 'auditorium', 200),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Library', 'library', 40),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'Sixth Form Common Room', 'common_room', 50);

-- Insert British School Periods (using integers: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday)
INSERT INTO school_periods (school_id, period_number, period_name, start_time, end_time, days_of_week) VALUES
-- Registration and Assembly
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 1, 'Registration', '08:30:00', '08:45:00', ARRAY[1, 2, 3, 4, 5]),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 2, 'Assembly', '08:45:00', '09:00:00', ARRAY[1, 3, 5]),

-- Morning Lessons
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 3, 'Period 1', '09:00:00', '10:00:00', ARRAY[1, 2, 3, 4, 5]),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 4, 'Period 2', '10:00:00', '11:00:00', ARRAY[1, 2, 3, 4, 5]),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 5, 'Break', '11:00:00', '11:20:00', ARRAY[1, 2, 3, 4, 5]),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 6, 'Period 3', '11:20:00', '12:20:00', ARRAY[1, 2, 3, 4, 5]),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 7, 'Period 4', '12:20:00', '13:20:00', ARRAY[1, 2, 3, 4, 5]),

-- Lunch
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 8, 'Lunch', '13:20:00', '14:10:00', ARRAY[1, 2, 3, 4, 5]),

-- Afternoon Lessons
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 9, 'Period 5', '14:10:00', '15:10:00', ARRAY[1, 2, 3, 4, 5]),
('8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 10, 'Period 6', '15:10:00', '16:10:00', ARRAY[1, 2, 3, 4]);