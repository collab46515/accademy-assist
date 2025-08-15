BEGIN;

-- Enforce one class per (school, year_group, class_name)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_classes_school_year_class
  ON public.classes (school_id, year_group, class_name);

COMMIT;