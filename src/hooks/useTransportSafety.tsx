import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

// Transport Incidents
export const useTransportIncidents = () => {
  return useQuery({
    queryKey: ['transport-incidents', SCHOOL_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_incidents')
        .select('*, vehicles(registration_number, make, model), drivers(first_name, last_name), routes(route_name)')
        .eq('school_id', SCHOOL_ID)
        .order('incident_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (incident: any) => {
      const incidentNumber = `INC-${Date.now().toString(36).toUpperCase()}`;
      const { data, error } = await supabase
        .from('transport_incidents')
        .insert({ ...incident, school_id: SCHOOL_ID, incident_number: incidentNumber })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-incidents'] });
      toast({ title: 'Incident reported successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to report incident', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('transport_incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-incidents'] });
      toast({ title: 'Incident updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update incident', description: error.message, variant: 'destructive' });
    },
  });
};

// Safety Checklists
export const useSafetyChecklists = () => {
  return useQuery({
    queryKey: ['safety-checklists', SCHOOL_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_safety_checklists')
        .select('*')
        .eq('school_id', SCHOOL_ID)
        .order('checklist_name');
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateChecklist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (checklist: any) => {
      const { data, error } = await supabase
        .from('transport_safety_checklists')
        .insert({ ...checklist, school_id: SCHOOL_ID })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-checklists'] });
      toast({ title: 'Checklist created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create checklist', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateChecklist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('transport_safety_checklists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-checklists'] });
      toast({ title: 'Checklist updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update checklist', description: error.message, variant: 'destructive' });
    },
  });
};

// Checklist Completions
export const useChecklistCompletions = () => {
  return useQuery({
    queryKey: ['checklist-completions', SCHOOL_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_checklist_completions')
        .select('*, transport_safety_checklists(checklist_name, checklist_type), vehicles(registration_number), drivers(first_name, last_name)')
        .eq('school_id', SCHOOL_ID)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateChecklistCompletion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (completion: any) => {
      const { data, error } = await supabase
        .from('transport_checklist_completions')
        .insert({ ...completion, school_id: SCHOOL_ID })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-completions'] });
      toast({ title: 'Checklist completed successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to complete checklist', description: error.message, variant: 'destructive' });
    },
  });
};

// Driver Certifications
export const useDriverCertifications = () => {
  return useQuery({
    queryKey: ['driver-certifications', SCHOOL_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_certifications')
        .select('*, drivers(first_name, last_name)')
        .eq('school_id', SCHOOL_ID)
        .order('expiry_date');
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCertification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (certification: any) => {
      const { data, error } = await supabase
        .from('driver_certifications')
        .insert({ ...certification, school_id: SCHOOL_ID })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-certifications'] });
      toast({ title: 'Certification added successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to add certification', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateCertification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('driver_certifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-certifications'] });
      toast({ title: 'Certification updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update certification', description: error.message, variant: 'destructive' });
    },
  });
};

// Vehicle Inspections
export const useVehicleInspections = () => {
  return useQuery({
    queryKey: ['vehicle-inspections', SCHOOL_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_inspections')
        .select('*, vehicles(registration_number, make, model)')
        .eq('school_id', SCHOOL_ID)
        .order('inspection_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateInspection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inspection: any) => {
      const { data, error } = await supabase
        .from('vehicle_inspections')
        .insert({ ...inspection, school_id: SCHOOL_ID })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inspections'] });
      toast({ title: 'Inspection recorded successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to record inspection', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateInspection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('vehicle_inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-inspections'] });
      toast({ title: 'Inspection updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update inspection', description: error.message, variant: 'destructive' });
    },
  });
};

// Safety Training
export const useSafetyTraining = () => {
  return useQuery({
    queryKey: ['safety-training', SCHOOL_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_safety_training')
        .select('*, drivers(first_name, last_name)')
        .eq('school_id', SCHOOL_ID)
        .order('training_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (training: any) => {
      const { data, error } = await supabase
        .from('transport_safety_training')
        .insert({ ...training, school_id: SCHOOL_ID })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-training'] });
      toast({ title: 'Training record added successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to add training record', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('transport_safety_training')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-training'] });
      toast({ title: 'Training record updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update training record', description: error.message, variant: 'destructive' });
    },
  });
};
