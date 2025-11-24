-- Add review columns to enrollment_applications table
ALTER TABLE enrollment_applications 
ADD COLUMN IF NOT EXISTS review_data JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS review_notes TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS review_completed BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN enrollment_applications.review_data IS 'Stores assessment scores and review information as JSON';
COMMENT ON COLUMN enrollment_applications.review_notes IS 'Reviewer notes and comments';
COMMENT ON COLUMN enrollment_applications.review_completed IS 'Indicates if the review has been completed and submitted';