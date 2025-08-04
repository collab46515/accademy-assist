import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, Phone, Calendar, Eye } from "lucide-react";

interface ActiveCasesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for active medical cases
const mockActiveCases = [
  {
    id: "CASE-001",
    studentName: "Sarah Thompson",
    class: "Year 8A",
    condition: "Type 1 Diabetes",
    severity: "high",
    lastVisit: "2024-01-15",
    nextCheckup: "2024-01-22",
    managedBy: "School Nurse",
    requiresDaily: true
  },
  {
    id: "CASE-002",
    studentName: "Michael Chen",
    class: "Year 9C",
    condition: "Severe Asthma",
    severity: "high",
    lastVisit: "2024-01-14",
    nextCheckup: "2024-01-21",
    managedBy: "School Nurse",
    requiresDaily: true
  },
  {
    id: "CASE-003",
    studentName: "Emma Rodriguez",
    class: "Year 7B",
    condition: "Food Allergies (Nuts)",
    severity: "critical",
    lastVisit: "2024-01-10",
    nextCheckup: "2024-01-17",
    managedBy: "School Nurse",
    requiresDaily: false
  },
  {
    id: "CASE-004",
    studentName: "Jack Williams",
    class: "Year 10A",
    condition: "ADHD Medication",
    severity: "medium",
    lastVisit: "2024-01-12",
    nextCheckup: "2024-01-19",
    managedBy: "School Nurse",
    requiresDaily: true
  },
  {
    id: "CASE-005",
    studentName: "Isabella Garcia",
    class: "Year 6C",
    condition: "Epilepsy",
    severity: "high",
    lastVisit: "2024-01-13",
    nextCheckup: "2024-01-20",
    managedBy: "School Nurse",
    requiresDaily: false
  }
];

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    "critical": "bg-red-100 text-red-800",
    "high": "bg-orange-100 text-orange-800",
    "medium": "bg-yellow-100 text-yellow-800",
    "low": "bg-green-100 text-green-800"
  };
  return colors[severity] || "bg-gray-100 text-gray-800";
};

export function ActiveCasesModal({ open, onOpenChange }: ActiveCasesModalProps) {
  const handleViewDetails = (caseId: string) => {
    alert(`View details for case ${caseId}`);
  };

  const handleContactParent = (studentName: string) => {
    alert(`Contact parent of ${studentName}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Medical Cases
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mockActiveCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No active medical cases</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockActiveCases.map((case_) => (
                <Card key={case_.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{case_.studentName}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {case_.class}
                          </Badge>
                          {case_.requiresDaily && (
                            <Badge variant="secondary" className="text-xs">
                              Daily Care
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {case_.managedBy}
                          </span>
                          <span>Case ID: {case_.id}</span>
                        </CardDescription>
                      </div>
                      <Badge className={getSeverityColor(case_.severity)}>
                        {case_.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Medical Condition:
                        </p>
                        <p className="text-sm font-medium">{case_.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Last Visit:
                        </p>
                        <p className="text-sm">{case_.lastVisit}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Next Checkup:
                        </p>
                        <p className="text-sm">{case_.nextCheckup}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(case_.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactParent(case_.studentName)}
                        className="flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        Contact Parent
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Visit
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
            Total active cases: {mockActiveCases.length}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}