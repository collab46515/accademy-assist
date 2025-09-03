import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send, Clock, Users, FileText, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { useCommunicationData, Communication, CommunicationTemplate } from '@/hooks/useCommunicationData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface CommunicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingCommunication?: Communication | null;
  selectedTemplate?: CommunicationTemplate | null;
}

const CommunicationForm: React.FC<CommunicationFormProps> = ({
  isOpen,
  onClose,
  editingCommunication,
  selectedTemplate
}) => {
  const { createCommunication, updateCommunication, isSubmitting } = useCommunicationData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    communication_type: 'announcement',
    priority: 'normal',
    audience_type: 'entire_school',
    audience_details: {},
    tags: [] as string[],
    scheduled_for: null as Date | null,
    is_scheduled: false
  });

  const [currentTag, setCurrentTag] = useState('');
  const [audienceDetails, setAudienceDetails] = useState({
    year_groups: [] as string[],
    class_ids: [] as string[],
    teacher_ids: [] as string[],
    student_ids: [] as string[],
    parent_ids: [] as string[],
    departments: [] as string[]
  });

  useEffect(() => {
    if (editingCommunication) {
      setFormData({
        title: editingCommunication.title,
        content: editingCommunication.content,
        communication_type: editingCommunication.communication_type,
        priority: editingCommunication.priority,
        audience_type: editingCommunication.audience_type,
        audience_details: editingCommunication.audience_details || {},
        tags: editingCommunication.tags || [],
        scheduled_for: editingCommunication.scheduled_for ? new Date(editingCommunication.scheduled_for) : null,
        is_scheduled: !!editingCommunication.scheduled_for
      });
      setAudienceDetails({
        year_groups: [],
        class_ids: [],
        teacher_ids: [],
        student_ids: [],
        parent_ids: [],
        departments: [],
        ...(typeof editingCommunication.audience_details === 'object' ? editingCommunication.audience_details : {})
      });
    } else if (selectedTemplate) {
      setFormData({
        title: selectedTemplate.subject_template,
        content: selectedTemplate.content_template,
        communication_type: selectedTemplate.template_type,
        priority: selectedTemplate.default_priority,
        audience_type: selectedTemplate.default_audience_type || 'entire_school',
        audience_details: {},
        tags: selectedTemplate.tags || [],
        scheduled_for: null,
        is_scheduled: false
      });
    } else {
      // Reset form
      setFormData({
        title: '',
        content: '',
        communication_type: 'announcement',
        priority: 'normal',
        audience_type: 'entire_school',
        audience_details: {},
        tags: [],
        scheduled_for: null,
        is_scheduled: false
      });
      setAudienceDetails({
        year_groups: [],
        class_ids: [],
        teacher_ids: [],
        student_ids: [],
        parent_ids: [],
        departments: []
      });
    }
  }, [editingCommunication, selectedTemplate, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAudienceDetailChange = (field: string, value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setAudienceDetails(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (action: 'save_draft' | 'submit_for_approval' | 'send_now') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create communications.",
          variant: "destructive"
        });
        return;
      }

      const communicationData = {
        ...formData,
        audience_details: audienceDetails,
        status: action === 'save_draft' ? 'draft' : 
               action === 'submit_for_approval' ? 'pending_approval' : 'sent',
        sent_at: action === 'send_now' ? new Date().toISOString() : undefined,
        scheduled_for: formData.is_scheduled && formData.scheduled_for ? 
                      formData.scheduled_for.toISOString() : undefined,
        created_by: user.id
      };

      if (editingCommunication) {
        await updateCommunication(editingCommunication.id, communicationData);
        toast({
          title: "Communication Updated",
          description: "Communication has been updated successfully."
        });
      } else {
        await createCommunication(communicationData);
        toast({
          title: "Communication Created",
          description: `Communication has been ${action === 'save_draft' ? 'saved as draft' : 'submitted for approval'}.`
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving communication:', error);
      toast({
        title: "Error",
        description: "Failed to save communication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderAudienceSelector = () => {
    switch (formData.audience_type) {
      case 'year_groups':
        return (
          <div className="space-y-2">
            <Label>Year Groups (comma separated)</Label>
            <Input
              placeholder="e.g., Year 7, Year 8, Year 9"
              value={audienceDetails.year_groups.join(', ')}
              onChange={(e) => handleAudienceDetailChange('year_groups', e.target.value)}
            />
          </div>
        );
      case 'specific_classes':
        return (
          <div className="space-y-2">
            <Label>Class IDs (comma separated)</Label>
            <Input
              placeholder="e.g., 7A, 7B, 8C"
              value={audienceDetails.class_ids.join(', ')}
              onChange={(e) => handleAudienceDetailChange('class_ids', e.target.value)}
            />
          </div>
        );
      case 'specific_teachers':
        return (
          <div className="space-y-2">
            <Label>Teacher Names/IDs (comma separated)</Label>
            <Input
              placeholder="e.g., John Smith, Jane Doe"
              value={audienceDetails.teacher_ids.join(', ')}
              onChange={(e) => handleAudienceDetailChange('teacher_ids', e.target.value)}
            />
          </div>
        );
      case 'departments':
        return (
          <div className="space-y-2">
            <Label>Departments (comma separated)</Label>
            <Input
              placeholder="e.g., Mathematics, English, Science"
              value={audienceDetails.departments.join(', ')}
              onChange={(e) => handleAudienceDetailChange('departments', e.target.value)}
            />
          </div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            This will be sent to everyone in the school.
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingCommunication ? 'Edit Communication' : 'Create New Communication'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Communication title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Communication Type</Label>
                <Select
                  value={formData.communication_type}
                  onValueChange={(value) => handleInputChange('communication_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="emergency_alert">Emergency Alert</SelectItem>
                    <SelectItem value="event_notification">Event Notification</SelectItem>
                    <SelectItem value="academic_update">Academic Update</SelectItem>
                    <SelectItem value="administrative_notice">Administrative Notice</SelectItem>
                    <SelectItem value="parent_communication">Parent Communication</SelectItem>
                    <SelectItem value="staff_memo">Staff Memo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter your communication content..."
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Audience Type</Label>
                  <Select
                    value={formData.audience_type}
                    onValueChange={(value) => handleInputChange('audience_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entire_school">Entire School</SelectItem>
                      <SelectItem value="year_groups">Specific Year Groups</SelectItem>
                      <SelectItem value="specific_classes">Specific Classes</SelectItem>
                      <SelectItem value="specific_teachers">Specific Teachers</SelectItem>
                      <SelectItem value="specific_parents">Specific Parents</SelectItem>
                      <SelectItem value="specific_students">Specific Students</SelectItem>
                      <SelectItem value="departments">Departments</SelectItem>
                      <SelectItem value="custom_list">Custom List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderAudienceSelector()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduling Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_scheduled"
                    checked={formData.is_scheduled}
                    onCheckedChange={(checked) => handleInputChange('is_scheduled', checked)}
                  />
                  <Label htmlFor="is_scheduled">Schedule for later</Label>
                </div>

                {formData.is_scheduled && (
                  <div className="space-y-2">
                    <Label>Scheduled Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !formData.scheduled_for && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.scheduled_for ? format(formData.scheduled_for, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.scheduled_for}
                          onSelect={(date) => handleInputChange('scheduled_for', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit('save_draft')}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            
            <Button
              variant="default"
              onClick={() => handleSubmit('submit_for_approval')}
              disabled={isSubmitting}
            >
              Submit for Approval
            </Button>
            
            {editingCommunication?.status === 'approved' && (
              <Button
                onClick={() => handleSubmit('send_now')}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => {
                if (formData.is_scheduled && formData.scheduled_for) {
                  handleSubmit('submit_for_approval');
                  toast({
                    title: "Communication Scheduled",
                    description: `Communication has been scheduled for ${formData.scheduled_for.toLocaleDateString()}`,
                  });
                } else {
                  toast({
                    title: "Schedule Required",
                    description: "Please set a scheduled date and time to schedule this communication.",
                    variant: "destructive"
                  });
                }
              }}
              disabled={isSubmitting}
            >
              Schedule Communication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationForm;