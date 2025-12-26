import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bus, 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertTriangle,
  MapPin,
  User
} from 'lucide-react';
import { useLiveOperations } from '@/hooks/useLiveOperations';
import { useAuth } from '@/hooks/useAuth';

export const LiveTripsDashboard = () => {
  const { user } = useAuth();
  const schoolId = user?.user_metadata?.school_id || null;
  const { tripInstances, alerts, loading, startTrip, completeTrip } = useLiveOperations(schoolId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'delayed': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const inProgressTrips = tripInstances.filter(t => t.status === 'in_progress');
  const scheduledTrips = tripInstances.filter(t => t.status === 'scheduled');
  const completedTrips = tripInstances.filter(t => t.status === 'completed');
  const activeAlerts = alerts.filter(a => !a.acknowledged_at);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inProgressTrips.length}</div>
            <p className="text-xs text-muted-foreground">Active trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledTrips.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTrips.length}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card className={activeAlerts.length > 0 ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${activeAlerts.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${activeAlerts.length > 0 ? 'text-destructive' : ''}`}>
              {activeAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips */}
      {inProgressTrips.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            Active Trips
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {inProgressTrips.map((instance) => (
              <Card key={instance.id} className="border-green-200 bg-green-50/50">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{instance.trip?.trip_name || 'Trip'}</h4>
                      <p className="text-sm text-muted-foreground">{instance.trip?.trip_type}</p>
                    </div>
                    <Badge variant={getStatusColor(instance.status)} className="gap-1">
                      {getStatusIcon(instance.status)}
                      {instance.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Driver: {instance.driver?.first_name} {instance.driver?.last_name || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bus className="h-4 w-4 text-muted-foreground" />
                      <span>Vehicle: {instance.vehicle?.registration_number || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Started: {instance.actual_start_time ? new Date(instance.actual_start_time).toLocaleTimeString() : '-'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Students Boarded
                      </span>
                      <span>{instance.total_students_boarded || 0} / {instance.total_students_expected || 0}</span>
                    </div>
                    <Progress 
                      value={instance.total_students_expected ? 
                        ((instance.total_students_boarded || 0) / instance.total_students_expected) * 100 : 0
                      } 
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => completeTrip(instance.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Trips */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Scheduled Trips ({scheduledTrips.length})
        </h3>
        {scheduledTrips.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <Bus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled trips for today</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scheduledTrips.map((instance) => (
              <Card key={instance.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{instance.trip?.trip_name || 'Trip'}</h4>
                      <p className="text-sm text-muted-foreground">{instance.trip?.trip_type}</p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Scheduled
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{instance.total_students_expected || 0} students expected</span>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (instance.trip?.driver_id && instance.trip?.vehicle_id) {
                        startTrip(instance.id, instance.trip.driver_id, instance.trip.vehicle_id);
                      }
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Trip
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Trips Summary */}
      {completedTrips.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            Completed Today ({completedTrips.length})
          </h3>
          <div className="grid gap-2">
            {completedTrips.slice(0, 5).map((instance) => (
              <div key={instance.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">{instance.trip?.trip_name || 'Trip'}</p>
                    <p className="text-xs text-muted-foreground">
                      {instance.actual_end_time ? new Date(instance.actual_end_time).toLocaleTimeString() : '-'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {instance.total_students_boarded || 0} students
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
