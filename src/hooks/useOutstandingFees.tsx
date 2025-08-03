import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OutstandingFee {
  id: string;
  student_id: string;
  student_name: string;
  year_group: string;
  fee_type: string;
  original_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  due_date: string;
  days_past_due: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  last_reminder_sent?: string;
  reminder_count: number;
  status: 'current' | 'overdue' | 'severely_overdue';
  payment_plan_id?: string;
  payment_plan_name?: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  reminder_type: 'email' | 'sms' | 'both';
  trigger_days: number;
  is_active: boolean;
}

export const useOutstandingFees = (schoolId?: string) => {
  const [outstandingFees, setOutstandingFees] = useState<OutstandingFee[]>([]);
  const [reminderTemplates, setReminderTemplates] = useState<ReminderTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutstandingFees = async () => {
    try {
      setLoading(true);
      let query = supabase.from('outstanding_fees').select(`
        *,
        installment_plans!payment_plan_id(name)
      `);
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query.order('days_past_due', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to calculate current status based on days past due
      const processedData = (data || []).map(fee => ({
        ...fee,
        payment_plan_name: fee.installment_plans?.name,
        status: fee.days_past_due <= 0 ? 'current' : 
                fee.days_past_due <= 30 ? 'overdue' : 'severely_overdue'
      }));
      
      setOutstandingFees(processedData);
    } catch (error) {
      console.error('Error fetching outstanding fees:', error);
      toast.error('Failed to fetch outstanding fees');
    } finally {
      setLoading(false);
    }
  };

  const fetchReminderTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('reminder_templates')
        .select('*')
        .eq('is_active', true)
        .order('trigger_days');
      
      if (error) throw error;
      setReminderTemplates(data || []);
    } catch (error) {
      console.error('Error fetching reminder templates:', error);
    }
  };

  const sendReminder = async (feeId: string, reminderType: 'email' | 'sms' | 'call') => {
    try {
      const fee = outstandingFees.find(f => f.id === feeId);
      if (!fee) throw new Error('Fee not found');

      // Update reminder count and last sent date
      const { error } = await supabase
        .from('outstanding_fees')
        .update({
          last_reminder_sent: new Date().toISOString(),
          reminder_count: fee.reminder_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', feeId);

      if (error) throw error;

      // Log the reminder activity (you could create a separate table for this)
      await supabase.from('reminder_logs').insert({
        outstanding_fee_id: feeId,
        reminder_type: reminderType,
        recipient: reminderType === 'email' ? fee.parent_email : fee.parent_phone,
        sent_at: new Date().toISOString(),
        status: 'sent'
      });

      await fetchOutstandingFees();
      toast.success(`${reminderType.charAt(0).toUpperCase() + reminderType.slice(1)} reminder sent successfully`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
      throw error;
    }
  };

  const sendBulkReminders = async (feeIds: string[], reminderType: 'email' | 'sms') => {
    try {
      const promises = feeIds.map(id => sendReminder(id, reminderType));
      await Promise.all(promises);
      
      toast.success(`Bulk ${reminderType} reminders sent to ${feeIds.length} recipients`);
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
      toast.error('Failed to send bulk reminders');
      throw error;
    }
  };

  const updateFeeStatus = async (feeId: string, paidAmount: number) => {
    try {
      const fee = outstandingFees.find(f => f.id === feeId);
      if (!fee) throw new Error('Fee not found');

      const newOutstandingAmount = fee.original_amount - paidAmount;
      const newStatus = newOutstandingAmount <= 0 ? 'paid' : 
                       fee.days_past_due <= 0 ? 'current' : 
                       fee.days_past_due <= 30 ? 'overdue' : 'severely_overdue';

      const { error } = await supabase
        .from('outstanding_fees')
        .update({
          paid_amount: paidAmount,
          outstanding_amount: newOutstandingAmount,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', feeId);

      if (error) throw error;

      await fetchOutstandingFees();
      toast.success('Fee status updated successfully');
    } catch (error) {
      console.error('Error updating fee status:', error);
      toast.error('Failed to update fee status');
      throw error;
    }
  };

  const createPaymentPlan = async (feeId: string, planDetails: any) => {
    try {
      // This would integrate with your installment plans system
      const fee = outstandingFees.find(f => f.id === feeId);
      if (!fee) throw new Error('Fee not found');

      // Create installment plan for this specific fee
      const { data: planData, error: planError } = await supabase
        .from('installment_plans')
        .insert({
          name: `Payment Plan for ${fee.student_name} - ${fee.fee_type}`,
          description: `Custom payment plan for outstanding ${fee.fee_type}`,
          total_amount: fee.outstanding_amount,
          number_of_installments: planDetails.installments,
          frequency: planDetails.frequency,
          start_date: planDetails.startDate,
          end_date: planDetails.endDate,
          interest_rate: planDetails.interestRate || 0,
          status: 'active',
          school_id: fee.school_id
        })
        .select()
        .single();

      if (planError) throw planError;

      // Link the fee to this payment plan
      const { error: updateError } = await supabase
        .from('outstanding_fees')
        .update({
          payment_plan_id: planData.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', feeId);

      if (updateError) throw updateError;

      await fetchOutstandingFees();
      toast.success('Payment plan created successfully');
      return planData;
    } catch (error) {
      console.error('Error creating payment plan:', error);
      toast.error('Failed to create payment plan');
      throw error;
    }
  };

  const exportOutstandingFeesData = async (filters?: any) => {
    try {
      let filteredFees = outstandingFees;
      
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          filteredFees = filteredFees.filter(fee => fee.status === filters.status);
        }
        if (filters.yearGroup) {
          filteredFees = filteredFees.filter(fee => fee.year_group === filters.yearGroup);
        }
        if (filters.feeType) {
          filteredFees = filteredFees.filter(fee => fee.fee_type === filters.feeType);
        }
      }

      const csvData = filteredFees.map(fee => ({
        'Student Name': fee.student_name,
        'Student ID': fee.student_id,
        'Year Group': fee.year_group,
        'Fee Type': fee.fee_type,
        'Original Amount': '£' + fee.original_amount.toFixed(2),
        'Paid Amount': '£' + fee.paid_amount.toFixed(2),
        'Outstanding Amount': '£' + fee.outstanding_amount.toFixed(2),
        'Due Date': new Date(fee.due_date).toLocaleDateString(),
        'Days Past Due': fee.days_past_due,
        'Status': fee.status,
        'Parent Name': fee.parent_name,
        'Parent Email': fee.parent_email,
        'Parent Phone': fee.parent_phone,
        'Payment Plan': fee.payment_plan_name || 'None',
        'Reminder Count': fee.reminder_count,
        'Last Reminder': fee.last_reminder_sent ? new Date(fee.last_reminder_sent).toLocaleDateString() : 'Never'
      }));

      return csvData;
    } catch (error) {
      console.error('Error exporting outstanding fees data:', error);
      toast.error('Failed to export data');
      throw error;
    }
  };

  const getAnalytics = () => {
    const totalOutstanding = outstandingFees.reduce((sum, fee) => sum + fee.outstanding_amount, 0);
    const totalPaid = outstandingFees.reduce((sum, fee) => sum + fee.paid_amount, 0);
    const totalOriginal = outstandingFees.reduce((sum, fee) => sum + fee.original_amount, 0);
    
    const currentFees = outstandingFees.filter(fee => fee.status === 'current');
    const overdueFees = outstandingFees.filter(fee => fee.status === 'overdue');
    const severelyOverdueFees = outstandingFees.filter(fee => fee.status === 'severely_overdue');
    
    const collectionRate = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;
    
    return {
      totalOutstanding,
      totalPaid,
      totalOriginal,
      collectionRate,
      currentFees: currentFees.length,
      overdueFees: overdueFees.length,
      severelyOverdueFees: severelyOverdueFees.length,
      currentFeesAmount: currentFees.reduce((sum, fee) => sum + fee.outstanding_amount, 0),
      overdueFeesAmount: overdueFees.reduce((sum, fee) => sum + fee.outstanding_amount, 0),
      severelyOverdueFeesAmount: severelyOverdueFees.reduce((sum, fee) => sum + fee.outstanding_amount, 0)
    };
  };

  useEffect(() => {
    Promise.all([fetchOutstandingFees(), fetchReminderTemplates()]);
  }, [schoolId]);

  return {
    outstandingFees,
    reminderTemplates,
    loading,
    sendReminder,
    sendBulkReminders,
    updateFeeStatus,
    createPaymentPlan,
    exportOutstandingFeesData,
    getAnalytics,
    refetch: fetchOutstandingFees
  };
};