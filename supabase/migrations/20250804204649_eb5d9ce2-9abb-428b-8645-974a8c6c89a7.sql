-- Create a simple lesson plan that should work
INSERT INTO lesson_plans (
  school_id,
  teacher_id,
  title,
  subject,
  year_group,
  lesson_date,
  duration_minutes,
  status
) VALUES (
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'Introduction to Fractions',
  'Mathematics', 
  'Year 7',
  CURRENT_DATE + INTERVAL '1 day',
  60,
  'draft'
);