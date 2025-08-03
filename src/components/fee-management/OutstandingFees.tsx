import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Send, Download, Eye, DollarSign, Clock, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface OutstandingFee {
  id: string;
  studentName: string;
  studentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  feeType: string;
  originalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string;
  daysPastDue: number;
  lastReminderSent: string;
  reminderCount: number;
  status: 'overdue' | 'due_soon' | 'payment_plan' | 'pending';
  paymentPlan?: {
    planName: string;
    nextInstallmentDate: string;
    nextInstallmentAmount: number;
  };
}

const MOCK_OUTSTANDING_FEES: OutstandingFee[] = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    studentId: 'STU2024001',
    parentName: 'Mary Johnson',
    parentEmail: 'mary.johnson@email.com',
    parentPhone: '07700 900123',
    feeType: 'Tuition Fee - Term 1',
    originalAmount: 3000,
    paidAmount: 1500,
    outstandingAmount: 1500,
    dueDate: '2024-01-15',
    daysPastDue: 10,
    lastReminderSent: '2024-01-20',
    reminderCount: 2,
    status: 'overdue'
  },
  {
    id: '2',
    studentName: 'Bob Smith',
    studentId: 'STU2024002',
    parentName: 'John Smith',
    parentEmail: 'john.smith@email.com',
    parentPhone: '07700 900124',
    feeType: 'Transport Fee',
    originalAmount: 150,
    paidAmount: 0,
    outstandingAmount: 150,
    dueDate: '2024-02-01',
    daysPastDue: 0,
    lastReminderSent: '2024-01-25',
    reminderCount: 1,
    status: 'due_soon'
  },
  {
    id: '3',
    studentName: 'Carol Williams',
    studentId: 'STU2024003',
    parentName: 'Sarah Williams',
    parentEmail: 'sarah.williams@email.com',
    parentPhone: '07700 900125',
    feeType: 'Tuition Fee - Term 1',
    originalAmount: 3000,
    paidAmount: 750,
    outstandingAmount: 2250,
    dueDate: '2024-01-15',
    daysPastDue: 25,
    lastReminderSent: '2024-01-18',
    reminderCount: 3,
    status: 'payment_plan',
    paymentPlan: {
      planName: 'Monthly Payment Plan',
      nextInstallmentDate: '2024-02-15',
      nextInstallmentAmount: 750
    }
  }
];

export const OutstandingFees = () => {
  const [fees, setFees] = useState<OutstandingFee[]>(MOCK_OUTSTANDING_FEES);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState<OutstandingFee | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'due_soon': return 'bg-warning text-warning-foreground';
      case 'payment_plan': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'overdue': return 'Overdue';
      case 'due_soon': return 'Due Soon';
      case 'payment_plan': return 'Payment Plan';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const getPriorityLevel = (fee: OutstandingFee) => {
    if (fee.daysPastDue > 30) return 'High';
    if (fee.daysPastDue > 7) return 'Medium';
    if (fee.status === 'due_soon') return 'Low';
    return 'Normal';
  };

  const handleSendReminder = (feeId: string) => {
    setFees(fees.map(fee => 
      fee.id === feeId 
        ? { 
            ...fee, 
            lastReminderSent: new Date().toISOString().split('T')[0],
            reminderCount: fee.reminderCount + 1
          }
        : fee
    ));
    toast.success('Reminder sent successfully');
  };

  const handleViewDetails = (fee: OutstandingFee) => {
    setSelectedFee(fee);
    setShowDetailsDialog(true);
  };

  const handleSendBulkReminders = () => {
    toast.success('Bulk reminders sent successfully');
    setShowReminderDialog(false);
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csvContent = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportFees = () => {
    try {
      const csvData = fees.map(fee => ({
        'Student Name': fee.studentName,
        'Student ID': fee.studentId,
        'Parent Name': fee.parentName,
        'Parent Email': fee.parentEmail,
        'Fee Type': fee.feeType,
        'Original Amount': `£${fee.originalAmount.toLocaleString()}`,
        'Paid Amount': `£${fee.paidAmount.toLocaleString()}`,
        'Outstanding Amount': `£${fee.outstandingAmount.toLocaleString()}`,
        'Due Date': new Date(fee.dueDate).toLocaleDateString(),
        'Days Past Due': fee.daysPastDue,
        'Status': getStatusLabel(fee.status),
        'Reminder Count': fee.reminderCount,
        'Last Reminder': new Date(fee.lastReminderSent).toLocaleDateString(),
        'Priority': getPriorityLevel(fee)
      }));

      downloadCSV(csvData, 'outstanding_fees');
      toast.success('Outstanding fees exported successfully');
    } catch (error) {
      toast.error('Failed to export outstanding fees');
    }
  };

  const filteredFees = filterStatus === 'all' 
    ? fees 
    : fees.filter(fee => fee.status === filterStatus);

  const totalOutstanding = fees.reduce((sum, fee) => sum + fee.outstandingAmount, 0);
  const overdueCount = fees.filter(fee => fee.status === 'overdue').length;
  const dueSoonCount = fees.filter(fee => fee.status === 'due_soon').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outstanding Fees</h1>
          <p className="text-muted-foreground">Track and manage overdue and upcoming fee payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportFees}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Bulk Reminders
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Payment Reminders</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reminder-type">Reminder Type</Label>
                  <Select>
                    <SelectTrigger className="bg-background border border-border">
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="overdue">Overdue Payment Reminder</SelectItem>
                      <SelectItem value="due_soon">Payment Due Soon</SelectItem>
                      <SelectItem value="final">Final Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger className="bg-background border border-border">
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="all_overdue">All Overdue Payments</SelectItem>
                      <SelectItem value="due_this_week">Due This Week</SelectItem>
                      <SelectItem value="high_priority">High Priority Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Custom Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Add a custom message to the reminder..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendBulkReminders}>
                    Send Reminders
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold">£{totalOutstanding.toLocaleString()}</p>
                <p className="text-xs text-destructive mt-1">Needs attention</p>
              </div>
              <DollarSign className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('overdue')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-xs text-destructive mt-1">Immediate action required</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('due_soon')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold">{dueSoonCount}</p>
                <p className="text-xs text-warning mt-1">Within 7 days</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('payment_plan')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Plans</p>
                <p className="text-2xl font-bold">{fees.filter(f => f.status === 'payment_plan').length}</p>
                <p className="text-xs text-primary mt-1">Active plans</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Label htmlFor="status-filter">Filter by Status:</Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-background border border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="due_soon">Due Soon</SelectItem>
            <SelectItem value="payment_plan">Payment Plan</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setFilterStatus('all')}>
          Clear Filter
        </Button>
      </div>

      {/* Outstanding Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Outstanding Fee Payments
            <div className="flex gap-2">
              <Badge variant="destructive">{overdueCount} overdue</Badge>
              <Badge variant="secondary">{filteredFees.length} showing</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Reminders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{fee.studentName}</div>
                      <div className="text-sm text-muted-foreground">{fee.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{fee.feeType}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">£{fee.outstandingAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        of £{fee.originalAmount.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className={fee.daysPastDue > 0 ? 'text-destructive font-medium' : ''}>
                      {fee.daysPastDue > 0 ? fee.daysPastDue : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{fee.reminderCount}</div>
                      <div className="text-sm text-muted-foreground">
                        Last: {new Date(fee.lastReminderSent).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fee.status)}>
                      {getStatusLabel(fee.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(fee)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleSendReminder(fee.id)}>
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

      {/* Fee Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Outstanding Fee Details</DialogTitle>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <p className="font-medium">{selectedFee.studentName}</p>
                </div>
                <div>
                  <Label>Student ID</Label>
                  <p className="font-medium">{selectedFee.studentId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Parent Name</Label>
                  <p className="font-medium">{selectedFee.parentName}</p>
                </div>
                <div>
                  <Label>Parent Email</Label>
                  <p className="font-medium">{selectedFee.parentEmail}</p>
                </div>
              </div>
              <div>
                <Label>Fee Type</Label>
                <p className="font-medium">{selectedFee.feeType}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Original Amount</Label>
                  <p className="font-medium">£{selectedFee.originalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Paid Amount</Label>
                  <p className="font-medium">£{selectedFee.paidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Outstanding</Label>
                  <p className="font-medium text-destructive">£{selectedFee.outstandingAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <p className="font-medium">{new Date(selectedFee.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Days Past Due</Label>
                  <p className={`font-medium ${selectedFee.daysPastDue > 0 ? 'text-destructive' : ''}`}>
                    {selectedFee.daysPastDue > 0 ? selectedFee.daysPastDue : 'Not overdue'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reminder Count</Label>
                  <p className="font-medium">{selectedFee.reminderCount}</p>
                </div>
                <div>
                  <Label>Last Reminder</Label>
                  <p className="font-medium">{new Date(selectedFee.lastReminderSent).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedFee.paymentPlan && (
                <div className="p-4 bg-muted rounded-md">
                  <Label>Payment Plan</Label>
                  <div className="mt-2 space-y-1">
                    <p><strong>Plan:</strong> {selectedFee.paymentPlan.planName}</p>
                    <p><strong>Next Payment:</strong> £{selectedFee.paymentPlan.nextInstallmentAmount.toLocaleString()}</p>
                    <p><strong>Due:</strong> {new Date(selectedFee.paymentPlan.nextInstallmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => handleSendReminder(selectedFee.id)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};