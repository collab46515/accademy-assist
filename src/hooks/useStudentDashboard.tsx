import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from './useSchoolFilter';
import { useAuth } from './useAuth';

interface StudentStats {
  classesToday: number;
  pendingTasks: number;
  recentGrades: number;
  attendancePercentage: number;
}

interface Schedule {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface Assignment {
  subject: string;
  task: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface Grade {
  subject: string;
  assignment: string;
  grade: string;
  date: string;
}

export function useStudentDashboard() {
  const { currentSchoolId, hasSchoolContext } = useSchoolFilter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats>({
    classesToday: 0,
    pendingTasks: 0,
    recentGrades: 0,
    attendancePercentage: 0
  });
  const [studentData, setStudentData] = useState<any>(null);
  const [todaySchedule, setTodaySchedule] = useState<Schedule[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);

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

      // Fetch student data
      const { data: student } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(first_name, last_name, email)
        `)
        .eq('user_id', user.id)
        .eq('school_id', currentSchoolId)
        .maybeSingle();

      if (!student) {
        setLoading(false);
        return;
      }

      setStudentData(student);

      // Fetch attendance records
      const { data: attendanceRecords } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('student_id', student.id)
        .eq('school_id', currentSchoolId)
        .order('date', { ascending: false })
        .limit(30);

      const presentCount = attendanceRecords?.filter(r => r.status === 'present').length || 0;
      const totalRecords = attendanceRecords?.length || 1;
      const attendancePercentage = Math.round((presentCount / totalRecords) * 100);

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

      setTodaySchedule(todaySchedules.map(s => ({
        time: '09:00-09:45',
        subject: s.subject,
        teacher: 'Teacher',
        room: s.room || 'TBA'
      })));

      // Fetch assignments (placeholder - table structure unknown)
      setUpcomingAssignments([]);

      // Fetch recent grades (placeholder - table structure unknown)
      setRecentGrades([]);

      setStats({
        classesToday: todaySchedules.length,
        pendingTasks: 0,
        recentGrades: 0,
        attendancePercentage
      });

    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    stats,
    studentData,
    todaySchedule,
    upcomingAssignments,
    recentGrades,
    refreshData: fetchDashboardData
  };
}
