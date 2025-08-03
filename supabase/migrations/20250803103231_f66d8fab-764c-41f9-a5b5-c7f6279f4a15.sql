-- Fix missing RLS policies for role_permissions, audit_logs, and student_parents tables
CREATE POLICY "Admins can view role permissions" ON public.role_permissions
  FOR SELECT USING (
    public.is_super_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
        AND ur.role = 'school_admin'
        AND ur.is_active = true
    )
  );

CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view school audit logs" ON public.audit_logs
  FOR SELECT USING (
    public.is_super_admin(auth.uid()) OR
    (school_id IS NOT NULL AND 
     EXISTS (
       SELECT 1 FROM public.user_roles ur 
       WHERE ur.user_id = auth.uid() 
         AND ur.school_id = audit_logs.school_id
         AND ur.role IN ('school_admin', 'dsl')
         AND ur.is_active = true
     ))
  );

-- Student-parent relationships policies
CREATE POLICY "Parents can view their relationships" ON public.student_parents
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "Students can view their parent relationships" ON public.student_parents
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can manage student-parent relationships" ON public.student_parents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.students s ON s.school_id = ur.school_id
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('school_admin', 'dsl')
        AND ur.is_active = true
        AND s.user_id = student_parents.student_id
    )
  );

-- Fix function search path issues by adding SECURITY DEFINER and SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix the security definer functions with proper search paths
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID, school_uuid UUID DEFAULT NULL)
RETURNS TABLE(role app_role, school_id UUID, department TEXT, year_group TEXT)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT ur.role, ur.school_id, ur.department, ur.year_group
  FROM public.user_roles ur
  WHERE ur.user_id = user_uuid 
    AND ur.is_active = true
    AND (school_uuid IS NULL OR ur.school_id = school_uuid);
$$;

CREATE OR REPLACE FUNCTION public.has_permission(
  user_uuid UUID, 
  school_uuid UUID, 
  resource resource_type, 
  permission permission_type
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = user_uuid
      AND ur.school_id = school_uuid
      AND ur.is_active = true
      AND rp.resource = resource
      AND rp.permission = permission
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = user_uuid
      AND ur.role = 'super_admin'
      AND ur.is_active = true
  );
$$;