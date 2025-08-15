-- Remove duplicate classes, keeping only those with students or the first occurrence
WITH duplicate_classes AS (
  SELECT 
    id,
    class_name,
    year_group,
    school_id,
    current_enrollment,
    ROW_NUMBER() OVER (PARTITION BY class_name, year_group ORDER BY current_enrollment DESC, created_at ASC) as rn
  FROM classes
),
classes_to_delete AS (
  SELECT id
  FROM duplicate_classes 
  WHERE rn > 1 AND current_enrollment = 0
)
DELETE FROM classes 
WHERE id IN (SELECT id FROM classes_to_delete);