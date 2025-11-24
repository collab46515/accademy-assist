-- Step 1: Delete all data associated with Anand Niketan school
-- Delete students
DELETE FROM students WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';

-- Delete user roles
DELETE FROM user_roles WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';

-- Delete any other related data
DELETE FROM enrollment_applications WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';
DELETE FROM classes WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';
DELETE FROM activities WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';
DELETE FROM attendance_records WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';
DELETE FROM assignments WHERE school_id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';

-- Delete the Anand Niketan school record
DELETE FROM schools WHERE id = '6c72cb71-a1d0-4969-a2c0-22d4a55061e8';

-- Step 2: Rename St Joseph School to Anand Niketan
UPDATE schools 
SET 
  name = 'Anand Niketan',
  code = 'AN001',
  updated_at = now()
WHERE id = 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6';

-- Step 3: Add constraint to ensure only one active school exists
-- Drop existing constraint if it exists
ALTER TABLE schools DROP CONSTRAINT IF EXISTS single_active_school;

-- Create a unique partial index to ensure only one active school
CREATE UNIQUE INDEX IF NOT EXISTS single_active_school 
ON schools ((1)) 
WHERE is_active = true;

-- Add comment explaining the constraint
COMMENT ON INDEX single_active_school IS 'Ensures only one active school can exist in the system at a time';