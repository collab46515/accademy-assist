-- Enable RLS and policies to allow managing vehicles and maintenance via app

-- Vehicles table: allow school staff and super admins to manage
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'vehicles'
  ) THEN
    -- Enable RLS if not already enabled
    EXECUTE 'ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY';

    -- Drop existing policy with same name if exists to avoid duplicates
    IF EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'School staff can manage vehicles'
    ) THEN
      EXECUTE 'DROP POLICY "School staff can manage vehicles" ON public.vehicles';
    END IF;

    -- Create unified manage policy (ALL)
    EXECUTE $$
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
    $$;
  END IF;
END$$;

-- Vehicle maintenance table: allow staff based on related vehicle's school
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'vehicle_maintenance'
  ) THEN
    -- Enable RLS
    EXECUTE 'ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY';

    -- Drop existing policy if exists
    IF EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'vehicle_maintenance' AND policyname = 'School staff can manage vehicle maintenance'
    ) THEN
      EXECUTE 'DROP POLICY "School staff can manage vehicle maintenance" ON public.vehicle_maintenance';
    END IF;

    -- Create manage policy referencing vehicles.school_id
    EXECUTE $$
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
    $$;
  END IF;
END$$;