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

// Mock data for development
const mockPeriods: TimetablePeriod[] = [
  { id: '1', school_id: '1', period_number: 1, period_name: 'Period 1', start_time: '08:00', end_time: '08:45', is_break: false, is_active: true },
  { id: '2', school_id: '1', period_number: 2, period_name: 'Period 2', start_time: '08:45', end_time: '09:30', is_break: false, is_active: true },
  { id: '3', school_id: '1', period_number: 3, period_name: 'Break', start_time: '09:30', end_time: '09:45', is_break: true, is_active: true },
  { id: '4', school_id: '1', period_number: 4, period_name: 'Period 3', start_time: '09:45', end_time: '10:30', is_break: false, is_active: true },
  { id: '5', school_id: '1', period_number: 5, period_name: 'Period 4', start_time: '10:30', end_time: '11:15', is_break: false, is_active: true },
  { id: '6', school_id: '1', period_number: 6, period_name: 'Lunch', start_time: '11:15', end_time: '12:00', is_break: true, is_active: true },
  { id: '7', school_id: '1', period_number: 7, period_name: 'Period 5', start_time: '12:00', end_time: '12:45', is_break: false, is_active: true },
  { id: '8', school_id: '1', period_number: 8, period_name: 'Period 6', start_time: '12:45', end_time: '13:30', is_break: false, is_active: true },
];

const mockSubjects: Subject[] = [
  { id: '1', school_id: '1', subject_name: 'Mathematics', subject_code: 'MATHS', color_code: '#3B82F6', requires_lab: false, periods_per_week: 5, is_active: true },
  { id: '2', school_id: '1', subject_name: 'English Language', subject_code: 'ENG-LANG', color_code: '#10B981', requires_lab: false, periods_per_week: 4, is_active: true },
  { id: '3', school_id: '1', subject_name: 'Physics', subject_code: 'PHYS', color_code: '#EF4444', requires_lab: true, periods_per_week: 3, is_active: true },
  { id: '4', school_id: '1', subject_name: 'Chemistry', subject_code: 'CHEM', color_code: '#F59E0B', requires_lab: true, periods_per_week: 3, is_active: true },
  { id: '5', school_id: '1', subject_name: 'Biology', subject_code: 'BIO', color_code: '#22C55E', requires_lab: true, periods_per_week: 3, is_active: true },
  { id: '6', school_id: '1', subject_name: 'History', subject_code: 'HIST', color_code: '#F97316', requires_lab: false, periods_per_week: 3, is_active: true },
  { id: '7', school_id: '1', subject_name: 'Geography', subject_code: 'GEOG', color_code: '#06B6D4', requires_lab: false, periods_per_week: 3, is_active: true },
  { id: '8', school_id: '1', subject_name: 'French', subject_code: 'FR', color_code: '#EF4444', requires_lab: false, periods_per_week: 3, is_active: true },
  { id: '9', school_id: '1', subject_name: 'Physical Education', subject_code: 'PE', color_code: '#22C55E', requires_lab: false, periods_per_week: 2, is_active: true },
  { id: '10', school_id: '1', subject_name: 'Art & Design', subject_code: 'ART', color_code: '#EC4899', requires_lab: false, periods_per_week: 2, is_active: true },
];

const mockClassrooms: Classroom[] = [
  { id: '1', school_id: '1', room_name: 'Room 101', room_type: 'classroom', capacity: 30, is_active: true },
  { id: '2', school_id: '1', room_name: 'Room 102', room_type: 'classroom', capacity: 30, is_active: true },
  { id: '3', school_id: '1', room_name: 'Physics Lab', room_type: 'laboratory', capacity: 24, is_active: true },
  { id: '4', school_id: '1', room_name: 'Chemistry Lab', room_type: 'laboratory', capacity: 24, is_active: true },
  { id: '5', school_id: '1', room_name: 'Biology Lab', room_type: 'laboratory', capacity: 24, is_active: true },
  { id: '6', school_id: '1', room_name: 'Computer Suite 1', room_type: 'computer_lab', capacity: 20, is_active: true },
  { id: '7', school_id: '1', room_name: 'Main Gym', room_type: 'gym', capacity: 60, is_active: true },
  { id: '8', school_id: '1', room_name: 'Art Studio', room_type: 'art_room', capacity: 20, is_active: true },
];

const mockTimetableEntries: TimetableEntry[] = [
  // Monday - Year 10A British Curriculum
  { id: '1', school_id: '1', class_id: 'Year-10A', period_id: '1', subject_id: '1', teacher_id: 'teacher1', classroom_id: '1', day_of_week: 1, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '2', school_id: '1', class_id: 'Year-10A', period_id: '2', subject_id: '2', teacher_id: 'teacher2', classroom_id: '1', day_of_week: 1, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '3', school_id: '1', class_id: 'Year-10A', period_id: '4', subject_id: '3', teacher_id: 'teacher3', classroom_id: '3', day_of_week: 1, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '4', school_id: '1', class_id: 'Year-10A', period_id: '5', subject_id: '6', teacher_id: 'teacher4', classroom_id: '1', day_of_week: 1, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '5', school_id: '1', class_id: 'Year-10A', period_id: '7', subject_id: '8', teacher_id: 'teacher5', classroom_id: '2', day_of_week: 1, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '6', school_id: '1', class_id: 'Year-10A', period_id: '8', subject_id: '9', teacher_id: 'teacher6', classroom_id: '7', day_of_week: 1, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  
  // Tuesday  
  { id: '7', school_id: '1', class_id: 'Year-10A', period_id: '1', subject_id: '4', teacher_id: 'teacher7', classroom_id: '4', day_of_week: 2, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '8', school_id: '1', class_id: 'Year-10A', period_id: '2', subject_id: '1', teacher_id: 'teacher1', classroom_id: '1', day_of_week: 2, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '9', school_id: '1', class_id: 'Year-10A', period_id: '4', subject_id: '7', teacher_id: 'teacher8', classroom_id: '1', day_of_week: 2, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '10', school_id: '1', class_id: 'Year-10A', period_id: '5', subject_id: '5', teacher_id: 'teacher9', classroom_id: '5', day_of_week: 2, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '11', school_id: '1', class_id: 'Year-10A', period_id: '7', subject_id: '2', teacher_id: 'teacher2', classroom_id: '1', day_of_week: 2, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '12', school_id: '1', class_id: 'Year-10A', period_id: '8', subject_id: '10', teacher_id: 'teacher10', classroom_id: '8', day_of_week: 2, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  
  // Wednesday
  { id: '13', school_id: '1', class_id: 'Year-10A', period_id: '1', subject_id: '3', teacher_id: 'teacher3', classroom_id: '3', day_of_week: 3, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '14', school_id: '1', class_id: 'Year-10A', period_id: '2', subject_id: '8', teacher_id: 'teacher5', classroom_id: '2', day_of_week: 3, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '15', school_id: '1', class_id: 'Year-10A', period_id: '4', subject_id: '1', teacher_id: 'teacher1', classroom_id: '1', day_of_week: 3, academic_year: '2024-2025', term: 'Term 1', is_active: true },
  { id: '16', school_id: '1', class_id: 'Year-10A', period_id: '5', subject_id: '4', teacher_id: 'teacher7', classroom_id: '4', day_of_week: 3, academic_year: '2024-2025', term: 'Term 1', is_active: true },
];

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
      // Fallback to mock data
      setPeriods(mockPeriods);
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
      // Fallback to mock data
      setSubjects(mockSubjects);
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
      // Fallback to mock data
      setClassrooms(mockClassrooms);
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

      // Enrich with related data manually
      const enrichedEntries: TimetableEntry[] = (data || []).map(entry => {
        const period = periods.find(p => p.id === entry.period_id);
        const subject = subjects.find(s => s.id === entry.subject_id);
        const classroom = classrooms.find(c => c.id === entry.classroom_id);
        
        // Parse teacher and room info from notes field if available
        const notesParts = entry.notes?.split(' - ') || [];
        const subjectName = notesParts[0] || 'Subject';
        const teacherName = notesParts[1] || 'Teacher';
        const roomName = notesParts[2] || 'Room';
        
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

      setTimetableEntries(enrichedEntries);
    } catch (error: any) {
      console.error('Error fetching timetable:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timetable entries",
        variant: "destructive",
      });
      setTimetableEntries([]);
    } finally {
      setLoading(false);
    }
  }, [currentSchool, periods, subjects, classrooms]);

  // Get timetable organized by day and period
  const getTimetableGrid = (classId: string) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const grid: Record<string, Record<string, TimetableEntry | null>> = {};

    // Initialize grid
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