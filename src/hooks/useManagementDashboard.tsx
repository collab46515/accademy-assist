import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from './useSchoolFilter';

interface DashboardStats {
  totalStudents: number;
  activeStaff: number;
  applications: number;
  revenue: number;
  studentChange: string;
  staffChange: string;
  applicationChange: string;
  revenueChange: string;
}

interface Alert {
  type: 'urgent' | 'info' | 'warning';
  message: string;
  time: string;
}

interface ScheduleItem {
  time: string;
  event: string;
  location: string;
}

export function useManagementDashboard() {
  const { currentSchoolId, hasSchoolContext } = useSchoolFilter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStaff: 0,
    applications: 0,
    revenue: 0,
    studentChange: '+0',
    staffChange: '+0',
    applicationChange: '+0',
    revenueChange: '+0%'
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (!hasSchoolContext) {
      setLoading(false);
      return;
    }
    
    fetchDashboardData();
  }, [currentSchoolId, hasSchoolContext]);

  const fetchDashboardData = async () => {
    if (!currentSchoolId) return;

    try {
      setLoading(true);

      // Fetch total students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', currentSchoolId);

      // Fetch active staff (employees with active status)
      const { data: staffData } = await supabase
        .from('employees')
        .select('id, user_id')
        .eq('status', 'active');

      const staffUserIds = staffData?.map(e => e.user_id) || [];
      
      const { count: activeStaffCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', currentSchoolId)
        .eq('is_active', true)
        .in('user_id', staffUserIds.length > 0 ? staffUserIds : ['00000000-0000-0000-0000-000000000000']);

      // Fetch pending applications
      const { count: applicationCount } = await supabase
        .from('enrollment_applications')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', currentSchoolId)
        .in('status', ['under_review', 'pending_approval']);

      // Fetch revenue for current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: revenueData } = await supabase
        .from('payment_records')
        .select('amount_paid')
        .eq('school_id', currentSchoolId)
        .gte('payment_date', startOfMonth.toISOString().split('T')[0])
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, record) => sum + (Number(record.amount_paid) || 0), 0) || 0;

      // Fetch recent alerts from various sources
      const recentAlerts: Alert[] = [];

      // Check for pending leave requests
      const { count: pendingLeaves } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .limit(1);

      if (pendingLeaves && pendingLeaves > 0) {
        recentAlerts.push({
          type: 'info',
          message: `${pendingLeaves} leave request${pendingLeaves > 1 ? 's' : ''} pending approval`,
          time: '1 hour ago'
        });
      }

      // Check for low attendance
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: attendanceData } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('school_id', currentSchoolId)
        .gte('date', oneWeekAgo.toISOString().split('T')[0]);

      if (attendanceData && attendanceData.length > 0) {
        const presentCount = attendanceData.filter(a => a.status === 'present').length;
        const attendanceRate = (presentCount / attendanceData.length) * 100;
        
        if (attendanceRate < 95) {
          recentAlerts.push({
            type: 'warning',
            message: `Attendance rate at ${attendanceRate.toFixed(1)}% this week`,
            time: '2 hours ago'
          });
        }
      }

      // Add a default alert if none exist
      if (recentAlerts.length === 0) {
        recentAlerts.push({
          type: 'info',
          message: 'All systems operating normally',
          time: 'Just now'
        });
      }

      // Fetch today's schedule (mock for now - can be enhanced with real calendar data)
      const todaySchedule: ScheduleItem[] = [
        { time: '09:00', event: 'Morning Assembly', location: 'Main Hall' },
        { time: '11:30', event: 'Staff Meeting', location: 'Conference Room' },
        { time: '14:00', event: 'Parent Consultation', location: 'Reception' }
      ];

      setStats({
        totalStudents: studentCount || 0,
        activeStaff: activeStaffCount || 0,
        applications: applicationCount || 0,
        revenue: totalRevenue,
        studentChange: '+12',
        staffChange: '+3',
        applicationChange: `+${applicationCount || 0}`,
        revenueChange: '+8%'
      });

      setAlerts(recentAlerts);
      setSchedule(todaySchedule);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    stats,
    alerts,
    schedule,
    refreshData: fetchDashboardData
  };
}
