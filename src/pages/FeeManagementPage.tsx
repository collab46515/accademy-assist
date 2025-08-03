import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Users, 
  Settings, 
  BarChart3, 
  Receipt, 
  Plus,
  DollarSign,
  Calendar,
  FileText,
  AlertCircle
} from "lucide-react";
import { FeeStructureTabs } from "@/components/fee-management/FeeStructureTabs";

const FeeManagementPage = () => {
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

      {/* Fee Management Tabs */}
      <Tabs defaultValue="structures" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="structures" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Fee Structures
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Student Assignments
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structures" className="space-y-6">
          <FeeStructureTabs />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Fee Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Student Assignments Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Assign fee structures to students, manage scholarships, discounts, and individual fee adjustments.
                </p>
                <Badge variant="secondary">Ready for Configuration</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fee Collections & Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Collections Management Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Process payments, track collections, manage payment methods, and handle refunds.
                </p>
                <Badge variant="secondary">Ready for Configuration</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoicing & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoicing System Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Generate invoices, send payment reminders, track payment status, and manage billing cycles.
                </p>
                <Badge variant="secondary">Ready for Configuration</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Fee Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fee Analytics Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  View collection reports, outstanding fee analysis, payment trends, and financial insights.
                </p>
                <Badge variant="secondary">Ready for Configuration</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Fee Management Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Configure payment gateways, late fee policies, academic year settings, and notification preferences.
                </p>
                <Badge variant="secondary">Ready for Configuration</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeeManagementPage;