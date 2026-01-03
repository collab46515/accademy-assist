import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Circle, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';
import { useTransportNotifications } from '@/hooks/useTransportNotifications';
import { useRBAC } from '@/hooks/useRBAC';

export const GeofenceManager = () => {
  const { currentSchool } = useRBAC();
  const schoolId = currentSchool?.id || null;
  const { geofences, loading, addGeofence, updateGeofence, deleteGeofence } = useTransportNotifications(schoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    geofence_type: 'school',
    center_lat: 0,
    center_lng: 0,
    radius_meters: 500,
    trigger_on_entry: true,
    trigger_on_exit: false,
    is_active: true
  });

  const handleSubmit = async () => {
    if (!schoolId) return;
    
    try {
      if (editingGeofence) {
        await updateGeofence(editingGeofence.id, formData);
      } else {
        await addGeofence({ ...formData, school_id: schoolId });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving geofence:', err);
    }
  };

  const handleEdit = (geofence: any) => {
    setEditingGeofence(geofence);
    setFormData({
      name: geofence.name,
      geofence_type: geofence.geofence_type,
      center_lat: geofence.center_lat,
      center_lng: geofence.center_lng,
      radius_meters: geofence.radius_meters,
      trigger_on_entry: geofence.trigger_on_entry,
      trigger_on_exit: geofence.trigger_on_exit,
      is_active: geofence.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingGeofence(null);
    setFormData({
      name: '',
      geofence_type: 'school',
      center_lat: 0,
      center_lng: 0,
      radius_meters: 500,
      trigger_on_entry: true,
      trigger_on_exit: false,
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Geofences</h3>
          <p className="text-sm text-muted-foreground">Set up location-based triggers for "arriving soon" notifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" />
              Add Geofence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGeofence ? 'Edit Geofence' : 'Create Geofence'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., School Campus"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.geofence_type} onValueChange={(v) => setFormData({ ...formData, geofence_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="stop">Bus Stop</SelectItem>
                    <SelectItem value="zone">Zone</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="0.0000001"
                    value={formData.center_lat}
                    onChange={(e) => setFormData({ ...formData, center_lat: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="0.0000001"
                    value={formData.center_lng}
                    onChange={(e) => setFormData({ ...formData, center_lng: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Radius (meters)</Label>
                <Input
                  type="number"
                  value={formData.radius_meters}
                  onChange={(e) => setFormData({ ...formData, radius_meters: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-3">
                <Label>Trigger On</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.trigger_on_entry}
                      onCheckedChange={(v) => setFormData({ ...formData, trigger_on_entry: v })}
                    />
                    <span className="text-sm flex items-center gap-1">
                      <ArrowRightCircle className="h-4 w-4" /> Entry
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.trigger_on_exit}
                      onCheckedChange={(v) => setFormData({ ...formData, trigger_on_exit: v })}
                    />
                    <span className="text-sm flex items-center gap-1">
                      <ArrowLeftCircle className="h-4 w-4" /> Exit
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                />
                <span className="text-sm">Active</span>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>
                  {editingGeofence ? 'Update' : 'Create'} Geofence
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {geofences.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No geofences configured yet</p>
            <p className="text-sm mt-1">Create geofences to trigger "arriving soon" alerts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {geofences.map((geofence) => (
            <Card key={geofence.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{geofence.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{geofence.geofence_type}</p>
                    </div>
                  </div>
                  <Badge variant={geofence.is_active ? 'default' : 'secondary'}>
                    {geofence.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span>Radius: {geofence.radius_meters}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Lat: {geofence.center_lat.toFixed(5)}</span>
                    <span>•</span>
                    <span>Lng: {geofence.center_lng.toFixed(5)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  {geofence.trigger_on_entry && (
                    <Badge variant="outline" className="gap-1">
                      <ArrowRightCircle className="h-3 w-3" /> Entry
                    </Badge>
                  )}
                  {geofence.trigger_on_exit && (
                    <Badge variant="outline" className="gap-1">
                      <ArrowLeftCircle className="h-3 w-3" /> Exit
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(geofence)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive"
                    onClick={() => deleteGeofence(geofence.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
