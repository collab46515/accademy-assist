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
import { Plus, Edit, Trash2, Calendar, CreditCard, Users, Calculator, Download, FileText, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCSV } from '@/utils/exportHelpers';

interface InstallmentPlan {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  numberOfInstallments: number;
  frequency: string;
  startDate: string;
  endDate: string;
  interestRate: number;
  status: 'active' | 'inactive' | 'completed';
  studentsEnrolled: number;
  installments: InstallmentSchedule[];
}

interface InstallmentSchedule {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

interface CreatePlanForm {
  name: string;
  description: string;
  totalAmount: number;
  numberOfInstallments: number;
  frequency: string;
  startDate: string;
  endDate: string;
  interestRate: number;
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
  const [createForm, setCreateForm] = useState<CreatePlanForm>({
    name: '',
    description: '',
    totalAmount: 0,
    numberOfInstallments: 1,
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    interestRate: 0
  });

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

  const handleCreatePlan = () => {
    if (!createForm.name || !createForm.description || createForm.totalAmount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate installment schedule
    const installments: InstallmentSchedule[] = [];
    const startDate = new Date(createForm.startDate);
    const installmentAmount = Math.round((createForm.totalAmount * (1 + createForm.interestRate / 100)) / createForm.numberOfInstallments * 100) / 100;

    for (let i = 0; i < createForm.numberOfInstallments; i++) {
      const dueDate = new Date(startDate);
      
      switch (createForm.frequency) {
        case 'monthly':
          dueDate.setMonth(startDate.getMonth() + i);
          break;
        case 'termly':
          dueDate.setMonth(startDate.getMonth() + (i * 4));
          break;
        case 'quarterly':
          dueDate.setMonth(startDate.getMonth() + (i * 3));
          break;
        default:
          const totalDays = Math.floor((new Date(createForm.endDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const intervalDays = Math.floor(totalDays / createForm.numberOfInstallments);
          dueDate.setDate(startDate.getDate() + (i * intervalDays));
      }

      installments.push({
        installmentNumber: i + 1,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: i === createForm.numberOfInstallments - 1 
          ? createForm.totalAmount * (1 + createForm.interestRate / 100) - (installmentAmount * (createForm.numberOfInstallments - 1))
          : installmentAmount,
        status: 'pending'
      });
    }

    const newPlan: InstallmentPlan = {
      id: Date.now().toString(),
      ...createForm,
      status: 'active',
      studentsEnrolled: 0,
      installments
    };

    setPlans([newPlan, ...plans]);
    setCreateForm({
      name: '',
      description: '',
      totalAmount: 0,
      numberOfInstallments: 1,
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      interestRate: 0
    });
    setShowCreateDialog(false);
    toast.success('Installment plan created successfully');
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
    toast.success('Installment plan deleted successfully');
  };

  const handleExportPlans = () => {
    try {
      const csvData = plans.map(plan => ({
        'Plan Name': plan.name,
        'Description': plan.description,
        'Total Amount': `£${plan.totalAmount.toLocaleString()}`,
        'Number of Installments': plan.numberOfInstallments,
        'Frequency': plan.frequency,
        'Interest Rate': `${plan.interestRate}%`,
        'Start Date': new Date(plan.startDate).toLocaleDateString(),
        'End Date': new Date(plan.endDate).toLocaleDateString(),
        'Status': plan.status,
        'Students Enrolled': plan.studentsEnrolled,
        'Paid Installments': plan.installments.filter(i => i.status === 'paid').length,
        'Pending Installments': plan.installments.filter(i => i.status === 'pending').length,
        'Overdue Installments': plan.installments.filter(i => i.status === 'overdue').length
      }));

      downloadCSV(csvData, 'installment_plans');
      toast.success('Installment plans exported successfully');
    } catch (error) {
      toast.error('Failed to export installment plans');
    }
  };

  const handleExportSchedules = (plan: InstallmentPlan) => {
    try {
      const csvData = plan.installments.map(installment => ({
        'Plan Name': plan.name,
        'Installment Number': installment.installmentNumber,
        'Due Date': new Date(installment.dueDate).toLocaleDateString(),
        'Amount': `£${installment.amount.toLocaleString()}`,
        'Status': installment.status,
        'Days Until Due': Math.ceil((new Date(installment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }));

      downloadCSV(csvData, `installment_schedule_${plan.name.replace(/\s+/g, '_').toLowerCase()}`);
      toast.success('Installment schedule exported successfully');
    } catch (error) {
      toast.error('Failed to export installment schedule');
    }
  };

  const updateInstallmentStatus = (planId: string, installmentNumber: number, status: 'pending' | 'paid' | 'overdue') => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          installments: plan.installments.map(installment => 
            installment.installmentNumber === installmentNumber 
              ? { ...installment, status }
              : installment
          )
        };
      }
      return plan;
    }));
    toast.success('Installment status updated successfully');
  };

  const totalStudentsEnrolled = plans.reduce((sum, plan) => sum + plan.studentsEnrolled, 0);
  const activePlans = plans.filter(plan => plan.status === 'active').length;
  const totalPlannedAmount = plans.reduce((sum, plan) => sum + plan.totalAmount, 0);
  
  // Calculate collection rate
  const totalInstallments = plans.reduce((sum, plan) => sum + plan.installments.length, 0);
  const paidInstallments = plans.reduce((sum, plan) => 
    sum + plan.installments.filter(i => i.status === 'paid').length, 0);
  const collectionRate = totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Installment Plans</h1>
          <p className="text-muted-foreground">Manage flexible payment schedules for school fees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPlans}>
            <Download className="h-4 w-4 mr-2" />
            Export Plans
          </Button>
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
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g., Monthly Payment Plan"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Payment Frequency *</Label>
                    <Select value={createForm.frequency} onValueChange={(value) => setCreateForm({ ...createForm, frequency: value })}>
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
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Plan description..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="totalAmount">Total Amount (£) *</Label>
                    <Input 
                      id="totalAmount" 
                      type="number" 
                      placeholder="4500"
                      value={createForm.totalAmount || ''}
                      onChange={(e) => setCreateForm({ ...createForm, totalAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="installments">Number of Installments *</Label>
                    <Input 
                      id="installments" 
                      type="number" 
                      min="1"
                      placeholder="10"
                      value={createForm.numberOfInstallments || ''}
                      onChange={(e) => setCreateForm({ ...createForm, numberOfInstallments: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input 
                      id="interestRate" 
                      type="number" 
                      step="0.1" 
                      placeholder="0"
                      value={createForm.interestRate || ''}
                      onChange={(e) => setCreateForm({ ...createForm, interestRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={createForm.startDate}
                      onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={createForm.endDate}
                      onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlan}>
                    Create Plan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                <p className="text-sm font-medium text-muted-foreground">Total Planned Amount</p>
                <p className="text-2xl font-bold">£{totalPlannedAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
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
              <Calculator className="h-8 w-8 text-primary" />
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
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const paidCount = plan.installments.filter(i => i.status === 'paid').length;
                const progressPercentage = (paidCount / plan.installments.length) * 100;
                
                return (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-muted-foreground">{plan.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>£{plan.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{plan.numberOfInstallments} total</div>
                        <div className="text-muted-foreground">{paidCount} paid</div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{plan.frequency}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{progressPercentage.toFixed(0)}% complete</div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPlan(plan)} title="View Details">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExportSchedules(plan)} title="Export Schedule">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePlan(plan.id)} title="Delete Plan">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Details Dialog */}
      {selectedPlan && (
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedPlan.name} - Installment Schedule</DialogTitle>
                <Button size="sm" variant="outline" onClick={() => handleExportSchedules(selectedPlan)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-6">
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
                    <TableHead>Days Until Due</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPlan.installments.map((installment) => {
                    const daysUntilDue = Math.ceil((new Date(installment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <TableRow key={installment.installmentNumber}>
                        <TableCell className="font-medium">{installment.installmentNumber}</TableCell>
                        <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>£{installment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getInstallmentStatusColor(installment.status)}>
                            {installment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={daysUntilDue < 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                             daysUntilDue === 0 ? 'Due today' : 
                             `${daysUntilDue} days`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {installment.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateInstallmentStatus(selectedPlan.id, installment.installmentNumber, 'paid')}
                              >
                                Mark Paid
                              </Button>
                            )}
                            {installment.status === 'paid' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateInstallmentStatus(selectedPlan.id, installment.installmentNumber, 'pending')}
                              >
                                Undo
                              </Button>
                            )}
                            {daysUntilDue < 0 && installment.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateInstallmentStatus(selectedPlan.id, installment.installmentNumber, 'overdue')}
                              >
                                Mark Overdue
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
      )}
    </div>
  );
};