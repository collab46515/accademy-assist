-- Transport management tables and policies
-- 1) Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  vehicle_number text NOT NULL,
  vehicle_type text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  capacity integer NOT NULL,
  fuel_type text NOT NULL,
  registration_number text,
  insurance_expiry date,
  mot_expiry date,
  last_service_date date,
  next_service_date date,
  mileage integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  purchase_date date,
  purchase_cost numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_school_id ON public.vehicles(school_id);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'School staff can manage vehicles'
  ) THEN
    CREATE POLICY "School staff can manage vehicles"
    ON public.vehicles
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = vehicles.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = vehicles.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  employee_id text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text NOT NULL,
  license_number text NOT NULL,
  license_expiry date NOT NULL,
  license_type text[] NOT NULL,
  hire_date date NOT NULL,
  birth_date date,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status text NOT NULL DEFAULT 'active',
  dbs_check_date date,
  dbs_expiry date,
  first_aid_cert_date date,
  first_aid_expiry date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drivers_school_id ON public.drivers(school_id);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'drivers' AND policyname = 'School staff can manage drivers'
  ) THEN
    CREATE POLICY "School staff can manage drivers"
    ON public.drivers
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = drivers.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = drivers.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_drivers_updated_at
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Transport Routes
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  route_name text NOT NULL,
  route_code text,
  description text,
  start_time text NOT NULL,
  end_time text NOT NULL,
  estimated_duration integer,
  distance numeric,
  vehicle_id uuid,
  driver_id uuid,
  status text NOT NULL DEFAULT 'active',
  days_of_week integer[] NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_route_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL,
  CONSTRAINT fk_route_driver FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_transport_routes_school_id ON public.transport_routes(school_id);

ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transport_routes' AND policyname = 'School staff can manage routes'
  ) THEN
    CREATE POLICY "School staff can manage routes"
    ON public.transport_routes
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_routes.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_routes.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_transport_routes_updated_at
BEFORE UPDATE ON public.transport_routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Route Stops
CREATE TABLE IF NOT EXISTS public.route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.transport_routes(id) ON DELETE CASCADE,
  school_id uuid NOT NULL,
  stop_name text NOT NULL,
  stop_address text,
  latitude double precision,
  longitude double precision,
  stop_order integer NOT NULL,
  arrival_time text,
  is_pickup boolean NOT NULL DEFAULT true,
  is_dropoff boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON public.route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_school_id ON public.route_stops(school_id);

ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'route_stops' AND policyname = 'School staff can manage route stops'
  ) THEN
    CREATE POLICY "School staff can manage route stops"
    ON public.route_stops
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.transport_routes tr ON tr.id = route_stops.route_id
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = route_stops.school_id
        AND ur.school_id = tr.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.transport_routes tr ON tr.id = route_stops.route_id
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = route_stops.school_id
        AND ur.school_id = tr.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_route_stops_updated_at
BEFORE UPDATE ON public.route_stops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Student Transport Assignments
CREATE TABLE IF NOT EXISTS public.student_transport (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  route_id uuid NOT NULL REFERENCES public.transport_routes(id) ON DELETE CASCADE,
  pickup_stop_id uuid REFERENCES public.route_stops(id) ON DELETE SET NULL,
  dropoff_stop_id uuid REFERENCES public.route_stops(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date,
  status text NOT NULL DEFAULT 'active',
  fee_amount numeric,
  payment_status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_transport_school_id ON public.student_transport(school_id);
CREATE INDEX IF NOT EXISTS idx_student_transport_student_id ON public.student_transport(student_id);
CREATE INDEX IF NOT EXISTS idx_student_transport_route_id ON public.student_transport(route_id);

ALTER TABLE public.student_transport ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'student_transport' AND policyname = 'School staff can manage student transport'
  ) THEN
    CREATE POLICY "School staff can manage student transport"
    ON public.student_transport
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = student_transport.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = student_transport.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_student_transport_updated_at
BEFORE UPDATE ON public.student_transport
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Vehicle Maintenance
CREATE TABLE IF NOT EXISTS public.vehicle_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL,
  description text NOT NULL,
  service_date date NOT NULL,
  cost numeric,
  mileage_at_service integer,
  service_provider text,
  next_service_due date,
  parts_replaced text[],
  warranty_expiry date,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_school_id ON public.vehicle_maintenance(school_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_vehicle_id ON public.vehicle_maintenance(vehicle_id);

ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_maintenance' AND policyname = 'School staff can manage maintenance'
  ) THEN
    CREATE POLICY "School staff can manage maintenance"
    ON public.vehicle_maintenance
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = vehicle_maintenance.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = vehicle_maintenance.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_vehicle_maintenance_updated_at
BEFORE UPDATE ON public.vehicle_maintenance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7) Transport Incidents
CREATE TABLE IF NOT EXISTS public.transport_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  incident_number text NOT NULL,
  route_id uuid REFERENCES public.transport_routes(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  incident_date timestamptz NOT NULL,
  incident_type text NOT NULL,
  severity text NOT NULL,
  location text,
  description text NOT NULL,
  students_involved uuid[],
  injuries_reported boolean NOT NULL DEFAULT false,
  police_involved boolean NOT NULL DEFAULT false,
  insurance_claim boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  resolution_notes text,
  reported_by uuid,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transport_incidents_school_id ON public.transport_incidents(school_id);

ALTER TABLE public.transport_incidents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transport_incidents' AND policyname = 'School staff can manage incidents'
  ) THEN
    CREATE POLICY "School staff can manage incidents"
    ON public.transport_incidents
    FOR ALL
    USING ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_incidents.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()))
    WITH CHECK ((EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_incidents.school_id
        AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    )) OR is_super_admin(auth.uid()));
  END IF;
END $$;

CREATE OR REPLACE TRIGGER trg_transport_incidents_updated_at
BEFORE UPDATE ON public.transport_incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
