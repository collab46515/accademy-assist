import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Activity {
  id: string;
  school_id: string;
  name: string;
  category: "sports" | "arts" | "academic" | "service" | "duke-of-edinburgh";
  instructor: string;
  schedule: string;
  location?: string;
  capacity: number;
  enrolled: number;
  status: "active" | "full" | "cancelled" | "completed";
  cost?: number;
  description?: string;
  requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface ActivityParticipant {
  id: string;
  activity_id: string;
  student_id: string;
  school_id: string;
  enrollment_date: string;
  attendance_count: number;
  achievements?: string[];
  status: "active" | "completed" | "withdrawn";
  created_at: string;
  updated_at: string;
}

export interface HousePoint {
  id: string;
  student_id: string;
  school_id: string;
  house: string;
  points: number;
  reason: string;
  activity_id?: string;
  awarded_by: string;
  awarded_date: string;
  created_at: string;
}

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);
  const [housePoints, setHousePoints] = useState<HousePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all activities data
  const fetchActivitiesData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [activitiesRes, participantsRes, housePointsRes] = await Promise.all([
        supabase.from('activities').select('*').order('name'),
        supabase.from('activities_participants').select('*').order('enrollment_date', { ascending: false }),
        supabase.from('house_points').select('*').order('awarded_date', { ascending: false })
      ]);

      if (activitiesRes.error) throw activitiesRes.error;
      if (participantsRes.error) throw participantsRes.error;
      if (housePointsRes.error) throw housePointsRes.error;

      setActivities(activitiesRes.data as Activity[] || []);
      setParticipants(participantsRes.data as ActivityParticipant[] || []);
      setHousePoints(housePointsRes.data as HousePoint[] || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities data');
      toast.error('Failed to load activities data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for activities
  const addActivity = async (activityData: Omit<Activity, 'id' | 'enrolled' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{ ...activityData, enrolled: 0 }])
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [...prev, data as Activity]);
      toast.success('Activity added successfully');
      return data as Activity;
    } catch (err) {
      toast.error('Failed to add activity');
      throw err;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => prev.map(activity => activity.id === id ? data as Activity : activity));
      toast.success('Activity updated successfully');
      return data as Activity;
    } catch (err) {
      toast.error('Failed to update activity');
      throw err;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActivities(prev => prev.filter(activity => activity.id !== id));
      toast.success('Activity deleted successfully');
    } catch (err) {
      toast.error('Failed to delete activity');
      throw err;
    }
  };

  // CRUD operations for participants
  const addParticipant = async (participantData: Omit<ActivityParticipant, 'id' | 'attendance_count' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('activities_participants')
        .insert([{ ...participantData, attendance_count: 0 }])
        .select()
        .single();

      if (error) throw error;

      // Update enrolled count using database function
      const { error: updateError } = await supabase.rpc('increment_activity_enrollment', { 
        activity_id: participantData.activity_id 
      });
      if (updateError) console.warn('Failed to update enrollment count:', updateError);

      setParticipants(prev => [...prev, data as ActivityParticipant]);
      toast.success('Participant enrolled successfully');
      fetchActivitiesData(); // Refresh to get updated enrollment count
      return data as ActivityParticipant;
    } catch (err) {
      toast.error('Failed to enroll participant');
      throw err;
    }
  };

  const updateParticipant = async (id: string, updates: Partial<ActivityParticipant>) => {
    try {
      const { data, error } = await supabase
        .from('activities_participants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setParticipants(prev => prev.map(participant => participant.id === id ? data as ActivityParticipant : participant));
      toast.success('Participant updated successfully');
      return data as ActivityParticipant;
    } catch (err) {
      toast.error('Failed to update participant');
      throw err;
    }
  };

  // CRUD operations for house points
  const addHousePoint = async (housePointData: Omit<HousePoint, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('house_points')
        .insert([housePointData])
        .select()
        .single();

      if (error) throw error;

      setHousePoints(prev => [data as HousePoint, ...prev]);
      toast.success('House points awarded successfully');
      return data as HousePoint;
    } catch (err) {
      toast.error('Failed to award house points');
      throw err;
    }
  };

  useEffect(() => {
    fetchActivitiesData();
  }, [user]);

  return {
    activities,
    participants,
    housePoints,
    loading,
    error,
    refetch: fetchActivitiesData,
    // Activity operations
    addActivity,
    updateActivity,
    deleteActivity,
    // Participant operations
    addParticipant,
    updateParticipant,
    // House points operations
    addHousePoint,
  };
};