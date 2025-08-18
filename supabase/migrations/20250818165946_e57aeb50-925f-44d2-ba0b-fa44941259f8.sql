-- Simplify timetable_entries RLS to avoid cross-table recursion
DROP POLICY IF EXISTS "Parents can view their children's timetable" ON public.timetable_entries;
DROP POLICY IF EXISTS "Students can view their class timetable" ON public.timetable_entries;
DROP POLICY IF EXISTS "Teachers can view relevant timetables" ON public.timetable_entries;
DROP POLICY IF EXISTS "Users can view timetable entries" ON public.timetable_entries;

-- Keep minimal, safe read policy already present:
-- "Allow all authenticated users to read timetable_entries"

-- Optionally, ensure it exists (idempotent create)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='timetable_entries' AND policyname='Allow all authenticated users to read timetable_entries'
  ) THEN
    CREATE POLICY "Allow all authenticated users to read timetable_entries"
    ON public.timetable_entries FOR SELECT TO authenticated USING (true);
  END IF;
END$$;