import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Communication {
  id: string;
  school_id: string;
  title: string;
  content: string;
  communication_type: string;
  status: string;
  priority: string;
  audience_type: string;
  audience_details: any;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  scheduled_for?: string;
  sent_at?: string;
  attachments: any;
  total_recipients: number;
  delivery_count: number;
  read_count: number;
  tags: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface CommunicationTemplate {
  id: string;
  school_id: string;
  template_name: string;
  template_type: string;
  subject_template: string;
  content_template: string;
  default_audience_type?: string;
  default_priority: string;
  description?: string;
  tags: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useCommunicationData = () => {
  const { user } = useAuth();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunications((data || []) as Communication[]);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communications",
        variant: "destructive",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCommunications(), fetchTemplates()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const communicationsChannel = supabase
      .channel('communications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'communications'
        },
        () => {
          fetchCommunications();
        }
      )
      .subscribe();

    const templatesChannel = supabase
      .channel('templates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'communication_templates'
        },
        () => {
          fetchTemplates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(communicationsChannel);
      supabase.removeChannel(templatesChannel);
    };
  }, [user]);

  const createCommunication = async (communicationData: Partial<Communication>) => {
    if (!user) throw new Error('User not authenticated');

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('communications')
        .insert({
          ...communicationData,
          created_by: user.id,
          school_id: communicationData.school_id || '00000000-0000-0000-0000-000000000000'
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Communication created successfully",
      });

      await fetchCommunications();
      return data;
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Error",
        description: "Failed to create communication",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCommunication = async (id: string, updates: Partial<Communication>) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('communications')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Communication updated successfully",
      });

      await fetchCommunications();
      return data;
    } catch (error) {
      console.error('Error updating communication:', error);
      toast({
        title: "Error",
        description: "Failed to update communication",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveCommunication = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    return updateCommunication(id, {
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString()
    });
  };

  const rejectCommunication = async (id: string, reason: string) => {
    if (!user) throw new Error('User not authenticated');

    return updateCommunication(id, {
      status: 'rejected',
      rejected_by: user.id,
      rejected_at: new Date().toISOString(),
      rejection_reason: reason
    });
  };

  const submitForApproval = async (id: string) => {
    return updateCommunication(id, {
      status: 'pending_approval'
    });
  };

  const sendCommunication = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    return updateCommunication(id, {
      status: 'sent',
      sent_at: new Date().toISOString()
    });
  };

  const createTemplate = async (templateData: Partial<CommunicationTemplate>) => {
    if (!user) throw new Error('User not authenticated');

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .insert({
          ...templateData,
          created_by: user.id,
          school_id: templateData.school_id || '00000000-0000-0000-0000-000000000000'
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template created successfully",
      });

      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Analytics and statistics
  const getStats = () => {
    const totalCommunications = communications.length;
    const pendingApproval = communications.filter(c => c.status === 'pending_approval').length;
    const sent = communications.filter(c => c.status === 'sent').length;
    const scheduled = communications.filter(c => c.status === 'scheduled').length;
    const drafts = communications.filter(c => c.status === 'draft').length;

    return {
      totalCommunications,
      pendingApproval,
      sent,
      scheduled,
      drafts
    };
  };

  const getFilteredCommunications = (filter: string) => {
    if (filter === 'all') return communications;
    return communications.filter(communication => communication.status === filter);
  };

  return {
    communications,
    templates,
    loading,
    isSubmitting,
    createCommunication,
    updateCommunication,
    approveCommunication,
    rejectCommunication,
    submitForApproval,
    sendCommunication,
    createTemplate,
    getStats,
    getFilteredCommunications,
    fetchCommunications,
    fetchTemplates
  };
};