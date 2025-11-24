-- Add sub-stage tracking for Assessment and Review stage
ALTER TABLE enrollment_applications 
ADD COLUMN IF NOT EXISTS review_stage_status TEXT DEFAULT 'documents_pending';

-- Add comment explaining the field
COMMENT ON COLUMN enrollment_applications.review_stage_status IS 'Sub-stage status for review process: documents_pending, documents_verified, review_submitted';
