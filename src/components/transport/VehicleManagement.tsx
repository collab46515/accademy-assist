import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Car, Fuel, Wrench, AlertTriangle, Calendar, MapPin, Users, CheckCircle, Truck } from 'lucide-react';

export function VehicleManagement() {
  const { toast } = useToast();
  const { currentSchool } = useRBAC();
  const [showDialog, setShowDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  
  // Form states
  const [newVehicle, setNewVehicle] = useState({
    number: '',
    type: '',
    capacity: '',
    driver: '',
    fuel_type: '',
    mileage: '',
    status: 'active'
  });

  // Mock data for demonstration
  const mockVehicles = [
    {
      id: "1",
      number: "TB-01",
      type: "Bus",
      capacity: 50,
      model: "Mercedes Sprinter",
      year: 2020,
      mileage: 45000,
      status: "Active",
      driver: "Sarah Johnson",
      route: "Route 1",
      lastService: "2024-01-15",
      nextService: "2024-04-15"
    },
    {
      id: "2", 
      number: "TB-02",
      type: "Bus",
      capacity: 45,
      model: "Ford Transit",
      year: 2019,
      mileage: 62000,
      status: "Maintenance",
      driver: "Unassigned",
      route: "None",
      lastService: "2024-01-20",
      nextService: "2024-02-20"
    },
    {
      id: "3",
      number: "TV-03", 
      type: "Van",
      capacity: 25,
      model: "Volkswagen Crafter",
      year: 2021,
      mileage: 28000,
      status: "Active",
      driver: "John Smith",
      route: "Route 3",
      lastService: "2024-01-10",
      nextService: "2024-07-10"
    }
  ];

  // Fetch vehicles data
  useEffect(() => {
    if (currentSchool) {
      fetchVehicles();
      fetchMaintenanceAlerts();
    }
  }, [currentSchool]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_vehicles')
        .select('*')
        .eq('school_id', currentSchool.id)
        .order('vehicle_number');
      
      if (error) throw error;
      setVehicles(data || mockVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Fallback to mock data if no database data
      setVehicles(mockVehicles);
    }
  };

  const fetchMaintenanceAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_maintenance')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('status', 'pending')
        .order('due_date');
      
      if (error) throw error;
      setMaintenanceAlerts(data || []);
    } catch (error) {
      console.error('Error fetching maintenance alerts:', error);
      // Fallback to mock data
      setMaintenanceAlerts([
        {
          id: 1,
          vehicle: 'BUS-001',
          issue: 'Oil Change Due',
          priority: 'medium',
          date: '2024-01-20'
        },
        {
          id: 2,
          vehicle: 'BUS-002',
          issue: 'Tire Replacement',
          priority: 'high',
          date: '2024-01-18'
        },
        {
          id: 3,
          vehicle: 'VAN-001',
          issue: 'Brake Inspection',
          priority: 'high',
          date: '2024-01-22'
        }
      ]);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.number || !newVehicle.type || !newVehicle.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const vehicleData = {
        ...newVehicle,
        school_id: currentSchool?.id,
        vehicle_number: newVehicle.number,
        vehicle_type: newVehicle.type,
        seating_capacity: parseInt(newVehicle.capacity),
        current_mileage: parseInt(newVehicle.mileage) || 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('transport_vehicles')
        .insert([vehicleData])
        .select();

      if (error) throw error;

      setVehicles([...vehicles, data[0]]);
      setNewVehicle({
        number: '',
        type: '',
        capacity: '',
        driver: '',
        fuel_type: '',
        mileage: '',
        status: 'active'
      });
      setShowDialog(false);
      
      toast({
        title: "Success",
        description: "Vehicle added successfully!"
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditingVehicle(vehicle);
    setNewVehicle({
      number: vehicle.vehicle_number || vehicle.number,
      type: vehicle.vehicle_type || vehicle.type,
      capacity: vehicle.seating_capacity?.toString() || vehicle.capacity?.toString(),
      driver: vehicle.driver_name || vehicle.driver || '',
      fuel_type: vehicle.fuel_type || '',
      mileage: vehicle.current_mileage?.toString() || vehicle.mileage?.toString() || '',
      status: vehicle.status
    });
    setShowDialog(true);
  };

  const handleScheduleService = (vehicle) => {
    setSelectedVehicle(vehicle);
    setServiceDialog(true);
  };

  const handleScheduleMaintenance = async (alert) => {
    try {
      const { error } = await supabase
        .from('transport_maintenance')
        .update({ 
          status: 'scheduled',
          scheduled_date: new Date().toISOString()
        })
        .eq('id', alert.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Maintenance scheduled for ${alert.vehicle}`
      });
      
      fetchMaintenanceAlerts();
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast({
        title: "Error",
        description: "Failed to schedule maintenance",
        variant: "destructive"
      });
    }
  };

  const handleResolveAlert = async (alert) => {
    try {
      const { error } = await supabase
        .from('transport_maintenance')
        .update({ 
          status: 'completed',
          completed_date: new Date().toISOString()
        })
        .eq('id', alert.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${alert.issue} marked as resolved for ${alert.vehicle}`
      });
      
      fetchMaintenanceAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "Maintenance":
        return <Badge variant="destructive">Maintenance</Badge>;
      case "Out of Service":
        return <Badge variant="secondary">Out of Service</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <p className="text-muted-foreground">Monitor and manage school transport fleet</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-number">Vehicle Number</Label>
                  <Input 
                    id="vehicle-number" 
                    placeholder="BUS-001" 
                    value={newVehicle.number}
                    onChange={(e) => setNewVehicle({...newVehicle, number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select value={newVehicle.type} onValueChange={(value) => setNewVehicle({...newVehicle, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Seating Capacity</Label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    placeholder="50" 
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({...newVehicle, capacity: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Driver Name</Label>
                  <Input 
                    id="driver" 
                    placeholder="John Smith" 
                    value={newVehicle.driver}
                    onChange={(e) => setNewVehicle({...newVehicle, driver: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <Select value={newVehicle.fuel_type} onValueChange={(value) => setNewVehicle({...newVehicle, fuel_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input 
                    id="mileage" 
                    type="number" 
                    placeholder="0" 
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleAddVehicle} disabled={loading}>
                {loading ? "Processing..." : editingVehicle ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fleet Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{vehicles.length}</p>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'Active').length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Wrench className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'Maintenance').length}</p>
              <p className="text-sm text-muted-foreground">In Maintenance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{maintenanceAlerts.length}</p>
              <p className="text-sm text-muted-foreground">Service Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>Complete list of school vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{vehicle.vehicle_number || vehicle.number}</p>
                      <Badge variant="outline" className="text-xs">{vehicle.vehicle_type || vehicle.type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.seating_capacity || vehicle.capacity} seats</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{vehicle.driver_name || vehicle.driver || "Unassigned"}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.route || "No route"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{(vehicle.current_mileage || vehicle.mileage)?.toLocaleString()} mi</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last: {vehicle.lastService}</p>
                      <p className="text-xs text-muted-foreground">Next: {vehicle.nextService}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(vehicle.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => handleScheduleService(vehicle)}>Service</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Maintenance Alerts
          </CardTitle>
          <CardDescription>Upcoming service requirements and issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{alert.vehicle}</p>
                    <Badge variant={alert.priority === "high" ? "destructive" : alert.priority === "medium" ? "secondary" : "outline"}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.issue}</p>
                  <p className="text-xs text-muted-foreground">Due: {alert.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleScheduleMaintenance(alert)}>Schedule</Button>
                  <Button size="sm" onClick={() => handleResolveAlert(alert)}>Resolve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}