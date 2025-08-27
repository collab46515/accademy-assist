-- Restore timetable data with proper structure
-- First, create the periods
INSERT INTO public.timetable_periods (school_id, period_number, start_time, end_time, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, '09:00:00', '09:45:00', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, '09:45:00', '10:30:00', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, '10:45:00', '11:30:00', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, '11:30:00', '12:15:00', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, '13:15:00', '14:00:00', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 6, '14:00:00', '14:45:00', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 7, '15:00:00', '15:45:00', true);

-- Create timetable entries for class 1A using actual period IDs
INSERT INTO public.timetable_entries (school_id, class_id, day_of_week, period_id, subject, teacher_name, room)
SELECT 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' as school_id,
  '1A' as class_id,
  day_schedule.day_of_week,
  tp.id as period_id,
  day_schedule.subject,
  day_schedule.teacher_name,
  day_schedule.room
FROM (
  VALUES 
    -- Monday
    ('monday', 1, 'Mathematics', 'Ms. Johnson', 'Room 101'),
    ('monday', 2, 'English', 'Mr. Smith', 'Room 102'),
    ('monday', 3, 'Science', 'Dr. Brown', 'Lab 1'),
    ('monday', 4, 'History', 'Ms. Davis', 'Room 103'),
    ('monday', 5, 'Art', 'Mr. Wilson', 'Art Studio'),
    ('monday', 6, 'PE', 'Coach Taylor', 'Gymnasium'),
    ('monday', 7, 'Music', 'Ms. Adams', 'Music Room'),
    
    -- Tuesday
    ('tuesday', 1, 'Science', 'Dr. Brown', 'Lab 1'),
    ('tuesday', 2, 'Mathematics', 'Ms. Johnson', 'Room 101'),
    ('tuesday', 3, 'English', 'Mr. Smith', 'Room 102'),
    ('tuesday', 4, 'Geography', 'Mr. Clark', 'Room 104'),
    ('tuesday', 5, 'PE', 'Coach Taylor', 'Gymnasium'),
    ('tuesday', 6, 'History', 'Ms. Davis', 'Room 103'),
    ('tuesday', 7, 'Computer Science', 'Mr. Lee', 'Computer Lab'),
    
    -- Wednesday
    ('wednesday', 1, 'English', 'Mr. Smith', 'Room 102'),
    ('wednesday', 2, 'Science', 'Dr. Brown', 'Lab 1'),
    ('wednesday', 3, 'Mathematics', 'Ms. Johnson', 'Room 101'),
    ('wednesday', 4, 'Art', 'Mr. Wilson', 'Art Studio'),
    ('wednesday', 5, 'Music', 'Ms. Adams', 'Music Room'),
    ('wednesday', 6, 'Geography', 'Mr. Clark', 'Room 104'),
    ('wednesday', 7, 'Library', 'Ms. Roberts', 'Library'),
    
    -- Thursday
    ('thursday', 1, 'Mathematics', 'Ms. Johnson', 'Room 101'),
    ('thursday', 2, 'History', 'Ms. Davis', 'Room 103'),
    ('thursday', 3, 'PE', 'Coach Taylor', 'Gymnasium'),
    ('thursday', 4, 'Science', 'Dr. Brown', 'Lab 1'),
    ('thursday', 5, 'English', 'Mr. Smith', 'Room 102'),
    ('thursday', 6, 'Computer Science', 'Mr. Lee', 'Computer Lab'),
    ('thursday', 7, 'Art', 'Mr. Wilson', 'Art Studio'),
    
    -- Friday
    ('friday', 1, 'Geography', 'Mr. Clark', 'Room 104'),
    ('friday', 2, 'PE', 'Coach Taylor', 'Gymnasium'),
    ('friday', 3, 'History', 'Ms. Davis', 'Room 103'),
    ('friday', 4, 'Mathematics', 'Ms. Johnson', 'Room 101'),
    ('friday', 5, 'Science', 'Dr. Brown', 'Lab 1'),
    ('friday', 6, 'English', 'Mr. Smith', 'Room 102'),
    ('friday', 7, 'Assembly', 'Various', 'Main Hall')
) AS day_schedule(day_of_week, period_number, subject, teacher_name, room)
JOIN public.timetable_periods tp ON tp.school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' 
  AND tp.period_number = day_schedule.period_number;