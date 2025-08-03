import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign,
  Calendar,
  AlertCircle,
  Users,
  Plus
} from "lucide-react";
import { FeeStructureTabs } from "@/components/fee-management/FeeStructureTabs";
import { InvoiceGeneration } from "@/components/fee-management/InvoiceGeneration";
import { PaymentCollection } from "@/components/fee-management/PaymentCollection";
import { InstallmentPlans } from "@/components/fee-management/InstallmentPlans";
import { DiscountsWaivers } from "@/components/fee-management/DiscountsWaivers";
import { OutstandingFees } from "@/components/fee-management/OutstandingFees";
import { FeeReportsAnalytics } from "@/components/fee-management/FeeReportsAnalytics";
import { FeeCalendar } from "@/components/fee-management/FeeCalendar";
import { RemindersAlerts } from "@/components/fee-management/RemindersAlerts";

const FeeManagementOverview = () => {
  const stats = [
    { label: "Total Fee Collection", value: "£2,847,650", icon: DollarSign, color: "text-success" },
    { label: "Outstanding Fees", value: "£127,450", icon: AlertCircle, color: "text-warning" },
    { label: "Fee Payers", value: "2,847", icon: Users, color: "text-primary" },
    { label: "This Month", value: "£234,580", icon: Calendar, color: "text-success" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground">Manage student fees, payment structures, and collections</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Fee Structure
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="text-center py-12 text-muted-foreground">
        <p>Select a section from the sidebar to manage specific fee-related activities.</p>
      </div>
    </div>
  );
};

const FeeManagementPage = () => {
  return (
    <Routes>
      <Route index element={<FeeManagementOverview />} />
      <Route path="structure" element={<FeeStructureTabs />} />
      <Route path="invoices" element={<InvoiceGeneration />} />
      <Route path="payments" element={<PaymentCollection />} />
      <Route path="installment-plans" element={<InstallmentPlans />} />
      <Route path="discounts-waivers" element={<DiscountsWaivers />} />
      <Route path="outstanding-fees" element={<OutstandingFees />} />
      <Route path="reports" element={<FeeReportsAnalytics />} />
      <Route path="calendar" element={<FeeCalendar />} />
      <Route path="reminders" element={<RemindersAlerts />} />
    </Routes>
  );
};

export default FeeManagementPage;