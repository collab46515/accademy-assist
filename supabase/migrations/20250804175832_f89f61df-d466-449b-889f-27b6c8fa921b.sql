-- First, create the curriculum_topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.curriculum_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  framework_id UUID NOT NULL REFERENCES curriculum_frameworks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  academic_period TEXT,
  topic_order INTEGER DEFAULT 1,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  estimated_hours INTEGER DEFAULT 1,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  is_mandatory BOOLEAN DEFAULT true,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.curriculum_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for curriculum topics
CREATE POLICY "School staff can view curriculum topics" 
ON public.curriculum_topics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM curriculum_frameworks cf
    JOIN user_roles ur ON (ur.school_id = cf.school_id OR cf.school_id IS NULL)
    WHERE cf.id = curriculum_topics.framework_id
    AND ur.user_id = auth.uid()
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage curriculum topics" 
ON public.curriculum_topics 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM curriculum_frameworks cf
    JOIN user_roles ur ON (ur.school_id = cf.school_id OR cf.school_id IS NULL)
    WHERE cf.id = curriculum_topics.framework_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Add sample topics for CBSE Curriculum
INSERT INTO public.curriculum_topics (framework_id, title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
SELECT 
  cf.id,
  t.title,
  t.description,
  t.subject,
  t.grade_level,
  t.academic_period,
  t.topic_order,
  t.learning_objectives,
  t.skills,
  t.estimated_hours,
  t.difficulty_level
FROM curriculum_frameworks cf
CROSS JOIN (VALUES
  -- Class 1 Mathematics
  ('Numbers 1-20', 'Introduction to counting and basic number recognition', 'Mathematics', 'Class 1', 'Term 1', 1, '["Count numbers 1-20", "Recognize number symbols", "Understand quantity"]'::jsonb, '["Counting", "Number recognition", "Quantity concepts"]'::jsonb, 8, 1),
  ('Basic Addition', 'Simple addition within 10', 'Mathematics', 'Class 1', 'Term 1', 2, '["Add numbers within 10", "Use concrete objects for addition", "Understand the + symbol"]'::jsonb, '["Addition", "Problem solving", "Mathematical reasoning"]'::jsonb, 10, 2),
  ('Shapes and Patterns', 'Basic geometric shapes and simple patterns', 'Mathematics', 'Class 1', 'Term 2', 3, '["Identify basic shapes", "Create simple patterns", "Recognize shapes in environment"]'::jsonb, '["Shape recognition", "Pattern making", "Spatial awareness"]'::jsonb, 6, 1),
  
  -- Class 1 English
  ('Alphabet Recognition', 'Learning to identify and write letters A-Z', 'English', 'Class 1', 'Term 1', 1, '["Recognize all letters", "Write uppercase and lowercase", "Know letter sounds"]'::jsonb, '["Reading", "Writing", "Phonics"]'::jsonb, 12, 1),
  ('Simple Words', 'Reading and writing basic 3-letter words', 'English', 'Class 1', 'Term 1', 2, '["Read CVC words", "Write simple words", "Build vocabulary"]'::jsonb, '["Reading", "Writing", "Vocabulary"]'::jsonb, 10, 2),
  ('Rhymes and Stories', 'Listening to rhymes and simple stories', 'English', 'Class 1', 'Term 2', 3, '["Recite simple rhymes", "Listen to stories", "Answer basic questions"]'::jsonb, '["Listening", "Speaking", "Comprehension"]'::jsonb, 8, 1),
  
  -- Class 6 Science
  ('Food and Nutrition', 'Understanding food sources and balanced diet', 'Science', 'Class 6', 'Term 1', 1, '["Identify food sources", "Understand balanced diet", "Know nutrients and their functions"]'::jsonb, '["Scientific observation", "Classification", "Health awareness"]'::jsonb, 15, 3),
  ('Light, Shadows and Reflections', 'Properties of light and formation of shadows', 'Science', 'Class 6', 'Term 1', 2, '["Understand properties of light", "Explain shadow formation", "Study reflection"]'::jsonb, '["Observation", "Experimentation", "Analysis"]'::jsonb, 18, 3),
  ('Motion and Measurement', 'Types of motion and measurement of length', 'Science', 'Class 6', 'Term 2', 3, '["Classify types of motion", "Use measuring instruments", "Understand units of measurement"]'::jsonb, '["Measurement", "Classification", "Problem solving"]'::jsonb, 16, 3),
  
  -- Class 10 Mathematics
  ('Real Numbers', 'Properties and operations on real numbers', 'Mathematics', 'Class 10', 'Term 1', 1, '["Understand rational and irrational numbers", "Apply Euclids algorithm", "Work with surds"]'::jsonb, '["Logical reasoning", "Problem solving", "Mathematical proof"]'::jsonb, 25, 4),
  ('Polynomials', 'Operations on polynomials and their applications', 'Mathematics', 'Class 10', 'Term 1', 2, '["Perform polynomial operations", "Find zeros of polynomials", "Apply remainder theorem"]'::jsonb, '["Algebraic manipulation", "Analytical thinking", "Problem solving"]'::jsonb, 22, 4),
  ('Coordinate Geometry', 'Distance and section formulas in coordinate plane', 'Mathematics', 'Class 10', 'Term 2', 3, '["Calculate distances between points", "Find section points", "Determine areas of triangles"]'::jsonb, '["Spatial reasoning", "Analytical geometry", "Problem solving"]'::jsonb, 20, 4)
) AS t(title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
WHERE cf.name = 'CBSE Curriculum';

-- Add sample topics for English National Curriculum
INSERT INTO public.curriculum_topics (framework_id, title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
SELECT 
  cf.id,
  t.title,
  t.description,
  t.subject,
  t.grade_level,
  t.academic_period,
  t.topic_order,
  t.learning_objectives,
  t.skills,
  t.estimated_hours,
  t.difficulty_level
FROM curriculum_frameworks cf
CROSS JOIN (VALUES
  -- Year 1 Mathematics
  ('Number and Place Value', 'Counting, reading and writing numbers to 100', 'Mathematics', 'Year 1', 'Autumn Term', 1, '["Count to 100", "Read and write numbers", "Understand place value"]'::jsonb, '["Counting", "Number recognition", "Place value"]'::jsonb, 15, 1),
  ('Addition and Subtraction', 'Mental and written methods within 20', 'Mathematics', 'Year 1', 'Autumn Term', 2, '["Add and subtract within 20", "Use number bonds", "Solve word problems"]'::jsonb, '["Mental arithmetic", "Problem solving", "Number bonds"]'::jsonb, 18, 2),
  ('Measurement', 'Length, weight, capacity and time', 'Mathematics', 'Year 1', 'Spring Term', 3, '["Compare lengths and weights", "Tell time to hour and half hour", "Use standard units"]'::jsonb, '["Measurement", "Comparison", "Time telling"]'::jsonb, 12, 2),
  
  -- Year 1 English
  ('Phonics and Reading', 'Systematic synthetic phonics programme', 'English', 'Year 1', 'Autumn Term', 1, '["Apply phonic knowledge", "Read common exception words", "Blend sounds to read words"]'::jsonb, '["Phonics", "Decoding", "Reading fluency"]'::jsonb, 20, 1),
  ('Writing', 'Form letters correctly and compose sentences', 'English', 'Year 1', 'Autumn Term', 2, '["Form letters correctly", "Compose sentences orally", "Use finger spaces"]'::jsonb, '["Handwriting", "Composition", "Grammar"]'::jsonb, 15, 2),
  ('Poetry and Performance', 'Learning and reciting poems', 'English', 'Year 1', 'Spring Term', 3, '["Learn poems by heart", "Perform with expression", "Understand rhythm"]'::jsonb, '["Memory", "Performance", "Expression"]'::jsonb, 8, 1),
  
  -- Year 6 Science
  ('Living Things and Habitats', 'Classification and adaptation of living things', 'Science', 'Year 6', 'Autumn Term', 1, '["Classify organisms", "Understand adaptation", "Study food chains"]'::jsonb, '["Classification", "Scientific reasoning", "Data analysis"]'::jsonb, 16, 3),
  ('Animals including Humans', 'Circulatory system and healthy lifestyle', 'Science', 'Year 6', 'Autumn Term', 2, '["Understand circulatory system", "Know about healthy lifestyle", "Study heart function"]'::jsonb, '["Scientific inquiry", "Health awareness", "Investigation"]'::jsonb, 14, 3),
  ('Light and Vision', 'How light travels and how we see', 'Science', 'Year 6', 'Spring Term', 3, '["Understand light travel", "Explain how we see", "Study shadows and reflection"]'::jsonb, '["Scientific explanation", "Investigation", "Observation"]'::jsonb, 12, 3)
) AS t(title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
WHERE cf.name = 'English National Curriculum';

-- Add sample topics for Common Core
INSERT INTO public.curriculum_topics (framework_id, title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
SELECT 
  cf.id,
  t.title,
  t.description,
  t.subject,
  t.grade_level,
  t.academic_period,
  t.topic_order,
  t.learning_objectives,
  t.skills,
  t.estimated_hours,
  t.difficulty_level
FROM curriculum_frameworks cf
CROSS JOIN (VALUES
  -- Kindergarten Mathematics
  ('Counting and Cardinality', 'Count to 100 and understand number relationships', 'Mathematics', 'Kindergarten', 'Semester 1', 1, '["Count to 100 by ones and tens", "Compare numbers", "Understand cardinality"]'::jsonb, '["Counting", "Number sense", "Comparison"]'::jsonb, 20, 1),
  ('Operations and Algebraic Thinking', 'Addition and subtraction within 10', 'Mathematics', 'Kindergarten', 'Semester 1', 2, '["Add and subtract within 10", "Decompose numbers", "Solve word problems"]'::jsonb, '["Addition", "Subtraction", "Problem solving"]'::jsonb, 18, 2),
  ('Geometry', 'Identify and describe shapes', 'Mathematics', 'Kindergarten', 'Semester 2', 3, '["Identify 2D and 3D shapes", "Describe shape attributes", "Compare shapes"]'::jsonb, '["Shape recognition", "Spatial reasoning", "Geometry"]'::jsonb, 10, 1),
  
  -- Grade 1 English Language Arts
  ('Reading Foundations', 'Phonics and word recognition skills', 'English Language Arts', 'Grade 1', 'Semester 1', 1, '["Know letter-sound correspondences", "Decode regularly spelled words", "Read with fluency"]'::jsonb, '["Phonics", "Decoding", "Fluency"]'::jsonb, 25, 1),
  ('Reading Comprehension', 'Understanding key ideas and details', 'English Language Arts', 'Grade 1', 'Semester 1', 2, '["Ask and answer questions", "Retell stories", "Identify main topic"]'::jsonb, '["Comprehension", "Questioning", "Summarizing"]'::jsonb, 20, 2),
  ('Writing', 'Narrative, informative and opinion writing', 'English Language Arts', 'Grade 1', 'Semester 2', 3, '["Write narratives", "Write informative texts", "Write opinion pieces"]'::jsonb, '["Narrative writing", "Informative writing", "Opinion writing"]'::jsonb, 22, 2),
  
  -- Grade 5 Mathematics
  ('Number and Operations', 'Multi-digit arithmetic and fractions', 'Mathematics', 'Grade 5', 'Semester 1', 1, '["Perform multi-digit operations", "Add and subtract fractions", "Multiply fractions"]'::jsonb, '["Multi-digit arithmetic", "Fraction operations", "Problem solving"]'::jsonb, 30, 3),
  ('Measurement and Data', 'Converting measurements and understanding volume', 'Mathematics', 'Grade 5', 'Semester 1', 2, '["Convert measurements", "Understand volume concepts", "Interpret data"]'::jsonb, '["Measurement conversion", "Volume", "Data interpretation"]'::jsonb, 25, 3),
  ('Geometry', 'Properties of shapes and coordinate system', 'Mathematics', 'Grade 5', 'Semester 2', 3, '["Classify shapes by properties", "Graph points on coordinate plane", "Find areas"]'::jsonb, '["Shape classification", "Coordinate geometry", "Area calculation"]'::jsonb, 20, 3)
) AS t(title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
WHERE cf.name = 'Common Core State Standards';

-- Add sample topics for ICSE Curriculum
INSERT INTO public.curriculum_topics (framework_id, title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
SELECT 
  cf.id,
  t.title,
  t.description,
  t.subject,
  t.grade_level,
  t.academic_period,
  t.topic_order,
  t.learning_objectives,
  t.skills,
  t.estimated_hours,
  t.difficulty_level
FROM curriculum_frameworks cf
CROSS JOIN (VALUES
  -- Class 1 Mathematics
  ('Number Concepts', 'Understanding numbers 1-50 and counting', 'Mathematics', 'Class 1', 'Semester 1', 1, '["Count objects up to 50", "Recognize number patterns", "Compare quantities"]'::jsonb, '["Counting", "Pattern recognition", "Number comparison"]'::jsonb, 16, 1),
  ('Basic Operations', 'Introduction to addition and subtraction', 'Mathematics', 'Class 1', 'Semester 1', 2, '["Add numbers within 20", "Subtract numbers within 20", "Solve simple word problems"]'::jsonb, '["Addition", "Subtraction", "Word problems"]'::jsonb, 14, 2),
  ('Geometry Basics', 'Shapes, sizes and spatial concepts', 'Mathematics', 'Class 1', 'Semester 2', 3, '["Identify basic shapes", "Compare sizes", "Understand spatial relationships"]'::jsonb, '["Shape identification", "Size comparison", "Spatial reasoning"]'::jsonb, 10, 1),
  
  -- Class 1 English
  ('Language Skills', 'Vocabulary building and sentence formation', 'English', 'Class 1', 'Semester 1', 1, '["Build basic vocabulary", "Form simple sentences", "Use correct pronunciation"]'::jsonb, '["Vocabulary", "Sentence formation", "Pronunciation"]'::jsonb, 18, 1),
  ('Reading Comprehension', 'Understanding simple texts and stories', 'English', 'Class 1', 'Semester 1', 2, '["Read simple texts", "Answer comprehension questions", "Identify main characters"]'::jsonb, '["Reading", "Comprehension", "Character identification"]'::jsonb, 15, 2),
  ('Creative Expression', 'Story telling and creative writing', 'English', 'Class 1', 'Semester 2', 3, '["Tell simple stories", "Express ideas creatively", "Use imagination in writing"]'::jsonb, '["Storytelling", "Creative writing", "Imagination"]'::jsonb, 12, 2),
  
  -- Class 8 Science
  ('Force and Pressure', 'Understanding forces and their effects', 'Science', 'Class 8', 'Semester 1', 1, '["Define force and pressure", "Study types of forces", "Calculate pressure"]'::jsonb, '["Scientific concepts", "Calculation", "Practical application"]'::jsonb, 20, 3),
  ('Chemical Effects of Electric Current', 'Electrolysis and chemical reactions', 'Science', 'Class 8', 'Semester 1', 2, '["Understand electrolysis", "Study chemical effects of current", "Perform experiments"]'::jsonb, '["Experimentation", "Chemical understanding", "Scientific method"]'::jsonb, 18, 4),
  ('Pollution of Air and Water', 'Environmental science and conservation', 'Science', 'Class 8', 'Semester 2', 3, '["Identify pollution sources", "Understand environmental impact", "Suggest conservation methods"]'::jsonb, '["Environmental awareness", "Critical thinking", "Problem solving"]'::jsonb, 16, 3)
) AS t(title, description, subject, grade_level, academic_period, topic_order, learning_objectives, skills, estimated_hours, difficulty_level)
WHERE cf.name = 'ICSE Curriculum';

-- Create topic_coverage table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.topic_coverage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
  school_id UUID NOT NULL,
  academic_year TEXT NOT NULL,
  teacher_id UUID,
  class_group TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'reviewed')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  hours_taught INTEGER DEFAULT 0,
  start_date DATE,
  completion_date DATE,
  notes TEXT,
  resources_used JSONB DEFAULT '[]'::jsonb,
  assessment_scores JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on topic_coverage
ALTER TABLE public.topic_coverage ENABLE ROW LEVEL SECURITY;

-- Create policies for topic_coverage
CREATE POLICY "School staff can view topic coverage" 
ON public.topic_coverage 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = topic_coverage.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Teachers can manage their topic coverage" 
ON public.topic_coverage 
FOR ALL 
USING (
  (teacher_id = auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = topic_coverage.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create school_curriculum_adoption table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.school_curriculum_adoption (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  framework_id UUID NOT NULL REFERENCES curriculum_frameworks(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  adopted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  customizations JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  adopted_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, framework_id, academic_year)
);

-- Enable RLS on school_curriculum_adoption
ALTER TABLE public.school_curriculum_adoption ENABLE ROW LEVEL SECURITY;

-- Create policies for school_curriculum_adoption
CREATE POLICY "School staff can view curriculum adoption" 
ON public.school_curriculum_adoption 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_curriculum_adoption.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage curriculum adoption" 
ON public.school_curriculum_adoption 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_curriculum_adoption.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create update trigger for curriculum_topics
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_curriculum_topics_updated_at
    BEFORE UPDATE ON public.curriculum_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_coverage_updated_at
    BEFORE UPDATE ON public.topic_coverage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();