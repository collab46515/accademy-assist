import { supabase } from '@/integrations/supabase/client';

export interface FeeAssignmentResult {
  success: boolean;
  invoiceId?: string;
  amount?: number;
  error?: string;
}

export class AdmissionsFeeService {
  
  /**
   * Auto-assign fees when student progresses to payment stages
   */
  static async assignFeesForStage(
    applicationId: string, 
    stage: string, 
    applicationData: any
  ): Promise<FeeAssignmentResult> {
    
    console.log(`🎯 Auto-assigning fees for stage: ${stage}`);
    
    try {
      switch (stage) {
        case 'application_fee':
          return await this.assignApplicationFee(applicationId, applicationData);
        
        case 'deposit':
          return await this.assignDepositFee(applicationId, applicationData);
        
        case 'confirmed':
          return await this.assignMainTuitionFees(applicationId, applicationData);
        
        default:
          return { success: true }; // No fees for this stage
      }
    } catch (error: any) {
      console.error('Error assigning fees:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Assign application fee (typically £50-100)
   */
  private static async assignApplicationFee(
    applicationId: string, 
    applicationData: any
  ): Promise<FeeAssignmentResult> {
    
    const applicationFeeAmount = 75; // £75 application fee
    
    const result = await this.createInvoice({
      applicationId,
      applicationData,
      amount: applicationFeeAmount,
      description: 'Application Processing Fee',
      category: 'Application Fee',
      dueInDays: 7
    });

    if (result.success) {
      console.log(`✅ Application fee assigned: £${applicationFeeAmount}`);
    }
    
    return result;
  }

  /**
   * Assign deposit fee (typically 10-20% of annual fees)
   */
  private static async assignDepositFee(
    applicationId: string, 
    applicationData: any
  ): Promise<FeeAssignmentResult> {
    
    // Get appropriate fee structure for the student's year group
    const feeStructure = await this.getFeeStructureForStudent(applicationData);
    
    if (!feeStructure) {
      return { success: false, error: 'No fee structure found for this year group' };
    }

    // Calculate 15% deposit of annual fees
    const depositAmount = Math.round(feeStructure.total_amount * 0.15);
    
    const result = await this.createInvoice({
      applicationId,
      applicationData,
      amount: depositAmount,
      description: `Admission Deposit (15% of annual fees)`,
      category: 'Deposit',
      dueInDays: 14,
      feeStructureId: feeStructure.id
    });

    if (result.success) {
      console.log(`✅ Deposit fee assigned: £${depositAmount}`);
    }
    
    return result;
  }

  /**
   * Assign main tuition fees based on year group and fee structure
   */
  private static async assignMainTuitionFees(
    applicationId: string, 
    applicationData: any
  ): Promise<FeeAssignmentResult> {
    
    // Get appropriate fee structure for the student's year group
    const feeStructure = await this.getFeeStructureForStudent(applicationData);
    
    if (!feeStructure) {
      return { success: false, error: 'No fee structure found for this year group' };
    }

    // Check if there's a class-specific amount for this year group
    const yearGroup = applicationData.year_group;
    let feeAmount = feeStructure.total_amount;
    
    if (feeStructure.year_group_amounts && feeStructure.year_group_amounts[yearGroup]) {
      feeAmount = feeStructure.year_group_amounts[yearGroup];
      console.log(`💰 Using class-specific amount for ${yearGroup}: £${feeAmount}`);
    } else {
      console.log(`💰 Using default amount: £${feeAmount}`);
    }

    // Create invoice for term fees
    const result = await this.createInvoice({
      applicationId,
      applicationData,
      amount: feeAmount,
      description: `${feeStructure.name} - ${yearGroup}`,
      category: 'Tuition',
      dueInDays: 30,
      feeStructureId: feeStructure.id
    });

    if (result.success) {
      console.log(`✅ Main tuition fees assigned: £${feeAmount}`);
    }
    
    return result;
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

      // For admissions, fetch fee structures for new students
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
    feeStructureId
  }: {
    applicationId: string;
    applicationData: any;
    amount: number;
    description: string;
    category: string;
    dueInDays: number;
    feeStructureId?: string;
  }): Promise<FeeAssignmentResult> {
    
    try {
      // Generate invoice number
      const invoiceNumber = `INV-${applicationData.application_number || applicationId.slice(-6)}-${Date.now().toString().slice(-6)}`;
      
      // Calculate due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueInDays);

      // For now, just store fee information in application data until student record is created
      // When the student record is created, we can transfer this to proper invoice records
      
      const feeAssignment = {
        id: `fee_${Date.now()}`,
        invoice_number: invoiceNumber,
        category,
        description,
        amount: amount,
        due_date: dueDate.toISOString().split('T')[0],
        status: 'pending',
        assigned_at: new Date().toISOString(),
        fee_structure_id: feeStructureId
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
   * Check if payment is required for current stage
   */
  static isPaymentStage(stage: string): boolean {
    return ['application_fee', 'deposit', 'confirmed'].includes(stage);
  }
}