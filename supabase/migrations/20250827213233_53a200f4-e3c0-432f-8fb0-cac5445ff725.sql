-- Fix timetable entries by updating them to use real period IDs from timetable_periods table

-- Update Period 1 entries
UPDATE timetable_entries 
SET period_id = (
  SELECT id FROM timetable_periods 
  WHERE period_number = 1 AND school_id = timetable_entries.school_id 
  LIMIT 1
)
WHERE period_id = '00000000-0000-0000-0000-000000000001';

-- Update Period 2 entries  
UPDATE timetable_entries 
SET period_id = (
  SELECT id FROM timetable_periods 
  WHERE period_number = 2 AND school_id = timetable_entries.school_id 
  LIMIT 1
)
WHERE period_id = '00000000-0000-0000-0000-000000000002';

-- Update Period 3 entries
UPDATE timetable_entries 
SET period_id = (
  SELECT id FROM timetable_periods 
  WHERE period_number = 3 AND school_id = timetable_entries.school_id 
  LIMIT 1
)
WHERE period_id = '00000000-0000-0000-0000-000000000003';

-- Update Period 4 entries
UPDATE timetable_entries 
SET period_id = (
  SELECT id FROM timetable_periods 
  WHERE period_number = 4 AND school_id = timetable_entries.school_id 
  LIMIT 1
)
WHERE period_id = '00000000-0000-0000-0000-000000000004';

-- Update Period 5 entries
UPDATE timetable_entries 
SET period_id = (
  SELECT id FROM timetable_periods 
  WHERE period_number = 5 AND school_id = timetable_entries.school_id 
  LIMIT 1
)
WHERE period_id = '00000000-0000-0000-0000-000000000005';

-- Update Period 6 entries
UPDATE timetable_entries 
SET period_id = (
  SELECT id FROM timetable_periods 
  WHERE period_number = 6 AND school_id = timetable_entries.school_id 
  LIMIT 1
)
WHERE period_id = '00000000-0000-0000-0000-000000000006';