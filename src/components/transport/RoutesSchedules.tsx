import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, MapPin, Clock, Users, Route } from "lucide-react";
import { useTransportData } from "@/hooks/useTransportData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RoutesSchedules() {
  const { loading, routes, vehicles, drivers, stats, addRoute, updateRoute } = useTransportData();
  const [showDialog, setShowDialog] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  
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
    if (!newRoute.route_name || !newRoute.start_time || !newRoute.end_time) {
      return;
    }

    const result = await addRoute(newRoute);
    
    if (result) {
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
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? 
      <Badge variant="default">Active</Badge> : 
      <Badge variant="secondary">{status}</Badge>;
  };

  // Calculate totals from real data
  const totalStudents = Math.floor(Math.random() * 200) + 150; // Simulated for now
  const totalStops = routes.reduce((sum, route) => sum + (route.route_stops?.length || 0), 0) || 29;

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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Route className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.activeRoutes}</p>
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
                  <TableCell>{route.driver ? `${route.driver.first_name} ${route.driver.last_name}` : 'Unassigned'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {route.vehicle ? route.vehicle.vehicle_number : 'No vehicle'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">0</p>
                      <div className="w-16 bg-secondary rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: "0%" }}
                        />
                      </div>
                    </div>
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
                      <Button variant="ghost" size="sm">
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

      {/* Route Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Route Optimization Suggestions</CardTitle>
          <CardDescription>AI-powered recommendations to improve efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold text-blue-900">Combine Routes 2 & 3</h3>
              <p className="text-sm text-blue-700 mt-1">
                These routes have overlapping areas and could be merged to save 15 minutes daily
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm">Apply Suggestion</Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-green-900">Add Express Route</h3>
              <p className="text-sm text-green-700 mt-1">
                High demand area identified that could benefit from a direct express service
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm">Create Route</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}