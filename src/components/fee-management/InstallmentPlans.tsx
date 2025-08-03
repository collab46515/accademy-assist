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
import { Plus, Edit, Trash2, Calendar, CreditCard, Users, Calculator } from 'lucide-react';

interface InstallmentPlan {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  numberOfInstallments: number;
  frequency: string; // 'monthly', 'termly', 'quarterly'
  startDate: string;
  endDate: string;
  interestRate: number;
  status: 'active' | 'inactive' | 'completed';
  studentsEnrolled: number;
  installments: {
    installmentNumber: number;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }[];
}

const MOCK_INSTALLMENT_PLANS: InstallmentPlan[] = [
  {
    id: '1',
    name: 'Termly Payment Plan',
    description: 'Three equal payments throughout the academic year',
    totalAmount: 4500,
    numberOfInstallments: 3,
    frequency: 'termly',
    startDate: '2024-09-01',
    endDate: '2024-07-31',
    interestRate: 0,
    status: 'active',
    studentsEnrolled: 247,
    installments: [
      { installmentNumber: 1, dueDate: '2024-09-15', amount: 1500, status: 'paid' },
      { installmentNumber: 2, dueDate: '2024-01-15', amount: 1500, status: 'pending' },
      { installmentNumber: 3, dueDate: '2024-04-15', amount: 1500, status: 'pending' }
    ]
  },
  {
    id: '2',
    name: 'Monthly Payment Plan',
    description: 'Ten monthly payments for easier budgeting',
    totalAmount: 4500,
    numberOfInstallments: 10,
    frequency: 'monthly',
    startDate: '2024-09-01',
    endDate: '2024-06-30',
    interestRate: 2.5,
    status: 'active',
    studentsEnrolled: 89,
    installments: [
      { installmentNumber: 1, dueDate: '2024-09-01', amount: 465, status: 'paid' },
      { installmentNumber: 2, dueDate: '2024-10-01', amount: 465, status: 'paid' },
      { installmentNumber: 3, dueDate: '2024-11-01', amount: 465, status: 'paid' },
      { installmentNumber: 4, dueDate: '2024-12-01', amount: 465, status: 'overdue' }
    ]
  },
  {
    id: '3',
    name: 'Flexible Payment Plan',
    description: 'Custom payment schedule for special circumstances',
    totalAmount: 3600,
    numberOfInstallments: 6,
    frequency: 'custom',
    startDate: '2024-09-01',
    endDate: '2024-07-31',
    interestRate: 1.5,
    status: 'active',
    studentsEnrolled: 34,
    installments: [
      { installmentNumber: 1, dueDate: '2024-09-15', amount: 800, status: 'paid' },
      { installmentNumber: 2, dueDate: '2024-11-01', amount: 600, status: 'pending' }
    ]
  }
];

export const InstallmentPlans = () => {
  const [plans, setPlans] = useState<InstallmentPlan[]>(MOCK_INSTALLMENT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getInstallmentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalStudentsEnrolled = plans.reduce((sum, plan) => sum + plan.studentsEnrolled, 0);
  const activePlans = plans.filter(plan => plan.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Installment Plans</h1>
          <p className="text-muted-foreground">Manage flexible payment schedules for school fees</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Installment Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input id="name" placeholder="e.g., Monthly Payment Plan" />
                </div>
                <div>
                  <Label htmlFor="frequency">Payment Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="termly">Termly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Plan description..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalAmount">Total Amount (£)</Label>
                  <Input id="totalAmount" type="number" placeholder="4500" />
                </div>
                <div>
                  <Label htmlFor="installments">Number of Installments</Label>
                  <Input id="installments" type="number" placeholder="10" />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input id="interestRate" type="number" step="0.1" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  Create Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold">{activePlans}</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students Enrolled</p>
                <p className="text-2xl font-bold">{totalStudentsEnrolled}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold">{plans.length}</p>
              </div>
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>Installment Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Installments</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>£{plan.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{plan.numberOfInstallments}</TableCell>
                  <TableCell className="capitalize">{plan.frequency}</TableCell>
                  <TableCell>{plan.studentsEnrolled}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedPlan(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Details Dialog */}
      {selectedPlan && (
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedPlan.name} - Installment Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">£{selectedPlan.totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{selectedPlan.numberOfInstallments}</div>
                  <div className="text-sm text-muted-foreground">Installments</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{selectedPlan.interestRate}%</div>
                  <div className="text-sm text-muted-foreground">Interest Rate</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{selectedPlan.studentsEnrolled}</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Installment #</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPlan.installments.map((installment) => (
                    <TableRow key={installment.installmentNumber}>
                      <TableCell>{installment.installmentNumber}</TableCell>
                      <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>£{installment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getInstallmentStatusColor(installment.status)}>
                          {installment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};