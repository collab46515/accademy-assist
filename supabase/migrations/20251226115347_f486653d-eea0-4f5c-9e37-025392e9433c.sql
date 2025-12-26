
-- =====================================================
-- PHASE 2: Route Profiles & Trip Planning
-- =====================================================

-- 1. Route Profiles (The "Demand" Layer)
CREATE TABLE public.route_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  profile_code TEXT,
  description TEXT,
  -- Validity Period
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  -- Operational Timings
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  -- Frequency
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 0=Sun, 1=Mon, etc.
  -- Trip Category
  trip_category TEXT NOT NULL DEFAULT 'regular' CHECK (trip_category IN ('regular', 'altered_regular', 'other', 'maintenance')),
  -- Student Pool Mapping
  student_pool_type TEXT NOT NULL DEFAULT 'all' CHECK (student_pool_type IN ('all', 'by_grade', 'by_section', 'custom')),
  student_pool_criteria JSONB DEFAULT '{}', -- e.g., {"grades": ["1","2","3"], "sections": ["A","B"]}
  -- Holiday Logic
  apply_school_holidays BOOLEAN DEFAULT true,
  custom_holiday_ids UUID[] DEFAULT '{}',
  -- Approval Workflow
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'expired')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Transport Trips (The "Execution" Layer)
CREATE TABLE public.transport_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  route_profile_id UUID NOT NULL REFERENCES public.route_profiles(id) ON DELETE CASCADE,
  trip_name TEXT NOT NULL,
  trip_code TEXT,
  -- Route Definition
  trip_type TEXT NOT NULL DEFAULT 'pickup' CHECK (trip_type IN ('pickup', 'drop', 'both', 'special')),
  start_point TEXT, -- Depot or School
  end_point TEXT,
  -- Resource Assignment
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),
  attender_id UUID REFERENCES public.drivers(id), -- Attenders stored in drivers table
  -- Timing
  scheduled_start_time TIME NOT NULL,
  scheduled_end_time TIME,
  estimated_duration_minutes INTEGER,
  -- Distance & Fuel
  estimated_distance_km DECIMAL(8,2),
  estimated_fuel_required DECIMAL(6,2),
  -- Capacity Management
  vehicle_capacity INTEGER,
  assigned_students_count INTEGER DEFAULT 0,
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Trip Stops (Stops per Trip with arrival/departure times)
CREATE TABLE public.trip_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.transport_trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES public.route_stops(id), -- Link to master stop
  stop_name TEXT NOT NULL,
  stop_order INTEGER NOT NULL,
  -- Timing
  scheduled_arrival_time TIME NOT NULL,
  scheduled_departure_time TIME,
  estimated_wait_minutes INTEGER DEFAULT 2,
  -- Location
  location_address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  geofence_radius_meters INTEGER DEFAULT 50,
  -- Distance from previous stop
  distance_from_previous_km DECIMAL(6,2),
  -- Student assignment status (for smart filtering)
  total_students_at_stop INTEGER DEFAULT 0,
  assigned_students_count INTEGER DEFAULT 0,
  assignment_status TEXT DEFAULT 'red' CHECK (assignment_status IN ('red', 'yellow', 'green')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Student Trip Assignments
CREATE TABLE public.student_trip_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.transport_trips(id) ON DELETE CASCADE,
  trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  -- Assignment type
  assignment_type TEXT NOT NULL DEFAULT 'pickup' CHECK (assignment_type IN ('pickup', 'drop', 'both')),
  -- Parent Contact
  parent_name TEXT,
  parent_phone TEXT,
  parent_notification_preference TEXT DEFAULT 'sms' CHECK (parent_notification_preference IN ('sms', 'app', 'whatsapp', 'email', 'none')),
  -- Special Instructions
  special_instructions TEXT,
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  -- Validity
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, student_id)
);

-- 5. Standby Resources (Pool per Route Profile)
CREATE TABLE public.standby_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  route_profile_id UUID REFERENCES public.route_profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('driver', 'attender', 'vehicle')),
  -- Resource reference
  driver_id UUID REFERENCES public.drivers(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  -- Availability
  available_from TIME,
  available_until TIME,
  days_available INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
  -- Status
  is_available BOOLEAN DEFAULT true,
  currently_assigned_to UUID, -- Trip ID if currently substituting
  assigned_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Trip Instances (Daily execution records)
CREATE TABLE public.trip_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.transport_trips(id) ON DELETE CASCADE,
  instance_date DATE NOT NULL,
  -- Actual resources (may differ from planned due to substitutions)
  actual_vehicle_id UUID REFERENCES public.vehicles(id),
  actual_driver_id UUID REFERENCES public.drivers(id),
  actual_attender_id UUID REFERENCES public.drivers(id),
  -- Timing
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  -- Distance & Fuel
  actual_distance_km DECIMAL(8,2),
  fuel_consumed_litres DECIMAL(6,2),
  -- Status
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'delayed')),
  delay_minutes INTEGER DEFAULT 0,
  delay_reason TEXT,
  -- Student counts
  total_students_expected INTEGER DEFAULT 0,
  total_students_boarded INTEGER DEFAULT 0,
  total_students_dropped INTEGER DEFAULT 0,
  -- GPS tracking reference
  gps_tracking_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, instance_date)
);

-- 7. Enhance route_stops with additional fields
ALTER TABLE public.route_stops
ADD COLUMN IF NOT EXISTS geofence_radius_meters INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS stop_type TEXT DEFAULT 'regular' CHECK (stop_type IN ('regular', 'school', 'depot')),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 8. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_route_profiles_school ON public.route_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_route_profiles_status ON public.route_profiles(status);
CREATE INDEX IF NOT EXISTS idx_transport_trips_profile ON public.transport_trips(route_profile_id);
CREATE INDEX IF NOT EXISTS idx_transport_trips_vehicle ON public.transport_trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_transport_trips_driver ON public.transport_trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_order ON public.trip_stops(trip_id, stop_order);
CREATE INDEX IF NOT EXISTS idx_student_assignments_trip ON public.student_trip_assignments(trip_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student ON public.student_trip_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_standby_resources_profile ON public.standby_resources(route_profile_id);
CREATE INDEX IF NOT EXISTS idx_trip_instances_trip ON public.trip_instances(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_instances_date ON public.trip_instances(instance_date);

-- 9. Enable RLS
ALTER TABLE public.route_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_trip_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standby_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_instances ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies
CREATE POLICY "Users can view route profiles in their school" ON public.route_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = route_profiles.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can manage route profiles in their school" ON public.route_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = route_profiles.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can view trips in their school" ON public.transport_trips
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_trips.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can manage trips in their school" ON public.transport_trips
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_trips.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can view trip stops" ON public.trip_stops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.transport_trips t
      JOIN public.user_roles ur ON ur.school_id = t.school_id
      WHERE t.id = trip_stops.trip_id AND ur.user_id = auth.uid() AND ur.is_active = true
    )
  );

CREATE POLICY "Users can manage trip stops" ON public.trip_stops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.transport_trips t
      JOIN public.user_roles ur ON ur.school_id = t.school_id
      WHERE t.id = trip_stops.trip_id AND ur.user_id = auth.uid() AND ur.is_active = true
    )
  );

CREATE POLICY "Users can view student assignments in their school" ON public.student_trip_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = student_trip_assignments.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can manage student assignments in their school" ON public.student_trip_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = student_trip_assignments.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can view standby resources in their school" ON public.standby_resources
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = standby_resources.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can manage standby resources in their school" ON public.standby_resources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = standby_resources.school_id AND user_roles.is_active = true)
  );

CREATE POLICY "Users can view trip instances" ON public.trip_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.transport_trips t
      JOIN public.user_roles ur ON ur.school_id = t.school_id
      WHERE t.id = trip_instances.trip_id AND ur.user_id = auth.uid() AND ur.is_active = true
    )
  );

CREATE POLICY "Users can manage trip instances" ON public.trip_instances
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.transport_trips t
      JOIN public.user_roles ur ON ur.school_id = t.school_id
      WHERE t.id = trip_instances.trip_id AND ur.user_id = auth.uid() AND ur.is_active = true
    )
  );

-- 11. Update triggers
CREATE TRIGGER update_route_profiles_updated_at BEFORE UPDATE ON public.route_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transport_trips_updated_at BEFORE UPDATE ON public.transport_trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trip_stops_updated_at BEFORE UPDATE ON public.trip_stops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_trip_assignments_updated_at BEFORE UPDATE ON public.student_trip_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_standby_resources_updated_at BEFORE UPDATE ON public.standby_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trip_instances_updated_at BEFORE UPDATE ON public.trip_instances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Function to update trip stop assignment status
CREATE OR REPLACE FUNCTION public.update_trip_stop_assignment_status()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the assignment status based on assigned vs total students
  UPDATE trip_stops
  SET 
    assigned_students_count = (
      SELECT COUNT(*) FROM student_trip_assignments 
      WHERE trip_stop_id = COALESCE(NEW.trip_stop_id, OLD.trip_stop_id) AND status = 'active'
    ),
    assignment_status = CASE
      WHEN (SELECT COUNT(*) FROM student_trip_assignments WHERE trip_stop_id = COALESCE(NEW.trip_stop_id, OLD.trip_stop_id) AND status = 'active') = 0 THEN 'red'
      WHEN (SELECT COUNT(*) FROM student_trip_assignments WHERE trip_stop_id = COALESCE(NEW.trip_stop_id, OLD.trip_stop_id) AND status = 'active') >= total_students_at_stop THEN 'green'
      ELSE 'yellow'
    END
  WHERE id = COALESCE(NEW.trip_stop_id, OLD.trip_stop_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_stop_assignment_status
  AFTER INSERT OR UPDATE OR DELETE ON public.student_trip_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_trip_stop_assignment_status();
