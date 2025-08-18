-- Remove ALL policies that could cause infinite recursion
-- and create the absolute simplest policies possible

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view classes for timetable" ON classes;
DROP POLICY IF EXISTS "Students viewable by authenticated users" ON students;  
DROP POLICY IF EXISTS "Timetable entries viewable by authenticated users" ON timetable_entries;

-- Re-enable RLS (in case it was disabled)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create the simplest possible policies without any complex joins
CREATE POLICY "Allow all authenticated users to read students"
ON students FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all authenticated users to read timetable_entries"  
ON timetable_entries FOR SELECT
TO authenticated  
USING (true);

CREATE POLICY "Allow all authenticated users to read classes"
ON classes FOR SELECT  
TO authenticated
USING (true);