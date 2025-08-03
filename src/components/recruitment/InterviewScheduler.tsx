import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, Clock, Video, MapPin, 
  Users, Phone, Plus, Edit, Trash2, CheckCircle 
} from 'lucide-react';
import { format } from 'date-fns';

export function InterviewScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock interview data
  const interviews = [
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      position: 'Senior Mathematics Teacher',
      date: '2024-01-22',
      time: '10:00',
      duration: 60,
      type: 'video',
      status: 'scheduled',
      interviewers: ['Dr. Smith', 'Ms. Williams'],
      location: 'Virtual - Teams',
      stage: 'Technical Interview'
    },
    {
      id: '2',
      candidateName: 'Michael Brown',
      position: 'History Teacher',
      date: '2024-01-23',
      time: '14:30',
      duration: 45,
      type: 'in-person',
      status: 'completed',
      interviewers: ['Mr. Davis'],
      location: 'School Office - Room 201',
      stage: 'Initial Interview'
    }
  ];

  const interviewQuestions = [
    {
      category: 'Teaching Philosophy',
      questions: [
        'How do you approach differentiated learning?',
        'Describe your classroom management style',
        'How do you handle challenging students?'
      ]
    },
    {
      category: 'Subject Expertise',
      questions: [
        'How do you make complex concepts accessible?',
        'What assessment methods do you prefer?',
        'How do you stay current with curriculum changes?'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interview Management</h2>
          <p className="text-muted-foreground">
            Schedule and manage candidate interviews
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Set up a new interview for a candidate
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidate">Candidate</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Senior Mathematics Teacher</SelectItem>
                    <SelectItem value="history">History Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interview Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input type="number" placeholder="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Interview Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="interviewers">Interviewers</Label>
                <Input placeholder="Enter interviewer names (comma separated)" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="location">Location/Meeting Link</Label>
                <Input placeholder="Meeting room or video call link" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea placeholder="Additional notes or preparation instructions" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Schedule Interview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Question Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {interviews.filter(i => i.status !== 'completed').map((interview) => (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{interview.candidateName}</CardTitle>
                      <CardDescription>{interview.position}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.date} at {interview.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getTypeIcon(interview.type)}
                    <span>{interview.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.interviewers.join(', ')}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Join Interview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {interviews.filter(i => i.status === 'completed').map((interview) => (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{interview.candidateName}</CardTitle>
                      <CardDescription>{interview.position}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(interview.status)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {interview.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.date} at {interview.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.interviewers.join(', ')}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm">
                      View Notes
                    </Button>
                    <Button variant="outline" size="sm">
                      View Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {interviewQuestions.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>Common interview questions for this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.questions.map((question, qIndex) => (
                    <div key={qIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{question}</span>
                      <Button variant="outline" size="sm">
                        Use in Interview
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}