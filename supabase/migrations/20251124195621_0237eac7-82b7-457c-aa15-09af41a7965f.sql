-- Add student_type field to fee_structures table to differentiate between new and existing students
ALTER TABLE fee_structures 
ADD COLUMN student_type TEXT DEFAULT 'all' CHECK (student_type IN ('new', 'existing', 'all'));

-- Add index for better query performance
CREATE INDEX idx_fee_structures_student_type ON fee_structures(student_type);

-- Add comment for documentation
COMMENT ON COLUMN fee_structures.student_type IS 'Specifies if fee structure applies to: new (admissions), existing (promotions), or all students';