import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Users, MapPin, AlertTriangle, TrendingUp, Route, UserCheck, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export function TransportDashboard() {
  const stats = [
    { title: "Active Routes", value: "12", icon: Route, change: "+2 this term" },
    { title: "Students Transported", value: "847", icon: Users, change: "89% of school" },
    { title: "Active Vehicles", value: "15", icon: Truck, change: "All operational" },
    { title: "Drivers on Duty", value: "18", icon: UserCheck, change: "3 substitutes" }
  ];

  const recentActivity = [
    { action: "Route updated", details: "Route 7 - New pickup point added", time: "10 min ago", type: "info" },
    { action: "Vehicle maintenance", details: "Bus TB-15 scheduled for service", time: "1 hour ago", type: "warning" },
    { action: "Driver assigned", details: "John Smith assigned to Route 3", time: "2 hours ago", type: "success" },
    { action: "Late arrival", details: "Route 5 delayed by 15 minutes", time: "3 hours ago", type: "alert" }
  ];

  const routeStatus = [
    { route: "Route 1", students: 45, status: "On Time", driver: "Sarah Johnson", nextStop: "10:30 AM" },
    { route: "Route 2", students: 38, status: "Delayed", driver: "Mike Brown", nextStop: "10:45 AM" },
    { route: "Route 3", students: 52, status: "On Time", driver: "John Smith", nextStop: "11:00 AM" },
    { route: "Route 4", students: 41, status: "On Time", driver: "Lisa Davis", nextStop: "11:15 AM" }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button className="gap-2" onClick={() => toast.info("Vehicle tracking system loading...")}>
          <MapPin className="h-4 w-4" />
          Track Vehicles
        </Button>
        <Button variant="outline" onClick={() => toast.warning("Emergency Contact activated - dispatching notification")}>Emergency Contact</Button>
        <Button variant="outline" onClick={() => toast.info("Route Planning tool opening...")}>Route Planning</Button>
        <Button variant="outline" onClick={() => toast.success("Driver Check-in system ready")}>Driver Check-in</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transport updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                </div>
                <Badge variant="outline" className="text-xs">{activity.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Route Status */}
        <Card>
          <CardHeader>
            <CardTitle>Live Route Status</CardTitle>
            <CardDescription>Current status of active routes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {routeStatus.map((route, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{route.route}</p>
                    <p className="text-xs text-muted-foreground">{route.students} students • {route.driver}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={route.status === "On Time" ? "default" : "destructive"}>
                      {route.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Next: {route.nextStop}</p>
                  </div>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Emergency & Alerts
          </CardTitle>
          <CardDescription>Important transport notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Weather Alert</p>
                <p className="text-xs text-muted-foreground">Heavy rain expected - monitor routes closely</p>
              </div>
              <Badge variant="secondary">Weather</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Route Optimization</p>
                <p className="text-xs text-muted-foreground">AI suggests combining Routes 8 & 9 for efficiency</p>
              </div>
              <Badge variant="outline">AI Suggestion</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}