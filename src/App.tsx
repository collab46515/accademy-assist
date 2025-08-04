import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import AttendancePage from "./pages/AttendancePage";
import CurriculumPage from "./pages/CurriculumPage";
import AssessmentPage from "./pages/AssessmentPage";
import GradebookPage from "./pages/GradebookPage";
import ExamsPage from "./pages/ExamsPage";
import StaffPage from "./pages/StaffPage";
import CommunicationPage from "./pages/CommunicationPage";
import PortalsPage from "./pages/PortalsPage";
import FinancePage from "./pages/FinancePage";
import FeeManagementPage from "./pages/FeeManagementPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import SafeguardingPage from "./pages/SafeguardingPage";
import EventsPage from "./pages/EventsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AISuitePage from "./pages/AISuitePage";
import IntegrationsPage from "./pages/IntegrationsPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { HRManagementPage } from "./pages/HRManagementPage";
import { AccountingPage } from "./pages/AccountingPage";
import { MasterDataPage } from "./pages/MasterDataPage";
import TimetablePage from "./pages/TimetablePage";
import LessonPlanningPage from "./pages/LessonPlanningPage";
import AcademicsPage from "./pages/AcademicsPage";
import NotFound from "./pages/NotFound";
import StudentWelfarePage from "./pages/StudentWelfarePage";
import InfirmaryPage from "./pages/InfirmaryPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import StudentWelfareSafeguardingPage from "./pages/StudentWelfareSafeguardingPage";

import HODDashboardPage from "./pages/HODDashboardPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/welcome" element={<Index />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider defaultOpen={true}>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <SidebarInset>
                      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="ml-auto">
                          <span className="text-sm text-muted-foreground">School Management System</span>
                        </div>
                      </header>
                      <main className="flex-1 overflow-y-auto max-h-screen">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/students" element={<StudentsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/legacy-admissions" element={<AdmissionsPage />} />
            <Route path="/admin-management" element={<AdminManagementPage />} />
                          <Route path="/academics" element={<AcademicsPage />} />
                          <Route path="/academics/timetable" element={<TimetablePage />} />
                          <Route path="/academics/curriculum" element={<CurriculumPage />} />
                          <Route path="/academics/lesson-planning" element={<LessonPlanningPage />} />
                          <Route path="/academics/assignments" element={<AssignmentsPage />} />
                          <Route path="/academics/gradebook" element={<GradebookPage />} />
                          <Route path="/academics/exams" element={<ExamsPage />} />
                          <Route path="/academics/attendance" element={<AttendancePage />} />
                          <Route path="/attendance" element={<AttendancePage />} />
                          <Route path="/timetable" element={<TimetablePage />} />
                          <Route path="/curriculum" element={<CurriculumPage />} />
                          <Route path="/assessment" element={<AssessmentPage />} />
                          <Route path="/gradebook" element={<GradebookPage />} />
                          <Route path="/exams" element={<ExamsPage />} />
                          <Route path="/staff" element={<StaffPage />} />
                          <Route path="/school-management/fee-management/*" element={<FeeManagementPage />} />
                          <Route path="/communication" element={<CommunicationPage />} />
                          <Route path="/portals" element={<PortalsPage />} />
                          <Route path="/finance" element={<FinancePage />} />
                          <Route path="/activities" element={<ActivitiesPage />} />
                          <Route path="/safeguarding" element={<SafeguardingPage />} />
                          <Route path="/student-welfare" element={<StudentWelfarePage />} />
                          <Route path="/student-welfare/infirmary" element={<InfirmaryPage />} />
                          <Route path="/hod-dashboard" element={<HODDashboardPage />} />
                          <Route path="/student-welfare/safeguarding" element={<StudentWelfareSafeguardingPage />} />
                          <Route path="/events" element={<EventsPage />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                          <Route path="/ai-suite" element={<AISuitePage />} />
                          <Route path="/hr-management" element={<HRManagementPage />} />
                          <Route path="/master-data" element={<MasterDataPage />} />
                          <Route path="/accounting" element={<AccountingPage />} />
                          <Route path="/accounting/student-fees" element={<AccountingPage />} />
                          <Route path="/accounting/invoices" element={<AccountingPage />} />
                          <Route path="/accounting/bills" element={<AccountingPage />} />
                          <Route path="/accounting/vendors" element={<AccountingPage />} />
                          <Route path="/accounting/purchase-orders" element={<AccountingPage />} />
                          <Route path="/accounting/reports" element={<AccountingPage />} />
                          <Route path="/accounting/accounts" element={<AccountingPage />} />
                          <Route path="/accounting/budget" element={<AccountingPage />} />
                          <Route path="/accounting/settings" element={<AccountingPage />} />
                          <Route path="/user-management" element={
                            <ProtectedRoute>
                              <UserManagementPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/integrations" element={<IntegrationsPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </SidebarInset>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;