import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CalendarDays, 
  Search, 
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BookOpen
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: "academic" | "parent-evening" | "sports" | "cultural" | "meeting" | "exam";
  date: string;
  time: string;
  location: string;
  organizer: string;
  capacity?: number;
  registered?: number;
  status: "scheduled" | "completed" | "cancelled" | "postponed";
  description: string;
}

interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  parentName: string;
  studentName: string;
  timeSlot: string;
  teacher: string;
  subject: string;
  status: "confirmed" | "pending" | "cancelled";
  bookedDate: string;
}

const mockEvents: Event[] = [
  {
    id: "EVT-001",
    title: "Year 7 Parent Evening",
    type: "parent-evening",
    date: "2024-01-25",
    time: "16:00-19:00",
    location: "Main Hall",
    organizer: "Mrs. Davis",
    capacity: 200,
    registered: 156,
    status: "scheduled",
    description: "Meet with Year 7 teachers to discuss progress"
  },
  {
    id: "EVT-002", 
    title: "Annual Sports Day",
    type: "sports",
    date: "2024-02-15",
    time: "09:00-15:00",
    location: "Sports Complex",
    organizer: "PE Department",
    capacity: 500,
    registered: 423,
    status: "scheduled",
    description: "Inter-house athletics competition"
  },
  {
    id: "EVT-003",
    title: "Science Fair",
    type: "academic",
    date: "2024-02-20",
    time: "14:00-17:00",
    location: "Science Block",
    organizer: "Dr. Smith",
    capacity: 300,
    registered: 145,
    status: "scheduled",
    description: "Student science project showcase"
  },
  {
    id: "EVT-004",
    title: "Winter Concert",
    type: "cultural",
    date: "2024-01-10",
    time: "19:00-21:00",
    location: "Assembly Hall",
    organizer: "Music Department",
    capacity: 400,
    registered: 380,
    status: "completed",
    description: "Annual winter music performance"
  }
];

const mockBookings: Booking[] = [
  {
    id: "BK-001",
    eventId: "EVT-001",
    eventTitle: "Year 7 Parent Evening",
    parentName: "Mrs. Sarah Thompson",
    studentName: "Emma Thompson",
    timeSlot: "16:30-16:40",
    teacher: "Mr. Johnson",
    subject: "Mathematics",
    status: "confirmed",
    bookedDate: "2024-01-15"
  },
  {
    id: "BK-002",
    eventId: "EVT-001", 
    eventTitle: "Year 7 Parent Evening",
    parentName: "Mr. David Wilson",
    studentName: "James Wilson",
    timeSlot: "17:00-17:10",
    teacher: "Ms. Williams",
    subject: "English",
    status: "confirmed",
    bookedDate: "2024-01-16"
  },
  {
    id: "BK-003",
    eventId: "EVT-001",
    eventTitle: "Year 7 Parent Evening", 
    parentName: "Mrs. Lisa Chen",
    studentName: "Sophie Chen",
    timeSlot: "17:30-17:40",
    teacher: "Dr. Smith",
    subject: "Science",
    status: "pending",
    bookedDate: "2024-01-17"
  }
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events] = useState(mockEvents);
  const [bookings] = useState(mockBookings);

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-primary text-primary-foreground"><Calendar className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case "postponed":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Postponed</Badge>;
    }
  };

  const getTypeBadge = (type: Event["type"]) => {
    const colors = {
      academic: "bg-blue-500 text-white",
      "parent-evening": "bg-purple-500 text-white",
      sports: "bg-green-500 text-white",
      cultural: "bg-pink-500 text-white",
      meeting: "bg-orange-500 text-white",
      exam: "bg-red-500 text-white"
    };
    
    return <Badge className={colors[type]}>{type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</Badge>;
  };

  const getBookingStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === "scheduled").length;
  const totalAttendees = events.reduce((sum, event) => sum + (event.registered || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Calendar & Events</h1>
        <p className="text-muted-foreground">Unified school calendar with academic dates, parent evenings, and booking systems</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold text-primary">{totalEvents}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-3xl font-bold text-warning">{upcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-3xl font-bold text-success">{totalAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed Bookings</p>
                <p className="text-3xl font-bold text-primary">{confirmedBookings}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <span>Event Management</span>
                  </CardTitle>
                  <CardDescription>Schedule and manage school events</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events by title, organizer, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{getTypeBadge(event.type)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.date}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{event.organizer}</TableCell>
                        <TableCell>
                          {event.capacity && event.registered ? (
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{event.registered}/{event.capacity}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Event Bookings</span>
                  </CardTitle>
                  <CardDescription>Manage parent evening and event bookings</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Booking
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Booked Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.eventTitle}</TableCell>
                        <TableCell>{booking.parentName}</TableCell>
                        <TableCell>{booking.studentName}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{booking.timeSlot}</span>
                          </div>
                        </TableCell>
                        <TableCell>{booking.teacher}</TableCell>
                        <TableCell>{booking.subject}</TableCell>
                        <TableCell>{booking.bookedDate}</TableCell>
                        <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Calendar View</span>
              </CardTitle>
              <CardDescription>Visual calendar with all school events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interactive Calendar</h3>
                <p className="text-muted-foreground">Full calendar view with drag-and-drop event management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsPage;