import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const getErrorMessage = (err: unknown) => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  // Supabase/PostgREST errors often come as plain objects
  const anyErr = err as any;
  return (
    anyErr?.message ||
    anyErr?.error_description ||
    anyErr?.details ||
    anyErr?.hint ||
    'Unknown error'
  );
};

export interface Contractor {
  id: string;
  school_id: string;
  contractor_name: string;
  contact_person_name?: string;
  contact_phone?: string;
  contact_email?: string;
  office_address?: string;
  gst_number?: string;
  pan_number?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleContract {
  id: string;
  school_id: string;
  contractor_id: string;
  vehicle_id?: string;
  contract_number?: string;
  contract_start_date: string;
  contract_end_date: string;
  payment_type: string;
  payment_amount: number;
  payment_frequency?: string;
  terms_and_conditions?: string;
  contract_document_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  contractor?: Contractor;
}

export interface VehicleComplianceDoc {
  id: string;
  vehicle_id: string;
  document_type: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  issuing_authority?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_premium?: number;
  permit_type?: string;
  permit_states?: string[];
  document_url?: string;
  reminder_sent: boolean;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehiclePart {
  id: string;
  vehicle_id: string;
  part_name: string;
  part_serial_number?: string;
  manufacturer?: string;
  part_category?: string;
  installation_date: string;
  installation_odometer?: number;
  warranty_type?: string;
  warranty_months?: number;
  warranty_kms?: number;
  warranty_expiry_date?: string;
  standard_lifetime_months?: number;
  standard_lifetime_kms?: number;
  expected_replacement_date?: string;
  replacement_cost?: number;
  status: string;
  replaced_part_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportHoliday {
  id: string;
  school_id: string;
  holiday_name: string;
  holiday_date: string;
  holiday_type: string;
  affects_transport: boolean;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useTransportMasterData = (schoolId: string | null) => {
  const { user } = useAuth();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [contracts, setContracts] = useState<VehicleContract[]>([]);
  const [complianceDocs, setComplianceDocs] = useState<VehicleComplianceDoc[]>([]);
  const [parts, setParts] = useState<VehiclePart[]>([]);
  const [holidays, setHolidays] = useState<TransportHoliday[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterData = useCallback(async () => {
    if (!schoolId) return;

    try {
      setLoading(true);

      const [contractorsRes, contractsRes, holidaysRes] = await Promise.all([
        supabase.from('transport_contractors').select('*').eq('school_id', schoolId).order('contractor_name'),
        supabase.from('vehicle_contracts').select('*, contractor:transport_contractors(*)').eq('school_id', schoolId).order('created_at', { ascending: false }),
        supabase.from('transport_holidays').select('*').eq('school_id', schoolId).order('holiday_date', { ascending: false })
      ]);

      if (contractorsRes.data) setContractors(contractorsRes.data);
      if (contractsRes.data) setContracts(contractsRes.data);
      if (holidaysRes.data) setHolidays(holidaysRes.data);

    } catch (err) {
      console.error('Error fetching master data:', err);
      toast.error('Failed to load master data');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  // Fetch compliance docs for a specific vehicle
  const fetchComplianceDocs = async (vehicleId: string) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_compliance_docs')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('expiry_date');

      if (error) throw error;
      setComplianceDocs(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching compliance docs:', err);
      return [];
    }
  };

  // Fetch parts for a specific vehicle
  const fetchParts = async (vehicleId: string) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_parts')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('installation_date', { ascending: false });

      if (error) throw error;
      setParts(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching parts:', err);
      return [];
    }
  };

  // CRUD for Contractors
  const addContractor = async (data: Omit<Contractor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('transport_contractors')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setContractors(prev => [...prev, result]);
      toast.success('Contractor added successfully');
      return result;
    } catch (err) {
      console.error('addContractor failed:', err);
      toast.error(`Failed to add contractor: ${getErrorMessage(err)}`);
      throw err;
    }
  };

  const updateContractor = async (id: string, updates: Partial<Contractor>) => {
    try {
      const { data, error } = await supabase
        .from('transport_contractors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setContractors(prev => prev.map(c => c.id === id ? data : c));
      toast.success('Contractor updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update contractor');
      throw err;
    }
  };

  const deleteContractor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transport_contractors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContractors(prev => prev.filter(c => c.id !== id));
      toast.success('Contractor deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contractor');
      throw err;
    }
  };

  // CRUD for Compliance Docs
  const addComplianceDoc = async (data: Omit<VehicleComplianceDoc, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('vehicle_compliance_docs')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setComplianceDocs(prev => [...prev, result]);
      toast.success('Document added successfully');
      return result;
    } catch (err) {
      toast.error('Failed to add document');
      throw err;
    }
  };

  const updateComplianceDoc = async (id: string, updates: Partial<VehicleComplianceDoc>) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_compliance_docs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setComplianceDocs(prev => prev.map(d => d.id === id ? data : d));
      toast.success('Document updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update document');
      throw err;
    }
  };

  const deleteComplianceDoc = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_compliance_docs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComplianceDocs(prev => prev.filter(d => d.id !== id));
      toast.success('Document deleted successfully');
    } catch (err) {
      toast.error('Failed to delete document');
      throw err;
    }
  };

  // CRUD for Parts
  const addPart = async (data: Omit<VehiclePart, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('vehicle_parts')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setParts(prev => [...prev, result]);
      toast.success('Part added successfully');
      return result;
    } catch (err) {
      toast.error('Failed to add part');
      throw err;
    }
  };

  const updatePart = async (id: string, updates: Partial<VehiclePart>) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_parts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setParts(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Part updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update part');
      throw err;
    }
  };

  const deletePart = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_parts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setParts(prev => prev.filter(p => p.id !== id));
      toast.success('Part deleted successfully');
    } catch (err) {
      toast.error('Failed to delete part');
      throw err;
    }
  };

  // CRUD for Holidays
  const addHoliday = async (data: Omit<TransportHoliday, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('transport_holidays')
        .insert([{ ...data, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setHolidays(prev => [...prev, result]);
      toast.success('Holiday added successfully');
      return result;
    } catch (err) {
      toast.error('Failed to add holiday');
      throw err;
    }
  };

  const updateHoliday = async (id: string, updates: Partial<TransportHoliday>) => {
    try {
      const { data, error } = await supabase
        .from('transport_holidays')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setHolidays(prev => prev.map(h => h.id === id ? data : h));
      toast.success('Holiday updated successfully');
      return data;
    } catch (err) {
      toast.error('Failed to update holiday');
      throw err;
    }
  };

  const deleteHoliday = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transport_holidays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHolidays(prev => prev.filter(h => h.id !== id));
      toast.success('Holiday deleted successfully');
    } catch (err) {
      toast.error('Failed to delete holiday');
      throw err;
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  return {
    contractors,
    contracts,
    complianceDocs,
    parts,
    holidays,
    loading,
    refetch: fetchMasterData,
    fetchComplianceDocs,
    fetchParts,
    // Contractor operations
    addContractor,
    updateContractor,
    deleteContractor,
    // Compliance doc operations
    addComplianceDoc,
    updateComplianceDoc,
    deleteComplianceDoc,
    // Part operations
    addPart,
    updatePart,
    deletePart,
    // Holiday operations
    addHoliday,
    updateHoliday,
    deleteHoliday,
  };
};
