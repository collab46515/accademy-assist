-- Delete all timetable entries for class 1A in St Marys School to avoid duplicates
DELETE FROM public.timetable_entries
WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid
  AND class_id = '1A';

-- Create properly structured timetable entries for class 1A with real IDs
WITH school AS (
  SELECT '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid AS school_id
),
subject_ids AS (
  SELECT 
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'Mathematics' LIMIT 1) AS math_id,
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'English Language' LIMIT 1) AS eng_id,
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'History' LIMIT 1) AS hist_id,
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'Geography' LIMIT 1) AS geog_id,
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'Physical Education' LIMIT 1) AS pe_id,
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'Computer Science' LIMIT 1) AS cs_id,
    (SELECT id FROM public.subjects WHERE school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND subject_name = 'Music' LIMIT 1) AS music_id
),
schedule AS (
  VALUES 
    -- Monday (day_of_week = 1)
    (1, 1, 'math_id'),
    (1, 2, 'eng_id'),
    (1, 3, 'hist_id'),
    (1, 4, 'geog_id'),
    (1, 5, 'pe_id'),
    (1, 6, 'cs_id'),
    -- Tuesday (day_of_week = 2)
    (2, 1, 'eng_id'),
    (2, 2, 'math_id'),
    (2, 3, 'geog_id'),
    (2, 4, 'hist_id'),
    (2, 5, 'music_id'),
    (2, 6, 'pe_id'),
    -- Wednesday (day_of_week = 3)
    (3, 1, 'geog_id'),
    (3, 2, 'hist_id'),
    (3, 3, 'math_id'),
    (3, 4, 'eng_id'),
    (3, 5, 'cs_id'),
    (3, 6, 'music_id'),
    -- Thursday (day_of_week = 4)
    (4, 1, 'hist_id'),
    (4, 2, 'pe_id'),
    (4, 3, 'eng_id'),
    (4, 4, 'math_id'),
    (4, 5, 'geog_id'),
    (4, 6, 'cs_id'),
    -- Friday (day_of_week = 5)
    (5, 1, 'math_id'),
    (5, 2, 'music_id'),
    (5, 3, 'pe_id'),
    (5, 4, 'eng_id'),
    (5, 5, 'hist_id'),
    (5, 6, 'geog_id')
)
INSERT INTO public.timetable_entries (
  school_id, class_id, day_of_week, period_id, subject_id, teacher_id, classroom_id, academic_year, term, is_active
)
SELECT
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid,
  '1A',
  s.day_of_week,
  tp.id,
  CASE s.subject_key
    WHEN 'math_id' THEN si.math_id
    WHEN 'eng_id' THEN si.eng_id
    WHEN 'hist_id' THEN si.hist_id
    WHEN 'geog_id' THEN si.geog_id
    WHEN 'pe_id' THEN si.pe_id
    WHEN 'cs_id' THEN si.cs_id
    WHEN 'music_id' THEN si.music_id
  END,
  '19d96109-42f0-4c0c-8255-e8ae6c76f785'::uuid,
  'f1149c3f-de71-4fbe-b4bf-6658b582d480'::uuid,
  '2025',
  'Term 1',
  true
FROM schedule s(day_of_week, period_number, subject_key)
JOIN public.timetable_periods tp ON tp.school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f' AND tp.period_number = s.period_number
CROSS JOIN subject_ids si;