import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, User, Pill, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

interface TodaysVisitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for today's visits
const mockTodaysVisits = [
  {
    id: "MED-1001",
    studentName: "Emma Johnson",
    class: "Year 7A",
    time: "09:15",
    visitType: "illness",
    chiefComplaint: "Headache and nausea",
    status: "completed",
    treatedBy: "School Nurse"
  },
  {
    id: "MED-1002", 
    studentName: "James Wilson",
    class: "Year 9B",
    time: "10:30",
    visitType: "injury",
    chiefComplaint: "Scraped knee from playground",
    status: "completed",
    treatedBy: "School Nurse"
  },
  {
    id: "MED-1003",
    studentName: "Sophie Davis",
    class: "Year 8C",
    time: "11:45",
    visitType: "medication_administration",
    chiefComplaint: "Daily asthma inhaler",
    status: "completed",
    treatedBy: "School Nurse"
  },
  {
    id: "MED-1004",
    studentName: "Oliver Brown",
    class: "Year 10A",
    time: "13:20",
    visitType: "illness",
    chiefComplaint: "Stomach ache",
    status: "in_progress",
    treatedBy: "School Nurse"
  },
  {
    id: "MED-1005",
    studentName: "Lily Martinez",
    class: "Year 6B",
    time: "14:10",
    visitType: "follow_up",
    chiefComplaint: "Follow-up for sprained ankle",
    status: "completed",
    treatedBy: "School Nurse"
  }
];

const getVisitTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    "illness": "Illness",
    "injury": "Injury", 
    "medication_administration": "Medication",
    "routine_checkup": "Checkup",
    "emergency": "Emergency",
    "follow_up": "Follow-up"
  };
  return labels[type] || type;
};

const getVisitTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    "illness": "bg-yellow-100 text-yellow-800",
    "injury": "bg-red-100 text-red-800",
    "medication_administration": "bg-blue-100 text-blue-800", 
    "routine_checkup": "bg-green-100 text-green-800",
    "emergency": "bg-red-100 text-red-800",
    "follow_up": "bg-purple-100 text-purple-800"
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    "completed": "bg-green-100 text-green-800",
    "in_progress": "bg-blue-100 text-blue-800",
    "pending": "bg-yellow-100 text-yellow-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export function TodaysVisitsModal({ open, onOpenChange }: TodaysVisitsModalProps) {
  const handleViewDetails = (visitId: string) => {
    alert(`View details for visit ${visitId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Today's Medical Visits - {format(new Date(), "PPPP")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mockTodaysVisits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No medical visits recorded for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockTodaysVisits.map((visit) => (
                <Card key={visit.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{visit.studentName}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {visit.class}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {visit.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {visit.treatedBy}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getVisitTypeColor(visit.visitType)}>
                          {getVisitTypeLabel(visit.visitType)}
                        </Badge>
                        <Badge className={getStatusColor(visit.status)}>
                          {visit.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Chief Complaint:
                        </p>
                        <p className="text-sm">{visit.chiefComplaint}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(visit.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Total visits today: {mockTodaysVisits.length}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}