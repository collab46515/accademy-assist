import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Calendar, CreditCard, Download, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_PLANS = [
  {
    id: '1',
    name: 'Quarterly Payment Plan',
    description: 'Pay tuition fees in 4 quarterly installments',
    frequency: 'quarterly',
    numberOfInstallments: 4,
    interestRate: 0,
    totalAmount: 12000,
    studentsEnrolled: 145,
    status: 'active'
  }
];

export const InstallmentPlans = () => {
  const [plans] = useState(MOCK_PLANS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Installment Plans</h1>
          <p className="text-muted-foreground">Manage fee payment installment plans and schedules</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Create Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold">{plans.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Installment Plans</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Installments</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.frequency}</TableCell>
                  <TableCell>{plan.numberOfInstallments}</TableCell>
                  <TableCell>£{plan.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{plan.studentsEnrolled}</TableCell>
                  <TableCell><Badge className="bg-success text-success-foreground">{plan.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
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