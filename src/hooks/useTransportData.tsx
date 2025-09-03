import { useState, useEffect } from 'react';
import { useRBAC } from './useRBAC';
import { toast } from 'sonner';

// Transport Types
export interface Vehicle {
  id: string;
  school_id: string;
  vehicle_number: string;
  vehicle_type: 'bus' | 'van' | 'minibus' | 'car';
  make: string;
  model: string;
  year: number;
  capacity: number;
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  registration_number?: string;
  insurance_expiry?: string;
  mot_expiry?: string;
  last_service_date?: string;
  next_service_date?: string;
  mileage: number;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  purchase_date?: string;
  purchase_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

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
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: 'active' | 'on_leave' | 'suspended' | 'terminated';
  dbs_check_date?: string;
  dbs_expiry?: string;
  first_aid_cert_date?: string;
  first_aid_expiry?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportRoute {
  id: string;
  school_id: string;
  route_name: string;
  route_code?: string;
  description?: string;
  start_time: string;
  end_time: string;
  estimated_duration?: number;
  distance?: number;
  vehicle_id?: string;
  driver_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  days_of_week: number[];
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  driver?: Driver;
  route_stops?: RouteStop[];
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_name: string;
  stop_address?: string;
  latitude?: number;
  longitude?: number;
  stop_order: number;
  arrival_time?: string;
  is_pickup: boolean;
  is_dropoff: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentTransport {
  id: string;
  student_id: string;
  route_id: string;
  pickup_stop_id?: string;
  dropoff_stop_id?: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'suspended' | 'terminated';
  fee_amount?: number;
  payment_status: 'pending' | 'paid' | 'overdue' | 'exempt';
  notes?: string;
  created_at: string;
  updated_at: string;
  student?: any;
  route?: TransportRoute;
  pickup_stop?: RouteStop;
  dropoff_stop?: RouteStop;
}

export interface VehicleMaintenance {
  id: string;
  vehicle_id: string;
  maintenance_type: 'service' | 'repair' | 'inspection' | 'cleaning' | 'fuel';
  description: string;
  service_date: string;
  cost?: number;
  mileage_at_service?: number;
  service_provider?: string;
  next_service_due?: string;
  parts_replaced?: string[];
  warranty_expiry?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface TransportIncident {
  id: string;
  incident_number: string;
  route_id?: string;
  vehicle_id?: string;
  driver_id?: string;
  incident_date: string;
  incident_type: 'accident' | 'breakdown' | 'delay' | 'behavior' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  description: string;
  students_involved?: string[];
  injuries_reported: boolean;
  police_involved: boolean;
  insurance_claim: boolean;
  resolved_at?: string;
  resolution_notes?: string;
  reported_by?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  route?: TransportRoute;
  vehicle?: Vehicle;
  driver?: Driver;
}

export function useTransportData() {
  const { currentSchool } = useRBAC();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [studentTransports, setStudentTransports] = useState<StudentTransport[]>([]);
  const [maintenance, setMaintenance] = useState<VehicleMaintenance[]>([]);
  const [incidents, setIncidents] = useState<TransportIncident[]>([]);

  // Fetch all transport data - using mock data until types are regenerated
  const fetchTransportData = async () => {
    if (!currentSchool?.id) return;
    
    setLoading(true);
    try {
      // Mock data - replace with real API calls once types are updated
      const mockVehicles = [
        { id: '1', school_id: currentSchool.id, vehicle_number: 'BUS-001', vehicle_type: 'bus' as const, make: 'Mercedes', model: 'Sprinter', year: 2022, capacity: 50, fuel_type: 'diesel' as const, mileage: 45000, status: 'active' as const, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', school_id: currentSchool.id, vehicle_number: 'VAN-001', vehicle_type: 'van' as const, make: 'Ford', model: 'Transit', year: 2021, capacity: 25, fuel_type: 'diesel' as const, mileage: 32000, status: 'maintenance' as const, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
      
      const mockDrivers = [
        { id: '1', school_id: currentSchool.id, employee_id: 'DR001', first_name: 'John', last_name: 'Smith', phone: '+44123456789', license_number: 'DL123456', license_expiry: '2025-12-31', license_type: ['D1'], hire_date: '2020-01-15', status: 'active' as const, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
      
      const mockRoutes = [
        { id: '1', school_id: currentSchool.id, route_name: 'Route 1 - City Center', start_time: '07:30', end_time: '08:15', status: 'active' as const, days_of_week: [1,2,3,4,5], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];

      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
      setRoutes(mockRoutes);
      setStudentTransports([]);
      setMaintenance([]);
      setIncidents([]);
    } catch (error) {
      console.error('Error loading transport data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vehicle CRUD operations - mock implementation
  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    if (!currentSchool?.id) return null;
    
    try {
      // Mock implementation
      const newVehicle = {
        ...vehicleData,
        id: `vehicle-${Date.now()}`,
        school_id: currentSchool.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Vehicle;

      setVehicles(prev => [...prev, newVehicle]);
      toast({
        title: "Success",
        description: "Vehicle added successfully"
      });
      
      return newVehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive"
      });
      return null;
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

      setVehicles(prev => prev.map(v => v.id === id ? data : v));
      toast({
        title: "Success",
        description: "Vehicle updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Success",
        description: "Vehicle deleted successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      });
      return false;
    }
  };

  // Driver CRUD operations
  const addDriver = async (driverData: Partial<Driver>) => {
    if (!currentSchool?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([{ ...driverData, school_id: currentSchool.id }])
        .select()
        .single();

      if (error) throw error;

      setDrivers(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Driver added successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive"
      });
      return null;
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

      setDrivers(prev => prev.map(d => d.id === id ? data : d));
      toast({
        title: "Success",
        description: "Driver updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating driver:', error);
      toast({
        title: "Error",
        description: "Failed to update driver",
        variant: "destructive"
      });
      return null;
    }
  };

  // Route CRUD operations
  const addRoute = async (routeData: Partial<TransportRoute>) => {
    if (!currentSchool?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('transport_routes')
        .insert([{ ...routeData, school_id: currentSchool.id }])
        .select()
        .single();

      if (error) throw error;

      setRoutes(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Route added successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error adding route:', error);
      toast({
        title: "Error",
        description: "Failed to add route",
        variant: "destructive"
      });
      return null;
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

      setRoutes(prev => prev.map(r => r.id === id ? data : r));
      toast({
        title: "Success",
        description: "Route updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating route:', error);
      toast({
        title: "Error",
        description: "Failed to update route",
        variant: "destructive"
      });
      return null;
    }
  };

  // Maintenance operations
  const addMaintenance = async (maintenanceData: Partial<VehicleMaintenance>) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .insert([maintenanceData])
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .single();

      if (error) throw error;

      setMaintenance(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Maintenance record added successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to add maintenance record",
        variant: "destructive"
      });
      return null;
    }
  };

  // Student transport assignment operations
  const assignStudentToRoute = async (assignmentData: Partial<StudentTransport>) => {
    try {
      const { data, error } = await supabase
        .from('student_transport')
        .insert([assignmentData])
        .select(`
          *,
          student:students(*, profiles(*)),
          route:transport_routes(*),
          pickup_stop:route_stops!pickup_stop_id(*),
          dropoff_stop:route_stops!dropoff_stop_id(*)
        `)
        .single();

      if (error) throw error;

      setStudentTransports(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Student assigned to route successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error assigning student:', error);
      toast({
        title: "Error",
        description: "Failed to assign student to route",
        variant: "destructive"
      });
      return null;
    }
  };

  // Load data on mount and school change
  useEffect(() => {
    fetchTransportData();
  }, [currentSchool?.id]);

  // Calculate statistics
  const stats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    vehiclesInMaintenance: vehicles.filter(v => v.status === 'maintenance').length,
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'active').length,
    totalRoutes: routes.length,
    activeRoutes: routes.filter(r => r.status === 'active').length,
    studentsTransported: studentTransports.filter(st => st.status === 'active').length,
    pendingMaintenance: maintenance.filter(m => m.status === 'scheduled').length,
    openIncidents: incidents.filter(i => i.status === 'open').length
  };

  return {
    loading,
    vehicles,
    drivers,
    routes,
    studentTransports,
    maintenance,
    incidents,
    stats,
    // CRUD operations
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDriver,
    updateDriver,
    addRoute,
    updateRoute,
    addMaintenance,
    assignStudentToRoute,
    refetch: fetchTransportData
  };
}