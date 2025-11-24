import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface FeeHead {
  id: string;
  school_id: string;
  name: string;
  description?: string;
  category: string;
  amount: number;
  recurrence: string;
  applicable_classes?: string[];
  applicable_genders?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeStructure {
  id: string;
  school_id: string;
  name: string;
  description?: string;
  academic_year: string;
  term: string;
  fee_heads: any[];
  total_amount: number;
  applicable_year_groups?: string[];
  student_type?: 'new' | 'existing' | 'all';
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  school_id: string;
  student_id: string;
  fee_structure_id?: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method?: string;
  paid_amount: number;
  paid_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useFeeData = (schoolId?: string) => {
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeeHeads = async () => {
    try {
      let query = (supabase as any).from('fee_heads').select('*').order('name');
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const result = await query;
      if (result.error) throw result.error;
      console.log('Fetched fee heads:', result.data);
      setFeeHeads(result.data || []);
    } catch (error) {
      console.error('Error fetching fee heads:', error);
      setFeeHeads([]); // Set empty array on error
    }
  };

  const fetchFeeStructures = async () => {
    try {
      // Temporary fallback using any type until types are regenerated
      let query = (supabase as any).from('fee_structures').select('*').order('created_at', { ascending: false });

      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;
      if (error) throw error;
      console.log('Fetched fee structures:', data);
      setFeeStructures(data || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      setFeeStructures([]);
    }
  };

  const fetchInvoices = async () => {
    try {
      // Temporary fallback using any type until types are regenerated
      let query = (supabase as any).from('invoices').select('*').order('created_at', { ascending: false }).limit(100);

      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    }
  };

  const createFeeHead = async (feeHead: Omit<FeeHead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_heads')
        .insert([feeHead])
        .select()
        .single();

      if (error) throw error;

      setFeeHeads(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Fee head created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create fee head",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFeeHead = async (id: string, updates: Partial<FeeHead>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_heads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFeeHeads(prev => prev.map(head => head.id === id ? data : head));
      toast({
        title: "Success",
        description: "Fee head updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fee head",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFeeHead = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('fee_heads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeeHeads(prev => prev.filter(head => head.id !== id));
      toast({
        title: "Success",
        description: "Fee head deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fee head",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createFeeStructure = async (structure: Omit<FeeStructure, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_structures')
        .insert([structure])
        .select()
        .single();

      if (error) throw error;

      setFeeStructures(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Fee structure created successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create fee structure",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFeeStructure = async (id: string, updates: Partial<FeeStructure>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('fee_structures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFeeStructures(prev => prev.map(structure => structure.id === id ? data : structure));
      toast({
        title: "Success",
        description: "Fee structure updated successfully",
      });
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fee structure",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFeeStructure = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('fee_structures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeeStructures(prev => prev.filter(structure => structure.id !== id));
      toast({
        title: "Success",
        description: "Fee structure deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fee structure",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeeHeads(),
        fetchFeeStructures(),
        fetchInvoices()
      ]);
      setLoading(false);
    };

    loadData();
  }, [schoolId]);

  return {
    feeHeads,
    feeStructures,
    invoices,
    loading,
    createFeeHead,
    updateFeeHead,
    deleteFeeHead,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    refetch: () => {
      fetchFeeHeads();
      fetchFeeStructures();
      fetchInvoices();
    }
  };
};