import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Route, 
  Bus, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTransportData } from '@/hooks/useTransportData';

interface MasterRoute {
  id: string;
  trip_name: string;
  trip_code: string | null;
  trip_type: string;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  estimated_distance_km: number | null;
  estimated_duration_minutes: number | null;
  vehicle_capacity: number | null;
  assigned_students_count: number;
  status: string;
  start_point: string | null;
  end_point: string | null;
  profile_name: string;
  vehicle_number: string | null;
  driver_name: string | null;
  stop_count: number;
}

export const MasterRouteList: React.FC = () => {
  const { userSchoolId } = useTransportData();
  const [routes, setRoutes] = useState<MasterRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadMasterRoutes = useCallback(async () => {
    if (!userSchoolId) return;
    
    setLoading(true);
    try {
      // Fetch all trips with related data
      const { data: trips, error } = await supabase
        .from('transport_trips')
        .select(`
          id,
          trip_name,
          trip_code,
          trip_type,
          scheduled_start_time,
          scheduled_end_time,
          estimated_distance_km,
          estimated_duration_minutes,
          vehicle_capacity,
          assigned_students_count,
          status,
          start_point,
          end_point,
          route_profile_id,
          vehicle_id,
          driver_id
        `)
        .eq('school_id', userSchoolId)
        .order('scheduled_start_time', { ascending: true });

      if (error) throw error;

      // Fetch related data
      const profileIds = [...new Set(trips?.map(t => t.route_profile_id).filter(Boolean))] as string[];
      const vehicleIds = [...new Set(trips?.map(t => t.vehicle_id).filter(Boolean))] as string[];
      const driverIds = [...new Set(trips?.map(t => t.driver_id).filter(Boolean))] as string[];
      const tripIds = trips?.map(t => t.id) || [];

      const [profilesRes, vehiclesRes, driversRes, stopsRes] = await Promise.all([
        profileIds.length > 0 
          ? supabase.from('route_profiles').select('id, profile_name').in('id', profileIds)
          : { data: [] },
        vehicleIds.length > 0
          ? supabase.from('vehicles').select('id, vehicle_number').in('id', vehicleIds)
          : { data: [] },
        driverIds.length > 0
          ? supabase.from('drivers').select('id, first_name, last_name').in('id', driverIds)
          : { data: [] },
        tripIds.length > 0
          ? supabase.from('trip_stops').select('trip_id').in('trip_id', tripIds)
          : { data: [] },
      ]);

      const profileMap = new Map((profilesRes.data || []).map(p => [p.id, p.profile_name]));
      const vehicleMap = new Map((vehiclesRes.data || []).map(v => [v.id, v.vehicle_number]));
      const driverMap = new Map((driversRes.data || []).map(d => [d.id, `${d.first_name} ${d.last_name}`]));
      
      // Count stops per trip
      const stopCounts = (stopsRes.data || []).reduce((acc, stop) => {
        acc[stop.trip_id] = (acc[stop.trip_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const masterRoutes: MasterRoute[] = (trips || []).map(trip => ({
        id: trip.id,
        trip_name: trip.trip_name,
        trip_code: trip.trip_code,
        trip_type: trip.trip_type,
        scheduled_start_time: trip.scheduled_start_time,
        scheduled_end_time: trip.scheduled_end_time,
        estimated_distance_km: trip.estimated_distance_km,
        estimated_duration_minutes: trip.estimated_duration_minutes,
        vehicle_capacity: trip.vehicle_capacity,
        assigned_students_count: trip.assigned_students_count,
        status: trip.status,
        start_point: trip.start_point,
        end_point: trip.end_point,
        profile_name: profileMap.get(trip.route_profile_id) || 'Unknown Profile',
        vehicle_number: vehicleMap.get(trip.vehicle_id) || null,
        driver_name: driverMap.get(trip.driver_id) || null,
        stop_count: stopCounts[trip.id] || 0,
      }));

      setRoutes(masterRoutes);
    } catch (err) {
      console.error('Error loading master routes:', err);
    } finally {
      setLoading(false);
    }
  }, [userSchoolId]);

  useEffect(() => {
    loadMasterRoutes();
  }, [loadMasterRoutes]);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.trip_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.profile_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || route.trip_type === filterType;
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCapacityStatus = (route: MasterRoute) => {
    if (!route.vehicle_capacity) return 'unknown';
    const utilization = (route.assigned_students_count / route.vehicle_capacity) * 100;
    if (utilization > 100) return 'over';
    if (utilization >= 80) return 'high';
    if (utilization >= 50) return 'medium';
    return 'low';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalStudents = routes.reduce((sum, r) => sum + r.assigned_students_count, 0);
  const totalCapacity = routes.reduce((sum, r) => sum + (r.vehicle_capacity || 0), 0);
  const activeRoutes = routes.filter(r => r.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{routes.length}</div>
                <div className="text-sm text-muted-foreground">Total Routes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{activeRoutes}</div>
                <div className="text-sm text-muted-foreground">Active Routes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <div className="text-sm text-muted-foreground">Students Assigned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">
                  {totalCapacity > 0 ? `${Math.round((totalStudents / totalCapacity) * 100)}%` : '0%'}
                </div>
                <div className="text-sm text-muted-foreground">Fleet Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Route className="h-5 w-5" />
              Master Route List
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadMasterRoutes}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Complete view of all routes across all profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes, vehicles, drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Dropoff</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No routes found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoutes.map((route) => {
                    const capacityStatus = getCapacityStatus(route);
                    return (
                      <TableRow key={route.id}>
                        <TableCell>
                          <div className="font-medium">{route.trip_name}</div>
                          {route.trip_code && (
                            <div className="text-xs text-muted-foreground">{route.trip_code}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{route.profile_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {route.scheduled_start_time}
                            {route.scheduled_end_time && ` - ${route.scheduled_end_time}`}
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {route.trip_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {route.vehicle_number ? (
                            <div className="flex items-center gap-1">
                              <Bus className="h-3 w-3" />
                              {route.vehicle_number}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {route.driver_name ? (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {route.driver_name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {route.stop_count}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${
                            capacityStatus === 'over' ? 'text-destructive' :
                            capacityStatus === 'high' ? 'text-amber-600' : ''
                          }`}>
                            {capacityStatus === 'over' && <AlertTriangle className="h-3 w-3" />}
                            <Users className="h-3 w-3" />
                            {route.assigned_students_count}/{route.vehicle_capacity || '?'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {route.estimated_distance_km ? (
                            <span>{route.estimated_distance_km} km</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(route.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
