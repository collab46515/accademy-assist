import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AdmissionsFeeService, type FeeHead } from '@/services/AdmissionsFeeService';
import { CreditCard, DollarSign, Calendar, FileText, CheckCircle, List } from 'lucide-react';

interface FeesDisplayProps {
  applicationId: string;
  applicationData: any;
  currentStage: string;
}

export function FeesDisplay({ applicationId, applicationData, currentStage }: FeesDisplayProps) {
  const [assignedFees, setAssignedFees] = useState<any[]>([]);
  const [feeHeadsBreakdown, setFeeHeadsBreakdown] = useState<FeeHead[]>([]);
  const [installmentPlan, setInstallmentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeData();
  }, [applicationId, currentStage]);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const [fees, feeHeads, plan] = await Promise.all([
        AdmissionsFeeService.getAssignedFees(applicationId),
        AdmissionsFeeService.getFeeHeadsBreakdown(applicationId),
        AdmissionsFeeService.getInstallmentPlan(applicationId)
      ]);
      setAssignedFees(fees);
      setFeeHeadsBreakdown(feeHeads);
      setInstallmentPlan(plan);
    } catch (error) {
      console.error('Error fetching fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPaymentStage = AdmissionsFeeService.isPaymentStage(currentStage);
  const totalFees = assignedFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = assignedFees.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0);
  const outstandingFees = totalFees - paidFees;

  if (!isPaymentStage && assignedFees.length === 0) {
    return null; // Don't show fees section if not relevant
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Fee Assignment & Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Fee Summary */}
        {assignedFees.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">₹{totalFees}</div>
              <div className="text-sm text-blue-600">Total Fees</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">₹{paidFees}</div>
              <div className="text-sm text-green-600">Paid</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-700">₹{outstandingFees}</div>
              <div className="text-sm text-orange-600">Outstanding</div>
            </div>
          </div>
        )}

      {/* Fee Heads Breakdown from Master Data */}
      {feeHeadsBreakdown.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <List className="h-4 w-4" />
              Annual Fee Breakdown
            </h4>
            <div className="space-y-2">
              {feeHeadsBreakdown.map((head, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{head.name}</div>
                    {head.description && (
                      <div className="text-xs text-muted-foreground">{head.description}</div>
                    )}
                  </div>
                  <div className="font-bold text-sm">₹{head.amount.toLocaleString()}</div>
                </div>
              ))}
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded font-bold">
                <span>Total Annual Fees</span>
                <span className="text-blue-700">
                  ₹{feeHeadsBreakdown.reduce((sum, head) => sum + head.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Installment Plan */}
      {installmentPlan && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium">Payment Plan: {installmentPlan.type === 'full' ? 'Full Payment' : '40-30-30 Installments'}</h4>
            <div className="space-y-2">
              {installmentPlan.installments.map((inst: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{inst.description}</div>
                    <div className="text-xs text-muted-foreground">Due: {new Date(inst.due_date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">₹{inst.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{inst.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Current Stage Payment Requirements */}
      {isPaymentStage && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-yellow-800">Payment Required for Current Stage</span>
          </div>
          <div className="text-sm text-yellow-700">
            {currentStage === 'application_fee' && 'Application processing fee will be auto-assigned from fee structure.'}
            {currentStage === 'deposit' && 'Admission deposit (15% of annual fees) will be auto-assigned based on fee structure.'}
            {currentStage === 'admission_decision' && 'Annual fees with installment option (Full or 40-30-30) will be assigned.'}
            {currentStage === 'confirmed' && 'Full annual fees will be assigned based on selected payment plan.'}
          </div>
        </div>
      )}

        {/* Assigned Fees List */}
        {assignedFees.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Assigned Fees</h4>
              {assignedFees.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{fee.notes?.split(' - ')[0] || 'Fee'}</div>
                      <div className="text-sm text-muted-foreground">
                        Invoice: {fee.invoice_number}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(fee.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{fee.amount}</div>
                    <Badge variant={fee.status === 'paid' ? 'default' : fee.status === 'pending' ? 'secondary' : 'destructive'}>
                      {fee.status === 'paid' ? (
                        <><CheckCircle className="h-3 w-3 mr-1" />Paid</>
                      ) : (
                        fee.status
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Payment Actions */}
        {outstandingFees > 0 && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Outstanding Fees (₹{outstandingFees})
              </Button>
              <Button variant="outline">
                View Payment History
              </Button>
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4 text-muted-foreground">
            Loading fee information...
          </div>
        )}

        {/* No Fees Message */}
        {!loading && assignedFees.length === 0 && !isPaymentStage && (
          <div className="text-center py-4 text-muted-foreground">
            No fees assigned yet. Fees will be automatically assigned when reaching payment stages.
          </div>
        )}
      </CardContent>
    </Card>
  );
}