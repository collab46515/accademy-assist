import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CollectionSession {
  id: string;
  cashier_id: string;
  school_id: string;
  session_start: string;
  session_end?: string;
  opening_cash_amount: number;
  closing_cash_amount?: number;
  expected_cash_amount: number;
  variance_amount: number;
  status: 'active' | 'closed' | 'reconciled' | 'approved';
  notes?: string;
  supervisor_approved_by?: string;
  supervisor_approved_at?: string;
  supervisor_notes?: string;
  created_at: string;
  updated_at: string;
}

export function useCollectionSession() {
  const { user } = useAuth();
  const { currentSchool } = useRBAC();
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<CollectionSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && currentSchool) {
      fetchActiveSession();
    }
  }, [user, currentSchool]);

  const fetchActiveSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collection_sessions')
        .select('*')
        .eq('cashier_id', user!.id)
        .eq('school_id', currentSchool!.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setCurrentSession(data as CollectionSession);
    } catch (error) {
      console.error('Error fetching active session:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collection session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (openingCashAmount: number = 0) => {
    if (!user || !currentSchool) return;

    try {
      // Check if there's already an active session
      const { data: existingSession } = await supabase
        .from('collection_sessions')
        .select('id')
        .eq('cashier_id', user.id)
        .eq('school_id', currentSchool.id)
        .eq('status', 'active')
        .maybeSingle();

      if (existingSession) {
        toast({
          title: "Session Already Active",
          description: "You already have an active collection session",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('collection_sessions')
        .insert({
          cashier_id: user.id,
          school_id: currentSchool.id,
          opening_cash_amount: openingCashAmount,
          expected_cash_amount: openingCashAmount,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data as CollectionSession);
      toast({
        title: "Session Started",
        description: "Collection session started successfully",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start collection session",
        variant: "destructive",
      });
    }
  };

  const endSession = async (closingCashAmount: number, notes?: string) => {
    if (!currentSession) return;

    try {
      const variance = closingCashAmount - currentSession.expected_cash_amount;

      const { data, error } = await supabase
        .from('collection_sessions')
        .update({
          session_end: new Date().toISOString(),
          closing_cash_amount: closingCashAmount,
          variance_amount: variance,
          status: 'closed',
          notes,
        })
        .eq('id', currentSession.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data as CollectionSession);
      toast({
        title: "Session Ended",
        description: "Collection session closed successfully",
      });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end collection session",
        variant: "destructive",
      });
    }
  };

  const recordPaymentToSession = async (paymentAmount: number, paymentMethod: string) => {
    if (!currentSession) return;

    try {
      // Only add to expected cash if payment method is cash
      if (paymentMethod === 'cash') {
        const { error } = await supabase
          .from('collection_sessions')
          .update({
            expected_cash_amount: currentSession.expected_cash_amount + paymentAmount,
          })
          .eq('id', currentSession.id);

        if (error) throw error;

        // Update local state
        setCurrentSession(prev => prev ? {
          ...prev,
          expected_cash_amount: prev.expected_cash_amount + paymentAmount,
        } : null);
      }
    } catch (error) {
      console.error('Error updating session with payment:', error);
      toast({
        title: "Warning",
        description: "Payment recorded but session totals may be incorrect",
        variant: "destructive",
      });
    }
  };

  const approveSession = async (sessionId: string, supervisorNotes?: string) => {
    try {
      const { data, error } = await supabase
        .from('collection_sessions')
        .update({
          status: 'approved',
          supervisor_approved_by: user!.id,
          supervisor_approved_at: new Date().toISOString(),
          supervisor_notes: supervisorNotes,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session Approved",
        description: "Collection session approved successfully",
      });

      // Refresh if this is the current session
      if (currentSession?.id === sessionId) {
        setCurrentSession(data as CollectionSession);
      }
    } catch (error) {
      console.error('Error approving session:', error);
      toast({
        title: "Error",
        description: "Failed to approve collection session",
        variant: "destructive",
      });
    }
  };

  const fetchAllSessions = async (schoolId?: string) => {
    try {
      const targetSchoolId = schoolId || currentSchool?.id;
      if (!targetSchoolId) return [];

      const { data, error } = await supabase
        .from('collection_sessions')
        .select(`
          *,
          profiles!collection_sessions_cashier_id_fkey(first_name, last_name),
          supervisor_profiles:profiles!collection_sessions_supervisor_approved_by_fkey(first_name, last_name)
        `)
        .eq('school_id', targetSchoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collection sessions",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    currentSession,
    loading,
    startSession,
    endSession,
    recordPaymentToSession,
    approveSession,
    fetchAllSessions,
    refreshSession: fetchActiveSession,
  };
}