import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from './useRBAC';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  school_id: string;
  date: string;
  period?: number;
  teacher_id: string;
  status: 'present' | 'absent' | 'late' | 'left_early';
  reason?: string;
  notes?: string;
  subject?: string;
  is_excused?: boolean;
  excused_by?: string;
  excused_at?: string;
  excuse_document_url?: string;
  marked_at: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSettings {
  id: string;
  school_id: string;
  attendance_mode: 'daily' | 'period';
  late_threshold_minutes: number;
  auto_mark_weekends: boolean;
  alert_after_days: number;
  require_excuse_approval: boolean;
  enable_qr_checkin: boolean;
  enable_biometric_checkin: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SchoolPeriod {
  id: string;
  school_id: string;
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  days_of_week: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  period?: SchoolPeriod;
}

interface AttendanceFilters {
  student_id?: string;
  year_group?: string;
  form_class?: string;
  status?: string;
  period?: number;
}

export function useAttendanceData() {
  const { currentSchool } = useRBAC();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings | null>(null);
  const [schoolPeriods, setSchoolPeriods] = useState<SchoolPeriod[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);

  const fetchAttendanceRecords = useCallback(async (
    startDate: string,
    endDate: string,
    filters?: AttendanceFilters
  ) => {
    if (!currentSchool?.id) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('attendance_records')
        .select('*')
        .eq('school_id', currentSchool.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .order('marked_at', { ascending: false });

      if (filters?.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.period) {
        query = query.eq('period', filters.period);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setAttendanceRecords((data || []) as AttendanceRecord[]);
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      toast({
        title: 'Error fetching attendance',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentSchool?.id, toast]);

  const markAttendance = useCallback(async (attendance: {
    student_id: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'left_early';
    period?: number;
    subject?: string;
    reason?: string;
    notes?: string;
  }) => {
    if (!currentSchool?.id || !user?.id) return false;

    try {
      // Check if a record already exists for this student and date
      const { data: existing, error: fetchError } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('school_id', currentSchool.id)
        .eq('student_id', attendance.student_id)
        .eq('date', attendance.date)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing?.id) {
        // Only allow updating if you originally marked the record (RLS requires this)
        const { data: updated, error: updateError } = await supabase
          .from('attendance_records')
          .update({
            period: attendance.period,
            status: attendance.status,
            subject: attendance.subject,
            reason: attendance.reason,
            notes: attendance.notes,
            teacher_id: user.id,
            marked_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .eq('teacher_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('attendance_records')
          .insert({
            student_id: attendance.student_id,
            school_id: currentSchool.id,
            teacher_id: user.id,
            date: attendance.date,
            period: attendance.period,
            status: attendance.status,
            subject: attendance.subject,
            reason: attendance.reason,
            notes: attendance.notes,
            marked_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      toast({
        title: 'Error marking attendance',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [currentSchool?.id, user?.id, toast]);

  const markBulkAttendance = useCallback(async (attendanceList: Array<{
    student_id: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'left_early';
    session?: string;
    period?: number;
    subject?: string;
    reason?: string;
    notes?: string;
  }>) => {
    if (!currentSchool?.id || !user?.id) return false;

    try {
      const date = attendanceList[0]?.date;
      const session = attendanceList[0]?.session;
      const studentIds = attendanceList.map(a => a.student_id);

      // Map existing records by student_id for this date (+ session when provided)
      const existingMap = new Map<string, string>();
      if (date && studentIds.length) {
        let query = supabase
          .from('attendance_records')
          .select('id, student_id')
          .eq('school_id', currentSchool.id)
          .eq('date', date)
          .in('student_id', studentIds);

        if (session) {
          query = query.eq('session', session as any);
        }

        const { data: existing, error: fetchErr } = await query;
        if (fetchErr) throw fetchErr;
        (existing || []).forEach((r: any) => existingMap.set(r.student_id, r.id));
      }

      const records = attendanceList.map(att => {
        const existingId = existingMap.get(att.student_id);
        const record: any = {
          student_id: att.student_id,
          school_id: currentSchool.id,
          teacher_id: user.id,
          date: att.date,
          session: att.session,
          period: att.period,
          status: att.status,
          subject: att.subject,
          reason: att.reason,
          notes: att.notes,
          marked_at: new Date().toISOString(),
        };
        // Only include id if we're updating an existing record
        if (existingId) {
          record.id = existingId;
        }
        return record;
      });

      const { error } = await supabase
        .from('attendance_records')
        .upsert(records);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Attendance marked for ${attendanceList.length} students`,
      });

      return true;
    } catch (error: any) {
      console.error('Error marking bulk attendance:', error);
      toast({
        title: 'Error marking attendance',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [currentSchool?.id, user?.id, toast]);

  const fetchAttendanceSettings = useCallback(async () => {
    if (!currentSchool?.id) return;

    try {
      const { data, error } = await supabase
        .from('attendance_settings')
        .select('*')
        .eq('school_id', currentSchool.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setAttendanceSettings(data as any);
    } catch (error: any) {
      console.error('Error fetching attendance settings:', error);
    }
  }, [currentSchool?.id]);

  const fetchSchoolPeriods = useCallback(async () => {
    if (!currentSchool?.id) return;

    try {
      const { data, error } = await supabase
        .from('school_periods')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('start_time');

      if (error) throw error;
      
      setSchoolPeriods((data || []) as any);
    } catch (error: any) {
      console.error('Error fetching school periods:', error);
    }
  }, [currentSchool?.id]);

  const fetchMyClassSchedules = useCallback(async () => {
    if (!currentSchool?.id || !user?.id) return;

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
      
      setClassSchedules((data || []) as any);
    } catch (error: any) {
      console.error('Error fetching class schedules:', error);
    }
  }, [currentSchool?.id, user?.id]);

  const getCurrentClass = useCallback(() => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    return classSchedules.find(schedule => {
      if (!schedule.period) return false;
      
      const isToday = schedule.days_of_week.includes(currentDay);
      if (!isToday) return false;

      const startTime = schedule.period.start_time;
      const endTime = schedule.period.end_time;
      
      return currentTime >= startTime && currentTime <= endTime;
    });
  }, [classSchedules]);

  const getAttendanceStats = useCallback((records: AttendanceRecord[]) => {
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
  }, []);

  useEffect(() => {
    if (currentSchool?.id) {
      fetchAttendanceSettings();
      fetchSchoolPeriods();
      fetchMyClassSchedules();
    }
  }, [currentSchool?.id, fetchAttendanceSettings, fetchSchoolPeriods, fetchMyClassSchedules]);

  return {
    loading,
    attendanceRecords,
    attendanceSettings,
    schoolPeriods,
    classSchedules,
    fetchAttendanceRecords,
    markAttendance,
    markBulkAttendance,
    fetchAttendanceSettings,
    fetchSchoolPeriods,
    fetchMyClassSchedules,
    getCurrentClass,
    getAttendanceStats,
  };
}