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
import { FeeDashboard } from "@/components/fee-management/FeeDashboard";
import FeeCollections from "@/components/fee-management/FeeCollections";
import { useFeeData } from "@/hooks/useFeeData";

const FeeManagementOverview = () => {
  const { feeStructures, feeHeads, invoices, loading } = useFeeData();

  // Calculate real stats from database data
  const totalFeeHeads = feeHeads.length;
  const activeFeeStructures = feeStructures.filter(fs => fs.status === 'active').length;
  const totalStructuredAmount = feeStructures.reduce((sum, fs) => sum + (fs.total_amount || 0), 0);
  const totalInvoices = invoices.length;

  const stats = [
    { 
      label: "Fee Heads", 
      value: totalFeeHeads.toString(), 
      icon: DollarSign, 
      color: "text-success",
      description: "Total fee types configured"
    },
    { 
      label: "Active Structures", 
      value: activeFeeStructures.toString(), 
      icon: AlertCircle, 
      color: "text-primary",
      description: "Fee structures currently in use"
    },
    { 
      label: "Total Structure Value", 
      value: `£${totalStructuredAmount.toLocaleString()}`, 
      icon: Users, 
      color: "text-success",
      description: "Combined value of all fee structures"
    },
    { 
      label: "Generated Invoices", 
      value: totalInvoices.toString(), 
      icon: Calendar, 
      color: "text-primary",
      description: "Total invoices in system"
    }
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

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-12 w-12 bg-muted rounded-xl"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Stats Cards */
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
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
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
      )}

      {/* Real Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Fee Structures</CardTitle>
          </CardHeader>
          <CardContent>
            {feeStructures.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No fee structures created yet</p>
            ) : (
              <div className="space-y-3">
                {feeStructures.slice(0, 3).map((structure) => (
                  <div key={structure.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{structure.name}</p>
                      <p className="text-sm text-muted-foreground">{structure.academic_year} • {structure.term}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">£{structure.total_amount?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-muted-foreground">{structure.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Fee Heads</CardTitle>
          </CardHeader>
          <CardContent>
            {feeHeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No fee heads created yet</p>
            ) : (
              <div className="space-y-3">
                {feeHeads.slice(0, 5).map((feeHead) => (
                  <div key={feeHead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{feeHead.name}</p>
                      <p className="text-sm text-muted-foreground">{feeHead.category} • {feeHead.recurrence}</p>
                    </div>
                    <p className="font-semibold">£{feeHead.amount?.toFixed(2) || '0.00'}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="text-center py-8 text-muted-foreground">
        <p>Select a section from the sidebar to manage specific fee-related activities.</p>
        <p className="text-sm mt-2">Or click "Add Fee Structure" above to create your first fee structure.</p>
      </div>
    </div>
  );
};

const FeeManagementPage = () => {
  return (
    <Routes>
      <Route index element={<FeeDashboard />} />
      <Route path="collections" element={<FeeCollections />} />
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