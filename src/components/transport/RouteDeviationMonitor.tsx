import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, MapPin, Clock, Settings, Bell, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function RouteDeviationMonitor() {
  const deviationAlerts = [
    {
      id: "1",
      vehicle: "TB-02",
      route: "Route 2",
      driver: "Mike Brown",
      alertType: "route_deviation",
      severity: "high",
      message: "Vehicle has deviated 0.8km from assigned route",
      location: "Riverside Avenue - Junction 5",
      timestamp: "8:15 AM",
      duration: "12 minutes",
      status: "active"
    },
    {
      id: "2", 
      vehicle: "TB-04",
      route: "Route 4",
      driver: "Lisa Davis",
      alertType: "excessive_stop_time",
      severity: "medium",
      message: "Vehicle stopped at Oak Street Stop for 8 minutes (limit: 5 min)",
      location: "Oak Street Stop",
      timestamp: "8:22 AM", 
      duration: "8 minutes",
      status: "resolved"
    },
    {
      id: "3",
      vehicle: "TV-03",
      route: "Route 3", 
      driver: "John Smith",
      alertType: "speed_violation",
      severity: "medium",
      message: "Vehicle exceeded speed limit (45 mph in 30 mph zone)",
      location: "Hill View Road",
      timestamp: "8:05 AM",
      duration: "3 minutes", 
      status: "acknowledged"
    }
  ];

  const monitoringSettings = {
    routeDeviationEnabled: true,
    maxDeviationDistance: 500, // meters
    excessiveStopTimeEnabled: true,
    maxStopDuration: 5, // minutes
    speedMonitoringEnabled: true,
    geofenceAlerts: true,
    autoNotifyManagement: true,
    notificationDelay: 2 // minutes before sending alert
  };

  const managementContacts = [
    { name: "Transport Manager", email: "transport@school.com", phone: "+44 7700 900100", notifyEnabled: true },
    { name: "Deputy Head", email: "deputy@school.com", phone: "+44 7700 900101", notifyEnabled: true },
    { name: "Head Teacher", email: "head@school.com", phone: "+44 7700 900102", notifyEnabled: false },
    { name: "School Secretary", email: "office@school.com", phone: "+44 7700 900103", notifyEnabled: true }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium": 
        return <Badge className="bg-orange-600">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case "route_deviation":
        return <MapPin className="h-4 w-4 text-red-600" />;
      case "excessive_stop_time":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "speed_violation":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    toast.success("Alert acknowledged and management notified");
  };

  const handleResolveAlert = (alertId: string) => {
    toast.success("Alert marked as resolved");
  };

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Route Deviation Monitor</h2>
          <p className="text-muted-foreground">Automated monitoring and alerts for vehicle route compliance</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Monitoring
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Route Deviation Monitoring Settings</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="monitoring" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monitoring">Monitoring Rules</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="contacts">Management Contacts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monitoring" className="space-y-4">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Route Deviation Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="route-deviation">Enable Route Deviation Detection</Label>
                          <p className="text-sm text-muted-foreground">Alert when vehicles go off their assigned route</p>
                        </div>
                        <Switch id="route-deviation" defaultChecked={monitoringSettings.routeDeviationEnabled} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Maximum Deviation Distance (meters)</Label>
                        <Input 
                          type="number" 
                          defaultValue={monitoringSettings.maxDeviationDistance}
                          className="w-32"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stop Time Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="stop-time">Enable Excessive Stop Time Alerts</Label>
                          <p className="text-sm text-muted-foreground">Alert when vehicles spend too long at stops</p>
                        </div>
                        <Switch id="stop-time" defaultChecked={monitoringSettings.excessiveStopTimeEnabled} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Maximum Stop Duration (minutes)</Label>
                        <Input 
                          type="number" 
                          defaultValue={monitoringSettings.maxStopDuration}
                          className="w-32"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Speed Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="speed-monitoring">Enable Speed Limit Monitoring</Label>
                          <p className="text-sm text-muted-foreground">Alert when vehicles exceed speed limits</p>
                        </div>
                        <Switch id="speed-monitoring" defaultChecked={monitoringSettings.speedMonitoringEnabled} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Automatic Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-notify">Auto-notify Management</Label>
                        <p className="text-sm text-muted-foreground">Automatically send alerts to management team</p>
                      </div>
                      <Switch id="auto-notify" defaultChecked={monitoringSettings.autoNotifyManagement} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Notification Delay (minutes)</Label>
                      <Input 
                        type="number" 
                        defaultValue={monitoringSettings.notificationDelay}
                        className="w-32"
                      />
                      <p className="text-xs text-muted-foreground">Wait time before sending alert to allow driver to self-correct</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Notification Methods</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">SMS to management phones</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Email notifications</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Push notifications (mobile app)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Voice call for critical alerts</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contacts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Management Notification List</CardTitle>
                    <CardDescription>Configure who receives deviation alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {managementContacts.map((contact, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                          </div>
                          <Switch defaultChecked={contact.notifyEnabled} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Settings saved successfully");
                  // Would save settings to database in real implementation
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Monitoring settings updated successfully");
                  // Would save all form data to database
                }}
              >
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Monitoring Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Monitored Routes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{deviationAlerts.filter(a => a.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Bell className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Alerts Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">2.3</p>
              <p className="text-sm text-muted-foreground">Avg Response (min)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Route Deviation Alerts</CardTitle>
          <CardDescription>Real-time monitoring alerts for route compliance issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deviationAlerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${
              alert.status === 'active' ? 'border-red-200 bg-red-50' : 
              alert.status === 'acknowledged' ? 'border-orange-200 bg-orange-50' :
              'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.alertType)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{alert.vehicle} - {alert.route}</h3>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground">Driver: {alert.driver}</p>
                    <p className={`text-sm font-medium ${
                      alert.status === 'active' ? 'text-red-700' :
                      alert.status === 'acknowledged' ? 'text-orange-700' :
                      'text-green-700'
                    }`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>📍 {alert.location}</span>
                      <span>🕒 {alert.timestamp}</span>
                      <span>⏱️ Duration: {alert.duration}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={alert.status === 'active' ? 'destructive' : 
                              alert.status === 'acknowledged' ? 'secondary' : 'default'}>
                  {alert.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                {alert.status === 'active' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Mark Resolved
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast.success(`Contacting driver: ${alert.driver}`);
                        // Integration point for SMS/calling system
                      }}
                    >
                      Contact Driver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast.info(`Opening map view for ${alert.vehicle} at ${alert.location}`);
                        // Integration point for mapping system
                      }}
                    >
                      View on Map
                    </Button>
                  </>
                )}
                {alert.status === 'acknowledged' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    toast.info(`Viewing detailed alert information for ${alert.vehicle}`);
                    // Could show detailed modal with alert history
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Management Notification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Management Notification Status</CardTitle>
          <CardDescription>Recent notifications sent to management team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Route Deviation - TB-02</p>
                  <p className="text-sm text-red-700">SMS sent to Transport Manager, Deputy Head • 8:17 AM</p>
                </div>
              </div>
              <Badge variant="destructive">SENT</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Excessive Stop Time - TB-04</p>
                  <p className="text-sm text-orange-700">Email sent to Transport Manager • 8:24 AM</p>
                </div>
              </div>
              <Badge className="bg-orange-600">DELIVERED</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">All Routes Back on Track</p>
                  <p className="text-sm text-green-700">Resolution update sent to management • 8:35 AM</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">ACKNOWLEDGED</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}