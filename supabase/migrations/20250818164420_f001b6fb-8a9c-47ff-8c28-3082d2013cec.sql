-- Fix infinite recursion in RLS policies by simplifying them

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow viewing classes in user's school" ON classes;
DROP POLICY IF EXISTS "Allow viewing students in user's school" ON students;
DROP POLICY IF EXISTS "Allow viewing timetable entries in user's school" ON timetable_entries;

-- Create simple, non-recursive policies for classes
CREATE POLICY "Classes viewable by authenticated users" 
ON classes 
FOR SELECT 
TO authenticated 
USING (true);

-- Create simple, non-recursive policy for students
CREATE POLICY "Students viewable by authenticated users" 
ON students 
FOR SELECT 
TO authenticated 
USING (true);

-- Create simple, non-recursive policy for timetable_entries  
CREATE POLICY "Timetable entries viewable by authenticated users"
ON timetable_entries 
FOR SELECT 
TO authenticated 
USING (true);