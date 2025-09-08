-- Fix RLS policies for master data tables

-- Subjects table policies
CREATE POLICY "School admins can manage subjects" 
ON public.subjects 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = subjects.school_id
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can view subjects" 
ON public.subjects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = subjects.school_id
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Classes table policies
CREATE POLICY "School admins can manage classes" 
ON public.classes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = classes.school_id
    AND ur.role IN ('school_admin', 'super_admin', 'hod')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can view classes" 
ON public.classes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = classes.school_id
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Schools table policies
CREATE POLICY "Super admins can manage all schools" 
ON public.schools 
FOR ALL 
USING (is_super_admin(auth.uid()));

CREATE POLICY "School admins can view their school" 
ON public.schools 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = schools.id
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Students table policies (already has some but may need updates)
CREATE POLICY "School staff can manage students in their school" 
ON public.students 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = students.school_id
    AND ur.role IN ('school_admin', 'super_admin', 'teacher', 'hod')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Staff table policies 
CREATE POLICY "School admins can manage staff" 
ON public.staff 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = staff.school_id
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Staff can view other staff in their school" 
ON public.staff 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = staff.school_id
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Departments table policies
CREATE POLICY "School admins can manage departments" 
ON public.departments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = departments.school_id
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can view departments" 
ON public.departments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = departments.school_id
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Classrooms table policies
CREATE POLICY "School staff can manage classrooms" 
ON public.classrooms 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = classrooms.school_id
    AND ur.role IN ('school_admin', 'super_admin', 'hod')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can view classrooms" 
ON public.classrooms 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = classrooms.school_id
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- School periods table policies
CREATE POLICY "School admins can manage school periods" 
ON public.school_periods 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_periods.school_id
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can view school periods" 
ON public.school_periods 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_periods.school_id
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);