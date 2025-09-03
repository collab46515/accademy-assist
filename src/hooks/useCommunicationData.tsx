import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from './useRBAC';
import { toast } from 'sonner';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  priority_levels: string[];
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  communication_type: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'sent' | 'scheduled';
  priority: string;
  audience_type: string;
  audience_details?: any;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  scheduled_for?: string;
  sent_at?: string;
  attachments?: any;
  total_recipients?: number;
  delivery_count?: number;
  read_count?: number;
  tags?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
  school_id: string;
  // Legacy properties for backwards compatibility
  type?: 'email' | 'sms' | 'push';
  recipients?: string[];
}

export interface CommunicationTemplate {
  id: string;
  school_id: string;
  template_name: string;
  template_type: string;
  default_audience_type?: string;
  default_priority: string;
  subject_template: string;
  content_template: string;
  description?: string;
  tags?: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Legacy properties for backwards compatibility
  name?: string;
  content?: string;
  type?: 'email' | 'sms' | 'push';
}

export interface AnnouncementStats {
  total_sent: number;
  read_rate: number;
  scheduled_count: number;
  urgent_count: number;
  totalCommunications: number;
  pendingApproval: number;
  sent: number;
  scheduled: number;
  drafts: number;
}

export function useCommunicationData() {
  const { currentSchool } = useRBAC();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    priority_levels: ['urgent', 'high']
  });

  // Fetch communications from database
  const fetchCommunications = async () => {
    if (!currentSchool?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('school_id', currentSchool.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunications(data?.map(item => ({
        ...item,
        type: 'email' as const, // Default for backwards compatibility
        recipients: [] // Default empty array for backwards compatibility
      })) || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast.error('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates from database
  const fetchTemplates = async () => {
    if (!currentSchool?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('template_name');

      if (error) throw error;
      setTemplates(data?.map(item => ({
        ...item,
        name: item.template_name, // Map for backwards compatibility
        content: item.content_template, // Map for backwards compatibility
        type: 'email' as const // Default for backwards compatibility
      })) || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  // Load data when school changes
  useEffect(() => {
    if (currentSchool?.id) {
      fetchCommunications();
      fetchTemplates();
    }
  }, [currentSchool?.id]);

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const createCommunication = async (data: any) => {
    if (!currentSchool?.id) {
      toast.error('No school selected');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: result, error } = await supabase
        .from('communications')
        .insert({
          school_id: currentSchool.id,
          title: data.title,
          content: data.content,
          communication_type: data.communication_type,
          status: data.status || 'draft',
          priority: data.priority,
          audience_type: data.audience_type,
          audience_details: data.audience_details,
          scheduled_for: data.scheduled_for,
          tags: data.tags || [],
          created_by: data.created_by
        })
        .select()
        .single();

      if (error) throw error;
      
      setCommunications(prev => [{
        ...result,
        type: 'email' as const,
        recipients: []
      }, ...prev]);
      toast.success('Communication created successfully');
      return result;
    } catch (error) {
      console.error('Error creating communication:', error);
      toast.error('Failed to create communication');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCommunication = async (id: string, data: any) => {
    try {
      setIsSubmitting(true);
      const { data: result, error } = await supabase
        .from('communications')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCommunications(prev => prev.map(comm => 
        comm.id === id ? {
          ...result,
          type: 'email' as const, // Default for backwards compatibility
          recipients: [] // Default empty array for backwards compatibility
        } : comm
      ));
      toast.success('Communication updated successfully');
      return result;
    } catch (error) {
      console.error('Error updating communication:', error);
      toast.error('Failed to update communication');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStats = () => {
    const stats = {
      totalCommunications: communications.length,
      pendingApproval: communications.filter(c => c.status === 'pending_approval').length,
      sent: communications.filter(c => c.status === 'sent').length,
      scheduled: communications.filter(c => c.status === 'scheduled').length,
      drafts: communications.filter(c => c.status === 'draft').length,
      approved: communications.filter(c => c.status === 'approved').length,
      rejected: communications.filter(c => c.status === 'rejected').length,
      total_sent: communications.filter(c => c.sent_at).length,
      read_rate: communications.length > 0 ? 
        Math.round((communications.reduce((sum, c) => sum + (c.read_count || 0), 0) / 
        communications.reduce((sum, c) => sum + (c.total_recipients || 1), 0)) * 100) : 0,
      scheduled_count: communications.filter(c => c.scheduled_for && new Date(c.scheduled_for) > new Date()).length,
      urgent_count: communications.filter(c => c.priority === 'urgent').length
    };
    return stats;
  };

  const announcementStats = getStats();

  const getFilteredCommunications = (filter: string) => {
    if (filter === 'all') return communications;
    return communications.filter(comm => comm.status === filter);
  };

  const approveCommunication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('communications')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchCommunications();
      toast.success('Communication approved successfully');
    } catch (error) {
      console.error('Error approving communication:', error);
      toast.error('Failed to approve communication');
      throw error;
    }
  };

  const rejectCommunication = async (id: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('communications')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: (await supabase.auth.getUser()).data.user?.id,
          rejection_reason: reason
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchCommunications();
      toast.success('Communication rejected');
    } catch (error) {
      console.error('Error rejecting communication:', error);
      toast.error('Failed to reject communication');
      throw error;
    }
  };

  const sendCommunication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('communications')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchCommunications();
      toast.success('Communication sent successfully');
    } catch (error) {
      console.error('Error sending communication:', error);
      toast.error('Failed to send communication');
      throw error;
    }
  };

  return {
    communications,
    templates,
    loading,
    isSubmitting,
    notificationSettings,
    announcementStats,
    updateNotificationSettings,
    createCommunication,
    updateCommunication,
    getStats,
    getFilteredCommunications,
    approveCommunication,
    rejectCommunication,
    sendCommunication
  };
}