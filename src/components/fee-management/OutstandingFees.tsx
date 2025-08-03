import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Mail, Phone, FileText, Download, Search, Filter } from 'lucide-react';

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
    status: 'overdue'
  }
];

export const OutstandingFees = () => {
  const [outstandingFees, setOutstandingFees] = useState<OutstandingFee[]>(MOCK_OUTSTANDING_FEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = outstandingFees.reduce((sum, fee) => sum + fee.outstandingAmount, 0);
  const currentFees = outstandingFees.filter(fee => fee.status === 'current');
  const overdueFees = outstandingFees.filter(fee => fee.status === 'overdue');
  const severelyOverdueFees = outstandingFees.filter(fee => fee.status === 'severely_overdue');

  const collectionRate = outstandingFees.length > 0 
    ? ((outstandingFees.reduce((sum, fee) => sum + fee.paidAmount, 0) / 
        outstandingFees.reduce((sum, fee) => sum + fee.originalAmount, 0)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outstanding Fees</h1>
          <p className="text-muted-foreground">Track and manage unpaid school fees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold">£{totalOutstanding.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
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
              <Clock className="h-8 w-8 text-warning" />
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
              <div className="w-full">
                <Progress value={collectionRate} className="mt-2" />
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
              <FileText className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
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
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="severely_overdue">Severely Overdue</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
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
                    </div>
                  </TableCell>
                  <TableCell>£{fee.originalAmount.toLocaleString()}</TableCell>
                  <TableCell>£{fee.paidAmount.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-destructive">
                    £{fee.outstandingAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {fee.daysPastDue > 0 ? (
                      <span className="text-destructive font-medium">
                        {fee.daysPastDue} days
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fee.status)}>
                      {getStatusLabel(fee.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" title="Send Email Reminder">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Call Parent">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="View Details">
                        <FileText className="h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};