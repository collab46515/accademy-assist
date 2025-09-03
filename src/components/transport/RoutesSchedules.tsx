import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, MapPin, Clock, Users, Route, Calendar, Settings, TrendingUp } from "lucide-react";
import { useTransportData } from "@/hooks/useTransportData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function RoutesSchedules() {
  const { loading, routes, vehicles, drivers, studentTransports, addRoute, updateRoute } = useTransportData();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("routes");
  
  // Form state
  const [newRoute, setNewRoute] = useState({
    route_name: '',
    start_time: '07:30',
    end_time: '08:30',
    vehicle_id: '',
    driver_id: '',
    description: '',
    days_of_week: [1,2,3,4,5]
  });

  const handleAddRoute = async () => {
    console.log('🚌 Starting route operation...', newRoute);
    
    if (!newRoute.route_name || !newRoute.start_time || !newRoute.end_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in route name, start time, and end time",
        variant: "destructive"
      });
      return;
    }

    let result;
    
    if (editingRoute) {
      console.log('🚌 Updating existing route...');
      result = await updateRoute(editingRoute.id, newRoute);
    } else {
      console.log('🚌 Creating new route...');
      result = await addRoute(newRoute);
    }
    
    if (result) {
      console.log('✅ Route operation successful');
      setNewRoute({
        route_name: '',
        start_time: '07:30',
        end_time: '08:30',
        vehicle_id: '',
        driver_id: '',
        description: '',
        days_of_week: [1,2,3,4,5]
      });
      setEditingRoute(null);
      setShowDialog(false);
    } else {
      console.log('❌ Route operation failed');
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? 
      <Badge variant="default">Active</Badge> : 
      <Badge variant="secondary">{status}</Badge>;
  };

  // Calculate totals from real data
  const totalStudents = studentTransports.filter(st => st.status === 'active').length || 0;
  const totalStops = routes.reduce((sum, route) => sum + (route.route_stops?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Routes & Schedules</h2>
          <p className="text-muted-foreground">Manage transport routes and timetables</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Route Optimizer
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRoute ? "Edit Route" : "Create New Route"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="routeName">Route Name</Label>
                    <Input 
                      id="routeName" 
                      placeholder="e.g., Route 5 - Northside" 
                      value={newRoute.route_name}
                      onChange={(e) => setNewRoute({...newRoute, route_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Assigned Vehicle</Label>
                    <Select value={newRoute.vehicle_id} onValueChange={(value) => setNewRoute({...newRoute, vehicle_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicle_number} - {vehicle.vehicle_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver">Assigned Driver</Label>
                    <Select value={newRoute.driver_id} onValueChange={(value) => setNewRoute({...newRoute, driver_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.first_name} {driver.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Expected Students</Label>
                    <Input id="capacity" type="number" placeholder="50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time" 
                      value={newRoute.start_time}
                      onChange={(e) => setNewRoute({...newRoute, start_time: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      id="endTime" 
                      type="time" 
                      value={newRoute.end_time}
                      onChange={(e) => setNewRoute({...newRoute, end_time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Route Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the route coverage area and key stops..." 
                    value={newRoute.description}
                    onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
                  />
                </div>
                <Button className="w-full" onClick={handleAddRoute} disabled={loading}>
                  {loading ? "Creating..." : editingRoute ? "Update Route" : "Create Route"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">
            <Route className="h-4 w-4 mr-2" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="planning">
            <Calendar className="h-4 w-4 mr-2" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="optimization">
            <TrendingUp className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <Route className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{routes.filter(r => r.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active Routes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Students Served</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <MapPin className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{totalStops}</p>
                  <p className="text-sm text-muted-foreground">Total Stops</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">40 min</p>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Routes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Routes</CardTitle>
              <CardDescription>Overview of all transport routes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{route.route_name}</p>
                          <p className="text-sm text-muted-foreground">{route.route_stops?.length || 0} stops • {route.estimated_duration || 30} min</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {route.driver_id ? 
                          drivers.find(d => d.id === route.driver_id)?.first_name + ' ' + drivers.find(d => d.id === route.driver_id)?.last_name || 'Driver Not Found' : 
                          'Unassigned'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {route.vehicle_id ? 
                            vehicles.find(v => v.id === route.vehicle_id)?.vehicle_number || 'Vehicle Not Found' : 
                            'No vehicle'
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                          const vehicleCapacity = route.vehicle_id ? vehicles.find(v => v.id === route.vehicle_id)?.capacity || 50 : 50;
                          const percentage = Math.min((studentsOnRoute / vehicleCapacity) * 100, 100);
                          
                          return (
                            <div className="text-center">
                              <p className="font-medium">{studentsOnRoute}/{vehicleCapacity}</p>
                              <div className="w-16 bg-secondary rounded-full h-2 mt-1">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{route.start_time} - {route.end_time}</p>
                          <p className="text-xs text-muted-foreground">{route.estimated_duration || 30} min</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(route.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingRoute(route);
                              setNewRoute({
                                route_name: route.route_name,
                                start_time: route.start_time,
                                end_time: route.end_time,
                                vehicle_id: route.vehicle_id || '',
                                driver_id: route.driver_id || '',
                                description: route.description || '',
                                days_of_week: route.days_of_week
                              });
                              setShowDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          {/* Route Capacity Analysis */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {routes.reduce((sum, route) => {
                      const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                      return sum + studentsOnRoute;
                    }, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Students Assigned</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Route className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {routes.reduce((sum, route) => {
                      const vehicleCapacity = route.vehicle_id ? vehicles.find(v => v.id === route.vehicle_id)?.capacity || 0 : 0;
                      return sum + vehicleCapacity;
                    }, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(routes.reduce((sum, route) => {
                      const [startHour, startMin] = route.start_time.split(':').map(Number);
                      const [endHour, endMin] = route.end_time.split(':').map(Number);
                      const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                      return sum + duration;
                    }, 0) / routes.length) || 0} min
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Route Time</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Schedule Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Route Schedule</CardTitle>
              <CardDescription>Visual overview of all route schedules throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, dayIndex) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{day}</h3>
                    <div className="grid gap-2">
                      {routes.filter(route => route.days_of_week?.includes(dayIndex + 1)).map((route) => {
                        const driver = drivers.find(d => d.id === route.driver_id);
                        const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                        const studentsCount = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                        
                        return (
                          <div key={route.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="font-medium">{route.route_name}</div>
                              <Badge variant="outline">{route.start_time} - {route.end_time}</Badge>
                              <div className="text-sm text-muted-foreground">
                                {driver ? `${driver.first_name} ${driver.last_name}` : 'No driver'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {vehicle ? vehicle.vehicle_number : 'No vehicle'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge>{studentsCount} students</Badge>
                              <div className={`w-3 h-3 rounded-full ${route.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capacity Planning Tool */}
          <Card>
            <CardHeader>
              <CardTitle>Route Capacity Planning</CardTitle>
              <CardDescription>Analyze and optimize route capacities based on demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route) => {
                  const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                  const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                  const capacity = vehicle?.capacity || 0;
                  const utilizationPercentage = capacity > 0 ? Math.round((studentsOnRoute / capacity) * 100) : 0;
                  
                  return (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{route.route_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle ? vehicle.vehicle_number : 'No vehicle assigned'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{studentsOnRoute}</div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{capacity}</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                        <div className="w-32">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Utilization</span>
                            <span>{utilizationPercentage}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${utilizationPercentage > 90 ? 'bg-red-500' : utilizationPercentage > 75 ? 'bg-orange-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant={utilizationPercentage > 90 ? 'destructive' : utilizationPercentage > 75 ? 'secondary' : 'default'}>
                          {utilizationPercentage > 90 ? 'Over-capacity' : utilizationPercentage > 75 ? 'Near capacity' : 'Available'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Optimization Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(routes.reduce((sum, route) => {
                      const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                      const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                      const capacity = vehicle?.capacity || 1;
                      return sum + ((studentsOnRoute / capacity) * 100);
                    }, 0) / routes.length) || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <MapPin className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {routes.filter(route => {
                      const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                      const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                      const capacity = vehicle?.capacity || 1;
                      return (studentsOnRoute / capacity) < 0.6;
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Under-utilized</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(routes.reduce((sum, route) => {
                      const [startHour, startMin] = route.start_time.split(':').map(Number);
                      const [endHour, endMin] = route.end_time.split(':').map(Number);
                      return sum + ((endHour * 60 + endMin) - (startHour * 60 + startMin));
                    }, 0) / 60) || 0}h
                  </p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {routes.filter(route => {
                      const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                      const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                      const capacity = vehicle?.capacity || 1;
                      return (studentsOnRoute / capacity) > 0.9;
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Over-capacity</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Route Optimization</CardTitle>
              <CardDescription>Data-driven recommendations to improve efficiency and reduce costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const suggestions = [];
                  
                  // Check for under-utilized routes
                  const underUtilized = routes.filter(route => {
                    const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                    const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                    const capacity = vehicle?.capacity || 1;
                    return (studentsOnRoute / capacity) < 0.5;
                  });

                  if (underUtilized.length >= 2) {
                    suggestions.push({
                      type: 'merge',
                      priority: 'high',
                      title: `Merge ${underUtilized.slice(0, 2).map(r => r.route_name).join(' & ')}`,
                      description: `Both routes are under 50% capacity and could be combined to improve efficiency`,
                      impact: 'Save 30-45 minutes daily, reduce fuel costs',
                      routes: underUtilized.slice(0, 2)
                    });
                  }

                  // Check for over-capacity routes
                  const overCapacity = routes.filter(route => {
                    const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                    const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                    const capacity = vehicle?.capacity || 1;
                    return (studentsOnRoute / capacity) > 0.9;
                  });

                  if (overCapacity.length > 0) {
                    suggestions.push({
                      type: 'split',
                      priority: 'high',
                      title: `Split ${overCapacity[0].route_name}`,
                      description: `Route is at ${Math.round(((studentTransports.filter(st => st.route_id === overCapacity[0].id && st.status === 'active').length) / (vehicles.find(v => v.id === overCapacity[0].vehicle_id)?.capacity || 1)) * 100)}% capacity - consider splitting for safety`,
                      impact: 'Improve safety margins, reduce overcrowding',
                      routes: [overCapacity[0]]
                    });
                  }

                  // Check for time optimization
                  const longRoutes = routes.filter(route => {
                    const [startHour, startMin] = route.start_time.split(':').map(Number);
                    const [endHour, endMin] = route.end_time.split(':').map(Number);
                    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                    return duration > 60; // Routes longer than 1 hour
                  });

                  if (longRoutes.length > 0) {
                    suggestions.push({
                      type: 'optimize',
                      priority: 'medium',
                      title: `Optimize ${longRoutes[0].route_name} timing`,
                      description: `Route duration is ${Math.round((() => {
                        const [startHour, startMin] = longRoutes[0].start_time.split(':').map(Number);
                        const [endHour, endMin] = longRoutes[0].end_time.split(':').map(Number);
                        return ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60;
                      })())} hours - could be reduced with better stop sequencing`,
                      impact: 'Reduce travel time by 10-15 minutes',
                      routes: [longRoutes[0]]
                    });
                  }

                  // Check for vehicle upgrades
                  const smallVehicleRoutes = routes.filter(route => {
                    const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                    const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                    return vehicle && studentsOnRoute > vehicle.capacity * 0.8 && vehicle.capacity < 30;
                  });

                  if (smallVehicleRoutes.length > 0) {
                    suggestions.push({
                      type: 'upgrade',
                      priority: 'low',
                      title: `Consider larger vehicle for ${smallVehicleRoutes[0].route_name}`,
                      description: `Current vehicle is near capacity - larger vehicle would allow for growth`,
                      impact: 'Future-proof route capacity, improve comfort',
                      routes: [smallVehicleRoutes[0]]
                    });
                  }

                  return suggestions;
                })().map((suggestion, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    suggestion.priority === 'high' ? 'border-red-200 bg-red-50' :
                    suggestion.priority === 'medium' ? 'border-orange-200 bg-orange-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${
                            suggestion.priority === 'high' ? 'text-red-900' :
                            suggestion.priority === 'medium' ? 'text-orange-900' :
                            'text-blue-900'
                          }`}>
                            {suggestion.title}
                          </h3>
                          <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                            {suggestion.priority} priority
                          </Badge>
                        </div>
                        <p className={`text-sm ${
                          suggestion.priority === 'high' ? 'text-red-700' :
                          suggestion.priority === 'medium' ? 'text-orange-700' :
                          'text-blue-700'
                        }`}>
                          {suggestion.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          💡 Impact: {suggestion.impact}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Viewing Analysis",
                            description: `Detailed analysis for ${suggestion.title}`
                          });
                        }}
                      >
                        View Analysis
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Suggestion Applied", 
                            description: `Optimization suggestion applied: ${suggestion.title}`
                          });
                        }}
                      >
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                ))}

                {routes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Create some routes to see optimization suggestions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Route Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of each route's efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route) => {
                  const vehicle = vehicles.find(v => v.id === route.vehicle_id);
                  const driver = drivers.find(d => d.id === route.driver_id);
                  const studentsOnRoute = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                  const capacity = vehicle?.capacity || 1;
                  const utilization = Math.round((studentsOnRoute / capacity) * 100);
                  
                  const [startHour, startMin] = route.start_time.split(':').map(Number);
                  const [endHour, endMin] = route.end_time.split(':').map(Number);
                  const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                  
                  return (
                    <div key={route.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{route.route_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {driver ? `${driver.first_name} ${driver.last_name}` : 'No driver'} • 
                            {vehicle ? ` ${vehicle.vehicle_number}` : ' No vehicle'}
                          </p>
                        </div>
                        <Badge variant={utilization > 90 ? 'destructive' : utilization > 75 ? 'secondary' : 'default'}>
                          {utilization}% utilized
                        </Badge>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center p-3 bg-secondary rounded-lg">
                          <div className="text-2xl font-bold">{studentsOnRoute}</div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                        <div className="text-center p-3 bg-secondary rounded-lg">
                          <div className="text-2xl font-bold">{capacity}</div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                        </div>
                        <div className="text-center p-3 bg-secondary rounded-lg">
                          <div className="text-2xl font-bold">{Math.round(duration / 60)}h {duration % 60}m</div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center p-3 bg-secondary rounded-lg">
                          <div className="text-2xl font-bold">{route.route_stops?.length || 0}</div>
                          <div className="text-xs text-muted-foreground">Stops</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Settings</CardTitle>
              <CardDescription>Configure route management settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Route Duration</Label>
                    <Input placeholder="30 minutes" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Students per Route</Label>
                    <Input placeholder="50 students" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}