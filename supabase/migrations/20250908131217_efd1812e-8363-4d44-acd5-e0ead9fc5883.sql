-- Create missing Year Groups and Houses tables for complete Master Data

-- Create Year Groups table
CREATE TABLE IF NOT EXISTS public.year_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid REFERENCES public.schools(id),
  year_code text NOT NULL,
  year_name text NOT NULL,
  key_stage text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(school_id, year_code)
);

-- Create Houses table
CREATE TABLE IF NOT EXISTS public.houses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid REFERENCES public.schools(id),
  house_code text NOT NULL,
  house_name text NOT NULL,
  house_color text,
  house_motto text,
  head_of_house_id uuid,
  points integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(school_id, house_code)
);

-- Enable RLS on new tables
ALTER TABLE public.year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for Year Groups
CREATE POLICY "Super admins can manage year groups" ON public.year_groups
FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "School staff can view year groups" ON public.year_groups
FOR SELECT USING (
  is_super_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = year_groups.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

CREATE POLICY "School admins can manage year groups" ON public.year_groups
FOR ALL USING (
  is_super_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = year_groups.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Add RLS policies for Houses
CREATE POLICY "Super admins can manage houses" ON public.houses
FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "School staff can view houses" ON public.houses
FOR SELECT USING (
  is_super_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = houses.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

CREATE POLICY "School admins can manage houses" ON public.houses
FOR ALL USING (
  is_super_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = houses.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_year_groups_updated_at
  BEFORE UPDATE ON public.year_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_houses_updated_at
  BEFORE UPDATE ON public.houses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO public.year_groups (school_id, year_code, year_name, key_stage, sort_order) VALUES
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y7', 'Year 7', 'Key Stage 3', 7),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y8', 'Year 8', 'Key Stage 3', 8),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y9', 'Year 9', 'Key Stage 3', 9),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y10', 'Year 10', 'Key Stage 4', 10),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y11', 'Year 11', 'Key Stage 4', 11),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y12', 'Year 12', 'Key Stage 5', 12),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'Y13', 'Year 13', 'Key Stage 5', 13)
ON CONFLICT (school_id, year_code) DO NOTHING;

INSERT INTO public.houses (school_id, house_code, house_name, house_color, house_motto) VALUES
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'RED', 'Red House', '#EF4444', 'Strength and Courage'),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'BLUE', 'Blue House', '#3B82F6', 'Wisdom and Truth'),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'GREEN', 'Green House', '#10B981', 'Growth and Harmony'),
  ('2f21656b-0848-40ee-bbec-12e5e8137545', 'YELLOW', 'Yellow House', '#F59E0B', 'Joy and Excellence')
ON CONFLICT (school_id, house_code) DO NOTHING;