import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface NotificationTemplate {
  id: string;
  school_id: string;
  template_name: string;
  template_type: string;
  event_trigger: string;
  subject_template?: string;
  body_template: string;
  variables?: string[];
  is_active: boolean;
  send_to_parent: boolean;
  send_to_admin: boolean;
  send_to_driver: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  school_id: string;
  parent_id: string;
  student_id: string;
  notify_trip_start: boolean;
  notify_trip_end: boolean;
  notify_student_board: boolean;
  notify_student_alight: boolean;
  notify_delays: boolean;
  notify_emergencies: boolean;
  notify_arrival_soon: boolean;
  arrival_notify_minutes: number;
  preferred_channel: string;
  phone_number?: string;
  email?: string;
  whatsapp_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  school_id: string;
  template_id?: string;
  trip_instance_id?: string;
  recipient_type: string;
  recipient_id: string;
  recipient_contact: string;
  channel: string;
  event_trigger: string;
  subject?: string;
  message: string;
  status: string;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  school_id: string;
  student_id: string;
  contact_name: string;
  relationship: string;
  phone_primary: string;
  phone_secondary?: string;
  email?: string;
  is_authorized_pickup: boolean;
  priority_order: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Geofence {
  id: string;
  school_id: string;
  name: string;
  geofence_type: string;
  reference_id?: string;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
  trigger_on_entry: boolean;
  trigger_on_exit: boolean;
  notification_template_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTransportNotifications = (schoolId: string | null) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!schoolId) return;

    try {
      setLoading(true);
      const [templatesRes, logsRes, geofencesRes] = await Promise.all([
        supabase.from('transport_notification_templates').select('*').eq('school_id', schoolId).order('template_name'),
        supabase.from('transport_notification_logs').select('*').eq('school_id', schoolId).order('created_at', { ascending: false }).limit(100),
        supabase.from('transport_geofences').select('*').eq('school_id', schoolId).order('name')
      ]);

      if (templatesRes.data) setTemplates(templatesRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      if (geofencesRes.data) setGeofences(geofencesRes.data);
    } catch (err) {
      console.error('Error fetching notification data:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  // CRUD for Templates
  const addTemplate = async (data: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('transport_notification_templates')
        .insert([{ ...data, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setTemplates(prev => [...prev, result]);
      toast.success('Template created');
      return result;
    } catch (err) {
      toast.error('Failed to create template');
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<NotificationTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('transport_notification_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Template updated');
      return data;
    } catch (err) {
      toast.error('Failed to update template');
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase.from('transport_notification_templates').delete().eq('id', id);
      if (error) throw error;
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch (err) {
      toast.error('Failed to delete template');
      throw err;
    }
  };

  // CRUD for Emergency Contacts
  const fetchEmergencyContacts = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('transport_emergency_contacts')
        .select('*')
        .eq('student_id', studentId)
        .order('priority_order');

      if (error) throw error;
      setEmergencyContacts(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching emergency contacts:', err);
      return [];
    }
  };

  const addEmergencyContact = async (data: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('transport_emergency_contacts')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setEmergencyContacts(prev => [...prev, result]);
      toast.success('Emergency contact added');
      return result;
    } catch (err) {
      toast.error('Failed to add emergency contact');
      throw err;
    }
  };

  const updateEmergencyContact = async (id: string, updates: Partial<EmergencyContact>) => {
    try {
      const { data, error } = await supabase
        .from('transport_emergency_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEmergencyContacts(prev => prev.map(c => c.id === id ? data : c));
      toast.success('Contact updated');
      return data;
    } catch (err) {
      toast.error('Failed to update contact');
      throw err;
    }
  };

  const deleteEmergencyContact = async (id: string) => {
    try {
      const { error } = await supabase.from('transport_emergency_contacts').delete().eq('id', id);
      if (error) throw error;
      setEmergencyContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Contact deleted');
    } catch (err) {
      toast.error('Failed to delete contact');
      throw err;
    }
  };

  // CRUD for Geofences
  const addGeofence = async (data: Omit<Geofence, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: result, error } = await supabase
        .from('transport_geofences')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setGeofences(prev => [...prev, result]);
      toast.success('Geofence created');
      return result;
    } catch (err) {
      toast.error('Failed to create geofence');
      throw err;
    }
  };

  const updateGeofence = async (id: string, updates: Partial<Geofence>) => {
    try {
      const { data, error } = await supabase
        .from('transport_geofences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGeofences(prev => prev.map(g => g.id === id ? data : g));
      toast.success('Geofence updated');
      return data;
    } catch (err) {
      toast.error('Failed to update geofence');
      throw err;
    }
  };

  const deleteGeofence = async (id: string) => {
    try {
      const { error } = await supabase.from('transport_geofences').delete().eq('id', id);
      if (error) throw error;
      setGeofences(prev => prev.filter(g => g.id !== id));
      toast.success('Geofence deleted');
    } catch (err) {
      toast.error('Failed to delete geofence');
      throw err;
    }
  };

  // Send notification
  const sendNotification = async (
    templateId: string,
    recipientType: string,
    recipientId: string,
    recipientContact: string,
    channel: string,
    variables: Record<string, string> = {}
  ) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    let message = template.body_template;
    let subject = template.subject_template || '';

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    try {
      const { data, error } = await supabase
        .from('transport_notification_logs')
        .insert([{
          school_id: schoolId,
          template_id: templateId,
          recipient_type: recipientType,
          recipient_id: recipientId,
          recipient_contact: recipientContact,
          channel,
          event_trigger: template.event_trigger,
          subject,
          message,
          variables_used: variables,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      setLogs(prev => [data, ...prev]);
      toast.success('Notification queued');
      return data;
    } catch (err) {
      toast.error('Failed to send notification');
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    templates,
    preferences,
    logs,
    emergencyContacts,
    geofences,
    loading,
    refetch: fetchData,
    // Template operations
    addTemplate,
    updateTemplate,
    deleteTemplate,
    // Emergency contact operations
    fetchEmergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    // Geofence operations
    addGeofence,
    updateGeofence,
    deleteGeofence,
    // Notification operations
    sendNotification
  };
};
