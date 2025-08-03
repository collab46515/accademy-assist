import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarDays, Plus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface FeeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'due_date' | 'reminder' | 'late_fee' | 'payment_plan' | 'discount_deadline';
  feeType: string;
  amount?: number;
  status: 'upcoming' | 'today' | 'overdue' | 'completed';
  studentsAffected: number;
  priority: 'low' | 'medium' | 'high';
}

const MOCK_FEE_EVENTS: FeeEvent[] = [
  {
    id: '1',
    title: 'Tuition Fee Due',
    description: 'Second term tuition fees are due',
    date: '2024-02-01',
    type: 'due_date',
    feeType: 'Tuition Fee',
    amount: 1500,
    status: 'upcoming',
    studentsAffected: 450,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Payment Reminder',
    description: 'Send reminder for overdue transport fees',
    date: '2024-01-25',
    type: 'reminder',
    feeType: 'Transport Fee',
    amount: 300,
    status: 'today',
    studentsAffected: 23,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Early Payment Discount Deadline',
    description: 'Last day for 5% early payment discount',
    date: '2024-01-31',
    type: 'discount_deadline',
    feeType: 'All Fees',
    status: 'upcoming',
    studentsAffected: 200,
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Late Fee Application',
    description: 'Late fees will be applied to overdue accounts',
    date: '2024-02-05',
    type: 'late_fee',
    feeType: 'All Overdue Fees',
    amount: 50,
    status: 'upcoming',
    studentsAffected: 45,
    priority: 'high'
  },
  {
    id: '5',
    title: 'Monthly Payment Plan Due',
    description: 'Monthly installment payment due',
    date: '2024-01-28',
    type: 'payment_plan',
    feeType: 'Payment Plan',
    amount: 450,
    status: 'upcoming',
    studentsAffected: 89,
    priority: 'medium'
  },
  {
    id: '6',
    title: 'Examination Fee Due',
    description: 'GCSE and A-Level examination fees due',
    date: '2024-02-15',
    type: 'due_date',
    feeType: 'Examination Fee',
    amount: 200,
    status: 'upcoming',
    studentsAffected: 120,
    priority: 'high'
  }
];

export const FeeCalendar = () => {
  const [events, setEvents] = useState<FeeEvent[]>(MOCK_FEE_EVENTS);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary text-primary-foreground';
      case 'today': return 'bg-warning text-warning-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'due_date': return CalendarDays;
      case 'reminder': return Clock;
      case 'late_fee': return AlertTriangle;
      case 'payment_plan': return Calendar;
      case 'discount_deadline': return CheckCircle;
      default: return Calendar;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-destructive';
      case 'medium': return 'border-l-4 border-l-warning';
      case 'low': return 'border-l-4 border-l-success';
      default: return '';
    }
  };

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
  const todayEvents = events.filter(event => event.status === 'today').length;
  const overdueEvents = events.filter(event => event.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Calendar</h1>
          <p className="text-muted-foreground">Track important fee dates, deadlines, and reminders</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Fee Calendar Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input id="event-title" placeholder="e.g., Tuition Fee Due" />
                </div>
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" placeholder="Event description..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due_date">Due Date</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="late_fee">Late Fee</SelectItem>
                      <SelectItem value="payment_plan">Payment Plan</SelectItem>
                      <SelectItem value="discount_deadline">Discount Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fee-type">Fee Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fee</SelectItem>
                      <SelectItem value="transport">Transport Fee</SelectItem>
                      <SelectItem value="meals">Meals Fee</SelectItem>
                      <SelectItem value="examination">Examination Fee</SelectItem>
                      <SelectItem value="all">All Fees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Events</p>
                <p className="text-2xl font-bold">{todayEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">{upcomingEvents}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Events</p>
                <p className="text-2xl font-bold">{overdueEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Fee Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEvents.map((event) => {
              const IconComponent = getTypeIcon(event.type);
              const isToday = new Date(event.date).toDateString() === new Date().toDateString();
              const isPast = new Date(event.date) < new Date() && !isToday;
              
              return (
                <div
                  key={event.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border ${getPriorityColor(event.priority)} ${
                    isToday ? 'bg-warning/10' : isPast ? 'bg-muted/50' : 'bg-card'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isToday ? 'bg-warning text-warning-foreground' : 
                    isPast ? 'bg-muted text-muted-foreground' : 
                    'bg-primary text-primary-foreground'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        {isToday && <Badge className="mt-1 bg-warning text-warning-foreground">Today</Badge>}
                        {isPast && <Badge className="mt-1 bg-muted text-muted-foreground">Past</Badge>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Fee Type: {event.feeType}</span>
                        {event.amount && <span>Amount: £{event.amount.toLocaleString()}</span>}
                        <span>Students: {event.studentsAffected}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`
                          ${event.priority === 'high' ? 'border-destructive text-destructive' : ''}
                          ${event.priority === 'medium' ? 'border-warning text-warning' : ''}
                          ${event.priority === 'low' ? 'border-success text-success' : ''}
                        `}>
                          {event.priority} priority
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-warning">Today's Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events.filter(e => e.status === 'today').map(event => (
                <div key={event.id} className="text-sm">
                  <span className="font-medium">{event.title}</span>
                  <br />
                  <span className="text-muted-foreground">{event.studentsAffected} students</span>
                </div>
              ))}
              {todayEvents === 0 && (
                <p className="text-sm text-muted-foreground">No events scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events.filter(e => e.priority === 'high').slice(0, 3).map(event => (
                <div key={event.id} className="text-sm">
                  <span className="font-medium">{event.title}</span>
                  <br />
                  <span className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events.filter(e => {
                const eventDate = new Date(e.date);
                const today = new Date();
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return eventDate >= today && eventDate <= weekFromNow;
              }).slice(0, 3).map(event => (
                <div key={event.id} className="text-sm">
                  <span className="font-medium">{event.title}</span>
                  <br />
                  <span className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};