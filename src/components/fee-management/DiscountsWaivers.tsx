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
import { Plus, Edit, Trash2, Percent, Gift, Users, TrendingDown } from 'lucide-react';

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
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Discounts</p>
                <p className="text-2xl font-bold">{discounts.filter(d => d.status === 'active').length}</p>
              </div>
              <Percent className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">£{totalSavings.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Waivers</p>
                <p className="text-2xl font-bold">{waivers.filter(w => w.status === 'pending').length}</p>
              </div>
              <Gift className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Waived</p>
                <p className="text-2xl font-bold">£{totalWaivedAmount.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="discounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="waivers">Waivers</TabsTrigger>
        </TabsList>

        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle>Active Discounts</CardTitle>
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
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
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
        </TabsContent>

        <TabsContent value="waivers">
          <Card>
            <CardHeader>
              <CardTitle>Fee Waiver Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Original Amount</TableHead>
                    <TableHead>Waived Amount</TableHead>
                    <TableHead>Requested By</TableHead>
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
                      <TableCell>£{waiver.waivedAmount.toLocaleString()}</TableCell>
                      <TableCell>{waiver.requestedBy}</TableCell>
                      <TableCell>{new Date(waiver.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(waiver.status)}>
                          {waiver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {waiver.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            View
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
      </Tabs>
    </div>
  );
};