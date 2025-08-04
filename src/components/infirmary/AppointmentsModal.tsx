import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Eye, MapPin, Phone } from "lucide-react";
import { format } from "date-fns";

interface AppointmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for medical appointments
const mockAppointments = [
  {
    id: "APPT-001",
    studentName: "Sarah Thompson",
    class: "Year 8A",
    time: "09:00",
    duration: "30 mins",
    type: "Diabetes Check-up",
    location: "Medical Room",
    attendee: "School Nurse",
    status: "scheduled",
    notes: "Monthly blood sugar monitoring",
    parentRequired: false
  },
  {
    id: "APPT-002",
    studentName: "Michael Chen",
    class: "Year 9C",
    time: "10:30",
    duration: "15 mins", 
    type: "Asthma Review",
    location: "Medical Room",
    attendee: "School Nurse",
    status: "in_progress",
    notes: "Check inhaler technique",
    parentRequired: false
  },
  {
    id: "APPT-003",
    studentName: "Emma Rodriguez",
    class: "Year 7B",
    time: "11:15",
    duration: "45 mins",
    type: "Allergy Assessment",
    location: "Medical Room", 
    attendee: "Visiting Allergist",
    status: "scheduled",
    notes: "Food allergy action plan review",
    parentRequired: true
  },
  {
    id: "APPT-004",
    studentName: "Jack Williams",
    class: "Year 10A",
    time: "13:30",
    duration: "20 mins",
    type: "ADHD Medication Review",
    location: "Medical Room",
    attendee: "School Nurse",
    status: "scheduled",
    notes: "Check medication effectiveness",
    parentRequired: false
  },
  {
    id: "APPT-005",
    studentName: "Isabella Garcia",
    class: "Year 6C",
    time: "15:00",
    duration: "25 mins",
    type: "Epilepsy Follow-up",
    location: "Medical Room",
    attendee: "School Nurse",
    status: "scheduled",
    notes: "Seizure diary review",
    parentRequired: true
  }
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    "scheduled": "bg-blue-100 text-blue-800",
    "in_progress": "bg-yellow-100 text-yellow-800",
    "completed": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800",
    "rescheduled": "bg-purple-100 text-purple-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getTypeColor = (type: string) => {
  if (type.toLowerCase().includes('emergency')) return "bg-red-100 text-red-800";
  if (type.toLowerCase().includes('follow-up') || type.toLowerCase().includes('review')) return "bg-orange-100 text-orange-800";
  if (type.toLowerCase().includes('check-up') || type.toLowerCase().includes('assessment')) return "bg-green-100 text-green-800";
  return "bg-blue-100 text-blue-800";
};

export function AppointmentsModal({ open, onOpenChange }: AppointmentsModalProps) {
  const handleViewDetails = (appointmentId: string) => {
    alert(`View details for appointment ${appointmentId}`);
  };

  const handleReschedule = (appointmentId: string) => {
    alert(`Reschedule appointment ${appointmentId}`);
  };

  const handleContactParent = (studentName: string) => {
    alert(`Contact parent of ${studentName}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Medical Appointments - {format(new Date(), "PPPP")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mockAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{appointment.studentName}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {appointment.class}
                          </Badge>
                          {appointment.parentRequired && (
                            <Badge variant="secondary" className="text-xs">
                              Parent Required
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time} ({appointment.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {appointment.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {appointment.attendee}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(appointment.type)}>
                          {appointment.type}
                        </Badge>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Notes:
                      </p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(appointment.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReschedule(appointment.id)}
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        Reschedule
                      </Button>
                      {appointment.parentRequired && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactParent(appointment.studentName)}
                          className="flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          Contact Parent
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Total appointments: {mockAppointments.length}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}