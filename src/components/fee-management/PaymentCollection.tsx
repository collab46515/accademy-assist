import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Receipt,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Download,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudentData } from '@/hooks/useStudentData';
import { useFeeData } from '@/hooks/useFeeData';

interface Payment {
  id: string;
  studentName: string;
  admissionNumber: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'cheque' | 'digital_wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt: Date;
  gateway?: string;
  feeType: string;
  parentEmail: string;
}

interface PaymentGatewayStats {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  totalAmount: number;
  transactionCount: number;
  successRate: number;
  fees: number;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    admissionNumber: 'ADM001',
    invoiceNumber: 'INV-2024-001',
    amount: 2500,
    paymentMethod: 'card',
    status: 'completed',
    transactionId: 'txn_1234567890',
    paidAt: new Date('2024-01-15'),
    gateway: 'Stripe',
    feeType: 'Tuition Fee',
    parentEmail: 'parent1@example.com'
  },
  {
    id: '2',
    studentName: 'Bob Smith',
    admissionNumber: 'ADM002',
    invoiceNumber: 'INV-2024-002',
    amount: 1200,
    paymentMethod: 'bank_transfer',
    status: 'pending',
    paidAt: new Date('2024-01-16'),
    gateway: 'Manual',
    feeType: 'Transport Fee',
    parentEmail: 'parent2@example.com'
  },
  {
    id: '3',
    studentName: 'Charlie Brown',
    admissionNumber: 'ADM003',
    invoiceNumber: 'INV-2024-003',
    amount: 300,
    paymentMethod: 'digital_wallet',
    status: 'completed',
    transactionId: 'pay_9876543210',
    paidAt: new Date('2024-01-17'),
    gateway: 'PayPal',
    feeType: 'Examination Fee',
    parentEmail: 'parent3@example.com'
  }
];

const GATEWAY_STATS: PaymentGatewayStats[] = [
  {
    name: 'Stripe',
    icon: CreditCard,
    totalAmount: 125420,
    transactionCount: 487,
    successRate: 98.2,
    fees: 3637
  },
  {
    name: 'PayPal',
    icon: Smartphone,
    totalAmount: 45680,
    transactionCount: 156,
    successRate: 96.8,
    fees: 1553
  },
  {
    name: 'Bank Transfer',
    icon: Banknote,
    totalAmount: 89320,
    transactionCount: 234,
    successRate: 99.1,
    fees: 0
  }
];

export const PaymentCollection = () => {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [showManualPayment, setShowManualPayment] = useState(false);
  const { toast } = useToast();

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return CreditCard;
      case 'bank_transfer': return Banknote;
      case 'digital_wallet': return Smartphone;
      case 'cash': return Banknote;
      case 'cheque': return Receipt;
      default: return CreditCard;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const totalCollected = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const todaysPayments = payments.filter(p => 
    p.paidAt.toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Collection</h2>
          <p className="text-muted-foreground">Track and manage fee payments from parents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Payments
          </Button>
          <Dialog open={showManualPayment} onOpenChange={setShowManualPayment}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Manual Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Manual Payment</DialogTitle>
              </DialogHeader>
              <ManualPaymentForm onCancel={() => setShowManualPayment(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Collections</p>
                <p className="text-2xl font-bold">£{totalCollected.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-warning">£{pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions Today</p>
                <p className="text-2xl font-bold text-primary">{todaysPayments}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-success">98.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment History
                </CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="card">Card Payment</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payments List */}
              <div className="space-y-3">
                {filteredPayments.map((payment) => {
                  const MethodIcon = getPaymentMethodIcon(payment.paymentMethod);
                  
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MethodIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.admissionNumber} • {payment.invoiceNumber}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {payment.feeType} • {payment.paidAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">£{payment.amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            via {payment.gateway}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(payment.status)}`} />
                          <Badge variant="outline">
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateways">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GATEWAY_STATS.map((gateway) => {
              const Icon = gateway.icon;
              
              return (
                <Card key={gateway.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {gateway.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-semibold">£{gateway.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transactions</p>
                        <p className="text-lg font-semibold">{gateway.transactionCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-semibold text-success">{gateway.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gateway Fees</p>
                        <p className="text-lg font-semibold">£{gateway.fees}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Reconciliation</h3>
                <p className="text-muted-foreground mb-4">
                  Automatically reconcile payments from different gateways and manual entries.
                </p>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Reconciliation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ManualPaymentForm = ({ onCancel }: { onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMethod: '',
    reference: '',
    notes: ''
  });

  const { students, loading: studentsLoading } = useStudentData();
  const { feeHeads } = useFeeData();

  console.log('PaymentCollection - Students:', students, 'Loading:', studentsLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle manual payment recording
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student">Student</Label>
        <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder={studentsLoading ? "Loading students..." : "Select student"} />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            {studentsLoading ? (
              <SelectItem value="loading" disabled>Loading students...</SelectItem>
            ) : students.length > 0 ? (
              students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.profiles?.first_name} {student.profiles?.last_name} ({student.student_number}) - {student.year_group}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-students" disabled>No students found</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (£)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Reference Number</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
          placeholder="Cheque number, transfer reference, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Record Payment
        </Button>
      </div>
    </form>
  );
};