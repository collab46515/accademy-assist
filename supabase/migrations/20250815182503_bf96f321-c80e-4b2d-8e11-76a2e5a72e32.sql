BEGIN;

-- Backfill classes from existing students and update enrollments safely
WITH class_groups AS (
  SELECT
    s.school_id,
    s.year_group,
    COALESCE(NULLIF(s.form_class, ''), s.year_group) AS class_name,
    COUNT(*) AS student_count
  FROM public.students s
  WHERE s.school_id IS NOT NULL AND s.year_group IS NOT NULL
  GROUP BY s.school_id, s.year_group, COALESCE(NULLIF(s.form_class, ''), s.year_group)
)
INSERT INTO public.classes (school_id, class_name, year_group, capacity, current_enrollment, is_active)
SELECT
  cg.school_id,
  cg.class_name,
  cg.year_group,
  30,
  cg.student_count,
  true
FROM class_groups cg
LEFT JOIN public.classes c
  ON c.school_id = cg.school_id
 AND c.year_group = cg.year_group
 AND c.class_name = cg.class_name
WHERE c.id IS NULL;

-- Update current_enrollment for any existing classes to match student counts
WITH class_groups AS (
  SELECT
    s.school_id,
    s.year_group,
    COALESCE(NULLIF(s.form_class, ''), s.year_group) AS class_name,
    COUNT(*) AS student_count
  FROM public.students s
  WHERE s.school_id IS NOT NULL AND s.year_group IS NOT NULL
  GROUP BY s.school_id, s.year_group, COALESCE(NULLIF(s.form_class, ''), s.year_group)
)
UPDATE public.classes c
SET current_enrollment = cg.student_count,
    updated_at = now()
FROM class_groups cg
WHERE c.school_id = cg.school_id
  AND c.year_group = cg.year_group
  AND c.class_name = cg.class_name;

COMMIT;