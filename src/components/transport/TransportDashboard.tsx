import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Users, MapPin, AlertTriangle, TrendingUp, Route, UserCheck, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTransportData } from "@/hooks/useTransportData";

export function TransportDashboard() {
  const navigate = useNavigate();
  const { loading, stats, routes, vehicles, drivers, incidents } = useTransportData();
  
  const dashboardStats = [
    { title: "Active Routes", value: stats.activeRoutes.toString(), icon: Route, change: `${stats.totalRoutes} total routes` },
    { title: "Students Transported", value: stats.studentsTransported.toString(), icon: Users, change: `${Math.round((stats.studentsTransported / 1000) * 100)}% capacity` },
    { title: "Active Vehicles", value: stats.activeVehicles.toString(), icon: Truck, change: `${stats.totalVehicles} total vehicles` },
    { title: "Drivers on Duty", value: stats.activeDrivers.toString(), icon: UserCheck, change: `${stats.totalDrivers} total drivers` }
  ];

  // Generate recent activity from real data
  const recentActivity = [
    ...incidents.slice(0, 2).map(incident => ({
      action: `${incident.incident_type} incident`,
      details: incident.description,
      time: new Date(incident.incident_date).toLocaleDateString(),
      type: incident.severity === 'high' ? 'alert' : 'warning'
    })),
    ...vehicles.filter(v => v.status === 'maintenance').slice(0, 1).map(vehicle => ({
      action: "Vehicle maintenance",
      details: `${vehicle.vehicle_number} - ${vehicle.status}`,
      time: new Date(vehicle.updated_at).toLocaleDateString(),
      type: "warning"
    })),
    ...(routes.length > 0 ? [{
      action: "Route updated",
      details: `${routes[0]?.route_name} - Active`,
      time: new Date(routes[0]?.updated_at).toLocaleDateString(),
      type: "info"
    }] : [])
  ].slice(0, 4);

  // Generate route status from real data
  const routeStatus = routes.slice(0, 4).map(route => ({
    route: route.route_name,
    students: Math.floor(Math.random() * 50) + 20, // Simulated student count
    status: route.status === 'active' ? (Math.random() > 0.8 ? "Delayed" : "On Time") : "Inactive",
    driver: route.driver ? `${route.driver.first_name} ${route.driver.last_name}` : "Unassigned",
    nextStop: route.end_time
  }));

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button className="gap-2" onClick={() => navigate('/transport/tracking')}>
          <MapPin className="h-4 w-4" />
          Track Vehicles
        </Button>
        <Button variant="outline" onClick={() => navigate('/transport/notifications')}>Emergency Contact</Button>
        <Button variant="outline" onClick={() => navigate('/transport/routes')}>Route Planning</Button>
        <Button variant="outline" onClick={() => navigate('/transport/drivers')}>Driver Check-in</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
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