import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Truck, Wrench, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

export function VehicleManagement() {
  const vehicles = [
    {
      id: "1",
      number: "TB-01",
      type: "Bus",
      capacity: 50,
      model: "Mercedes Sprinter",
      year: 2020,
      mileage: 45000,
      status: "Active",
      driver: "Sarah Johnson",
      route: "Route 1",
      lastService: "2024-01-15",
      nextService: "2024-04-15"
    },
    {
      id: "2", 
      number: "TB-02",
      type: "Bus",
      capacity: 45,
      model: "Ford Transit",
      year: 2019,
      mileage: 62000,
      status: "Maintenance",
      driver: "Unassigned",
      route: "None",
      lastService: "2024-01-20",
      nextService: "2024-02-20"
    },
    {
      id: "3",
      number: "TV-03", 
      type: "Van",
      capacity: 25,
      model: "Volkswagen Crafter",
      year: 2021,
      mileage: 28000,
      status: "Active",
      driver: "John Smith",
      route: "Route 3",
      lastService: "2024-01-10",
      nextService: "2024-07-10"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case "Maintenance":
        return <Badge variant="destructive">Maintenance</Badge>;
      case "Out of Service":
        return <Badge variant="secondary">Out of Service</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const maintenanceAlerts = [
    { vehicle: "TB-04", issue: "Service Due", priority: "Medium", date: "2024-02-01" },
    { vehicle: "TV-05", issue: "Inspection Required", priority: "High", date: "2024-01-28" },
    { vehicle: "TB-06", issue: "Tire Replacement", priority: "Low", date: "2024-02-15" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <p className="text-muted-foreground">Monitor and manage school transport fleet</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input id="vehicleNumber" placeholder="TB-07" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Type</Label>
                  <select className="w-full p-2 border rounded">
                    <option value="bus">Bus</option>
                    <option value="van">Van</option>
                    <option value="minibus">Minibus</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Mercedes Sprinter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" placeholder="50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input id="mileage" type="number" placeholder="0" />
                </div>
              </div>
              <Button className="w-full">Add Vehicle</Button>
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
              <p className="text-2xl font-bold">{vehicles.length}</p>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'Active').length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Wrench className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'Maintenance').length}</p>
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
                      <p className="font-medium">{vehicle.number}</p>
                      <Badge variant="outline" className="text-xs">{vehicle.type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{vehicle.model}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.capacity} seats</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{vehicle.driver || "Unassigned"}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.route || "No route"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last: {vehicle.lastService}</p>
                      <p className="text-xs text-muted-foreground">Next: {vehicle.nextService}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(vehicle.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Service</Button>
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
                    <Badge variant={alert.priority === "High" ? "destructive" : alert.priority === "Medium" ? "secondary" : "outline"}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.issue}</p>
                  <p className="text-xs text-muted-foreground">Due: {alert.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Schedule</Button>
                  <Button size="sm">Resolve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}