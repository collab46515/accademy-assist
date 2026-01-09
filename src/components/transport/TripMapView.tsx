import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Route, Navigation } from 'lucide-react';
import { TripStop } from '@/hooks/useTripPlanning';

interface TripMapViewProps {
  stops: TripStop[];
  tripName?: string;
}

export const TripMapView: React.FC<TripMapViewProps> = ({ stops, tripName }) => {
  const getStopStatus = (stop: TripStop): 'red' | 'yellow' | 'green' => {
    if (stop.assigned_students_count === 0) return 'red';
    if (stop.assigned_students_count >= stop.total_students_at_stop) return 'green';
    return 'yellow';
  };

  const getStatusColor = (status: 'red' | 'yellow' | 'green') => {
    switch (status) {
      case 'red': return 'bg-destructive text-destructive-foreground';
      case 'yellow': return 'bg-yellow-500 text-white';
      case 'green': return 'bg-green-500 text-white';
    }
  };

  const totalStudents = stops.reduce((sum, s) => sum + s.assigned_students_count, 0);
  const totalDistance = stops.reduce((sum, s) => sum + (s.distance_from_previous_km || 0), 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Map className="h-5 w-5" />
          Route Visualization
        </CardTitle>
        {tripName && (
          <p className="text-sm text-muted-foreground">{tripName}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* Map Placeholder - Visual Route */}
        <div className="relative bg-muted rounded-lg p-4 min-h-[300px]">
          {stops.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <Map className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-sm">No stops to display</p>
              <p className="text-xs mt-1">Add stops to see the route visualization</p>
            </div>
          ) : (
            <>
              {/* Route Stats */}
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {stops.length} stops
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Navigation className="h-3 w-3" />
                  {totalDistance.toFixed(1)} km
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  {totalStudents} students
                </Badge>
              </div>

              {/* Visual Route Path */}
              <div className="relative">
                {/* School Start Point */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Route className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">School</div>
                    <div className="text-xs text-muted-foreground">Start Point</div>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="ml-5 w-0.5 h-4 bg-border" />

                {/* Stops */}
                {stops.sort((a, b) => a.stop_order - b.stop_order).map((stop, index) => {
                  const status = getStopStatus(stop);
                  
                  return (
                    <div key={stop.id} className="relative">
                      <div className="flex items-start gap-3">
                        {/* Stop Marker */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getStatusColor(status)}`}>
                            {index + 1}
                          </div>
                          {index < stops.length - 1 && (
                            <div className="w-0.5 h-8 bg-border mt-1" />
                          )}
                        </div>

                        {/* Stop Info */}
                        <div className="flex-1 pb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{stop.stop_name}</span>
                            <Badge 
                              variant={status === 'green' ? 'default' : status === 'yellow' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {stop.assigned_students_count} / {stop.total_students_at_stop}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {stop.scheduled_arrival_time}
                            {stop.distance_from_previous_km && (
                              <span className="ml-2">• {stop.distance_from_previous_km} km</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Connection to End */}
                {stops.length > 0 && (
                  <>
                    <div className="ml-5 w-0.5 h-4 bg-border" />
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Route className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">School</div>
                        <div className="text-xs text-muted-foreground">End Point</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Map Integration Note */}
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-center text-muted-foreground">
                  <Map className="h-4 w-4 inline-block mr-1" />
                  Interactive map with Google Maps coming soon
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
