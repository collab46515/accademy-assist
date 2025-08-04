import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MedicalVisit {
  id: string;
  reference_number: string;
  student_id: string;
  visit_type: string;
  status: string;
  chief_complaint: string;
  created_at: string;
  // Add student name from joined query
  student_name?: string;
  student_class?: string;
}

interface MedicalStats {
  todaysVisits: number;
  activeCases: number;
  medicineGiven: number;
  appointments: number;
}

export function useInfirmaryData() {
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [stats, setStats] = useState<MedicalStats>({
    todaysVisits: 0,
    activeCases: 0,
    medicineGiven: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTodaysVisits = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('medical_visits')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching today\'s visits:', error);
      return [];
    }
  };

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's visits count
      const { count: todaysCount } = await supabase
        .from('medical_visits')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      // Get active cases (students with ongoing medical needs)
      const { count: activeCasesCount } = await supabase
        .from('student_medical_info')
        .select('*', { count: 'exact', head: true })
        .not('medical_conditions', 'is', null);

      // For now, use mock data for medicine and appointments
      // These would be real queries in production
      const medicineCount = 15; // Mock
      const appointmentsCount = 5; // Mock

      return {
        todaysVisits: todaysCount || 0,
        activeCases: activeCasesCount || 0,
        medicineGiven: medicineCount,
        appointments: appointmentsCount,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        todaysVisits: 0,
        activeCases: 0,
        medicineGiven: 0,
        appointments: 0,
      };
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [visitsData, statsData] = await Promise.all([
        fetchTodaysVisits(),
        fetchStats(),
      ]);
      
      setVisits(visitsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    visits,
    stats,
    loading,
    refreshData,
  };
}