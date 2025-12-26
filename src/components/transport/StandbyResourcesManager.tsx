import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Trash2, Shield, User, Bus, Clock } from 'lucide-react';
import { StandbyResource, RouteProfile, useTripPlanning } from '@/hooks/useTripPlanning';
import { useTransportData } from '@/hooks/useTransportData';

interface StandbyResourcesManagerProps {
  routeProfile?: RouteProfile | null;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export const StandbyResourcesManager: React.FC<StandbyResourcesManagerProps> = ({ routeProfile }) => {
  const { userSchoolId, vehicles, drivers } = useTransportData();
  const { standbyResources, loading, addStandbyResource, updateStandbyResource, deleteStandbyResource } = useTripPlanning(userSchoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    resource_type: 'driver',
    driver_id: '',
    vehicle_id: '',
    available_from: '07:00',
    available_until: '17:00',
    days_available: [1, 2, 3, 4, 5],
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      resource_type: 'driver',
      driver_id: '',
      vehicle_id: '',
      available_from: '07:00',
      available_until: '17:00',
      days_available: [1, 2, 3, 4, 5],
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSchoolId) return;

    try {
      await addStandbyResource({
        school_id: userSchoolId,
        route_profile_id: routeProfile?.id || null,
        resource_type: formData.resource_type,
        driver_id: formData.resource_type !== 'vehicle' ? formData.driver_id || null : null,
        vehicle_id: formData.resource_type === 'vehicle' ? formData.vehicle_id || null : null,
        available_from: formData.available_from,
        available_until: formData.available_until,
        days_available: formData.days_available,
        is_available: true,
        notes: formData.notes || null,
      } as any);

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error adding standby resource:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this standby resource?')) {
      await deleteStandbyResource(id);
    }
  };

  const toggleAvailability = async (resource: StandbyResource) => {
    await updateStandbyResource(resource.id, { is_available: !resource.is_available });
  };

  const toggleDayAvailable = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days_available: prev.days_available.includes(day)
        ? prev.days_available.filter(d => d !== day)
        : [...prev.days_available, day].sort()
    }));
  };

  const filteredResources = routeProfile
    ? standbyResources.filter(r => r.route_profile_id === routeProfile.id || !r.route_profile_id)
    : standbyResources;

  const activeDrivers = drivers.filter(d => d.status === 'active');
  const activeVehicles = vehicles.filter(v => v.status === 'active');

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
            <Shield className="h-5 w-5" />
            Standby Resources
          </CardTitle>
          <CardDescription>
            Reserve backup drivers, attenders, and vehicles for emergencies
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Standby
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Standby Resource</DialogTitle>
              <DialogDescription>
                Add a backup resource to the standby pool
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="resource_type">Resource Type *</Label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    resource_type: value,
                    driver_id: '',
                    vehicle_id: ''
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="attender">Attender</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.resource_type !== 'vehicle' && (
                <div>
                  <Label htmlFor="driver_id">{formData.resource_type === 'driver' ? 'Driver' : 'Attender'} *</Label>
                  <Select
                    value={formData.driver_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, driver_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
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
              )}

              {formData.resource_type === 'vehicle' && (
                <div>
                  <Label htmlFor="vehicle_id">Vehicle *</Label>
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
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="available_from">Available From</Label>
                  <Input
                    id="available_from"
                    type="time"
                    value={formData.available_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, available_from: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="available_until">Available Until</Label>
                  <Input
                    id="available_until"
                    type="time"
                    value={formData.available_until}
                    onChange={(e) => setFormData(prev => ({ ...prev, available_until: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Available Days</Label>
                <div className="flex gap-2 mt-2">
                  {DAYS_OF_WEEK.map(day => (
                    <Button
                      key={day.value}
                      type="button"
                      size="sm"
                      variant={formData.days_available.includes(day.value) ? 'default' : 'outline'}
                      onClick={() => toggleDayAvailable(day.value)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add to Standby Pool</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No standby resources configured</p>
            <p className="text-sm">Add backup drivers, attenders, or vehicles</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {resource.resource_type === 'vehicle' ? (
                        <>
                          <Bus className="h-4 w-4" />
                          <span>{resource.vehicle?.vehicle_number || 'Unknown'}</span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          <span>
                            {resource.driver 
                              ? `${resource.driver.first_name} ${resource.driver.last_name}`
                              : 'Unknown'}
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {resource.resource_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {resource.available_from} - {resource.available_until}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {resource.days_available?.map(d => 
                        DAYS_OF_WEEK.find(day => day.value === d)?.label
                      ).join(', ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={resource.is_available}
                        onCheckedChange={() => toggleAvailability(resource)}
                      />
                      <span className="text-sm">
                        {resource.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(resource.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
