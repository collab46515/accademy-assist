import { Routes, Route, Navigate } from "react-router-dom";
import { TransportDashboard } from "@/components/transport/TransportDashboard";
import { RoutesSchedules } from "@/components/transport/RoutesSchedules";
import { VehicleManagement } from "@/components/transport/VehicleManagement";
import { DriverManagement } from "@/components/transport/DriverManagement";
import { StudentAssignments } from "@/components/transport/StudentAssignments";
import { VehicleTracking } from "@/components/transport/VehicleTracking";
import { TransportNotifications } from "@/components/transport/TransportNotifications";
import { TransportReports } from "@/components/transport/TransportReports";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TransportPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Transport Management" 
        description="Manage school transport, routes, and vehicle tracking"
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/transport/dashboard" replace />} />
        <Route path="/dashboard" element={<TransportDashboard />} />
        <Route path="/routes" element={<RoutesSchedules />} />
        <Route path="/vehicles" element={<VehicleManagement />} />
        <Route path="/drivers" element={<DriverManagement />} />
        <Route path="/assignments" element={<StudentAssignments />} />
        <Route path="/tracking" element={<VehicleTracking />} />
        <Route path="/notifications" element={<TransportNotifications />} />
        <Route path="/reports" element={<TransportReports />} />
      </Routes>
    </div>
  );
}