-- Phase 5: Analytics & Reporting Setup (without route references for now)

-- Transport analytics summaries (daily/weekly/monthly)
CREATE TABLE IF NOT EXISTS public.transport_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL,
  report_date DATE NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'daily',
  route_id UUID,
  
  total_trips INTEGER DEFAULT 0,
  completed_trips INTEGER DEFAULT 0,
  cancelled_trips INTEGER DEFAULT 0,
  delayed_trips INTEGER DEFAULT 0,
  on_time_percentage DECIMAL(5,2) DEFAULT 0,
  
  total_students_transported INTEGER DEFAULT 0,
  average_boarding_time_seconds INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  total_fuel_litres DECIMAL(10,2) DEFAULT 0,
  fuel_efficiency_km_per_litre DECIMAL(6,2) DEFAULT 0,
  
  total_cost DECIMAL(12,2) DEFAULT 0,
  cost_per_student DECIMAL(10,2) DEFAULT 0,
  cost_per_km DECIMAL(10,2) DEFAULT 0,
  
  average_trip_duration_minutes INTEGER DEFAULT 0,
  total_delay_minutes INTEGER DEFAULT 0,
  
  incidents_count INTEGER DEFAULT 0,
  complaints_count INTEGER DEFAULT 0,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Driver performance metrics
CREATE TABLE IF NOT EXISTS public.driver_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  total_trips INTEGER DEFAULT 0,
  completed_trips INTEGER DEFAULT 0,
  on_time_arrivals INTEGER DEFAULT 0,
  late_arrivals INTEGER DEFAULT 0,
  punctuality_score DECIMAL(5,2) DEFAULT 0,
  
  incidents_reported INTEGER DEFAULT 0,
  complaints_received INTEGER DEFAULT 0,
  safety_score DECIMAL(5,2) DEFAULT 100,
  
  checkins_expected INTEGER DEFAULT 0,
  checkins_completed INTEGER DEFAULT 0,
  checkin_compliance_rate DECIMAL(5,2) DEFAULT 0,
  
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  total_fuel_used DECIMAL(10,2) DEFAULT 0,
  fuel_efficiency_score DECIMAL(5,2) DEFAULT 0,
  
  overall_rating DECIMAL(3,2) DEFAULT 0,
  rating_notes TEXT,
  
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vehicle utilization tracking
CREATE TABLE IF NOT EXISTS public.vehicle_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  
  trips_count INTEGER DEFAULT 0,
  total_hours_used DECIMAL(6,2) DEFAULT 0,
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  utilization_percentage DECIMAL(5,2) DEFAULT 0,
  
  total_capacity INTEGER DEFAULT 0,
  average_occupancy INTEGER DEFAULT 0,
  occupancy_rate DECIMAL(5,2) DEFAULT 0,
  
  fuel_consumed_litres DECIMAL(10,2) DEFAULT 0,
  fuel_cost DECIMAL(10,2) DEFAULT 0,
  
  maintenance_cost DECIMAL(10,2) DEFAULT 0,
  breakdowns_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Route efficiency analysis
CREATE TABLE IF NOT EXISTS public.route_efficiency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL,
  route_id UUID,
  analysis_date DATE NOT NULL,
  
  planned_distance_km DECIMAL(10,2) DEFAULT 0,
  actual_distance_km DECIMAL(10,2) DEFAULT 0,
  distance_variance_percentage DECIMAL(5,2) DEFAULT 0,
  
  planned_duration_minutes INTEGER DEFAULT 0,
  actual_duration_minutes INTEGER DEFAULT 0,
  duration_variance_percentage DECIMAL(5,2) DEFAULT 0,
  
  total_stops INTEGER DEFAULT 0,
  average_stop_duration_seconds INTEGER DEFAULT 0,
  stops_with_delays INTEGER DEFAULT 0,
  
  assigned_students INTEGER DEFAULT 0,
  average_riders INTEGER DEFAULT 0,
  ridership_rate DECIMAL(5,2) DEFAULT 0,
  
  cost_per_trip DECIMAL(10,2) DEFAULT 0,
  cost_per_student_per_trip DECIMAL(10,2) DEFAULT 0,
  
  efficiency_score DECIMAL(5,2) DEFAULT 0,
  recommendations JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cost tracking
CREATE TABLE IF NOT EXISTS public.transport_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT NOT NULL,
  cost_date DATE NOT NULL,
  cost_category TEXT NOT NULL,
  
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  route_id UUID,
  
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  invoice_number TEXT,
  vendor_name TEXT,
  receipt_url TEXT,
  
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transport_analytics_school_date ON public.transport_analytics(school_id, report_date);
CREATE INDEX IF NOT EXISTS idx_driver_performance_school ON public.driver_performance(school_id);
CREATE INDEX IF NOT EXISTS idx_driver_performance_driver ON public.driver_performance(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_utilization_school_date ON public.vehicle_utilization(school_id, report_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_utilization_vehicle ON public.vehicle_utilization(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_route_efficiency_school ON public.route_efficiency(school_id);
CREATE INDEX IF NOT EXISTS idx_transport_costs_school_date ON public.transport_costs(school_id, cost_date);
CREATE INDEX IF NOT EXISTS idx_transport_costs_category ON public.transport_costs(cost_category);

-- Enable RLS
ALTER TABLE public.transport_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_utilization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_efficiency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_costs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all access to transport_analytics" ON public.transport_analytics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to driver_performance" ON public.driver_performance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to vehicle_utilization" ON public.vehicle_utilization FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to route_efficiency" ON public.route_efficiency FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transport_costs" ON public.transport_costs FOR ALL USING (true) WITH CHECK (true);

-- Updated_at triggers
CREATE TRIGGER update_transport_analytics_updated_at BEFORE UPDATE ON public.transport_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_driver_performance_updated_at BEFORE UPDATE ON public.driver_performance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehicle_utilization_updated_at BEFORE UPDATE ON public.vehicle_utilization FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_route_efficiency_updated_at BEFORE UPDATE ON public.route_efficiency FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transport_costs_updated_at BEFORE UPDATE ON public.transport_costs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();