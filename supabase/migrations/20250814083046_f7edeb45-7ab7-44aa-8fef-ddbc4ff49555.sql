-- Fix foreign key constraint for student_parents.parent_id to reference profiles instead of auth.users
-- This allows the enrollment process to link parents properly

-- Drop the existing foreign key constraint that references auth.users
ALTER TABLE student_parents 
DROP CONSTRAINT IF EXISTS student_parents_parent_id_fkey;

-- Add new foreign key constraint that references profiles.user_id instead
ALTER TABLE student_parents 
ADD CONSTRAINT student_parents_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

-- Also fix student_id to reference profiles if needed
ALTER TABLE student_parents 
DROP CONSTRAINT IF EXISTS student_parents_student_id_fkey;

-- Add constraint to reference students.id properly (this should be correct already but let's ensure it)
ALTER TABLE student_parents 
ADD CONSTRAINT student_parents_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;