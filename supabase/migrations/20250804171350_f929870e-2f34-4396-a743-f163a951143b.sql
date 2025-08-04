-- Create curriculum framework types
CREATE TYPE curriculum_type AS ENUM ('english_national', 'common_core', 'cbse', 'icse', 'cambridge', 'ib', 'custom');
CREATE TYPE academic_period_type AS ENUM ('term', 'semester', 'quarter', 'year', 'custom');
CREATE TYPE coverage_status AS ENUM ('not_started', 'in_progress', 'completed', 'reviewed');

-- Main curriculum frameworks table
CREATE TABLE curriculum_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type curriculum_type NOT NULL,
  description TEXT,
  country TEXT,
  grade_levels JSONB NOT NULL DEFAULT '[]', -- e.g., ["Year 1", "Year 2"] or ["Grade 1", "Grade 2"]
  academic_periods JSONB NOT NULL DEFAULT '[]', -- e.g., ["Autumn", "Spring", "Summer"] or ["Semester 1", "Semester 2"]
  period_type academic_period_type NOT NULL DEFAULT 'term',
  subjects JSONB NOT NULL DEFAULT '[]', -- List of subjects in this curriculum
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_template BOOLEAN NOT NULL DEFAULT false, -- Templates vs school-specific curricula
  school_id UUID, -- NULL for templates, specific school_id for customized versions
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Curriculum topics/content
CREATE TABLE curriculum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES curriculum_frameworks(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  academic_period TEXT, -- Can be NULL for year-long topics
  topic_code TEXT, -- e.g., "MA1-1.1" for structured curricula
  title TEXT NOT NULL,
  description TEXT,
  learning_objectives JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]', -- Skills to be developed
  prerequisites JSONB DEFAULT '[]', -- Topic IDs that should be covered first
  estimated_hours INTEGER,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  topic_order INTEGER DEFAULT 0, -- Order within subject/grade/period
  tags JSONB DEFAULT '[]',
  resources JSONB DEFAULT '[]', -- Links to resources, materials
  assessment_criteria JSONB DEFAULT '[]',
  parent_topic_id UUID REFERENCES curriculum_topics(id), -- For subtopics
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- School curriculum adoption (which framework a school uses)
CREATE TABLE school_curriculum_adoption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  framework_id UUID NOT NULL REFERENCES curriculum_frameworks(id),
  academic_year TEXT NOT NULL,
  customizations JSONB DEFAULT '{}', -- School-specific modifications
  is_active BOOLEAN NOT NULL DEFAULT true,
  adopted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, academic_year)
);

-- Topic coverage tracking
CREATE TABLE topic_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES curriculum_topics(id),
  class_id UUID, -- Reference to class/form
  teacher_id UUID,
  school_id UUID NOT NULL,
  academic_year TEXT NOT NULL,
  status coverage_status NOT NULL DEFAULT 'not_started',
  planned_start_date DATE,
  actual_start_date DATE,
  planned_end_date DATE,
  actual_end_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  teaching_notes TEXT,
  resources_used JSONB DEFAULT '[]',
  assessment_completed BOOLEAN DEFAULT false,
  marked_by UUID,
  marked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(topic_id, class_id, academic_year)
);

-- Curriculum import logs
CREATE TABLE curriculum_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID REFERENCES curriculum_frameworks(id),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  import_type TEXT NOT NULL, -- 'csv', 'excel', 'json'
  total_records INTEGER DEFAULT 0,
  successful_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  imported_by UUID,
  school_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_curriculum_topics_framework_subject ON curriculum_topics(framework_id, subject, grade_level);
CREATE INDEX idx_curriculum_topics_parent ON curriculum_topics(parent_topic_id);
CREATE INDEX idx_topic_coverage_class_year ON topic_coverage(class_id, academic_year);
CREATE INDEX idx_topic_coverage_teacher ON topic_coverage(teacher_id, academic_year);
CREATE INDEX idx_school_curriculum_active ON school_curriculum_adoption(school_id, is_active);

-- Enable RLS
ALTER TABLE curriculum_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_curriculum_adoption ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_imports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Curriculum frameworks - templates visible to all, school-specific only to that school
CREATE POLICY "Templates visible to all authenticated users" ON curriculum_frameworks
FOR SELECT USING (is_template = true OR school_id IS NULL);

CREATE POLICY "School staff can view their curriculum" ON curriculum_frameworks
FOR SELECT USING (
  school_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_frameworks.school_id 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage frameworks" ON curriculum_frameworks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND (ur.school_id = curriculum_frameworks.school_id OR curriculum_frameworks.school_id IS NULL)
    AND ur.role IN ('school_admin', 'super_admin', 'hod') 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

-- Curriculum topics - inherit from framework permissions
CREATE POLICY "Users can view curriculum topics" ON curriculum_topics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM curriculum_frameworks cf
    WHERE cf.id = curriculum_topics.framework_id
    AND (
      cf.is_template = true OR 
      cf.school_id IS NULL OR
      EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = cf.school_id 
        AND ur.is_active = true
      )
    )
  ) OR 
  is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage curriculum topics" ON curriculum_topics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM curriculum_frameworks cf
    JOIN user_roles ur ON (ur.school_id = cf.school_id OR cf.school_id IS NULL)
    WHERE cf.id = curriculum_topics.framework_id
    AND ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin', 'hod') 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

-- School curriculum adoption
CREATE POLICY "School staff can view adoption" ON school_curriculum_adoption
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = school_curriculum_adoption.school_id 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage adoption" ON school_curriculum_adoption
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = school_curriculum_adoption.school_id 
    AND ur.role IN ('school_admin', 'super_admin', 'hod') 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

-- Topic coverage
CREATE POLICY "Teachers can manage their topic coverage" ON topic_coverage
FOR ALL USING (
  teacher_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = topic_coverage.school_id 
    AND ur.role IN ('school_admin', 'super_admin', 'hod') 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

-- Curriculum imports
CREATE POLICY "School staff can view imports" ON curriculum_imports
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_imports.school_id 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage imports" ON curriculum_imports
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_imports.school_id 
    AND ur.role IN ('school_admin', 'super_admin', 'hod') 
    AND ur.is_active = true
  ) OR 
  is_super_admin(auth.uid())
);

-- Insert template curricula
INSERT INTO curriculum_frameworks (name, type, description, country, grade_levels, academic_periods, period_type, subjects, is_template) VALUES
(
  'English National Curriculum',
  'english_national',
  'The statutory curriculum for maintained schools in England',
  'England',
  '["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"]',
  '["Autumn Term", "Spring Term", "Summer Term"]',
  'term',
  '["Mathematics", "English", "Science", "History", "Geography", "Art", "Music", "Physical Education", "Computing", "Design Technology", "Religious Education", "PSHE"]',
  true
),
(
  'Common Core State Standards',
  'common_core',
  'Educational standards for English language arts and mathematics in the United States',
  'United States',
  '["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]',
  '["Semester 1", "Semester 2"]',
  'semester',
  '["Mathematics", "English Language Arts", "Science", "Social Studies", "Physical Education", "Arts"]',
  true
),
(
  'CBSE Curriculum',
  'cbse',
  'Central Board of Secondary Education curriculum for India',
  'India',
  '["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]',
  '["Term 1", "Term 2"]',
  'term',
  '["Mathematics", "English", "Hindi", "Science", "Social Science", "Computer Science", "Physical Education", "Art Education", "Environmental Studies"]',
  true
),
(
  'ICSE Curriculum',
  'icse',
  'Indian Certificate of Secondary Education curriculum',
  'India',
  '["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]',
  '["Semester 1", "Semester 2"]',
  'semester',
  '["Mathematics", "English", "Second Language", "Science", "History", "Geography", "Computer Applications", "Physical Education", "Art", "Music"]',
  true
);

-- Create triggers for updated_at
CREATE TRIGGER update_curriculum_frameworks_updated_at
  BEFORE UPDATE ON curriculum_frameworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculum_topics_updated_at
  BEFORE UPDATE ON curriculum_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_coverage_updated_at
  BEFORE UPDATE ON topic_coverage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();