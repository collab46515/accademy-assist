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

export function RoutesSchedules() {
  const routes = [
    {
      id: "1",
      name: "Route 1 - City Center",
      driver: "Sarah Johnson",
      vehicle: "Bus TB-01",
      students: 45,
      stops: 8,
      duration: "45 min",
      startTime: "07:30",
      endTime: "08:15",
      status: "Active"
    },
    {
      id: "2",
      name: "Route 2 - Riverside",
      driver: "Mike Brown",
      vehicle: "Bus TB-02",
      students: 38,
      stops: 6,
      duration: "35 min",
      startTime: "07:45",
      endTime: "08:20",
      status: "Active"
    },
    {
      id: "3",
      name: "Route 3 - Hillside",
      driver: "John Smith",
      vehicle: "Van TV-03",
      students: 25,
      stops: 5,
      duration: "30 min",
      startTime: "08:00",
      endTime: "08:30",
      status: "Active"
    },
    {
      id: "4",
      name: "Route 4 - Suburbs",
      driver: "Lisa Davis",
      vehicle: "Bus TB-04",
      students: 52,
      stops: 10,
      duration: "50 min",
      startTime: "07:20",
      endTime: "08:10",
      status: "Under Review"
    }
  ];

  const getStatusBadge = (status: string) => {
    return status === "Active" ? 
      <Badge variant="default">Active</Badge> : 
      <Badge variant="secondary">Under Review</Badge>;
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Route</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="routeName">Route Name</Label>
                    <Input id="routeName" placeholder="e.g., Route 5 - Northside" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Assigned Vehicle</Label>
                    <select className="w-full p-2 border rounded">
                      <option value="">Select Vehicle</option>
                      <option value="tb-05">Bus TB-05</option>
                      <option value="tv-06">Van TV-06</option>
                      <option value="tb-07">Bus TB-07</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver">Assigned Driver</Label>
                    <select className="w-full p-2 border rounded">
                      <option value="">Select Driver</option>
                      <option value="driver1">David Wilson</option>
                      <option value="driver2">Emma Taylor</option>
                      <option value="driver3">Robert Clark</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Student Capacity</Label>
                    <Input id="capacity" type="number" placeholder="50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" defaultValue="07:30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" defaultValue="08:30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Route Description</Label>
                  <Textarea id="description" placeholder="Describe the route coverage area and key stops..." />
                </div>
                <Button className="w-full">Create Route</Button>
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
              <p className="text-2xl font-bold">{routes.length}</p>
              <p className="text-sm text-muted-foreground">Active Routes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{routes.reduce((sum, route) => sum + route.students, 0)}</p>
              <p className="text-sm text-muted-foreground">Students Served</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <MapPin className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{routes.reduce((sum, route) => sum + route.stops, 0)}</p>
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
                      <p className="font-medium">{route.name}</p>
                      <p className="text-sm text-muted-foreground">{route.stops} stops • {route.duration}</p>
                    </div>
                  </TableCell>
                  <TableCell>{route.driver}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{route.vehicle}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">{route.students}</p>
                      <div className="w-16 bg-secondary rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(route.students / 60) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{route.startTime} - {route.endTime}</p>
                      <p className="text-xs text-muted-foreground">{route.duration}</p>
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