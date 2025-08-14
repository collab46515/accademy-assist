-- Fix the foreign key constraints for student_parents table
-- The student_id should reference students.id, not auth.users.id

-- Drop the incorrect foreign key constraint
ALTER TABLE student_parents DROP CONSTRAINT IF EXISTS student_parents_student_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE student_parents 
ADD CONSTRAINT student_parents_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

-- Keep the parent_id constraint as is (it correctly references auth.users)
-- Since parent_id represents the parent's user_id from profiles/auth