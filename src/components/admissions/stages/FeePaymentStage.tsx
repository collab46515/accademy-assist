import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Receipt, Mail, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react';
import { formatCurrency, getUserCurrency } from '@/lib/currency';

interface FeePaymentStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function FeePaymentStage({ applicationId, onMoveToNext }: FeePaymentStageProps) {
  const [paymentPlan, setPaymentPlan] = useState<string>('');

  const feeStructure = {
    applicationFee: 100,
    registrationFee: 500,
    tuitionFee: 12000,
    uniformDeposit: 300,
    equipmentFee: 200,
    total: 13100
  };

  const paymentSchedule = [
    { id: 1, description: 'Application Fee', amount: 100, dueDate: '2024-01-15', status: 'paid', paidDate: '2024-01-10' },
    { id: 2, description: 'Registration Fee', amount: 500, dueDate: '2024-02-01', status: 'pending', paidDate: null },
    { id: 3, description: 'First Tuition Payment', amount: 4000, dueDate: '2024-03-01', status: 'pending', paidDate: null },
    { id: 4, description: 'Second Tuition Payment', amount: 4000, dueDate: '2024-06-01', status: 'scheduled', paidDate: null },
    { id: 5, description: 'Final Tuition Payment', amount: 4000, dueDate: '2024-09-01', status: 'scheduled', paidDate: null },
    { id: 6, description: 'Uniform Deposit', amount: 300, dueDate: '2024-08-15', status: 'scheduled', paidDate: null },
    { id: 7, description: 'Equipment Fee', amount: 200, dueDate: '2024-08-15', status: 'scheduled', paidDate: null }
  ];

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'credit_card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'cheque', name: 'Cheque', icon: '📝' },
    { id: 'payment_plan', name: 'Payment Plan', icon: '📅' }
  ];

  const scholarships = [
    { name: 'Academic Excellence Scholarship', amount: 2000, status: 'approved' },
    { name: 'Sports Scholarship', amount: 1000, status: 'pending' }
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
              <div className="text-2xl font-bold text-primary">{formatCurrency(feeStructure.total, getUserCurrency())}</div>
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
              <CardTitle>Fee Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Application Fee</span>
                  <span className="font-medium">£{feeStructure.applicationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registration Fee</span>
                  <span className="font-medium">£{feeStructure.registrationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Tuition Fee</span>
                  <span className="font-medium">£{feeStructure.tuitionFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uniform Deposit</span>
                  <span className="font-medium">£{feeStructure.uniformDeposit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipment Fee</span>
                  <span className="font-medium">£{feeStructure.equipmentFee}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>£{feeStructure.total.toLocaleString()}</span>
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
                      <p className="font-medium">£{payment.amount}</p>
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
                        <p className="text-sm text-muted-foreground">
                          {method.id === 'bank_transfer' && 'Direct transfer to school account'}
                          {method.id === 'credit_card' && 'Secure online payment'}
                          {method.id === 'cheque' && 'Traditional payment method'}
                          {method.id === 'payment_plan' && 'Flexible payment options'}
                        </p>
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
                    <Input placeholder="£500" />
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
                      <p className="text-sm text-muted-foreground">Award Amount: £{scholarship.amount}</p>
                    </div>
                    {getStatusBadge(scholarship.status)}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">Total Scholarship Awards: £3,000</p>
                <p className="text-sm text-green-700">Adjusted fee total: £{(feeStructure.total - 3000).toLocaleString()}</p>
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
                    <p className="font-medium text-green-600">£100</p>
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
Amount: £${receiptData.amount}
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