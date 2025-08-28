import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, AlertTriangle, Truck, Users } from "lucide-react";

export function VehicleTracking() {
  const liveVehicles = [
    {
      id: "1",
      vehicle: "TB-01",
      route: "Route 1", 
      driver: "Sarah Johnson",
      students: 45,
      status: "On Route",
      location: "Main Street",
      speed: "25 mph",
      eta: "8:15 AM",
      nextStop: "City Center Plaza",
      delayMinutes: 0
    },
    {
      id: "2",
      vehicle: "TB-02",
      route: "Route 2",
      driver: "Mike Brown", 
      students: 38,
      status: "Delayed",
      location: "Riverside Avenue",
      speed: "15 mph",
      eta: "8:25 AM",
      nextStop: "Riverside Park",
      delayMinutes: 10
    },
    {
      id: "3",
      vehicle: "TV-03",
      route: "Route 3",
      driver: "John Smith",
      students: 25,
      status: "On Time",
      location: "Hill View Road",
      speed: "30 mph", 
      eta: "8:30 AM",
      nextStop: "Hillside School",
      delayMinutes: 0
    },
    {
      id: "4",
      vehicle: "TB-04",
      route: "Route 4",
      driver: "Lisa Davis",
      students: 52,
      status: "Stopped",
      location: "Oak Street Stop",
      speed: "0 mph",
      eta: "8:40 AM", 
      nextStop: "Suburb Center",
      delayMinutes: 5
    }
  ];

  const getStatusBadge = (status: string, delay: number) => {
    if (status === "Delayed" || delay > 5) {
      return <Badge variant="destructive">Delayed</Badge>;
    } else if (status === "Stopped") {
      return <Badge variant="secondary">Stopped</Badge>;
    } else if (status === "On Time" || status === "On Route") {
      return <Badge variant="default" className="bg-green-600">On Time</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const emergencyContacts = [
    { name: "Transport Manager", number: "+44 7700 900100" },
    { name: "Emergency Services", number: "999" },
    { name: "School Office", number: "+44 1234 567890" }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Emergency Contacts */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Live Vehicle Tracking</h2>
          <p className="text-muted-foreground">Real-time monitoring of school transport fleet</p>
        </div>
        
        <Card className="w-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{contact.name}</span>
                <Button variant="outline" size="sm" className="h-7">
                  {contact.number}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Live Tracking Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {liveVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.vehicle}</CardTitle>
                  <CardDescription>{vehicle.route} • {vehicle.driver}</CardDescription>
                </div>
                {getStatusBadge(vehicle.status, vehicle.delayMinutes)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Status */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Students</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {vehicle.students}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Speed</p>
                  <p className="font-medium">{vehicle.speed}</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Next: {vehicle.nextStop}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">ETA: {vehicle.eta}</span>
                  {vehicle.delayMinutes > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      +{vehicle.delayMinutes}min
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  Track
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Contact
                </Button>
              </div>

              {/* Route Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Route Progress</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map View Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Live Map View</CardTitle>
          <CardDescription>Real-time positions of all vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-500">Interactive map would be displayed here</p>
              <p className="text-sm text-gray-400">Integration with GPS tracking system required</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{liveVehicles.length}</p>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Navigation className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{liveVehicles.filter(v => v.delayMinutes === 0).length}</p>
              <p className="text-sm text-muted-foreground">On Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{liveVehicles.filter(v => v.delayMinutes > 0).length}</p>
              <p className="text-sm text-muted-foreground">Delayed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{liveVehicles.reduce((sum, v) => sum + v.students, 0)}</p>
              <p className="text-sm text-muted-foreground">Students Tracked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Live Alerts</CardTitle>
          <CardDescription>Real-time notifications and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Route 2 Delayed</p>
                <p className="text-sm text-red-700">Traffic incident causing 10-minute delay</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Route Deviation Alert</p>
                <p className="text-sm text-orange-700">TB-04 stopped for 8 minutes at Oak Street (limit: 5 min) - Management notified</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Alert</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Navigation className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Route Completed</p>
                <p className="text-sm text-blue-700">Route 1 has completed morning pickup successfully</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Details</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}