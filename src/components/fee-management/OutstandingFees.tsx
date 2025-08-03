import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Mail, Phone, FileText, Download, Search, Filter, DollarSign, Calendar, Users, Send, Eye, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCSV } from '@/utils/exportHelpers';

interface OutstandingFee {
  id: string;
  studentName: string;
  studentId: string;
  yearGroup: string;
  feeType: string;
  originalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string;
  daysPastDue: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  lastReminderSent: string;
  reminderCount: number;
  status: 'current' | 'overdue' | 'severely_overdue';
  paymentPlan?: string;
}

const MOCK_OUTSTANDING_FEES: OutstandingFee[] = [
  {
    id: '1',
    studentName: 'Emma Johnson',
    studentId: 'STU2024089',
    yearGroup: 'Year 7',
    feeType: 'Tuition Fee',
    originalAmount: 1500,
    paidAmount: 500,
    outstandingAmount: 1000,
    dueDate: '2024-01-15',
    daysPastDue: 8,
    parentName: 'Sarah Johnson',
    parentEmail: 'sarah.johnson@email.com',
    parentPhone: '+44 7700 900123',
    lastReminderSent: '2024-01-20',
    reminderCount: 2,
    status: 'overdue'
  },
  {
    id: '2',
    studentName: 'James Wilson',
    studentId: 'STU2024156',
    yearGroup: 'Year 9',
    feeType: 'Transport Fee',
    originalAmount: 300,
    paidAmount: 0,
    outstandingAmount: 300,
    dueDate: '2023-12-01',
    daysPastDue: 55,
    parentName: 'Michael Wilson',
    parentEmail: 'michael.wilson@email.com',
    parentPhone: '+44 7700 900456',
    lastReminderSent: '2024-01-18',
    reminderCount: 4,
    status: 'severely_overdue',
    paymentPlan: 'Monthly Plan'
  },
  {
    id: '3',
    studentName: 'Sophie Davis',
    studentId: 'STU2024203',
    yearGroup: 'Year 11',
    feeType: 'Examination Fee',
    originalAmount: 200,
    paidAmount: 0,
    outstandingAmount: 200,
    dueDate: '2024-02-01',
    daysPastDue: 0,
    parentName: 'Linda Davis',
    parentEmail: 'linda.davis@email.com',
    parentPhone: '+44 7700 900789',
    lastReminderSent: '',
    reminderCount: 0,
    status: 'current'
  },
  {
    id: '4',
    studentName: 'Oliver Brown',
    studentId: 'STU2024087',
    yearGroup: 'Year 8',
    feeType: 'Activity Fee',
    originalAmount: 150,
    paidAmount: 75,
    outstandingAmount: 75,
    dueDate: '2024-01-10',
    daysPastDue: 13,
    parentName: 'Robert Brown',
    parentEmail: 'robert.brown@email.com',
    parentPhone: '+44 7700 900321',
    lastReminderSent: '2024-01-22',
    reminderCount: 1,
    status: 'overdue'
  }
];

export const OutstandingFees = () => {
  const [outstandingFees, setOutstandingFees] = useState<OutstandingFee[]>(MOCK_OUTSTANDING_FEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearGroupFilter, setYearGroupFilter] = useState<string>('all');
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('all');
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState<OutstandingFee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-success text-success-foreground';
      case 'overdue': return 'bg-warning text-warning-foreground';
      case 'severely_overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current': return 'Current';
      case 'overdue': return 'Overdue';
      case 'severely_overdue': return 'Severely Overdue';
      default: return status;
    }
  };

  const filteredFees = outstandingFees.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    const matchesYearGroup = yearGroupFilter === 'all' || fee.yearGroup === yearGroupFilter;
    const matchesFeeType = feeTypeFilter === 'all' || fee.feeType === feeTypeFilter;
    return matchesSearch && matchesStatus && matchesYearGroup && matchesFeeType;
  });

  const handleSendReminder = (feeId: string, reminderType: 'email' | 'sms') => {
    setOutstandingFees(fees => fees.map(fee => 
      fee.id === feeId 
        ? { 
            ...fee, 
            lastReminderSent: new Date().toISOString().split('T')[0],
            reminderCount: fee.reminderCount + 1
          }
        : fee
    ));
    toast.success(`${reminderType.charAt(0).toUpperCase() + reminderType.slice(1)} reminder sent successfully`);
  };

  const handleBulkReminders = (reminderType: 'email' | 'sms') => {
    if (selectedFees.length === 0) {
      toast.error('Please select fees to send reminders for');
      return;
    }

    selectedFees.forEach(feeId => {
      handleSendReminder(feeId, reminderType);
    });
    
    setSelectedFees([]);
    toast.success(`Bulk ${reminderType} reminders sent to ${selectedFees.length} recipients`);
  };

  const handleRecordPayment = () => {
    if (!selectedFee || paymentAmount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    setOutstandingFees(fees => fees.map(fee => 
      fee.id === selectedFee.id 
        ? { 
            ...fee, 
            paidAmount: fee.paidAmount + paymentAmount,
            outstandingAmount: fee.outstandingAmount - paymentAmount,
            status: fee.outstandingAmount - paymentAmount <= 0 ? 'current' : fee.status
          }
        : fee
    ));

    setShowPaymentDialog(false);
    setSelectedFee(null);
    setPaymentAmount(0);
    toast.success('Payment recorded successfully');
  };

  const handleExportFees = () => {
    try {
      const csvData = filteredFees.map(fee => ({
        'Student Name': fee.studentName,
        'Student ID': fee.studentId,
        'Year Group': fee.yearGroup,
        'Fee Type': fee.feeType,
        'Original Amount': `£${fee.originalAmount.toFixed(2)}`,
        'Paid Amount': `£${fee.paidAmount.toFixed(2)}`,
        'Outstanding Amount': `£${fee.outstandingAmount.toFixed(2)}`,
        'Due Date': new Date(fee.dueDate).toLocaleDateString(),
        'Days Past Due': fee.daysPastDue,
        'Status': fee.status,
        'Parent Name': fee.parentName,
        'Parent Email': fee.parentEmail,
        'Parent Phone': fee.parentPhone,
        'Payment Plan': fee.paymentPlan || 'None',
        'Reminder Count': fee.reminderCount,
        'Last Reminder': fee.lastReminderSent ? new Date(fee.lastReminderSent).toLocaleDateString() : 'Never'
      }));

      downloadCSV(csvData, 'outstanding_fees');
      toast.success('Outstanding fees exported successfully');
    } catch (error) {
      toast.error('Failed to export outstanding fees');
    }
  };

  const toggleFeeSelection = (feeId: string) => {
    setSelectedFees(prev => 
      prev.includes(feeId) 
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const selectAllFees = () => {
    setSelectedFees(filteredFees.map(fee => fee.id));
  };

  const clearSelection = () => {
    setSelectedFees([]);
  };

  // Analytics
  const totalOutstanding = outstandingFees.reduce((sum, fee) => sum + fee.outstandingAmount, 0);
  const currentFees = outstandingFees.filter(fee => fee.status === 'current');
  const overdueFees = outstandingFees.filter(fee => fee.status === 'overdue');
  const severelyOverdueFees = outstandingFees.filter(fee => fee.status === 'severely_overdue');
  const totalPaid = outstandingFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalOriginal = outstandingFees.reduce((sum, fee) => sum + fee.originalAmount, 0);
  const collectionRate = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;

  // Get unique values for filters
  const yearGroups = [...new Set(outstandingFees.map(fee => fee.yearGroup))];
  const feeTypes = [...new Set(outstandingFees.map(fee => fee.feeType))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outstanding Fees</h1>
          <p className="text-muted-foreground">Track and manage unpaid school fees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportFees}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          {selectedFees.length > 0 && (
            <>
              <Button variant="outline" onClick={() => handleBulkReminders('email')}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email ({selectedFees.length})
              </Button>
              <Button variant="outline" onClick={() => handleBulkReminders('sms')}>
                <Send className="h-4 w-4 mr-2" />
                Send SMS ({selectedFees.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold">£{totalOutstanding.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueFees.length + severelyOverdueFees.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
              </div>
              <div className="w-8">
                <Progress value={collectionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Fees</p>
                <p className="text-2xl font-bold">{currentFees.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students Affected</p>
                <p className="text-2xl font-bold">{outstandingFees.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, ID, or parent name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="severely_overdue">Severely Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearGroupFilter} onValueChange={setYearGroupFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearGroups.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={feeTypeFilter} onValueChange={setFeeTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Fee Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fee Types</SelectItem>
                {feeTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFees.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={selectAllFees}>
                  Select All ({filteredFees.length})
                </Button>
                <Button size="sm" variant="outline" onClick={clearSelection}>
                  Clear ({selectedFees.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Fees ({filteredFees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedFees.length === filteredFees.length}
                    onChange={() => selectedFees.length === filteredFees.length ? clearSelection() : selectAllFees()}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Fee Details</TableHead>
                <TableHead>Amounts</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reminders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedFees.includes(fee.id)}
                      onChange={() => toggleFeeSelection(fee.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fee.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {fee.studentId} • {fee.yearGroup}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Parent: {fee.parentName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fee.feeType}</div>
                      {fee.paymentPlan && (
                        <div className="text-sm text-muted-foreground">
                          Plan: {fee.paymentPlan}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Original: £{fee.originalAmount.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">Paid: £{fee.paidAmount.toLocaleString()}</div>
                      <div className="font-medium text-destructive">
                        Outstanding: £{fee.outstandingAmount.toLocaleString()}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-success h-2 rounded-full" 
                          style={{ width: `${(fee.paidAmount / fee.originalAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{new Date(fee.dueDate).toLocaleDateString()}</div>
                      {fee.daysPastDue > 0 && (
                        <div className="text-sm text-destructive font-medium">
                          {fee.daysPastDue} days overdue
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fee.status)}>
                      {getStatusLabel(fee.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Count: {fee.reminderCount}</div>
                      <div className="text-muted-foreground">
                        {fee.lastReminderSent ? new Date(fee.lastReminderSent).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleSendReminder(fee.id, 'email')}
                        title="Send Email Reminder"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleSendReminder(fee.id, 'sms')}
                        title="Send SMS"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedFee(fee);
                          setPaymentAmount(0);
                          setShowPaymentDialog(true);
                        }}
                        title="Record Payment"
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary by Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Current Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{currentFees.length}</div>
            <p className="text-sm text-muted-foreground">
              £{currentFees.reduce((sum, fee) => sum + fee.outstandingAmount, 0).toLocaleString()} outstanding
            </p>
            <Progress 
              value={currentFees.length > 0 ? (currentFees.reduce((sum, fee) => sum + fee.paidAmount, 0) / currentFees.reduce((sum, fee) => sum + fee.originalAmount, 0)) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-warning">Overdue Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{overdueFees.length}</div>
            <p className="text-sm text-muted-foreground">
              £{overdueFees.reduce((sum, fee) => sum + fee.outstandingAmount, 0).toLocaleString()} outstanding
            </p>
            <Progress 
              value={overdueFees.length > 0 ? (overdueFees.reduce((sum, fee) => sum + fee.paidAmount, 0) / overdueFees.reduce((sum, fee) => sum + fee.originalAmount, 0)) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Severely Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{severelyOverdueFees.length}</div>
            <p className="text-sm text-muted-foreground">
              £{severelyOverdueFees.reduce((sum, fee) => sum + fee.outstandingAmount, 0).toLocaleString()} outstanding
            </p>
            <Progress 
              value={severelyOverdueFees.length > 0 ? (severelyOverdueFees.reduce((sum, fee) => sum + fee.paidAmount, 0) / severelyOverdueFees.reduce((sum, fee) => sum + fee.originalAmount, 0)) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Payment Recording Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student</Label>
                  <p className="text-sm">{selectedFee.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fee Type</Label>
                  <p className="text-sm">{selectedFee.feeType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Original Amount</Label>
                  <p className="text-sm font-bold">£{selectedFee.originalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Paid So Far</Label>
                  <p className="text-sm font-bold text-success">£{selectedFee.paidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Outstanding</Label>
                  <p className="text-sm font-bold text-destructive">£{selectedFee.outstandingAmount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="payment-amount">Payment Amount (£)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  min="0"
                  max={selectedFee.outstandingAmount}
                  step="0.01"
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter payment amount"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecordPayment}>
                  Record Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};