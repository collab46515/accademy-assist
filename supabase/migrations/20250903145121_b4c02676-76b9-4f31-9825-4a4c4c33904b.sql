-- Create RLS policies for transport_routes table
-- Allow school staff to manage transport routes

-- Policy for viewing transport routes
CREATE POLICY "School staff can view transport routes" ON public.transport_routes
FOR SELECT
USING (
  (EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = transport_routes.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

-- Policy for creating transport routes
CREATE POLICY "School staff can create transport routes" ON public.transport_routes
FOR INSERT
WITH CHECK (
  (EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = transport_routes.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

-- Policy for updating transport routes
CREATE POLICY "School staff can update transport routes" ON public.transport_routes
FOR UPDATE
USING (
  (EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = transport_routes.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

-- Policy for deleting transport routes
CREATE POLICY "School staff can delete transport routes" ON public.transport_routes
FOR DELETE
USING (
  (EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = transport_routes.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);