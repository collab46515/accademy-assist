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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Percent, Gift, Users, TrendingDown, Download, FileText, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast, toast } from '@/hooks/use-toast';

interface Discount {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  applicableToFees: string[];
  conditions: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'inactive' | 'expired';
  studentsApplied: number;
  totalSavings: number;
}

interface Waiver {
  id: string;
  studentName: string;
  studentId: string;
  reason: string;
  feeType: string;
  originalAmount: number;
  waivedAmount: number;
  requestedBy: string;
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  notes?: string;
}

const MOCK_DISCOUNTS: Discount[] = [
  {
    id: '1',
    name: 'Sibling Discount',
    description: '10% discount for families with multiple children',
    type: 'percentage',
    value: 10,
    applicableToFees: ['Tuition Fee', 'Activity Fee'],
    conditions: 'Two or more children enrolled',
    validFrom: '2024-09-01',
    validTo: '2025-07-31',
    status: 'active',
    studentsApplied: 89,
    totalSavings: 45670
  },
  {
    id: '2',
    name: 'Early Payment Discount',
    description: '5% discount for payments made before due date',
    type: 'percentage',
    value: 5,
    applicableToFees: ['Tuition Fee'],
    conditions: 'Payment 30 days before due date',
    validFrom: '2024-09-01',
    validTo: '2025-07-31',
    status: 'active',
    studentsApplied: 234,
    totalSavings: 78900
  },
  {
    id: '3',
    name: 'Staff Children Discount',
    description: '50% discount for children of school staff',
    type: 'percentage',
    value: 50,
    applicableToFees: ['Tuition Fee', 'Transport Fee', 'Meals Fee'],
    conditions: 'Parent employed by school',
    validFrom: '2024-09-01',
    validTo: '2025-07-31',
    status: 'active',
    studentsApplied: 23,
    totalSavings: 52350
  }
];

const MOCK_WAIVERS: Waiver[] = [
  {
    id: '1',
    studentName: 'Emma Thompson',
    studentId: 'STU2024089',
    reason: 'Financial hardship due to family emergency',
    feeType: 'Tuition Fee',
    originalAmount: 1500,
    waivedAmount: 750,
    requestedBy: 'Sarah Thompson (Parent)',
    requestDate: '2024-01-15',
    approvedBy: 'Dr. Smith (Head Teacher)',
    approvalDate: '2024-01-18',
    status: 'approved',
    documents: ['financial_statement.pdf', 'hardship_letter.pdf']
  },
  {
    id: '2',
    studentName: 'James Wilson',
    studentId: 'STU2024156',
    reason: 'Parent job loss due to company closure',
    feeType: 'Transport Fee',
    originalAmount: 150,
    waivedAmount: 150,
    requestedBy: 'Michael Wilson (Parent)',
    requestDate: '2024-01-20',
    status: 'pending',
    documents: ['unemployment_certificate.pdf']
  },
  {
    id: '3',
    studentName: 'Sophie Davis',
    studentId: 'STU2024203',
    reason: 'Medical emergency requiring extended absence',
    feeType: 'Meals Fee',
    originalAmount: 200,
    waivedAmount: 100,
    requestedBy: 'Linda Davis (Parent)',
    requestDate: '2024-01-22',
    status: 'pending',
    documents: ['medical_certificate.pdf']
  }
];

export const DiscountsWaivers = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  const [waivers, setWaivers] = useState<Waiver[]>(MOCK_WAIVERS);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [showWaiverDialog, setShowWaiverDialog] = useState(false);
  const [selectedWaiver, setSelectedWaiver] = useState<Waiver | null>(null);
  const [showWaiverDetailDialog, setShowWaiverDetailDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('discounts');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'expired': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleApproveWaiver = async (waiverId: string) => {
    try {
      const { data, error } = await supabase
        .from('fee_waivers')
        .update({ 
          status: 'approved',
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approval_date: new Date().toISOString()
        })
        .eq('id', waiverId)
        .select();

      if (error) throw error;

      setWaivers(waivers.map(waiver => 
        waiver.id === waiverId 
          ? { 
              ...waiver, 
              status: 'approved',
              approvedBy: 'Current User',
              approvalDate: new Date().toISOString().split('T')[0]
            }
          : waiver
      ));
      toast({
        title: "Success",
        description: "Waiver approved successfully"
      });
    } catch (error) {
      console.error('Error approving waiver:', error);
      toast({
        title: "Error",
        description: "Failed to approve waiver",
        variant: "destructive"
      });
    }
  };

  const handleRejectWaiver = (waiverId: string) => {
    setWaivers(waivers.map(waiver => 
      waiver.id === waiverId 
        ? { 
            ...waiver, 
            status: 'rejected',
            approvedBy: 'Current User',
            approvalDate: new Date().toISOString().split('T')[0]
          }
        : waiver
    ));
    toast({
      title: "Success",
      description: "Waiver rejected"
    });
  };

  const handleDeleteDiscount = async (discountId: string) => {
    try {
      const { error } = await supabase
        .from('fee_discounts')
        .delete()
        .eq('id', discountId);

      if (error) throw error;

      setDiscounts(discounts.filter(discount => discount.id !== discountId));
      toast({
        title: "Success",
        description: "Discount deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast({
        title: "Error", 
        description: "Failed to delete discount",
        variant: "destructive"
      });
    }
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

  const handleExportDiscounts = () => {
    try {
      const csvData = discounts.map(discount => ({
        'Discount Name': discount.name,
        'Description': discount.description,
        'Type': discount.type,
        'Value': discount.type === 'percentage' ? `${discount.value}%` : `£${discount.value}`,
        'Applicable Fees': discount.applicableToFees.join(', '),
        'Conditions': discount.conditions,
        'Valid From': new Date(discount.validFrom).toLocaleDateString(),
        'Valid To': new Date(discount.validTo).toLocaleDateString(),
        'Status': discount.status,
        'Students Applied': discount.studentsApplied,
        'Total Savings': `£${discount.totalSavings.toLocaleString()}`
      }));

      downloadCSV(csvData, 'fee_discounts');
      toast({
        title: "Success",
        description: "Discounts exported successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export discounts",
        variant: "destructive"
      });
    }
  };

  const handleExportWaivers = () => {
    try {
      const csvData = waivers.map(waiver => ({
        'Student Name': waiver.studentName,
        'Student ID': waiver.studentId,
        'Fee Type': waiver.feeType,
        'Original Amount': `£${waiver.originalAmount.toLocaleString()}`,
        'Waived Amount': `£${waiver.waivedAmount.toLocaleString()}`,
        'Waiver Percentage': `${Math.round((waiver.waivedAmount / waiver.originalAmount) * 100)}%`,
        'Reason': waiver.reason,
        'Requested By': waiver.requestedBy,
        'Request Date': new Date(waiver.requestDate).toLocaleDateString(),
        'Status': waiver.status,
        'Approved By': waiver.approvedBy || 'N/A',
        'Approval Date': waiver.approvalDate ? new Date(waiver.approvalDate).toLocaleDateString() : 'N/A',
        'Documents Count': waiver.documents.length
      }));

      downloadCSV(csvData, 'fee_waivers');
      toast({
        title: "Success",
        description: "Waivers exported successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to export waivers",
        variant: "destructive"
      });
    }
  };

  const totalSavings = discounts.reduce((sum, discount) => sum + discount.totalSavings, 0);
  const totalWaivedAmount = waivers
    .filter(w => w.status === 'approved')
    .reduce((sum, waiver) => sum + waiver.waivedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discounts & Waivers</h1>
          <p className="text-muted-foreground">Manage fee discounts, waivers, and financial assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportDiscounts}>
            <Download className="h-4 w-4 mr-2" />
            Export Discounts
          </Button>
          <Button variant="outline" onClick={handleExportWaivers}>
            <Download className="h-4 w-4 mr-2" />
            Export Waivers
          </Button>
          <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Percent className="h-4 w-4 mr-2" />
                Create Discount
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Discount</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount-name">Discount Name</Label>
                    <Input id="discount-name" placeholder="e.g., Sibling Discount" />
                  </div>
                  <div>
                    <Label htmlFor="discount-type">Discount Type</Label>
                    <Select>
                      <SelectTrigger className="bg-background border border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="discount-description">Description</Label>
                  <Textarea id="discount-description" placeholder="Discount description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount-value">Value</Label>
                    <Input id="discount-value" type="number" placeholder="10" />
                  </div>
                  <div>
                    <Label htmlFor="discount-conditions">Conditions</Label>
                    <Input id="discount-conditions" placeholder="e.g., Two or more children" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowDiscountDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowDiscountDialog(false)}>
                    Create Discount
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showWaiverDialog} onOpenChange={setShowWaiverDialog}>
            <DialogTrigger asChild>
              <Button>
                <Gift className="h-4 w-4 mr-2" />
                Request Waiver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Fee Waiver</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student-name">Student Name</Label>
                    <Input id="student-name" placeholder="Enter student name" />
                  </div>
                  <div>
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input id="student-id" placeholder="STU2024xxx" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fee-type">Fee Type</Label>
                    <Select>
                      <SelectTrigger className="bg-background border border-border">
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="tuition">Tuition Fee</SelectItem>
                        <SelectItem value="transport">Transport Fee</SelectItem>
                        <SelectItem value="meals">Meals Fee</SelectItem>
                        <SelectItem value="activities">Activity Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="waived-amount">Waived Amount (£)</Label>
                    <Input id="waived-amount" type="number" placeholder="0" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="waiver-reason">Reason for Waiver</Label>
                  <Textarea id="waiver-reason" placeholder="Explain the circumstances requiring fee waiver..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowWaiverDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowWaiverDialog(false)}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTab('discounts')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Discounts</p>
                <p className="text-2xl font-bold">{discounts.filter(d => d.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to view all</p>
              </div>
              <Percent className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          // Show export options or summary
          handleExportDiscounts();
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">£{totalSavings.toLocaleString()}</p>
                <p className="text-xs text-success mt-1">+12% this month</p>
              </div>
              <TrendingDown className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTab('waivers')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Waivers</p>
                <p className="text-2xl font-bold">{waivers.filter(w => w.status === 'pending').length}</p>
                <p className="text-xs text-warning mt-1">Needs review</p>
              </div>
              <Gift className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Waived</p>
                <p className="text-2xl font-bold">£{totalWaivedAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Approved this term</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="discounts" className="data-[state=active]:bg-background">
            Discounts ({discounts.length})
          </TabsTrigger>
          <TabsTrigger value="waivers" className="data-[state=active]:bg-background">
            Waivers ({waivers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Discounts
                <Badge variant="secondary">{discounts.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discount Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Students Applied</TableHead>
                    <TableHead>Total Savings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{discount.name}</div>
                          <div className="text-sm text-muted-foreground">{discount.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{discount.type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        {discount.type === 'percentage' ? `${discount.value}%` : `£${discount.value}`}
                      </TableCell>
                      <TableCell>{discount.studentsApplied}</TableCell>
                      <TableCell>£{discount.totalSavings.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(discount.status)}>
                          {discount.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteDiscount(discount.id)}
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
        </TabsContent>

        <TabsContent value="waivers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Fee Waiver Requests
                <div className="flex gap-2">
                  <Badge variant="outline">{waivers.filter(w => w.status === 'pending').length} pending</Badge>
                  <Badge variant="secondary">{waivers.length} total</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Waived</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waivers.map((waiver) => (
                    <TableRow key={waiver.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{waiver.studentName}</div>
                          <div className="text-sm text-muted-foreground">{waiver.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{waiver.feeType}</TableCell>
                      <TableCell>£{waiver.originalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          <div>£{waiver.waivedAmount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            ({Math.round((waiver.waivedAmount / waiver.originalAmount) * 100)}%)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(waiver.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(waiver.status)}>
                          {waiver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedWaiver(waiver);
                              setShowWaiverDetailDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {waiver.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApproveWaiver(waiver.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRejectWaiver(waiver.id)}
                              >
                                <XCircle className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Waiver Detail Dialog */}
      <Dialog open={showWaiverDetailDialog} onOpenChange={setShowWaiverDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Waiver Request Details</DialogTitle>
          </DialogHeader>
          {selectedWaiver && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <p className="font-medium">{selectedWaiver.studentName}</p>
                </div>
                <div>
                  <Label>Student ID</Label>
                  <p className="font-medium">{selectedWaiver.studentId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fee Type</Label>
                  <p className="font-medium">{selectedWaiver.feeType}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedWaiver.status)}>
                    {selectedWaiver.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Original Amount</Label>
                  <p className="font-medium">£{selectedWaiver.originalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Waived Amount</Label>
                  <p className="font-medium">£{selectedWaiver.waivedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Percentage</Label>
                  <p className="font-medium">
                    {Math.round((selectedWaiver.waivedAmount / selectedWaiver.originalAmount) * 100)}%
                  </p>
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedWaiver.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requested By</Label>
                  <p className="font-medium">{selectedWaiver.requestedBy}</p>
                </div>
                <div>
                  <Label>Request Date</Label>
                  <p className="font-medium">{new Date(selectedWaiver.requestDate).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedWaiver.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Approved By</Label>
                    <p className="font-medium">{selectedWaiver.approvedBy}</p>
                  </div>
                  <div>
                    <Label>Approval Date</Label>
                    <p className="font-medium">
                      {selectedWaiver.approvalDate ? new Date(selectedWaiver.approvalDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              <div>
                <Label>Supporting Documents</Label>
                <div className="mt-2 space-y-1">
                  {selectedWaiver.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowWaiverDetailDialog(false)}>
                  Close
                </Button>
                {selectedWaiver.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleRejectWaiver(selectedWaiver.id);
                        setShowWaiverDetailDialog(false);
                      }}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => {
                        handleApproveWaiver(selectedWaiver.id);
                        setShowWaiverDetailDialog(false);
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};