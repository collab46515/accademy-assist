import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AITimetableStats {
  totalPeriods: number;
  totalSubjects: number;
  totalTeachers: number;
  totalRooms: number;
  totalClasses: number;
  utilizationRate: number;
  constraintsSatisfied: number;
  totalConstraints: number;
}

export function useAITimetableData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AITimetableStats>({
    totalPeriods: 0,
    totalSubjects: 0,
    totalTeachers: 0,
    totalRooms: 0,
    totalClasses: 0,
    utilizationRate: 0,
    constraintsSatisfied: 0,
    totalConstraints: 0
  });

  useEffect(() => {
    fetchTimetableStats();
  }, []);

  const fetchTimetableStats = async () => {
    try {
      setLoading(true);

      // Fetch subjects count
      const { count: subjectsCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      // Fetch teachers count (staff with role teacher)
      const { count: teachersCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');

      // Fetch students to determine classes
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Fetch classrooms count
      const { count: roomsCount } = await supabase
        .from('classrooms')
        .select('*', { count: 'exact', head: true });

      // Calculate periods from timetable periods or use default
      const { count: periodsCount } = await supabase
        .from('timetable_periods')
        .select('*', { count: 'exact', head: true });
      
      const totalPeriods = periodsCount || 40; // Default to 40 periods per week

      // Estimate classes based on students (assuming 30 students per class)
      const estimatedClasses = Math.ceil((studentsCount || 0) / 30);

      // Calculate utilization rate based on available data
      const utilizationRate = estimatedClasses && subjectsCount && teachersCount ? 
        Math.min(((estimatedClasses * subjectsCount) / (totalPeriods * teachersCount)) * 100, 100) : 0;

      setStats({
        totalPeriods,
        totalSubjects: subjectsCount || 0,
        totalTeachers: teachersCount || 0,
        totalRooms: roomsCount || 0,
        totalClasses: estimatedClasses,
        utilizationRate: Math.round(utilizationRate),
        constraintsSatisfied: 8,
        totalConstraints: 10
      });
    } catch (error) {
      console.error('Error fetching timetable stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDataComplete = () => {
    return stats.totalSubjects > 0 && stats.totalTeachers > 0 && stats.totalClasses > 0;
  };

  const getCompletionPercentage = () => {
    const requirements = [
      stats.totalSubjects > 0,
      stats.totalTeachers > 0,
      stats.totalClasses > 0,
      stats.totalRooms > 0
    ];
    
    const completed = requirements.filter(Boolean).length;
    return Math.round((completed / requirements.length) * 100);
  };

  return {
    loading,
    stats,
    isDataComplete,
    getCompletionPercentage,
    refreshStats: fetchTimetableStats
  };
}