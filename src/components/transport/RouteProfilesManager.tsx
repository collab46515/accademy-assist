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
import { Plus, Pencil, Trash2, Map, Clock, Calendar, Users, ChevronRight } from 'lucide-react';
import { RouteProfile, useTripPlanning } from '@/hooks/useTripPlanning';
import { useTransportData } from '@/hooks/useTransportData';
import { format } from 'date-fns';

interface RouteProfilesManagerProps {
  onSelectProfile?: (profile: RouteProfile) => void;
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

export const RouteProfilesManager: React.FC<RouteProfilesManagerProps> = ({ onSelectProfile }) => {
  const { userSchoolId } = useTransportData();
  const { routeProfiles, trips, loading, addRouteProfile, updateRouteProfile, deleteRouteProfile } = useTripPlanning(userSchoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<RouteProfile | null>(null);
  const [formData, setFormData] = useState({
    profile_name: '',
    profile_code: '',
    description: '',
    valid_from: '',
    valid_until: '',
    start_time: '07:00',
    end_time: '08:30',
    frequency: 'daily',
    days_of_week: [1, 2, 3, 4, 5],
    trip_category: 'regular',
    student_pool_type: 'all',
    apply_school_holidays: true,
    requires_approval: false,
    status: 'draft',
  });

  const resetForm = () => {
    setFormData({
      profile_name: '',
      profile_code: '',
      description: '',
      valid_from: '',
      valid_until: '',
      start_time: '07:00',
      end_time: '08:30',
      frequency: 'daily',
      days_of_week: [1, 2, 3, 4, 5],
      trip_category: 'regular',
      student_pool_type: 'all',
      apply_school_holidays: true,
      requires_approval: false,
      status: 'draft',
    });
    setEditingProfile(null);
  };

  const handleEdit = (profile: RouteProfile) => {
    setEditingProfile(profile);
    setFormData({
      profile_name: profile.profile_name,
      profile_code: profile.profile_code || '',
      description: profile.description || '',
      valid_from: profile.valid_from,
      valid_until: profile.valid_until,
      start_time: profile.start_time,
      end_time: profile.end_time,
      frequency: profile.frequency,
      days_of_week: profile.days_of_week || [1, 2, 3, 4, 5],
      trip_category: profile.trip_category,
      student_pool_type: profile.student_pool_type,
      apply_school_holidays: profile.apply_school_holidays,
      requires_approval: profile.requires_approval,
      status: profile.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSchoolId) return;

    try {
      const profileData = {
        ...formData,
        school_id: userSchoolId,
        student_pool_criteria: {},
        custom_holiday_ids: [],
        approval_status: formData.requires_approval ? 'pending' : 'approved',
      };

      if (editingProfile) {
        await updateRouteProfile(editingProfile.id, profileData);
      } else {
        await addRouteProfile(profileData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving route profile:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This will also delete all trips under this profile.')) {
      await deleteRouteProfile(id);
    }
  };

  const toggleDayOfWeek = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day].sort()
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'regular':
        return <Badge variant="outline">Regular</Badge>;
      case 'altered_regular':
        return <Badge className="bg-amber-100 text-amber-800">Altered</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800">Maintenance</Badge>;
      case 'other':
        return <Badge variant="secondary">Special</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getTripsCount = (profileId: string) => {
    return trips.filter(t => t.route_profile_id === profileId).length;
  };

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
            <Map className="h-5 w-5" />
            Route Profiles
          </CardTitle>
          <CardDescription>
            Define transport demand with validity periods and student pools
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Route Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? 'Edit Route Profile' : 'Create Route Profile'}
              </DialogTitle>
              <DialogDescription>
                Define the transport demand layer with timing and student pools
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="profile_name">Profile Name *</Label>
                  <Input
                    id="profile_name"
                    value={formData.profile_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, profile_name: e.target.value }))}
                    placeholder="e.g., Morning Pickup - Primary Section"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="profile_code">Profile Code</Label>
                  <Input
                    id="profile_code"
                    value={formData.profile_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, profile_code: e.target.value }))}
                    placeholder="e.g., MP-PRI"
                  />
                </div>

                <div>
                  <Label htmlFor="trip_category">Category *</Label>
                  <Select
                    value={formData.trip_category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, trip_category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="altered_regular">Altered Regular (Exams, Events)</SelectItem>
                      <SelectItem value="other">Special (Field Trips)</SelectItem>
                      <SelectItem value="maintenance">Maintenance Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valid_from">Valid From *</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="valid_until">Valid Until *</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_time">End Time *</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>Days of Operation</Label>
                  <div className="flex gap-2 mt-2">
                    {DAYS_OF_WEEK.map(day => (
                      <Button
                        key={day.value}
                        type="button"
                        size="sm"
                        variant={formData.days_of_week.includes(day.value) ? 'default' : 'outline'}
                        onClick={() => toggleDayOfWeek(day.value)}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="student_pool_type">Student Pool</Label>
                  <Select
                    value={formData.student_pool_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, student_pool_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="by_grade">By Grade/Year</SelectItem>
                      <SelectItem value="by_section">By Section</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between col-span-2">
                  <div className="space-y-0.5">
                    <Label>Apply School Holidays</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically skip transport on school holidays
                    </p>
                  </div>
                  <Switch
                    checked={formData.apply_school_holidays}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, apply_school_holidays: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between col-span-2">
                  <div className="space-y-0.5">
                    <Label>Requires Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Needs principal/director approval before activation
                    </p>
                  </div>
                  <Switch
                    checked={formData.requires_approval}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_approval: checked }))}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProfile ? 'Update' : 'Create'} Profile
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {routeProfiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No route profiles created yet</p>
            <p className="text-sm">Create a route profile to define transport demand</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Trips</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routeProfiles.map((profile) => (
                <TableRow 
                  key={profile.id} 
                  className={onSelectProfile ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onSelectProfile?.(profile)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{profile.profile_name}</p>
                      {profile.profile_code && (
                        <p className="text-sm text-muted-foreground">{profile.profile_code}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(profile.trip_category)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {profile.start_time} - {profile.end_time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile.days_of_week?.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(', ')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(profile.valid_from), 'dd MMM')} - {format(new Date(profile.valid_until), 'dd MMM yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {getTripsCount(profile.id)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(profile.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(profile);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(profile.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      {onSelectProfile && (
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
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
