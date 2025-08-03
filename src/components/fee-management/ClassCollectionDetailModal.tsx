import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

interface ClassCollectionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string;
  data: {
    students: Array<{
      id: string;
      name: string;
      amountDue: number;
      amountPaid: number;
      status: string;
      dueDate: string;
    }>;
    summary: {
      totalStudents: number;
      totalDue: number;
      totalPaid: number;
      percentage: number;
    };
  };
}

export function ClassCollectionDetailModal({ open, onOpenChange, className, data }: ClassCollectionDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'pending':
        return 'destructive';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'paid';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Collection Details - {className}</DialogTitle>
          <DialogDescription>
            Detailed view of fee collection status for this class
          </DialogDescription>
        </DialogHeader>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">{data.summary.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">£{data.summary.totalDue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Due</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">£{data.summary.totalPaid.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Paid</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">{data.summary.percentage}%</div>
            <div className="text-sm text-muted-foreground">Collection Rate</div>
            <Progress value={data.summary.percentage} className="mt-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Send Reminders to Overdue
          </Button>
        </div>

        {/* Students Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.students.map((student) => {
                const outstanding = student.amountDue - student.amountPaid;
                const overdue = isOverdue(student.dueDate, student.status);
                
                return (
                  <TableRow key={student.id} className={overdue ? 'bg-destructive/5' : ''}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>£{student.amountDue.toFixed(2)}</TableCell>
                    <TableCell>£{student.amountPaid.toFixed(2)}</TableCell>
                    <TableCell className={outstanding > 0 ? 'text-destructive font-medium' : 'text-green-600'}>
                      £{outstanding.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(overdue ? 'overdue' : student.status)}>
                        {overdue ? 'Overdue' : student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(student.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {outstanding > 0 && (
                          <Button variant="ghost" size="sm">
                            Remind
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}