import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/attendance" element={<Dashboard />} />
            <Route path="/curriculum" element={<Dashboard />} />
            <Route path="/assessment" element={<Dashboard />} />
            <Route path="/gradebook" element={<Dashboard />} />
            <Route path="/exams" element={<Dashboard />} />
            <Route path="/staff" element={<Dashboard />} />
            <Route path="/communication" element={<Dashboard />} />
            <Route path="/portals" element={<Dashboard />} />
            <Route path="/finance" element={<Dashboard />} />
            <Route path="/activities" element={<Dashboard />} />
            <Route path="/safeguarding" element={<Dashboard />} />
            <Route path="/events" element={<Dashboard />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/ai-suite" element={<Dashboard />} />
            <Route path="/integrations" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
