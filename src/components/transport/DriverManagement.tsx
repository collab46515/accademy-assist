import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Plus, Phone, FileText, Calendar, Award } from "lucide-react";

export function DriverManagement() {
  const drivers = [
    {
      id: "1",
      name: "Sarah Johnson",
      employeeId: "DR001",
      phone: "+44 7700 900123",
      email: "sarah.johnson@school.edu",
      licenseNumber: "DL123456789",
      licenseExpiry: "2025-06-15",
      route: "Route 1",
      vehicle: "TB-01",
      status: "Active",
      experience: "8 years",
      rating: 4.9,
      joinDate: "2020-01-15"
    },
    {
      id: "2",
      name: "Mike Brown",
      employeeId: "DR002", 
      phone: "+44 7700 900124",
      email: "mike.brown@school.edu",
      licenseNumber: "DL987654321",
      licenseExpiry: "2024-12-20",
      route: "Route 2",
      vehicle: "TB-02",
      status: "On Leave",
      experience: "12 years",
      rating: 4.8,
      joinDate: "2018-03-20"
    },
    {
      id: "3",
      name: "John Smith",
      employeeId: "DR003",
      phone: "+44 7700 900125", 
      email: "john.smith@school.edu",
      licenseNumber: "DL456789123",
      licenseExpiry: "2025-09-10",
      route: "Route 3",
      vehicle: "TV-03",
      status: "Active",
      experience: "5 years",
      rating: 4.7,
      joinDate: "2021-09-01"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "On Leave":
        return <Badge variant="secondary">On Leave</Badge>;
      case "Substitute":
        return <Badge variant="outline">Substitute</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingRenewals = [
    { driver: "Mike Brown", document: "Driving License", expiry: "2024-12-20", daysLeft: 30 },
    { driver: "All Drivers", document: "First Aid Certificate", expiry: "2024-08-15", daysLeft: 180 },
    { driver: "Sarah Johnson", document: "CPC Certificate", expiry: "2024-11-30", daysLeft: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Driver Management</h2>
          <p className="text-muted-foreground">Manage transport staff and qualifications</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Full Name</Label>
                  <Input id="driverName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" placeholder="DR004" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+44 7700 900000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="driver@school.edu" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" placeholder="DL123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">License Expiry</Label>
                  <Input id="expiry" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="5" />
              </div>
              <Button className="w-full">Add Driver</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Driver Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{drivers.length}</p>
              <p className="text-sm text-muted-foreground">Total Drivers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{drivers.filter(d => d.status === 'Active').length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{upcomingRenewals.length}</p>
              <p className="text-sm text-muted-foreground">Renewals Due</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Directory</CardTitle>
          <CardDescription>Complete list of transport staff</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.employeeId}</p>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{driver.rating}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{driver.phone}</p>
                      <p className="text-xs text-muted-foreground">{driver.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{driver.licenseNumber}</p>
                      <p className="text-xs text-muted-foreground">Expires: {driver.licenseExpiry}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{driver.route}</p>
                      <Badge variant="outline" className="text-xs">{driver.vehicle}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{driver.experience}</p>
                      <p className="text-xs text-muted-foreground">Since {driver.joinDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(driver.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Renewals */}
      <Card>
        <CardHeader>
          <CardTitle>Document Renewals</CardTitle>
          <CardDescription>Upcoming license and certification renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingRenewals.map((renewal, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{renewal.driver}</p>
                  <p className="text-sm text-muted-foreground">{renewal.document}</p>
                  <p className="text-xs text-muted-foreground">Expires: {renewal.expiry}</p>
                </div>
                <div className="text-right">
                  <Badge variant={renewal.daysLeft < 60 ? "destructive" : "secondary"}>
                    {renewal.daysLeft} days left
                  </Badge>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">Remind</Button>
                    <Button size="sm">Renew</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Performance</CardTitle>
          <CardDescription>Performance metrics and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-muted-foreground">On-Time Performance</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">4.8/5</p>
              <p className="text-sm text-muted-foreground">Safety Rating</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">95%</p>
              <p className="text-sm text-muted-foreground">Parent Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}