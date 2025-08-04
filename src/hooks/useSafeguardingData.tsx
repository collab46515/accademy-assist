import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SafeguardingConcern {
  id: string;
  concern_number: string;
  school_id: string;
  concern_type: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  student_id?: string;
  concern_details: string;
  incident_date?: string;
  location?: string;
  witnesses?: string[];
  immediate_action_taken?: string;
  agencies_contacted?: string[];
  parents_informed: boolean;
  parent_notification_details?: string;
  police_involved: boolean;
  police_reference?: string;
  social_services_involved: boolean;
  social_services_reference?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  reported_by?: string;
  dsl_assigned?: string;
  case_notes?: string;
  next_review_date?: string;
  outcome?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface SafeguardingStats {
  total: number;
  active: number;
  highPriority: number;
  thisMonth: number;
  resolved: number;
}

export const useSafeguardingData = () => {
  const [concerns, setConcerns] = useState<SafeguardingConcern[]>([]);
  const [stats, setStats] = useState<SafeguardingStats>({
    total: 0,
    active: 0,
    highPriority: 0,
    thisMonth: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConcerns = async () => {
    try {
      const { data, error } = await supabase
        .from('safeguarding_concerns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConcerns(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter(c => c.status === 'open' || c.status === 'in_progress').length || 0;
      const highPriority = data?.filter(c => 
        (c.risk_level === 'high' || c.risk_level === 'critical') && 
        (c.status === 'open' || c.status === 'in_progress')
      ).length || 0;
      
      // Calculate this month's concerns
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const thisMonth = data?.filter(c => 
        c.created_at.startsWith(currentMonth)
      ).length || 0;
      
      const resolved = data?.filter(c => c.status === 'resolved' || c.status === 'closed').length || 0;

      setStats({
        total,
        active,
        highPriority,
        thisMonth,
        resolved
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch safeguarding data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodaysConcerns = () => {
    const today = new Date().toISOString().split('T')[0];
    return concerns.filter(concern => 
      concern.created_at.startsWith(today)
    );
  };

  const getActiveConcerns = () => {
    return concerns.filter(concern => 
      concern.status === 'open' || concern.status === 'in_progress'
    );
  };

  const getHighPriorityConcerns = () => {
    return concerns.filter(concern => 
      (concern.risk_level === 'high' || concern.risk_level === 'critical') && 
      (concern.status === 'open' || concern.status === 'in_progress')
    );
  };

  const getConcernsByType = () => {
    const typeCount: Record<string, number> = {};
    concerns.forEach(concern => {
      typeCount[concern.concern_type] = (typeCount[concern.concern_type] || 0) + 1;
    });
    return typeCount;
  };

  const getConcernsByRiskLevel = () => {
    const riskCount: Record<string, number> = {};
    concerns.forEach(concern => {
      riskCount[concern.risk_level] = (riskCount[concern.risk_level] || 0) + 1;
    });
    return riskCount;
  };

  useEffect(() => {
    fetchConcerns();

    // Set up real-time subscription
    const channel = supabase
      .channel('safeguarding-concerns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safeguarding_concerns'
        },
        () => {
          fetchConcerns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    concerns,
    stats,
    loading,
    getTodaysConcerns,
    getActiveConcerns,
    getHighPriorityConcerns,
    getConcernsByType,
    getConcernsByRiskLevel,
    refetch: fetchConcerns
  };
};