import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CreditCard, 
  Search, 
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText
} from "lucide-react";

interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  paidDate?: string;
  paymentMethod?: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: "card" | "bank-transfer" | "cash" | "cheque";
  transactionId: string;
  processedDate: string;
  status: "completed" | "pending" | "failed";
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    studentId: "STU001",
    studentName: "Emma Thompson",
    description: "Autumn Term Fees",
    amount: 2500.00,
    currency: "GBP",
    dueDate: "2024-01-31",
    status: "paid",
    paidDate: "2024-01-15",
    paymentMethod: "card"
  },
  {
    id: "INV-002",
    studentId: "STU002",
    studentName: "James Wilson",
    description: "School Trip - Paris",
    amount: 350.00,
    currency: "GBP",
    dueDate: "2024-02-15",
    status: "pending"
  },
  {
    id: "INV-003",
    studentId: "STU003",
    studentName: "Sophie Chen",
    description: "Music Lessons",
    amount: 180.00,
    currency: "GBP",
    dueDate: "2024-01-10",
    status: "overdue"
  },
  {
    id: "INV-004",
    studentId: "STU004",
    studentName: "Oliver Smith",
    description: "Sports Equipment",
    amount: 75.00,
    currency: "GBP",
    dueDate: "2024-02-01",
    status: "paid",
    paidDate: "2024-01-20",
    paymentMethod: "bank-transfer"
  }
];

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    amount: 2500.00,
    currency: "GBP",
    method: "card",
    transactionId: "TXN-20240115-001",
    processedDate: "2024-01-15 14:30",
    status: "completed"
  },
  {
    id: "PAY-002",
    invoiceId: "INV-004",
    amount: 75.00,
    currency: "GBP",
    method: "bank-transfer",
    transactionId: "TXN-20240120-002",
    processedDate: "2024-01-20 09:15",
    status: "completed"
  }
];

const FinancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices] = useState(mockInvoices);
  const [payments] = useState(mockPayments);

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "paid":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case "overdue":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
    }
  };

  const getMethodBadge = (method: Payment["method"]) => {
    const methodNames = {
      card: "Card",
      "bank-transfer": "Bank Transfer",
      cash: "Cash",
      cheque: "Cheque"
    };
    
    return <Badge variant="outline">{methodNames[method]}</Badge>;
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "pending").reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0);
  const totalInvoices = invoices.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Finance & Fee Management</h1>
        <p className="text-muted-foreground">Full financial operations with automated invoicing, payment plans, and multi-currency support</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-success">£{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">£{pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-destructive">£{overdueAmount.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-3xl font-bold text-primary">{totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Invoice Management</span>
                  </CardTitle>
                  <CardDescription>Create and manage student invoices and fees</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices by student, description, or invoice ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.studentName}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{invoice.amount.toFixed(2)} {invoice.currency}</span>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>{invoice.paidDate || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-1 justify-end">
                            <Button variant="ghost" size="sm">View</Button>
                            {invoice.status === "pending" && (
                              <Button variant="ghost" size="sm">Send</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>Payment Processing</span>
                  </CardTitle>
                  <CardDescription>Track and manage payment transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Processed Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.invoiceId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{payment.amount.toFixed(2)} {payment.currency}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getMethodBadge(payment.method)}</TableCell>
                        <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                        <TableCell>{payment.processedDate}</TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Financial Reports</span>
              </CardTitle>
              <CardDescription>Generate financial reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Financial Analytics</h3>
                <p className="text-muted-foreground">Detailed financial reports and revenue analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePage;