-- Create activities table for persistent storage
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('sports', 'arts', 'academic', 'service', 'duke-of-edinburgh')),
  instructor text NOT NULL,
  schedule text NOT NULL,
  location text,
  capacity integer NOT NULL DEFAULT 20,
  enrolled integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled', 'completed')),
  cost numeric,
  description text,
  requirements text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create activities_participants table for student enrollment
CREATE TABLE IF NOT EXISTS public.activities_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  school_id uuid NOT NULL,
  enrollment_date timestamp with time zone NOT NULL DEFAULT now(),
  attendance_count integer DEFAULT 0,
  achievements text[],
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(activity_id, student_id)
);

-- Create house_points table for activities
CREATE TABLE IF NOT EXISTS public.house_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  school_id uuid NOT NULL,
  house text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  reason text NOT NULL,
  activity_id uuid REFERENCES public.activities(id) ON DELETE SET NULL,
  awarded_by uuid NOT NULL,
  awarded_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_school_id ON public.activities(school_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_participants_activity_id ON public.activities_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_activities_participants_student_id ON public.activities_participants(student_id);
CREATE INDEX IF NOT EXISTS idx_house_points_student_id ON public.house_points(student_id);
CREATE INDEX IF NOT EXISTS idx_house_points_school_id ON public.house_points(school_id);

-- Enable RLS on all tables
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_points ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activities
CREATE POLICY "School staff can manage activities" 
ON public.activities 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = activities.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = activities.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create RLS policies for activities_participants
CREATE POLICY "School staff can manage participants" 
ON public.activities_participants 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = activities_participants.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = activities_participants.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Students can view their own participation
CREATE POLICY "Students can view own participation" 
ON public.activities_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = activities_participants.student_id
  )
);

-- Create RLS policies for house_points
CREATE POLICY "School staff can manage house points" 
ON public.house_points 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = house_points.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = house_points.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Students can view their own house points
CREATE POLICY "Students can view own house points" 
ON public.house_points 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.user_id = auth.uid()
    AND s.id = house_points.student_id
  )
);

-- Add updated_at triggers
CREATE OR REPLACE TRIGGER trg_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_activities_participants_updated_at
BEFORE UPDATE ON public.activities_participants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample activities data
INSERT INTO public.activities (school_id, name, category, instructor, schedule, location, capacity, description, requirements)
SELECT 
  s.id,
  'Football Club',
  'sports',
  'Mr. Johnson',
  'Wednesday 15:30-16:30',
  'Sports Field',
  25,
  'Develop football skills and teamwork through training and matches.',
  ARRAY['Football boots', 'Sports kit']
FROM schools s
WHERE s.is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.activities (school_id, name, category, instructor, schedule, location, capacity, description, requirements)
SELECT 
  s.id,
  'Drama Club',
  'arts',
  'Ms. Smith',
  'Thursday 16:00-17:30',
  'Drama Studio',
  20,
  'Explore acting, stagecraft, and theatrical production.',
  ARRAY['Comfortable clothes', 'Script folder']
FROM schools s
WHERE s.is_active = true
ON CONFLICT DO NOTHING;