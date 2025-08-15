BEGIN;

-- Update current_enrollment for existing classes to match actual student counts
WITH student_counts AS (
  SELECT
    s.school_id,
    s.year_group,
    COALESCE(NULLIF(s.form_class, ''), s.year_group) AS class_name,
    COUNT(*) AS actual_count
  FROM public.students s
  WHERE s.school_id IS NOT NULL 
    AND s.year_group IS NOT NULL
    AND s.is_enrolled = true
  GROUP BY s.school_id, s.year_group, COALESCE(NULLIF(s.form_class, ''), s.year_group)
)
UPDATE public.classes c
SET 
  current_enrollment = COALESCE(sc.actual_count, 0),
  updated_at = now()
FROM student_counts sc
WHERE c.school_id = sc.school_id
  AND c.year_group = sc.year_group
  AND c.class_name = sc.class_name;

-- Set enrollment to 0 for classes with no students
UPDATE public.classes 
SET current_enrollment = 0, updated_at = now()
WHERE id NOT IN (
  SELECT DISTINCT c.id
  FROM public.classes c
  INNER JOIN public.students s ON (
    c.school_id = s.school_id
    AND c.year_group = s.year_group
    AND c.class_name = COALESCE(NULLIF(s.form_class, ''), s.year_group)
    AND s.is_enrolled = true
  )
);

COMMIT;