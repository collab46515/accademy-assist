import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Receipt, Mail, CheckCircle, Clock, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { formatCurrency, getUserCurrency } from '@/lib/currency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AdmissionsFeeService } from '@/services/AdmissionsFeeService';

interface FeePaymentStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

interface FeeHead {
  name: string;
  amount: number;
  description?: string;
}

interface AssignedFee {
  id: string;
  invoice_number: string;
  category: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  assigned_at: string;
  fee_structure_id?: string;
}

export function FeePaymentStage({ applicationId, onMoveToNext }: FeePaymentStageProps) {
  const [paymentPlan, setPaymentPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [feeStructure, setFeeStructure] = useState<any>(null);
  const [assignedFees, setAssignedFees] = useState<AssignedFee[]>([]);
  const [applicationData, setApplicationData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFeeData();
  }, [applicationId]);

  const loadFeeData = async () => {
    try {
      setLoading(true);
      
      // Fetch application data
      const { data: app, error: appError } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;
      setApplicationData(app);

      // Fetch fee structure for this student's year group
      const { data: feeStructures, error: feeError } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('status', 'active')
        .eq('school_id', app.school_id)
        .in('student_type', ['new', 'all'])
        .contains('applicable_year_groups', [app.year_group])
        .order('created_at', { ascending: false })
        .limit(1);

      if (feeError) throw feeError;

      if (feeStructures && feeStructures.length > 0) {
        setFeeStructure(feeStructures[0]);
      } else {
        toast({
          title: 'No Fee Structure Found',
          description: `No active fee structure found for ${app.year_group}. Please create one in Master Data.`,
          variant: 'destructive',
        });
      }

      // Fetch assigned fees
      const fees = await AdmissionsFeeService.getAssignedFees(applicationId);
      setAssignedFees(fees);

    } catch (error) {
      console.error('Error loading fee data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fee information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert assigned fees to payment schedule format
  const paymentSchedule = assignedFees.map((fee, index) => ({
    id: index + 1,
    description: fee.description,
    amount: fee.amount,
    dueDate: fee.due_date,
    status: fee.status,
    paidDate: null
  }));

  const paymentMethods = [
    { id: 'credit_debit_card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Rupay' },
    { id: 'upi', name: 'UPI Payment', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'cash', name: 'Cash Payment', icon: '💵', description: 'Pay at school office' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', description: 'NEFT, RTGS, IMPS' }
  ];

  const scholarships = [
    { name: 'Academic Excellence Scholarship', amount: 25000, status: 'approved' },
    { name: 'Sports Scholarship', amount: 15000, status: 'pending' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
      case 'scheduled': return <Badge variant="outline">Scheduled</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const totalPaid = paymentSchedule.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = paymentSchedule.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalScheduled = paymentSchedule.filter(p => p.status === 'scheduled').reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = feeStructure?.total_amount || 0;

  // Parse fee heads from JSONB
  const feeHeads: FeeHead[] = feeStructure?.fee_heads || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!feeStructure) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Fee Structure Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No fee structure has been configured for {applicationData?.year_group}. 
            Please contact the admissions office or configure fee structures in Master Data Management.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Payment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid, getUserCurrency())}</div>
              <div className="text-sm text-muted-foreground">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending, getUserCurrency())}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{formatCurrency(totalScheduled, getUserCurrency())}</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalAmount, getUserCurrency())}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Breakdown - {feeStructure.name}</CardTitle>
              {feeStructure.description && (
                <p className="text-sm text-muted-foreground">{feeStructure.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Academic Year: {feeStructure.academic_year}</p>
                  <p>Term: {feeStructure.term}</p>
                  <p>Applicable to: {feeStructure.applicable_year_groups?.join(', ') || 'All'}</p>
                </div>
                
                {feeHeads.length > 0 ? (
                  feeHeads.map((head: FeeHead, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{head.name}</span>
                      <span className="font-medium">{formatCurrency(head.amount, getUserCurrency())}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between">
                    <span>Total Fees</span>
                    <span className="font-medium">{formatCurrency(totalAmount, getUserCurrency())}</span>
                  </div>
                )}
                
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount, getUserCurrency())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentSchedule.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                          {payment.paidDate && ` • Paid: ${new Date(payment.paidDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{payment.amount}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Plan Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Plan Type</label>
                  <Select value={paymentPlan} onValueChange={setPaymentPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="termly">Termly Payments (3 payments)</SelectItem>
                      <SelectItem value="monthly">Monthly Payments (12 payments)</SelectItem>
                      <SelectItem value="annual">Annual Payment (1 payment)</SelectItem>
                      <SelectItem value="custom">Custom Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Payment Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Amount</label>
                    <Input placeholder="₹500" />
                  </div>
                </div>
                
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Set Up Payment Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applied Scholarships & Bursaries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scholarships.map((scholarship, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{scholarship.name}</p>
                      <p className="text-sm text-muted-foreground">Award Amount: ₹{scholarship.amount}</p>
                    </div>
                    {getStatusBadge(scholarship.status)}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">Total Scholarship Awards: ₹40,000</p>
                <p className="text-sm text-green-700">Adjusted fee total: ₹{(feeStructure.total - 40000).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Invoice #INV-2024-001</p>
                    <p className="text-sm text-muted-foreground">Application Fee • Due: Jan 15, 2024</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Invoice #INV-2024-002</p>
                    <p className="text-sm text-muted-foreground">Registration Fee • Due: Feb 1, 2024</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Pending</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Receipt className="h-4 w-4 mr-2" />
                Generate New Invoice
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Application Fee Payment</p>
                    <p className="text-sm text-muted-foreground">Jan 10, 2024 • Bank Transfer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{formatCurrency(100, getUserCurrency())}</p>
                    <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Payment Reminder
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                // Generate receipt for latest payment
                const latestPayment = paymentSchedule.find(p => p.status === 'paid');
                const receiptData = {
                  receiptNumber: `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                  date: new Date().toLocaleDateString(),
                  applicationId: applicationId,
                  amount: latestPayment?.amount || 100,
                  description: latestPayment?.description || 'Payment'
                };
                
                // Create and download receipt
                const receiptContent = `
SCHOOL PAYMENT RECEIPT
Receipt No: ${receiptData.receiptNumber}
Date: ${receiptData.date}
Application ID: ${receiptData.applicationId}
Description: ${receiptData.description}
Amount: ₹${receiptData.amount}
Status: Payment Processed
                `.trim();
                
                const blob = new Blob([receiptContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `receipt-${receiptData.receiptNumber}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Receipt className="h-4 w-4" />
              Generate Receipt
            </Button>
            <Button className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Process Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to proceed to Enrollment Confirmation?</p>
              <p className="text-sm text-muted-foreground">
                Ensure all required payments are processed before confirming enrollment.
              </p>
            </div>
            <Button onClick={onMoveToNext}>
              Move to Enrollment Confirmation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}