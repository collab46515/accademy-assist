import { useState } from 'react';
import { Plus, Edit, Trash2, Send, Users, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface AnnouncementDraft {
  id?: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_audience: string[];
  expires_at?: string;
  schedule_for?: string;
}

const audienceOptions = [
  { id: 'all', label: 'All Users' },
  { id: 'students', label: 'Students' },
  { id: 'parents', label: 'Parents' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'staff', label: 'Staff' },
  { id: 'year_7', label: 'Year 7' },
  { id: 'year_8', label: 'Year 8' },
  { id: 'year_9', label: 'Year 9' },
  { id: 'year_10', label: 'Year 10' },
  { id: 'year_11', label: 'Year 11' },
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-blue-500' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

export function AnnouncementsManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<AnnouncementDraft>({
    title: '',
    content: '',
    priority: 'medium',
    target_audience: [],
  });
  const { toast } = useToast();

  const handleSubmit = (action: 'draft' | 'schedule' | 'publish') => {
    const requiredFields = ['title', 'content'];
    const missingFields = requiredFields.filter(field => !currentDraft[field as keyof AnnouncementDraft]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (currentDraft.target_audience.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please select at least one target audience",
        variant: "destructive"
      });
      return;
    }

    let message = '';
    switch (action) {
      case 'draft':
        message = 'Announcement saved as draft';
        break;
      case 'schedule':
        message = 'Announcement scheduled successfully';
        break;
      case 'publish':
        message = 'Announcement published successfully';
        break;
    }

    toast({
      title: "Success",
      description: message,
    });

    setIsCreateDialogOpen(false);
    setCurrentDraft({
      title: '',
      content: '',
      priority: 'medium',
      target_audience: [],
    });
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    setCurrentDraft(prev => ({
      ...prev,
      target_audience: checked 
        ? [...prev.target_audience, audienceId]
        : prev.target_audience.filter(id => id !== audienceId)
    }));
  };

  const getEstimatedReach = () => {
    // Mock calculation based on selected audience
    if (currentDraft.target_audience.includes('all')) return '1,200+ users';
    
    let reach = 0;
    currentDraft.target_audience.forEach(audience => {
      if (audience === 'students') reach += 800;
      else if (audience === 'parents') reach += 600;
      else if (audience === 'teachers') reach += 50;
      else if (audience === 'staff') reach += 30;
      else if (audience.startsWith('year_')) reach += 120;
    });
    
    return `${reach}+ users`;
  };

  const CreateAnnouncementDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Announcement Title *</Label>
            <Input
              id="title"
              value={currentDraft.title}
              onChange={(e) => setCurrentDraft(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={currentDraft.content}
              onChange={(e) => setCurrentDraft(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your announcement content here..."
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={currentDraft.priority}
                onValueChange={(value) => setCurrentDraft(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expires">Expiry Date (Optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={currentDraft.expires_at || ''}
                onChange={(e) => setCurrentDraft(prev => ({ ...prev, expires_at: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Target Audience *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {audienceOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={currentDraft.target_audience.includes(option.id)}
                    onCheckedChange={(checked) => handleAudienceChange(option.id, !!checked)}
                  />
                  <Label htmlFor={option.id} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {currentDraft.target_audience.length > 0 && (
            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Estimated reach: <span className="font-medium">{getEstimatedReach()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="schedule">Schedule for Later (Optional)</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={currentDraft.schedule_for || ''}
              onChange={(e) => setCurrentDraft(prev => ({ ...prev, schedule_for: e.target.value }))}
            />
          </div>

          {currentDraft.priority === 'urgent' && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  Urgent announcements will send push notifications to all users
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSubmit('draft')}>
              Save Draft
            </Button>
            {currentDraft.schedule_for && (
              <Button onClick={() => handleSubmit('schedule')}>
                <Clock className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            )}
            <Button onClick={() => handleSubmit('publish')}>
              <Send className="h-4 w-4 mr-1" />
              Publish Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Announcements Management</h2>
        <CreateAnnouncementDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Read Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Pending publication</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['School Closure - Snow Day', 'Parent-Teacher Conference Schedule', 'Library New Book Collection'].map((title, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'destructive' : 'secondary'}>
                    {index === 0 ? 'Urgent' : 'Medium'}
                  </Badge>
                  <span className="font-medium">{title}</span>
                  <span className="text-sm text-muted-foreground">
                    {index === 0 ? '15 min ago' : index === 1 ? '2 hours ago' : '1 day ago'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}