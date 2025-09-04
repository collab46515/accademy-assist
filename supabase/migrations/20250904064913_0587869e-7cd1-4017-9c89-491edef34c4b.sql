-- Add RLS policies for all transport tables
-- RLS for drivers table
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School staff can manage drivers" ON drivers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = drivers.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS for vehicles table
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School staff can manage vehicles" ON vehicles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = vehicles.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS for transport_routes table
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School staff can manage transport routes" ON transport_routes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = transport_routes.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS for route_stops table
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School staff can manage route stops" ON route_stops
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM transport_routes tr
    JOIN user_roles ur ON ur.school_id = tr.school_id
    WHERE tr.id = route_stops.route_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS for student_transport table  
ALTER TABLE student_transport ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School staff can manage student transport" ON student_transport
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = student_transport.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Parents can view their children's transport" ON student_transport
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_parents sp
    WHERE sp.parent_id = auth.uid()
    AND sp.student_id = student_transport.student_id
  )
);

-- RLS for transport_incidents table
ALTER TABLE transport_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School staff can manage transport incidents" ON transport_incidents
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = transport_incidents.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);