import { useState } from 'react';
import { Video, Users, Calendar, Clock, Settings, Link, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VirtualMeeting {
  id: string;
  title: string;
  description: string;
  scheduled_for: string;
  duration: number;
  meeting_type: 'classroom' | 'parent_teacher' | 'staff_meeting';
  host: string;
  participants: string[];
  meeting_url?: string;
  status: 'scheduled' | 'live' | 'ended';
  recording_available?: boolean;
}

const mockMeetings: VirtualMeeting[] = [
  {
    id: '1',
    title: 'Mathematics Class - Year 10',
    description: 'Algebra and quadratic equations lesson',
    scheduled_for: '2024-01-16T09:00:00Z',
    duration: 60,
    meeting_type: 'classroom',
    host: 'Ms. Johnson',
    participants: ['Year 10A', 'Year 10B'],
    meeting_url: 'https://meet.school.com/math-year10',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Parent-Teacher Conference',
    description: 'Discussion about Emma Smith\'s progress',
    scheduled_for: '2024-01-16T14:30:00Z',
    duration: 30,
    meeting_type: 'parent_teacher',
    host: 'Mr. Davis',
    participants: ['Mr. Smith', 'Mrs. Smith'],
    meeting_url: 'https://meet.school.com/ptc-emma-smith',
    status: 'live'
  },
  {
    id: '3',
    title: 'English Literature - Year 12',
    description: 'Shakespeare\'s Hamlet analysis',
    scheduled_for: '2024-01-15T11:00:00Z',
    duration: 90,
    meeting_type: 'classroom',
    host: 'Dr. Wilson',
    participants: ['Year 12 Literature'],
    status: 'ended',
    recording_available: true
  }
];

const meetingTypeConfig = {
  classroom: { label: 'Virtual Classroom', color: 'bg-blue-500', icon: Video },
  parent_teacher: { label: 'Parent Meeting', color: 'bg-green-500', icon: Users },
  staff_meeting: { label: 'Staff Meeting', color: 'bg-purple-500', icon: Settings }
};

export function VirtualClassroomManager() {
  const [meetings, setMeetings] = useState<VirtualMeeting[]>(mockMeetings);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredMeetings = meetings.filter(meeting => {
    if (activeTab === 'all') return true;
    if (activeTab === 'live') return meeting.status === 'live';
    if (activeTab === 'scheduled') return meeting.status === 'scheduled';
    return meeting.meeting_type === activeTab;
  });

  const joinMeeting = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (meeting?.meeting_url) {
      window.open(meeting.meeting_url, '_blank');
    }
  };

  const MeetingCard = ({ meeting }: { meeting: VirtualMeeting }) => {
    const config = meetingTypeConfig[meeting.meeting_type];
    const IconComponent = config.icon;
    const isUpcoming = new Date(meeting.scheduled_for) > new Date();
    const isLive = meeting.status === 'live';
    
    return (
      <Card className={`mb-4 ${isLive ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" />
              <CardTitle className="text-lg">{meeting.title}</CardTitle>
              <Badge 
                variant={isLive ? 'destructive' : 'secondary'}
                className={isLive ? 'animate-pulse' : ''}
              >
                {meeting.status === 'live' ? 'LIVE' : meeting.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              {isLive && (
                <Button 
                  size="sm" 
                  onClick={() => joinMeeting(meeting.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Join Live
                </Button>
              )}
              {meeting.status === 'scheduled' && isUpcoming && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => joinMeeting(meeting.id)}
                >
                  <Link className="h-4 w-4 mr-1" />
                  Join
                </Button>
              )}
              {meeting.recording_available && (
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-1" />
                  View Recording
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(meeting.scheduled_for).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(meeting.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>{meeting.duration} min</div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {meeting.participants.length} participants
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">{meeting.description}</p>
          <div className="text-xs text-muted-foreground">
            Host: {meeting.host} | Type: {config.label}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreateMeetingDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Video className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Virtual Meeting</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input id="title" placeholder="Enter meeting title" />
            </div>
            <div>
              <Label htmlFor="type">Meeting Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">Virtual Classroom</SelectItem>
                  <SelectItem value="parent_teacher">Parent-Teacher Meeting</SelectItem>
                  <SelectItem value="staff_meeting">Staff Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Meeting description" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" type="number" placeholder="60" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="participants">Participants</Label>
            <Input id="participants" placeholder="Enter participant emails or groups" />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const liveCount = meetings.filter(m => m.status === 'live').length;
  const scheduledCount = meetings.filter(m => m.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6" />
          Virtual Classrooms
        </h2>
        <div className="flex items-center gap-2">
          {liveCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {liveCount} Live
            </Badge>
          )}
          <Badge variant="secondary">
            {scheduledCount} Scheduled
          </Badge>
          <CreateMeetingDialog />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live ({liveCount})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="classroom">Classrooms</TabsTrigger>
          <TabsTrigger value="parent_teacher">Parent Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No meetings found</p>
            </div>
          ) : (
            filteredMeetings.map(meeting => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}