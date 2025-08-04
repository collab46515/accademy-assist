import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Complaint {
  id: string;
  complaint_number: string;
  title: string;
  description: string;
  complaint_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  complainant_name: string;
  complainant_email?: string;
  complainant_phone?: string;
  complainant_relationship: string;
  student_involved?: string;
  incident_date?: string;
  location?: string;
  desired_outcome?: string;
  anonymous: boolean;
  school_id: string;
  submitted_by?: string;
  assigned_to?: string;
  target_resolution_date?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplaintStats {
  total: number;
  open: number;
  resolved: number;
  avgResolutionDays: number;
}

export const useComplaintsData = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<ComplaintStats>({
    total: 0,
    open: 0,
    resolved: 0,
    avgResolutionDays: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComplaints(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const open = data?.filter(c => c.status === 'open' || c.status === 'in_progress').length || 0;
      const resolved = data?.filter(c => c.status === 'resolved' || c.status === 'closed').length || 0;
      
      // Calculate average resolution time
      const resolvedComplaints = data?.filter(c => c.resolved_at) || [];
      let avgResolutionDays = 0;
      
      if (resolvedComplaints.length > 0) {
        const totalDays = resolvedComplaints.reduce((sum, complaint) => {
          const createdDate = new Date(complaint.created_at);
          const resolvedDate = new Date(complaint.resolved_at!);
          const diffTime = Math.abs(resolvedDate.getTime() - createdDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0);
        
        avgResolutionDays = Math.round((totalDays / resolvedComplaints.length) * 10) / 10;
      }

      setStats({
        total,
        open,
        resolved,
        avgResolutionDays
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch complaints data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodaysComplaints = () => {
    const today = new Date().toISOString().split('T')[0];
    return complaints.filter(complaint => 
      complaint.created_at.startsWith(today)
    );
  };

  const getOpenComplaints = () => {
    return complaints.filter(complaint => 
      complaint.status === 'open' || complaint.status === 'in_progress'
    );
  };

  const getHighPriorityComplaints = () => {
    return complaints.filter(complaint => 
      (complaint.priority === 'high' || complaint.priority === 'urgent') && 
      (complaint.status === 'open' || complaint.status === 'in_progress')
    );
  };

  const getComplaintsByType = () => {
    const typeCount: Record<string, number> = {};
    complaints.forEach(complaint => {
      typeCount[complaint.complaint_type] = (typeCount[complaint.complaint_type] || 0) + 1;
    });
    return typeCount;
  };

  useEffect(() => {
    fetchComplaints();

    // Set up real-time subscription
    const channel = supabase
      .channel('complaints-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints'
        },
        () => {
          fetchComplaints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    complaints,
    stats,
    loading,
    getTodaysComplaints,
    getOpenComplaints,
    getHighPriorityComplaints,
    getComplaintsByType,
    refetch: fetchComplaints
  };
};