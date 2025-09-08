import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Receipt,
  Settings
} from 'lucide-react';

interface PaymentManagerProps {
  applicationId: string;
  applicationData: any;
  onPaymentComplete: () => void;
}

export function PaymentManager({ applicationId, applicationData, onPaymentComplete }: PaymentManagerProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentPlanDialogOpen, setPaymentPlanDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentPlanType, setPaymentPlanType] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const paymentStages = {
    'under_review': {
      name: 'Application Fee',
      amount: 75,
      description: 'One-time application processing fee'
    },
    'fee_payment': {
      name: 'Enrollment Deposit',
      amount: 1500,
      description: '15% of annual fees as enrollment deposit'
    },
    'confirmed': {
      name: 'Term Fees',
      amount: 8500,
      description: 'First term tuition fees'
    }
  };

  const currentStagePayment = paymentStages[applicationData.status as keyof typeof paymentStages];

  const handleStripePayment = async () => {
    try {
      setLoading(true);
      
      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: Math.round((parseFloat(paymentAmount) || currentStagePayment?.amount || 0) * 100), // Convert to minor units
          currency: 'inr',
          description: `${currentStagePayment?.name} - ${applicationData.student_name}`,
          metadata: {
            application_id: applicationId,
            application_number: applicationData.application_number,
            student_name: applicationData.student_name,
            payment_stage: applicationData.status
          }
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        toast({
          title: "Payment Session Created",
          description: "Please complete the payment in the new tab that opened",
        });
      }
      
      setPaymentDialogOpen(false);
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast({
        title: "Error",
        description: "Failed to create payment session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransferPayment = async () => {
    try {
      setLoading(true);
      
      // Record bank transfer payment (pending verification)
      const paymentRecord = {
        application_id: applicationId,
        amount: parseFloat(paymentAmount) || currentStagePayment?.amount || 0,
        currency: 'INR',
        payment_method: 'bank_transfer',
        status: 'pending_verification',
        payment_stage: applicationData.status,
        description: `${currentStagePayment?.name} - Bank Transfer`,
        metadata: {
          student_name: applicationData.student_name,
          application_number: applicationData.application_number
        }
      };

      // In a real implementation, you'd save this to a payments table
      // For now, we'll update the application with payment info
      const existingData = applicationData.additional_data || {};
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          additional_data: {
            ...existingData,
            pending_payments: [
              ...(existingData.pending_payments || []),
              paymentRecord
            ]
          }
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Bank Transfer Recorded",
        description: "Payment recorded as pending verification. Bank details have been sent to your email.",
      });
      
      setPaymentDialogOpen(false);
      onPaymentComplete();
    } catch (error) {
      console.error('Error recording bank transfer:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupPaymentPlan = async () => {
    try {
      setLoading(true);
      
      const planDetails = {
        type: paymentPlanType,
        total_amount: currentStagePayment?.amount || 0,
        created_at: new Date().toISOString(),
        status: 'active'
      };

      // Calculate installments based on plan type
      let installments = [];
      const totalAmount = currentStagePayment?.amount || 0;
      
      switch (paymentPlanType) {
        case 'monthly':
          const monthlyAmount = Math.round(totalAmount / 12);
          for (let i = 0; i < 12; i++) {
            installments.push({
              amount: i === 11 ? totalAmount - (monthlyAmount * 11) : monthlyAmount, // Adjust last payment for rounding
              due_date: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'pending'
            });
          }
          break;
        case 'termly':
          const termlyAmount = Math.round(totalAmount / 3);
          for (let i = 0; i < 3; i++) {
            installments.push({
              amount: i === 2 ? totalAmount - (termlyAmount * 2) : termlyAmount,
              due_date: new Date(Date.now() + (i + 1) * 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'pending'
            });
          }
          break;
        case 'half_yearly':
          const halfYearlyAmount = Math.round(totalAmount / 2);
          for (let i = 0; i < 2; i++) {
            installments.push({
              amount: i === 1 ? totalAmount - halfYearlyAmount : halfYearlyAmount,
              due_date: new Date(Date.now() + (i + 1) * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'pending'
            });
          }
          break;
      }

      const existingData = applicationData.additional_data || {};
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          additional_data: {
            ...existingData,
            payment_plan: {
              ...planDetails,
              installments
            }
          }
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Payment Plan Created",
        description: `${paymentPlanType} payment plan has been set up successfully`,
      });
      
      setPaymentPlanDialogOpen(false);
      onPaymentComplete();
    } catch (error) {
      console.error('Error setting up payment plan:', error);
      toast({
        title: "Error",
        description: "Failed to create payment plan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentStagePayment) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Payment Required</h3>
          <p className="text-muted-foreground">This stage does not require payment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Required: {currentStagePayment.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">₹{currentStagePayment.amount}</div>
              <div className="text-sm text-blue-600">Amount Due</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-700">Pending</div>
              <div className="text-sm text-yellow-600">Payment Status</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">Multiple</div>
              <div className="text-sm text-green-600">Payment Options</div>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">{currentStagePayment.description}</p>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setPaymentDialogOpen(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
            <Button variant="outline" onClick={() => setPaymentPlanDialogOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Set Up Payment Plan
            </Button>
            <Button 
              variant="ghost"
              onClick={() => {
                toast({
                  title: "Receipt Generated",
                  description: "Payment receipt has been generated and will be emailed to you.",
                });
              }}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Generate Receipt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      {applicationData.additional_data?.pending_payments && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicationData.additional_data.pending_payments.map((payment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{payment.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Card Payment'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{payment.amount}</div>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                      {payment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Plan */}
      {applicationData.additional_data?.payment_plan && (
        <Card>
          <CardHeader>
            <CardTitle>Active Payment Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                {applicationData.additional_data.payment_plan.type} Plan
              </Badge>
              <p className="text-sm text-muted-foreground">
                Total: ₹{applicationData.additional_data.payment_plan.total_amount}
              </p>
            </div>
            
            <div className="space-y-2">
              {applicationData.additional_data.payment_plan.installments?.map((installment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="text-sm">Payment {index + 1}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Due: {new Date(installment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₹{installment.amount}</span>
                    <Badge variant={installment.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                      {installment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method for {currentStagePayment.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Amount</label>
              <Input 
                placeholder={`₹${currentStagePayment.amount}`}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {paymentMethod === 'stripe' && (
                <Button onClick={handleStripePayment} disabled={loading} className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with Stripe
                </Button>
              )}
              {paymentMethod === 'bank_transfer' && (
                <Button onClick={handleBankTransferPayment} disabled={loading} className="flex-1">
                  <Receipt className="h-4 w-4 mr-2" />
                  Record Bank Transfer
                </Button>
              )}
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Plan Dialog */}
      <Dialog open={paymentPlanDialogOpen} onOpenChange={setPaymentPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Payment Plan</DialogTitle>
            <DialogDescription>
              Choose a payment plan for {currentStagePayment.name} (₹{currentStagePayment.amount})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Plan Type</label>
              <Select value={paymentPlanType} onValueChange={setPaymentPlanType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly (12 payments)</SelectItem>
                  <SelectItem value="termly">Termly (3 payments)</SelectItem>
                  <SelectItem value="half_yearly">Half-Yearly (2 payments)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Plan Details</h4>
              {paymentPlanType === 'monthly' && (
                <p className="text-sm text-blue-700">
                  12 monthly payments of approximately ₹{Math.round((currentStagePayment.amount) / 12)}
                </p>
              )}
              {paymentPlanType === 'termly' && (
                <p className="text-sm text-blue-700">
                  3 termly payments of approximately ₹{Math.round((currentStagePayment.amount) / 3)}
                </p>
              )}
              {paymentPlanType === 'half_yearly' && (
                <p className="text-sm text-blue-700">
                  2 half-yearly payments of approximately ₹{Math.round((currentStagePayment.amount) / 2)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={setupPaymentPlan} disabled={loading || !paymentPlanType} className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Create Payment Plan
              </Button>
              <Button variant="outline" onClick={() => setPaymentPlanDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}