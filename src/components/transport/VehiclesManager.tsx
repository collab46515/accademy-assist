import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  Bus,
  Car,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Wrench,
  Users,
  Fuel
} from 'lucide-react';
import { useTransportData, type Vehicle } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VehicleFormData {
  vehicle_number: string;
  vehicle_type: string;
  capacity: number;
  driver_id?: string;
  assistant_id?: string;
  status: string;
  registration_number?: string;
  insurance_expiry?: Date;
  last_maintenance?: Date;
  next_maintenance?: Date;
  fuel_type?: string;
  year_manufactured?: number;
  make_model?: string;
}

export const VehiclesManager = () => {
  const { vehicles, drivers, loading, addVehicle, updateVehicle, deleteVehicle } = useTransportData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const form = useForm<VehicleFormData>({
    defaultValues: {
      vehicle_number: '',
      vehicle_type: 'bus',
      capacity: 30,
      status: 'active',
      fuel_type: 'diesel',
    }
  });

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make_model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      const vehicleData = {
        ...data,
        school_id: user?.user_metadata?.school_id || '',
        insurance_expiry: data.insurance_expiry ? format(data.insurance_expiry, 'yyyy-MM-dd') : undefined,
        last_maintenance: data.last_maintenance ? format(data.last_maintenance, 'yyyy-MM-dd') : undefined,
        next_maintenance: data.next_maintenance ? format(data.next_maintenance, 'yyyy-MM-dd') : undefined,
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await addVehicle(vehicleData);
      }

      setIsFormOpen(false);
      setEditingVehicle(null);
      form.reset();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.reset({
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type,
      capacity: vehicle.capacity,
      driver_id: vehicle.driver_id || '',
      assistant_id: vehicle.assistant_id || '',
      status: vehicle.status,
      registration_number: vehicle.registration_number || '',
      insurance_expiry: vehicle.insurance_expiry ? new Date(vehicle.insurance_expiry) : undefined,
      last_maintenance: vehicle.last_maintenance ? new Date(vehicle.last_maintenance) : undefined,
      next_maintenance: vehicle.next_maintenance ? new Date(vehicle.next_maintenance) : undefined,
      fuel_type: vehicle.fuel_type || 'diesel',
      year_manufactured: vehicle.year_manufactured || undefined,
      make_model: vehicle.make_model || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bus': return Bus;
      case 'minibus': return Bus;
      case 'van': return Car;
      default: return Bus;
    }
  };

  const isMaintenanceDue = (nextMaintenance?: string) => {
    if (!nextMaintenance) return false;
    const maintenanceDate = new Date(nextMaintenance);
    const today = new Date();
    const daysDifference = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDifference <= 7;
  };

  const isInsuranceExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysDifference = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDifference <= 30;
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return 'Unassigned';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vehicles Management</h2>
          <p className="text-muted-foreground">Manage fleet vehicles, maintenance, and assignments</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVehicle(null); form.reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
              <DialogDescription>
                Enter the vehicle information and maintenance details.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <FormField
                      control={form.control}
                      name="vehicle_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="BUS001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicle_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bus">Bus</SelectItem>
                              <SelectItem value="minibus">Minibus</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                              <SelectItem value="coach">Coach</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registration_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ABC 123" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="make_model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make & Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Mercedes Benz Sprinter" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year_manufactured"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Manufactured</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Assignment & Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Assignment & Status</h3>
                    <FormField
                      control={form.control}
                      name="driver_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned Driver</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select driver" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Unassigned</SelectItem>
                              {drivers.filter(d => d.status === 'active').map((driver) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                  {driver.first_name} {driver.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assistant_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assistant/Conductor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assistant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {drivers.filter(d => d.status === 'active').map((driver) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                  {driver.first_name} {driver.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fuel_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="petrol">Petrol</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insurance_expiry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Insurance Expiry</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="next_maintenance"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Next Maintenance</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Vehicles List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => {
          const VehicleIcon = getVehicleIcon(vehicle.vehicle_type);
          return (
            <Card key={vehicle.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <VehicleIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{vehicle.vehicle_number}</CardTitle>
                    <CardDescription>{vehicle.vehicle_type}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                  {isMaintenanceDue(vehicle.next_maintenance) && (
                    <Wrench className="h-4 w-4 text-amber-500" />
                  )}
                  {isInsuranceExpiringSoon(vehicle.insurance_expiry) && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Capacity: {vehicle.capacity}</span>
                </div>
                {vehicle.registration_number && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Reg:</span>
                    <span>{vehicle.registration_number}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Driver:</span>
                  <span>{getDriverName(vehicle.driver_id)}</span>
                </div>
                {vehicle.fuel_type && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.fuel_type}</span>
                  </div>
                )}
                
                {/* Alerts */}
                {(isMaintenanceDue(vehicle.next_maintenance) || isInsuranceExpiringSoon(vehicle.insurance_expiry)) && (
                  <div className="space-y-2">
                    <Separator />
                    {isMaintenanceDue(vehicle.next_maintenance) && (
                      <Badge variant="secondary" className="text-xs w-full justify-center">
                        Maintenance Due
                      </Badge>
                    )}
                    {isInsuranceExpiringSoon(vehicle.insurance_expiry) && (
                      <Badge variant="destructive" className="text-xs w-full justify-center">
                        Insurance Expiring
                      </Badge>
                    )}
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setIsDetailOpen(true);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete vehicle {vehicle.vehicle_number}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(vehicle.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'No vehicles match your search criteria.' : 'Get started by adding your first vehicle.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vehicle Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVehicle?.vehicle_number}</DialogTitle>
            <DialogDescription>
              Vehicle details and maintenance information
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Vehicle Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.vehicle_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedVehicle.status)}>
                    {selectedVehicle.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Capacity</Label>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.capacity} passengers</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Registration</Label>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.registration_number || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Make & Model</Label>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.make_model || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Year</Label>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.year_manufactured || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fuel Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.fuel_type || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned Driver</Label>
                  <p className="text-sm text-muted-foreground">{getDriverName(selectedVehicle.driver_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assistant</Label>
                  <p className="text-sm text-muted-foreground">{getDriverName(selectedVehicle.assistant_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Insurance Expiry</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.insurance_expiry ? 
                      new Date(selectedVehicle.insurance_expiry).toLocaleDateString() : 
                      'Not provided'
                    }
                    {isInsuranceExpiringSoon(selectedVehicle.insurance_expiry) && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Expiring Soon
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.last_maintenance ? 
                      new Date(selectedVehicle.last_maintenance).toLocaleDateString() : 
                      'Not recorded'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.next_maintenance ? 
                      new Date(selectedVehicle.next_maintenance).toLocaleDateString() : 
                      'Not scheduled'
                    }
                    {isMaintenanceDue(selectedVehicle.next_maintenance) && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Due Soon
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};