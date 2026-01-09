import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TripSuggestion {
  tripNumber: number;
  tripName: string;
  studentCount: number;
  stops: number;
  students: string[];
  estimatedDistance: string;
  estimatedDuration: string;
  pickupAddresses: string[];
}

export interface AutoGenerateResult {
  profileId: string;
  profileName: string;
  totalStudents: number;
  availableVehicles: number;
  vehicleCapacity: number;
  tripSuggestions: TripSuggestion[];
}

export interface ConflictCheck {
  hasConflict: boolean;
  conflictType?: 'driver' | 'vehicle' | 'attender';
  conflictingTrip?: string;
  message?: string;
}

export const useRouteOptimizer = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrips, setGeneratedTrips] = useState<TripSuggestion[]>([]);

  const autoGenerateTrips = async (
    profileId: string,
    schoolId: string,
    vehicleCapacity: number = 40
  ): Promise<AutoGenerateResult | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('route-optimizer', {
        body: {
          action: 'generate_trips',
          profileId,
          schoolId,
          vehicleCapacity,
        },
      });

      if (error) throw error;
      
      setGeneratedTrips(data.tripSuggestions || []);
      return data;
    } catch (err) {
      console.error('Error auto-generating trips:', err);
      toast.error('Failed to auto-generate trips');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeRoute = async (stops: any[]): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('route-optimizer', {
        body: {
          action: 'optimize',
          stops,
        },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error optimizing route:', err);
      toast.error('Failed to optimize route');
      return null;
    }
  };

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('route-optimizer', {
        body: {
          action: 'geocode',
          address,
        },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error geocoding address:', err);
      return null;
    }
  };

  const calculateDistance = async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints?: { lat: number; lng: number }[]
  ): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('route-optimizer', {
        body: {
          action: 'calculate_distance',
          origin,
          destination,
          waypoints,
        },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error calculating distance:', err);
      return null;
    }
  };

  // Check for conflicts when assigning driver/vehicle/attender
  const checkResourceConflicts = async (
    schoolId: string,
    resourceType: 'driver' | 'vehicle' | 'attender',
    resourceId: string,
    scheduledStartTime: string,
    scheduledEndTime: string,
    excludeTripId?: string
  ): Promise<ConflictCheck> => {
    try {
      let query = supabase
        .from('transport_trips')
        .select('id, trip_name, scheduled_start_time, scheduled_end_time')
        .eq('school_id', schoolId)
        .eq('status', 'active');

      // Filter by the resource type
      if (resourceType === 'driver') {
        query = query.eq('driver_id', resourceId);
      } else if (resourceType === 'vehicle') {
        query = query.eq('vehicle_id', resourceId);
      } else if (resourceType === 'attender') {
        query = query.eq('attender_id', resourceId);
      }

      // Exclude current trip if editing
      if (excludeTripId) {
        query = query.neq('id', excludeTripId);
      }

      const { data: existingTrips, error } = await query;

      if (error) throw error;

      // Check for time overlap
      for (const trip of existingTrips || []) {
        const existingStart = trip.scheduled_start_time;
        const existingEnd = trip.scheduled_end_time || trip.scheduled_start_time;
        
        // Check if times overlap
        if (
          (scheduledStartTime >= existingStart && scheduledStartTime < existingEnd) ||
          (scheduledEndTime > existingStart && scheduledEndTime <= existingEnd) ||
          (scheduledStartTime <= existingStart && scheduledEndTime >= existingEnd)
        ) {
          return {
            hasConflict: true,
            conflictType: resourceType,
            conflictingTrip: trip.trip_name,
            message: `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} is already assigned to "${trip.trip_name}" during ${existingStart} - ${existingEnd}`,
          };
        }
      }

      return { hasConflict: false };
    } catch (err) {
      console.error('Error checking conflicts:', err);
      return { hasConflict: false };
    }
  };

  // Batch create trips from suggestions
  const createTripsFromSuggestions = async (
    suggestions: TripSuggestion[],
    profileId: string,
    schoolId: string,
    tripType: string = 'pickup',
    startTime: string = '07:00'
  ): Promise<boolean> => {
    try {
      const tripsToCreate = suggestions.map((suggestion, index) => ({
        school_id: schoolId,
        route_profile_id: profileId,
        trip_name: suggestion.tripName,
        trip_code: `T${String(index + 1).padStart(2, '0')}`,
        trip_type: tripType,
        scheduled_start_time: startTime,
        estimated_duration_minutes: 60,
        vehicle_capacity: null,
        assigned_students_count: suggestion.studentCount,
        status: 'active',
      }));

      const { data, error } = await supabase
        .from('transport_trips')
        .insert(tripsToCreate)
        .select();

      if (error) throw error;
      
      toast.success(`Created ${data.length} trips successfully`);
      return true;
    } catch (err) {
      console.error('Error creating trips:', err);
      toast.error('Failed to create trips');
      return false;
    }
  };

  return {
    isGenerating,
    generatedTrips,
    autoGenerateTrips,
    optimizeRoute,
    geocodeAddress,
    calculateDistance,
    checkResourceConflicts,
    createTripsFromSuggestions,
    setGeneratedTrips,
  };
};
