-- Create gradebook_records table for auto-sync
CREATE TABLE IF NOT EXISTS public.gradebook_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  topic_id UUID REFERENCES public.curriculum_topics(id),
  skill_id UUID NULL, -- For specific skills within topics
  subject_id UUID NULL, -- Subject reference
  assessment_type TEXT NOT NULL DEFAULT 'assignment', -- 'assignment', 'test', 'quiz', etc.
  assessment_ref UUID NOT NULL, -- Links back to assignment_submissions.id
  grade_text TEXT NOT NULL, -- "GDS", "7", "B+", etc.
  grade_numeric DECIMAL(4,2) NULL, -- Converted numeric value for calculations
  max_marks INTEGER NULL, -- Total possible marks
  weight DECIMAL(3,2) DEFAULT 1.0, -- Weight for calculations
  date_recorded TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  teacher_id UUID NOT NULL,
  notes TEXT NULL, -- Teacher feedback
  is_final BOOLEAN DEFAULT false, -- Becomes true when term ends
  school_id UUID NOT NULL,
  academic_period TEXT NULL, -- 'term_1', 'term_2', etc.
  year_group TEXT NULL,
  form_class TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gradebook_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can view gradebook records for their school" 
ON public.gradebook_records 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = gradebook_records.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "System can manage gradebook records" 
ON public.gradebook_records 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = gradebook_records.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_gradebook_records_student_id ON public.gradebook_records(student_id);
CREATE INDEX idx_gradebook_records_topic_id ON public.gradebook_records(topic_id);
CREATE INDEX idx_gradebook_records_assessment_ref ON public.gradebook_records(assessment_ref);
CREATE INDEX idx_gradebook_records_school_id ON public.gradebook_records(school_id);
CREATE INDEX idx_gradebook_records_date_recorded ON public.gradebook_records(date_recorded);

-- Create trigger for updated_at
CREATE TRIGGER update_gradebook_records_updated_at
BEFORE UPDATE ON public.gradebook_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to convert grades to numeric values
CREATE OR REPLACE FUNCTION public.convert_grade_to_numeric(grade_text TEXT, grading_system TEXT DEFAULT 'uk_national')
RETURNS DECIMAL(4,2) AS $$
BEGIN
  -- UK National Curriculum grading
  IF grading_system = 'uk_national' THEN
    CASE UPPER(grade_text)
      WHEN 'WT' THEN RETURN 1.0; -- Working Towards
      WHEN 'WA' THEN RETURN 2.0; -- Working At
      WHEN 'GDS' THEN RETURN 3.0; -- Greater Depth
      WHEN 'EXS' THEN RETURN 2.5; -- Expected Standard
      ELSE
        -- Try to parse as number (1-9 scale)
        IF grade_text ~ '^[0-9]+(\.[0-9]+)?$' THEN
          RETURN grade_text::DECIMAL(4,2);
        END IF;
        RETURN NULL;
    END CASE;
  END IF;
  
  -- Letter grades (A-F)
  IF grading_system = 'letter' THEN
    CASE UPPER(grade_text)
      WHEN 'A+' THEN RETURN 4.3;
      WHEN 'A' THEN RETURN 4.0;
      WHEN 'A-' THEN RETURN 3.7;
      WHEN 'B+' THEN RETURN 3.3;
      WHEN 'B' THEN RETURN 3.0;
      WHEN 'B-' THEN RETURN 2.7;
      WHEN 'C+' THEN RETURN 2.3;
      WHEN 'C' THEN RETURN 2.0;
      WHEN 'C-' THEN RETURN 1.7;
      WHEN 'D+' THEN RETURN 1.3;
      WHEN 'D' THEN RETURN 1.0;
      WHEN 'F' THEN RETURN 0.0;
      ELSE RETURN NULL;
    END CASE;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update topic mastery
CREATE OR REPLACE FUNCTION public.update_topic_mastery(topic_uuid UUID, student_uuid UUID)
RETURNS VOID AS $$
DECLARE
  avg_grade DECIMAL(4,2);
  total_assessments INTEGER;
  mastery_level TEXT;
BEGIN
  -- Calculate average grade for this topic
  SELECT 
    AVG(grade_numeric),
    COUNT(*)
  INTO avg_grade, total_assessments
  FROM public.gradebook_records
  WHERE topic_id = topic_uuid 
  AND student_id = student_uuid
  AND grade_numeric IS NOT NULL;
  
  -- Determine mastery level
  IF avg_grade IS NULL OR total_assessments = 0 THEN
    mastery_level := 'not_assessed';
  ELSIF avg_grade >= 3.0 THEN
    mastery_level := 'mastered';
  ELSIF avg_grade >= 2.0 THEN
    mastery_level := 'developing';
  ELSE
    mastery_level := 'emerging';
  END IF;
  
  -- Update or create topic progress record (you might need to create this table)
  -- This is a placeholder - adjust based on your topic progress tracking
  INSERT INTO public.topic_progress (student_id, topic_id, mastery_level, average_grade, total_assessments, updated_at)
  VALUES (student_uuid, topic_uuid, mastery_level, avg_grade, total_assessments, now())
  ON CONFLICT (student_id, topic_id)
  DO UPDATE SET
    mastery_level = EXCLUDED.mastery_level,
    average_grade = EXCLUDED.average_grade,
    total_assessments = EXCLUDED.total_assessments,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create topic_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.topic_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  topic_id UUID REFERENCES public.curriculum_topics(id),
  mastery_level TEXT NOT NULL DEFAULT 'not_assessed', -- 'emerging', 'developing', 'mastered', 'not_assessed'
  average_grade DECIMAL(4,2) NULL,
  total_assessments INTEGER DEFAULT 0,
  last_assessment_date DATE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, topic_id)
);

-- Enable RLS on topic_progress
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for topic_progress
CREATE POLICY "School staff can view topic progress" 
ON public.topic_progress 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM curriculum_topics ct
    JOIN user_roles ur ON ur.school_id = ct.school_id
    WHERE ct.id = topic_progress.topic_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "System can manage topic progress" 
ON public.topic_progress 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM curriculum_topics ct
    JOIN user_roles ur ON ur.school_id = ct.school_id
    WHERE ct.id = topic_progress.topic_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('teacher', 'school_admin', 'hod')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create trigger for topic_progress updated_at
CREATE TRIGGER update_topic_progress_updated_at
BEFORE UPDATE ON public.topic_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();