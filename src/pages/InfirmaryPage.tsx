import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Plus, Users, Calendar, Pill, FileText } from "lucide-react";
import { useState } from "react";
import { MedicalVisitForm, TodaysVisitsModal, ActiveCasesModal, MedicineGivenModal, AppointmentsModal } from "@/components/infirmary";
import { CSVReportSection } from "@/components/shared/CSVReportSection";
import { useInfirmaryData } from "@/hooks/useInfirmaryData";

const InfirmaryPage = () => {
  const [activeTab, setActiveTab] = useState("visits");
  const [showMedicalVisitForm, setShowMedicalVisitForm] = useState(false);
  const [showTodaysVisits, setShowTodaysVisits] = useState(false);
  const [showActiveCases, setShowActiveCases] = useState(false);
  const [showMedicineGiven, setShowMedicineGiven] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);

  // Get real data from the database
  const { visits, stats, loading, refreshData } = useInfirmaryData();

  const handleNewMedicalVisit = () => {
    setShowMedicalVisitForm(true);
  };

  const handleVisitCreated = () => {
    // Refresh all data when a new visit is created
    refreshData();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Infirmary</h1>
          <p className="text-muted-foreground">
            Manage student health records and medical visits
          </p>
        </div>
        <Button onClick={handleNewMedicalVisit}>
          <Plus className="mr-2 h-4 w-4" />
          New Medical Visit
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowTodaysVisits(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.todaysVisits}</div>
            <p className="text-xs text-muted-foreground">Students seen today</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowActiveCases(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeCases}</div>
            <p className="text-xs text-muted-foreground">Ongoing medical needs</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowMedicineGiven(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicine Given</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.medicineGiven}</div>
            <p className="text-xs text-muted-foreground">Doses administered today</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAppointments(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.appointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="visits">Medical Visits</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="medicine">Medicine Administration</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Medical Visits</CardTitle>
              <CardDescription>Latest student visits to the infirmary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No recent medical visits</p>
                <p className="text-sm">Medical visits will appear here once recorded</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Medical Records</CardTitle>
              <CardDescription>Manage comprehensive medical information for students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No medical records found</p>
                <p className="text-sm">Student medical records will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Administration</CardTitle>
              <CardDescription>Track and manage medicine given to students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No medicine administration records</p>
                <p className="text-sm">Medicine administration records will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Appointments</CardTitle>
              <CardDescription>Schedule and manage medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No appointments scheduled</p>
                <p className="text-sm">Medical appointments will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CSV Reports Section */}
      <CSVReportSection 
        title="Infirmary Reports & Analytics"
        description="Generate comprehensive reports for medical visits, medicine administration, and health trends"
        moduleName="infirmary"
      />

      <MedicalVisitForm 
        open={showMedicalVisitForm} 
        onOpenChange={setShowMedicalVisitForm}
        onVisitCreated={handleVisitCreated}
      />
      
      <TodaysVisitsModal 
        open={showTodaysVisits} 
        onOpenChange={setShowTodaysVisits} 
      />
      
      <ActiveCasesModal 
        open={showActiveCases} 
        onOpenChange={setShowActiveCases} 
      />
      
      <MedicineGivenModal 
        open={showMedicineGiven} 
        onOpenChange={setShowMedicineGiven} 
      />
      
      <AppointmentsModal 
        open={showAppointments} 
        onOpenChange={setShowAppointments} 
      />
    </div>
  );
};

export default InfirmaryPage;