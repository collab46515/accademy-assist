-- Enable RLS on all master data tables that don't have it
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_subjects ENABLE ROW LEVEL SECURITY;

-- Create policies for academic_years
CREATE POLICY "School staff can view academic years" ON public.academic_years
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = academic_years.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage academic years" ON public.academic_years
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = academic_years.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for year_groups
CREATE POLICY "School staff can view year groups" ON public.year_groups
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = year_groups.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage year groups" ON public.year_groups
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = year_groups.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for houses
CREATE POLICY "School staff can view houses" ON public.houses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = houses.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage houses" ON public.houses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = houses.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for academic_departments
CREATE POLICY "School staff can view departments" ON public.academic_departments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = academic_departments.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage departments" ON public.academic_departments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = academic_departments.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for form_classes
CREATE POLICY "School staff can view form classes" ON public.form_classes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = form_classes.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage form classes" ON public.form_classes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = form_classes.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for student_parents
CREATE POLICY "School staff can view student parents" ON public.student_parents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur, students s
    WHERE s.id = student_parents.student_id
    AND ur.user_id = auth.uid() 
    AND ur.school_id = s.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage student parents" ON public.student_parents
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur, students s
    WHERE s.id = student_parents.student_id
    AND ur.user_id = auth.uid() 
    AND ur.school_id = s.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for staff_subjects
CREATE POLICY "School staff can view staff subjects" ON public.staff_subjects
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur, staff st
    WHERE st.id = staff_subjects.staff_id
    AND ur.user_id = auth.uid() 
    AND ur.school_id = st.school_id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage staff subjects" ON public.staff_subjects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur, staff st
    WHERE st.id = staff_subjects.staff_id
    AND ur.user_id = auth.uid() 
    AND ur.school_id = st.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);