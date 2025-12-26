import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface TripInstance {
  id: string;
  trip_id: string;
  school_id?: string;
  instance_date: string;
  actual_vehicle_id?: string;
  actual_driver_id?: string;
  actual_attender_id?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  actual_distance_km?: number;
  fuel_consumed_litres?: number;
  status: string;
  delay_minutes?: number;
  delay_reason?: string;
  total_students_expected?: number;
  total_students_boarded?: number;
  total_students_dropped?: number;
  gps_tracking_id?: string;
  created_at: string;
  updated_at: string;
  trip?: any;
  vehicle?: any;
  driver?: any;
}

export interface DriverCheckin {
  id: string;
  school_id: string;
  trip_instance_id?: string;
  driver_id: string;
  vehicle_id?: string;
  checkin_type: string;
  checkin_time: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  odometer_reading?: number;
  fuel_level_percent?: number;
  vehicle_condition?: string;
  vehicle_issues?: string;
  photo_url?: string;
  notes?: string;
  created_at: string;
  driver?: any;
  vehicle?: any;
}

export interface StudentTripLog {
  id: string;
  school_id: string;
  trip_instance_id: string;
  trip_stop_id?: string;
  student_id: string;
  student_assignment_id?: string;
  action_type: string;
  action_time: string;
  recorded_by?: string;
  recorded_method?: string;
  location_lat?: number;
  location_lng?: number;
  parent_notified: boolean;
  notes?: string;
  created_at: string;
  student?: any;
}

export interface TripEvent {
  id: string;
  school_id: string;
  trip_instance_id: string;
  event_type: string;
  event_time: string;
  severity?: string;
  description: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  reported_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  affected_students_count?: number;
  parent_notification_sent: boolean;
  admin_notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransportAlert {
  id: string;
  school_id: string;
  trip_instance_id?: string;
  alert_type: string;
  priority: string;
  title: string;
  message: string;
  metadata?: any;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
  auto_resolved: boolean;
  created_at: string;
}

export interface TripLocationLog {
  id: string;
  school_id?: string;
  trip_instance_id: string;
  vehicle_id?: string;
  driver_id?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  speed_kmh?: number;
  heading?: number;
  accuracy_meters?: number;
  source?: string;
  recorded_at: string;
}

export const useLiveOperations = (schoolId: string | null) => {
  const { user } = useAuth();
  const [tripInstances, setTripInstances] = useState<TripInstance[]>([]);
  const [driverCheckins, setDriverCheckins] = useState<DriverCheckin[]>([]);
  const [studentLogs, setStudentLogs] = useState<StudentTripLog[]>([]);
  const [tripEvents, setTripEvents] = useState<TripEvent[]>([]);
  const [alerts, setAlerts] = useState<TransportAlert[]>([]);
  const [locationLogs, setLocationLogs] = useState<TripLocationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodaysInstances = useCallback(async () => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('trip_instances')
        .select(`
          *,
          trip:transport_trips(*),
          vehicle:vehicles(*),
          driver:drivers(*)
        `)
        .eq('instance_date', today)
        .order('actual_start_time', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTripInstances(data || []);
    } catch (err) {
      console.error('Error fetching trip instances:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  const fetchAlerts = useCallback(async () => {
    if (!schoolId) return;

    try {
      const { data, error } = await supabase
        .from('transport_alerts')
        .select('*')
        .eq('school_id', schoolId)
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  }, [schoolId]);

  // Start a trip instance
  const startTrip = async (instanceId: string, driverId: string, vehicleId: string) => {
    try {
      const { data, error } = await supabase
        .from('trip_instances')
        .update({
          status: 'in_progress',
          actual_start_time: new Date().toISOString(),
          actual_driver_id: driverId,
          actual_vehicle_id: vehicleId
        })
        .eq('id', instanceId)
        .select()
        .single();

      if (error) throw error;
      setTripInstances(prev => prev.map(t => t.id === instanceId ? { ...t, ...data } : t));
      toast.success('Trip started');
      return data;
    } catch (err) {
      toast.error('Failed to start trip');
      throw err;
    }
  };

  // Complete a trip instance
  const completeTrip = async (instanceId: string, distanceKm?: number, fuelLitres?: number) => {
    try {
      const { data, error } = await supabase
        .from('trip_instances')
        .update({
          status: 'completed',
          actual_end_time: new Date().toISOString(),
          actual_distance_km: distanceKm,
          fuel_consumed_litres: fuelLitres
        })
        .eq('id', instanceId)
        .select()
        .single();

      if (error) throw error;
      setTripInstances(prev => prev.map(t => t.id === instanceId ? { ...t, ...data } : t));
      toast.success('Trip completed');
      return data;
    } catch (err) {
      toast.error('Failed to complete trip');
      throw err;
    }
  };

  // Record driver check-in
  const recordDriverCheckin = async (data: Omit<DriverCheckin, 'id' | 'created_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('driver_checkins')
        .insert([data])
        .select('*, driver:drivers(*), vehicle:vehicles(*)')
        .single();

      if (error) throw error;
      setDriverCheckins(prev => [result, ...prev]);
      toast.success('Check-in recorded');
      return result;
    } catch (err) {
      toast.error('Failed to record check-in');
      throw err;
    }
  };

  // Record student boarding/alighting
  const recordStudentAction = async (data: Omit<StudentTripLog, 'id' | 'created_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('student_trip_logs')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setStudentLogs(prev => [result, ...prev]);
      
      toast.success(`Student ${data.action_type} recorded`);
      return result;
    } catch (err) {
      toast.error('Failed to record student action');
      throw err;
    }
  };

  // Report trip event
  const reportTripEvent = async (data: Omit<TripEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('trip_events')
        .insert([{ ...data, reported_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setTripEvents(prev => [result, ...prev]);
      
      // Auto-create alert for critical events
      if (data.severity === 'critical') {
        await supabase.from('transport_alerts').insert([{
          school_id: data.school_id,
          trip_instance_id: data.trip_instance_id,
          alert_type: data.event_type,
          priority: 'critical',
          title: `Critical: ${data.event_type.replace('_', ' ')}`,
          message: data.description
        }]);
      }
      
      toast.success('Event reported');
      return result;
    } catch (err) {
      toast.error('Failed to report event');
      throw err;
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { data, error } = await supabase
        .from('transport_alerts')
        .update({
          acknowledged_by: user?.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      setAlerts(prev => prev.map(a => a.id === alertId ? data : a));
      toast.success('Alert acknowledged');
      return data;
    } catch (err) {
      toast.error('Failed to acknowledge alert');
      throw err;
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('transport_alerts')
        .update({
          resolved_by: user?.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success('Alert resolved');
    } catch (err) {
      toast.error('Failed to resolve alert');
      throw err;
    }
  };

  // Fetch student logs for a trip instance
  const fetchStudentLogs = async (tripInstanceId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_trip_logs')
        .select('*, student:students(*, profile:profiles(*))')
        .eq('trip_instance_id', tripInstanceId)
        .order('action_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching student logs:', err);
      return [];
    }
  };

  // Fetch events for a trip instance
  const fetchTripEvents = async (tripInstanceId: string) => {
    try {
      const { data, error } = await supabase
        .from('trip_events')
        .select('*')
        .eq('trip_instance_id', tripInstanceId)
        .order('event_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching trip events:', err);
      return [];
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!schoolId) {
      // Important: avoid infinite loading when the user has no school context yet.
      setTripInstances([]);
      setAlerts([]);
      setLoading(false);
      return;
    }

    fetchTodaysInstances();
    fetchAlerts();

    // Real-time subscription for alerts
    const alertChannel = supabase
      .channel('transport-alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'transport_alerts',
        filter: `school_id=eq.${schoolId}`
      }, (payload) => {
        setAlerts(prev => [payload.new as TransportAlert, ...prev]);
        toast.warning(payload.new.title, { description: payload.new.message });
      })
      .subscribe();

    // Real-time subscription for trip instance updates
    const instanceChannel = supabase
      .channel('trip-instances')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'trip_instances'
      }, (payload) => {
        setTripInstances(prev => prev.map(t => 
          t.id === payload.new.id ? { ...t, ...payload.new } : t
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(alertChannel);
      supabase.removeChannel(instanceChannel);
    };
  }, [schoolId, fetchTodaysInstances, fetchAlerts]);

  return {
    tripInstances,
    driverCheckins,
    studentLogs,
    tripEvents,
    alerts,
    locationLogs,
    loading,
    refetch: fetchTodaysInstances,
    startTrip,
    completeTrip,
    recordDriverCheckin,
    recordStudentAction,
    reportTripEvent,
    acknowledgeAlert,
    resolveAlert,
    fetchStudentLogs,
    fetchTripEvents,
    fetchAlerts
  };
};
