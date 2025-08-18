-- Break cyclic dependency between students and student_parents policies
DROP POLICY IF EXISTS "Users can view students for timetables" ON public.students;

-- Ensure there is still a safe read policy
-- (Already exists: "Allow all authenticated users to read students")
