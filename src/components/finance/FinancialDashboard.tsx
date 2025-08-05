import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BarChart3
} from 'lucide-react';

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
  const metrics: FinancialMetric[] = [
    {
      label: "Total Revenue",
      value: "£2,450,000",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "Annual revenue YTD"
    },
    {
      label: "Outstanding Fees",
      value: "£285,420",
      change: "-8.2%",
      changeType: "positive",
      icon: AlertTriangle,
      description: "Pending student payments"
    },
    {
      label: "Collection Rate",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: Target,
      description: "Monthly collection efficiency"
    },
    {
      label: "Active Invoices",
      value: "1,247",
      change: "+5.3%",
      changeType: "positive",
      icon: FileText,
      description: "Outstanding invoices"
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

  const outstandingFees: OutstandingFee[] = [
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

  return (
    <div className="space-y-6">
      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                {outstandingFees.map((fee) => (
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