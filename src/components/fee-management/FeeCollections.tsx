import React, { useState, useEffect, useRef } from 'react';
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
  PoundSterling,
  Camera,
  Scan
} from 'lucide-react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

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
  const searchInputRef = useRef<HTMLInputElement>(null);
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
  const [showDetailedCashModal, setShowDetailedCashModal] = useState(false);
  const [showClassBreakdownModal, setShowClassBreakdownModal] = useState(false);
  const [showTimeBreakdownModal, setShowTimeBreakdownModal] = useState(false);
  const [showFeeTypeBreakdownModal, setShowFeeTypeBreakdownModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSupported, setScanSupported] = useState(false);
  const [showMarkAllVisibleModal, setShowMarkAllVisibleModal] = useState(false);
  const [showMarkAllClassModal, setShowMarkAllClassModal] = useState(false);
  const [selectedClassForBulk, setSelectedClassForBulk] = useState('');
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

  // Auto-focus search field when Cash Counter Mode is enabled
  useEffect(() => {
    if (cashCounterMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [cashCounterMode]);

  // Check if barcode scanning is supported
  useEffect(() => {
    const checkScanSupport = async () => {
      if (Capacitor.isNativePlatform()) {
        setScanSupported(true);
      } else {
        // Check if running on mobile web with camera support
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasCamera = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
        setScanSupported(isMobile && hasCamera);
      }
    };
    checkScanSupport();
  }, []);

  // USB Scanner support - listen for rapid keyboard input
  useEffect(() => {
    let scannerBuffer = '';
    let scannerTimeout: NodeJS.Timeout;

    const handleKeyInput = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Clear previous timeout
      clearTimeout(scannerTimeout);

      // Add character to buffer
      if (e.key.length === 1) {
        scannerBuffer += e.key;
      }

      // Check for Enter key (scanner typically sends Enter at the end)
      if (e.key === 'Enter' && scannerBuffer.length > 3) {
        e.preventDefault();
        handleScanResult(scannerBuffer.trim());
        scannerBuffer = '';
        return;
      }

      // Auto-process if buffer gets long enough (typical scanner input)
      scannerTimeout = setTimeout(() => {
        if (scannerBuffer.length > 3) {
          handleScanResult(scannerBuffer.trim());
        }
        scannerBuffer = '';
      }, 100);
    };

    document.addEventListener('keydown', handleKeyInput);
    return () => {
      document.removeEventListener('keydown', handleKeyInput);
      clearTimeout(scannerTimeout);
    };
  }, []);

  // Handle scan result
  const handleScanResult = (scannedValue: string) => {
    const foundStudent = students.find(student => 
      student.studentId.toLowerCase() === scannedValue.toLowerCase() ||
      student.name.toLowerCase().includes(scannedValue.toLowerCase())
    );

    if (foundStudent) {
      setSearchTerm(scannedValue);
      
      // Auto-open payment modal in cash counter mode
      if (cashCounterMode && foundStudent.status !== 'paid') {
        handleQuickPayment(foundStudent);
      }
      
      toast({
        title: "Student Found",
        description: `${foundStudent.name} (${foundStudent.class}) - ${foundStudent.feeType}`,
      });
    } else {
      setSearchTerm(scannedValue);
      toast({
        title: "Student Not Found",
        description: `No student found with ID: ${scannedValue}`,
        variant: "destructive"
      });
    }
  };

  // Camera-based barcode scanning
  const startCameraScan = async () => {
    try {
      setIsScanning(true);
      
      // Request camera permission and start scanning
      const permission = await BarcodeScanner.checkPermission({ force: true });
      
      if (permission.granted) {
        // Hide the web content
        document.body.classList.add('barcode-scanner-active');
        
        const result = await BarcodeScanner.startScan();
        
        if (result.hasContent) {
          handleScanResult(result.content);
        }
      } else {
        toast({
          title: "Camera Permission Required",
          description: "Please allow camera access to scan barcodes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Scanning error:', error);
      toast({
        title: "Scanning Error",
        description: "Unable to start camera scanner",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      document.body.classList.remove('barcode-scanner-active');
      BarcodeScanner.stopScan();
    }
  };

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

  const recordPayment = async () => {
    if (!selectedStudentForPayment) return;

    const amountPaid = parseFloat(paymentForm.amount);
    const totalDue = selectedStudentForPayment.amountDue;
    const previouslyPaid = selectedStudentForPayment.amountPaid || 0;
    const newTotalPaid = previouslyPaid + amountPaid;

    try {
      // Insert payment record into database with auto-generated receipt number
      const { data: paymentRecord, error } = await supabase
        .from('payment_records')
        .insert({
          school_id: '00000000-0000-0000-0000-000000000000', // Default school ID for now
          student_id: '00000000-0000-0000-0000-000000000000', // Mock student ID 
          amount: amountPaid,
          payment_method: paymentForm.paymentMethod,
          reference_number: paymentForm.reference,
          notes: paymentForm.notes,
          status: 'completed',
          // Additional fields from our migration
          student_name: selectedStudentForPayment.name,
          student_class: selectedStudentForPayment.class,
          parent_name: selectedStudentForPayment.parentName,
          fee_type: selectedStudentForPayment.feeType,
          amount_due: totalDue,
          amount_paid: amountPaid,
          cashier_name: 'Current User' // This should be from auth context
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update student status in local state
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
        description: `Receipt ${paymentRecord.receipt_number} - Payment of £${amountPaid} recorded for ${selectedStudentForPayment.name}`,
      });

      // Auto-print receipt with proper receipt number
      printReceipt(selectedStudentForPayment, amountPaid, paymentForm.paymentMethod, paymentRecord.receipt_number);
      
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const printReceipt = (student: Student, amount: number, method: string, receiptNumber?: string) => {
    const finalReceiptNumber = receiptNumber || `REC${Date.now()}`;
    // Create receipt content
    const receiptContent = `
      <div style="width: 300px; font-family: monospace; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>St. Mary's School</h2>
          <p>Fee Payment Receipt</p>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Receipt #:</strong> ${finalReceiptNumber}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Time:</strong> ${new Date().toLocaleTimeString()}
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

  // Mark all visible students as paid
  const markAllVisibleAsPaid = () => {
    const unpaidVisibleStudents = filteredStudents.filter(s => s.status !== 'paid');
    
    if (unpaidVisibleStudents.length === 0) {
      toast({
        title: "No Unpaid Students",
        description: "All visible students are already paid",
        variant: "destructive"
      });
      return;
    }
    
    setShowMarkAllVisibleModal(true);
  };

  const confirmMarkAllVisible = () => {
    const unpaidVisibleStudents = filteredStudents.filter(s => s.status !== 'paid');
    const updatedStudents = students.map(student => {
      if (unpaidVisibleStudents.find(vs => vs.id === student.id)) {
        return {
          ...student,
          amountPaid: student.amountDue,
          status: 'paid' as const
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowMarkAllVisibleModal(false);
    
    toast({
      title: "Bulk Payment Completed",
      description: `${unpaidVisibleStudents.length} students marked as paid`,
    });
  };

  // Mark all students in a class as paid
  const markAllInClassAsPaid = (className: string) => {
    const classStudents = students.filter(s => s.class === className && s.status !== 'paid');
    
    if (classStudents.length === 0) {
      toast({
        title: "No Unpaid Students",
        description: `All students in ${className} are already paid`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedClassForBulk(className);
    setShowMarkAllClassModal(true);
  };

  const confirmMarkAllClass = () => {
    const classStudents = students.filter(s => s.class === selectedClassForBulk && s.status !== 'paid');
    const updatedStudents = students.map(student => {
      if (classStudents.find(cs => cs.id === student.id)) {
        return {
          ...student,
          amountPaid: student.amountDue,
          status: 'paid' as const
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowMarkAllClassModal(false);
    setSelectedClassForBulk('');
    
    toast({
      title: "Class Payment Completed",
      description: `${classStudents.length} students in ${selectedClassForBulk} marked as paid`,
    });
  };

  // CSV Export Functions
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded`,
    });
  };

  const exportStudentsList = () => {
    const data = students.map(student => ({
      'Student Name': student.name,
      'Student ID': student.studentId,
      'Class': student.class,
      'Parent Name': student.parentName,
      'Fee Type': student.feeType,
      'Amount Due': student.amountDue,
      'Amount Paid': student.amountPaid || 0,
      'Outstanding': student.amountDue - (student.amountPaid || 0),
      'Status': student.status,
      'Due Time': student.dueTime
    }));

    exportToCSV(
      data,
      `fee-collections-${new Date().toISOString().split('T')[0]}.csv`,
      ['Student Name', 'Student ID', 'Class', 'Parent Name', 'Fee Type', 'Amount Due', 'Amount Paid', 'Outstanding', 'Status', 'Due Time']
    );
  };

  const exportPendingPayments = () => {
    const data = students.filter(s => s.status === 'not_paid').map(student => ({
      'Student Name': student.name,
      'Student ID': student.studentId,
      'Class': student.class,
      'Parent Name': student.parentName,
      'Fee Type': student.feeType,
      'Amount Due': student.amountDue,
      'Days Overdue': '2',
      'Due Time': student.dueTime
    }));

    exportToCSV(
      data,
      `pending-payments-${new Date().toISOString().split('T')[0]}.csv`,
      ['Student Name', 'Student ID', 'Class', 'Parent Name', 'Fee Type', 'Amount Due', 'Days Overdue', 'Due Time']
    );
  };

  const exportCollectionsSummary = () => {
    const data = [{
      'Date': new Date().toLocaleDateString(),
      'Total Collected': mockCollectionSummary.totalCollected,
      'Cash Collected': mockCollectionSummary.cashCollected,
      'Bank Transfers': mockCollectionSummary.bankTransfers,
      'Online Payments': mockCollectionSummary.onlinePayments,
      'Total Students': mockCollectionSummary.totalStudents,
      'Paid Students': mockCollectionSummary.paidStudents,
      'Partial Payments': mockCollectionSummary.partialPayments,
      'Pending Payments': mockCollectionSummary.pendingPayments
    }];

    exportToCSV(
      data,
      `daily-collections-summary-${new Date().toISOString().split('T')[0]}.csv`,
      ['Date', 'Total Collected', 'Cash Collected', 'Bank Transfers', 'Online Payments', 'Total Students', 'Paid Students', 'Partial Payments', 'Pending Payments']
    );
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
                  ref={searchInputRef}
                  placeholder={cashCounterMode ? "Start typing student name or scan ID..." : "Search by student name, ID, or parent name..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${cashCounterMode ? 'text-lg py-3' : ''} ${scanSupported ? 'pr-12' : ''}`}
                />
                {scanSupported && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={startCameraScan}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <div className="animate-spin">
                        <Camera className="h-4 w-4" />
                      </div>
                    ) : (
                      <Scan className="h-4 w-4" />
                    )}
                  </Button>
                )}
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
            
            <Button variant="outline" onClick={exportStudentsList}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            
            <Button variant="outline" onClick={markAllVisibleAsPaid}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Visible
            </Button>
            
            <Select onValueChange={(value) => markAllInClassAsPaid(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mark Class Paid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7A">Mark 7A Paid</SelectItem>
                <SelectItem value="8B">Mark 8B Paid</SelectItem>
                <SelectItem value="9C">Mark 9C Paid</SelectItem>
              </SelectContent>
            </Select>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Total Collections Breakdown
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={exportCollectionsSummary}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowClassBreakdownModal(true)}>
                  Class Breakdown
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowTimeBreakdownModal(true)}>
                  Time Analysis
                </Button>
              </div>
            </DialogTitle>
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
            <DialogTitle className="flex items-center justify-between">
              Cash Collection Details
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowDetailedCashModal(true)}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Detailed Analysis
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  const cashData = students.filter(s => s.status === 'paid').map(s => ({
                    'Student': s.name,
                    'Class': s.class,
                    'Amount': s.amountDue,
                    'Fee Type': s.feeType,
                    'Time': '09:15 AM'
                  }));
                  exportToCSV(cashData, `cash-transactions-${new Date().toISOString().split('T')[0]}.csv`, 
                    ['Student', 'Class', 'Amount', 'Fee Type', 'Time']);
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Cash
                </Button>
              </div>
            </DialogTitle>
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

      {/* Class Breakdown Modal */}
      <Dialog open={showClassBreakdownModal} onOpenChange={setShowClassBreakdownModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Class-wise Collection Analysis
              <Button size="sm" variant="outline" onClick={() => {
                const classData = ['7A', '8B', '9C'].map(cls => ({
                  'Class': cls,
                  'Total Students': students.filter(s => s.class === cls).length,
                  'Paid Students': students.filter(s => s.class === cls && s.status === 'paid').length,
                  'Total Due': students.filter(s => s.class === cls).reduce((sum, s) => sum + s.amountDue, 0),
                  'Total Collected': students.filter(s => s.class === cls).reduce((sum, s) => sum + (s.amountPaid || 0), 0),
                  'Outstanding': students.filter(s => s.class === cls).reduce((sum, s) => sum + (s.amountDue - (s.amountPaid || 0)), 0)
                }));
                exportToCSV(classData, `class-breakdown-${new Date().toISOString().split('T')[0]}.csv`, 
                  ['Class', 'Total Students', 'Paid Students', 'Total Due', 'Total Collected', 'Outstanding']);
              }}>
                <Download className="w-4 h-4 mr-2" />
                Export Class Data
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['7A', '8B', '9C'].map(cls => {
                const classStudents = students.filter(s => s.class === cls);
                const paidStudents = classStudents.filter(s => s.status === 'paid').length;
                const totalDue = classStudents.reduce((sum, s) => sum + s.amountDue, 0);
                const totalCollected = classStudents.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
                const collectionRate = totalDue > 0 ? (totalCollected / totalDue) * 100 : 0;
                
                return (
                  <Card key={cls} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold">Class {cls}</h3>
                        <p className="text-sm text-muted-foreground">{classStudents.length} students</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Collection Rate:</span>
                          <span className="font-semibold">{collectionRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Students Paid:</span>
                          <span className="font-semibold">{paidStudents}/{classStudents.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Total Collected:</span>
                          <span className="font-semibold">£{totalCollected.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Outstanding:</span>
                          <span className="font-semibold text-destructive">£{(totalDue - totalCollected).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Tabs defaultValue="7A" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="7A">Class 7A</TabsTrigger>
                <TabsTrigger value="8B">Class 8B</TabsTrigger>
                <TabsTrigger value="9C">Class 9C</TabsTrigger>
              </TabsList>
              
              {['7A', '8B', '9C'].map(cls => (
                <TabsContent key={cls} value={cls} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Payment Status Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {['paid', 'partial', 'not_paid'].map(status => {
                            const count = students.filter(s => s.class === cls && s.status === status).length;
                            const percentage = students.filter(s => s.class === cls).length > 0 
                              ? (count / students.filter(s => s.class === cls).length) * 100 
                              : 0;
                            return (
                              <div key={status} className="flex justify-between">
                                <span className="capitalize">{status.replace('_', ' ')}:</span>
                                <span className="font-semibold">{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Fee Type Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {['Tuition', 'Transport', 'Activity'].map(feeType => {
                            const classStudentsWithFee = students.filter(s => s.class === cls && s.feeType === feeType);
                            const collected = classStudentsWithFee.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
                            return (
                              <div key={feeType} className="flex justify-between">
                                <span>{feeType}:</span>
                                <span className="font-semibold">£{collected.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Student Details - Class {cls}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {students.filter(s => s.class === cls).map(student => (
                          <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.feeType} • {student.dueTime}</p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(student.status)}
                              <p className="text-sm text-muted-foreground mt-1">
                                £{(student.amountPaid || 0).toFixed(2)} / £{student.amountDue.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Breakdown Modal */}
      <Dialog open={showTimeBreakdownModal} onOpenChange={setShowTimeBreakdownModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Time-based Collection Analysis
              <Button size="sm" variant="outline" onClick={() => {
                const timeData = [
                  {
                    'Time Period': 'Morning (8:00-12:00)',
                    'Total Collections': '£1,650.00',
                    'Number of Transactions': '18',
                    'Average Payment': '£91.67',
                    'Payment Methods': 'Cash: 60%, Bank: 25%, Online: 15%'
                  },
                  {
                    'Time Period': 'Afternoon (12:00-17:00)',
                    'Total Collections': '£1,200.00',
                    'Number of Transactions': '14',
                    'Average Payment': '£85.71',
                    'Payment Methods': 'Cash: 45%, Bank: 35%, Online: 20%'
                  }
                ];
                exportToCSV(timeData, `time-analysis-${new Date().toISOString().split('T')[0]}.csv`, 
                  ['Time Period', 'Total Collections', 'Number of Transactions', 'Average Payment', 'Payment Methods']);
              }}>
                <Download className="w-4 h-4 mr-2" />
                Export Time Data
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">Morning Collections</h3>
                    <p className="text-sm text-muted-foreground">8:00 AM - 12:00 PM</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Collected:</span>
                      <span className="font-bold text-success">£1,650.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions:</span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Payment:</span>
                      <span className="font-semibold">£91.67</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Hour:</span>
                      <span className="font-semibold">10:00-11:00 AM</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Payment Methods</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cash:</span>
                        <span>60% (£990.00)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bank Transfer:</span>
                        <span>25% (£412.50)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Online:</span>
                        <span>15% (£247.50)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
                    <h3 className="text-lg font-semibold">Afternoon Collections</h3>
                    <p className="text-sm text-muted-foreground">12:00 PM - 5:00 PM</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Collected:</span>
                      <span className="font-bold text-success">£1,200.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions:</span>
                      <span className="font-semibold">14</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Payment:</span>
                      <span className="font-semibold">£85.71</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Hour:</span>
                      <span className="font-semibold">2:00-3:00 PM</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Payment Methods</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cash:</span>
                        <span>45% (£540.00)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bank Transfer:</span>
                        <span>35% (£420.00)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Online:</span>
                        <span>20% (£240.00)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hourly Collection Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { time: '8-9 AM', amount: 320, transactions: 4 },
                    { time: '9-10 AM', amount: 480, transactions: 6 },
                    { time: '10-11 AM', amount: 650, transactions: 7 },
                    { time: '11-12 PM', amount: 200, transactions: 1 },
                    { time: '12-1 PM', amount: 150, transactions: 2 },
                    { time: '1-2 PM', amount: 250, transactions: 3 },
                    { time: '2-3 PM', amount: 450, transactions: 5 },
                    { time: '3-4 PM', amount: 350, transactions: 4 }
                  ].map((hour, index) => (
                    <div key={index} className="text-center p-3 border rounded">
                      <p className="font-semibold">{hour.time}</p>
                      <p className="text-sm text-success font-medium">£{hour.amount}</p>
                      <p className="text-xs text-muted-foreground">{hour.transactions} transactions</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Cash Modal */}
      <Dialog open={showDetailedCashModal} onOpenChange={setShowDetailedCashModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Detailed Cash Analysis
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  const cashData = students.filter(s => s.status === 'paid').map(s => ({
                    'Student': s.name,
                    'Class': s.class,
                    'Amount': s.amountDue,
                    'Fee Type': s.feeType,
                    'Time': '09:15 AM',
                    'Cashier': 'John Doe'
                  }));
                  exportToCSV(cashData, `cash-transactions-${new Date().toISOString().split('T')[0]}.csv`, 
                    ['Student', 'Class', 'Amount', 'Fee Type', 'Time', 'Cashier']);
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Cash Data
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowDetailedCashModal(false)}>
                  Close
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Banknote className="h-6 w-6 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">Cash Float Start</p>
                  <p className="text-lg font-bold">£500.00</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calculator className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Cash Received</p>
                  <p className="text-lg font-bold">£{mockCollectionSummary.cashCollected.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <PoundSterling className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm text-muted-foreground">Expected Till</p>
                  <p className="text-lg font-bold">£{(500 + mockCollectionSummary.cashCollected).toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm text-muted-foreground">Till Variance</p>
                  <p className="text-lg font-bold text-success">£0.00</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Largest Cash Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">John Smith (7A)</span>
                      <span className="font-bold">£450.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">Lucy Davis (7B)</span>
                      <span className="font-bold">£450.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">Sarah Williams (8C)</span>
                      <span className="font-bold">£120.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cash Payment Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>£400+ payments:</span>
                      <span className="font-semibold">3 payments</span>
                    </div>
                    <div className="flex justify-between">
                      <span>£100-399 payments:</span>
                      <span className="font-semibold">8 payments</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Under £100 payments:</span>
                      <span className="font-semibold">4 payments</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Cash Payments:</span>
                      <span>15 payments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner UI Overlay */}
      {isScanning && (
        <div className="barcode-scanner-ui">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Scanning for Student ID</h2>
            <p className="text-lg opacity-75">Point camera at barcode or QR code</p>
          </div>
          
          <div className="scanner-frame mb-8">
            {/* Scanner animation line is handled by CSS */}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                setIsScanning(false);
                document.body.classList.remove('barcode-scanner-active');
                BarcodeScanner.stopScan();
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel Scan
            </Button>
          </div>
        </div>
      )}

      {/* Mark All Visible Confirmation Modal */}
      <Dialog open={showMarkAllVisibleModal} onOpenChange={setShowMarkAllVisibleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span>Confirm Bulk Payment</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-semibold text-warning mb-2">Mark All Visible Students as Paid</h4>
              <p className="text-sm text-muted-foreground mb-3">
                This will mark all currently visible students as fully paid. This action cannot be easily undone.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Visible Students:</span>
                  <span className="font-semibold">{filteredStudents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unpaid Students:</span>
                  <span className="font-semibold text-warning">
                    {filteredStudents.filter(s => s.status !== 'paid').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-semibold text-success">
                    £{filteredStudents
                      .filter(s => s.status !== 'paid')
                      .reduce((sum, s) => sum + (s.amountDue - (s.amountPaid || 0)), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded text-sm">
              <h5 className="font-medium mb-1">Students to be marked as paid:</h5>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredStudents.filter(s => s.status !== 'paid').map(student => (
                  <div key={student.id} className="flex justify-between">
                    <span>{student.name} ({student.class})</span>
                    <span>£{(student.amountDue - (student.amountPaid || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMarkAllVisibleModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmMarkAllVisible} className="bg-warning hover:bg-warning/90">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark All Class Confirmation Modal */}
      <Dialog open={showMarkAllClassModal} onOpenChange={setShowMarkAllClassModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span>Confirm Class Payment</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-semibold text-warning mb-2">Mark All Class {selectedClassForBulk} as Paid</h4>
              <p className="text-sm text-muted-foreground mb-3">
                This will mark all students in Class {selectedClassForBulk} as fully paid. This action cannot be easily undone.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Students in Class:</span>
                  <span className="font-semibold">
                    {students.filter(s => s.class === selectedClassForBulk).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unpaid Students:</span>
                  <span className="font-semibold text-warning">
                    {students.filter(s => s.class === selectedClassForBulk && s.status !== 'paid').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-semibold text-success">
                    £{students
                      .filter(s => s.class === selectedClassForBulk && s.status !== 'paid')
                      .reduce((sum, s) => sum + (s.amountDue - (s.amountPaid || 0)), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded text-sm">
              <h5 className="font-medium mb-1">Students to be marked as paid:</h5>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {students
                  .filter(s => s.class === selectedClassForBulk && s.status !== 'paid')
                  .map(student => (
                    <div key={student.id} className="flex justify-between">
                      <span>{student.name}</span>
                      <span>£{(student.amountDue - (student.amountPaid || 0)).toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMarkAllClassModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmMarkAllClass} className="bg-warning hover:bg-warning/90">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}