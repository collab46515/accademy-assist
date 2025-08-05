import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, MessageSquare, AlertTriangle, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TransportNotifications() {
  const recentNotifications = [
    {
      id: "1",
      type: "delay",
      title: "Route 2 Delayed",
      message: "Due to traffic incident, Route 2 is running 15 minutes behind schedule. Estimated arrival at school: 8:30 AM",
      timestamp: "8:10 AM",
      recipients: 38,
      status: "sent"
    },
    {
      id: "2", 
      type: "emergency",
      title: "Weather Alert",
      message: "Heavy rain warning in effect. All drivers please exercise extra caution and reduce speed.",
      timestamp: "7:45 AM",
      recipients: 15,
      status: "sent"
    },
    {
      id: "3",
      type: "route_change",
      title: "Route 5 Temporary Change",
      message: "Due to road works on Mill Street, Route 5 will use alternative route today. Pickup times may vary by 5-10 minutes.",
      timestamp: "7:30 AM", 
      recipients: 42,
      status: "sent"
    },
    {
      id: "4",
      type: "general",
      title: "Driver Training Reminder",
      message: "Reminder: Monthly safety training session scheduled for this Friday at 2 PM in the main hall.",
      timestamp: "Yesterday",
      recipients: 18,
      status: "sent"
    }
  ];

  const notificationTemplates = [
    { name: "Route Delay", type: "delay" },
    { name: "Route Cancellation", type: "emergency" }, 
    { name: "Weather Alert", type: "weather" },
    { name: "Driver Update", type: "staff" },
    { name: "Route Change", type: "route_change" },
    { name: "Emergency Alert", type: "emergency" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "route_change":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "delay":
        return <Badge variant="secondary">Delay</Badge>;
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      case "route_change":
        return <Badge variant="outline">Route Change</Badge>;
      case "weather":
        return <Badge className="bg-blue-600">Weather</Badge>;
      case "staff":
        return <Badge variant="outline">Staff</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transport Notifications</h2>
          <p className="text-muted-foreground">Send updates and alerts to parents, students, and staff</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Transport Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <select className="w-full p-2 border rounded">
                    <option value="delay">Route Delay</option>
                    <option value="emergency">Emergency Alert</option>
                    <option value="route_change">Route Change</option>
                    <option value="weather">Weather Update</option>
                    <option value="general">General Notice</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Send To</Label>
                  <select className="w-full p-2 border rounded">
                    <option value="all">All Parents & Students</option>
                    <option value="route_specific">Specific Route</option>
                    <option value="drivers">All Drivers</option>
                    <option value="staff">Transport Staff</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Title</Label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  placeholder="Notification title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  placeholder="Type your notification message here..."
                  className="min-h-24"
                />
              </div>
              
              <div className="flex gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Send SMS</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Send Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">Push Notification</span>
                </label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Save as Template</Button>
                <Button className="flex-1">Send Notification</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Pre-built notification templates for common scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {notificationTemplates.map((template, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <p className="font-medium">{template.name}</p>
                  {getTypeBadge(template.type)}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>History of sent transport communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentNotifications.map((notification) => (
            <div key={notification.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getTypeIcon(notification.type)}
                  <div className="space-y-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
                {getTypeBadge(notification.type)}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Sent: {notification.timestamp}</span>
                  <span>Recipients: {notification.recipients}</span>
                  <Badge variant="outline" className="text-xs">
                    {notification.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Resend</Button>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Communication Channels */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>Configure notification delivery methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">SMS Messages</p>
                  <p className="text-sm text-muted-foreground">Direct text messages to parents</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Detailed email updates</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Mobile app alerts</p>
                </div>
              </div>
              <Badge variant="secondary">Setup Required</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Voice Calls</p>
                  <p className="text-sm text-muted-foreground">Emergency voice alerts</p>
                </div>
              </div>
              <Badge variant="outline">Inactive</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Statistics</CardTitle>
            <CardDescription>Delivery rates and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">SMS Delivery Rate</span>
                <span className="font-medium">98.5%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "98.5%" }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Email Open Rate</span>
                <span className="font-medium">89.2%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "89.2%" }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <span className="font-medium">76.8%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "76.8%" }} />
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Sent Today</span>
                <span className="font-medium">145 notifications</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Response Time</span>
                <span className="font-medium">3.2 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}