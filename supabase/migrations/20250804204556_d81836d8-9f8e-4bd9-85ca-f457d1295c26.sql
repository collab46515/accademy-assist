-- Insert sample lesson plans for demonstration
INSERT INTO lesson_plans (
  school_id,
  teacher_id,
  title,
  subject,
  year_group,
  form_class,
  lesson_date,
  duration_minutes,
  status
) VALUES 
(
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'Introduction to Fractions',
  'Mathematics',
  'Year 7',
  '7A',
  '2024-12-20',
  60,
  'draft'
),
(
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe', 
  'Shakespeare''s Romeo and Juliet',
  'English',
  'Year 9',
  '9B',
  '2024-12-21',
  50,
  'submitted'
),
(
  '8cafd4e6-2974-4cf7-aa6e-39c70aef789f',
  'dbe5589f-d4a3-46f1-9112-07cdf908fcbe',
  'Photosynthesis in Plants',
  'Science',
  'Year 8',
  '8C',
  '2024-12-22',
  60,
  'approved'
);