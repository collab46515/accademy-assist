import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PaymentPlan {
  id: string;
  school_id: string;
  name: string;
  description?: string;
  total_amount: number;
  number_of_installments: number;
  start_date?: string | null;
  end_date?: string | null;
  interest_rate?: number | null;
  frequency: string;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface FeeDiscount {
  id: string;
  school_id: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  applicable_fee_head_ids: string[];
  criteria?: any;
  validity_start?: string | null;
  validity_end?: string | null;
  status: string;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export const usePaymentData = (schoolId?: string) => {
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [discounts, setDiscounts] = useState<FeeDiscount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchPaymentPlans = async () => {
    try {
      console.log('Fetching payment plans for schoolId:', schoolId);
      let query = (supabase as any)
        .from('installment_plans')
        .select('*')
        .order('created_at', { ascending: false });
      if (schoolId) query = query.eq('school_id', schoolId);
      const { data, error } = await query;
      if (error) throw error;
      console.log('Fetched payment plans:', data);
      setPaymentPlans(data || []);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      setPaymentPlans([]);
    }
  };

  const fetchDiscounts = async () => {
    try {
      console.log('Fetching discounts for schoolId:', schoolId);
      let query = (supabase as any)
        .from('fee_discounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (schoolId) query = query.eq('school_id', schoolId);
      const { data, error } = await query;
      if (error) throw error;
      console.log('Fetched discounts:', data);
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setDiscounts([]);
    }
  };

  const createPaymentPlan = async (plan: Omit<PaymentPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('installment_plans')
        .insert([plan])
        .select()
        .single();
      if (error) throw error;
      setPaymentPlans(prev => [data, ...prev]);
      toast({ title: 'Success', description: 'Payment plan created' });
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create payment plan', variant: 'destructive' });
      throw error;
    }
  };

  const updatePaymentPlan = async (id: string, updates: Partial<PaymentPlan>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('installment_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setPaymentPlans(prev => prev.map(p => (p.id === id ? data : p)));
      toast({ title: 'Success', description: 'Payment plan updated' });
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update payment plan', variant: 'destructive' });
      throw error;
    }
  };

  const deletePaymentPlan = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('installment_plans')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setPaymentPlans(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Payment plan deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete payment plan', variant: 'destructive' });
      throw error;
    }
  };

  const createDiscount = async (discount: Omit<FeeDiscount, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_discounts')
        .insert([discount])
        .select()
        .single();
      if (error) throw error;
      setDiscounts(prev => [data, ...prev]);
      toast({ title: 'Success', description: 'Discount created' });
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create discount', variant: 'destructive' });
      throw error;
    }
  };

  const updateDiscount = async (id: string, updates: Partial<FeeDiscount>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_discounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setDiscounts(prev => prev.map(d => (d.id === id ? data : d)));
      toast({ title: 'Success', description: 'Discount updated' });
      return data;
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update discount', variant: 'destructive' });
      throw error;
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('fee_discounts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setDiscounts(prev => prev.filter(d => d.id !== id));
      toast({ title: 'Success', description: 'Discount deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete discount', variant: 'destructive' });
      throw error;
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchPaymentPlans(), fetchDiscounts()]);
      setLoading(false);
    };
    load();
  }, [schoolId]);

  return {
    paymentPlans,
    discounts,
    loading,
    fetchPaymentPlans,
    fetchDiscounts,
    createPaymentPlan,
    updatePaymentPlan,
    deletePaymentPlan,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  };
};
