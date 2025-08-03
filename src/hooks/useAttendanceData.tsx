import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';
import { toast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  school_id: string;
  date: string;
  period?: number;
  subject?: string;
  teacher_id: string;
  status: 'present' | 'absent' | 'late' | 'left_early';
  reason?: string;
  notes?: string;
  is_excused: boolean;
  excused_by?: string;
  excused_at?: string;
  marked_at: string;
  
  // Joined data
  student_name?: string;
  student_number?: string;
  form_class?: string;
  year_group?: string;
  teacher_name?: string;
}

export interface AttendanceSettings {
  id: string;
  school_id: string;
  late_threshold_minutes: number;
  attendance_mode: 'daily' | 'period';
  auto_mark_weekends: boolean;
  alert_after_days: number;
  require_excuse_approval: boolean;
  enable_qr_checkin: boolean;
  enable_biometric_checkin: boolean;
  settings: any;
}

export interface SchoolPeriod {
  id: string;
  school_id: string;
  period_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  is_active: boolean;
}

export interface ClassSchedule {
  id: string;
  school_id: string;
  period_id: string;
  teacher_id: string;
  subject: string;
  room?: string;
  year_group: string;
  form_class?: string;
  student_ids: string[];
  days_of_week: number[];
  is_active: boolean;
  
  // Joined data
  period?: SchoolPeriod;
}

export function useAttendanceData() {
  const { user } = useAuth();
  const { currentSchool } = useRBAC();
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings | null>(null);
  const [schoolPeriods, setSchoolPeriods] = useState<SchoolPeriod[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);

  // Fetch attendance records for a specific date range
  const fetchAttendanceRecords = async (startDate: string, endDate: string, filters?: {
    student_id?: string;
    year_group?: string;
    form_class?: string;
    status?: string;
    period?: number;
  }) => {
    if (!currentSchool) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          students!inner(
            user_id,
            student_number,
            year_group,
            form_class,
            profiles!inner(first_name, last_name)
          ),
          teacher:profiles!attendance_records_teacher_id_fkey(first_name, last_name)
        `)
        .eq('school_id', currentSchool.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .order('marked_at', { ascending: false });

      // Apply filters
      if (filters?.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.period !== undefined) {
        query = query.eq('period', filters.period);
      }
      if (filters?.year_group) {
        query = query.eq('students.year_group', filters.year_group);
      }
      if (filters?.form_class) {
        query = query.eq('students.form_class', filters.form_class);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedRecords: AttendanceRecord[] = (data || []).map((record: any) => ({
        ...record,
        student_name: `${record.students.profiles.first_name} ${record.students.profiles.last_name}`,
        student_number: record.students.student_number,
        form_class: record.students.form_class,
        year_group: record.students.year_group,
        teacher_name: `${record.teacher.first_name} ${record.teacher.last_name}`,
      }));

      setAttendanceRecords(formattedRecords);
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance for a student
  const markAttendance = async (attendance: {
    student_id: string;
    date: string;
    period?: number;
    subject?: string;
    status: 'present' | 'absent' | 'late' | 'left_early';
    reason?: string;
    notes?: string;
  }) => {
    if (!currentSchool || !user) return null;

    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .upsert({
          ...attendance,
          school_id: currentSchool.id,
          teacher_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mark attendance for multiple students at once
  const markBulkAttendance = async (attendanceList: Array<{
    student_id: string;
    date: string;
    period?: number;
    subject?: string;
    status: 'present' | 'absent' | 'late' | 'left_early';
    reason?: string;
    notes?: string;
  }>) => {
    if (!currentSchool || !user) return false;

    try {
      const recordsToInsert = attendanceList.map(attendance => ({
        ...attendance,
        school_id: currentSchool.id,
        teacher_id: user.id,
      }));

      const { error } = await supabase
        .from('attendance_records')
        .upsert(recordsToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Attendance marked for ${attendanceList.length} students`,
      });

      return true;
    } catch (error: any) {
      console.error('Error marking bulk attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark bulk attendance",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fetch attendance settings
  const fetchAttendanceSettings = async () => {
    if (!currentSchool) return;

    try {
      const { data, error } = await supabase
        .from('attendance_settings')
        .select('*')
        .eq('school_id', currentSchool.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setAttendanceSettings(data as AttendanceSettings);
    } catch (error: any) {
      console.error('Error fetching attendance settings:', error);
    }
  };

  // Fetch school periods
  const fetchSchoolPeriods = async () => {
    if (!currentSchool) return;

    try {
      const { data, error } = await supabase
        .from('school_periods')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('period_number');

      if (error) throw error;

      setSchoolPeriods(data || []);
    } catch (error: any) {
      console.error('Error fetching school periods:', error);
    }
  };

  // Fetch class schedules for current teacher
  const fetchMyClassSchedules = async () => {
    if (!currentSchool || !user) return;

    try {
      const { data, error } = await supabase
        .from('class_schedules')
        .select(`
          *,
          period:school_periods(*)
        `)
        .eq('school_id', currentSchool.id)
        .eq('teacher_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      setClassSchedules((data as any[]) || []);
    } catch (error: any) {
      console.error('Error fetching class schedules:', error);
    }
  };

  // Get current class based on day and time
  const getCurrentClass = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    return classSchedules.find(schedule => {
      if (!schedule.period) return false;
      
      const isToday = schedule.days_of_week.includes(currentDay);
      const startTime = schedule.period.start_time;
      const endTime = schedule.period.end_time;
      
      return isToday && currentTime >= startTime && currentTime <= endTime;
    });
  };

  // Calculate attendance statistics
  const getAttendanceStats = (records: AttendanceRecord[]) => {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const leftEarly = records.filter(r => r.status === 'left_early').length;
    
    return {
      total,
      present,
      absent,
      late,
      leftEarly,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  };

  useEffect(() => {
    if (currentSchool) {
      fetchAttendanceSettings();
      fetchSchoolPeriods();
      fetchMyClassSchedules();
    }
  }, [currentSchool]);

  return {
    // State
    loading,
    attendanceRecords,
    attendanceSettings,
    schoolPeriods,
    classSchedules,
    
    // Actions
    fetchAttendanceRecords,
    markAttendance,
    markBulkAttendance,
    fetchAttendanceSettings,
    fetchSchoolPeriods,
    fetchMyClassSchedules,
    
    // Utilities
    getCurrentClass,
    getAttendanceStats,
  };
}