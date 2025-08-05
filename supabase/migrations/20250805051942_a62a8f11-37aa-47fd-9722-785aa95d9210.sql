-- Create year_groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.year_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  year_group_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create houses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  house_name TEXT NOT NULL,
  house_color TEXT,
  house_points INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  description TEXT,
  is_core BOOLEAN DEFAULT false,
  department TEXT,
  color_code TEXT DEFAULT '#6366f1',
  periods_per_week INTEGER DEFAULT 3,
  requires_lab BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create curriculum_periods table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.curriculum_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  period_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  period_order INTEGER NOT NULL,
  period_type TEXT DEFAULT 'lesson',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_periods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "School staff can manage year groups" ON public.year_groups
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = year_groups.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can manage houses" ON public.houses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = houses.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can manage subjects" ON public.subjects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = subjects.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can manage periods" ON public.curriculum_periods
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_periods.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Insert GCSE Curriculum Framework Template
INSERT INTO public.curriculum_frameworks (
  name, 
  description, 
  type, 
  country,
  grade_levels,
  academic_periods,
  period_type,
  subjects,
  is_template,
  is_active
) VALUES (
  'GCSE Curriculum Framework',
  'Standard GCSE curriculum framework for UK secondary schools',
  'national',
  'United Kingdom',
  '[
    {"name": "Year 7", "order": 1, "age_range": "11-12", "key_stage": "KS3"},
    {"name": "Year 8", "order": 2, "age_range": "12-13", "key_stage": "KS3"},
    {"name": "Year 9", "order": 3, "age_range": "13-14", "key_stage": "KS3"},
    {"name": "Year 10", "order": 4, "age_range": "14-15", "key_stage": "KS4"},
    {"name": "Year 11", "order": 5, "age_range": "15-16", "key_stage": "KS4"},
    {"name": "Year 12", "order": 6, "age_range": "16-17", "key_stage": "KS5"},
    {"name": "Year 13", "order": 7, "age_range": "17-18", "key_stage": "KS5"}
  ]'::jsonb,
  '[
    {"name": "Autumn Term", "start_date": "2024-09-01", "end_date": "2024-12-20"},
    {"name": "Spring Term", "start_date": "2025-01-06", "end_date": "2025-04-04"},
    {"name": "Summer Term", "start_date": "2025-04-21", "end_date": "2025-07-18"}
  ]'::jsonb,
  'term',
  '[
    {"name": "English Language", "code": "ENG", "is_core": true, "department": "English", "periods_per_week": 4},
    {"name": "English Literature", "code": "LIT", "is_core": true, "department": "English", "periods_per_week": 3},
    {"name": "Mathematics", "code": "MAT", "is_core": true, "department": "Mathematics", "periods_per_week": 4},
    {"name": "Science (Biology)", "code": "BIO", "is_core": true, "department": "Science", "periods_per_week": 3, "requires_lab": true},
    {"name": "Science (Chemistry)", "code": "CHE", "is_core": true, "department": "Science", "periods_per_week": 3, "requires_lab": true},
    {"name": "Science (Physics)", "code": "PHY", "is_core": true, "department": "Science", "periods_per_week": 3, "requires_lab": true},
    {"name": "History", "code": "HIS", "is_core": false, "department": "Humanities", "periods_per_week": 3},
    {"name": "Geography", "code": "GEO", "is_core": false, "department": "Humanities", "periods_per_week": 3},
    {"name": "Religious Studies", "code": "RS", "is_core": false, "department": "Humanities", "periods_per_week": 2},
    {"name": "French", "code": "FRE", "is_core": false, "department": "Modern Languages", "periods_per_week": 3},
    {"name": "Spanish", "code": "SPA", "is_core": false, "department": "Modern Languages", "periods_per_week": 3},
    {"name": "German", "code": "GER", "is_core": false, "department": "Modern Languages", "periods_per_week": 3},
    {"name": "Art & Design", "code": "ART", "is_core": false, "department": "Creative Arts", "periods_per_week": 2},
    {"name": "Music", "code": "MUS", "is_core": false, "department": "Creative Arts", "periods_per_week": 2},
    {"name": "Drama", "code": "DRA", "is_core": false, "department": "Creative Arts", "periods_per_week": 2},
    {"name": "Physical Education", "code": "PE", "is_core": true, "department": "PE", "periods_per_week": 2},
    {"name": "Computing", "code": "COM", "is_core": false, "department": "Technology", "periods_per_week": 2},
    {"name": "Design Technology", "code": "DT", "is_core": false, "department": "Technology", "periods_per_week": 2},
    {"name": "Business Studies", "code": "BUS", "is_core": false, "department": "Business", "periods_per_week": 3},
    {"name": "Economics", "code": "ECO", "is_core": false, "department": "Business", "periods_per_week": 3},
    {"name": "Psychology", "code": "PSY", "is_core": false, "department": "Social Sciences", "periods_per_week": 3},
    {"name": "Sociology", "code": "SOC", "is_core": false, "department": "Social Sciences", "periods_per_week": 3}
  ]'::jsonb,
  true,
  true
) ON CONFLICT DO NOTHING;

-- Create function to populate school master data
CREATE OR REPLACE FUNCTION public.populate_school_master_data(target_school_id UUID)
RETURNS VOID AS $$
DECLARE
  framework_data RECORD;
  year_level JSONB;
  subject_data JSONB;
BEGIN
  -- Get the GCSE framework template
  SELECT * INTO framework_data 
  FROM curriculum_frameworks 
  WHERE name = 'GCSE Curriculum Framework' AND is_template = true;
  
  IF framework_data.id IS NULL THEN
    RAISE EXCEPTION 'GCSE Curriculum Framework template not found';
  END IF;
  
  -- Insert year groups
  FOR year_level IN SELECT * FROM jsonb_array_elements(framework_data.grade_levels)
  LOOP
    INSERT INTO year_groups (school_id, year_group_name, display_order)
    VALUES (
      target_school_id,
      year_level->>'name',
      (year_level->>'order')::INTEGER
    ) ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Insert subjects
  FOR subject_data IN SELECT * FROM jsonb_array_elements(framework_data.subjects)
  LOOP
    INSERT INTO subjects (
      school_id, 
      subject_name, 
      subject_code, 
      is_core, 
      department,
      periods_per_week,
      requires_lab,
      color_code
    )
    VALUES (
      target_school_id,
      subject_data->>'name',
      subject_data->>'code',
      COALESCE((subject_data->>'is_core')::BOOLEAN, false),
      subject_data->>'department',
      COALESCE((subject_data->>'periods_per_week')::INTEGER, 3),
      COALESCE((subject_data->>'requires_lab')::BOOLEAN, false),
      CASE 
        WHEN subject_data->>'department' = 'English' THEN '#ef4444'
        WHEN subject_data->>'department' = 'Mathematics' THEN '#3b82f6'
        WHEN subject_data->>'department' = 'Science' THEN '#10b981'
        WHEN subject_data->>'department' = 'Humanities' THEN '#f59e0b'
        WHEN subject_data->>'department' = 'Modern Languages' THEN '#8b5cf6'
        WHEN subject_data->>'department' = 'Creative Arts' THEN '#ec4899'
        WHEN subject_data->>'department' = 'PE' THEN '#06b6d4'
        WHEN subject_data->>'department' = 'Technology' THEN '#84cc16'
        WHEN subject_data->>'department' = 'Business' THEN '#f97316'
        WHEN subject_data->>'department' = 'Social Sciences' THEN '#6366f1'
        ELSE '#6b7280'
      END
    ) ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Insert standard houses
  INSERT INTO houses (school_id, house_name, house_color) VALUES
    (target_school_id, 'Red House', '#ef4444'),
    (target_school_id, 'Blue House', '#3b82f6'),
    (target_school_id, 'Green House', '#10b981'),
    (target_school_id, 'Yellow House', '#f59e0b')
  ON CONFLICT DO NOTHING;
  
  -- Insert standard curriculum periods
  INSERT INTO curriculum_periods (school_id, period_name, start_time, end_time, period_order, period_type) VALUES
    (target_school_id, 'Period 1', '09:00', '09:50', 1, 'lesson'),
    (target_school_id, 'Period 2', '09:50', '10:40', 2, 'lesson'),
    (target_school_id, 'Break', '10:40', '11:00', 3, 'break'),
    (target_school_id, 'Period 3', '11:00', '11:50', 4, 'lesson'),
    (target_school_id, 'Period 4', '11:50', '12:40', 5, 'lesson'),
    (target_school_id, 'Lunch', '12:40', '13:30', 6, 'lunch'),
    (target_school_id, 'Period 5', '13:30', '14:20', 7, 'lesson'),
    (target_school_id, 'Period 6', '14:20', '15:10', 8, 'lesson')
  ON CONFLICT DO NOTHING;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-populate master data for new schools
CREATE OR REPLACE FUNCTION public.auto_populate_school_master_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Only populate if this is a new school insert
  IF TG_OP = 'INSERT' THEN
    PERFORM populate_school_master_data(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the master data to existing schools that don't have it
DO $$
DECLARE
  school_record RECORD;
BEGIN
  FOR school_record IN SELECT id FROM schools 
  LOOP
    -- Check if school already has subjects
    IF NOT EXISTS (SELECT 1 FROM subjects WHERE school_id = school_record.id) THEN
      PERFORM populate_school_master_data(school_record.id);
    END IF;
  END LOOP;
END;
$$;