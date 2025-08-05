-- Add foreign key relationship between students and profiles
ALTER TABLE students 
ADD CONSTRAINT students_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

-- Also ensure the profiles table has proper constraints if needed
-- (The migration should handle the relationship properly)