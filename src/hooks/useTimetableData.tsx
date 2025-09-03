import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';
import { toast } from '@/hooks/use-toast';

export interface TimetablePeriod {
  id: string;
  school_id: string;
  period_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
  is_active: boolean;
}

export interface Subject {
  id: string;
  school_id: string;
  subject_name: string;
  subject_code: string;
  color_code: string;
  requires_lab: boolean;
  periods_per_week: number;
  is_active: boolean;
}

export interface Classroom {
  id: string;
  school_id: string;
  room_name: string;
  room_type: string;
  capacity: number;
  is_active: boolean;
}

export interface TimetableEntry {
  id: string;
  school_id: string;
  class_id: string;
  period_id: string;
  subject_id: string;
  teacher_id: string;
  classroom_id: string;
  day_of_week: number;
  academic_year: string;
  term: string;
  is_active: boolean;
  notes?: string;
  
  // Joined data
  period?: TimetablePeriod;
  subject?: Subject;
  classroom?: Classroom;
  teacher_name?: string;
  attendance_status?: 'present' | 'absent' | 'late' | 'left_early' | null;
}

// No mock data - using real database data only

export function useTimetableData() {
  const { user } = useAuth();
  const { currentSchool } = useRBAC();
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);

  // Fetch school periods
  const fetchPeriods = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetable_periods')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('period_number');
      
      if (error) throw error;
      
      // Transform to match our interface
      const transformedPeriods: TimetablePeriod[] = (data || []).map(period => ({
        id: period.id,
        school_id: period.school_id,
        period_number: period.period_number,
        period_name: period.period_name,
        start_time: period.start_time,
        end_time: period.end_time,
        is_break: period.period_name.toLowerCase().includes('break') || period.period_name.toLowerCase().includes('lunch'),
        is_active: period.is_active
      }));
      
      setPeriods(transformedPeriods);
    } catch (error: any) {
      console.error('Error fetching periods:', error);
      setPeriods([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('subject_name');
      
      if (error) throw error;
      setSubjects(data || []);
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classrooms
  const fetchClassrooms = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('room_name');
      
      if (error) throw error;
      setClassrooms(data || []);
    } catch (error: any) {
      console.error('Error fetching classrooms:', error);
      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch timetable entries for a specific class
  const fetchTimetableForClass = useCallback(async (classId: string, academicYear: string = '2024-2025', term: string = 'Term 1') => {
    if (!currentSchool) return;

    setLoading(true);
    try {
      console.log('Fetching timetable for:', { classId, academicYear, term, schoolId: currentSchool.id });
      
      const { data, error } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('class_id', classId)
        .eq('is_active', true)
        .order('day_of_week')
        .order('period_id');

      if (error) throw error;
      
      console.log('Timetable entries found:', data?.length || 0, data);

      // Process database entries only
      const enrichedEntries: TimetableEntry[] = (data || []).map(entry => {
        // Try to find matching period, subject, classroom from database
        let period = periods.find(p => p.id === entry.period_id);
        let subject = subjects.find(s => s.id === entry.subject_id);
        let classroom = classrooms.find(c => c.id === entry.classroom_id);
        
        // Parse teacher and room info from notes field if available
        const notesParts = entry.notes?.split(' - ') || [];
        const subjectName = notesParts[0] || subject?.subject_name || 'Subject';
        const teacherName = notesParts[1] || 'Teacher';
        const roomName = notesParts[2] || classroom?.room_name || 'Room';
        
        // If we couldn't find the period in our data, create a basic period from database info
        if (!period) {
          console.log('Creating fallback period for:', entry.period_id);
          period = {
            id: entry.period_id,
            school_id: entry.school_id,
            period_number: entry.day_of_week,
            period_name: `Period ${entry.day_of_week}`,
            start_time: '09:00:00',
            end_time: '10:00:00',
            is_break: false,
            is_active: true
          };
        }
        
        return {
          ...entry,
          period,
          subject: subject || { 
            id: entry.subject_id,
            school_id: entry.school_id,
            subject_name: subjectName,
            subject_code: subjectName.toUpperCase().replace(/\s+/g, '-'),
            color_code: '#3B82F6',
            requires_lab: false,
            periods_per_week: 3,
            is_active: true
          },
          classroom: classroom || { 
            id: entry.classroom_id,
            school_id: entry.school_id,
            room_name: roomName,
            room_type: 'classroom',
            capacity: 30,
            is_active: true
          },
          teacher_name: teacherName,
          attendance_status: null
        };
      });

      console.log('Final enriched entries:', enrichedEntries.length, enrichedEntries);
      setTimetableEntries(enrichedEntries);
    } catch (error: any) {
      console.error('Error fetching timetable:', error);
      setTimetableEntries([]);
      
      toast({
        title: "Error Loading Timetable",
        description: "Failed to load timetable data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentSchool, periods, subjects, classrooms]);

  // Get timetable organized by day and period
  const getTimetableGrid = (classId: string) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const grid: Record<string, Record<string, TimetableEntry | null>> = {};

    // Initialize grid with database periods only
    days.forEach((day, dayIndex) => {
      grid[day] = {};
      periods.forEach(period => {
        if (!period.is_break) {
          grid[day][period.id] = null;
        }
      });
    });

    // Fill grid with timetable entries
    timetableEntries.forEach(entry => {
      const dayName = days[entry.day_of_week - 1]; // Convert 1-based to 0-based
      if (dayName && grid[dayName] && entry.period) {
        // Use the actual period_id from the entry
        grid[dayName][entry.period_id] = entry;
      }
    });

    return grid;
  };

  // Get current period based on time
  const getCurrentPeriod = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    return periods.find(period => {
      return currentTime >= period.start_time && currentTime <= period.end_time;
    });
  };

  // Get next period
  const getNextPeriod = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    return periods
      .filter(period => period.start_time > currentTime)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];
  };

  // Check if attendance has been marked for a specific period
  const hasAttendanceBeenMarked = (entry: TimetableEntry) => {
    return entry.attendance_status !== null;
  };

  useEffect(() => {
    if (currentSchool) {
      fetchPeriods();
      fetchSubjects();
      fetchClassrooms();
    }
  }, [currentSchool]);

  // British curriculum data
  const yearGroups = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ];

  const formClasses = [
    'R1', 'R2',
    '1A', '1B', '1C',
    '2A', '2B', '2C',
    '3A', '3B', '3C',
    '4A', '4B', '4C',
    '5A', '5B', '5C',
    '6A', '6B', '6C',
    '7A', '7B', '7C', '7D',
    '8A', '8B', '8C', '8D', 
    '9A', '9B', '9C', '9D',
    '10A', '10B', '10C', '10D',
    '11A', '11B', '11C', '11D',
    '12A', '12B', '12C',
    '13A', '13B', '13C'
  ];

  const roomTypes = [
    'classroom',
    'laboratory', 
    'computer_lab',
    'art_room',
    'music_room',
    'drama_studio',
    'gymnasium',
    'workshop',
    'library',
    'assembly_hall'
  ];

  return {
    // State
    loading,
    periods,
    subjects,
    classrooms,
    timetableEntries,
    
    // British curriculum data
    yearGroups,
    formClasses,
    roomTypes,
    
    // Actions
    fetchPeriods,
    fetchSubjects,
    fetchClassrooms,
    fetchTimetableForClass,
    
    // Utilities
    getTimetableGrid,
    getCurrentPeriod,
    getNextPeriod,
    hasAttendanceBeenMarked,
  };
}