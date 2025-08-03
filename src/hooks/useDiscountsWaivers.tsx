import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FeeDiscount {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  applicable_fee_types: string[];
  conditions: string;
  valid_from: string;
  valid_to: string;
  status: 'active' | 'inactive' | 'expired';
  created_by: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

export interface FeeWaiver {
  id: string;
  student_id: string;
  student_name: string;
  fee_type: string;
  original_amount: number;
  waived_amount: number;
  waiver_percentage: number;
  reason: string;
  requested_by: string;
  request_date: string;
  reviewed_by?: string;
  review_date?: string;
  approval_notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  supporting_documents: string[];
  school_id: string;
  created_at: string;
  updated_at: string;
}

export const useDiscountsWaivers = (schoolId?: string) => {
  const [discounts, setDiscounts] = useState<FeeDiscount[]>([]);
  const [waivers, setWaivers] = useState<FeeWaiver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      let query = supabase.from('fee_discounts').select('*');
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Failed to fetch discounts');
    }
  };

  const fetchWaivers = async () => {
    try {
      let query = supabase.from('fee_waivers').select('*');
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setWaivers(data || []);
    } catch (error) {
      console.error('Error fetching waivers:', error);
      toast.error('Failed to fetch waivers');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchDiscounts(), fetchWaivers()]);
    setLoading(false);
  };

  const createDiscount = async (discountData: Omit<FeeDiscount, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fee_discounts')
        .insert([discountData])
        .select()
        .single();

      if (error) throw error;

      await fetchDiscounts();
      toast.success('Discount created successfully');
      return data;
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error('Failed to create discount');
      throw error;
    }
  };

  const updateDiscount = async (id: string, updates: Partial<FeeDiscount>) => {
    try {
      const { data, error } = await supabase
        .from('fee_discounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchDiscounts();
      toast.success('Discount updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount');
      throw error;
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      const { error } = await supabase.from('fee_discounts').delete().eq('id', id);

      if (error) throw error;

      await fetchDiscounts();
      toast.success('Discount deleted successfully');
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error('Failed to delete discount');
      throw error;
    }
  };

  const createWaiver = async (waiverData: Omit<FeeWaiver, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Calculate waiver percentage
      const waiverPercentage = Math.round((waiverData.waived_amount / waiverData.original_amount) * 100);
      
      const { data, error } = await supabase
        .from('fee_waivers')
        .insert([{ ...waiverData, waiver_percentage: waiverPercentage }])
        .select()
        .single();

      if (error) throw error;

      await fetchWaivers();
      toast.success('Waiver request submitted successfully');
      return data;
    } catch (error) {
      console.error('Error creating waiver:', error);
      toast.error('Failed to submit waiver request');
      throw error;
    }
  };

  const updateWaiver = async (id: string, updates: Partial<FeeWaiver>) => {
    try {
      const { data, error } = await supabase
        .from('fee_waivers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchWaivers();
      toast.success('Waiver updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating waiver:', error);
      toast.error('Failed to update waiver');
      throw error;
    }
  };

  const approveWaiver = async (id: string, reviewedBy: string, approvalNotes?: string) => {
    try {
      const { data, error } = await supabase
        .from('fee_waivers')
        .update({
          status: 'approved',
          reviewed_by: reviewedBy,
          review_date: new Date().toISOString(),
          approval_notes: approvalNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchWaivers();
      toast.success('Waiver approved successfully');
      return data;
    } catch (error) {
      console.error('Error approving waiver:', error);
      toast.error('Failed to approve waiver');
      throw error;
    }
  };

  const rejectWaiver = async (id: string, reviewedBy: string, rejectionReason?: string) => {
    try {
      const { data, error } = await supabase
        .from('fee_waivers')
        .update({
          status: 'rejected',
          reviewed_by: reviewedBy,
          review_date: new Date().toISOString(),
          approval_notes: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchWaivers();
      toast.success('Waiver rejected');
      return data;
    } catch (error) {
      console.error('Error rejecting waiver:', error);
      toast.error('Failed to reject waiver');
      throw error;
    }
  };

  const exportDiscountsData = async () => {
    try {
      const csvData = discounts.map(discount => ({
        'Discount Name': discount.name,
        'Description': discount.description,
        'Type': discount.discount_type,
        'Value': discount.discount_type === 'percentage' ? discount.discount_value + '%' : '£' + discount.discount_value,
        'Applicable Fees': discount.applicable_fee_types.join(', '),
        'Conditions': discount.conditions,
        'Valid From': discount.valid_from,
        'Valid To': discount.valid_to,
        'Status': discount.status,
        'Created': new Date(discount.created_at).toLocaleDateString()
      }));

      return csvData;
    } catch (error) {
      console.error('Error exporting discounts data:', error);
      toast.error('Failed to export data');
      throw error;
    }
  };

  const exportWaiversData = async () => {
    try {
      const csvData = waivers.map(waiver => ({
        'Student Name': waiver.student_name,
        'Fee Type': waiver.fee_type,
        'Original Amount': '£' + waiver.original_amount,
        'Waived Amount': '£' + waiver.waived_amount,
        'Waiver Percentage': waiver.waiver_percentage + '%',
        'Reason': waiver.reason,
        'Requested By': waiver.requested_by,
        'Request Date': new Date(waiver.request_date).toLocaleDateString(),
        'Status': waiver.status,
        'Reviewed By': waiver.reviewed_by || 'N/A',
        'Review Date': waiver.review_date ? new Date(waiver.review_date).toLocaleDateString() : 'N/A'
      }));

      return csvData;
    } catch (error) {
      console.error('Error exporting waivers data:', error);
      toast.error('Failed to export data');
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  return {
    discounts,
    waivers,
    loading,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    createWaiver,
    updateWaiver,
    approveWaiver,
    rejectWaiver,
    exportDiscountsData,
    exportWaiversData,
    refetch: fetchData
  };
};