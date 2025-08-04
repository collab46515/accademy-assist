import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  AlertTriangle,
  Clock,
  Target,
  MessageSquare
} from "lucide-react";

// Mock data for complaint details
const mockComplaintDetails = {
  id: "COMP-2024-0001",
  title: "Late Bus Service",
  description: "The school bus has been consistently arriving 15-20 minutes late for the past two weeks, causing students to be late for first period. This is affecting my child's attendance record and academic performance.",
  complaint_type: "transport",
  priority: "medium",
  status: "open",
  complainant_name: "Sarah Johnson",
  complainant_email: "sarah.johnson@email.com",
  complainant_phone: "+44 123 456 7890",
  complainant_relationship: "parent",
  student_involved: "Emma Johnson (Year 7)",
  incident_date: "2024-01-15",
  location: "Bus Stop - Maple Street",
  desired_outcome: "Ensure bus arrives on time consistently or provide alternative transport arrangements",
  anonymous: false,
  submitted_at: "2024-01-15T09:30:00Z",
  assigned_to: "Transport Manager",
  target_resolution_date: "2024-01-22",
  actions_taken: [
    {
      date: "2024-01-15T10:00:00Z",
      action: "Complaint received and logged",
      taken_by: "Reception Team"
    },
    {
      date: "2024-01-15T14:30:00Z", 
      action: "Assigned to Transport Manager for investigation",
      taken_by: "Admin Team"
    }
  ],
  communications: [
    {
      date: "2024-01-16T09:00:00Z",
      type: "email",
      direction: "outgoing",
      summary: "Acknowledgment email sent to complainant",
      participants: ["sarah.johnson@email.com"]
    }
  ]
};

interface ComplaintDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintId?: string;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  open,
  onOpenChange,
  complaintId
}) => {
  const complaint = mockComplaintDetails; // In real app, fetch by complaintId

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Complaint Details - {complaint.id}
          </DialogTitle>
          <DialogDescription>
            Complete information about this complaint case
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={getPriorityColor(complaint.priority)}>
                {complaint.priority.toUpperCase()} PRIORITY
              </Badge>
              <div className="text-sm text-muted-foreground">
                Submitted: {formatDate(complaint.submitted_at)}
              </div>
            </div>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Complaint Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{complaint.title}</h4>
                  <p className="text-sm text-muted-foreground">{complaint.description}</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Incident Date:</strong> {complaint.incident_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Location:</strong> {complaint.location}
                    </span>
                  </div>
                </div>

                <div>
                  <strong className="text-sm">Student Involved:</strong>
                  <p className="text-sm text-muted-foreground">{complaint.student_involved}</p>
                </div>

                <div>
                  <strong className="text-sm">Desired Outcome:</strong>
                  <p className="text-sm text-muted-foreground">{complaint.desired_outcome}</p>
                </div>
              </CardContent>
            </Card>

            {/* Complainant Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Complainant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <strong className="text-sm">Name:</strong>
                    <p className="text-sm text-muted-foreground">{complaint.complainant_name}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Relationship:</strong>
                    <p className="text-sm text-muted-foreground capitalize">{complaint.complainant_relationship}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{complaint.complainant_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{complaint.complainant_phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Case Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <strong className="text-sm">Assigned To:</strong>
                    <p className="text-sm text-muted-foreground">{complaint.assigned_to}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Target Resolution:</strong>
                    <p className="text-sm text-muted-foreground">{complaint.target_resolution_date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Taken */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Actions Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaint.actions_taken.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-muted-foreground">
                          By {action.taken_by} • {formatDate(action.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaint.communications.map((comm, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize">{comm.type} - {comm.direction}</p>
                        <p className="text-sm text-muted-foreground">{comm.summary}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comm.date)} • {comm.participants.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};