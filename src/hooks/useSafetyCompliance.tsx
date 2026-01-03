import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface SafetyChecklist {
  id: string;
  school_id: string;
  checklist_name: string;
  checklist_type: string;
  applies_to: string;
  is_mandatory: boolean;
  is_active: boolean;
  items: { item_id: string; item_text: string; category: string }[];
  created_at: string;
  updated_at: string;
}

export interface ChecklistCompletion {
  id: string;
  school_id: string;
  checklist_id: string;
  completed_by: string;
  completed_at: string;
  overall_status: string;
  vehicle_id?: string;
  driver_id?: string;
  responses: any[];
  notes?: string;
  checklist_name?: string;
}

export interface DriverCertification {
  id: string;
  school_id: string;
  driver_id: string;
  certification_type: string;
  certification_name: string;
  issuing_authority?: string;
  certificate_number?: string;
  issue_date: string;
  expiry_date?: string;
  notes?: string;
  document_url?: string;
  driver_name?: string;
}

export interface VehicleInspection {
  id: string;
  school_id: string;
  vehicle_id: string;
  inspection_type: string;
  inspection_date: string;
  inspector_name: string;
  inspector_type: string;
  overall_result: string;
  odometer_reading?: number;
  defects_found: string[];
  notes?: string;
  document_url?: string;
  vehicle_reg?: string;
}

export interface SafetyTraining {
  id: string;
  school_id: string;
  driver_id?: string;
  training_type: string;
  training_name: string;
  training_provider?: string;
  training_date: string;
  duration_hours?: number;
  status: string;
  score?: number;
  passing_score?: number;
  passed?: boolean;
  notes?: string;
  certificate_url?: string;
  driver_name?: string;
}

export const useSafetyCompliance = () => {
  const { currentSchool } = useRBAC();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const [checklists, setChecklists] = useState<SafetyChecklist[]>([]);
  const [completions, setCompletions] = useState<ChecklistCompletion[]>([]);
  const [certifications, setCertifications] = useState<DriverCertification[]>([]);
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [trainings, setTrainings] = useState<SafetyTraining[]>([]);

  const schoolId = currentSchool?.id;

  const parseItems = (items: Json | null): { item_id: string; item_text: string; category: string }[] => {
    if (!items) return [];
    if (Array.isArray(items)) {
      return items as { item_id: string; item_text: string; category: string }[];
    }
    return [];
  };

  const parseDefects = (defects: Json | null): string[] => {
    if (!defects) return [];
    if (Array.isArray(defects)) {
      return defects as string[];
    }
    return [];
  };

  const fetchData = useCallback(async () => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch all data in parallel
      const [checklistsRes, completionsRes, certsRes, inspectionsRes, trainingsRes] = await Promise.all([
        supabase
          .from('transport_safety_checklists')
          .select('*')
          .eq('school_id', schoolId)
          .order('created_at', { ascending: false }),
        supabase
          .from('transport_checklist_completions')
          .select('*, transport_safety_checklists(checklist_name)')
          .eq('school_id', schoolId)
          .order('completed_at', { ascending: false })
          .limit(20),
        supabase
          .from('driver_certifications')
          .select('*, drivers(first_name, last_name)')
          .eq('school_id', schoolId)
          .order('created_at', { ascending: false }),
        supabase
          .from('vehicle_inspections')
          .select('*, vehicles(registration_number)')
          .eq('school_id', schoolId)
          .order('inspection_date', { ascending: false }),
        supabase
          .from('transport_safety_training')
          .select('*, drivers(first_name, last_name)')
          .eq('school_id', schoolId)
          .order('training_date', { ascending: false }),
      ]);

      if (checklistsRes.data) {
        setChecklists(checklistsRes.data.map((c: any) => ({
          ...c,
          items: parseItems(c.items),
        })));
      }

      if (completionsRes.data) {
        setCompletions(completionsRes.data.map((c: any) => ({
          ...c,
          checklist_name: c.transport_safety_checklists?.checklist_name || 'Unknown',
        })));
      }

      if (certsRes.data) {
        setCertifications(certsRes.data.map((c: any) => ({
          ...c,
          driver_name: c.drivers ? `${c.drivers.first_name} ${c.drivers.last_name}` : 'Unknown',
        })));
      }

      if (inspectionsRes.data) {
        setInspections(inspectionsRes.data.map((i: any) => ({
          ...i,
          vehicle_reg: i.vehicles?.registration_number || 'Unknown',
          defects_found: parseDefects(i.defects_found),
        })));
      }

      if (trainingsRes.data) {
        setTrainings(trainingsRes.data.map((t: any) => ({
          ...t,
          driver_name: t.drivers ? `${t.drivers.first_name} ${t.drivers.last_name}` : null,
        })));
      }
    } catch (error) {
      console.error('Error fetching safety compliance data:', error);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Checklist CRUD
  const addChecklist = async (data: Partial<SafetyChecklist>) => {
    if (!schoolId) return null;
    
    const insertData = {
      school_id: schoolId,
      checklist_name: data.checklist_name!,
      checklist_type: data.checklist_type || 'pre_trip',
      applies_to: data.applies_to || 'vehicle',
      is_mandatory: data.is_mandatory ?? true,
      items: data.items as unknown as Json,
    };

    const { data: result, error } = await supabase
      .from('transport_safety_checklists')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to create checklist', variant: 'destructive' });
      return null;
    }

    setChecklists([{ ...result, items: parseItems(result.items) }, ...checklists]);
    toast({ title: 'Checklist created successfully' });
    return result;
  };

  const updateChecklist = async (id: string, data: Partial<SafetyChecklist>) => {
    const updateData: any = { updated_at: new Date().toISOString() };
    if (data.checklist_name !== undefined) updateData.checklist_name = data.checklist_name;
    if (data.checklist_type !== undefined) updateData.checklist_type = data.checklist_type;
    if (data.applies_to !== undefined) updateData.applies_to = data.applies_to;
    if (data.is_mandatory !== undefined) updateData.is_mandatory = data.is_mandatory;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.items !== undefined) updateData.items = data.items as unknown as Json;

    const { error } = await supabase
      .from('transport_safety_checklists')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update checklist', variant: 'destructive' });
      return false;
    }

    setChecklists(checklists.map(c => c.id === id ? { ...c, ...data } : c));
    toast({ title: 'Checklist updated successfully' });
    return true;
  };

  const toggleChecklistActive = async (id: string) => {
    const checklist = checklists.find(c => c.id === id);
    if (!checklist) return;
    
    await updateChecklist(id, { is_active: !checklist.is_active });
  };

  // Certification CRUD
  const addCertification = async (data: Partial<DriverCertification>, driverName: string) => {
    if (!schoolId) return null;
    
    const insertData = {
      school_id: schoolId,
      driver_id: data.driver_id!,
      certification_type: data.certification_type!,
      certification_name: data.certification_name!,
      issuing_authority: data.issuing_authority || null,
      certificate_number: data.certificate_number || null,
      issue_date: data.issue_date!,
      expiry_date: data.expiry_date || null,
      notes: data.notes || null,
    };

    const { data: result, error } = await supabase
      .from('driver_certifications')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to add certification', variant: 'destructive' });
      return null;
    }

    setCertifications([{ ...result, driver_name: driverName }, ...certifications]);
    toast({ title: 'Certification added successfully' });
    return result;
  };

  // Inspection CRUD
  const addInspection = async (data: Partial<VehicleInspection>, vehicleReg: string) => {
    if (!schoolId) return null;
    
    const insertData = {
      school_id: schoolId,
      vehicle_id: data.vehicle_id!,
      inspection_type: data.inspection_type || 'daily',
      inspection_date: data.inspection_date!,
      inspector_name: data.inspector_name!,
      inspector_type: data.inspector_type || 'internal',
      overall_result: data.overall_result || 'pass',
      odometer_reading: data.odometer_reading || null,
      defects_found: (data.defects_found || []) as unknown as Json,
      notes: data.notes || null,
    };

    const { data: result, error } = await supabase
      .from('vehicle_inspections')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to record inspection', variant: 'destructive' });
      return null;
    }

    setInspections([{ ...result, vehicle_reg: vehicleReg, defects_found: parseDefects(result.defects_found) }, ...inspections]);
    toast({ title: 'Inspection recorded successfully' });
    return result;
  };

  // Training CRUD
  const addTraining = async (data: Partial<SafetyTraining>, driverName?: string) => {
    if (!schoolId) return null;
    
    const insertData = {
      school_id: schoolId,
      driver_id: data.driver_id || null,
      training_type: data.training_type || 'induction',
      training_name: data.training_name!,
      training_provider: data.training_provider || null,
      training_date: data.training_date!,
      duration_hours: data.duration_hours || null,
      status: data.status || 'completed',
      score: data.score || null,
      passing_score: data.passing_score || null,
      passed: data.passed ?? null,
      notes: data.notes || null,
    };

    const { data: result, error } = await supabase
      .from('transport_safety_training')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to add training record', variant: 'destructive' });
      return null;
    }

    setTrainings([{ ...result, driver_name: driverName || null }, ...trainings]);
    toast({ title: 'Training record added successfully' });
    return result;
  };

  return {
    loading,
    schoolId,
    // Checklists
    checklists,
    completions,
    addChecklist,
    updateChecklist,
    toggleChecklistActive,
    // Certifications
    certifications,
    addCertification,
    // Inspections
    inspections,
    addInspection,
    // Training
    trainings,
    addTraining,
    // Refetch
    refetch: fetchData,
  };
};
