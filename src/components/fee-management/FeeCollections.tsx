import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Receipt, 
  Users, 
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Download,
  PoundSterling
} from 'lucide-react';

// Mock data - replace with actual data fetching
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    class: '7A',
    parentName: 'Sarah Smith',
    amountDue: 450.00,
    feeType: 'Tuition',
    status: 'not_paid',
    dueTime: 'morning',
    studentId: 'STU001'
  },
  {
    id: '2',
    name: 'Emma Johnson',
    class: '8B',
    parentName: 'Mike Johnson',
    amountDue: 250.00,
    feeType: 'Transport',
    status: 'partial',
    amountPaid: 100.00,
    dueTime: 'afternoon',
    studentId: 'STU002'
  },
  {
    id: '3',
    name: 'Oliver Brown',
    class: '7A',
    parentName: 'Lisa Brown',
    amountDue: 450.00,
    feeType: 'Tuition',
    status: 'paid',
    dueTime: 'morning',
    studentId: 'STU003'
  },
];

const mockCollectionSummary = {
  totalCollected: 2850.00,
  cashCollected: 1200.00,
  bankTransfers: 950.00,
  onlinePayments: 700.00,
  totalStudents: 45,
  paidStudents: 32,
  partialPayments: 8,
  pendingPayments: 5
};

interface Student {
  id: string;
  name: string;
  class: string;
  parentName: string;
  amountDue: number;
  feeType: string;
  status: 'not_paid' | 'partial' | 'paid';
  amountPaid?: number;
  dueTime: 'morning' | 'afternoon';
  studentId: string;
}

export default function FeeCollections() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [cashCounterMode, setCashCounterMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [showTotalCollectedModal, setShowTotalCollectedModal] = useState(false);
  const [showStudentsPaidModal, setShowStudentsPaidModal] = useState(false);
  const [showCashCollectedModal, setShowCashCollectedModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const { toast } = useToast();

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'cash',
    reference: '',
    notes: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesTime = timeFilter === 'all' || student.dueTime === timeFilter;
    
    return matchesSearch && matchesClass && matchesStatus && matchesTime;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'partial':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Partial</Badge>;
      case 'not_paid':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Not Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="w-4 h-4" />;
      case 'bank':
        return <CreditCard className="w-4 h-4" />;
      case 'online':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const handleQuickPayment = (student: Student) => {
    setSelectedStudentForPayment(student);
    setPaymentForm({
      amount: (student.amountDue - (student.amountPaid || 0)).toString(),
      paymentMethod: 'cash',
      reference: '',
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const recordPayment = () => {
    if (!selectedStudentForPayment) return;

    const amountPaid = parseFloat(paymentForm.amount);
    const totalDue = selectedStudentForPayment.amountDue;
    const previouslyPaid = selectedStudentForPayment.amountPaid || 0;
    const newTotalPaid = previouslyPaid + amountPaid;

    // Update student status
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudentForPayment.id) {
        return {
          ...student,
          amountPaid: newTotalPaid,
          status: newTotalPaid >= totalDue ? 'paid' as const : 'partial' as const
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowPaymentModal(false);
    
    toast({
      title: "Payment Recorded",
      description: `Payment of £${amountPaid} recorded for ${selectedStudentForPayment.name}`,
    });

    // Auto-print receipt
    printReceipt(selectedStudentForPayment, amountPaid, paymentForm.paymentMethod);
  };

  const printReceipt = (student: Student, amount: number, method: string) => {
    // Create receipt content
    const receiptContent = `
      <div style="width: 300px; font-family: monospace; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>St. Mary's School</h2>
          <p>Fee Payment Receipt</p>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Receipt #:</strong> REC${Date.now()}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Student:</strong> ${student.name}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Class:</strong> ${student.class}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Fee Type:</strong> ${student.feeType}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Amount Paid:</strong> £${amount.toFixed(2)}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Payment Method:</strong> ${method.toUpperCase()}
        </div>
        <div style="margin-top: 20px; text-align: center;">
          <p>Thank you for your payment</p>
        </div>
      </div>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleBulkPayment = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students for bulk payment",
        variant: "destructive"
      });
      return;
    }
    setShowBulkModal(true);
  };

  const processBulkPayment = () => {
    const updatedStudents = students.map(student => {
      if (selectedStudents.includes(student.id)) {
        return {
          ...student,
          amountPaid: student.amountDue,
          status: 'paid' as const
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setSelectedStudents([]);
    setShowBulkModal(false);
    
    toast({
      title: "Bulk Payment Processed",
      description: `${selectedStudents.length} payments recorded successfully`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Collections</h1>
          <p className="text-muted-foreground">Daily fee collection and payment recording</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={cashCounterMode ? "default" : "outline"}
            onClick={() => setCashCounterMode(!cashCounterMode)}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Cash Counter Mode
          </Button>
          <Button variant="outline" onClick={() => setShowReconciliationModal(true)}>
            <Receipt className="w-4 h-4 mr-2" />
            End of Day
          </Button>
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowTotalCollectedModal(true)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PoundSterling className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium">Total Collected</p>
                <p className="text-2xl font-bold text-success">£{mockCollectionSummary.totalCollected.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Click for breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowStudentsPaidModal(true)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Students Paid</p>
                <p className="text-2xl font-bold">{mockCollectionSummary.paidStudents}/{mockCollectionSummary.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Click for details</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCashCollectedModal(true)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Banknote className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium">Cash Collected</p>
                <p className="text-2xl font-bold">£{mockCollectionSummary.cashCollected.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Click for breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowPendingModal(true)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{mockCollectionSummary.pendingPayments}</p>
                <p className="text-xs text-muted-foreground">Click for list</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, ID, or parent name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="7A">7A</SelectItem>
                  <SelectItem value="8B">8B</SelectItem>
                  <SelectItem value="9C">9C</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_paid">Not Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Due Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedStudents.length > 0 && (
              <Button onClick={handleBulkPayment} className="whitespace-nowrap">
                <Users className="w-4 h-4 mr-2" />
                Bulk Pay ({selectedStudents.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Collection List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Collection List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-4 border rounded-lg transition-colors ${
                  cashCounterMode ? 'hover:bg-muted' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                    />
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{student.name}</h4>
                        <Badge variant="outline">{student.class}</Badge>
                        <Badge variant="secondary">{student.studentId}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Parent: {student.parentName} • {student.feeType} • Due: {student.dueTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        £{(student.amountDue - (student.amountPaid || 0)).toFixed(2)}
                      </div>
                      {student.amountPaid && (
                        <div className="text-sm text-muted-foreground">
                          Paid: £{student.amountPaid.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    {getStatusBadge(student.status)}
                    
                    {student.status !== 'paid' && (
                      <Button 
                        size={cashCounterMode ? "lg" : "sm"}
                        onClick={() => handleQuickPayment(student)}
                        className={cashCounterMode ? "text-lg px-6" : ""}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {cashCounterMode ? "PAY" : "Record Payment"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Recording Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          
          {selectedStudentForPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">{selectedStudentForPayment.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedStudentForPayment.class} • {selectedStudentForPayment.feeType}
                </p>
                <p className="text-sm">
                  Amount Due: £{(selectedStudentForPayment.amountDue - (selectedStudentForPayment.amountPaid || 0)).toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentForm.paymentMethod} onValueChange={(value) => setPaymentForm({...paymentForm, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input
                    id="reference"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                    placeholder="Optional reference"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                    placeholder="Optional notes"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button onClick={recordPayment}>
                  <Receipt className="w-4 h-4 mr-2" />
                  Record & Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Payment Modal */}
      <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Payment Processing</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">Selected Students ({selectedStudents.length})</h4>
              <div className="mt-2 space-y-1">
                {selectedStudents.map(id => {
                  const student = students.find(s => s.id === id);
                  return student ? (
                    <div key={id} className="text-sm flex justify-between">
                      <span>{student.name} ({student.class})</span>
                      <span>£{(student.amountDue - (student.amountPaid || 0)).toFixed(2)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBulkModal(false)}>
                Cancel
              </Button>
              <Button onClick={processBulkPayment}>
                Process Bulk Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* End of Day Reconciliation Modal */}
      <Dialog open={showReconciliationModal} onOpenChange={setShowReconciliationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>End of Day Reconciliation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Cash Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Cash Collected:</span>
                    <span className="font-semibold">£{mockCollectionSummary.cashCollected.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Transfers:</span>
                    <span className="font-semibold">£{mockCollectionSummary.bankTransfers.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online Payments:</span>
                    <span className="font-semibold">£{mockCollectionSummary.onlinePayments.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Collected:</span>
                    <span>£{mockCollectionSummary.totalCollected.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Collection Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Students Paid:</span>
                    <span className="font-semibold">{mockCollectionSummary.paidStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partial Payments:</span>
                    <span className="font-semibold">{mockCollectionSummary.partialPayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Payments:</span>
                    <span className="font-semibold">{mockCollectionSummary.pendingPayments}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Students:</span>
                    <span>{mockCollectionSummary.totalStudents}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-3">
              <Label>Cashier Notes</Label>
              <Textarea placeholder="Any notes or discrepancies..." rows={3} />
            </div>
            
            <div className="flex justify-between">
              <div className="space-y-2">
                <Label>Cashier Signature</Label>
                <Input placeholder="Cashier name" />
              </div>
              <div className="space-y-2">
                <Label>Supervisor Signature</Label>
                <Input placeholder="Supervisor name" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReconciliationModal(false)}>
                Save Draft
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Total Collected Drill-Down Modal */}
      <Dialog open={showTotalCollectedModal} onOpenChange={setShowTotalCollectedModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Total Collections Breakdown</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Banknote className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">Cash Payments</p>
                  <p className="text-xl font-bold">£{mockCollectionSummary.cashCollected.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((mockCollectionSummary.cashCollected / mockCollectionSummary.totalCollected) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Bank Transfers</p>
                  <p className="text-xl font-bold">£{mockCollectionSummary.bankTransfers.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((mockCollectionSummary.bankTransfers / mockCollectionSummary.totalCollected) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm text-muted-foreground">Online Payments</p>
                  <p className="text-xl font-bold">£{mockCollectionSummary.onlinePayments.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((mockCollectionSummary.onlinePayments / mockCollectionSummary.totalCollected) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Banknote className="h-4 w-4 text-warning" />
                      <div>
                        <p className="font-medium">John Smith - 7A</p>
                        <p className="text-sm text-muted-foreground">Tuition Fee - Cash</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">£450.00</p>
                      <p className="text-xs text-muted-foreground">09:15 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Emma Johnson - 8B</p>
                        <p className="text-sm text-muted-foreground">Transport Fee - Bank Transfer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">£100.00</p>
                      <p className="text-xs text-muted-foreground">10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-success" />
                      <div>
                        <p className="font-medium">Oliver Brown - 7A</p>
                        <p className="text-sm text-muted-foreground">Tuition Fee - Online</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">£450.00</p>
                      <p className="text-xs text-muted-foreground">11:45 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Students Paid Drill-Down Modal */}
      <Dialog open={showStudentsPaidModal} onOpenChange={setShowStudentsPaidModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Students Payment Status</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm text-muted-foreground">Fully Paid</p>
                  <p className="text-xl font-bold">{mockCollectionSummary.paidStudents}</p>
                  <p className="text-xs text-muted-foreground">Students completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">Partial Payments</p>
                  <p className="text-xl font-bold">{mockCollectionSummary.partialPayments}</p>
                  <p className="text-xs text-muted-foreground">Students with balance</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p className="text-sm text-muted-foreground">Not Paid</p>
                  <p className="text-xl font-bold">{mockCollectionSummary.pendingPayments}</p>
                  <p className="text-xs text-muted-foreground">Students pending</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="paid" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paid">Fully Paid ({mockCollectionSummary.paidStudents})</TabsTrigger>
                <TabsTrigger value="partial">Partial ({mockCollectionSummary.partialPayments})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({mockCollectionSummary.pendingPayments})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="paid" className="space-y-2">
                {students.filter(s => s.status === 'paid').map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.class} • {student.feeType}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />Paid
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">£{student.amountDue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="partial" className="space-y-2">
                {students.filter(s => s.status === 'partial').map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.class} • {student.feeType}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />Partial
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Paid: £{(student.amountPaid || 0).toFixed(2)} / £{student.amountDue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-2">
                {students.filter(s => s.status === 'not_paid').map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.class} • {student.feeType}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />Not Paid
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">£{student.amountDue.toFixed(2)} due</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cash Collected Drill-Down Modal */}
      <Dialog open={showCashCollectedModal} onOpenChange={setShowCashCollectedModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cash Collection Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Banknote className="h-6 w-6 text-warning" />
                    <h3 className="font-semibold">Cash Summary</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Cash Received:</span>
                      <span className="font-semibold">£{mockCollectionSummary.cashCollected.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of Cash Transactions:</span>
                      <span className="font-semibold">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Cash Payment:</span>
                      <span className="font-semibold">£{(mockCollectionSummary.cashCollected / 15).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calculator className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">Denominations</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>£50 notes:</span>
                      <span>8 × £400.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>£20 notes:</span>
                      <span>25 × £500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>£10 notes:</span>
                      <span>15 × £150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>£5 notes:</span>
                      <span>20 × £100.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coins:</span>
                      <span>£50.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash Transactions Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">John Smith (7A)</p>
                      <p className="text-sm text-muted-foreground">Tuition Fee • 09:15 AM</p>
                    </div>
                    <p className="font-semibold">£450.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Sarah Williams (8C)</p>
                      <p className="text-sm text-muted-foreground">Transport Fee • 09:45 AM</p>
                    </div>
                    <p className="font-semibold">£120.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Michael Brown (9A)</p>
                      <p className="text-sm text-muted-foreground">Lunch Fee • 10:20 AM</p>
                    </div>
                    <p className="font-semibold">£80.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Lucy Davis (7B)</p>
                      <p className="text-sm text-muted-foreground">Tuition Fee • 11:00 AM</p>
                    </div>
                    <p className="font-semibold">£450.00</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">James Wilson (8A)</p>
                      <p className="text-sm text-muted-foreground">Activity Fee • 11:30 AM</p>
                    </div>
                    <p className="font-semibold">£100.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pending Payments Drill-Down Modal */}
      <Dialog open={showPendingModal} onOpenChange={setShowPendingModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pending Payments ({mockCollectionSummary.pendingPayments})</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p className="text-sm text-muted-foreground">Total Pending Amount</p>
                  <p className="text-xl font-bold">£2,250.00</p>
                  <p className="text-xs text-muted-foreground">5 students outstanding</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">Average Days Overdue</p>
                  <p className="text-xl font-bold">3.2</p>
                  <p className="text-xs text-muted-foreground">Days past due date</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Pending Students List
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.filter(s => s.status === 'not_paid').map(student => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{student.name}</h4>
                            <Badge variant="outline">{student.class}</Badge>
                            <Badge variant="secondary">{student.studentId}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Parent: {student.parentName} • {student.feeType}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {student.dueTime} • Overdue by 2 days
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-destructive">£{student.amountDue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Outstanding</p>
                        </div>
                        
                        <Button size="sm" onClick={() => handleQuickPayment(student)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Send Reminders
                    </Button>
                    <Button size="sm" variant="outline">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Notice
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}