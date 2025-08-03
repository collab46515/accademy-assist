import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Receipt,
  PieChart,
  BarChart3,
  FileText,
  Users,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator,
  Building2,
  Target,
  ShoppingCart,
  Globe
} from 'lucide-react';

// Mock data with multi-currency support
const mockData = {
  overview: {
    totalRevenue: { amount: 2450000, currency: 'GBP' },
    totalExpenses: { amount: 1850000, currency: 'GBP' },
    netProfit: { amount: 600000, currency: 'GBP' },
    cashFlow: { amount: 1200000, currency: 'GBP' },
    outstandingFees: { amount: 285000, currency: 'GBP' },
    paidThisMonth: { amount: 425000, currency: 'GBP' }
  },
  currencies: [
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 1.0 },
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.25 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 1.15 }
  ],
  recentTransactions: [
    { id: '1', date: '2024-01-15', description: 'Tuition Fee - Year 7', amount: 1200, currency: 'GBP', type: 'income', status: 'completed' },
    { id: '2', date: '2024-01-14', description: 'Office Supplies', amount: -150, currency: 'GBP', type: 'expense', status: 'completed' },
    { id: '3', date: '2024-01-13', description: 'Lunch Fee - Student ID: ST001', amount: 25, currency: 'GBP', type: 'income', status: 'pending' },
    { id: '4', date: '2024-01-12', description: 'Utilities Payment', amount: -850, currency: 'GBP', type: 'expense', status: 'completed' }
  ]
};

const formatCurrency = (amount: number, currency: string) => {
  const currencyData = mockData.currencies.find(c => c.code === currency);
  return `${currencyData?.symbol || ''}${amount.toLocaleString()}`;
};

export function AccountingPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const form = useForm();
  
  // Determine which accounting page to show based on the URL path
  const getAccountingView = () => {
    if (location.pathname === '/accounting/student-fees') return 'student-fees';
    if (location.pathname === '/accounting/invoices') return 'invoices';
    if (location.pathname === '/accounting/bills') return 'bills';
    if (location.pathname === '/accounting/vendors') return 'vendors';
    if (location.pathname === '/accounting/purchase-orders') return 'purchase-orders';
    if (location.pathname === '/accounting/reports') return 'reports';
    if (location.pathname === '/accounting/accounts') return 'accounts';
    if (location.pathname === '/accounting/budget') return 'budget';
    if (location.pathname === '/accounting/settings') return 'settings';
    return 'dashboard';
  };
  
  const currentView = getAccountingView();
  
  // Get page title based on current view
  const getPageTitle = () => {
    switch (currentView) {
      case 'student-fees': return 'Student Fee Management';
      case 'invoices': return 'Invoice Management';
      case 'bills': return 'Bills & Expenses';
      case 'vendors': return 'Vendor Management';
      case 'purchase-orders': return 'Purchase Orders';
      case 'reports': return 'Financial Reports';
      case 'accounts': return 'Chart of Accounts';
      case 'budget': return 'Budget Planning';
      case 'settings': return 'Accounting Settings';
      default: return 'Accounting Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground">
                {currentView === 'dashboard' ? 'Comprehensive Financial Management' : 'Financial Management System'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2">
              <Globe className="h-3 w-3" />
              Multi-Currency Enabled
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockData.overview.totalRevenue.amount, mockData.overview.totalRevenue.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockData.overview.totalExpenses.amount, mockData.overview.totalExpenses.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockData.overview.netProfit.amount, mockData.overview.netProfit.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+18% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockData.overview.outstandingFees.amount, mockData.overview.outstandingFees.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">15 overdue accounts</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockData.recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                            {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
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

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Send className="h-6 w-6" />
                      Send Invoice
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <CreditCard className="h-6 w-6" />
                      Record Payment
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <ShoppingCart className="h-6 w-6" />
                      Create PO
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Building2 className="h-6 w-6" />
                      Add Vendor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Student Fees View */}
        {currentView === 'student-fees' && (
          <div className="space-y-6">
            {/* Fee Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£285,420</div>
                  <p className="text-xs text-muted-foreground mt-1">156 students</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Collected This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£425,600</div>
                  <p className="text-xs text-muted-foreground mt-1">+18% vs last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
                  <Clock className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground mt-1">£45,200 overdue</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payment Plans</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground mt-1">Active installments</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Fee Management */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Student Accounts
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Fee
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Add Student Fee</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Student</label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="st001">John Smith (ST001)</SelectItem>
                                      <SelectItem value="st002">Sarah Johnson (ST002)</SelectItem>
                                      <SelectItem value="st003">Mike Brown (ST003)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Fee Type</label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select fee type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="tuition">Tuition Fee</SelectItem>
                                      <SelectItem value="boarding">Boarding Fee</SelectItem>
                                      <SelectItem value="activities">Activities Fee</SelectItem>
                                      <SelectItem value="transport">Transport Fee</SelectItem>
                                      <SelectItem value="meals">Meals Fee</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <Input placeholder="0.00" />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Currency</label>
                                  <Select defaultValue="GBP">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="GBP">£ GBP</SelectItem>
                                      <SelectItem value="USD">$ USD</SelectItem>
                                      <SelectItem value="EUR">€ EUR</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Due Date</label>
                                  <Input type="date" />
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Payment Plan</label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full">Full Payment</SelectItem>
                                    <SelectItem value="termly">Termly (3 installments)</SelectItem>
                                    <SelectItem value="monthly">Monthly (12 installments)</SelectItem>
                                    <SelectItem value="custom">Custom Plan</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea placeholder="Additional notes..." />
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button variant="outline">Cancel</Button>
                                <Button>Add Fee</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Year Group</TableHead>
                          <TableHead>Outstanding</TableHead>
                          <TableHead>Last Payment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { id: 'ST001', name: 'John Smith', year: 'Year 7', outstanding: 1200, currency: 'GBP', lastPayment: '2024-01-15', status: 'current' },
                          { id: 'ST002', name: 'Sarah Johnson', year: 'Year 8', outstanding: 0, currency: 'GBP', lastPayment: '2024-01-15', status: 'paid' },
                          { id: 'ST003', name: 'Mike Brown', year: 'Year 9', outstanding: 2400, currency: 'GBP', lastPayment: '2023-12-15', status: 'overdue' },
                          { id: 'ST004', name: 'Emily Davis', year: 'Year 10', outstanding: 600, currency: 'GBP', lastPayment: '2024-01-10', status: 'current' },
                          { id: 'ST005', name: 'Alex Wilson', year: 'Year 11', outstanding: 3600, currency: 'USD', lastPayment: '2024-01-08', status: 'current' }
                        ].map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.id}</p>
                              </div>
                            </TableCell>
                            <TableCell>{student.year}</TableCell>
                            <TableCell>
                              <span className={`font-semibold ${
                                student.outstanding > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {formatCurrency(student.outstanding, student.currency)}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">{student.lastPayment}</TableCell>
                            <TableCell>
                              <Badge variant={
                                student.status === 'paid' ? 'default' : 
                                student.status === 'overdue' ? 'destructive' : 'secondary'
                              }>
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Fee Structure & Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Fee Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { type: 'Tuition Fee', amount: 12000, currency: 'GBP', period: 'Annual' },
                      { type: 'Boarding Fee', amount: 8500, currency: 'GBP', period: 'Annual' },
                      { type: 'Activities Fee', amount: 800, currency: 'GBP', period: 'Annual' },
                      { type: 'Transport Fee', amount: 150, currency: 'GBP', period: 'Monthly' },
                      { type: 'Meals Fee', amount: 450, currency: 'GBP', period: 'Monthly' }
                    ].map((fee, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{fee.type}</p>
                          <p className="text-xs text-muted-foreground">{fee.period}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(fee.amount, fee.currency)}</p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Fee Structure
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Payment Reminders
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Fee Report
                    </Button>
                    <Button className="w-full" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Bulk Payment Entry
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Fee Calculator
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder content for other views */}
        {currentView === 'invoices' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Invoice management with multi-currency and tax calculations will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'bills' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Bills & Expenses Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bills and expense tracking with vendor management and multi-currency support will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'vendors' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Vendor Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive vendor management with multi-currency support will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'purchase-orders' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Purchase order management with approval workflows will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive financial reporting with multi-currency consolidation will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'accounts' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Chart of Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Chart of accounts with multi-currency support will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'budget' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Budget Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Budget planning and variance analysis will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {currentView === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Accounting Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Multi-currency settings, tax configuration, and system preferences will be implemented here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}