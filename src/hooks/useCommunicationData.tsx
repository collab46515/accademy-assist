import { useState } from 'react';

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
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'pending' | 'sent' | 'approved' | 'pending_approval';
  recipients: string[];
  created_at: string;
  communication_type: string;
  priority: string;
  audience_type: string;
  audience_details: string[] | {};
  tags: string[];
  scheduled_for?: string;
  total_recipients?: number;
  delivery_count?: number;
  read_count?: number;
  sent_at?: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  subject_template: string;
  content_template: string;
  template_type: string;
  default_priority: string;
  default_audience_type: string;
  tags: string[];
  template_name: string;
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
  const [communications] = useState<Communication[]>([]);
  const [templates] = useState<CommunicationTemplate[]>([]);
  const [loading] = useState(false);
  const [isSubmitting] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    priority_levels: ['urgent', 'high']
  });

  const [announcementStats] = useState<AnnouncementStats>({
    total_sent: 156,
    read_rate: 78,
    scheduled_count: 12,
    urgent_count: 3,
    totalCommunications: 156,
    pendingApproval: 12,
    sent: 120,
    scheduled: 12,
    drafts: 24
  });

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const createCommunication = async (data: any) => Promise.resolve();
  const updateCommunication = async (id: string, data: any) => Promise.resolve();
  const getStats = (filter?: any) => announcementStats;
  const getFilteredCommunications = (filter: any, query?: any) => communications;
  const approveCommunication = async (id: string) => Promise.resolve();
  const rejectCommunication = async (id: string, reason?: string) => Promise.resolve();
  const sendCommunication = async (id: string) => Promise.resolve();

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