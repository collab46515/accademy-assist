import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Plus, Phone, FileText, Calendar, Award } from "lucide-react";
import { useTransportData } from "@/hooks/useTransportData";
import { useState } from "react";

export function DriverManagement() {
  const { loading, drivers, stats, addDriver, updateDriver } = useTransportData();
  const [showDialog, setShowDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  
  // Form state
  const [newDriver, setNewDriver] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    license_number: '',
    license_expiry: '',
    license_type: ['D1'],
    hire_date: new Date().toISOString().split('T')[0]
  });

  const handleAddDriver = async () => {
    if (!newDriver.first_name || !newDriver.last_name || !newDriver.phone || !newDriver.license_number) {
      return;
    }

    const result = await addDriver(newDriver);
    
    if (result) {
      setNewDriver({
        employee_id: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        license_number: '',
        license_expiry: '',
        license_type: ['D1'],
        hire_date: new Date().toISOString().split('T')[0]
      });
      setEditingDriver(null);
      setShowDialog(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "on_leave":
        return <Badge variant="secondary">On Leave</Badge>;
      case "suspended":
        return <Badge variant="outline">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Generate renewal alerts from real data
  const upcomingRenewals = drivers.filter(d => d.license_expiry).map(driver => {
    const expiryDate = new Date(driver.license_expiry);
    const today = new Date();
    const daysLeft = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      driver: `${driver.first_name} ${driver.last_name}`,
      document: "Driving License",
      expiry: driver.license_expiry,
      daysLeft: daysLeft > 0 ? daysLeft : 0
    };
  }).filter(renewal => renewal.daysLeft < 180).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Driver Management</h2>
          <p className="text-muted-foreground">Manage transport staff and qualifications</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={newDriver.first_name}
                    onChange={(e) => setNewDriver({...newDriver, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={newDriver.last_name}
                    onChange={(e) => setNewDriver({...newDriver, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+44 7700 900000" 
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="driver@school.edu" 
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input 
                    id="license" 
                    placeholder="DL123456789" 
                    value={newDriver.license_number}
                    onChange={(e) => setNewDriver({...newDriver, license_number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">License Expiry</Label>
                  <Input 
                    id="expiry" 
                    type="date" 
                    value={newDriver.license_expiry}
                    onChange={(e) => setNewDriver({...newDriver, license_expiry: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input 
                  id="employeeId" 
                  placeholder="DR004" 
                  value={newDriver.employee_id}
                  onChange={(e) => setNewDriver({...newDriver, employee_id: e.target.value})}
                />
              </div>
              <Button className="w-full" onClick={handleAddDriver} disabled={loading}>
                {loading ? "Processing..." : editingDriver ? "Update Driver" : "Add Driver"}
              </Button>
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
              <p className="text-2xl font-bold">{stats.totalDrivers}</p>
              <p className="text-sm text-muted-foreground">Total Drivers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <UserCheck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.activeDrivers}</p>
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
                      <p className="font-medium">{driver.first_name} {driver.last_name}</p>
                      <p className="text-sm text-muted-foreground">{driver.employee_id}</p>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">4.8</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{driver.phone}</p>
                      <p className="text-xs text-muted-foreground">{driver.email || 'No email'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{driver.license_number}</p>
                      <p className="text-xs text-muted-foreground">Expires: {driver.license_expiry}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">Unassigned</p>
                      <Badge variant="outline" className="text-xs">No vehicle</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{driver.license_type.join(', ')}</p>
                      <p className="text-xs text-muted-foreground">Since {new Date(driver.hire_date).getFullYear()}</p>
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