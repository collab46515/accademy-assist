import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TransportAnalytics {
  id: string;
  school_id: string;
  report_date: string;
  report_type: string;
  route_id?: string;
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  delayed_trips: number;
  on_time_percentage: number;
  total_students_transported: number;
  average_boarding_time_seconds: number;
  no_shows: number;
  total_distance_km: number;
  total_fuel_litres: number;
  fuel_efficiency_km_per_litre: number;
  total_cost: number;
  cost_per_student: number;
  cost_per_km: number;
  average_trip_duration_minutes: number;
  total_delay_minutes: number;
  incidents_count: number;
  complaints_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DriverPerformance {
  id: string;
  school_id: string;
  driver_id: string;
  period_start: string;
  period_end: string;
  total_trips: number;
  completed_trips: number;
  on_time_arrivals: number;
  late_arrivals: number;
  punctuality_score: number;
  incidents_reported: number;
  complaints_received: number;
  safety_score: number;
  checkins_expected: number;
  checkins_completed: number;
  checkin_compliance_rate: number;
  total_distance_km: number;
  total_fuel_used: number;
  fuel_efficiency_score: number;
  overall_rating: number;
  rating_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleUtilization {
  id: string;
  school_id: string;
  vehicle_id: string;
  report_date: string;
  trips_count: number;
  total_hours_used: number;
  total_distance_km: number;
  utilization_percentage: number;
  total_capacity: number;
  average_occupancy: number;
  occupancy_rate: number;
  fuel_consumed_litres: number;
  fuel_cost: number;
  maintenance_cost: number;
  breakdowns_count: number;
  created_at: string;
  updated_at: string;
}

export interface RouteEfficiency {
  id: string;
  school_id: string;
  route_id?: string;
  analysis_date: string;
  planned_distance_km: number;
  actual_distance_km: number;
  distance_variance_percentage: number;
  planned_duration_minutes: number;
  actual_duration_minutes: number;
  duration_variance_percentage: number;
  total_stops: number;
  average_stop_duration_seconds: number;
  stops_with_delays: number;
  assigned_students: number;
  average_riders: number;
  ridership_rate: number;
  cost_per_trip: number;
  cost_per_student_per_trip: number;
  efficiency_score: number;
  recommendations: any[];
  created_at: string;
  updated_at: string;
}

export interface TransportCost {
  id: string;
  school_id: string;
  cost_date: string;
  cost_category: string;
  vehicle_id?: string;
  driver_id?: string;
  route_id?: string;
  description?: string;
  amount: number;
  currency: string;
  invoice_number?: string;
  vendor_name?: string;
  receipt_url?: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const DEFAULT_SCHOOL_ID = 'default-school';

export function useTransportAnalytics(schoolId: string = DEFAULT_SCHOOL_ID) {
  const queryClient = useQueryClient();

  // Fetch analytics
  const { data: analytics = [], isLoading: loadingAnalytics } = useQuery({
    queryKey: ['transport-analytics', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_analytics')
        .select('*')
        .eq('school_id', schoolId)
        .order('report_date', { ascending: false });
      if (error) throw error;
      return data as TransportAnalytics[];
    },
  });

  // Fetch driver performance
  const { data: driverPerformance = [], isLoading: loadingDriverPerformance } = useQuery({
    queryKey: ['driver-performance', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_performance')
        .select('*')
        .eq('school_id', schoolId)
        .order('period_end', { ascending: false });
      if (error) throw error;
      return data as DriverPerformance[];
    },
  });

  // Fetch vehicle utilization
  const { data: vehicleUtilization = [], isLoading: loadingVehicleUtilization } = useQuery({
    queryKey: ['vehicle-utilization', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_utilization')
        .select('*')
        .eq('school_id', schoolId)
        .order('report_date', { ascending: false });
      if (error) throw error;
      return data as VehicleUtilization[];
    },
  });

  // Fetch route efficiency
  const { data: routeEfficiency = [], isLoading: loadingRouteEfficiency } = useQuery({
    queryKey: ['route-efficiency', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_efficiency')
        .select('*')
        .eq('school_id', schoolId)
        .order('analysis_date', { ascending: false });
      if (error) throw error;
      return data as RouteEfficiency[];
    },
  });

  // Fetch transport costs
  const { data: costs = [], isLoading: loadingCosts } = useQuery({
    queryKey: ['transport-costs', schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_costs')
        .select('*')
        .eq('school_id', schoolId)
        .order('cost_date', { ascending: false });
      if (error) throw error;
      return data as TransportCost[];
    },
  });

  // Add cost mutation
  const addCostMutation = useMutation({
    mutationFn: async (cost: Omit<TransportCost, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transport_costs')
        .insert(cost)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-costs'] });
      toast.success('Cost record added');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add cost: ${error.message}`);
    },
  });

  // Delete cost mutation
  const deleteCostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transport_costs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-costs'] });
      toast.success('Cost record deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete cost: ${error.message}`);
    },
  });

  // Calculate summary metrics
  const summaryMetrics = {
    totalTrips: analytics.reduce((sum, a) => sum + (a.total_trips || 0), 0),
    completedTrips: analytics.reduce((sum, a) => sum + (a.completed_trips || 0), 0),
    onTimePercentage: analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + (a.on_time_percentage || 0), 0) / analytics.length 
      : 0,
    totalStudentsTransported: analytics.reduce((sum, a) => sum + (a.total_students_transported || 0), 0),
    totalCost: costs.reduce((sum, c) => sum + (c.amount || 0), 0),
    totalDistance: analytics.reduce((sum, a) => sum + (a.total_distance_km || 0), 0),
    averageFuelEfficiency: analytics.length > 0
      ? analytics.reduce((sum, a) => sum + (a.fuel_efficiency_km_per_litre || 0), 0) / analytics.length
      : 0,
    incidentsCount: analytics.reduce((sum, a) => sum + (a.incidents_count || 0), 0),
  };

  return {
    analytics,
    driverPerformance,
    vehicleUtilization,
    routeEfficiency,
    costs,
    summaryMetrics,
    isLoading: loadingAnalytics || loadingDriverPerformance || loadingVehicleUtilization || loadingRouteEfficiency || loadingCosts,
    addCost: addCostMutation.mutate,
    deleteCost: deleteCostMutation.mutate,
  };
}
