import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Pencil, Trash2, Bus, User, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import { TransportTrip, RouteProfile, useTripPlanning } from '@/hooks/useTripPlanning';
import { useTransportData } from '@/hooks/useTransportData';

interface TripsManagerProps {
  routeProfile?: RouteProfile;
  onBack?: () => void;
}

export const TripsManager: React.FC<TripsManagerProps> = ({ routeProfile, onBack }) => {
  const { userSchoolId, vehicles, drivers } = useTransportData();
  const { 
    trips, 
    loading, 
    fetchTripsForProfile,
    addTrip, 
    updateTrip, 
    deleteTrip 
  } = useTripPlanning(userSchoolId);
  
  const [profileTrips, setProfileTrips] = useState<TransportTrip[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TransportTrip | null>(null);
  const [formData, setFormData] = useState({
    trip_name: '',
    trip_code: '',
    trip_type: 'pickup',
    start_point: 'Depot',
    end_point: 'School',
    vehicle_id: '',
    driver_id: '',
    attender_id: '',
    scheduled_start_time: '07:00',
    scheduled_end_time: '08:00',
    estimated_duration_minutes: 60,
    estimated_distance_km: '',
    status: 'active',
  });

  useEffect(() => {
    if (routeProfile) {
      loadProfileTrips();
    }
  }, [routeProfile]);

  const loadProfileTrips = async () => {
    if (routeProfile) {
      const data = await fetchTripsForProfile(routeProfile.id);
      setProfileTrips(data);
    }
  };

  const displayTrips = routeProfile ? profileTrips : trips;

  const resetForm = () => {
    setFormData({
      trip_name: '',
      trip_code: '',
      trip_type: 'pickup',
      start_point: 'Depot',
      end_point: 'School',
      vehicle_id: '',
      driver_id: '',
      attender_id: '',
      scheduled_start_time: routeProfile?.start_time || '07:00',
      scheduled_end_time: routeProfile?.end_time || '08:00',
      estimated_duration_minutes: 60,
      estimated_distance_km: '',
      status: 'active',
    });
    setEditingTrip(null);
  };

  const handleEdit = (trip: TransportTrip) => {
    setEditingTrip(trip);
    setFormData({
      trip_name: trip.trip_name,
      trip_code: trip.trip_code || '',
      trip_type: trip.trip_type,
      start_point: trip.start_point || 'Depot',
      end_point: trip.end_point || 'School',
      vehicle_id: trip.vehicle_id || '',
      driver_id: trip.driver_id || '',
      attender_id: trip.attender_id || '',
      scheduled_start_time: trip.scheduled_start_time,
      scheduled_end_time: trip.scheduled_end_time || '',
      estimated_duration_minutes: trip.estimated_duration_minutes || 60,
      estimated_distance_km: trip.estimated_distance_km?.toString() || '',
      status: trip.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSchoolId || !routeProfile) return;

    try {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
      
      const tripData = {
        school_id: userSchoolId,
        route_profile_id: routeProfile.id,
        trip_name: formData.trip_name,
        trip_code: formData.trip_code || null,
        trip_type: formData.trip_type,
        start_point: formData.start_point,
        end_point: formData.end_point,
        vehicle_id: formData.vehicle_id || null,
        driver_id: formData.driver_id || null,
        attender_id: formData.attender_id || null,
        scheduled_start_time: formData.scheduled_start_time,
        scheduled_end_time: formData.scheduled_end_time || null,
        estimated_duration_minutes: formData.estimated_duration_minutes,
        estimated_distance_km: formData.estimated_distance_km ? parseFloat(formData.estimated_distance_km) : null,
        vehicle_capacity: selectedVehicle?.capacity || null,
        assigned_students_count: 0,
        status: formData.status,
      };

      if (editingTrip) {
        await updateTrip(editingTrip.id, tripData);
      } else {
        await addTrip(tripData as any);
      }
      
      await loadProfileTrips();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving trip:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will also delete all stops and student assignments.')) {
      await deleteTrip(id);
      await loadProfileTrips();
    }
  };

  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const activeDrivers = drivers.filter(d => d.status === 'active');
  const attenders = drivers.filter(d => d.status === 'active'); // Attenders stored in drivers table

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
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              {routeProfile ? `Trips for ${routeProfile.profile_name}` : 'All Trips'}
            </CardTitle>
            <CardDescription>
              Define executable trips with vehicles, drivers, and stops
            </CardDescription>
          </div>
        </div>
        {routeProfile && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                </DialogTitle>
                <DialogDescription>
                  Configure trip details, assign resources, and set timing
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trip_name">Trip Name *</Label>
                    <Input
                      id="trip_name"
                      value={formData.trip_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, trip_name: e.target.value }))}
                      placeholder="e.g., Route A - Morning"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="trip_code">Trip Code</Label>
                    <Input
                      id="trip_code"
                      value={formData.trip_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, trip_code: e.target.value }))}
                      placeholder="e.g., RA-AM"
                    />
                  </div>

                  <div>
                    <Label htmlFor="trip_type">Trip Type *</Label>
                    <Select
                      value={formData.trip_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, trip_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Pickup (Home → School)</SelectItem>
                        <SelectItem value="drop">Drop (School → Home)</SelectItem>
                        <SelectItem value="both">Round Trip</SelectItem>
                        <SelectItem value="special">Special Trip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="start_point">Start Point</Label>
                    <Input
                      id="start_point"
                      value={formData.start_point}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_point: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_point">End Point</Label>
                    <Input
                      id="end_point"
                      value={formData.end_point}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_point: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="scheduled_start_time">Start Time *</Label>
                    <Input
                      id="scheduled_start_time"
                      type="time"
                      value={formData.scheduled_start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_start_time: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="scheduled_end_time">End Time</Label>
                    <Input
                      id="scheduled_end_time"
                      type="time"
                      value={formData.scheduled_end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_end_time: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicle_id">Vehicle</Label>
                    <Select
                      value={formData.vehicle_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeVehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.vehicle_number} ({v.capacity} seats)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="driver_id">Driver</Label>
                    <Select
                      value={formData.driver_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, driver_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeDrivers.map(d => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.first_name} {d.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="attender_id">Attender</Label>
                    <Select
                      value={formData.attender_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, attender_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attender" />
                      </SelectTrigger>
                      <SelectContent>
                        {attenders.map(a => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.first_name} {a.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimated_distance_km">Estimated Distance (km)</Label>
                    <Input
                      id="estimated_distance_km"
                      type="number"
                      step="0.1"
                      value={formData.estimated_distance_km}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_distance_km: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTrip ? 'Update' : 'Create'} Trip
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {displayTrips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trips created yet</p>
            <p className="text-sm">
              {routeProfile 
                ? 'Add trips to this route profile' 
                : 'Select a route profile to manage trips'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{trip.trip_name}</p>
                      {trip.trip_code && (
                        <p className="text-sm text-muted-foreground">{trip.trip_code}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {trip.trip_type === 'pickup' ? '🏠→🏫' : trip.trip_type === 'drop' ? '🏫→🏠' : '🔄'}
                      {' '}{trip.trip_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {trip.scheduled_start_time}
                      {trip.scheduled_end_time && ` - ${trip.scheduled_end_time}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    {trip.vehicle ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Bus className="h-3 w-3" />
                        {trip.vehicle.vehicle_number}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {trip.driver ? (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        {trip.driver.first_name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      {trip.assigned_students_count}/{trip.vehicle_capacity || '?'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(trip)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(trip.id)}>
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
