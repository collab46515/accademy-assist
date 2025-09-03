import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, MapPin, Route, Clock, Plus } from "lucide-react";
import { useTransportData } from "@/hooks/useTransportData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRBAC } from "@/hooks/useRBAC";

export function StudentAssignments() {
  const navigate = useNavigate();
  const { currentSchool } = useRBAC();
  const { loading, studentTransports, routes, drivers, vehicles, assignStudentToRoute, refetch } = useTransportData();
  const [students, setStudents] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    route_id: '',
    pickup_stop: '',
    dropoff_stop: ''
  });

  // Load students on mount
  useEffect(() => {
    const loadStudents = async () => {
      if (!currentSchool?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            profiles(first_name, last_name, email, phone)
          `)
          .eq('school_id', currentSchool.id)
          .eq('is_enrolled', true);

        if (error) throw error;
        console.log('Students loaded:', data);
        setStudents(data || []);
      } catch (error) {
        console.error('Error loading students:', error);
        toast.error('Failed to load students');
      }
    };
    
    loadStudents();
  }, [currentSchool?.id]);

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students.map(student => {
      const transport = studentTransports.find(st => st.student_id === student.id);
      return {
        id: student.id,
        studentName: `${student.profiles?.first_name} ${student.profiles?.last_name}`,
        studentId: student.student_number,
        year: student.year_group,
        route: transport ? routes.find(r => r.id === transport.route_id)?.route_name || 'Route Not Found' : 'Unassigned',
        pickupPoint: transport?.pickup_stop?.stop_name || 'N/A',
        pickupTime: transport ? routes.find(r => r.id === transport.route_id)?.start_time || 'N/A' : 'N/A',
        dropoffTime: transport ? routes.find(r => r.id === transport.route_id)?.end_time || 'N/A' : 'N/A',
        homeAddress: 'Address not available', // Would need address field in students table
        parentContact: student.emergency_contact_phone || 'N/A',
        status: transport?.status === 'active' ? 'Active' : transport ? 'Inactive' : 'Unassigned',
        transport: transport
      };
    });

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRoute !== "all") {
      if (selectedRoute === "unassigned") {
        filtered = filtered.filter(a => a.route === 'Unassigned');
      } else {
        filtered = filtered.filter(a => {
          const route = routes.find(r => r.id === selectedRoute);
          return a.route === route?.route_name;
        });
      }
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(a => a.year === selectedYear);
    }

    setFilteredAssignments(filtered);
  }, [students, studentTransports, routes, searchTerm, selectedRoute, selectedYear]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "Temporary Route":
        return <Badge variant="secondary">Temporary</Badge>;
      case "Unassigned":
        return <Badge variant="destructive">Unassigned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleBulkAssignment = async () => {
    const unassigned = filteredAssignments.filter(a => a.status === 'Unassigned');
    
    if (unassigned.length === 0) {
      toast.info('No unassigned students found');
      return;
    }

    if (routes.length === 0) {
      toast.error('No routes available for assignment');
      return;
    }

    // Auto-assign to routes with available capacity
    let assigned = 0;
    for (const student of unassigned.slice(0, 10)) { // Limit to 10 for demo
      const availableRoute = routes.find(r => {
        const routeTransports = studentTransports.filter(st => st.route_id === r.id && st.status === 'active');
        const vehicleCapacity = vehicles.find(v => v.id === r.vehicle_id)?.capacity || 50;
        return routeTransports.length < vehicleCapacity;
      });

      if (availableRoute) {
        await assignStudentToRoute({
          student_id: student.id,
          route_id: availableRoute.id,
          start_date: new Date().toISOString().split('T')[0],
          status: 'active',
          payment_status: 'pending'
        });
        assigned++;
      }
    }

    toast.success(`Successfully assigned ${assigned} students`);
    refetch();
  };

  const handleAssignStudent = async () => {
    if (!selectedStudent || !assignmentForm.route_id) {
      toast.error('Please select a route');
      return;
    }

    const result = await assignStudentToRoute({
      student_id: selectedStudent.id,
      route_id: assignmentForm.route_id,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
      payment_status: 'pending'
    });

    if (result) {
      setShowAssignDialog(false);
      setSelectedStudent(null);
      setAssignmentForm({ route_id: '', pickup_stop: '', dropoff_stop: '' });
      refetch();
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
          <Button 
            variant="outline"
            onClick={handleBulkAssignment}
            disabled={loading}
          >
            Bulk Assignment
          </Button>
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Assign Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Student to Route</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select 
                    value={selectedStudent?.id || ''} 
                    onValueChange={(value) => setSelectedStudent(students.find(s => s.id === value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.filter(s => !studentTransports.some(st => st.student_id === s.id && st.status === 'active')).map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.profiles?.first_name} {student.profiles?.last_name} - {student.student_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Route</Label>
                  <Select 
                    value={assignmentForm.route_id} 
                    onValueChange={(value) => setAssignmentForm({...assignmentForm, route_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.filter(r => r.status === 'active').map(route => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.route_name} - {route.start_time} to {route.end_time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssignStudent} className="w-full">
                  Assign to Route
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>{route.route_name}</SelectItem>
                ))}
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="Year 1">Year 1</SelectItem>
                <SelectItem value="Year 2">Year 2</SelectItem>
                <SelectItem value="Year 3">Year 3</SelectItem>
                <SelectItem value="Year 4">Year 4</SelectItem>
                <SelectItem value="Year 5">Year 5</SelectItem>
                <SelectItem value="Year 6">Year 6</SelectItem>
                <SelectItem value="Year 7">Year 7</SelectItem>
                <SelectItem value="Year 8">Year 8</SelectItem>
                <SelectItem value="Year 9">Year 9</SelectItem>
                <SelectItem value="Year 10">Year 10</SelectItem>
                <SelectItem value="Year 11">Year 11</SelectItem>
                <SelectItem value="Year 12">Year 12</SelectItem>
                <SelectItem value="Year 13">Year 13</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Route Utilization Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {routes.slice(0, 4).map((route) => {
          const routeStudents = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
          const vehicleCapacity = vehicles.find(v => v.id === route.vehicle_id)?.capacity || 50;
          const utilization = Math.round((routeStudents / vehicleCapacity) * 100);
          
          return (
            <Card 
              key={route.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => {
                toast.info(`Viewing route: ${route.route_name}`);
                navigate('/transport/routes');
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{route.route_name}</h3>
                  <Badge variant="outline">{utilization}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {routeStudents} / {vehicleCapacity} students
                </p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${utilization}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
        {routes.length === 0 && (
          <Card className="col-span-4">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No routes available</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/transport/routes')}
              >
                Create your first route
              </Button>
            </CardContent>
          </Card>
        )}
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
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(students.find(s => s.id === assignment.id));
                            setShowAssignDialog(true);
                          }}
                        >
                          {assignment.route === "Unassigned" ? "Assign" : "Edit"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast.info(`Viewing location for ${assignment.studentName}`);
                            navigate('/transport/tracking');
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No students found matching your criteria
                    {students.length === 0 && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm">Load demo students</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
              <span className="font-medium">{students.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Assigned Students</span>
              <span className="font-medium text-green-600">{filteredAssignments.filter(a => a.status === "Active").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Unassigned Students</span>
              <span className="font-medium text-red-600">{filteredAssignments.filter(a => a.status === "Unassigned").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Assignment Rate</span>
              <span className="font-medium">
                {students.length > 0 ? Math.round((filteredAssignments.filter(a => a.status === "Active").length / students.length) * 100) : 0}%
              </span>
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
              <p className="font-medium text-blue-900">Route Capacity Available</p>
              <p className="text-sm text-blue-700">
                {routes.filter(route => {
                  const routeStudents = studentTransports.filter(st => st.route_id === route.id && st.status === 'active').length;
                  const vehicleCapacity = vehicles.find(v => v.id === route.vehicle_id)?.capacity || 50;
                  return routeStudents < vehicleCapacity * 0.9;
                }).length} routes have available capacity
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/transport/routes')}
              >
                View Routes
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium text-green-900">Auto-Assignment Ready</p>
              <p className="text-sm text-green-700">
                {filteredAssignments.filter(a => a.status === "Unassigned").length} students ready for auto-assignment
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={handleBulkAssignment}
                disabled={filteredAssignments.filter(a => a.status === "Unassigned").length === 0}
              >
                Auto-Assign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}