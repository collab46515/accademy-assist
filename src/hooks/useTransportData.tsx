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

  // Fetch all transport data - using mock data until database is ready
  const fetchTransportData = async () => {
    if (!currentSchool?.id) return;
    
    setLoading(true);
    try {
      // Mock data with realistic values
      const mockVehicles: Vehicle[] = [
        { 
          id: '1', 
          school_id: currentSchool.id, 
          vehicle_number: 'BUS-001', 
          vehicle_type: 'bus', 
          make: 'Mercedes', 
          model: 'Sprinter', 
          year: 2022, 
          capacity: 50, 
          fuel_type: 'diesel', 
          mileage: 45000, 
          status: 'active',
          registration_number: 'AB21 DEF',
          insurance_expiry: '2024-12-31',
          last_service_date: '2024-01-15',
          next_service_date: '2024-07-15',
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        },
        { 
          id: '2', 
          school_id: currentSchool.id, 
          vehicle_number: 'VAN-001', 
          vehicle_type: 'van', 
          make: 'Ford', 
          model: 'Transit', 
          year: 2021, 
          capacity: 25, 
          fuel_type: 'diesel', 
          mileage: 32000, 
          status: 'maintenance',
          registration_number: 'CD22 GHI',
          insurance_expiry: '2024-11-30',
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        }
      ];
      
      const mockDrivers: Driver[] = [
        { 
          id: '1', 
          school_id: currentSchool.id, 
          employee_id: 'DR001', 
          first_name: 'John', 
          last_name: 'Smith', 
          phone: '+44123456789', 
          license_number: 'DL123456', 
          license_expiry: '2025-12-31', 
          license_type: ['D1'], 
          hire_date: '2020-01-15', 
          status: 'active',
          email: 'john.smith@school.com',
          dbs_check_date: '2023-01-01',
          dbs_expiry: '2026-01-01',
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        }
      ];
      
      const mockRoutes: TransportRoute[] = [
        { 
          id: '1', 
          school_id: currentSchool.id, 
          route_name: 'Route 1 - City Center', 
          start_time: '07:30', 
          end_time: '08:15', 
          status: 'active', 
          days_of_week: [1,2,3,4,5],
          vehicle_id: '1',
          driver_id: '1',
          estimated_duration: 45,
          distance: 12.5,
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        }
      ];

      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
      setRoutes(mockRoutes);
      setStudentTransports([]);
      setMaintenance([]);
      setIncidents([]);
    } catch (error) {
      console.error('Error loading transport data:', error);
      toast.error('Failed to load transport data');
    } finally {
      setLoading(false);
    }
  };

  // Vehicle CRUD operations - mock implementation
  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    if (!currentSchool?.id) return null;
    
    try {
      // Mock implementation
      const newVehicle: Vehicle = {
        id: `vehicle-${Date.now()}`,
        school_id: currentSchool.id,
        vehicle_number: vehicleData.vehicle_number || `VEH-${Date.now()}`,
        vehicle_type: vehicleData.vehicle_type || 'van',
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || new Date().getFullYear(),
        capacity: vehicleData.capacity || 20,
        fuel_type: vehicleData.fuel_type || 'diesel',
        mileage: vehicleData.mileage || 0,
        status: vehicleData.status || 'active',
        registration_number: vehicleData.registration_number,
        insurance_expiry: vehicleData.insurance_expiry,
        mot_expiry: vehicleData.mot_expiry,
        last_service_date: vehicleData.last_service_date,
        next_service_date: vehicleData.next_service_date,
        purchase_date: vehicleData.purchase_date,
        purchase_cost: vehicleData.purchase_cost,
        notes: vehicleData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setVehicles(prev => [...prev, newVehicle]);
      toast.success("Vehicle added successfully");
      
      return newVehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error("Failed to add vehicle");
      return null;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const updatedVehicle = { ...updates, updated_at: new Date().toISOString() };
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedVehicle } : v));
      toast.success("Vehicle updated successfully");
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error("Failed to update vehicle");
      return null;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success("Vehicle deleted successfully");
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error("Failed to delete vehicle");
      return false;
    }
  };

  // Driver CRUD operations
  const addDriver = async (driverData: Partial<Driver>) => {
    if (!currentSchool?.id) return null;
    
    try {
      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        school_id: currentSchool.id,
        employee_id: driverData.employee_id || `DR${Date.now()}`,
        first_name: driverData.first_name || '',
        last_name: driverData.last_name || '',
        phone: driverData.phone || '',
        license_number: driverData.license_number || '',
        license_expiry: driverData.license_expiry || '',
        license_type: driverData.license_type || ['D1'],
        hire_date: driverData.hire_date || new Date().toISOString().split('T')[0],
        status: driverData.status || 'active',
        email: driverData.email,
        birth_date: driverData.birth_date,
        address: driverData.address,
        emergency_contact_name: driverData.emergency_contact_name,
        emergency_contact_phone: driverData.emergency_contact_phone,
        dbs_check_date: driverData.dbs_check_date,
        dbs_expiry: driverData.dbs_expiry,
        first_aid_cert_date: driverData.first_aid_cert_date,
        first_aid_expiry: driverData.first_aid_expiry,
        notes: driverData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDrivers(prev => [...prev, newDriver]);
      toast.success("Driver added successfully");
      return newDriver;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error("Failed to add driver");
      return null;
    }
  };

  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      const updatedDriver = { ...updates, updated_at: new Date().toISOString() };
      setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updatedDriver } : d));
      toast.success("Driver updated successfully");
      return updatedDriver;
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error("Failed to update driver");
      return null;
    }
  };

  // Route CRUD operations
  const addRoute = async (routeData: Partial<TransportRoute>) => {
    if (!currentSchool?.id) return null;
    
    try {
      const newRoute: TransportRoute = {
        id: `route-${Date.now()}`,
        school_id: currentSchool.id,
        route_name: routeData.route_name || '',
        start_time: routeData.start_time || '08:00',
        end_time: routeData.end_time || '09:00',
        status: routeData.status || 'active',
        days_of_week: routeData.days_of_week || [1,2,3,4,5],
        route_code: routeData.route_code,
        description: routeData.description,
        estimated_duration: routeData.estimated_duration,
        distance: routeData.distance,
        vehicle_id: routeData.vehicle_id,
        driver_id: routeData.driver_id,
        notes: routeData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setRoutes(prev => [...prev, newRoute]);
      toast.success("Route added successfully");
      return newRoute;
    } catch (error) {
      console.error('Error adding route:', error);
      toast.error("Failed to add route");
      return null;
    }
  };

  const updateRoute = async (id: string, updates: Partial<TransportRoute>) => {
    try {
      const updatedRoute = { ...updates, updated_at: new Date().toISOString() };
      setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updatedRoute } : r));
      toast.success("Route updated successfully");
      return updatedRoute;
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error("Failed to update route");
      return null;
    }
  };

  // Maintenance operations
  const addMaintenance = async (maintenanceData: Partial<VehicleMaintenance>) => {
    try {
      const newMaintenance: VehicleMaintenance = {
        id: `maintenance-${Date.now()}`,
        vehicle_id: maintenanceData.vehicle_id || '',
        maintenance_type: maintenanceData.maintenance_type || 'service',
        description: maintenanceData.description || '',
        service_date: maintenanceData.service_date || new Date().toISOString().split('T')[0],
        status: maintenanceData.status || 'scheduled',
        cost: maintenanceData.cost,
        mileage_at_service: maintenanceData.mileage_at_service,
        service_provider: maintenanceData.service_provider,
        next_service_due: maintenanceData.next_service_due,
        parts_replaced: maintenanceData.parts_replaced,
        warranty_expiry: maintenanceData.warranty_expiry,
        notes: maintenanceData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setMaintenance(prev => [...prev, newMaintenance]);
      toast.success("Maintenance record added successfully");
      return newMaintenance;
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast.error("Failed to add maintenance record");
      return null;
    }
  };

  // Student transport assignment operations
  const assignStudentToRoute = async (assignmentData: Partial<StudentTransport>) => {
    try {
      const newAssignment: StudentTransport = {
        id: `assignment-${Date.now()}`,
        student_id: assignmentData.student_id || '',
        route_id: assignmentData.route_id || '',
        start_date: assignmentData.start_date || new Date().toISOString().split('T')[0],
        status: assignmentData.status || 'active',
        payment_status: assignmentData.payment_status || 'pending',
        pickup_stop_id: assignmentData.pickup_stop_id,
        dropoff_stop_id: assignmentData.dropoff_stop_id,
        end_date: assignmentData.end_date,
        fee_amount: assignmentData.fee_amount,
        notes: assignmentData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setStudentTransports(prev => [...prev, newAssignment]);
      toast.success("Student assigned to route successfully");
      return newAssignment;
    } catch (error) {
      console.error('Error assigning student:', error);
      toast.error("Failed to assign student to route");
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