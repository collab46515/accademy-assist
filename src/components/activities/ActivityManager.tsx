import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  name: string;
  category: "sports" | "arts" | "academic" | "service" | "duke-of-edinburgh";
  instructor: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: "active" | "full" | "cancelled" | "completed";
  cost?: number;
  description: string;
  requirements: string[];
  created_at: string;
}

export function ActivityManager() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Football Club',
      category: 'sports',
      instructor: 'Mr. Johnson',
      schedule: 'Wednesday 15:30-16:30',
      location: 'Sports Field',
      capacity: 25,
      enrolled: 22,
      status: 'active',
      description: 'Develop football skills and teamwork through training and matches.',
      requirements: ['Football boots', 'Sports kit'],
      created_at: '2024-01-01T00:00:00Z'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'sports' as Activity['category'],
    instructor: '',
    schedule: '',
    location: '',
    capacity: 20,
    cost: 0,
    description: '',
    requirements: ''
  });

  const categories = [
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts' },
    { value: 'academic', label: 'Academic' },
    { value: 'service', label: 'Service' },
    { value: 'duke-of-edinburgh', label: 'Duke of Edinburgh' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'sports',
      instructor: '',
      schedule: '',
      location: '',
      capacity: 20,
      cost: 0,
      description: '',
      requirements: ''
    });
    setEditingActivity(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      category: activity.category,
      instructor: activity.instructor,
      schedule: activity.schedule,
      location: activity.location,
      capacity: activity.capacity,
      cost: activity.cost || 0,
      description: activity.description,
      requirements: activity.requirements.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.instructor || !formData.schedule) {
      toast.error('Please fill in required fields');
      return;
    }

    const activityData: Activity = {
      id: editingActivity?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      instructor: formData.instructor,
      schedule: formData.schedule,
      location: formData.location,
      capacity: formData.capacity,
      enrolled: editingActivity?.enrolled || 0,
      status: 'active',
      cost: formData.cost > 0 ? formData.cost : undefined,
      description: formData.description,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
      created_at: editingActivity?.created_at || new Date().toISOString()
    };

    if (editingActivity) {
      setActivities(prev => prev.map(activity => 
        activity.id === editingActivity.id ? activityData : activity
      ));
      toast.success('Activity updated successfully');
    } else {
      setActivities(prev => [...prev, activityData]);
      toast.success('Activity added successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities(prev => prev.filter(activity => activity.id !== id));
      toast.success('Activity deleted successfully');
    }
  };

  const getCategoryBadge = (category: Activity["category"]) => {
    const colors = {
      sports: "bg-blue-500 text-white",
      arts: "bg-purple-500 text-white",
      academic: "bg-green-500 text-white",
      service: "bg-orange-500 text-white",
      "duke-of-edinburgh": "bg-red-500 text-white"
    };
    
    return <Badge className={colors[category]}>{category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</Badge>;
  };

  const getStatusBadge = (status: Activity["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "full":
        return <Badge className="bg-warning text-warning-foreground">Full</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Activity Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Activity Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Football Club"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value: Activity['category']) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="e.g., Mr. Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule *</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="e.g., Wednesday 15:30-16:30"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Sports Field"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost (£)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    placeholder="0 for free"
                  />
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                  <Input
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="e.g., Football boots, Sports kit"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the activity and its benefits"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingActivity ? 'Update' : 'Add'} Activity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{activity.name}</h3>
                    {getCategoryBadge(activity.category)}
                    {getStatusBadge(activity.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activity.instructor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.schedule}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Enrollment:</span> {activity.enrolled}/{activity.capacity}
                      {activity.cost && <span className="ml-4 font-medium">Cost: £{activity.cost}</span>}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                  )}

                  {activity.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No activities created yet. Click "Add Activity" to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}