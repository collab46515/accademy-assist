import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bus,
  Users,
  MapPin,
  AlertTriangle,
  Plus,
  Car,
  Route,
  UserCheck,
  Activity,
  Calendar,
  Clock,
  Phone,
  Shield
} from 'lucide-react';
import { useTransportData } from '@/hooks/useTransportData';
import { DriversManager } from './DriversManager';
import { VehiclesManager } from './VehiclesManager';
import { RoutesManager } from './RoutesManager';
import { IncidentsManager } from './IncidentsManager';
import { StudentTransportManager } from './StudentTransportManager';

export const TransportDashboard = () => {
  const { drivers, vehicles, routes, incidents, studentTransport, loading } = useTransportData();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const activeRoutes = routes.filter(r => r.status === 'active').length;
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;

  const dashboardStats = [
    {
      title: 'Active Drivers',
      value: activeDrivers,
      total: drivers.length,
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      title: 'Active Vehicles',
      value: activeVehicles,
      total: vehicles.length,
      icon: Bus,
      color: 'text-green-600'
    },
    {
      title: 'Active Routes',
      value: activeRoutes,
      total: routes.length,
      icon: Route,
      color: 'text-purple-600'
    },
    {
      title: 'Students Using Transport',
      value: studentTransport.filter(st => st.status === 'active').length,
      total: studentTransport.length,
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
          <p className="text-muted-foreground">
            Manage school transport operations, drivers, vehicles, and routes
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    of {stat.total} total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity & Alerts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>
                  Latest transport incidents and their status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {incidents.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{incident.incident_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(incident.incident_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        incident.severity === 'critical' ? 'destructive' :
                        incident.severity === 'high' ? 'destructive' :
                        incident.severity === 'medium' ? 'secondary' : 'outline'
                      }>
                        {incident.severity}
                      </Badge>
                      <Badge variant={
                        incident.status === 'open' ? 'destructive' :
                        incident.status === 'investigating' ? 'secondary' : 'outline'
                      }>
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {incidents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No incidents reported
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  Active routes and timings for today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {routes.filter(r => r.status === 'active').slice(0, 5).map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{route.route_name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {route.start_time} - {route.end_time || 'Ongoing'}
                      </p>
                    </div>
                    <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                      {route.route_type}
                    </Badge>
                  </div>
                ))}
                {routes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No routes scheduled
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts & Alerts */}
          {(openIncidents > 0 || criticalIncidents > 0) && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Shield className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {openIncidents > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-800">Open Incidents</span>
                    <Badge variant="destructive">{openIncidents}</Badge>
                  </div>
                )}
                {criticalIncidents > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-800">Critical Issues</span>
                    <Badge variant="destructive">{criticalIncidents}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="drivers">
          <DriversManager />
        </TabsContent>

        <TabsContent value="vehicles">
          <VehiclesManager />
        </TabsContent>

        <TabsContent value="routes">
          <RoutesManager />
        </TabsContent>

        <TabsContent value="students">
          <StudentTransportManager />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};