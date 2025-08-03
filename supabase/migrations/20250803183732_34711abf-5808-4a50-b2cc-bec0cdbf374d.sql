-- Fix infinite recursion in students RLS policies first
DROP POLICY IF EXISTS "Students can view own data" ON public.students;
DROP POLICY IF EXISTS "School staff can view students" ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
DROP POLICY IF EXISTS "School staff can manage students" ON public.students;

-- Create a security definer function to check student access
CREATE OR REPLACE FUNCTION public.can_access_student(student_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = (SELECT school_id FROM students WHERE id = student_uuid)
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid());
$$;

-- Recreate students policies without recursion
CREATE POLICY "School staff can view students" ON public.students
FOR SELECT USING (can_access_student(id));

CREATE POLICY "School staff can manage students" ON public.students
FOR ALL USING (can_access_student(id));

-- Create staff table (teachers and school staff)
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id),
  school_id uuid NOT NULL REFERENCES public.schools(id),
  department_id uuid REFERENCES public.academic_departments(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  position text NOT NULL,
  employment_type text NOT NULL DEFAULT 'full_time',
  start_date date NOT NULL,
  end_date date,
  salary numeric,
  is_active boolean NOT NULL DEFAULT true,
  teaching_subjects uuid[],
  form_tutor_class text,
  qualifications jsonb DEFAULT '[]'::jsonb,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable realtime for master data tables
ALTER TABLE public.schools REPLICA IDENTITY FULL;
ALTER TABLE public.subjects REPLICA IDENTITY FULL;
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.staff REPLICA IDENTITY FULL;
ALTER TABLE public.parents REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.schools;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subjects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parents;