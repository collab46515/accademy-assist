
-- Phase 3: Live Operations & Tracking

-- Add school_id to trip_instances if not exists
ALTER TABLE public.trip_instances ADD COLUMN IF NOT EXISTS school_id UUID;

-- Update trip_instances school_id from transport_trips
UPDATE public.trip_instances ti
SET school_id = tt.school_id
FROM public.transport_trips tt
WHERE ti.trip_id = tt.id AND ti.school_id IS NULL;

-- 1. Driver Check-in/Check-out Records
CREATE TABLE IF NOT EXISTS public.driver_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  trip_instance_id UUID REFERENCES public.trip_instances(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  checkin_type TEXT NOT NULL CHECK (checkin_type IN ('start_duty', 'vehicle_inspection', 'trip_start', 'trip_end', 'end_duty')),
  checkin_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  location_address TEXT,
  odometer_reading NUMERIC(10,2),
  fuel_level_percent INTEGER,
  vehicle_condition TEXT CHECK (vehicle_condition IN ('good', 'minor_issues', 'major_issues', 'not_roadworthy')),
  vehicle_issues TEXT,
  photo_url TEXT,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Student Boarding/Alighting Records
CREATE TABLE IF NOT EXISTS public.student_trip_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  trip_instance_id UUID REFERENCES public.trip_instances(id) ON DELETE CASCADE,
  trip_stop_id UUID REFERENCES public.trip_stops(id) ON DELETE SET NULL,
  student_id UUID NOT NULL,
  student_assignment_id UUID REFERENCES public.student_trip_assignments(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('board', 'alight', 'absent', 'no_show', 'parent_pickup')),
  action_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID,
  recorded_method TEXT CHECK (recorded_method IN ('manual', 'qr_scan', 'rfid', 'biometric', 'parent_app')),
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  parent_notified BOOLEAN DEFAULT false,
  parent_notification_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. GPS Location Tracking
CREATE TABLE IF NOT EXISTS public.trip_location_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID,
  trip_instance_id UUID REFERENCES public.trip_instances(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  altitude NUMERIC(10,2),
  speed_kmh NUMERIC(6,2),
  heading NUMERIC(5,2),
  accuracy_meters NUMERIC(8,2),
  source TEXT CHECK (source IN ('gps_device', 'driver_app', 'vehicle_tracker')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Trip Events (delays, incidents, stops, etc.)
CREATE TABLE IF NOT EXISTS public.trip_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  trip_instance_id UUID REFERENCES public.trip_instances(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('delay', 'breakdown', 'accident', 'traffic', 'weather', 'stop_reached', 'stop_departed', 'emergency', 'route_deviation', 'fuel_stop', 'other')),
  event_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  description TEXT NOT NULL,
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  location_address TEXT,
  reported_by UUID,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  affected_students_count INTEGER,
  parent_notification_sent BOOLEAN DEFAULT false,
  admin_notification_sent BOOLEAN DEFAULT false,
  photos TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Live Dashboard Alerts
CREATE TABLE IF NOT EXISTS public.transport_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  trip_instance_id UUID REFERENCES public.trip_instances(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('delay', 'breakdown', 'accident', 'sos', 'geofence_breach', 'speed_violation', 'route_deviation', 'student_missing', 'driver_unavailable', 'vehicle_issue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  auto_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_driver_checkins_instance ON public.driver_checkins(trip_instance_id);
CREATE INDEX IF NOT EXISTS idx_driver_checkins_driver ON public.driver_checkins(driver_id);
CREATE INDEX IF NOT EXISTS idx_student_trip_logs_instance ON public.student_trip_logs(trip_instance_id);
CREATE INDEX IF NOT EXISTS idx_student_trip_logs_student ON public.student_trip_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_trip_location_logs_instance ON public.trip_location_logs(trip_instance_id);
CREATE INDEX IF NOT EXISTS idx_trip_location_logs_time ON public.trip_location_logs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_trip_events_instance ON public.trip_events(trip_instance_id);
CREATE INDEX IF NOT EXISTS idx_trip_events_type ON public.trip_events(event_type);
CREATE INDEX IF NOT EXISTS idx_transport_alerts_school ON public.transport_alerts(school_id);
CREATE INDEX IF NOT EXISTS idx_transport_alerts_unresolved ON public.transport_alerts(school_id) WHERE resolved_at IS NULL;

-- Enable RLS
ALTER TABLE public.driver_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_trip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for driver_checkins
CREATE POLICY "View driver checkins" ON public.driver_checkins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = driver_checkins.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage driver checkins" ON public.driver_checkins
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = driver_checkins.school_id AND ur.role IN ('school_admin', 'hod', 'teacher') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

-- RLS Policies for student_trip_logs
CREATE POLICY "View student trip logs" ON public.student_trip_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = student_trip_logs.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage student trip logs" ON public.student_trip_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = student_trip_logs.school_id AND ur.role IN ('school_admin', 'hod', 'teacher') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

-- RLS Policies for trip_location_logs
CREATE POLICY "View location logs" ON public.trip_location_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = trip_location_logs.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Insert location logs" ON public.trip_location_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for trip_events
CREATE POLICY "View trip events" ON public.trip_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = trip_events.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage trip events" ON public.trip_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = trip_events.school_id AND ur.role IN ('school_admin', 'hod', 'teacher') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

-- RLS Policies for transport_alerts
CREATE POLICY "View transport alerts" ON public.transport_alerts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_alerts.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage transport alerts" ON public.transport_alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_alerts.school_id AND ur.role IN ('school_admin', 'hod', 'teacher') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

-- Triggers for updated_at
CREATE TRIGGER update_trip_events_updated_at BEFORE UPDATE ON public.trip_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_location_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport_alerts;
