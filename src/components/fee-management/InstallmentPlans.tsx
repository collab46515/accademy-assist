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
import { Plus, Edit, Trash2, Calendar, CreditCard, Download, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';

interface InstallmentPlan {
  id: string;
  name: string;
  description: string;
  frequency: 'monthly' | 'quarterly' | 'termly' | 'custom';
  numberOfInstallments: number;
  interestRate: number;
  totalAmount: number;
  studentsEnrolled: number;
  status: 'active' | 'inactive' | 'draft';
  installments: {
    installmentNumber: number;
    dueDate: string;
    amount: number;
    description: string;
  }[];
}

const MOCK_INSTALLMENT_PLANS: InstallmentPlan[] = [
  {
    id: '1',
    name: 'Quarterly Payment Plan',
    description: 'Pay tuition fees in 4 quarterly installments',
    frequency: 'quarterly',
    numberOfInstallments: 4,
    interestRate: 0,
    totalAmount: 12000,
    studentsEnrolled: 145,
    status: 'active',
    installments: [
      { installmentNumber: 1, dueDate: '2024-09-15', amount: 3000, description: 'Q1 Payment' },
      { installmentNumber: 2, dueDate: '2024-12-15', amount: 3000, description: 'Q2 Payment' },
      { installmentNumber: 3, dueDate: '2025-03-15', amount: 3000, description: 'Q3 Payment' },
      { installmentNumber: 4, dueDate: '2025-06-15', amount: 3000, description: 'Q4 Payment' }
    ]
  },
  {
    id: '2',
    name: 'Monthly Payment Plan',
    description: 'Pay tuition fees in 12 monthly installments with 2% interest',
    frequency: 'monthly',
    numberOfInstallments: 12,
    interestRate: 2,
    totalAmount: 12240,
    studentsEnrolled: 89,
    status: 'active',
    installments: Array.from({ length: 12 }, (_, i) => ({
      installmentNumber: i + 1,
      dueDate: new Date(2024, 8 + i, 1).toISOString().split('T')[0],
      amount: 1020,
      description: `Month ${i + 1} Payment`
    }))
  }
];

export const InstallmentPlans = () => {
  const [plans, setPlans] = useState<InstallmentPlan[]>(MOCK_INSTALLMENT_PLANS);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'termly': return 'Termly';
      case 'custom': return 'Custom';
      default: return frequency;
    }
  };

  const handleViewDetails = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
    setShowDetailsDialog(true);
  };

  const handleEditPlan = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
    setShowEditDialog(true);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
    toast.success('Installment plan deleted successfully');
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

  const handleExportPlans = () => {
    try {
      const csvData = plans.map(plan => ({
        'Plan Name': plan.name,
        'Description': plan.description,
        'Frequency': getFrequencyLabel(plan.frequency),
        'Number of Installments': plan.numberOfInstallments,
        'Interest Rate': `${plan.interestRate}%`,
        'Total Amount': `£${plan.totalAmount.toLocaleString()}`,
        'Students Enrolled': plan.studentsEnrolled,
        'Status': plan.status
      }));

      downloadCSV(csvData, 'installment_plans');
      toast.success('Installment plans exported successfully');
    } catch (error) {
      toast.error('Failed to export installment plans');
    }
  };

  const handleExportInstallments = (plan: InstallmentPlan) => {
    try {
      const csvData = plan.installments.map(installment => ({
        'Plan Name': plan.name,
        'Installment Number': installment.installmentNumber,
        'Due Date': new Date(installment.dueDate).toLocaleDateString(),
        'Amount': `£${installment.amount.toLocaleString()}`,
        'Description': installment.description
      }));

      downloadCSV(csvData, `${plan.name.toLowerCase().replace(/\s+/g, '_')}_installments`);
      toast.success('Installment schedule exported successfully');
    } catch (error) {
      toast.error('Failed to export installment schedule');
    }
  };

  const handleCreatePlan = () => {
    toast.success('Installment plan created successfully');
    setShowCreateDialog(false);
  };

  const totalStudentsEnrolled = plans.reduce((sum, plan) => sum + plan.studentsEnrolled, 0);
  const totalPlansValue = plans.reduce((sum, plan) => sum + (plan.totalAmount * plan.studentsEnrolled), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Installment Plans</h1>
          <p className="text-muted-foreground">Manage fee payment installment plans and schedules</p>
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
                <DialogTitle>Create Installment Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan-name">Plan Name</Label>
                    <Input id="plan-name" placeholder="e.g., Quarterly Payment Plan" />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger className="bg-background border border-border">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="termly">Termly</SelectItem>
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
                    <Label htmlFor="installments">Number of Installments</Label>
                    <Input id="installments" type="number" placeholder="4" />
                  </div>
                  <div>
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input id="interest-rate" type="number" step="0.1" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="total-amount">Total Amount (£)</Label>
                    <Input id="total-amount" type="number" placeholder="12000" />
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
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          console.log('InstallmentPlans: Active Plans card clicked');
          alert('Active Plans card clicked');
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view details</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          console.log('InstallmentPlans: Total Students card clicked');
          alert('Total Students card clicked');
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudentsEnrolled}</p>
                <p className="text-xs text-success mt-1">Across all plans</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          console.log('InstallmentPlans: Total Value card clicked');
          alert('Total Value card clicked');
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">£{totalPlansValue.toLocaleString()}</p>
                <p className="text-xs text-warning mt-1">All plans combined</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          console.log('InstallmentPlans: Avg Plan Size card clicked');
          alert('Avg Plan Size card clicked');
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Plan Size</p>
                <p className="text-2xl font-bold">
                  £{plans.length > 0 ? Math.round(totalPlansValue / totalStudentsEnrolled).toLocaleString() : '0'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Per student</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Installment Plans
            <Badge variant="secondary">{plans.length} total plans</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Installments</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getFrequencyLabel(plan.frequency)}</TableCell>
                  <TableCell>{plan.numberOfInstallments}</TableCell>
                  <TableCell>{plan.interestRate}%</TableCell>
                  <TableCell>£{plan.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{plan.studentsEnrolled}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('View details clicked');
                          handleViewDetails(plan);
                        }}
                        style={{ pointerEvents: 'auto', zIndex: 1000 }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('Edit clicked');
                          handleEditPlan(plan);
                        }}
                        style={{ pointerEvents: 'auto', zIndex: 1000 }}
                        title="Edit Plan"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('Export clicked');
                          handleExportInstallments(plan);
                        }}
                        style={{ pointerEvents: 'auto', zIndex: 1000 }}
                        title="Export Schedule"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('Delete clicked');
                          handleDeletePlan(plan.id);
                        }}
                        style={{ pointerEvents: 'auto', zIndex: 1000 }}
                        title="Delete Plan"
                      >
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
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Installment Plan Details</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan Name</Label>
                  <p className="font-medium">{selectedPlan.name}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedPlan.status)}>
                    {selectedPlan.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedPlan.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Frequency</Label>
                  <p className="font-medium">{getFrequencyLabel(selectedPlan.frequency)}</p>
                </div>
                <div>
                  <Label>Installments</Label>
                  <p className="font-medium">{selectedPlan.numberOfInstallments}</p>
                </div>
                <div>
                  <Label>Interest Rate</Label>
                  <p className="font-medium">{selectedPlan.interestRate}%</p>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="font-medium">£{selectedPlan.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label>Installment Schedule</Label>
                <div className="mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Installment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPlan.installments.map((installment) => (
                        <TableRow key={installment.installmentNumber}>
                          <TableCell>{installment.installmentNumber}</TableCell>
                          <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>£{installment.amount.toLocaleString()}</TableCell>
                          <TableCell>{installment.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => handleExportInstallments(selectedPlan)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Schedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};