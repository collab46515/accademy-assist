-- Secure student_parents with proper RLS policies
-- 1) Enable RLS
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;

-- 2) SELECT policies
-- Parents can view their own links
CREATE POLICY "Parents can view own student links"
ON public.student_parents
FOR SELECT
USING (
  parent_id = auth.uid()
);

-- Students can view their own family links
CREATE POLICY "Students can view their own family links"
ON public.student_parents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = student_parents.student_id
      AND s.user_id = auth.uid()
  )
);

-- School staff (teacher, school_admin, hod, dsl) can view links for students in their school
CREATE POLICY "School staff can view student-parent links"
ON public.student_parents
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.user_roles ur ON ur.school_id = s.school_id
    WHERE s.id = student_parents.student_id
      AND ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role, 'dsl'::app_role])
      AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- 3) INSERT policy - only admins/hods/dsl can create links within their school
CREATE POLICY "Admins can link parents to students"
ON public.student_parents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.user_roles ur ON ur.school_id = s.school_id
    WHERE s.id = student_parents.student_id
      AND ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role, 'dsl'::app_role])
      AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- 4) UPDATE policy - only admins/hods/dsl can modify links within their school
CREATE POLICY "Admins can update student-parent links"
ON public.student_parents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.user_roles ur ON ur.school_id = s.school_id
    WHERE s.id = student_parents.student_id
      AND ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role, 'dsl'::app_role])
      AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.user_roles ur ON ur.school_id = s.school_id
    WHERE s.id = student_parents.student_id
      AND ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role, 'dsl'::app_role])
      AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- 5) DELETE policy - only admins/hods/dsl can remove links within their school
CREATE POLICY "Admins can delete student-parent links"
ON public.student_parents
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.user_roles ur ON ur.school_id = s.school_id
    WHERE s.id = student_parents.student_id
      AND ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role, 'dsl'::app_role])
      AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);
