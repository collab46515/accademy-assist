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
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccountingData } from '@/hooks/useAccountingData';
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
  Globe,
  Save,
  Trash,
  Settings,
  Bot
} from 'lucide-react';
import { AISchoolAssistant } from '@/components/shared/AISchoolAssistant';

export function AccountingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const form = useForm();
  
  const {
    isLoading,
    chartOfAccounts,
    vendors,
    invoices,
    bills,
    purchaseOrders,
    budgets,
    accountingSettings,
    createAccount,
    createVendor,
    createInvoice,
    createBill,
    createPurchaseOrder,
    createBudget,
    updateVendor,
    updateInvoice,
    updateAccountingSetting,
    formatCurrency,
    getNextInvoiceNumber,
    getNextBillNumber,
    getNextPONumber,
    refreshData
  } = useAccountingData();
  
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
    if (location.pathname === '/accounting/transactions/new') return 'new-transaction';
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
      case 'new-transaction': return 'New Transaction';
      case 'settings': return 'Accounting Settings';
      default: return 'Accounting Dashboard';
    }
  };

  // Mock data for dashboard overview - would be calculated from real data
  const mockDashboardData = {
    totalRevenue: { amount: 2450000, currency: 'GBP' },
    totalExpenses: { amount: 1850000, currency: 'GBP' },
    netProfit: { amount: 600000, currency: 'GBP' },
    outstandingFees: { amount: 285000, currency: 'GBP' },
    recentTransactions: [
      { id: '1', date: '2024-01-15', description: 'Tuition Fee - Year 7', amount: 1200, currency: 'GBP', type: 'income', status: 'completed' },
      { id: '2', date: '2024-01-14', description: 'Office Supplies', amount: -150, currency: 'GBP', type: 'expense', status: 'completed' },
      { id: '3', date: '2024-01-13', description: 'Lunch Fee - Student ID: ST001', amount: 25, currency: 'GBP', type: 'income', status: 'pending' },
      { id: '4', date: '2024-01-12', description: 'Utilities Payment', amount: -850, currency: 'GBP', type: 'expense', status: 'completed' }
    ]
  };

  // Mock student data for fees management
  const mockStudents = [
    { id: 'ST001', name: 'Emma Thompson', class: 'Year 9', outstandingFees: 2400, lastPayment: '2024-01-10', status: 'Overdue' },
    { id: 'ST002', name: 'James Wilson', class: 'Year 8', outstandingFees: 150, lastPayment: '2024-01-15', status: 'Current' },
    { id: 'ST003', name: 'Sophie Chen', class: 'Year 10', outstandingFees: 0, lastPayment: '2024-01-20', status: 'Paid' },
    { id: 'ST004', name: 'Oliver Smith', class: 'Year 7', outstandingFees: 300, lastPayment: '2024-01-12', status: 'Pending' },
    { id: 'ST005', name: 'Mia Johnson', class: 'Year 11', outstandingFees: 1200, lastPayment: '2024-01-08', status: 'Overdue' }
  ];

  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVendors = vendors.filter(vendor => 
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendor_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice => 
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBills = bills.filter(bill => 
    bill.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPurchaseOrders = purchaseOrders.filter(po => 
    po.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.po_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button size="sm" onClick={() => navigate('/accounting/transactions/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Navigation Tabs for Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/student-fees')}
              >
                <Users className="h-6 w-6" />
                <span className="text-xs">Student Fees</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/invoices')}
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs">Invoices</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/bills')}
              >
                <Receipt className="h-6 w-6" />
                <span className="text-xs">Bills</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/vendors')}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-xs">Vendors</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/purchase-orders')}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">Purchase Orders</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/accounts')}
              >
                <PieChart className="h-6 w-6" />
                <span className="text-xs">Chart of Accounts</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/budget')}
              >
                <Target className="h-6 w-6" />
                <span className="text-xs">Budget</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => navigate('/accounting/reports')}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">Reports</span>
              </Button>
            </div>
          </div>
        )}

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
                  <div className="text-2xl font-bold">{formatCurrency(mockDashboardData.totalRevenue.amount, mockDashboardData.totalRevenue.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockDashboardData.totalExpenses.amount, mockDashboardData.totalExpenses.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockDashboardData.netProfit.amount, mockDashboardData.netProfit.currency)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+18% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockDashboardData.outstandingFees.amount, mockDashboardData.outstandingFees.currency)}</div>
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
                    {mockDashboardData.recentTransactions.map((transaction) => (
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
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/accounting/invoices')}>
                      <Send className="h-6 w-6" />
                      Send Invoice
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/school-management/fee-management')}>
                      <CreditCard className="h-6 w-6" />
                      Record Payment
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/accounting/purchase-orders')}>
                      <ShoppingCart className="h-6 w-6" />
                      Create PO
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/accounting/vendors')}>
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

            {/* Student Fees Management Interface */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Fee Management
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
                    <Button variant="outline" size="sm" onClick={() => {
                      console.log('Filter clicked with search term:', searchTerm);
                      console.log('Filtered students:', filteredStudents);
                    }}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filter ({filteredStudents.length})
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAIAssistant(true)}
                      className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      AI Management Assistant
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No students found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Outstanding Fees</TableHead>
                        <TableHead>Last Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono">{student.id}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell className="font-semibold">
                            {student.outstandingFees > 0 
                              ? `OMR ${student.outstandingFees.toLocaleString()}` 
                              : 'OMR 0'}
                          </TableCell>
                          <TableCell>{student.lastPayment}</TableCell>
                          <TableCell>
                            <Badge variant={
                              student.status === 'Paid' ? 'default' :
                              student.status === 'Current' ? 'secondary' :
                              student.status === 'Pending' ? 'outline' : 'destructive'
                            }>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  console.log('Viewing student:', student);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => console.log('Sending reminder to:', student.name)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* AI School Management Assistant */}
            <AISchoolAssistant 
              studentData={filteredStudents}
              feeData={mockStudents}
              context="Student Fee Management Section"
              queryType="finance"
              isOpen={showAIAssistant}
              onClose={() => setShowAIAssistant(false)}
            />
          </div>
        )}

        {/* Vendors View */}
        {currentView === 'vendors' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Vendor Management
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Vendor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Vendor</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                          try {
                            await createVendor({
                              vendor_code: data.vendor_code,
                              vendor_name: data.vendor_name,
                              contact_person: data.contact_person,
                              email: data.email,
                              phone: data.phone,
                              address: {
                                street: data.street,
                                city: data.city,
                                postal_code: data.postal_code,
                                country: data.country
                              },
                              tax_number: data.tax_number,
                              payment_terms: data.payment_terms,
                              currency: data.currency,
                              is_active: true,
                              notes: data.notes,
                              bank_details: {}
                            });
                            form.reset();
                          } catch (error) {
                            console.error('Error creating vendor:', error);
                          }
                        })}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Vendor Code</label>
                              <Input {...form.register('vendor_code')} placeholder="VEN001" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Vendor Name</label>
                              <Input {...form.register('vendor_name')} placeholder="Vendor Name" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Contact Person</label>
                              <Input {...form.register('contact_person')} placeholder="John Smith" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input {...form.register('email')} type="email" placeholder="vendor@company.com" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Phone</label>
                              <Input {...form.register('phone')} placeholder="+44 20 1234 5678" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Tax Number</label>
                              <Input {...form.register('tax_number')} placeholder="VAT123456789" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Payment Terms</label>
                              <Select onValueChange={(value) => form.setValue('payment_terms', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment terms" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="net_15">Net 15 Days</SelectItem>
                                  <SelectItem value="net_30">Net 30 Days</SelectItem>
                                  <SelectItem value="net_60">Net 60 Days</SelectItem>
                                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Currency</label>
                              <Select onValueChange={(value) => form.setValue('currency', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GBP">£ GBP</SelectItem>
                                  <SelectItem value="USD">$ USD</SelectItem>
                                  <SelectItem value="EUR">€ EUR</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea {...form.register('notes')} placeholder="Additional notes..." />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button type="submit">Add Vendor</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading vendors...</div>
                ) : filteredVendors.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
                    <p className="text-muted-foreground">Get started by adding your first vendor.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Payment Terms</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{vendor.vendor_name}</p>
                              <p className="text-sm text-muted-foreground">{vendor.vendor_code}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{vendor.contact_person}</p>
                              <p className="text-xs text-muted-foreground">{vendor.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{vendor.currency}</TableCell>
                          <TableCell className="capitalize">{vendor.payment_terms.replace('_', ' ')}</TableCell>
                          <TableCell>
                            <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                              {vendor.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoices View */}
        {currentView === 'invoices' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoice Management
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Invoice
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Create New Invoice</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                          try {
                            await createInvoice({
                              invoice_number: getNextInvoiceNumber(),
                              customer_name: data.customer_name,
                              customer_email: data.customer_email,
                              customer_address: {
                                street: data.street,
                                city: data.city,
                                postal_code: data.postal_code
                              },
                              invoice_date: data.invoice_date,
                              due_date: data.due_date,
                              currency: data.currency,
                              subtotal: parseFloat(data.subtotal) || 0,
                              tax_amount: parseFloat(data.tax_amount) || 0,
                              discount_amount: parseFloat(data.discount_amount) || 0,
                              total_amount: parseFloat(data.total_amount) || 0,
                              paid_amount: 0,
                              balance_due: parseFloat(data.total_amount) || 0,
                              status: 'draft',
                              notes: data.notes,
                              terms_conditions: data.terms_conditions
                            });
                            form.reset();
                          } catch (error) {
                            console.error('Error creating invoice:', error);
                          }
                        })}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Customer Name</label>
                              <Input {...form.register('customer_name')} placeholder="Customer Name" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Customer Email</label>
                              <Input {...form.register('customer_email')} type="email" placeholder="customer@email.com" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Invoice Date</label>
                              <Input {...form.register('invoice_date')} type="date" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Due Date</label>
                              <Input {...form.register('due_date')} type="date" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Subtotal</label>
                              <Input {...form.register('subtotal')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Tax Amount</label>
                              <Input {...form.register('tax_amount')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Total Amount</label>
                              <Input {...form.register('total_amount')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Currency</label>
                            <Select onValueChange={(value) => form.setValue('currency', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GBP">£ GBP</SelectItem>
                                <SelectItem value="USD">$ USD</SelectItem>
                                <SelectItem value="EUR">€ EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea {...form.register('notes')} placeholder="Invoice notes..." />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button type="submit">Create Invoice</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading invoices...</div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                    <p className="text-muted-foreground">Create your first invoice to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{invoice.customer_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                          <TableCell>{formatCurrency(invoice.total_amount, invoice.currency)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              invoice.status === 'paid' ? 'default' : 
                              invoice.status === 'overdue' ? 'destructive' : 'secondary'
                            }>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
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
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bills View */}
        {currentView === 'bills' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Bills & Expenses Management
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search bills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Bill
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Bill</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                          try {
                            await createBill({
                              bill_number: getNextBillNumber(),
                              vendor_name: data.vendor_name,
                              bill_date: data.bill_date,
                              due_date: data.due_date,
                              currency: data.currency,
                              subtotal: parseFloat(data.subtotal) || 0,
                              tax_amount: parseFloat(data.tax_amount) || 0,
                              total_amount: parseFloat(data.total_amount) || 0,
                              paid_amount: 0,
                              balance_due: parseFloat(data.total_amount) || 0,
                              status: 'pending',
                              category: data.category,
                              description: data.description,
                              notes: data.notes
                            });
                            form.reset();
                          } catch (error) {
                            console.error('Error creating bill:', error);
                          }
                        })}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Vendor</label>
                              <Select onValueChange={(value) => form.setValue('vendor_name', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {vendors.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.vendor_name}>
                                      {vendor.vendor_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Category</label>
                              <Select onValueChange={(value) => form.setValue('category', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="utilities">Utilities</SelectItem>
                                  <SelectItem value="supplies">Office Supplies</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                  <SelectItem value="services">Professional Services</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Bill Date</label>
                              <Input {...form.register('bill_date')} type="date" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Due Date</label>
                              <Input {...form.register('due_date')} type="date" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Subtotal</label>
                              <Input {...form.register('subtotal')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Tax Amount</label>
                              <Input {...form.register('tax_amount')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Total Amount</label>
                              <Input {...form.register('total_amount')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea {...form.register('description')} placeholder="Bill description..." />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button type="submit">Add Bill</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading bills...</div>
                ) : filteredBills.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bills found</h3>
                    <p className="text-muted-foreground">Add your first bill to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill #</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">{bill.bill_number}</TableCell>
                          <TableCell>{bill.vendor_name}</TableCell>
                          <TableCell>{new Date(bill.bill_date).toLocaleDateString()}</TableCell>
                          <TableCell>{formatCurrency(bill.total_amount, bill.currency)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              bill.status === 'paid' ? 'default' : 
                              bill.status === 'overdue' ? 'destructive' : 'secondary'
                            }>
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Purchase Orders View */}
        {currentView === 'purchase-orders' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Purchase Orders
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search purchase orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create PO
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create Purchase Order</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                          try {
                            await createPurchaseOrder({
                              po_number: getNextPONumber(),
                              vendor_name: data.vendor_name,
                              order_date: data.order_date,
                              expected_delivery_date: data.expected_delivery_date,
                              currency: data.currency,
                              subtotal: parseFloat(data.subtotal) || 0,
                              tax_amount: parseFloat(data.tax_amount) || 0,
                              total_amount: parseFloat(data.total_amount) || 0,
                              status: 'draft',
                              delivery_address: {
                                street: data.delivery_street,
                                city: data.delivery_city,
                                postal_code: data.delivery_postal_code
                              },
                              notes: data.notes
                            });
                            form.reset();
                          } catch (error) {
                            console.error('Error creating purchase order:', error);
                          }
                        })}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Vendor</label>
                              <Select onValueChange={(value) => form.setValue('vendor_name', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {vendors.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.vendor_name}>
                                      {vendor.vendor_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Currency</label>
                              <Select onValueChange={(value) => form.setValue('currency', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GBP">£ GBP</SelectItem>
                                  <SelectItem value="USD">$ USD</SelectItem>
                                  <SelectItem value="EUR">€ EUR</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Order Date</label>
                              <Input {...form.register('order_date')} type="date" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Expected Delivery</label>
                              <Input {...form.register('expected_delivery_date')} type="date" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Subtotal</label>
                              <Input {...form.register('subtotal')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Tax Amount</label>
                              <Input {...form.register('tax_amount')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Total Amount</label>
                              <Input {...form.register('total_amount')} type="number" step="0.01" placeholder="0.00" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea {...form.register('notes')} placeholder="Purchase order notes..." />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button type="submit">Create PO</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading purchase orders...</div>
                ) : filteredPurchaseOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No purchase orders found</h3>
                    <p className="text-muted-foreground">Create your first purchase order to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO #</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchaseOrders.map((po) => (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">{po.po_number}</TableCell>
                          <TableCell>{po.vendor_name}</TableCell>
                          <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                          <TableCell>{formatCurrency(po.total_amount, po.currency)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              po.status === 'approved' ? 'default' : 
                              po.status === 'received' ? 'default' : 'secondary'
                            }>
                              {po.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart of Accounts View */}
        {currentView === 'accounts' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Chart of Accounts
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                        try {
                          await createAccount({
                            account_code: data.account_code,
                            account_name: data.account_name,
                            account_type: data.account_type,
                            balance_type: data.balance_type,
                            level: parseInt(data.level) || 1,
                            is_active: true,
                            description: data.description
                          });
                          form.reset();
                        } catch (error) {
                          console.error('Error creating account:', error);
                        }
                      })}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Account Code</label>
                            <Input {...form.register('account_code')} placeholder="1000" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Account Name</label>
                            <Input {...form.register('account_name')} placeholder="Cash" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Account Type</label>
                            <Select onValueChange={(value) => form.setValue('account_type', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asset">Asset</SelectItem>
                                <SelectItem value="liability">Liability</SelectItem>
                                <SelectItem value="equity">Equity</SelectItem>
                                <SelectItem value="revenue">Revenue</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Balance Type</label>
                            <Select onValueChange={(value) => form.setValue('balance_type', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select balance type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="debit">Debit</SelectItem>
                                <SelectItem value="credit">Credit</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea {...form.register('description')} placeholder="Account description..." />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline">Cancel</Button>
                          <Button type="submit">Add Account</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading chart of accounts...</div>
                ) : chartOfAccounts.length === 0 ? (
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
                    <p className="text-muted-foreground">Chart of accounts will be loaded automatically.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Balance Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartOfAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.account_code}</TableCell>
                          <TableCell>
                            <div style={{ paddingLeft: `${(account.level - 1) * 20}px` }}>
                              {account.account_name}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{account.account_type}</TableCell>
                          <TableCell className="capitalize">{account.balance_type}</TableCell>
                          <TableCell>
                            <Badge variant={account.is_active ? 'default' : 'secondary'}>
                              {account.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget View */}
        {currentView === 'budget' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Budget Planning
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Budget
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Budget</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={form.handleSubmit(async (data) => {
                        try {
                          await createBudget({
                            budget_name: data.budget_name,
                            fiscal_year: data.fiscal_year,
                            department: data.department,
                            period_type: data.period_type,
                            budgeted_amount: parseFloat(data.budgeted_amount) || 0,
                            actual_amount: 0,
                            variance: 0,
                            variance_percentage: 0,
                            currency: data.currency,
                            is_active: true,
                            notes: data.notes
                          });
                          form.reset();
                        } catch (error) {
                          console.error('Error creating budget:', error);
                        }
                      })}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Budget Name</label>
                            <Input {...form.register('budget_name')} placeholder="Annual Marketing Budget" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Fiscal Year</label>
                            <Input {...form.register('fiscal_year')} placeholder="2024-2025" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Department</label>
                            <Input {...form.register('department')} placeholder="Marketing" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Period Type</label>
                            <Select onValueChange={(value) => form.setValue('period_type', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Budgeted Amount</label>
                            <Input {...form.register('budgeted_amount')} type="number" step="0.01" placeholder="0.00" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Currency</label>
                            <Select onValueChange={(value) => form.setValue('currency', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GBP">£ GBP</SelectItem>
                                <SelectItem value="USD">$ USD</SelectItem>
                                <SelectItem value="EUR">€ EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <Textarea {...form.register('notes')} placeholder="Budget notes..." />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline">Cancel</Button>
                          <Button type="submit">Create Budget</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading budgets...</div>
                ) : budgets.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No budgets found</h3>
                    <p className="text-muted-foreground">Create your first budget to get started.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Budget Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Fiscal Year</TableHead>
                        <TableHead>Budgeted</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {budgets.map((budget) => (
                        <TableRow key={budget.id}>
                          <TableCell className="font-medium">{budget.budget_name}</TableCell>
                          <TableCell>{budget.department}</TableCell>
                          <TableCell>{budget.fiscal_year}</TableCell>
                          <TableCell>{formatCurrency(budget.budgeted_amount, budget.currency)}</TableCell>
                          <TableCell>{formatCurrency(budget.actual_amount, budget.currency)}</TableCell>
                          <TableCell>
                            <div className={`font-semibold ${
                              budget.variance > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {formatCurrency(Math.abs(budget.variance), budget.currency)}
                              <span className="text-xs ml-1">
                                ({budget.variance_percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports View */}
        {currentView === 'reports' && (
          <div className="space-y-6">
            {/* Report Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports Generated</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Viewed Report</CardTitle>
                  <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Profit & Loss</div>
                  <p className="text-xs text-muted-foreground mt-1">45 views this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Generated</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">2 hours ago</div>
                  <p className="text-xs text-muted-foreground mt-1">Balance Sheet</p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Reports */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Financial Reports
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="current-month">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
                        <PieChart className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-semibold">Profit & Loss</div>
                          <div className="text-xs text-muted-foreground">Revenue vs Expenses</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Profit & Loss Statement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Period: January 2024</h3>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Account</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-semibold">REVENUE</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Tuition Fees</TableCell>
                              <TableCell className="text-right">£425,600</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Activity Fees</TableCell>
                              <TableCell className="text-right">£45,200</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold">Total Revenue</TableCell>
                              <TableCell className="text-right font-semibold">£470,800</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold pt-4">EXPENSES</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Staff Salaries</TableCell>
                              <TableCell className="text-right">£185,000</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Utilities</TableCell>
                              <TableCell className="text-right">£25,400</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Supplies</TableCell>
                              <TableCell className="text-right">£15,600</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold">Total Expenses</TableCell>
                              <TableCell className="text-right font-semibold">£226,000</TableCell>
                            </TableRow>
                            <TableRow className="border-t-2">
                              <TableCell className="font-bold text-lg">NET PROFIT</TableCell>
                              <TableCell className="text-right font-bold text-lg text-green-600">£244,800</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
                        <BarChart3 className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-semibold">Balance Sheet</div>
                          <div className="text-xs text-muted-foreground">Assets vs Liabilities</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Balance Sheet</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">As of January 31, 2024</h3>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-4">ASSETS</h4>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-semibold">Current Assets</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Cash & Bank</TableCell>
                                  <TableCell className="text-right">£450,000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Accounts Receivable</TableCell>
                                  <TableCell className="text-right">£285,000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-semibold">Fixed Assets</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Buildings</TableCell>
                                  <TableCell className="text-right">£2,500,000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Equipment</TableCell>
                                  <TableCell className="text-right">£350,000</TableCell>
                                </TableRow>
                                <TableRow className="border-t">
                                  <TableCell className="font-bold">Total Assets</TableCell>
                                  <TableCell className="text-right font-bold">£3,585,000</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-4">LIABILITIES & EQUITY</h4>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-semibold">Current Liabilities</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Accounts Payable</TableCell>
                                  <TableCell className="text-right">£125,000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Accrued Expenses</TableCell>
                                  <TableCell className="text-right">£65,000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-semibold">Long-term Liabilities</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Mortgage</TableCell>
                                  <TableCell className="text-right">£1,200,000</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-semibold">Equity</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pl-4">Retained Earnings</TableCell>
                                  <TableCell className="text-right">£2,195,000</TableCell>
                                </TableRow>
                                <TableRow className="border-t">
                                  <TableCell className="font-bold">Total Liab. & Equity</TableCell>
                                  <TableCell className="text-right font-bold">£3,585,000</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
                        <TrendingUp className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-semibold">Cash Flow</div>
                          <div className="text-xs text-muted-foreground">Money In vs Out</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Cash Flow Statement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Period: January 2024</h3>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cash Flow Activity</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-semibold">Operating Activities</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Cash from Operations</TableCell>
                              <TableCell className="text-right text-green-600">£385,600</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Cash paid to Suppliers</TableCell>
                              <TableCell className="text-right text-red-600">-£165,000</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold">Net Operating Cash Flow</TableCell>
                              <TableCell className="text-right font-semibold text-green-600">£220,600</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold pt-4">Investing Activities</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Equipment Purchase</TableCell>
                              <TableCell className="text-right text-red-600">-£45,000</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold">Net Investing Cash Flow</TableCell>
                              <TableCell className="text-right font-semibold text-red-600">-£45,000</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold pt-4">Financing Activities</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pl-4">Loan Repayment</TableCell>
                              <TableCell className="text-right text-red-600">-£25,000</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-semibold">Net Financing Cash Flow</TableCell>
                              <TableCell className="text-right font-semibold text-red-600">-£25,000</TableCell>
                            </TableRow>
                            <TableRow className="border-t-2">
                              <TableCell className="font-bold text-lg">Net Change in Cash</TableCell>
                              <TableCell className="text-right font-bold text-lg text-green-600">£150,600</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
                        <Receipt className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-semibold">Accounts Receivable Aging</div>
                          <div className="text-xs text-muted-foreground">Outstanding Receivables</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Accounts Receivable Aging Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">As of: {new Date().toLocaleDateString()}</h3>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer</TableHead>
                              <TableHead className="text-right">Current</TableHead>
                              <TableHead className="text-right">1-30 Days</TableHead>
                              <TableHead className="text-right">31-60 Days</TableHead>
                              <TableHead className="text-right">61-90 Days</TableHead>
                              <TableHead className="text-right">Over 90 Days</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">ABC Academy</TableCell>
                              <TableCell className="text-right">£15,000</TableCell>
                              <TableCell className="text-right">£8,500</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right font-semibold">£23,500</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">XYZ School District</TableCell>
                              <TableCell className="text-right">£12,000</TableCell>
                              <TableCell className="text-right">£5,500</TableCell>
                              <TableCell className="text-right">£3,200</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right font-semibold">£20,700</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">City Education Board</TableCell>
                              <TableCell className="text-right">£8,000</TableCell>
                              <TableCell className="text-right">£2,500</TableCell>
                              <TableCell className="text-right">£1,800</TableCell>
                              <TableCell className="text-right">£950</TableCell>
                              <TableCell className="text-right text-red-600">£1,200</TableCell>
                              <TableCell className="text-right font-semibold">£14,450</TableCell>
                            </TableRow>
                            <TableRow className="border-t-2 bg-muted">
                              <TableCell className="font-bold">Total</TableCell>
                              <TableCell className="text-right font-bold">£35,000</TableCell>
                              <TableCell className="text-right font-bold">£16,500</TableCell>
                              <TableCell className="text-right font-bold">£5,000</TableCell>
                              <TableCell className="text-right font-bold">£950</TableCell>
                              <TableCell className="text-right font-bold text-red-600">£1,200</TableCell>
                              <TableCell className="text-right font-bold">£58,650</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
                        <CreditCard className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-semibold">Accounts Payable Aging</div>
                          <div className="text-xs text-muted-foreground">Outstanding Payables</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Accounts Payable Aging Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">As of: {new Date().toLocaleDateString()}</h3>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vendor</TableHead>
                              <TableHead className="text-right">Current</TableHead>
                              <TableHead className="text-right">1-30 Days</TableHead>
                              <TableHead className="text-right">31-60 Days</TableHead>
                              <TableHead className="text-right">61-90 Days</TableHead>
                              <TableHead className="text-right">Over 90 Days</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Office Supplies Ltd</TableCell>
                              <TableCell className="text-right">£5,500</TableCell>
                              <TableCell className="text-right">£2,200</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right font-semibold">£7,700</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tech Solutions Inc</TableCell>
                              <TableCell className="text-right">£12,000</TableCell>
                              <TableCell className="text-right">£8,500</TableCell>
                              <TableCell className="text-right">£3,200</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right">£0</TableCell>
                              <TableCell className="text-right font-semibold">£23,700</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Utilities Company</TableCell>
                              <TableCell className="text-right">£3,200</TableCell>
                              <TableCell className="text-right">£1,800</TableCell>
                              <TableCell className="text-right">£900</TableCell>
                              <TableCell className="text-right">£450</TableCell>
                              <TableCell className="text-right text-red-600">£650</TableCell>
                              <TableCell className="text-right font-semibold">£7,000</TableCell>
                            </TableRow>
                            <TableRow className="border-t-2 bg-muted">
                              <TableCell className="font-bold">Total</TableCell>
                              <TableCell className="text-right font-bold">£20,700</TableCell>
                              <TableCell className="text-right font-bold">£12,500</TableCell>
                              <TableCell className="text-right font-bold">£4,100</TableCell>
                              <TableCell className="text-right font-bold">£450</TableCell>
                              <TableCell className="text-right font-bold text-red-600">£650</TableCell>
                              <TableCell className="text-right font-bold">£38,400</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-32 flex-col gap-3 hover:bg-primary hover:text-primary-foreground transition-all">
                        <Target className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-semibold">Budget Variance</div>
                          <div className="text-xs text-muted-foreground">Budget vs Actual</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Budget Variance Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Period: January 2024</h3>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Account</TableHead>
                              <TableHead className="text-right">Budget</TableHead>
                              <TableHead className="text-right">Actual</TableHead>
                              <TableHead className="text-right">Variance</TableHead>
                              <TableHead className="text-right">Variance %</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Tuition Revenue</TableCell>
                              <TableCell className="text-right">£380,000</TableCell>
                              <TableCell className="text-right">£395,600</TableCell>
                              <TableCell className="text-right text-green-600">£15,600</TableCell>
                              <TableCell className="text-right text-green-600">+4.1%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Staff Salaries</TableCell>
                              <TableCell className="text-right">£245,000</TableCell>
                              <TableCell className="text-right">£248,500</TableCell>
                              <TableCell className="text-right text-red-600">-£3,500</TableCell>
                              <TableCell className="text-right text-red-600">-1.4%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Utilities</TableCell>
                              <TableCell className="text-right">£15,000</TableCell>
                              <TableCell className="text-right">£18,200</TableCell>
                              <TableCell className="text-right text-red-600">-£3,200</TableCell>
                              <TableCell className="text-right text-red-600">-21.3%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Supplies</TableCell>
                              <TableCell className="text-right">£12,000</TableCell>
                              <TableCell className="text-right">£9,800</TableCell>
                              <TableCell className="text-right text-green-600">£2,200</TableCell>
                              <TableCell className="text-right text-green-600">+18.3%</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Maintenance</TableCell>
                              <TableCell className="text-right">£8,500</TableCell>
                              <TableCell className="text-right">£11,200</TableCell>
                              <TableCell className="text-right text-red-600">-£2,700</TableCell>
                              <TableCell className="text-right text-red-600">-31.8%</TableCell>
                            </TableRow>
                            <TableRow className="border-t-2 bg-muted">
                              <TableCell className="font-bold">Net Variance</TableCell>
                              <TableCell className="text-right font-bold">£275,500</TableCell>
                              <TableCell className="text-right font-bold">£287,900</TableCell>
                              <TableCell className="text-right font-bold text-green-600">£12,400</TableCell>
                              <TableCell className="text-right font-bold text-green-600">+4.5%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recently Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Balance Sheet - January 2024</TableCell>
                      <TableCell><Badge variant="outline">Balance Sheet</Badge></TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>Jan 2024</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Profit & Loss - January 2024</TableCell>
                      <TableCell><Badge variant="outline">P&L</Badge></TableCell>
                      <TableCell>1 day ago</TableCell>
                      <TableCell>Jan 2024</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cash Flow - Q4 2023</TableCell>
                      <TableCell><Badge variant="outline">Cash Flow</Badge></TableCell>
                      <TableCell>3 days ago</TableCell>
                      <TableCell>Q4 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* New Transaction View */}
        {currentView === 'new-transaction' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transaction Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_code} - {account.account_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-8"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input placeholder="Transaction description" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reference Number</label>
                      <Input placeholder="Optional reference number" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Method</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="card">Card Payment</SelectItem>
                          <SelectItem value="online">Online Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea placeholder="Additional notes (optional)" rows={3} />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/accounting')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Transaction
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Accounting Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading settings...</div>
                ) : (
                  <div className="space-y-6">
                    {accountingSettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium capitalize">{setting.setting_key.replace('_', ' ')}</h4>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={setting.is_system_setting ? 'secondary' : 'outline'}>
                            {setting.is_system_setting ? 'System' : 'Custom'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}