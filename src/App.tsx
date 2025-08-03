import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthPage } from "@/components/auth/AuthPage";
import { Navbar } from "@/components/layout/Navbar";
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
import ActivitiesPage from "./pages/ActivitiesPage";
import SafeguardingPage from "./pages/SafeguardingPage";
import EventsPage from "./pages/EventsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AISuitePage from "./pages/AISuitePage";
import IntegrationsPage from "./pages/IntegrationsPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/students" element={<StudentsPage />} />
                    <Route path="/admissions" element={<AdmissionsPage />} />
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/curriculum" element={<CurriculumPage />} />
                    <Route path="/assessment" element={<AssessmentPage />} />
                    <Route path="/gradebook" element={<GradebookPage />} />
                    <Route path="/exams" element={<ExamsPage />} />
                    <Route path="/staff" element={<StaffPage />} />
                    <Route path="/communication" element={<CommunicationPage />} />
                    <Route path="/portals" element={<PortalsPage />} />
                    <Route path="/finance" element={<FinancePage />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/safeguarding" element={
                      <ProtectedRoute requiredRole="dsl">
                        <SafeguardingPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/ai-suite" element={<AISuitePage />} />
                    <Route path="/user-management" element={
                      <ProtectedRoute requiredRole="super_admin">
                        <UserManagementPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/integrations" element={<IntegrationsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
