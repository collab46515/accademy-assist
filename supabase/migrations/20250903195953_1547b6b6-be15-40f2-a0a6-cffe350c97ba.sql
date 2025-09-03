-- Create remaining Transport Management database tables

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'bus',
  capacity INTEGER NOT NULL,
  driver_id UUID,
  assistant_id UUID,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  registration_number TEXT,
  insurance_expiry DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  fuel_type TEXT DEFAULT 'diesel',
  year_manufactured INTEGER,
  make_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, vehicle_number)
);

-- Create transport routes table
CREATE TABLE public.transport_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  route_name TEXT NOT NULL,
  route_code TEXT NOT NULL,
  vehicle_id UUID,
  driver_id UUID,
  assistant_id UUID,
  route_type TEXT NOT NULL DEFAULT 'pickup_drop' CHECK (route_type IN ('pickup_only', 'drop_only', 'pickup_drop')),
  start_time TIME NOT NULL,
  end_time TIME,
  estimated_duration INTEGER, -- in minutes
  distance_km DECIMAL(8,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, route_code),
  FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
  FOREIGN KEY (assistant_id) REFERENCES public.drivers(id)
);

-- Create route stops table
CREATE TABLE public.route_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL,
  stop_name TEXT NOT NULL,
  stop_order INTEGER NOT NULL,
  pickup_time TIME NOT NULL,
  drop_time TIME,
  location_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_from_school DECIMAL(8,2),
  estimated_travel_time INTEGER, -- in minutes from previous stop
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (route_id) REFERENCES public.transport_routes(id) ON DELETE CASCADE,
  UNIQUE(route_id, stop_order)
);

-- Create student transport assignments table
CREATE TABLE public.student_transport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  student_id UUID NOT NULL,
  route_id UUID NOT NULL,
  stop_id UUID NOT NULL,
  pickup_stop_id UUID,
  drop_stop_id UUID,
  transport_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  fee_frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (fee_frequency IN ('daily', 'weekly', 'monthly', 'termly', 'annual')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  parent_phone TEXT,
  emergency_contact TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (route_id) REFERENCES public.transport_routes(id),
  FOREIGN KEY (stop_id) REFERENCES public.route_stops(id),
  FOREIGN KEY (pickup_stop_id) REFERENCES public.route_stops(id),
  FOREIGN KEY (drop_stop_id) REFERENCES public.route_stops(id),
  UNIQUE(student_id, route_id)
);

-- Create transport attendance table
CREATE TABLE public.transport_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  student_transport_id UUID NOT NULL,
  student_id UUID NOT NULL,
  route_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pickup_time TIMESTAMP WITH TIME ZONE,
  drop_time TIMESTAMP WITH TIME ZONE,
  pickup_stop_id UUID,
  drop_stop_id UUID,
  pickup_status TEXT CHECK (pickup_status IN ('boarded', 'absent', 'late', 'early')),
  drop_status TEXT CHECK (drop_status IN ('alighted', 'absent', 'early', 'late')),
  marked_by UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (student_transport_id) REFERENCES public.student_transport(id),
  FOREIGN KEY (route_id) REFERENCES public.transport_routes(id),
  FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  FOREIGN KEY (pickup_stop_id) REFERENCES public.route_stops(id),
  FOREIGN KEY (drop_stop_id) REFERENCES public.route_stops(id),
  UNIQUE(student_transport_id, attendance_date)
);

-- Create transport notifications table
CREATE TABLE public.transport_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  route_id UUID,
  vehicle_id UUID,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('arrival', 'delay', 'breakdown', 'emergency', 'route_change', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('parents', 'students', 'drivers', 'staff', 'all')),
  recipient_ids UUID[] DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (route_id) REFERENCES public.transport_routes(id),
  FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);

-- Create transport incidents table
CREATE TABLE public.transport_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  route_id UUID,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('breakdown', 'accident', 'delay', 'medical', 'disciplinary', 'other')),
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  reported_by UUID NOT NULL,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  students_affected UUID[] DEFAULT '{}',
  parent_notified BOOLEAN DEFAULT false,
  authorities_notified BOOLEAN DEFAULT false,
  insurance_claim BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id),
  FOREIGN KEY (route_id) REFERENCES public.transport_routes(id)
);

-- Create triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_routes_updated_at
  BEFORE UPDATE ON public.transport_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_route_stops_updated_at
  BEFORE UPDATE ON public.route_stops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_transport_updated_at
  BEFORE UPDATE ON public.student_transport
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_attendance_updated_at
  BEFORE UPDATE ON public.transport_attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_incidents_updated_at
  BEFORE UPDATE ON public.transport_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_incidents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vehicles
CREATE POLICY "School staff can manage vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = vehicles.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create RLS policies for transport routes
CREATE POLICY "School staff can manage routes" ON public.transport_routes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_routes.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create RLS policies for route stops
CREATE POLICY "School staff can manage route stops" ON public.route_stops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM transport_routes tr
      JOIN user_roles ur ON ur.school_id = tr.school_id
      WHERE tr.id = route_stops.route_id
        AND ur.user_id = auth.uid()
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create RLS policies for student transport
CREATE POLICY "School staff can manage student transport" ON public.student_transport
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = student_transport.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Parents can view their children's transport" ON public.student_transport
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      WHERE sp.parent_id = auth.uid()
        AND sp.student_id = student_transport.student_id
    )
  );

-- Create RLS policies for transport attendance
CREATE POLICY "School staff can manage transport attendance" ON public.transport_attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_attendance.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Parents can view their children's transport attendance" ON public.transport_attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      WHERE sp.parent_id = auth.uid()
        AND sp.student_id = transport_attendance.student_id
    )
  );

-- Create RLS policies for transport notifications
CREATE POLICY "School staff can manage transport notifications" ON public.transport_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_notifications.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create RLS policies for transport incidents
CREATE POLICY "School staff can manage transport incidents" ON public.transport_incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = transport_incidents.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );