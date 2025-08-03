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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PoundSterling className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium">Total Collected</p>
                <p className="text-2xl font-bold text-success">£{mockCollectionSummary.totalCollected.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Students Paid</p>
                <p className="text-2xl font-bold">{mockCollectionSummary.paidStudents}/{mockCollectionSummary.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Banknote className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium">Cash Collected</p>
                <p className="text-2xl font-bold">£{mockCollectionSummary.cashCollected.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{mockCollectionSummary.pendingPayments}</p>
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
    </div>
  );
}