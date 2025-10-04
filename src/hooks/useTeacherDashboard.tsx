import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from './useSchoolFilter';
import { useAuth } from './useAuth';

interface TeacherStats {
  classesToday: number;
  totalStudents: number;
  assignmentsDue: number;
  unreadMessages: number;
}

interface ClassSchedule {
  time: string;
  subject: string;
  class: string;
  room: string;
  students: number;
}

interface PendingTask {
  task: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
}

export function useTeacherDashboard() {
  const { currentSchoolId, hasSchoolContext } = useSchoolFilter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats>({
    classesToday: 0,
    totalStudents: 0,
    assignmentsDue: 0,
    unreadMessages: 0
  });
  const [todayClasses, setTodayClasses] = useState<ClassSchedule[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [employeeData, setEmployeeData] = useState<any>(null);

  useEffect(() => {
    if (!hasSchoolContext || !user) {
      setLoading(false);
      return;
    }
    
    fetchDashboardData();
  }, [currentSchoolId, hasSchoolContext, user]);

  const fetchDashboardData = async () => {
    if (!currentSchoolId || !user) return;

    try {
      setLoading(true);

      // Fetch employee data
      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setEmployeeData(employee);

      // Fetch today's schedule
      const today = new Date().getDay();
      const { data: schedules } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('school_id', currentSchoolId)
        .eq('teacher_id', user.id)
        .eq('is_active', true);

      const todaySchedules = schedules?.filter(s => 
        s.days_of_week?.includes(today)
      ) || [];

      setTodayClasses(todaySchedules.map(s => ({
        time: '09:00-09:45', // Would need period data
        subject: s.subject,
        class: `${s.year_group} ${s.form_class || ''}`.trim(),
        room: s.room || 'TBA',
        students: s.student_ids?.length || 0
      })));

      // Count total students from schedules
      const uniqueStudents = new Set(
        todaySchedules.flatMap(s => s.student_ids || [])
      );

      // Fetch pending assignments (placeholder - structure may vary)
      const assignmentsCount = 0;

      // Build pending tasks
      const tasks: PendingTask[] = [];
      
      if (assignmentsCount > 0) {
        tasks.push({
          task: `Grade ${assignmentsCount} assignment${assignmentsCount > 1 ? 's' : ''}`,
          due: 'This week',
          priority: 'high',
          type: 'grading'
        });
      }

      setPendingTasks(tasks);

      setStats({
        classesToday: todaySchedules.length,
        totalStudents: uniqueStudents.size,
        assignmentsDue: assignmentsCount,
        unreadMessages: 0
      });

    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    stats,
    todayClasses,
    pendingTasks,
    employeeData,
    refreshData: fetchDashboardData
  };
}
