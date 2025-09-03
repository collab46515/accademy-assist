import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, MapPin, Route, Clock } from "lucide-react";
import { useTransportData } from "@/hooks/useTransportData";

export function StudentAssignments() {
  const { loading, studentTransports, routes, assignStudentToRoute } = useTransportData();

  // Mock assignments data - in real implementation this would come from studentTransports
  const assignments = [
    {
      id: "1",
      studentName: "Emma Watson",
      studentId: "ST001",
      year: "Year 9",
      route: routes[0]?.route_name || "Unassigned",
      pickupPoint: "Main Street Stop",
      pickupTime: "07:45",
      dropoffTime: "15:30",
      homeAddress: "123 Main Street, City Center",
      parentContact: "+44 7700 900123",
      status: "Active"
    },
    {
      id: "2",
      studentName: "John Smith", 
      studentId: "ST002",
      year: "Year 8",
      route: routes[1]?.route_name || "Unassigned",
      pickupPoint: "Riverside Park",
      pickupTime: "08:00",
      dropoffTime: "15:45",
      homeAddress: "456 River Road, Riverside",
      parentContact: "+44 7700 900124",
      status: "Active"
    },
    {
      id: "3",
      studentName: "Sarah Johnson",
      studentId: "ST003", 
      year: "Year 10",
      route: routes[2]?.route_name || "Unassigned",
      pickupPoint: "Hill View Corner",
      pickupTime: "08:15",
      dropoffTime: "16:00",
      homeAddress: "789 Hill View Lane, Hillside",
      parentContact: "+44 7700 900125",
      status: "Temporary Route"
    },
    {
      id: "4",
      studentName: "Mike Brown",
      studentId: "ST004",
      year: "Year 7", 
      route: "Unassigned",
      pickupPoint: "N/A",
      pickupTime: "N/A",
      dropoffTime: "N/A",
      homeAddress: "321 Oak Street, Suburbs",
      parentContact: "+44 7700 900126",
      status: "Pending Assignment"
    }
  ];

  // Calculate route summary from real routes data
  const routeSummary = routes.slice(0, 4).map((route, index) => ({
    route: route.route_name,
    students: Math.floor(Math.random() * 30) + 20, // Simulated student count
    capacity: route.vehicle?.capacity || 50,
    utilization: Math.floor(Math.random() * 40) + 60 // Simulated utilization
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "Temporary Route":
        return <Badge variant="secondary">Temporary</Badge>;
      case "Pending Assignment":
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Student Transport Assignments</h2>
          <p className="text-muted-foreground">Manage student route assignments and pickup points</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">Bulk Assignment</Button>
          <Button>Auto-Assign Students</Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-8" />
            </div>
            <select className="p-2 border rounded w-48">
              <option value="all">All Routes</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>{route.route_name}</option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
            <select className="p-2 border rounded w-48">
              <option value="all">All Years</option>
              <option value="year-7">Year 7</option>
              <option value="year-8">Year 8</option>
              <option value="year-9">Year 9</option>
              <option value="year-10">Year 10</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Route Utilization Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {routeSummary.map((route, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{route.route}</h3>
                <Badge variant="outline">{route.utilization}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {route.students} / {route.capacity} students
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${route.utilization}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Transport Assignments</CardTitle>
          <CardDescription>Current route assignments for all students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Route Assignment</TableHead>
                <TableHead>Pickup Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{assignment.studentName}</p>
                      <p className="text-sm text-muted-foreground">{assignment.studentId} • {assignment.year}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Route className="h-3 w-3" />
                        <span className="text-sm font-medium">{assignment.route}</span>
                      </div>
                      {assignment.pickupPoint !== "N/A" && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{assignment.pickupPoint}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignment.pickupTime !== "N/A" ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm">Pickup: {assignment.pickupTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm">Drop: {assignment.dropoffTime}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{assignment.parentContact}</p>
                      <p className="text-xs text-muted-foreground">{assignment.homeAddress}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(assignment.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {assignment.route === "Unassigned" ? "Assign" : "Edit"}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Unassigned Students Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Unassigned Students
          </CardTitle>
          <CardDescription>Students requiring transport route assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium">Mike Brown (ST004)</p>
                <p className="text-sm text-muted-foreground">321 Oak Street, Suburbs • Year 7</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Map</Button>
                <Button size="sm">Assign Route</Button>
              </div>
            </div>
            <div className="text-center p-4">
              <Button variant="outline">Bulk Assign Unassigned Students</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Statistics</CardTitle>
            <CardDescription>Overview of student assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Students</span>
              <span className="font-medium">{assignments.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Assigned Students</span>
              <span className="font-medium text-green-600">{assignments.filter(a => a.status === "Active").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Assignment</span>
              <span className="font-medium text-red-600">{assignments.filter(a => a.status === "Pending Assignment").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Assignment Rate</span>
              <span className="font-medium">85%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Route Efficiency</CardTitle>
            <CardDescription>Optimization recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-blue-900">Route 4 at Capacity</p>
              <p className="text-sm text-blue-700">Consider adding overflow route for this area</p>
              <Button size="sm" variant="outline" className="mt-2">View Details</Button>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-green-900">Route 3 Underutilized</p>
              <p className="text-sm text-green-700">Can accommodate 5 more students</p>
              <Button size="sm" variant="outline" className="mt-2">Add Students</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}