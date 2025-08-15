-- Create classes table for form classes (7A, 7B, etc.)
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL, -- e.g., "7A", "8B"
  year_group TEXT NOT NULL, -- e.g., "Year 7", "Year 8"
  form_teacher_id UUID,
  classroom_id UUID REFERENCES classrooms(id),
  capacity INTEGER DEFAULT 30,
  current_enrollment INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  academic_year TEXT DEFAULT '2024-2025',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(school_id, class_name, academic_year)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "School staff can view classes" 
ON public.classes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = classes.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage classes" 
ON public.classes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = classes.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Add trigger for updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some demo classes for existing schools
INSERT INTO public.classes (school_id, class_name, year_group, capacity) 
SELECT 
  s.id,
  class_name,
  year_group,
  30
FROM schools s
CROSS JOIN (
  VALUES 
    ('R1', 'Reception'), ('R2', 'Reception'),
    ('1A', 'Year 1'), ('1B', 'Year 1'), ('1C', 'Year 1'),
    ('2A', 'Year 2'), ('2B', 'Year 2'), ('2C', 'Year 2'),
    ('3A', 'Year 3'), ('3B', 'Year 3'), ('3C', 'Year 3'),
    ('4A', 'Year 4'), ('4B', 'Year 4'), ('4C', 'Year 4'),
    ('5A', 'Year 5'), ('5B', 'Year 5'), ('5C', 'Year 5'),
    ('6A', 'Year 6'), ('6B', 'Year 6'), ('6C', 'Year 6'),
    ('7A', 'Year 7'), ('7B', 'Year 7'), ('7C', 'Year 7'), ('7D', 'Year 7'),
    ('8A', 'Year 8'), ('8B', 'Year 8'), ('8C', 'Year 8'), ('8D', 'Year 8'),
    ('9A', 'Year 9'), ('9B', 'Year 9'), ('9C', 'Year 9'), ('9D', 'Year 9'),
    ('10A', 'Year 10'), ('10B', 'Year 10'), ('10C', 'Year 10'), ('10D', 'Year 10'),
    ('11A', 'Year 11'), ('11B', 'Year 11'), ('11C', 'Year 11'), ('11D', 'Year 11'),
    ('12A', 'Year 12'), ('12B', 'Year 12'), ('12C', 'Year 12'),
    ('13A', 'Year 13'), ('13B', 'Year 13'), ('13C', 'Year 13')
) AS class_data(class_name, year_group)
WHERE s.is_active = true;