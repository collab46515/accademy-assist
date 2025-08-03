-- Master Data Management Schema for School Management
-- This creates the foundational entities that all other modules will reference

-- Schools table (multi-school support)
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_code TEXT NOT NULL UNIQUE,
  school_name TEXT NOT NULL,
  school_type TEXT NOT NULL DEFAULT 'secondary' CHECK (school_type IN ('primary', 'secondary', 'sixth_form', 'all_through')),
  address JSONB DEFAULT '{}'::jsonb,
  contact_details JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  logo_url TEXT,
  website TEXT,
  established_date DATE,
  capacity INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Academic Years table
CREATE TABLE public.academic_years (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  year_name TEXT NOT NULL, -- e.g., "2024-2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  term_structure JSONB DEFAULT '[]'::jsonb, -- Array of terms with dates
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, year_name)
);

-- Year Groups table (Year 7, 8, 9, etc.)
CREATE TABLE public.year_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  year_code TEXT NOT NULL, -- Y7, Y8, Y9, Y10, Y11, Y12, Y13
  year_name TEXT NOT NULL, -- Year 7, Year 8, etc.
  key_stage TEXT, -- KS3, KS4, KS5
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, year_code)
);

-- Houses table (school house system)
CREATE TABLE public.houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  house_code TEXT NOT NULL,
  house_name TEXT NOT NULL,
  house_color TEXT,
  house_motto TEXT,
  head_of_house_id UUID, -- Will reference staff table
  points INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, house_code)
);

-- Departments table
CREATE TABLE public.academic_departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  department_code TEXT NOT NULL,
  department_name TEXT NOT NULL,
  description TEXT,
  head_of_department_id UUID, -- Will reference staff table
  budget_code TEXT,
  location TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, department_code)
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.academic_departments(id),
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  description TEXT,
  key_stage_availability TEXT[] DEFAULT '{}', -- Array of key stages where subject is available
  is_core BOOLEAN DEFAULT false, -- Core subjects like English, Maths
  qualification_type TEXT, -- GCSE, A-Level, etc.
  exam_board TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, subject_code)
);

-- Form Classes table (tutorial groups, registration classes)
CREATE TABLE public.form_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  year_group_id UUID NOT NULL REFERENCES public.year_groups(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  form_code TEXT NOT NULL,
  form_name TEXT NOT NULL,
  form_tutor_id UUID, -- Will reference staff table
  room_id UUID, -- Will reference classrooms table
  capacity INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, academic_year_id, form_code)
);

-- Staff table (comprehensive staff management)
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  staff_number TEXT NOT NULL,
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  address JSONB DEFAULT '{}'::jsonb,
  date_of_birth DATE,
  national_insurance_number TEXT,
  teacher_reference_number TEXT, -- TRN for teachers
  qualifications JSONB DEFAULT '[]'::jsonb,
  employment_start_date DATE NOT NULL,
  employment_end_date DATE,
  contract_type TEXT NOT NULL DEFAULT 'permanent' CHECK (contract_type IN ('permanent', 'fixed_term', 'supply', 'consultant')),
  employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'suspended', 'terminated')),
  job_title TEXT NOT NULL,
  department_id UUID REFERENCES public.academic_departments(id),
  salary_scale TEXT,
  fte_percentage DECIMAL(5,2) DEFAULT 100.00, -- Full Time Equivalent percentage
  teaching_load_percentage DECIMAL(5,2) DEFAULT 0.00,
  safeguarding_training_date DATE,
  dbs_check_date DATE,
  dbs_certificate_number TEXT,
  visa_status TEXT,
  visa_expiry_date DATE,
  subjects_qualified JSONB DEFAULT '[]'::jsonb, -- Array of subject IDs
  additional_roles JSONB DEFAULT '[]'::jsonb, -- Head of Year, etc.
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, staff_number),
  UNIQUE(school_id, email)
);

-- Students table (comprehensive student management)
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_number TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  ethnicity TEXT,
  nationality TEXT,
  religion TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  medical_information JSONB DEFAULT '{}'::jsonb,
  dietary_requirements TEXT[],
  sen_information JSONB DEFAULT '{}'::jsonb,
  pupil_premium BOOLEAN DEFAULT false,
  free_school_meals BOOLEAN DEFAULT false,
  looked_after_child BOOLEAN DEFAULT false,
  year_group_id UUID NOT NULL REFERENCES public.year_groups(id),
  house_id UUID REFERENCES public.houses(id),
  form_class_id UUID REFERENCES public.form_classes(id),
  admission_date DATE NOT NULL,
  leaving_date DATE,
  enrollment_status TEXT NOT NULL DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'left', 'excluded', 'transferred')),
  unique_learner_number TEXT, -- ULN
  previous_school TEXT,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, student_number)
);

-- Parent/Guardian table
CREATE TABLE public.parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_primary TEXT,
  phone_secondary TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  occupation TEXT,
  employer TEXT,
  parental_responsibility BOOLEAN DEFAULT true,
  emergency_contact BOOLEAN DEFAULT false,
  communication_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Student-Parent relationships
CREATE TABLE public.student_parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('mother', 'father', 'guardian', 'step_parent', 'grandparent', 'foster_parent', 'other')),
  priority INTEGER DEFAULT 1, -- 1 = primary contact, 2 = secondary, etc.
  lives_with_student BOOLEAN DEFAULT false,
  financial_responsibility BOOLEAN DEFAULT false,
  academic_contact BOOLEAN DEFAULT true,
  emergency_contact BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, parent_id, relationship_type)
);

-- Staff-Subject specializations
CREATE TABLE public.staff_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  qualification_level TEXT, -- QTS, Degree, Masters, etc.
  years_experience INTEGER DEFAULT 0,
  is_primary_subject BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(staff_id, subject_id)
);

-- Add foreign key constraints that reference staff table
ALTER TABLE public.houses ADD CONSTRAINT fk_houses_head_of_house 
  FOREIGN KEY (head_of_house_id) REFERENCES public.staff(id) ON DELETE SET NULL;

ALTER TABLE public.academic_departments ADD CONSTRAINT fk_departments_head 
  FOREIGN KEY (head_of_department_id) REFERENCES public.staff(id) ON DELETE SET NULL;

ALTER TABLE public.form_classes ADD CONSTRAINT fk_form_classes_tutor 
  FOREIGN KEY (form_tutor_id) REFERENCES public.staff(id) ON DELETE SET NULL;

-- Update existing classrooms table to reference schools
ALTER TABLE public.classrooms ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE;
UPDATE public.classrooms SET school_id = (SELECT id FROM public.schools LIMIT 1) WHERE school_id IS NULL;
ALTER TABLE public.classrooms ALTER COLUMN school_id SET NOT NULL;

-- Add room reference to form classes
ALTER TABLE public.form_classes ADD CONSTRAINT fk_form_classes_room 
  FOREIGN KEY (room_id) REFERENCES public.classrooms(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_schools_active ON public.schools(is_active);
CREATE INDEX idx_academic_years_current ON public.academic_years(school_id, is_current);
CREATE INDEX idx_year_groups_school ON public.year_groups(school_id, sort_order);
CREATE INDEX idx_houses_school ON public.houses(school_id, is_active);
CREATE INDEX idx_departments_school ON public.academic_departments(school_id, is_active);
CREATE INDEX idx_subjects_school ON public.subjects(school_id, is_active);
CREATE INDEX idx_subjects_department ON public.subjects(department_id);
CREATE INDEX idx_form_classes_year_group ON public.form_classes(year_group_id, academic_year_id);
CREATE INDEX idx_staff_school ON public.staff(school_id, employment_status);
CREATE INDEX idx_staff_department ON public.staff(department_id);
CREATE INDEX idx_staff_user ON public.staff(user_id);
CREATE INDEX idx_students_school ON public.students(school_id, enrollment_status);
CREATE INDEX idx_students_year_group ON public.students(year_group_id);
CREATE INDEX idx_students_house ON public.students(house_id);
CREATE INDEX idx_students_form_class ON public.students(form_class_id);
CREATE INDEX idx_students_user ON public.students(user_id);
CREATE INDEX idx_parents_email ON public.parents(email);
CREATE INDEX idx_student_parents_student ON public.student_parents(student_id);
CREATE INDEX idx_student_parents_parent ON public.student_parents(parent_id);
CREATE INDEX idx_staff_subjects_staff ON public.staff_subjects(staff_id);
CREATE INDEX idx_staff_subjects_subject ON public.staff_subjects(subject_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_years_updated_at
  BEFORE UPDATE ON public.academic_years
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_year_groups_updated_at
  BEFORE UPDATE ON public.year_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_houses_updated_at
  BEFORE UPDATE ON public.houses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_departments_updated_at
  BEFORE UPDATE ON public.academic_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_form_classes_updated_at
  BEFORE UPDATE ON public.form_classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parents_updated_at
  BEFORE UPDATE ON public.parents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_subjects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for school-based access
CREATE POLICY "Users can access their school data" 
ON public.schools 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = schools.id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school academic years" 
ON public.academic_years 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = academic_years.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school year groups" 
ON public.year_groups 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = year_groups.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school houses" 
ON public.houses 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = houses.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school departments" 
ON public.academic_departments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = academic_departments.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school subjects" 
ON public.subjects 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = subjects.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school form classes" 
ON public.form_classes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = form_classes.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school staff" 
ON public.staff 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = staff.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access their school students" 
ON public.students 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = students.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can access parents of their school students" 
ON public.parents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN student_parents sp ON sp.parent_id = parents.id
    JOIN students s ON s.id = sp.student_id
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = s.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  ) OR 
  -- Parents can access their own data
  user_id = auth.uid()
);

CREATE POLICY "Users can access student-parent relationships" 
ON public.student_parents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN students s ON s.id = student_parents.student_id
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = s.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  ) OR
  -- Parents can access their own relationships
  EXISTS (
    SELECT 1 FROM parents p
    WHERE p.id = student_parents.parent_id
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can access staff-subject relationships" 
ON public.staff_subjects 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN staff s ON s.id = staff_subjects.staff_id
    WHERE ur.user_id = auth.uid()
    AND (ur.school_id = s.school_id OR ur.role = 'super_admin')
    AND ur.is_active = true
  )
);

-- Insert sample data for a default school
INSERT INTO public.schools (school_code, school_name, school_type, address, contact_details, capacity) VALUES
('ST001', 'Rosebery School', 'secondary', 
 '{"street": "White Horse Lane", "city": "London", "postal_code": "E1 4BD", "country": "United Kingdom"}',
 '{"phone": "+44 20 7375 4239", "email": "admin@rosebery.school.uk", "website": "https://rosebery.school.uk"}',
 1200);

-- Get the school ID for sample data
DO $$
DECLARE
    school_uuid UUID;
    ay_uuid UUID;
    dept_english UUID;
    dept_maths UUID;
    dept_science UUID;
    y7_uuid UUID;
    y8_uuid UUID;
    y9_uuid UUID;
    house1_uuid UUID;
    house2_uuid UUID;
BEGIN
    SELECT id INTO school_uuid FROM public.schools WHERE school_code = 'ST001';
    
    -- Insert academic year
    INSERT INTO public.academic_years (school_id, year_name, start_date, end_date, is_current, term_structure) VALUES
    (school_uuid, '2024-2025', '2024-09-01', '2025-07-20', true, 
     '[{"name": "Autumn Term", "start": "2024-09-01", "end": "2024-12-20"}, 
       {"name": "Spring Term", "start": "2025-01-06", "end": "2025-03-28"}, 
       {"name": "Summer Term", "start": "2025-04-14", "end": "2025-07-20"}]'::jsonb)
    RETURNING id INTO ay_uuid;
    
    -- Insert year groups
    INSERT INTO public.year_groups (school_id, year_code, year_name, key_stage, sort_order) VALUES
    (school_uuid, 'Y7', 'Year 7', 'KS3', 7),
    (school_uuid, 'Y8', 'Year 8', 'KS3', 8),
    (school_uuid, 'Y9', 'Year 9', 'KS3', 9),
    (school_uuid, 'Y10', 'Year 10', 'KS4', 10),
    (school_uuid, 'Y11', 'Year 11', 'KS4', 11),
    (school_uuid, 'Y12', 'Year 12', 'KS5', 12),
    (school_uuid, 'Y13', 'Year 13', 'KS5', 13);
    
    SELECT id INTO y7_uuid FROM public.year_groups WHERE school_id = school_uuid AND year_code = 'Y7';
    SELECT id INTO y8_uuid FROM public.year_groups WHERE school_id = school_uuid AND year_code = 'Y8';
    SELECT id INTO y9_uuid FROM public.year_groups WHERE school_id = school_uuid AND year_code = 'Y9';
    
    -- Insert houses
    INSERT INTO public.houses (school_id, house_code, house_name, house_color, house_motto) VALUES
    (school_uuid, 'JUPITER', 'Jupiter', '#FF6B35', 'Strength through Unity'),
    (school_uuid, 'MARS', 'Mars', '#DC143C', 'Courage and Honor'),
    (school_uuid, 'SATURN', 'Saturn', '#4169E1', 'Wisdom and Knowledge'),
    (school_uuid, 'VENUS', 'Venus', '#32CD32', 'Beauty and Grace')
    RETURNING id INTO house1_uuid;
    
    SELECT id INTO house2_uuid FROM public.houses WHERE school_id = school_uuid AND house_code = 'MARS';
    
    -- Insert departments
    INSERT INTO public.academic_departments (school_id, department_code, department_name, description) VALUES
    (school_uuid, 'ENG', 'English', 'English Language and Literature'),
    (school_uuid, 'MATH', 'Mathematics', 'Mathematics and Statistics'),
    (school_uuid, 'SCI', 'Science', 'Biology, Chemistry, and Physics'),
    (school_uuid, 'HIST', 'History', 'History and Social Studies'),
    (school_uuid, 'LANG', 'Modern Languages', 'French, Spanish, and German'),
    (school_uuid, 'ART', 'Creative Arts', 'Art, Music, and Drama'),
    (school_uuid, 'PE', 'Physical Education', 'Sports and Health Education'),
    (school_uuid, 'ICT', 'Computing', 'Computer Science and ICT')
    RETURNING id INTO dept_english;
    
    SELECT id INTO dept_maths FROM public.academic_departments WHERE school_id = school_uuid AND department_code = 'MATH';
    SELECT id INTO dept_science FROM public.academic_departments WHERE school_id = school_uuid AND department_code = 'SCI';
    
    -- Insert subjects
    INSERT INTO public.subjects (school_id, department_id, subject_code, subject_name, key_stage_availability, is_core, qualification_type) VALUES
    (school_uuid, dept_english, 'ENG', 'English Language', ARRAY['KS3', 'KS4', 'KS5'], true, 'GCSE'),
    (school_uuid, dept_english, 'LIT', 'English Literature', ARRAY['KS3', 'KS4', 'KS5'], true, 'GCSE'),
    (school_uuid, dept_maths, 'MATH', 'Mathematics', ARRAY['KS3', 'KS4', 'KS5'], true, 'GCSE'),
    (school_uuid, dept_science, 'BIO', 'Biology', ARRAY['KS3', 'KS4', 'KS5'], false, 'GCSE'),
    (school_uuid, dept_science, 'CHEM', 'Chemistry', ARRAY['KS3', 'KS4', 'KS5'], false, 'GCSE'),
    (school_uuid, dept_science, 'PHYS', 'Physics', ARRAY['KS3', 'KS4', 'KS5'], false, 'GCSE');
    
    -- Insert form classes
    INSERT INTO public.form_classes (school_id, year_group_id, academic_year_id, form_code, form_name, capacity) VALUES
    (school_uuid, y7_uuid, ay_uuid, '7A', 'Form 7A', 30),
    (school_uuid, y7_uuid, ay_uuid, '7B', 'Form 7B', 30),
    (school_uuid, y7_uuid, ay_uuid, '7C', 'Form 7C', 30),
    (school_uuid, y8_uuid, ay_uuid, '8A', 'Form 8A', 30),
    (school_uuid, y8_uuid, ay_uuid, '8B', 'Form 8B', 30),
    (school_uuid, y9_uuid, ay_uuid, '9A', 'Form 9A', 30);
    
END $$;