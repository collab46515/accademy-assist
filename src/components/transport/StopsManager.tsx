import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Plus, Pencil, Trash2, MapPin, Navigation, Search, AlertTriangle } from 'lucide-react';
import { useTransportData, RouteStop } from '@/hooks/useTransportData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StopFormData {
  stop_name: string;
  stop_type: string;
  location_address: string;
  landmark: string;
  latitude: number | null;
  longitude: number | null;
  geofence_radius_meters: number;
  pickup_time: string;
  drop_time: string;
  is_active: boolean;
  notes: string;
}

export const StopsManager = () => {
  const { stops, routes, loading, refetch, userSchoolId } = useTransportData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<RouteStop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [formData, setFormData] = useState<StopFormData>({
    stop_name: '',
    stop_type: 'student_stop',
    location_address: '',
    landmark: '',
    latitude: null,
    longitude: null,
    geofence_radius_meters: 50,
    pickup_time: '07:00',
    drop_time: '16:00',
    is_active: true,
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      stop_name: '',
      stop_type: 'student_stop',
      location_address: '',
      landmark: '',
      latitude: null,
      longitude: null,
      geofence_radius_meters: 50,
      pickup_time: '07:00',
      drop_time: '16:00',
      is_active: true,
      notes: '',
    });
    setEditingStop(null);
    setSelectedRoute('');
  };

  const handleEdit = (stop: RouteStop) => {
    setEditingStop(stop);
    setSelectedRoute(stop.route_id);
    setFormData({
      stop_name: stop.stop_name,
      stop_type: stop.stop_type || 'student_stop',
      location_address: stop.location_address || '',
      landmark: stop.landmark || '',
      latitude: stop.latitude || null,
      longitude: stop.longitude || null,
      geofence_radius_meters: stop.geofence_radius_meters || 50,
      pickup_time: stop.pickup_time,
      drop_time: stop.drop_time || '',
      is_active: stop.is_active !== false,
      notes: stop.notes || '',
    });
    setIsDialogOpen(true);
  };

  const checkGeofenceOverlap = (lat: number | null, lng: number | null, radius: number, excludeId?: string) => {
    if (!lat || !lng) return false;
    
    for (const stop of stops) {
      if (stop.id === excludeId) continue;
      if (!stop.latitude || !stop.longitude) continue;
      
      // Calculate distance between two points (Haversine formula simplified)
      const R = 6371000; // Earth's radius in meters
      const dLat = ((stop.latitude - lat) * Math.PI) / 180;
      const dLng = ((stop.longitude - lng) * Math.PI) / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) * Math.cos((stop.latitude * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      const combinedRadius = radius + (stop.geofence_radius_meters || 50);
      if (distance < combinedRadius) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userSchoolId) {
      toast.error('Please select a school from the header dropdown');
      return;
    }
    
    if (!selectedRoute) {
      toast.error('Please select a route');
      return;
    }

    // Check for geofence overlap
    if (formData.latitude && formData.longitude) {
      const hasOverlap = checkGeofenceOverlap(
        formData.latitude,
        formData.longitude,
        formData.geofence_radius_meters,
        editingStop?.id
      );
      if (hasOverlap) {
        toast.error('Geofence overlaps with another stop. Please adjust the location or radius.');
        return;
      }
    }

    try {
      const stopData = {
        route_id: selectedRoute,
        stop_name: formData.stop_name,
        stop_type: formData.stop_type,
        location_address: formData.location_address || null,
        landmark: formData.landmark || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        geofence_radius_meters: formData.geofence_radius_meters,
        pickup_time: formData.pickup_time,
        drop_time: formData.drop_time || null,
        is_active: formData.is_active,
        notes: formData.notes || null,
        stop_order: editingStop ? editingStop.stop_order : stops.filter(s => s.route_id === selectedRoute).length + 1,
        school_id: userSchoolId,
      };

      if (editingStop) {
        const { error } = await supabase
          .from('route_stops')
          .update(stopData)
          .eq('id', editingStop.id);
        if (error) throw error;
        toast.success('Stop updated successfully');
      } else {
        const { error } = await supabase
          .from('route_stops')
          .insert([stopData]);
        if (error) throw error;
        toast.success('Stop added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error('Error saving stop:', err);
      toast.error('Failed to save stop');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stop?')) {
      try {
        const { error } = await supabase
          .from('route_stops')
          .delete()
          .eq('id', id);
        if (error) throw error;
        toast.success('Stop deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete stop');
      }
    }
  };

  const getStopTypeBadge = (type?: string) => {
    switch (type) {
      case 'depot':
        return <Badge className="bg-purple-100 text-purple-800">Depot</Badge>;
      case 'school':
        return <Badge className="bg-blue-100 text-blue-800">School</Badge>;
      case 'student_stop':
      default:
        return <Badge className="bg-green-100 text-green-800">Student Stop</Badge>;
    }
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.route_name || 'Unknown Route';
  };

  const filteredStops = stops.filter(stop =>
    stop.stop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stop.location_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stop.landmark?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Stop Location Master
          </CardTitle>
          <CardDescription>
            Manage stops with geofencing for arrival detection
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStop ? 'Edit Stop' : 'Add New Stop'}
              </DialogTitle>
              <DialogDescription>
                Enter stop details including GPS coordinates and geofence settings
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="route">Route *</Label>
                  <Select
                    value={selectedRoute}
                    onValueChange={setSelectedRoute}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.route_name} ({route.route_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="stop_name">Stop Name *</Label>
                  <Input
                    id="stop_name"
                    value={formData.stop_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, stop_name: e.target.value }))}
                    placeholder="Main Gate Stop"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stop_type">Stop Type *</Label>
                  <Select
                    value={formData.stop_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, stop_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="depot">Depot</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="student_stop">Student Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="location_address">Address</Label>
                  <Input
                    id="location_address"
                    value={formData.location_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                    placeholder="123 Main Street, City"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Near Shopping Mall, Opposite Park"
                  />
                </div>

                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.00000001"
                    value={formData.latitude || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || null }))}
                    placeholder="12.9716"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.00000001"
                    value={formData.longitude || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || null }))}
                    placeholder="77.5946"
                  />
                </div>

                <div>
                  <Label htmlFor="geofence_radius_meters">Geofence Radius (meters)</Label>
                  <Input
                    id="geofence_radius_meters"
                    type="number"
                    min="10"
                    max="500"
                    value={formData.geofence_radius_meters}
                    onChange={(e) => setFormData(prev => ({ ...prev, geofence_radius_meters: parseInt(e.target.value) || 50 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Radius for arrival detection (10-500m)
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div>
                  <Label htmlFor="pickup_time">Pickup Time *</Label>
                  <Input
                    id="pickup_time"
                    type="time"
                    value={formData.pickup_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickup_time: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="drop_time">Drop Time</Label>
                  <Input
                    id="drop_time"
                    type="time"
                    value={formData.drop_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, drop_time: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    placeholder="Additional notes about this stop..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStop ? 'Update' : 'Add'} Stop
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredStops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No stops found</p>
            <p className="text-sm">Add stops to define the network of pickup/drop locations</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stop</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Geofence</TableHead>
                <TableHead>Times</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStops.map((stop) => (
                <TableRow key={stop.id}>
                  <TableCell>
                    <div className="font-medium">{stop.stop_name}</div>
                    {stop.landmark && (
                      <div className="text-sm text-muted-foreground">{stop.landmark}</div>
                    )}
                  </TableCell>
                  <TableCell>{getStopTypeBadge(stop.stop_type)}</TableCell>
                  <TableCell>{getRouteName(stop.route_id)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {stop.location_address || 'No address'}
                    </div>
                    {stop.latitude && stop.longitude && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {stop.geofence_radius_meters || 50}m
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Pickup: {stop.pickup_time}</div>
                      {stop.drop_time && <div>Drop: {stop.drop_time}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {stop.is_active !== false ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(stop)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(stop.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
