import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TransportDashboard />
        </TabsContent>

        <TabsContent value="routes">
          <RoutesSchedules />
        </TabsContent>

        <TabsContent value="vehicles">
          <VehicleManagement />
        </TabsContent>

        <TabsContent value="drivers">
          <DriverManagement />
        </TabsContent>

        <TabsContent value="assignments">
          <StudentAssignments />
        </TabsContent>

        <TabsContent value="tracking">
          <VehicleTracking />
        </TabsContent>

        <TabsContent value="notifications">
          <TransportNotifications />
        </TabsContent>

        <TabsContent value="reports">
          <TransportReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}