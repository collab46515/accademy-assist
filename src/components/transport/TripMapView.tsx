import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, MapPin, Route, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { TripStop } from '@/hooks/useTripPlanning';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface TripMapViewProps {
  stops: TripStop[];
  tripName?: string;
}

export const TripMapView: React.FC<TripMapViewProps> = ({ stops, tripName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const { isLoaded, isLoading, error, loadMaps } = useGoogleMaps();
  const [mapError, setMapError] = useState<string | null>(null);

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

  const getMarkerColor = (status: 'red' | 'yellow' | 'green') => {
    switch (status) {
      case 'red': return '#ef4444';
      case 'yellow': return '#eab308';
      case 'green': return '#22c55e';
    }
  };

  // Load maps on mount
  useEffect(() => {
    loadMaps();
  }, [loadMaps]);

  // Initialize map when loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      // Default center (will be adjusted if stops have coordinates)
      const defaultCenter = { lat: 17.385, lng: 78.4867 }; // Hyderabad, India
      
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapId: 'trip-map-view',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    } catch (err: any) {
      console.error('Error initializing map:', err);
      setMapError('Failed to initialize map');
    }
  }, [isLoaded]);

  // Update markers when stops change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];

    // Add new markers for stops with coordinates (use latitude/longitude fields)
    const stopsWithCoords = stops.filter(stop => stop.latitude && stop.longitude);
    
    if (stopsWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      stopsWithCoords.forEach((stop, index) => {
        const position = { lat: stop.latitude!, lng: stop.longitude! };
        bounds.extend(position);

        const status = getStopStatus(stop);
        const color = getMarkerColor(status);
        
        // Create custom marker element
        const markerContent = document.createElement('div');
        markerContent.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${index + 1}
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position,
          title: stop.stop_name,
          content: markerContent,
        });

        markersRef.current.push(marker);
      });

      mapInstanceRef.current.fitBounds(bounds, 50);
    }
  }, [stops, isLoaded]);

  const totalStudents = stops.reduce((sum, s) => sum + s.assigned_students_count, 0);
  const totalDistance = stops.reduce((sum, s) => sum + (s.distance_from_previous_km || 0), 0);

  // Show visual route when no map is available
  const renderVisualRoute = () => (
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

      <div className="ml-5 w-0.5 h-4 bg-border" />

      {stops.sort((a, b) => a.stop_order - b.stop_order).map((stop, index) => {
        const status = getStopStatus(stop);
        
        return (
          <div key={stop.id} className="relative">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getStatusColor(status)}`}>
                  {index + 1}
                </div>
                {index < stops.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-1" />
                )}
              </div>
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
  );

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
        {stops.length === 0 ? (
          <div className="relative bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 min-h-[300px] border flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Map className="h-10 w-10 opacity-50" />
            </div>
            <p className="font-medium text-muted-foreground">No stops to display</p>
            <p className="text-sm mt-1 text-center max-w-xs text-muted-foreground">
              Click "Add Stop" in the Stops tab to add pickup/drop-off points, or use Auto-Generate to create trips with stops automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Route Stats */}
            <div className="flex items-center gap-4">
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

            {/* Map Container */}
            <div className="relative rounded-lg border overflow-hidden" style={{ height: '350px' }}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-sm">Loading map...</span>
                </div>
              )}
              
              {(error || mapError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10">
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">{error || mapError}</p>
                  <Button variant="outline" size="sm" onClick={loadMaps}>
                    Retry
                  </Button>
                </div>
              )}

              {isLoaded && !error && !mapError ? (
                <div ref={mapRef} className="w-full h-full" />
              ) : !isLoading && !error && !mapError ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : null}
            </div>

            {/* Visual Route Fallback */}
            <div className="bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4 border">
              <h4 className="text-sm font-medium mb-3">Route Sequence</h4>
              {renderVisualRoute()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};