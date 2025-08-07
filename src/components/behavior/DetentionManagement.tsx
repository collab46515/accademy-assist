import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Search, 
  Clock, 
  Calendar as CalendarIcon,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

export function DetentionManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState('all');

  const detentions = [
    {
      id: 1,
      student: 'Alex Thompson',
      studentId: 'STU001',
      class: '11A',
      date: '2024-01-16',
      time: '15:30',
      duration: 60,
      type: 'After School',
      supervisor: 'Mr. Johnson',
      room: 'Room 15',
      reason: 'Repeated tardiness to morning registration',
      status: 'Scheduled',
      notes: 'Third late arrival this week. Student to complete reflection worksheet.'
    },
    {
      id: 2,
      student: 'Jessica Lee',
      studentId: 'STU002',
      class: '9B',
      date: '2024-01-17',
      time: '15:30',
      duration: 30,
      type: 'After School',
      supervisor: 'Ms. Williams',
      room: 'Room 8',
      reason: 'Homework not completed for third consecutive lesson',
      status: 'Scheduled',
      notes: 'Use detention time to complete outstanding homework tasks.'
    },
    {
      id: 3,
      student: 'Marcus Brown',
      studentId: 'STU003',
      class: '10C',
      date: '2024-01-15',
      time: '13:00',
      duration: 45,
      type: 'Lunch',
      supervisor: 'Mrs. Davis',
      room: 'Room 22',
      reason: 'Disruptive behavior in Science lesson',
      status: 'Completed',
      notes: 'Student attended detention and completed reflection activity. Showed good understanding of expectations.'
    },
    {
      id: 4,
      student: 'Sophie Wilson',
      studentId: 'STU004',
      class: '8A',
      date: '2024-01-14',
      time: '15:30',
      duration: 30,
      type: 'After School',
      supervisor: 'Mr. Taylor',
      room: 'Room 5',
      reason: 'Mobile phone use during lesson',
      status: 'No Show',
      notes: 'Student failed to attend scheduled detention. Follow-up required.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'No Show': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'After School': return 'bg-orange-100 text-orange-800';
      case 'Lunch': return 'bg-yellow-100 text-yellow-800';
      case 'Break': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDetentions = detentions.filter(detention => {
    const matchesSearch = detention.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         detention.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         detention.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || detention.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const todayDetentions = detentions.filter(d => d.date === '2024-01-16' && d.status === 'Scheduled');
  const upcomingDetentions = detentions.filter(d => new Date(d.date) > new Date('2024-01-16') && d.status === 'Scheduled');

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detention Management</h2>
          <p className="text-muted-foreground">Schedule and track student detentions</p>
        </div>
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Detention
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Detention</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stu001">Alex Thompson (11A)</SelectItem>
                    <SelectItem value="stu002">Jessica Lee (9B)</SelectItem>
                    <SelectItem value="stu003">Marcus Brown (10C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Detention Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after-school">After School</SelectItem>
                    <SelectItem value="lunch">Lunch Time</SelectItem>
                    <SelectItem value="break">Break Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
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
                <Label>Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="13:00">13:00 (Lunch)</SelectItem>
                    <SelectItem value="13:30">13:30 (Lunch)</SelectItem>
                    <SelectItem value="15:30">15:30 (After School)</SelectItem>
                    <SelectItem value="16:00">16:00 (After School)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supervising Teacher</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr-johnson">Mr. Johnson</SelectItem>
                    <SelectItem value="ms-williams">Ms. Williams</SelectItem>
                    <SelectItem value="mrs-davis">Mrs. Davis</SelectItem>
                    <SelectItem value="mr-taylor">Mr. Taylor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Input placeholder="e.g. Room 15" />
              </div>
              <div className="space-y-2">
                <Label>Reason for Detention</Label>
                <Textarea placeholder="Describe the reason for this detention..." />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Additional Notes</Label>
                <Textarea placeholder="Any additional instructions or requirements..." rows={2} />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowScheduleDialog(false)}>
                  Schedule Detention
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Detentions</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayDetentions.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDetentions.length}</div>
            <p className="text-xs text-muted-foreground">Rest of the week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Shows This Month</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Require follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search detentions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="No Show">No Show</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Detentions List */}
      <div className="space-y-4">
        {filteredDetentions.map((detention) => (
          <Card key={detention.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{detention.student}</h3>
                    <Badge variant="outline">{detention.class}</Badge>
                    <Badge className={getStatusColor(detention.status)}>
                      {detention.status}
                    </Badge>
                    <Badge className={getTypeColor(detention.type)}>
                      {detention.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {detention.date} at {detention.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {detention.duration} minutes
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {detention.supervisor}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {detention.room}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Reason: </span>
                      {detention.reason}
                    </div>
                    {detention.notes && (
                      <div>
                        <span className="font-medium">Notes: </span>
                        {detention.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {detention.status === 'Scheduled' && (
                    <>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Mark No Show
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDetentions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No detentions found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'No detentions have been scheduled yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}