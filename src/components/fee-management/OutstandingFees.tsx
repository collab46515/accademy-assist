import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Send, Download, Eye, DollarSign, Clock, Users } from 'lucide-react';

const MOCK_FEES = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    studentId: 'STU2024001',
    feeType: 'Tuition Fee - Term 1',
    originalAmount: 3000,
    outstandingAmount: 1500,
    dueDate: '2024-01-15',
    daysPastDue: 10,
    status: 'overdue'
  }
];

export const OutstandingFees = () => {
  const [fees] = useState(MOCK_FEES);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'due_soon': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outstanding Fees</h1>
          <p className="text-muted-foreground">Track and manage overdue and upcoming fee payments</p>
        </div>
        <Button><Send className="h-4 w-4 mr-2" />Send Reminders</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold">£1,500</p>
              </div>
              <DollarSign className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Outstanding Fee Payments</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fee.studentName}</div>
                      <div className="text-sm text-muted-foreground">{fee.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{fee.feeType}</TableCell>
                  <TableCell>£{fee.outstandingAmount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-destructive font-medium">{fee.daysPastDue}</TableCell>
                  <TableCell><Badge className={getStatusColor(fee.status)}>{fee.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Send className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};