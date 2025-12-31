import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { toast } from 'sonner';

export interface Driver {
  id: string;
  school_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  license_type: string[];
  hire_date: string;
  birth_date?: string;
  address?: string;
  permanent_address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: string;
  dbs_check_date?: string;
  dbs_expiry?: string;
  first_aid_cert_date?: string;
  first_aid_expiry?: string;
  notes?: string;
  // KYC fields
  aadhar_number?: string;
  aadhar_document_url?: string;
  photo_url?: string;
  // Background check
  background_check_status?: string;
  background_check_date?: string;
  background_check_document_url?: string;
  police_verification_status?: string;
  police_verification_date?: string;
  // Medical fitness
  medical_fitness_date?: string;
  medical_fitness_expiry?: string;
  medical_certificate_url?: string;
  blood_group?: string;
  // Driver-specific qualifications
  psv_badge_number?: string;
  psv_badge_expiry?: string;
  psv_badge_document_url?: string;
  hmv_permit_number?: string;
  hmv_permit_expiry?: string;
  hmv_permit_document_url?: string;
  license_document_url?: string;
  // Employment details
  employee_type?: string;
  employment_type?: string;
  contractor_id?: string;
  gender?: string;
  marital_status?: string;
  uniform_size?: string;
  id_card_issued?: boolean;
  id_card_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  school_id: string;
  vehicle_number: string;
  vehicle_type: string;
  capacity: number;
  driver_id?: string;
  assistant_id?: string;
  status: string;
  registration_number?: string;
  insurance_expiry?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  fuel_type?: string;
  year_manufactured?: number;
  make_model?: string;
  // Fleet management fields
  tank_capacity_litres?: number;
  current_mileage_kmpl?: number;
  manufacturer_mileage_kmpl?: number;
  current_odometer?: number;
  virtual_fuel_litres?: number;
  ownership_type?: string;
  contractor_id?: string;
  // Additional details
  make?: string;
  model?: string;
  color?: string;
  chassis_number?: string;
  engine_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  retirement_date?: string;
  gps_device_id?: string;
  gps_device_status?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportRoute {
  id: string;
  school_id: string;
  route_name: string;
  route_code: string;
  vehicle_id?: string;
  driver_id?: string;
  assistant_id?: string;
  route_type: string;
  start_time: string;
  end_time?: string;
  estimated_duration?: number;
  distance_km?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_name: string;
  stop_order: number;
  pickup_time: string;
  drop_time?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  distance_from_school?: number;
  estimated_travel_time?: number;
  // New fields for Stop Location Master
  stop_type?: string;
  geofence_radius_meters?: number;
  landmark?: string;
  is_active?: boolean;
  student_count?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentTransport {
  id: string;
  school_id: string;
  student_id: string;
  route_id: string;
  stop_id: string;
  pickup_stop_id?: string;
  drop_stop_id?: string;
  transport_fee: number;
  fee_frequency: string;
  start_date: string;
  end_date?: string;
  status: string;
  parent_phone?: string;
  emergency_contact?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportIncident {
  id: string;
  school_id: string;
  vehicle_id: string;
  route_id?: string;
  incident_type: string;
  incident_date: string;
  location?: string;
  description: string;
  severity: string;
  reported_by: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  status: string;
  students_affected?: string[];
  parent_notified: boolean;
  authorities_notified: boolean;
  insurance_claim: boolean;
  created_at: string;
  updated_at: string;
}

export const useTransportData = () => {
  const { user } = useAuth();
  const { currentSchool, loading: rbacLoading } = useRBAC();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [studentTransport, setStudentTransport] = useState<StudentTransport[]>([]);
  const [incidents, setIncidents] = useState<TransportIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null);

  // Refs to prevent duplicate fetches and cache data
  const isFetchingRef = useRef(false);
  const lastFetchedSchoolRef = useRef<string | null>(null);
  const hasCachedDataRef = useRef(false);

  // Fetch all transport data
  const fetchTransportData = useCallback(async (forceRefresh = false) => {
    if (!user || rbacLoading) {
      setDrivers([]);
      setVehicles([]);
      setRoutes([]);
      setStops([]);
      setStudentTransport([]);
      setIncidents([]);
      setUserSchoolId(null);
      setLoading(false);
      return;
    }

    const schoolId = currentSchool?.id || null;

    if (!schoolId) {
      setUserSchoolId(null);
      toast.error('Please select a school from the header dropdown.');
      setLoading(false);
      return;
    }

    // Skip fetch if we already have cached data for this school and not forcing refresh
    if (!forceRefresh && hasCachedDataRef.current && lastFetchedSchoolRef.current === schoolId) {
      setLoading(false);
      return;
    }

    // Prevent duplicate concurrent fetches
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      setUserSchoolId(schoolId);

      const [driversRes, vehiclesRes, routesRes, stopsRes, studentTransportRes, incidentsRes] = await Promise.all([
        supabase.from('drivers').select('*').eq('school_id', schoolId).order('first_name'),
        supabase.from('vehicles').select('*').eq('school_id', schoolId).order('vehicle_number'),
        supabase.from('transport_routes').select('*').eq('school_id', schoolId).order('route_name'),
        supabase.from('route_stops').select('*').order('stop_order'),
        supabase.from('student_transport').select('*').eq('school_id', schoolId).order('created_at', { ascending: false }),
        supabase.from('transport_incidents').select('*').eq('school_id', schoolId).order('incident_date', { ascending: false })
      ]);

      if (driversRes.error) throw driversRes.error;
      if (vehiclesRes.error) throw vehiclesRes.error;
      if (routesRes.error) throw routesRes.error;
      if (stopsRes.error) throw stopsRes.error;
      if (studentTransportRes.error) throw studentTransportRes.error;
      if (incidentsRes.error) throw incidentsRes.error;

      setDrivers(driversRes.data || []);
      setVehicles(vehiclesRes.data || []);
      setRoutes(routesRes.data || []);
      setStops(stopsRes.data || []);
      setStudentTransport(studentTransportRes.data || []);
      setIncidents(incidentsRes.data || []);

      // Mark as cached
      lastFetchedSchoolRef.current = schoolId;
      hasCachedDataRef.current = true;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transport data');
      toast.error('Failed to load transport data');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [user, currentSchool?.id, rbacLoading]);

  // CRUD operations for drivers
  const addDriver = async (driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([driverData])
        .select()
        .single();

      if (error) throw error;

      setDrivers(prev => [...prev, data]);
      toast.success('Driver added successfully');
      return data;
    } catch (err) {
      toast.error('Failed to add driver');
      throw err;
    }
  };

  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDrivers(prev => prev.map(driver => driver.id === id ? data : driver));
      toast.success('Driver updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update driver');
      throw err;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDrivers(prev => prev.filter(driver => driver.id !== id));
      toast.success('Driver deleted successfully');
    } catch (err) {
      toast.error('Failed to delete driver');
      throw err;
    }
  };

  // CRUD operations for vehicles
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => [...prev, data]);
      toast.success('Vehicle added successfully');
      return data;
    } catch (err) {
      toast.error('Failed to add vehicle');
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => prev.map(vehicle => vehicle.id === id ? data : vehicle));
      toast.success('Vehicle updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update vehicle');
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      toast.success('Vehicle deleted successfully');
    } catch (err) {
      toast.error('Failed to delete vehicle');
      throw err;
    }
  };

  // CRUD operations for routes
  const addRoute = async (routeData: Omit<TransportRoute, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('transport_routes')
        .insert([routeData])
        .select()
        .single();

      if (error) throw error;

      setRoutes(prev => [...prev, data]);
      toast.success('Route added successfully');
      return data;
    } catch (err) {
      toast.error('Failed to add route');
      throw err;
    }
  };

  const updateRoute = async (id: string, updates: Partial<TransportRoute>) => {
    try {
      const { data, error } = await supabase
        .from('transport_routes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRoutes(prev => prev.map(route => route.id === id ? data : route));
      toast.success('Route updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update route');
      throw err;
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transport_routes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRoutes(prev => prev.filter(route => route.id !== id));
      toast.success('Route deleted successfully');
    } catch (err) {
      toast.error('Failed to delete route');
      throw err;
    }
  };

  // CRUD operations for incidents
  const addIncident = async (incidentData: Omit<TransportIncident, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('transport_incidents')
        .insert([incidentData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // Fallback to local state if database table doesn't exist
        const newIncident: TransportIncident = {
          ...incidentData,
          id: `incident_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setIncidents(prev => [newIncident, ...prev]);
        toast.success('Incident reported successfully (local mode)');
        return newIncident;
      }

      setIncidents(prev => [data, ...prev]);
      toast.success('Incident reported successfully');
      return data;
    } catch (err) {
      console.error('Error reporting incident:', err);
      // Fallback: create incident locally
      const newIncident: TransportIncident = {
        ...incidentData,
        id: `incident_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setIncidents(prev => [newIncident, ...prev]);
      toast.success('Incident reported successfully (local mode)');
      return newIncident;
    }
  };

  const updateIncident = async (id: string, updates: Partial<TransportIncident>) => {
    try {
      const { data, error } = await supabase
        .from('transport_incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setIncidents(prev => prev.map(incident => incident.id === id ? data : incident));
      toast.success('Incident updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update incident');
      throw err;
    }
  };

  useEffect(() => {
    if (!rbacLoading) {
      fetchTransportData();
    }
  }, [fetchTransportData, rbacLoading]);

  return {
    drivers,
    vehicles,
    routes,
    stops,
    studentTransport,
    incidents,
    loading,
    error,
    userSchoolId,
    refetch: fetchTransportData,
    // Driver operations
    addDriver,
    updateDriver,
    deleteDriver,
    // Vehicle operations
    addVehicle,
    updateVehicle,
    deleteVehicle,
    // Route operations
    addRoute,
    updateRoute,
    deleteRoute,
    // Incident operations
    addIncident,
    updateIncident,
  };
};