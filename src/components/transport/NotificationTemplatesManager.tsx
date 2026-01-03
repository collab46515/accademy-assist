import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Mail, MessageSquare, Bell, CheckCircle } from 'lucide-react';
import { useTransportNotifications } from '@/hooks/useTransportNotifications';
import { useRBAC } from '@/hooks/useRBAC';

const EVENT_TRIGGERS = [
  { value: 'trip_start', label: 'Trip Started' },
  { value: 'trip_end', label: 'Trip Ended' },
  { value: 'student_board', label: 'Student Boarded' },
  { value: 'student_alight', label: 'Student Dropped Off' },
  { value: 'delay', label: 'Trip Delayed' },
  { value: 'breakdown', label: 'Vehicle Breakdown' },
  { value: 'accident', label: 'Accident' },
  { value: 'sos', label: 'SOS Emergency' },
  { value: 'arrival_soon', label: 'Arriving Soon' },
  { value: 'no_show', label: 'Student No Show' },
  { value: 'route_change', label: 'Route Changed' },
  { value: 'driver_change', label: 'Driver Changed' }
];

const TEMPLATE_TYPES = [
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'push', label: 'Push Notification', icon: Bell }
];

export const NotificationTemplatesManager = () => {
  const { currentSchool } = useRBAC();
  const schoolId = currentSchool?.id || null;
  const { templates, loading, addTemplate, updateTemplate, deleteTemplate } = useTransportNotifications(schoolId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    template_name: '',
    template_type: 'sms',
    event_trigger: 'trip_start',
    subject_template: '',
    body_template: '',
    send_to_parent: true,
    send_to_admin: false,
    send_to_driver: false,
    is_active: true
  });

  const handleSubmit = async () => {
    if (!schoolId) return;
    
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData);
      } else {
        await addTemplate({ ...formData, school_id: schoolId });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving template:', err);
    }
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      template_name: template.template_name,
      template_type: template.template_type,
      event_trigger: template.event_trigger,
      subject_template: template.subject_template || '',
      body_template: template.body_template,
      send_to_parent: template.send_to_parent,
      send_to_admin: template.send_to_admin,
      send_to_driver: template.send_to_driver,
      is_active: template.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({
      template_name: '',
      template_type: 'sms',
      event_trigger: 'trip_start',
      subject_template: '',
      body_template: '',
      send_to_parent: true,
      send_to_admin: false,
      send_to_driver: false,
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
          <h3 className="text-lg font-semibold">Notification Templates</h3>
          <p className="text-sm text-muted-foreground">Create templates for automated transport notifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create Template'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    value={formData.template_name}
                    onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                    placeholder="e.g., Trip Start Alert"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select value={formData.template_type} onValueChange={(v) => setFormData({ ...formData, template_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Trigger</Label>
                <Select value={formData.event_trigger} onValueChange={(v) => setFormData({ ...formData, event_trigger: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TRIGGERS.map(trigger => (
                      <SelectItem key={trigger.value} value={trigger.value}>{trigger.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.template_type === 'email' && (
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject_template}
                    onChange={(e) => setFormData({ ...formData, subject_template: e.target.value })}
                    placeholder="e.g., {{student_name}}'s bus has departed"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Message Body</Label>
                <Textarea
                  value={formData.body_template}
                  onChange={(e) => setFormData({ ...formData, body_template: e.target.value })}
                  placeholder="Use {{variable}} for dynamic content"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Variables: {'{{student_name}}, {{trip_name}}, {{driver_name}}, {{vehicle_number}}, {{time}}, {{stop_name}}'}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Send To</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.send_to_parent}
                      onCheckedChange={(v) => setFormData({ ...formData, send_to_parent: v })}
                    />
                    <span className="text-sm">Parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.send_to_admin}
                      onCheckedChange={(v) => setFormData({ ...formData, send_to_admin: v })}
                    />
                    <span className="text-sm">Admins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.send_to_driver}
                      onCheckedChange={(v) => setFormData({ ...formData, send_to_driver: v })}
                    />
                    <span className="text-sm">Drivers</span>
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
                  {editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notification templates created yet</p>
            <p className="text-sm mt-1">Create templates to automate parent notifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => {
            const TypeIcon = TEMPLATE_TYPES.find(t => t.value === template.template_type)?.icon || Bell;
            return (
              <Card key={template.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{template.template_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {EVENT_TRIGGERS.find(t => t.value === template.event_trigger)?.label}
                        </p>
                      </div>
                    </div>
                    <Badge variant={template.is_active ? 'default' : 'secondary'}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.body_template}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    {template.send_to_parent && (
                      <Badge variant="outline" className="text-xs">Parents</Badge>
                    )}
                    {template.send_to_admin && (
                      <Badge variant="outline" className="text-xs">Admins</Badge>
                    )}
                    {template.send_to_driver && (
                      <Badge variant="outline" className="text-xs">Drivers</Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
