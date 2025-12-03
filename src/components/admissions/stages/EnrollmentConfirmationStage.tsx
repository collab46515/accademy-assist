import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeeHead {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface FeeStructure {
  id: string;
  name: string;
  academic_year: string;
  total_amount: number;
  fee_heads: FeeHead[];
  applicable_year_groups: string[];
  student_type: string;
}

interface EnrollmentConfirmationStageProps {
  applicationId: string;
  applicationData?: any;
  onMoveToNext: () => void;
}

export function EnrollmentConfirmationStage({ applicationId, applicationData, onMoveToNext }: EnrollmentConfirmationStageProps) {
  const [loading, setLoading] = useState(false);
  const [loadingFees, setLoadingFees] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [formClass, setFormClass] = useState('');
  const [house, setHouse] = useState('');
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<FeeStructure | null>(null);
  const { toast } = useToast();

  // Extract year group from application data
  const yearGroup = applicationData?.student_data?.year_group || 
                    applicationData?.year_group_applying_for || 
                    applicationData?.applying_for_year || '';

  // Fetch applicable fee structures based on year group
  useEffect(() => {
    const fetchFeeStructures = async () => {
      setLoadingFees(true);
      try {
        const { data, error } = await supabase
          .from('fee_structures')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;

        // Filter structures that apply to this year group
        const applicable = (data || []).filter((structure: any) => {
          const yearGroups = structure.applicable_year_groups || [];
          // If no year groups specified, applies to all
          if (yearGroups.length === 0) return true;
          // Check if student's year group is in the list
          return yearGroups.some((yg: string) => 
            yg.toLowerCase().includes(yearGroup.toLowerCase()) ||
            yearGroup.toLowerCase().includes(yg.toLowerCase())
          );
        }).map((s: any) => ({
          ...s,
          fee_heads: Array.isArray(s.fee_heads) ? s.fee_heads : []
        }));

        setFeeStructures(applicable);
        
        // Auto-select if only one structure matches
        if (applicable.length === 1) {
          setSelectedFeeStructure(applicable[0]);
        }
      } catch (error: any) {
        console.error('Error fetching fee structures:', error);
      } finally {
        setLoadingFees(false);
      }
    };

    fetchFeeStructures();
  }, [yearGroup]);

  const handleConfirmEnrollment = async () => {
    if (!studentId || !startDate || !formClass || !house) {
      toast({
        title: "Missing information",
        description: "Please fill in all enrollment details",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Store enrollment data
      const enrollmentData = {
        student_id: studentId,
        start_date: startDate,
        form_class: formClass,
        house: house,
        confirmed_at: new Date().toISOString(),
        fee_structure_id: selectedFeeStructure?.id,
        fee_structure_name: selectedFeeStructure?.name,
        total_fees: selectedFeeStructure?.total_amount,
      };

      const { error: updateError } = await supabase
        .from('enrollment_applications')
        .update({
          additional_data: enrollmentData
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Generate invoice if fee structure selected
      if (selectedFeeStructure) {
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        const studentName = applicationData?.student_data?.first_name && applicationData?.student_data?.last_name
          ? `${applicationData.student_data.first_name} ${applicationData.student_data.last_name}`
          : applicationData?.student_name || 'Student';
        const studentEmail = applicationData?.student_data?.email || applicationData?.parent_email || '';
        
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_number: invoiceNumber,
            customer_name: studentName,
            customer_email: studentEmail,
            invoice_date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            currency: 'INR',
            subtotal: selectedFeeStructure.total_amount,
            tax_amount: 0,
            discount_amount: 0,
            total_amount: selectedFeeStructure.total_amount,
            paid_amount: 0,
            balance_due: selectedFeeStructure.total_amount,
            status: 'pending',
            notes: `Fee Structure: ${selectedFeeStructure.name} | Student ID: ${studentId} | Application ID: ${applicationId}`
          })
          .select()
          .single();

        if (invoiceError) {
          console.error('Invoice creation error:', invoiceError);
        } else if (invoiceData && selectedFeeStructure.fee_heads?.length > 0) {
          // Create line items for each fee head
          const lineItems = selectedFeeStructure.fee_heads.map(fh => ({
            invoice_id: invoiceData.id,
            description: `${fh.name}${fh.category ? ` (${fh.category})` : ''}`,
            quantity: 1,
            unit_price: fh.amount || 0,
            tax_rate: 0,
            line_total: fh.amount || 0
          }));

          await supabase.from('invoice_line_items').insert(lineItems);
          
          toast({
            title: "Invoice Generated",
            description: `Invoice ${invoiceNumber} created for ₹${selectedFeeStructure.total_amount.toLocaleString()}`,
          });
        }
      }

      toast({
        title: "Enrollment confirmed",
        description: "Student enrollment details saved successfully",
      });

      onMoveToNext();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Enrollment Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Student ID *</label>
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., STU-2024-001"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date *</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Form Class *</label>
              <Input
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                placeholder="e.g., 7A"
              />
            </div>
            <div>
              <label className="text-sm font-medium">House *</label>
              <Input
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                placeholder="e.g., Churchill House"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structure Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Fee Structure
            {yearGroup && (
              <Badge variant="secondary" className="ml-2">
                Year Group: {yearGroup}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingFees ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading fee structures...</span>
            </div>
          ) : feeStructures.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No fee structures found for {yearGroup || 'this year group'}. 
                Please create a fee structure in Master Data → Fee Management first.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium">Select Fee Structure *</label>
                <Select 
                  value={selectedFeeStructure?.id || ''} 
                  onValueChange={(value) => {
                    const structure = feeStructures.find(f => f.id === value);
                    setSelectedFeeStructure(structure || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeStructures.map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        {structure.name} - ₹{structure.total_amount?.toLocaleString()} ({structure.academic_year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFeeStructure && (
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Fee Breakdown
                    </span>
                    <Badge>{selectedFeeStructure.academic_year}</Badge>
                  </div>
                  
                  {selectedFeeStructure.fee_heads && selectedFeeStructure.fee_heads.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFeeStructure.fee_heads.map((fh, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b last:border-0">
                          <span className="text-sm">
                            {fh.name}
                            {fh.category && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {fh.category}
                              </Badge>
                            )}
                          </span>
                          <span className="text-sm font-medium">₹{fh.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No fee heads configured</p>
                  )}
                  
                  <div className="pt-2 border-t flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg text-primary">
                      ₹{selectedFeeStructure.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={handleConfirmEnrollment} 
        disabled={loading || !selectedFeeStructure} 
        className="w-full"
        size="lg"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirm Enrollment & Generate Invoice
      </Button>
    </div>
  );
}
