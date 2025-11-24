-- Add columns to store assessment and interview data
ALTER TABLE enrollment_applications
ADD COLUMN IF NOT EXISTS assessment_data jsonb,
ADD COLUMN IF NOT EXISTS interview_data jsonb;