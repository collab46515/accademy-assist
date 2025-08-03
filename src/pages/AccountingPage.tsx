import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, TrendingUp, TrendingDown, DollarSign, FileText, CreditCard, Building2, Users, ShoppingCart, Package, BarChart3, PieChart, Activity, AlertCircle, CheckCircle, Plus, Search, Filter, Edit, Trash2, Download, Upload, Eye, Send, Calculator, Receipt, Banknote, Wallet, Target, ArrowUpRight, ArrowDownRight, RefreshCw, Archive, Settings, Bell, Mail, Phone, MapPin, Globe, Calendar as CalendarIcon, Printer, Share2, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalInvoiced: number;
  totalPaid: number;
  outstanding: number;
  status: 'active' | 'inactive';
}

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  status: 'pending' | 'approved' | 'paid';
  receipt?: string;
}

interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  tax: number;
  total: number;
  billDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
}

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
  category: string;
  status: 'cleared' | 'pending';
}

export function AccountingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerId: '1',
      customerName: 'Acme Corporation',
      amount: 5000,
      tax: 1000,
      total: 6000,
      issueDate: '2024-02-01',
      dueDate: '2024-03-01',
      status: 'sent',
      items: [
        { id: '1', description: 'Web Development Services', quantity: 40, rate: 125, amount: 5000 }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerId: '2',
      customerName: 'Tech Solutions Ltd',
      amount: 3500,
      tax: 700,
      total: 4200,
      issueDate: '2024-02-05',
      dueDate: '2024-03-05',
      status: 'paid',
      items: [
        { id: '2', description: 'Software Consultation', quantity: 28, rate: 125, amount: 3500 }
      ]
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerId: '3',
      customerName: 'Global Industries',
      amount: 7500,
      tax: 1500,
      total: 9000,
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'overdue',
      items: [
        { id: '3', description: 'System Integration', quantity: 60, rate: 125, amount: 7500 }
      ]
    }
  ];

  const customers: Customer[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+44 20 7946 0958',
      address: '123 Business Street, London, UK',
      totalInvoiced: 25000,
      totalPaid: 19000,
      outstanding: 6000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Tech Solutions Ltd',
      email: 'info@techsolutions.co.uk',
      phone: '+44 161 496 0000',
      address: '456 Innovation Ave, Manchester, UK',
      totalInvoiced: 18500,
      totalPaid: 18500,
      outstanding: 0,
      status: 'active'
    },
    {
      id: '3',
      name: 'Global Industries',
      email: 'accounts@global.com',
      phone: '+44 121 496 0000',
      address: '789 Commerce Road, Birmingham, UK',
      totalInvoiced: 42000,
      totalPaid: 33000,
      outstanding: 9000,
      status: 'active'
    }
  ];

  const expenses: Expense[] = [
    {
      id: '1',
      description: 'Office Rent - February',
      category: 'Office Expenses',
      amount: 2500,
      date: '2024-02-01',
      vendor: 'Property Management Ltd',
      status: 'paid'
    },
    {
      id: '2',
      description: 'Software Licenses',
      category: 'Technology',
      amount: 899,
      date: '2024-02-03',
      vendor: 'Adobe Systems',
      status: 'approved'
    },
    {
      id: '3',
      description: 'Marketing Campaign',
      category: 'Marketing',
      amount: 1500,
      date: '2024-02-05',
      vendor: 'Digital Marketing Pro',
      status: 'pending'
    }
  ];

  const bills: Bill[] = [
    {
      id: '1',
      billNumber: 'BILL-2024-001',
      vendorId: '1',
      vendorName: 'Office Supplies Co',
      amount: 450,
      tax: 90,
      total: 540,
      billDate: '2024-02-01',
      dueDate: '2024-02-28',
      status: 'pending'
    },
    {
      id: '2',
      billNumber: 'BILL-2024-002',
      vendorId: '2',
      vendorName: 'Internet Service Provider',
      amount: 199,
      tax: 40,
      total: 239,
      billDate: '2024-02-01',
      dueDate: '2024-02-28',
      status: 'paid'
    }
  ];

  const bankTransactions: BankTransaction[] = [
    {
      id: '1',
      date: '2024-02-08',
      description: 'Payment from Tech Solutions Ltd',
      type: 'credit',
      amount: 4200,
      balance: 45670,
      category: 'Sales Revenue',
      status: 'cleared'
    },
    {
      id: '2',
      date: '2024-02-07',
      description: 'Office Rent Payment',
      type: 'debit',
      amount: 2500,
      balance: 41470,
      category: 'Office Expenses',
      status: 'cleared'
    },
    {
      id: '3',
      date: '2024-02-06',
      description: 'Software License Fee',
      type: 'debit',
      amount: 899,
      balance: 43970,
      category: 'Technology',
      status: 'pending'
    }
  ];

  const handleCreateInvoice = () => {
    toast({ title: "Invoice Created", description: "New invoice has been created successfully." });
    setIsCreateInvoiceOpen(false);
  };

  const handleSendInvoice = (id: string) => {
    toast({ title: "Invoice Sent", description: "Invoice has been sent to the customer." });
  };

  const handleMarkPaid = (id: string) => {
    toast({ title: "Payment Recorded", description: "Invoice has been marked as paid." });
  };

  const handleApproveExpense = (id: string) => {
    toast({ title: "Expense Approved", description: "Expense has been approved for payment." });
  };

  // Calculate dashboard stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.total : 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.status !== 'paid' && inv.status !== 'cancelled' ? inv.total : 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.status === 'paid' ? exp.amount : 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounting & Finance</h1>
          <p className="text-muted-foreground">Complete financial management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Generate a new invoice for your customer</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input type="date" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea placeholder="Describe the work performed..." />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input type="number" placeholder="20" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateInvoice}>Create Invoice</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">£{totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="text-3xl font-bold text-orange-600">£{totalOutstanding.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoices.filter(i => i.status === 'overdue').length} overdue
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-600">£{totalExpenses.toLocaleString()}</p>
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      +5% from last month
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      £{netProfit.toLocaleString()}
                    </p>
                    <p className={`text-sm flex items-center mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netProfit >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {Math.abs(((netProfit / totalRevenue) * 100)).toFixed(1)}% margin
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used accounting functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setIsCreateInvoiceOpen(true)}>
                  <FileText className="h-6 w-6" />
                  <span>New Invoice</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Receipt className="h-6 w-6" />
                  <span>Record Expense</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Add Customer</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span>Record Payment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calculator className="h-6 w-6" />
                  <span>Tax Calculator</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity & Cash Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest invoice activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{invoice.total.toLocaleString()}</p>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'overdue' ? 'destructive' : 
                          invoice.status === 'sent' ? 'secondary' : 'outline'
                        }>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Summary</CardTitle>
                <CardDescription>Current month overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span>Money In</span>
                    </div>
                    <span className="font-medium text-green-600">£{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                      <span>Money Out</span>
                    </div>
                    <span className="font-medium text-red-600">£{totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="font-medium">Net Cash Flow</span>
                    </div>
                    <span className={`font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      £{netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Outstanding Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Overdue Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.filter(i => i.status === 'overdue').map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                        <p className="text-xs text-orange-600">Due: {invoice.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-600">£{invoice.total.toLocaleString()}</p>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4 mr-1" />
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Pending Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bills.filter(b => b.status === 'pending').map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <div>
                        <p className="font-medium">{bill.billNumber}</p>
                        <p className="text-sm text-muted-foreground">{bill.vendorName}</p>
                        <p className="text-xs text-blue-600">Due: {bill.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">£{bill.total.toLocaleString()}</p>
                        <Button size="sm" variant="outline">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Invoice Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage and track all your invoices</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" onClick={() => setIsCreateInvoiceOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                          <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                        </div>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'overdue' ? 'destructive' : 
                          invoice.status === 'sent' ? 'secondary' : 'outline'
                        }>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">£{invoice.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{invoice.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">£{invoice.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tax</p>
                        <p className="font-medium">£{invoice.tax.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button size="sm" onClick={() => handleSendInvoice(invoice.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      )}
                      {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkPaid(invoice.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Manage customer information and billing details</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <Card key={customer.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{customer.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </CardDescription>
                        </div>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{customer.address}</span>
                        </div>
                        <div className="pt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Invoiced</span>
                            <span className="font-medium">£{customer.totalInvoiced.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Paid</span>
                            <span className="font-medium text-green-600">£{customer.totalPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Outstanding</span>
                            <span className={`font-medium ${customer.outstanding > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              £{customer.outstanding.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          {/* Expense Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>Track and manage business expenses</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{expense.description}</h3>
                        <p className="text-sm text-muted-foreground">{expense.category} • {expense.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">£{expense.amount.toLocaleString()}</p>
                        <Badge variant={
                          expense.status === 'paid' ? 'default' : 
                          expense.status === 'approved' ? 'secondary' : 'outline'
                        }>
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{expense.date}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {expense.status === 'pending' && (
                          <Button size="sm" onClick={() => handleApproveExpense(expense.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-6">
          {/* Bill Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bills & Payables</CardTitle>
                  <CardDescription>Manage vendor bills and payments</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{bill.billNumber}</h3>
                        <p className="text-sm text-muted-foreground">{bill.vendorName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">£{bill.total.toLocaleString()}</p>
                        <Badge variant={
                          bill.status === 'paid' ? 'default' : 
                          bill.status === 'overdue' ? 'destructive' : 'secondary'
                        }>
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Bill Date</p>
                        <p className="font-medium">{bill.billDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-medium">{bill.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">£{bill.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tax</p>
                        <p className="font-medium">£{bill.tax.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {bill.status === 'pending' && (
                        <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Bill
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-6">
          {/* Banking & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Current Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">£45,670</p>
                <p className="text-sm text-muted-foreground">Available Balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Savings Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">£25,340</p>
                <p className="text-sm text-muted-foreground">Available Balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">£2,830</p>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Bank account activity</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bankTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {transaction.type === 'credit' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}£{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Balance: £{transaction.balance.toLocaleString()}</p>
                      <Badge variant={transaction.status === 'cleared' ? 'default' : 'secondary'} className="text-xs">
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
          {/* Reports & Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate comprehensive financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Profit & Loss Statement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="h-4 w-4 mr-2" />
                    Balance Sheet
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Cash Flow Statement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Sales Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    Expense Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="h-4 w-4 mr-2" />
                    Tax Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Intelligence</CardTitle>
                <CardDescription>Key financial metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Recurring Revenue</span>
                      <span className="font-medium text-green-600">£18,500</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Invoice Value</span>
                      <span className="font-medium">£6,400</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Collection Period</span>
                      <span className="font-medium">28 days</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expense Ratio</span>
                      <span className="font-medium text-orange-600">32%</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profit Margin</span>
                      <span className="font-medium text-green-600">68%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Settings & Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Your Company Ltd" />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input id="companyEmail" defaultValue="info@yourcompany.com" />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input id="companyPhone" defaultValue="+44 20 7946 0958" />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Address</Label>
                    <Textarea id="companyAddress" defaultValue="123 Business Street, London, UK" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>Configure invoice preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                    <Input id="invoicePrefix" defaultValue="INV-" />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" defaultValue="20" />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Default Payment Terms (days)</Label>
                    <Input id="paymentTerms" type="number" defaultValue="30" />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="GBP">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}