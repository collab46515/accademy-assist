import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { DriverPerformancePanel } from "./DriverPerformancePanel";
import { VehicleUtilizationPanel } from "./VehicleUtilizationPanel";
import { CostTrackingPanel } from "./CostTrackingPanel";

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
        <p className="text-muted-foreground">
          Transport performance metrics, cost tracking, and efficiency analysis
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">Driver Performance</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Utilization</TabsTrigger>
          <TabsTrigger value="costs">Cost Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="drivers">
          <DriverPerformancePanel />
        </TabsContent>

        <TabsContent value="vehicles">
          <VehicleUtilizationPanel />
        </TabsContent>

        <TabsContent value="costs">
          <CostTrackingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
