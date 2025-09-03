-- Fix RLS for transport tables to allow inserts from app

-- Vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "School staff can manage vehicles" ON public.vehicles;
CREATE POLICY "School staff can manage vehicles"
ON public.vehicles
FOR ALL
USING (
  (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = public.vehicles.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )
  ) OR public.is_super_admin(auth.uid())
)
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = public.vehicles.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )
  ) OR public.is_super_admin(auth.uid())
);

-- Vehicle Maintenance
ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "School staff can manage vehicle maintenance" ON public.vehicle_maintenance;
CREATE POLICY "School staff can manage vehicle maintenance"
ON public.vehicle_maintenance
FOR ALL
USING (
  (
    EXISTS (
      SELECT 1
      FROM public.vehicles v
      JOIN public.user_roles ur ON ur.school_id = v.school_id
      WHERE v.id = public.vehicle_maintenance.vehicle_id
        AND ur.user_id = auth.uid()
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )
  ) OR public.is_super_admin(auth.uid())
)
WITH CHECK (
  (
    EXISTS (
      SELECT 1
      FROM public.vehicles v
      JOIN public.user_roles ur ON ur.school_id = v.school_id
      WHERE v.id = public.vehicle_maintenance.vehicle_id
        AND ur.user_id = auth.uid()
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )
  ) OR public.is_super_admin(auth.uid())
);