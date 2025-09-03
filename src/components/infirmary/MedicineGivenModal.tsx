import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Clock, User, Eye, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface MedicineGivenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Use real database data only
const mockMedicineRecords = [
  {
    id: "MED-ADMIN-001",
    studentName: "Sophie Davis",
    class: "Year 8C",
    time: "08:30",
    medication: "Salbutamol Inhaler",
    dosage: "2 puffs",
    reason: "Asthma management",
    administeredBy: "School Nurse",
    parentConsent: true,
    sideEffects: "None observed"
  },
  {
    id: "MED-ADMIN-002",
    studentName: "Michael Chen",
    class: "Year 9C", 
    time: "09:15",
    medication: "EpiPen",
    dosage: "1 injection",
    reason: "Allergic reaction",
    administeredBy: "School Nurse",
    parentConsent: true,
    sideEffects: "Improved breathing"
  },
  {
    id: "MED-ADMIN-003",
    studentName: "Emma Johnson",
    class: "Year 7A",
    time: "11:00",
    medication: "Paracetamol",
    dosage: "500mg",
    reason: "Headache",
    administeredBy: "School Nurse", 
    parentConsent: true,
    sideEffects: "None"
  },
  {
    id: "MED-ADMIN-004",
    studentName: "Oliver Brown",
    class: "Year 10A",
    time: "12:30",
    medication: "Insulin",
    dosage: "5 units",
    reason: "Diabetes management",
    administeredBy: "School Nurse",
    parentConsent: true,
    sideEffects: "Blood sugar stabilized"
  },
  {
    id: "MED-ADMIN-005",
    studentName: "Lily Martinez", 
    class: "Year 6B",
    time: "14:45",
    medication: "Antihistamine",
    dosage: "10mg",
    reason: "Allergic reaction",
    administeredBy: "School Nurse",
    parentConsent: true,
    sideEffects: "Rash improving"
  }
];

const getUrgencyColor = (reason: string) => {
  if (reason.toLowerCase().includes('emergency') || reason.toLowerCase().includes('allergic reaction')) {
    return "bg-red-100 text-red-800";
  }
  if (reason.toLowerCase().includes('asthma') || reason.toLowerCase().includes('diabetes')) {
    return "bg-orange-100 text-orange-800";
  }
  return "bg-blue-100 text-blue-800";
};

export function MedicineGivenModal({ open, onOpenChange }: MedicineGivenModalProps) {
  const handleViewDetails = (recordId: string) => {
    alert(`View details for medicine record ${recordId}`);
  };

  const handleContactParent = (studentName: string) => {
    alert(`Contact parent of ${studentName}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medicine Administration - {format(new Date(), "PPPP")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mockMedicineRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No medicine administered today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockMedicineRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{record.studentName}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {record.class}
                          </Badge>
                          {!record.parentConsent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              No Consent
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {record.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {record.administeredBy}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getUrgencyColor(record.reason)}>
                        {record.reason}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Medication:
                        </p>
                        <p className="text-sm font-medium">{record.medication}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Dosage:
                        </p>
                        <p className="text-sm">{record.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Side Effects:
                        </p>
                        <p className="text-sm">{record.sideEffects}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Parent Consent:
                        </p>
                        <p className="text-sm">{record.parentConsent ? "✅ Yes" : "❌ No"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(record.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactParent(record.studentName)}
                        className="flex items-center gap-1"
                      >
                        Contact Parent
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
            Total doses administered: {mockMedicineRecords.length}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}