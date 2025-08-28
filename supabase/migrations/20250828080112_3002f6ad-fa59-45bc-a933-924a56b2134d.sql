-- 1) Map placeholder period UUIDs to real timetable_periods for St Marys School and class 1A
WITH school AS (
  SELECT '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid AS school_id
),
period_map AS (
  SELECT 1 AS period_number, '00000000-0000-0000-0000-000000000001'::uuid AS placeholder
  UNION ALL SELECT 2, '00000000-0000-0000-0000-000000000002'
  UNION ALL SELECT 3, '00000000-0000-0000-0000-000000000003'
  UNION ALL SELECT 4, '00000000-0000-0000-0000-000000000004'
  UNION ALL SELECT 5, '00000000-0000-0000-0000-000000000005'
  UNION ALL SELECT 6, '00000000-0000-0000-0000-000000000006'
  UNION ALL SELECT 7, '00000000-0000-0000-0000-000000000007'
  UNION ALL SELECT 8, '00000000-0000-0000-0000-000000000008'
)
UPDATE public.timetable_entries te
SET period_id = tp.id
FROM school s
JOIN period_map pm ON te.period_id = pm.placeholder
JOIN public.timetable_periods tp 
  ON tp.school_id = s.school_id 
 AND tp.period_number = pm.period_number
WHERE te.school_id = s.school_id
  AND te.class_id = '1A';

-- 2) Assign real subject IDs based on period_number mapping where subject is placeholder
WITH school AS (
  SELECT '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid AS school_id
),
subject_ids AS (
  SELECT 
    school_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'Mathematics' LIMIT 1) AS math_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'English Language' LIMIT 1) AS eng_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'History' LIMIT 1) AS hist_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'Geography' LIMIT 1) AS geog_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'Physical Education' LIMIT 1) AS pe_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'Computer Science' LIMIT 1) AS cs_id,
    (SELECT id FROM public.subjects WHERE school_id = school_id AND subject_name = 'Music' LIMIT 1) AS music_id
  FROM school
)
UPDATE public.timetable_entries te
SET subject_id = CASE tp.period_number
  WHEN 1 THEN si.math_id
  WHEN 2 THEN si.eng_id
  WHEN 3 THEN si.hist_id
  WHEN 4 THEN si.geog_id
  WHEN 5 THEN si.pe_id
  WHEN 6 THEN si.cs_id
  WHEN 7 THEN si.music_id
  WHEN 8 THEN si.eng_id
  ELSE si.math_id
END
FROM public.timetable_periods tp
JOIN school s ON s.school_id = tp.school_id
JOIN subject_ids si ON si.school_id = s.school_id
WHERE te.school_id = s.school_id
  AND te.class_id = '1A'
  AND te.period_id = tp.id
  AND te.subject_id = '00000000-0000-0000-0000-000000000000'::uuid;

-- 3) Assign a valid teacher to any placeholder teacher_id
UPDATE public.timetable_entries te
SET teacher_id = '19d96109-42f0-4c0c-8255-e8ae6c76f785'::uuid
WHERE te.school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid
  AND te.class_id = '1A'
  AND te.teacher_id = '00000000-0000-0000-0000-000000000000'::uuid;

-- 4) Assign a valid classroom to any placeholder classroom_id
UPDATE public.timetable_entries te
SET classroom_id = 'f1149c3f-de71-4fbe-b4bf-6658b582d480'::uuid -- Art Studio
WHERE te.school_id = '8cafd4e6-2974-4cf7-aa6e-39c70aef789f'::uuid
  AND te.class_id = '1A'
  AND te.classroom_id = '00000000-0000-0000-0000-000000000000'::uuid;