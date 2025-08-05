import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';
import { toast } from '@/hooks/use-toast';

// Core data interfaces for AI Timetable Generation
export interface AcademicCalendar {
  id: string;
  school_id: string;
  academic_year: string;
  term_name: string;
  start_date: string;
  end_date: string;
  total_weeks: number;
  school_days: string[];
  holiday_dates: string[];
  special_event_dates: string[];
  is_active: boolean;
}

export interface TeacherProfile {
  id: string;
  school_id: string;
  teacher_id: string;
  max_periods_per_day: number;
  max_periods_per_week: number;
  preferred_subjects: string[];
  cannot_teach_subjects: string[];
  unavailable_periods: string[];
  preferred_rooms: string[];
  employment_type: 'full_time' | 'part_time';
  working_days: string[];
  special_requirements: any;
  experience_level: 'junior' | 'senior' | 'hod';
}

export interface SubjectRequirement {
  id: string;
  school_id: string;
  subject_id: string;
  year_group: string;
  periods_per_week: number;
  period_duration: number;
  requires_lab: boolean;
  requires_computer: boolean;
  requires_projector: boolean;
  max_class_size: number;
  preferred_time_slots: string[];
  cannot_schedule_periods: string[];
  consecutive_periods: boolean;
  special_requirements: any;
}

export interface ClassComposition {
  id: string;
  school_id: string;
  class_id: string;
  year_group: string;
  total_students: number;
  special_needs_count: number;
  subjects_taken: string[];
  core_subjects: string[];
  optional_subjects: string[];
  form_teacher_id: string;
  classroom_id: string;
  special_requirements: any;
}

export interface RoomFeature {
  id: string;
  school_id: string;
  room_id: string;
  has_projector: boolean;
  has_whiteboard: boolean;
  has_computer: boolean;
  has_lab_equipment: boolean;
  accessibility_features: string[];
  room_layout: string;
  special_equipment: string[];
  capacity_override: number;
  booking_restrictions: any;
}

export interface SpecialEvent {
  id: string;
  school_id: string;
  event_name: string;
  event_type: 'assembly' | 'exam' | 'sports_day' | 'parent_meeting' | 'other';
  date: string;
  start_time: string;
  end_time: string;
  affected_year_groups: string[];
  affected_subjects: string[];
  affected_rooms: string[];
  requires_full_cancellation: boolean;
  alternative_arrangements: any;
}

export interface TimetablePreferences {
  id: string;
  school_id: string;
  preference_type: 'general' | 'subject' | 'teacher' | 'room';
  target_id: string;
  priority_level: number;
  preference_data: any;
  is_hard_constraint: boolean;
  description: string;
}

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
  const { user } = useAuth();
  const { currentSchool } = useRBAC();
  const [loading, setLoading] = useState(false);
  
  // State for all data types
  const [academicCalendar, setAcademicCalendar] = useState<AcademicCalendar[]>([]);
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>([]);
  const [subjectRequirements, setSubjectRequirements] = useState<SubjectRequirement[]>([]);
  const [classCompositions, setClassCompositions] = useState<ClassComposition[]>([]);
  const [roomFeatures, setRoomFeatures] = useState<RoomFeature[]>([]);
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [timetablePreferences, setTimetablePreferences] = useState<TimetablePreferences[]>([]);

  // Fetch academic calendar
  const fetchAcademicCalendar = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_calendar')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('is_active', true)
        .order('start_date');
      
      if (error) throw error;
      setAcademicCalendar(data || []);
    } catch (error: any) {
      console.error('Error fetching academic calendar:', error);
      toast({
        title: "Error",
        description: "Failed to fetch academic calendar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch teacher profiles
  const fetchTeacherProfiles = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            subject_specializations
          )
        `)
        .eq('school_id', currentSchool.id);
      
      if (error) throw error;
      setTeacherProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching teacher profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch teacher profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch subject requirements
  const fetchSubjectRequirements = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subject_requirements')
        .select(`
          *,
          subject:subject_id (
            id,
            subject_name,
            subject_code,
            color_code
          )
        `)
        .eq('school_id', currentSchool.id);
      
      if (error) throw error;
      setSubjectRequirements(data || []);
    } catch (error: any) {
      console.error('Error fetching subject requirements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subject requirements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch class compositions
  const fetchClassCompositions = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_compositions')
        .select(`
          *,
          class:class_id (
            id,
            class_name,
            year_group
          ),
          form_teacher:form_teacher_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('school_id', currentSchool.id);
      
      if (error) throw error;
      setClassCompositions(data || []);
    } catch (error: any) {
      console.error('Error fetching class compositions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch class compositions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch room features
  const fetchRoomFeatures = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('room_features')
        .select(`
          *,
          room:room_id (
            id,
            room_name,
            room_type,
            capacity
          )
        `)
        .eq('school_id', currentSchool.id);
      
      if (error) throw error;
      setRoomFeatures(data || []);
    } catch (error: any) {
      console.error('Error fetching room features:', error);
      toast({
        title: "Error",
        description: "Failed to fetch room features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch special events
  const fetchSpecialEvents = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .eq('school_id', currentSchool.id)
        .order('date');
      
      if (error) throw error;
      setSpecialEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching special events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch special events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch timetable preferences
  const fetchTimetablePreferences = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetable_preferences')
        .select('*')
        .eq('school_id', currentSchool.id)
        .order('priority_level', { ascending: false });
      
      if (error) throw error;
      setTimetablePreferences(data || []);
    } catch (error: any) {
      console.error('Error fetching timetable preferences:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timetable preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate utilization and stats
  const calculateStats = (): AITimetableStats => {
    const totalPeriods = academicCalendar.reduce((sum, cal) => 
      sum + (cal.school_days.length * cal.total_weeks * 8), 0); // Assuming 8 periods per day
    
    const totalSubjects = subjectRequirements.length;
    const totalTeachers = teacherProfiles.length;
    const totalRooms = roomFeatures.length;
    const totalClasses = classCompositions.length;
    
    // Calculate utilization rate based on teacher availability vs required periods
    const totalRequiredPeriods = subjectRequirements.reduce((sum, req) => 
      sum + (req.periods_per_week * classCompositions.filter(c => c.year_group === req.year_group).length), 0);
    
    const totalAvailablePeriods = teacherProfiles.reduce((sum, teacher) => 
      sum + teacher.max_periods_per_week, 0);
    
    const utilizationRate = totalAvailablePeriods > 0 ? 
      Math.min(100, (totalRequiredPeriods / totalAvailablePeriods) * 100) : 0;

    // Count constraints
    const hardConstraints = timetablePreferences.filter(p => p.is_hard_constraint).length;
    const softConstraints = timetablePreferences.filter(p => !p.is_hard_constraint).length;
    const totalConstraints = hardConstraints + softConstraints;

    return {
      totalPeriods,
      totalSubjects,
      totalTeachers,
      totalRooms,
      totalClasses,
      utilizationRate,
      constraintsSatisfied: 0, // Would be calculated during actual generation
      totalConstraints
    };
  };

  // Save/update functions
  const saveAcademicCalendar = async (calendar: Partial<AcademicCalendar>) => {
    if (!currentSchool) return;

    try {
      const { data, error } = await supabase
        .from('academic_calendar')
        .upsert({ ...calendar, school_id: currentSchool.id })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Academic calendar saved successfully",
      });
      
      await fetchAcademicCalendar();
      return data;
    } catch (error: any) {
      console.error('Error saving academic calendar:', error);
      toast({
        title: "Error",
        description: "Failed to save academic calendar",
        variant: "destructive",
      });
    }
  };

  // Similar save functions for other data types would go here...

  // Initialize data on school change
  useEffect(() => {
    if (currentSchool) {
      Promise.all([
        fetchAcademicCalendar(),
        fetchTeacherProfiles(),
        fetchSubjectRequirements(),
        fetchClassCompositions(),
        fetchRoomFeatures(),
        fetchSpecialEvents(),
        fetchTimetablePreferences(),
      ]);
    }
  }, [currentSchool]);

  return {
    // Loading state
    loading,
    
    // Data
    academicCalendar,
    teacherProfiles,
    subjectRequirements,
    classCompositions,
    roomFeatures,
    specialEvents,
    timetablePreferences,
    
    // Stats
    stats: calculateStats(),
    
    // Fetch functions
    fetchAcademicCalendar,
    fetchTeacherProfiles,
    fetchSubjectRequirements,
    fetchClassCompositions,
    fetchRoomFeatures,
    fetchSpecialEvents,
    fetchTimetablePreferences,
    
    // Save functions
    saveAcademicCalendar,
    
    // Utility functions
    isDataComplete: () => {
      return academicCalendar.length > 0 &&
             teacherProfiles.length > 0 &&
             subjectRequirements.length > 0 &&
             classCompositions.length > 0 &&
             roomFeatures.length > 0;
    },
    
    getCompletionPercentage: () => {
      const checks = [
        academicCalendar.length > 0,
        teacherProfiles.length > 0,
        subjectRequirements.length > 0,
        classCompositions.length > 0,
        roomFeatures.length > 0,
      ];
      return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }
  };
}