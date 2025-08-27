-- First, let's clean up and regenerate the timetable data properly
-- Delete all existing timetable entries to avoid conflicts
DELETE FROM timetable_entries WHERE school_id = (SELECT id FROM schools LIMIT 1);

-- Insert fresh timetable data with correct period IDs
-- Get the school and period IDs
WITH school_data AS (
  SELECT id as school_id FROM schools LIMIT 1
),
periods_data AS (
  SELECT id, period_number, school_id FROM timetable_periods WHERE school_id = (SELECT school_id FROM school_data)
)
INSERT INTO timetable_entries (
  school_id, class_id, period_id, subject_id, teacher_id, classroom_id, 
  day_of_week, academic_year, term, is_active, notes
)
SELECT 
  sd.school_id,
  '1A' as class_id,
  p.id as period_id,
  '00000000-0000-0000-0000-000000000000' as subject_id,
  '00000000-0000-0000-0000-000000000000' as teacher_id,
  '00000000-0000-0000-0000-000000000000' as classroom_id,
  day_info.day_of_week,
  '2025' as academic_year,
  'Term 1' as term,
  true as is_active,
  day_info.notes
FROM school_data sd
CROSS JOIN periods_data p
CROSS JOIN (
  -- Monday entries
  VALUES 
    (1, 1, 'English Language - Ms. Wilson - Room 104'),
    (1, 2, 'Mathematics - Mr. Johnson - Room 102'),
    (1, 3, 'Physics - Dr. Brown - Lab 1'),
    (1, 4, 'Chemistry - Dr. Smith - Lab 2'),
    (1, 5, 'History - Mrs. Davis - Room 105'),
    
  -- Tuesday entries  
    (2, 1, 'Mathematics - Mr. Johnson - Room 102'),
    (2, 2, 'Chemistry - Dr. Smith - Lab 2'),
    (2, 3, 'English Literature - Ms. Wilson - Room 104'),
    (2, 4, 'Biology - Dr. Brown - Lab 1'),
    (2, 5, 'Geography - Mrs. Taylor - Room 103'),
    
  -- Wednesday entries
    (3, 1, 'Physics - Dr. Brown - Lab 1'), 
    (3, 2, 'Biology - Dr. Brown - Lab 1'),
    (3, 3, 'Geography - Mrs. Taylor - Room 103'),
    (3, 4, 'Mathematics - Mr. Johnson - Room 102'),
    (3, 5, 'Art - Ms. Parker - Art Room'),
    
  -- Thursday entries
    (4, 1, 'English Language - Ms. Wilson - Room 104'),
    (4, 2, 'History - Mrs. Davis - Room 105'),
    (4, 3, 'Chemistry - Dr. Smith - Lab 2'), 
    (4, 4, 'Physical Education - Mr. Jones - Gym'),
    (4, 5, 'Music - Mrs. Clark - Music Room'),
    
  -- Friday entries
    (5, 1, 'Mathematics - Mr. Johnson - Room 102'),
    (5, 2, 'Physics - Dr. Brown - Lab 1'),
    (5, 3, 'English Literature - Ms. Wilson - Room 104'),
    (5, 4, 'French - Mme. Dubois - Room 106'),
    (5, 5, 'Computer Science - Mr. White - IT Lab')
) AS day_info(day_of_week, period_number, notes)
WHERE p.period_number = day_info.period_number;