import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Calculator, 
  BarChart3, 
  Target, 
  Building2, 
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  PieChart,
  Receipt,
  Clock,
  AlertTriangle,
  Users,
  Settings,
  Download,
  Plus
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FinancialDashboard } from '@/components/finance/FinancialDashboard';
import { UserGuide } from '@/components/shared/UserGuide';
import { financeUserGuide } from '@/data/userGuides';

export default function FinanceOperationsPage() {
  const navigate = useNavigate();

  const financeModules = [
    {
      title: "Fee Management",
      description: "Complete student fee collection, invoicing, and payment tracking system",
      icon: CreditCard,
      url: "/school-management/fee-management",
      stats: "£2.4M collected",
      color: "bg-blue-500",
      features: ["Fee Collection", "Payment Plans", "Invoice Generation", "Outstanding Tracking", "Multi-Currency Support", "Automated Reminders"]
    },
    {
      title: "Full Accounting",
      description: "Professional accounting and bookkeeping with chart of accounts",
      icon: Calculator,
      url: "/accounting",
      stats: "15 accounts active",
      color: "bg-green-500",
      features: ["General Ledger", "Accounts Payable", "Accounts Receivable", "Financial Statements", "Multi-Currency", "Audit Trail"]
    },
    {
      title: "Budgeting & Planning",
      description: "Budget management and financial forecasting tools",
      icon: Target,
      url: "/accounting/budget",
      stats: "87% budget utilized",
      color: "bg-purple-500",
      features: ["Annual Budgets", "Variance Analysis", "Department Budgets", "Expense Tracking", "Budget Alerts", "Forecasting"]
    },
    {
      title: "Vendor Management",
      description: "Comprehensive vendor and supplier relationship management",
      icon: Building2,
      url: "/accounting/vendors",
      stats: "45 active vendors",
      color: "bg-orange-500",
      features: ["Vendor Database", "Purchase Orders", "Payment Terms", "Performance Tracking", "Contract Management", "Supplier Analytics"]
    },
    {
      title: "Financial Reports",
      description: "Advanced financial reporting and analytics dashboard",
      icon: BarChart3,
      url: "/accounting/reports",
      stats: "12 reports generated",
      color: "bg-indigo-500",
      features: ["P&L Statements", "Balance Sheets", "Cash Flow", "Budget Reports", "Tax Reports", "Custom Analytics"]
    },
    {
      title: "Purchase Management",
      description: "Complete procurement and purchase order management",
      icon: ShoppingCart,
      url: "/accounting/purchase-orders",
      stats: "23 active POs",
      color: "bg-teal-500",
      features: ["Purchase Orders", "Requisitions", "Approval Workflow", "Delivery Tracking", "Vendor Comparison", "Spend Analysis"]
    }
  ];

  const financeStats = [
    { 
      label: "Monthly Revenue", 
      value: "£245K", 
      trend: "+12.5%", 
      trendType: "up",
      icon: DollarSign,
      description: "Total revenue this month"
    },
    { 
      label: "Outstanding Fees", 
      value: "£45K", 
      trend: "-8.2%", 
      trendType: "down",
      icon: AlertTriangle,
      description: "Pending student payments"
    },
    { 
      label: "Budget Utilization", 
      value: "87%", 
      trend: "+5.1%", 
      trendType: "up",
      icon: Target,
      description: "Annual budget consumed"
    },
    { 
      label: "Vendor Payments", 
      value: "£125K", 
      trend: "+3.8%", 
      trendType: "up",
      icon: Building2,
      description: "Monthly supplier payments"
    },
  ];

  const quickActions = [
    { icon: FileText, label: "Create Invoice", action: () => navigate('/accounting/invoices') },
    { icon: Receipt, label: "Record Payment", action: () => navigate('/school-management/fee-management/payments') },
    { icon: ShoppingCart, label: "New Purchase Order", action: () => navigate('/accounting/purchase-orders') },
    { icon: Building2, label: "Add Vendor", action: () => navigate('/accounting/vendors') },
    { icon: Calculator, label: "Chart of Accounts", action: () => navigate('/accounting/accounts') },
    { icon: BarChart3, label: "Financial Reports", action: () => navigate('/accounting/reports') },
  ];

  const recentTransactions = [
    { id: '1', type: 'income', description: 'Tuition Fee - Year 7', amount: 1200, date: '2024-01-15', status: 'completed' },
    { id: '2', type: 'expense', description: 'Office Supplies', amount: -150, date: '2024-01-14', status: 'completed' },
    { id: '3', type: 'income', description: 'Lunch Fee Payment', amount: 25, date: '2024-01-13', status: 'pending' },
    { id: '4', type: 'expense', description: 'Utilities Payment', amount: -850, date: '2024-01-12', status: 'completed' },
    { id: '5', type: 'income', description: 'Sports Club Fee', amount: 75, date: '2024-01-11', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="Finance & Operations Hub" 
        description="Complete financial management and operational excellence platform"
        actions={
          <div className="flex items-center gap-3">
            <UserGuide 
              moduleName={financeUserGuide.moduleName}
              sections={financeUserGuide.sections}
              quickActions={financeUserGuide.quickActions}
            />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div>
        }
      />
      
      <div className="p-6 space-y-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Finance Modules</TabsTrigger>
            <TabsTrigger value="transactions">Recent Activity</TabsTrigger>
            <TabsTrigger value="reports">Quick Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Interactive Financial Dashboard */}
            <FinancialDashboard />

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used financial operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map((action, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={action.action}
                    >
                      <action.icon className="h-6 w-6" />
                      <span className="text-xs text-center">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            {/* Finance Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financeModules.map((module, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(module.url)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`h-12 w-12 rounded-lg ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">{module.stats}</Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="text-sm">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {module.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                            <span className="text-xs text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(module.url);
                        }}
                      >
                        Access {module.title}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Recent Transactions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest financial activities across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          £{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Quick Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChart className="h-5 w-5 text-blue-500" />
                    Income Statement
                  </CardTitle>
                  <CardDescription>Monthly profit & loss overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-green-600">£245,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expenses</span>
                      <span className="font-semibold text-red-600">£185,000</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Net Profit</span>
                      <span className="font-bold text-green-600">£60,000</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Fee Collection Report
                  </CardTitle>
                  <CardDescription>Student fee collection summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Collected</span>
                      <span className="font-semibold text-green-600">£425,600</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Outstanding</span>
                      <span className="font-semibold text-orange-600">£45,000</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Collection Rate</span>
                      <span className="font-bold text-blue-600">90.4%</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Collection Details
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    Budget Analysis
                  </CardTitle>
                  <CardDescription>Budget vs actual spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Budget</span>
                      <span className="font-semibold">£500,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Spent</span>
                      <span className="font-semibold text-blue-600">£435,000</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Remaining</span>
                      <span className="font-bold text-green-600">£65,000</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Budget Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}