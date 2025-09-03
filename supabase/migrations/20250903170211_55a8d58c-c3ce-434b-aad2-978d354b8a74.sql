-- Clear all existing timetable entries and periods to start fresh
DELETE FROM timetable_entries;
DELETE FROM timetable_periods;

-- Reset any sequences if they exist
-- This ensures clean numbering when adding new data