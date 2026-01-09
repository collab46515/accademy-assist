import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface RouteProfile {
  id: string;
  school_id: string;
  profile_name: string;
  profile_code?: string;
  description?: string;
  valid_from: string;
  valid_until: string;
  start_time: string;
  end_time: string;
  frequency: string;
  days_of_week: number[];
  trip_category: string;
  student_pool_type: string;
  student_pool_criteria: any;
  custom_holiday_ids?: string[];
  apply_school_holidays: boolean;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  approval_status: string;
  status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportTrip {
  id: string;
  school_id: string;
  route_profile_id: string;
  trip_name: string;
  trip_code?: string;
  trip_type: string;
  start_point?: string;
  end_point?: string;
  vehicle_id?: string;
  driver_id?: string;
  attender_id?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  estimated_duration_minutes?: number;
  estimated_distance_km?: number;
  estimated_fuel_required?: number;
  vehicle_capacity?: number;
  assigned_students_count: number;
  status: string;
  created_at: string;
  updated_at: string;
  vehicle?: any;
  driver?: any;
}

export interface TripStop {
  id: string;
  trip_id: string;
  stop_id?: string;
  stop_name: string;
  stop_order: number;
  scheduled_arrival_time: string;
  scheduled_departure_time?: string;
  estimated_wait_minutes: number;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  geofence_radius_meters: number;
  distance_from_previous_km?: number;
  total_students_at_stop: number;
  assigned_students_count: number;
  assignment_status: string;
  created_at: string;
  updated_at: string;
}

export interface StudentTripAssignment {
  id: string;
  school_id: string;
  trip_id: string;
  trip_stop_id: string;
  student_id: string;
  assignment_type: string;
  parent_name?: string;
  parent_phone?: string;
  parent_notification_preference: string;
  special_instructions?: string;
  status: string;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
  student?: any;
}

export interface StandbyResource {
  id: string;
  school_id: string;
  route_profile_id?: string;
  resource_type: string;
  driver_id?: string;
  vehicle_id?: string;
  available_from?: string;
  available_until?: string;
  days_available: number[];
  is_available: boolean;
  currently_assigned_to?: string;
  assigned_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  driver?: any;
  vehicle?: any;
}

export const useTripPlanning = (schoolId: string | null) => {
  const { user } = useAuth();
  const [routeProfiles, setRouteProfiles] = useState<RouteProfile[]>([]);
  const [trips, setTrips] = useState<TransportTrip[]>([]);
  const [tripStops, setTripStops] = useState<TripStop[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<StudentTripAssignment[]>([]);
  const [standbyResources, setStandbyResources] = useState<StandbyResource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!schoolId) return;

    try {
      setLoading(true);

      const [profilesRes, tripsRes, standbyRes] = await Promise.all([
        supabase.from('route_profiles').select('*').eq('school_id', schoolId).order('profile_name'),
        supabase.from('transport_trips').select('*, vehicle:vehicles(*), driver:drivers!transport_trips_driver_id_fkey(*), attender:drivers!transport_trips_attender_id_fkey(*)').eq('school_id', schoolId).order('trip_name'),
        supabase.from('standby_resources').select('*, driver:drivers(*), vehicle:vehicles(*)').eq('school_id', schoolId)
      ]);

      if (profilesRes.data) setRouteProfiles(profilesRes.data);
      if (tripsRes.data) setTrips(tripsRes.data);
      if (standbyRes.data) setStandbyResources(standbyRes.data);

    } catch (err) {
      console.error('Error fetching trip planning data:', err);
      toast.error('Failed to load trip planning data');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  // Fetch trips for a specific route profile
  const fetchTripsForProfile = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('transport_trips')
        .select('*, vehicle:vehicles(*), driver:drivers!transport_trips_driver_id_fkey(*), attender:drivers!transport_trips_attender_id_fkey(*)')
        .eq('route_profile_id', profileId)
        .order('scheduled_start_time');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching trips:', err);
      return [];
    }
  };

  // Fetch stops for a specific trip
  const fetchTripStops = async (tripId: string) => {
    try {
      const { data, error } = await supabase
        .from('trip_stops')
        .select('*')
        .eq('trip_id', tripId)
        .order('stop_order');

      if (error) throw error;
      setTripStops(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching trip stops:', err);
      return [];
    }
  };

  // Fetch student assignments for a trip
  const fetchStudentAssignments = async (tripId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_trip_assignments')
        .select('*, student:students(*, profile:profiles(*))')
        .eq('trip_id', tripId)
        .order('created_at');

      if (error) throw error;
      setStudentAssignments(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching student assignments:', err);
      return [];
    }
  };

  // CRUD for Route Profiles
  const addRouteProfile = async (data: Omit<RouteProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('route_profiles')
        .insert([{ ...data, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setRouteProfiles(prev => [...prev, result]);
      toast.success('Route profile created successfully');
      return result;
    } catch (err) {
      toast.error('Failed to create route profile');
      throw err;
    }
  };

  const updateRouteProfile = async (id: string, updates: Partial<RouteProfile>) => {
    try {
      const { data, error } = await supabase
        .from('route_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRouteProfiles(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Route profile updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update route profile');
      throw err;
    }
  };

  const deleteRouteProfile = async (id: string) => {
    try {
      const { error } = await supabase.from('route_profiles').delete().eq('id', id);
      if (error) throw error;
      setRouteProfiles(prev => prev.filter(p => p.id !== id));
      toast.success('Route profile deleted successfully');
    } catch (err) {
      toast.error('Failed to delete route profile');
      throw err;
    }
  };

  // CRUD for Trips
  const addTrip = async (data: Omit<TransportTrip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('transport_trips')
        .insert([data])
        .select('*, vehicle:vehicles(*), driver:drivers!transport_trips_driver_id_fkey(*), attender:drivers!transport_trips_attender_id_fkey(*)')
        .single();

      if (error) throw error;
      setTrips(prev => [...prev, result]);
      toast.success('Trip created successfully');
      return result;
    } catch (err) {
      toast.error('Failed to create trip');
      throw err;
    }
  };

  const updateTrip = async (id: string, updates: Partial<TransportTrip>) => {
    try {
      const { data, error } = await supabase
        .from('transport_trips')
        .update(updates)
        .eq('id', id)
        .select('*, vehicle:vehicles(*), driver:drivers!transport_trips_driver_id_fkey(*), attender:drivers!transport_trips_attender_id_fkey(*)')
        .single();

      if (error) throw error;
      setTrips(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Trip updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update trip');
      throw err;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase.from('transport_trips').delete().eq('id', id);
      if (error) throw error;
      setTrips(prev => prev.filter(t => t.id !== id));
      toast.success('Trip deleted successfully');
    } catch (err) {
      toast.error('Failed to delete trip');
      throw err;
    }
  };

  // CRUD for Trip Stops
  const addTripStop = async (data: Omit<TripStop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('trip_stops')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setTripStops(prev => [...prev, result]);
      toast.success('Stop added successfully');
      return result;
    } catch (err) {
      toast.error('Failed to add stop');
      throw err;
    }
  };

  const updateTripStop = async (id: string, updates: Partial<TripStop>) => {
    try {
      const { data, error } = await supabase
        .from('trip_stops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTripStops(prev => prev.map(s => s.id === id ? data : s));
      toast.success('Stop updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update stop');
      throw err;
    }
  };

  const deleteTripStop = async (id: string) => {
    try {
      const { error } = await supabase.from('trip_stops').delete().eq('id', id);
      if (error) throw error;
      setTripStops(prev => prev.filter(s => s.id !== id));
      toast.success('Stop deleted successfully');
    } catch (err) {
      toast.error('Failed to delete stop');
      throw err;
    }
  };

  // Calculate total trip distance from stops with coordinates
  const calculateTripDistance = async (tripId: string): Promise<number | null> => {
    try {
      const { data: stops, error } = await supabase
        .from('trip_stops')
        .select('latitude, longitude, stop_order, distance_from_previous_km')
        .eq('trip_id', tripId)
        .order('stop_order');

      if (error) throw error;
      if (!stops || stops.length < 2) return null;

      // If distances are already calculated, sum them
      const hasCalculatedDistances = stops.some(s => s.distance_from_previous_km != null);
      if (hasCalculatedDistances) {
        return stops.reduce((sum, stop) => sum + (stop.distance_from_previous_km || 0), 0);
      }

      // Otherwise, calculate straight-line distances (Haversine formula)
      const stopsWithCoords = stops.filter(s => s.latitude != null && s.longitude != null);
      if (stopsWithCoords.length < 2) return null;

      let totalDistance = 0;
      for (let i = 1; i < stopsWithCoords.length; i++) {
        const prev = stopsWithCoords[i - 1];
        const curr = stopsWithCoords[i];
        const distance = haversineDistance(
          prev.latitude!, prev.longitude!,
          curr.latitude!, curr.longitude!
        );
        totalDistance += distance;
      }

      return Math.round(totalDistance * 10) / 10; // Round to 1 decimal
    } catch (err) {
      console.error('Error calculating trip distance:', err);
      return null;
    }
  };

  // Haversine formula to calculate distance between two points
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Update trip with calculated distance
  const updateTripDistance = async (tripId: string) => {
    const distance = await calculateTripDistance(tripId);
    if (distance !== null) {
      await supabase
        .from('transport_trips')
        .update({ estimated_distance_km: distance })
        .eq('id', tripId);
    }
    return distance;
  };

  // CRUD for Student Assignments
  const addStudentAssignment = async (data: Omit<StudentTripAssignment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('student_trip_assignments')
        .insert([data])
        .select('*, student:students(*, profile:profiles(*))')
        .single();

      if (error) throw error;
      setStudentAssignments(prev => [...prev, result]);
      toast.success('Student assigned successfully');
      return result;
    } catch (err) {
      toast.error('Failed to assign student');
      throw err;
    }
  };

  const removeStudentAssignment = async (id: string) => {
    try {
      const { error } = await supabase.from('student_trip_assignments').delete().eq('id', id);
      if (error) throw error;
      setStudentAssignments(prev => prev.filter(a => a.id !== id));
      toast.success('Student removed from trip');
    } catch (err) {
      toast.error('Failed to remove student');
      throw err;
    }
  };

  // CRUD for Standby Resources
  const addStandbyResource = async (data: Omit<StandbyResource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('standby_resources')
        .insert([data])
        .select('*, driver:drivers(*), vehicle:vehicles(*)')
        .single();

      if (error) throw error;
      setStandbyResources(prev => [...prev, result]);
      toast.success('Standby resource added successfully');
      return result;
    } catch (err) {
      toast.error('Failed to add standby resource');
      throw err;
    }
  };

  const updateStandbyResource = async (id: string, updates: Partial<StandbyResource>) => {
    try {
      const { data, error } = await supabase
        .from('standby_resources')
        .update(updates)
        .eq('id', id)
        .select('*, driver:drivers(*), vehicle:vehicles(*)')
        .single();

      if (error) throw error;
      setStandbyResources(prev => prev.map(r => r.id === id ? data : r));
      toast.success('Standby resource updated');
      return data;
    } catch (err) {
      toast.error('Failed to update standby resource');
      throw err;
    }
  };

  const deleteStandbyResource = async (id: string) => {
    try {
      const { error } = await supabase.from('standby_resources').delete().eq('id', id);
      if (error) throw error;
      setStandbyResources(prev => prev.filter(r => r.id !== id));
      toast.success('Standby resource removed');
    } catch (err) {
      toast.error('Failed to remove standby resource');
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    routeProfiles,
    trips,
    tripStops,
    studentAssignments,
    standbyResources,
    loading,
    refetch: fetchData,
    fetchTripsForProfile,
    fetchTripStops,
    fetchStudentAssignments,
    // Route Profile operations
    addRouteProfile,
    updateRouteProfile,
    deleteRouteProfile,
    // Trip operations
    addTrip,
    updateTrip,
    deleteTrip,
    // Trip Stop operations
    addTripStop,
    updateTripStop,
    deleteTripStop,
    // Distance calculation
    calculateTripDistance,
    updateTripDistance,
    // Student Assignment operations
    addStudentAssignment,
    removeStudentAssignment,
    // Standby Resource operations
    addStandbyResource,
    updateStandbyResource,
    deleteStandbyResource,
  };
};
