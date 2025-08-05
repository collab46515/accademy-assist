import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Receipt,
  FileText,
  Target,
  Building2,
  Users,
  Calendar,
  BarChart3,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { useFeeData } from '@/hooks/useFeeData';
import { useAuth } from '@/hooks/useAuth';

interface FinancialMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  description: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

interface OutstandingFee {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  category: string;
}

export function FinancialDashboard() {
  const { user } = useAuth();
  const { feeHeads, feeStructures, invoices, loading } = useFeeData();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Calculate real metrics from data
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.paid_amount, 0);

  const outstandingFeesAmount = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);

  const collectionRate = invoices.length > 0 
    ? (invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100
    : 0;

  const activeInvoices = invoices.filter(inv => inv.status !== 'paid').length;

  // Calculate trends (mock data for now - would need historical data)
  const revenueChange = "+12.5%";
  const outstandingChange = "-8.2%";
  const collectionChange = "+2.1%";
  const invoiceChange = "+5.3%";

  const metrics: FinancialMetric[] = [
    {
      label: "Monthly Revenue",
      value: `£${(totalRevenue / 1000).toFixed(1)}K`,
      change: revenueChange,
      changeType: "positive",
      icon: DollarSign,
      description: "Total revenue this month"
    },
    {
      label: "Outstanding Fees",
      value: `£${(outstandingFeesAmount / 1000).toFixed(1)}K`,
      change: outstandingChange,
      changeType: "positive",
      icon: AlertTriangle,
      description: "Pending student payments"
    },
    {
      label: "Budget Utilization",
      value: "87%",
      change: "+5.1%",
      changeType: "positive",
      icon: Target,
      description: "Annual budget consumed"
    },
    {
      label: "Vendor Payments",
      value: "£125K",
      change: "+3.8%",
      changeType: "positive",
      icon: Building2,
      description: "Monthly supplier payments"
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      description: 'Tuition Fee Payment - Year 10',
      amount: 2400,
      date: '2024-01-15',
      status: 'completed',
      category: 'tuition'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Office Supplies Purchase',
      amount: 450,
      date: '2024-01-14',
      status: 'completed',
      category: 'operations'
    },
    {
      id: '3',
      type: 'income',
      description: 'Sports Club Membership Fee',
      amount: 150,
      date: '2024-01-13',
      status: 'pending',
      category: 'activities'
    },
    {
      id: '4',
      type: 'expense',
      description: 'Utilities Monthly Payment',
      amount: 1200,
      date: '2024-01-12',
      status: 'completed',
      category: 'utilities'
    },
    {
      id: '5',
      type: 'income',
      description: 'Exam Fee - Year 11',
      amount: 85,
      date: '2024-01-11',
      status: 'completed',
      category: 'examinations'
    }
  ];

  const outstandingFeesList: OutstandingFee[] = [
    {
      id: '1',
      studentName: 'Emma Thompson',
      studentId: 'ST001',
      amount: 2400,
      dueDate: '2024-01-10',
      daysPastDue: 5,
      category: 'Tuition Fee'
    },
    {
      id: '2',
      studentName: 'James Wilson',
      studentId: 'ST002',
      amount: 150,
      dueDate: '2024-01-08',
      daysPastDue: 7,
      category: 'Lunch Fee'
    },
    {
      id: '3',
      studentName: 'Sophie Chen',
      studentId: 'ST003',
      amount: 85,
      dueDate: '2024-01-05',
      daysPastDue: 10,
      category: 'Exam Fee'
    },
    {
      id: '4',
      studentName: 'Oliver Smith',
      studentId: 'ST004',
      amount: 300,
      dueDate: '2024-01-12',
      daysPastDue: 3,
      category: 'Transport Fee'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (daysPastDue: number) => {
    if (daysPastDue > 7) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (daysPastDue > 3) {
      return <Badge className="bg-orange-500 text-white">High</Badge>;
    } else {
      return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
    }
  };

  const getMetricDrillDown = (metricLabel: string) => {
    switch (metricLabel) {
      case "Monthly Revenue":
        return {
          title: "Monthly Revenue Breakdown",
          data: feeHeads.map(head => ({
            category: head.name,
            amount: head.amount,
            count: Math.floor(Math.random() * 50) + 10
          }))
        };
      case "Outstanding Fees":
        return {
          title: "Outstanding Fees by Category",
          data: invoices
            .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
            .slice(0, 10)
            .map(inv => ({
              id: inv.invoice_number,
              amount: inv.amount - inv.paid_amount,
              dueDate: inv.due_date,
              status: inv.status
            }))
        };
      case "Budget Utilization":
        return {
          title: "Budget Utilization by Department",
          data: [
            { department: "Teaching & Learning", budgeted: 150000, spent: 135000, utilization: 90 },
            { department: "Facilities", budgeted: 80000, spent: 72000, utilization: 90 },
            { department: "Technology", budgeted: 45000, spent: 38000, utilization: 84 },
            { department: "Administration", budgeted: 35000, spent: 28000, utilization: 80 }
          ]
        };
      case "Vendor Payments":
        return {
          title: "Vendor Payments This Month",
          data: [
            { vendor: "Office Supplies Ltd", amount: 12500, category: "Supplies", status: "Paid" },
            { vendor: "Tech Solutions Inc", amount: 45000, category: "Technology", status: "Pending" },
            { vendor: "Cleaning Services Co", amount: 8500, category: "Facilities", status: "Paid" },
            { vendor: "Food Services UK", amount: 15000, category: "Catering", status: "Processing" }
          ]
        };
      default:
        return { title: "Data", data: [] };
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-1">
                        {metric.changeType === 'positive' ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                        <p className={`text-xs ${
                          metric.changeType === 'positive' ? 'text-success' : 'text-destructive'
                        }`}>
                          {metric.change}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <metric.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <metric.icon className="h-5 w-5" />
                  {getMetricDrillDown(metric.label).title}
                </DialogTitle>
                <DialogDescription>
                  Detailed breakdown and analysis for {metric.label.toLowerCase()}
                </DialogDescription>
              </DialogHeader>
              <DrillDownContent metric={metric} data={getMetricDrillDown(metric.label)} />
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Summary
                </CardTitle>
                <CardDescription>Current month financial overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue Target</span>
                    <span className="font-semibold">£200,000</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Achieved: £187,500</span>
                      <span className="text-sm font-medium">93.75%</span>
                    </div>
                    <Progress value={93.75} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Collection Rate</span>
                    <span className="font-semibold text-success">94.2%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Outstanding Amount</span>
                    <span className="font-semibold text-orange-600">£12,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Total Students</span>
                    </div>
                    <span className="text-xl font-bold">1,247</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Paid This Month</span>
                    </div>
                    <span className="text-xl font-bold">1,174</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Pending Payments</span>
                    </div>
                    <span className="text-xl font-bold">73</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
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
                        <p className="text-xs text-muted-foreground">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}£{transaction.amount.toLocaleString()}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outstanding" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Outstanding Fees
              </CardTitle>
              <CardDescription>Overdue payments requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                 {outstandingFeesList.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{fee.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {fee.studentId} • {fee.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-red-600">£{fee.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        {getUrgencyBadge(fee.daysPastDue)}
                        <span className="text-xs text-muted-foreground">
                          {fee.daysPastDue} days overdue
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold text-green-600">£187,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="font-semibold">£167,200</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Growth</span>
                    <span className="font-bold text-success">+12.15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Collection Efficiency</CardTitle>
                <CardDescription>Payment collection metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">On Time</span>
                    <span className="font-semibold text-green-600">87.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Within 7 Days</span>
                    <span className="font-semibold text-blue-600">6.7%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Overdue</span>
                    <span className="font-bold text-orange-600">5.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Fee Categories</CardTitle>
                <CardDescription>Revenue breakdown by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Tuition</span>
                    <span className="font-semibold">£142,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Activities</span>
                    <span className="font-semibold">£28,500</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Other</span>
                    <span className="font-bold">£17,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DrillDownContent({ metric, data }: { metric: FinancialMetric, data: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {metric.label === "Monthly Revenue" && (
        <div className="space-y-3">
          {data.data.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{item.category}</p>
                <p className="text-sm text-muted-foreground">{item.count} transactions</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">£{item.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Per unit</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {metric.label === "Outstanding Fees" && (
        <div className="space-y-3">
          {data.data.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{item.id}</p>
                <p className="text-sm text-muted-foreground">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">£{item.amount.toLocaleString()}</p>
                <Badge variant={item.status === 'overdue' ? 'destructive' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {metric.label === "Budget Utilization" && (
        <div className="space-y-3">
          {data.data.map((item: any, index: number) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.department}</p>
                <p className="text-sm text-muted-foreground">{item.utilization}% utilized</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Budgeted: £{item.budgeted.toLocaleString()}</span>
                  <span>Spent: £{item.spent.toLocaleString()}</span>
                </div>
                <Progress value={item.utilization} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {metric.label === "Vendor Payments" && (
        <div className="space-y-3">
          {data.data.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{item.vendor}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">£{item.amount.toLocaleString()}</p>
                <Badge variant={
                  item.status === 'Paid' ? 'default' : 
                  item.status === 'Pending' ? 'secondary' : 'outline'
                }>
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}