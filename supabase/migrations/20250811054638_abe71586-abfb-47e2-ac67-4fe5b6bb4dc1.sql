-- Clean up duplicate draft applications, keeping only the most recent one per user/school/pathway combination

-- First, let's see what duplicates we have
WITH duplicate_drafts AS (
  SELECT 
    id,
    student_name,
    school_id,
    pathway,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY student_name, school_id, pathway 
      ORDER BY created_at DESC
    ) as rn
  FROM enrollment_applications 
  WHERE status = 'draft'
    AND student_name IS NOT NULL
    AND student_name != ''
)
-- Delete all but the most recent draft for each combination
DELETE FROM enrollment_applications 
WHERE id IN (
  SELECT id FROM duplicate_drafts WHERE rn > 1
);

-- Also clean up any drafts that are older than 7 days to prevent accumulation
DELETE FROM enrollment_applications 
WHERE status = 'draft' 
  AND created_at < NOW() - INTERVAL '7 days';