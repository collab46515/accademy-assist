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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  Route,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Eye,
  Users,
  Navigation,
  Timer,
  Bus
} from 'lucide-react';
import { useTransportData, type TransportRoute } from '@/hooks/useTransportData';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';

interface RouteFormData {
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
}

export const RoutesManager = () => {
  const { routes, vehicles, drivers, loading, addRoute, updateRoute, deleteRoute } = useTransportData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);

  const form = useForm<RouteFormData>({
    defaultValues: {
      route_name: '',
      route_code: '',
      route_type: 'pickup_drop',
      start_time: '07:00',
      status: 'active',
    }
  });

  const filteredRoutes = routes.filter(route =>
    route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.route_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (data: RouteFormData) => {
    try {
      const routeData = {
        ...data,
        school_id: user?.user_metadata?.school_id || '',
      };

      if (editingRoute) {
        await updateRoute(editingRoute.id, routeData);
      } else {
        await addRoute(routeData);
      }

      setIsFormOpen(false);
      setEditingRoute(null);
      form.reset();
    } catch (error) {
      console.error('Failed to save route:', error);
    }
  };

  const handleEdit = (route: TransportRoute) => {
    setEditingRoute(route);
    form.reset({
      route_name: route.route_name,
      route_code: route.route_code,
      vehicle_id: route.vehicle_id || '',
      driver_id: route.driver_id || '',
      assistant_id: route.assistant_id || '',
      route_type: route.route_type,
      start_time: route.start_time,
      end_time: route.end_time || '',
      estimated_duration: route.estimated_duration || undefined,
      distance_km: route.distance_km ? Number(route.distance_km) : undefined,
      status: route.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRoute(id);
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRouteTypeColor = (type: string) => {
    switch (type) {
      case 'pickup_only': return 'bg-blue-100 text-blue-800';
      case 'drop_only': return 'bg-purple-100 text-purple-800';
      case 'pickup_drop': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleName = (vehicleId?: string) => {
    if (!vehicleId) return 'Unassigned';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.vehicle_number : 'Unknown Vehicle';
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
          <h2 className="text-2xl font-bold">Routes Management</h2>
          <p className="text-muted-foreground">Manage transport routes, schedules, and assignments</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingRoute(null); form.reset(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
              <DialogDescription>
                Enter the route information and schedule details.
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
                      name="route_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="City Center Route" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="route_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="RT001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="route_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pickup_drop">Pickup & Drop</SelectItem>
                              <SelectItem value="pickup_only">Pickup Only</SelectItem>
                              <SelectItem value="drop_only">Drop Only</SelectItem>
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
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="distance_km"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance (km)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Schedule & Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Schedule & Assignment</h3>
                    <FormField
                      control={form.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimated_duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned Vehicle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Unassigned</SelectItem>
                              {vehicles.filter(v => v.status === 'active').map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.vehicle_number} ({vehicle.vehicle_type})
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
                    {editingRoute ? 'Update Route' : 'Add Route'}
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
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Routes List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{route.route_name}</CardTitle>
                  <CardDescription>{route.route_code}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Badge className={getStatusColor(route.status)}>
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getRouteTypeColor(route.route_type)}>
                  {route.route_type.replace('_', ' ')}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{route.start_time}</span>
                  {route.end_time && <span>- {route.end_time}</span>}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Bus className="h-4 w-4 text-muted-foreground" />
                  <span>{getVehicleName(route.vehicle_id)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{getDriverName(route.driver_id)}</span>
                </div>
                
                {route.distance_km && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span>{route.distance_km} km</span>
                  </div>
                )}
                
                {route.estimated_duration && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>{route.estimated_duration} min</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRoute(route);
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
                    onClick={() => handleEdit(route)}
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
                        <AlertDialogTitle>Delete Route</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete route {route.route_name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(route.id)}
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
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Route className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No routes found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'No routes match your search criteria.' : 'Get started by adding your first route.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Route
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Route Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRoute?.route_name}</DialogTitle>
            <DialogDescription>
              Route details and assignment information
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Route Code</Label>
                  <p className="text-sm text-muted-foreground">{selectedRoute.route_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedRoute.status)}>
                    {selectedRoute.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Route Type</Label>
                  <Badge className={getRouteTypeColor(selectedRoute.route_type)}>
                    {selectedRoute.route_type.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoute.start_time}
                    {selectedRoute.end_time && ` - ${selectedRoute.end_time}`}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned Vehicle</Label>
                  <p className="text-sm text-muted-foreground">{getVehicleName(selectedRoute.vehicle_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned Driver</Label>
                  <p className="text-sm text-muted-foreground">{getDriverName(selectedRoute.driver_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assistant</Label>
                  <p className="text-sm text-muted-foreground">{getDriverName(selectedRoute.assistant_id)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Distance</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoute.distance_km ? `${selectedRoute.distance_km} km` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estimated Duration</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoute.estimated_duration ? `${selectedRoute.estimated_duration} minutes` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedRoute.created_at).toLocaleDateString()}
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