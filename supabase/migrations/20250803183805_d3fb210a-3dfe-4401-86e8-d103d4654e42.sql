-- Fix RLS policies first
DROP POLICY IF EXISTS "Students can view own data" ON public.students;
DROP POLICY IF EXISTS "School staff can view students" ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
DROP POLICY IF EXISTS "School staff can manage students" ON public.students;

-- Create security definer function to avoid recursion
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

-- Recreate students policies
CREATE POLICY "School staff can view students" ON public.students
FOR SELECT USING (can_access_student(id));

CREATE POLICY "School staff can manage students" ON public.students
FOR ALL USING (can_access_student(id));

-- Create staff table
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id),
  school_id uuid NOT NULL REFERENCES public.schools(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  position text NOT NULL,
  employment_type text NOT NULL DEFAULT 'full_time',
  start_date date NOT NULL,
  end_date date,
  is_active boolean NOT NULL DEFAULT true,
  teaching_subjects text[],
  form_tutor_class text,
  qualifications jsonb DEFAULT '[]'::jsonb,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create staff policies
CREATE POLICY "School staff can view staff in their school" ON public.staff
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = staff.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage staff" ON public.staff
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = staff.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Add updated_at trigger for staff
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();