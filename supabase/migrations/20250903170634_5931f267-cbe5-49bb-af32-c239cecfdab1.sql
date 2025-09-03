-- Force delete all timetable data completely
TRUNCATE TABLE timetable_entries CASCADE;
TRUNCATE TABLE timetable_periods CASCADE;

-- Also clear any related data that might reference these tables
DELETE FROM class_schedules WHERE period_id IS NOT NULL;

-- Verify the tables are empty
SELECT 'timetable_entries' as table_name, COUNT(*) as remaining_rows FROM timetable_entries
UNION ALL
SELECT 'timetable_periods' as table_name, COUNT(*) as remaining_rows FROM timetable_periods;