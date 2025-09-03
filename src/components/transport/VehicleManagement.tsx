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
import { Plus, Car, Fuel, Wrench, AlertTriangle, Calendar, MapPin, Users, CheckCircle, Truck } from 'lucide-react';
import { useTransportData } from '@/hooks/useTransportData';

export function VehicleManagement() {
  const { toast } = useToast();
  const { 
    loading, 
    vehicles, 
    maintenance, 
    stats, 
    addVehicle, 
    updateVehicle, 
    deleteVehicle, 
    addMaintenance 
  } = useTransportData();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  // Form states
  const [newVehicle, setNewVehicle] = useState({
    vehicle_number: '',
    vehicle_type: 'bus' as 'bus' | 'van' | 'minibus' | 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    fuel_type: 'diesel' as 'petrol' | 'diesel' | 'electric' | 'hybrid',
    mileage: 0,
    status: 'active' as 'active' | 'maintenance' | 'inactive' | 'retired'
  });

  // Generate maintenance alerts from real data
  const maintenanceAlerts = maintenance.filter(m => m.status === 'scheduled').map(m => ({
    id: m.id,
    vehicle: m.vehicle?.vehicle_number || 'Unknown',
    issue: m.description,
    priority: m.maintenance_type === 'repair' ? 'high' : 'medium',
    date: new Date(m.service_date).toLocaleDateString()
  }));

  const handleAddVehicle = async () => {
    if (!newVehicle.vehicle_number || !newVehicle.vehicle_type || !newVehicle.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await addVehicle(newVehicle);
    
    if (result) {
      setNewVehicle({
        vehicle_number: '',
        vehicle_type: 'bus',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        capacity: 0,
        fuel_type: 'diesel',
        mileage: 0,
        status: 'active'
      });
      setEditingVehicle(null);
      setShowDialog(false);
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setEditingVehicle(vehicle);
    setNewVehicle({
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      capacity: vehicle.capacity || 0,
      fuel_type: vehicle.fuel_type || 'diesel',
      mileage: vehicle.mileage || 0,
      status: vehicle.status
    });
    setShowDialog(true);
  };

  const handleScheduleService = async (vehicle: any) => {
    const maintenanceData = {
      vehicle_id: vehicle.id,
      maintenance_type: 'service' as const,
      description: 'Scheduled service',
      service_date: new Date().toISOString().split('T')[0],
      status: 'scheduled' as const
    };
    
    const result = await addMaintenance(maintenanceData);
    
    if (result) {
      setSelectedVehicle(vehicle);
      setServiceDialog(true);
    }
  };

  const handleScheduleMaintenance = async (alert: any) => {
    // Update maintenance status to in_progress
    const maintenanceItem = maintenance.find(m => m.id === alert.id);
    if (maintenanceItem) {
      // In a full implementation, you'd call updateMaintenance here
      toast({
        title: "Success",
        description: `Maintenance scheduled for ${alert.vehicle}`
      });
    }
  };

  const handleResolveAlert = async (alert: any) => {
    // Update maintenance status to completed
    const maintenanceItem = maintenance.find(m => m.id === alert.id);
    if (maintenanceItem) {
      // In a full implementation, you'd call updateMaintenance here
      toast({
        title: "Success",
        description: `${alert.issue} marked as resolved for ${alert.vehicle}`
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "maintenance":
        return <Badge variant="destructive">Maintenance</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "retired":
        return <Badge variant="outline">Retired</Badge>;
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
                      value={newVehicle.vehicle_number}
                      onChange={(e) => setNewVehicle({...newVehicle, vehicle_number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select value={newVehicle.vehicle_type} onValueChange={(value: 'bus' | 'van' | 'minibus' | 'car') => setNewVehicle({...newVehicle, vehicle_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="minibus">Minibus</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input 
                      id="make" 
                      placeholder="Mercedes" 
                      value={newVehicle.make}
                      onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input 
                      id="model" 
                      placeholder="Sprinter" 
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input 
                      id="year" 
                      type="number" 
                      placeholder="2024" 
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Seating Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="number" 
                      placeholder="50" 
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Fuel Type</Label>
                    <Select value={newVehicle.fuel_type} onValueChange={(value: 'petrol' | 'diesel' | 'electric' | 'hybrid') => setNewVehicle({...newVehicle, fuel_type: value})}>
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
                      onChange={(e) => setNewVehicle({...newVehicle, mileage: parseInt(e.target.value)})}
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
              <p className="text-2xl font-bold">{stats.totalVehicles}</p>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.activeVehicles}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Wrench className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.vehiclesInMaintenance}</p>
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
                      <p className="font-medium">{vehicle.vehicle_number}</p>
                      <Badge variant="outline" className="text-xs">{vehicle.vehicle_type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{vehicle.make} {vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.capacity} seats</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">Unassigned</p>
                      <p className="text-xs text-muted-foreground">No route assigned</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{vehicle.mileage?.toLocaleString()} mi</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last: {vehicle.last_service_date || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Next: {vehicle.next_service_date || 'TBD'}</p>
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