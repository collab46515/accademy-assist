import { supabase } from '@/integrations/supabase/client';

export interface FeeAssignmentResult {
  success: boolean;
  invoiceId?: string;
  amount?: number;
  error?: string;
}

export interface FeeHead {
  name: string;
  amount: number;
  description?: string;
  is_mandatory?: boolean;
  category?: string;
}

export interface InstallmentPlan {
  type: 'full' | '40-30-30';
  installments: Array<{
    sequence: number;
    percentage: number;
    amount: number;
    due_date: string;
    description: string;
  }>;
}

export class AdmissionsFeeService {
  
  /**
   * Auto-assign fees when student progresses to payment stages
   */
  static async assignFeesForStage(
    applicationId: string, 
    stage: string, 
    applicationData: any,
    installmentType: 'full' | '40-30-30' = 'full'
  ): Promise<FeeAssignmentResult> {
    
    console.log(`🎯 Auto-assigning fees for stage: ${stage}, installment: ${installmentType}`);
    
    try {
      switch (stage) {
        case 'application_fee':
          return await this.assignApplicationFee(applicationId, applicationData);
        
        case 'deposit':
          return await this.assignDepositFee(applicationId, applicationData);
        
        case 'confirmed':
          return await this.assignMainTuitionFees(applicationId, applicationData, installmentType);
        
        case 'admission_decision':
          // For admission decision stage, assign all annual fees with installment plan
          return await this.assignAnnualFees(applicationId, applicationData, installmentType);
        
        default:
          return { success: true }; // No fees for this stage
      }
    } catch (error: any) {
      console.error('Error assigning fees:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Assign application fee from fee structure
   */
  private static async assignApplicationFee(
    applicationId: string, 
    applicationData: any
  ): Promise<FeeAssignmentResult> {
    
    const feeStructure = await this.getFeeStructureForStudent(applicationData);
    
    if (!feeStructure) {
      return { success: false, error: 'No fee structure found for this year group' };
    }

    // Find application fee from fee heads
    const feeHeads: FeeHead[] = (feeStructure.fee_heads as unknown as FeeHead[]) || [];
    const applicationFeeHead = feeHeads.find(head =>
      head.category?.toLowerCase() === 'admission' || 
      head.name.toLowerCase().includes('admission')
    );

    if (!applicationFeeHead) {
      return { success: false, error: 'Application fee not defined in fee structure' };
    }
    
    const result = await this.createInvoice({
      applicationId,
      applicationData,
      amount: applicationFeeHead.amount,
      description: applicationFeeHead.name,
      category: 'Application Fee',
      dueInDays: 7,
      feeStructureId: feeStructure.id,
      feeHeadName: applicationFeeHead.name
    });

    if (result.success) {
      console.log(`✅ Application fee assigned: ₹${applicationFeeHead.amount}`);
    }
    
    return result;
  }

  /**
   * Assign deposit fee (15% of annual fees calculated from fee heads)
   */
  private static async assignDepositFee(
    applicationId: string, 
    applicationData: any
  ): Promise<FeeAssignmentResult> {
    
    const feeStructure = await this.getFeeStructureForStudent(applicationData);
    
    if (!feeStructure) {
      return { success: false, error: 'No fee structure found for this year group' };
    }

    // Calculate total from fee heads (excluding mess fees which are monthly)
    const feeHeads: FeeHead[] = (feeStructure.fee_heads as unknown as FeeHead[]) || [];
    const annualTotal = feeHeads
      .filter(head => !head.name.toLowerCase().includes('mess'))
      .reduce((sum, head) => sum + head.amount, 0);

    // Calculate 15% deposit
    const depositAmount = Math.round(annualTotal * 0.15);
    
    const result = await this.createInvoice({
      applicationId,
      applicationData,
      amount: depositAmount,
      description: `Admission Deposit (15% of annual fees)`,
      category: 'Deposit',
      dueInDays: 14,
      feeStructureId: feeStructure.id,
      notes: `Calculated as 15% of ₹${annualTotal} annual fees`
    });

    if (result.success) {
      console.log(`✅ Deposit fee assigned: ₹${depositAmount}`);
    }
    
    return result;
  }

  /**
   * Assign all annual fees with installment plan
   */
  private static async assignAnnualFees(
    applicationId: string, 
    applicationData: any,
    installmentType: 'full' | '40-30-30' = 'full'
  ): Promise<FeeAssignmentResult> {
    
    const feeStructure = await this.getFeeStructureForStudent(applicationData);
    
    if (!feeStructure) {
      return { success: false, error: 'No fee structure found for this year group' };
    }

    const feeHeads: FeeHead[] = (feeStructure.fee_heads as unknown as FeeHead[]) || [];
    
    // Separate fees by type
    const annualFees = feeHeads.filter(head => !head.name.toLowerCase().includes('mess'));
    const messFees = feeHeads.find(head => head.name.toLowerCase().includes('mess'));
    
    const annualTotal = annualFees.reduce((sum, head) => sum + head.amount, 0);

    // Create installment plan
    const installmentPlan = this.createInstallmentPlan(annualTotal, installmentType);

    // Create invoices for each installment
    const invoices = [];
    for (const installment of installmentPlan.installments) {
      const result = await this.createInvoice({
        applicationId,
        applicationData,
        amount: installment.amount,
        description: installment.description,
        category: 'Tuition',
        dueDate: installment.due_date,
        feeStructureId: feeStructure.id,
        notes: `${installmentPlan.type} payment plan - Installment ${installment.sequence} of ${installmentPlan.installments.length}`
      });
      
      if (result.success) {
        invoices.push(result);
      }
    }

    // Store installment plan in application data
    await this.saveInstallmentPlan(applicationId, applicationData, installmentPlan, feeHeads);

    return {
      success: true,
      amount: annualTotal
    };
  }

  /**
   * Assign main tuition fees (legacy method, kept for compatibility)
   */
  private static async assignMainTuitionFees(
    applicationId: string, 
    applicationData: any,
    installmentType: 'full' | '40-30-30' = 'full'
  ): Promise<FeeAssignmentResult> {
    return await this.assignAnnualFees(applicationId, applicationData, installmentType);
  }

  /**
   * Create installment plan based on type
   */
  private static createInstallmentPlan(totalAmount: number, type: 'full' | '40-30-30'): InstallmentPlan {
    const today = new Date();
    
    if (type === 'full') {
      return {
        type: 'full',
        installments: [{
          sequence: 1,
          percentage: 100,
          amount: totalAmount,
          due_date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Full Annual Fee Payment'
        }]
      };
    }
    
    // 40-30-30 installment plan
    const firstInstallment = Math.round(totalAmount * 0.40);
    const secondInstallment = Math.round(totalAmount * 0.30);
    const thirdInstallment = totalAmount - firstInstallment - secondInstallment; // Remainder to handle rounding
    
    return {
      type: '40-30-30',
      installments: [
        {
          sequence: 1,
          percentage: 40,
          amount: firstInstallment,
          due_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '1st Installment (40%) - At Admission'
        },
        {
          sequence: 2,
          percentage: 30,
          amount: secondInstallment,
          due_date: new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '2nd Installment (30%) - Term I'
        },
        {
          sequence: 3,
          percentage: 30,
          amount: thirdInstallment,
          due_date: new Date(today.getTime() + 240 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '3rd Installment (30%) - Term II'
        }
      ]
    };
  }

  /**
   * Save installment plan to application
   */
  private static async saveInstallmentPlan(
    applicationId: string,
    applicationData: any,
    installmentPlan: InstallmentPlan,
    feeHeads: FeeHead[]
  ) {
    const existingData = applicationData.additional_data || {};
    
    await supabase
      .from('enrollment_applications')
      .update({
        additional_data: {
          ...existingData,
          installment_plan: installmentPlan,
          fee_heads_breakdown: feeHeads
        }
      })
      .eq('id', applicationId);
  }

  /**
   * Get appropriate fee structure based on student's year group
   */
  private static async getFeeStructureForStudent(applicationData: any) {
    try {
      const yearGroup = applicationData.year_group;
      const schoolId = applicationData.school_id;
      
      if (!yearGroup || !schoolId) {
        console.warn('Missing year group or school ID for fee structure lookup');
        return null;
      }

      const { data: feeStructures, error } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('status', 'active')
        .eq('school_id', schoolId)
        .in('student_type', ['new', 'all'])
        .contains('applicable_year_groups', [yearGroup])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching fee structure:', error);
        return null;
      }

      if (feeStructures && feeStructures.length > 0) {
        console.log(`📋 Found fee structure for ${yearGroup}:`, feeStructures[0].name);
        return feeStructures[0];
      }

      console.warn(`No fee structure found for year group: ${yearGroup}`);
      return null;
      
    } catch (error) {
      console.error('Error in getFeeStructureForStudent:', error);
      return null;
    }
  }

  /**
   * Create invoice record for the student
   */
  private static async createInvoice({
    applicationId,
    applicationData,
    amount,
    description,
    category,
    dueInDays,
    dueDate,
    feeStructureId,
    feeHeadName,
    notes
  }: {
    applicationId: string;
    applicationData: any;
    amount: number;
    description: string;
    category: string;
    dueInDays?: number;
    dueDate?: string;
    feeStructureId?: string;
    feeHeadName?: string;
    notes?: string;
  }): Promise<FeeAssignmentResult> {
    
    try {
      // Generate invoice number
      const invoiceNumber = `INV-${applicationData.application_number || applicationId.slice(-6)}-${Date.now().toString().slice(-6)}`;
      
      // Calculate due date
      let calculatedDueDate: string;
      if (dueDate) {
        calculatedDueDate = dueDate;
      } else {
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + (dueInDays || 30));
        calculatedDueDate = dueDateObj.toISOString().split('T')[0];
      }

      const feeAssignment = {
        id: `fee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        invoice_number: invoiceNumber,
        category,
        description,
        amount: amount,
        due_date: calculatedDueDate,
        status: 'pending',
        assigned_at: new Date().toISOString(),
        fee_structure_id: feeStructureId,
        fee_head_name: feeHeadName,
        notes: notes || `${description} - Auto-assigned`
      };

      // Update application with fee assignment
      const existingFees = applicationData.additional_data?.assigned_fees || [];
      const updatedFees = [...existingFees, feeAssignment];

      const { error: updateError } = await supabase
        .from('enrollment_applications')
        .update({
          additional_data: {
            ...applicationData.additional_data,
            assigned_fees: updatedFees
          }
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Error updating application with fees:', updateError);
        return { success: false, error: updateError.message };
      }

      return {
        success: true,
        invoiceId: feeAssignment.id,
        amount: amount
      };

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get assigned fees for an application
   */
  static async getAssignedFees(applicationId: string) {
    try {
      const { data: application, error } = await supabase
        .from('enrollment_applications')
        .select('additional_data')
        .eq('id', applicationId)
        .single();

      if (error) {
        console.error('Error fetching application fees:', error);
        return [];
      }

      const additionalData = application?.additional_data as any;
      return additionalData?.assigned_fees || [];
    } catch (error) {
      console.error('Error in getAssignedFees:', error);
      return [];
    }
  }

  /**
   * Get fee heads breakdown for an application
   */
  static async getFeeHeadsBreakdown(applicationId: string): Promise<FeeHead[]> {
    try {
      const { data: application, error } = await supabase
        .from('enrollment_applications')
        .select('additional_data')
        .eq('id', applicationId)
        .single();

      if (error) {
        console.error('Error fetching fee heads:', error);
        return [];
      }

      const additionalData = application?.additional_data as any;
      return additionalData?.fee_heads_breakdown || [];
    } catch (error) {
      console.error('Error in getFeeHeadsBreakdown:', error);
      return [];
    }
  }

  /**
   * Get installment plan for an application
   */
  static async getInstallmentPlan(applicationId: string): Promise<InstallmentPlan | null> {
    try {
      const { data: application, error } = await supabase
        .from('enrollment_applications')
        .select('additional_data')
        .eq('id', applicationId)
        .single();

      if (error) {
        console.error('Error fetching installment plan:', error);
        return null;
      }

      const additionalData = application?.additional_data as any;
      return additionalData?.installment_plan || null;
    } catch (error) {
      console.error('Error in getInstallmentPlan:', error);
      return null;
    }
  }

  /**
   * Check if payment is required for current stage
   */
  static isPaymentStage(stage: string): boolean {
    return ['application_fee', 'deposit', 'confirmed', 'admission_decision'].includes(stage);
  }
}
