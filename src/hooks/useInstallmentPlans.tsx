import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InstallmentPlan {
  id: string;
  name: string;
  description: string;
  total_amount: number;
  number_of_installments: number;
  frequency: 'monthly' | 'termly' | 'quarterly' | 'custom';
  start_date: string;
  end_date: string;
  interest_rate: number;
  status: 'active' | 'inactive' | 'completed';
  school_id: string;
  created_at: string;
  updated_at: string;
  installment_schedules?: InstallmentSchedule[];
}

export interface InstallmentSchedule {
  id: string;
  plan_id: string;
  installment_number: number;
  due_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export const useInstallmentPlans = (schoolId?: string) => {
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [schedules, setSchedules] = useState<InstallmentSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      let query = supabase.from('installment_plans').select(`
        *,
        installment_schedules(*)
      `);
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching installment plans:', error);
      toast.error('Failed to fetch installment plans');
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData: Omit<InstallmentPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('installment_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;

      // Generate installment schedules
      await generateSchedules(data.id, planData);
      
      await fetchPlans();
      toast.success('Installment plan created successfully');
      return data;
    } catch (error) {
      console.error('Error creating installment plan:', error);
      toast.error('Failed to create installment plan');
      throw error;
    }
  };

  const updatePlan = async (id: string, updates: Partial<InstallmentPlan>) => {
    try {
      const { data, error } = await supabase
        .from('installment_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPlans();
      toast.success('Installment plan updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating installment plan:', error);
      toast.error('Failed to update installment plan');
      throw error;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      // First delete schedules
      await supabase.from('installment_schedules').delete().eq('plan_id', id);
      
      // Then delete plan
      const { error } = await supabase.from('installment_plans').delete().eq('id', id);

      if (error) throw error;

      await fetchPlans();
      toast.success('Installment plan deleted successfully');
    } catch (error) {
      console.error('Error deleting installment plan:', error);
      toast.error('Failed to delete installment plan');
      throw error;
    }
  };

  const generateSchedules = async (planId: string, planData: any) => {
    try {
      const schedules: Omit<InstallmentSchedule, 'id' | 'created_at' | 'updated_at'>[] = [];
      const startDate = new Date(planData.start_date);
      const installmentAmount = Math.round((planData.total_amount * (1 + planData.interest_rate / 100)) / planData.number_of_installments * 100) / 100;

      for (let i = 0; i < planData.number_of_installments; i++) {
        const dueDate = new Date(startDate);
        
        switch (planData.frequency) {
          case 'monthly':
            dueDate.setMonth(startDate.getMonth() + i);
            break;
          case 'termly':
            dueDate.setMonth(startDate.getMonth() + (i * 4));
            break;
          case 'quarterly':
            dueDate.setMonth(startDate.getMonth() + (i * 3));
            break;
          default:
            // For custom, distribute evenly across the period
            const totalDays = Math.floor((new Date(planData.end_date).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const intervalDays = Math.floor(totalDays / planData.number_of_installments);
            dueDate.setDate(startDate.getDate() + (i * intervalDays));
        }

        schedules.push({
          plan_id: planId,
          installment_number: i + 1,
          due_date: dueDate.toISOString().split('T')[0],
          amount: i === planData.number_of_installments - 1 
            ? planData.total_amount * (1 + planData.interest_rate / 100) - (installmentAmount * (planData.number_of_installments - 1))
            : installmentAmount,
          status: 'pending'
        });
      }

      const { error } = await supabase.from('installment_schedules').insert(schedules);
      if (error) throw error;
    } catch (error) {
      console.error('Error generating schedules:', error);
      throw error;
    }
  };

  const updateScheduleStatus = async (scheduleId: string, status: 'pending' | 'paid' | 'overdue') => {
    try {
      const { error } = await supabase
        .from('installment_schedules')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', scheduleId);

      if (error) throw error;

      await fetchPlans();
      toast.success('Schedule status updated successfully');
    } catch (error) {
      console.error('Error updating schedule status:', error);
      toast.error('Failed to update schedule status');
      throw error;
    }
  };

  const exportPlansData = async () => {
    try {
      const csvData = plans.map(plan => ({
        'Plan Name': plan.name,
        'Description': plan.description,
        'Total Amount': plan.total_amount,
        'Installments': plan.number_of_installments,
        'Frequency': plan.frequency,
        'Interest Rate': plan.interest_rate + '%',
        'Start Date': plan.start_date,
        'End Date': plan.end_date,
        'Status': plan.status,
        'Students Enrolled': plan.installment_schedules?.length || 0,
        'Created': new Date(plan.created_at).toLocaleDateString()
      }));

      return csvData;
    } catch (error) {
      console.error('Error exporting plans data:', error);
      toast.error('Failed to export data');
      throw error;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [schoolId]);

  return {
    plans,
    schedules,
    loading,
    createPlan,
    updatePlan,
    deletePlan,
    updateScheduleStatus,
    exportPlansData,
    refetch: fetchPlans
  };
};