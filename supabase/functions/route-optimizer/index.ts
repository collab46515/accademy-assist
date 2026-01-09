import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Stop {
  id?: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  estimatedStudents?: number;
}

interface RouteRequest {
  action: 'geocode' | 'optimize' | 'calculate_distance' | 'generate_trips';
  stops?: Stop[];
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  waypoints?: { lat: number; lng: number }[];
  address?: string;
  profileId?: string;
  schoolId?: string;
  vehicleCapacity?: number;
}

interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

interface DistanceResult {
  distance: number; // in meters
  duration: number; // in seconds
  distanceText: string;
  durationText: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      throw new Error('Google Maps API key not configured');
    }

    const requestData: RouteRequest = await req.json();
    console.log('Route optimizer request:', requestData.action);

    switch (requestData.action) {
      case 'geocode':
        return await handleGeocode(requestData.address!, GOOGLE_MAPS_API_KEY);
      
      case 'calculate_distance':
        return await handleDistanceCalculation(
          requestData.origin!,
          requestData.destination!,
          requestData.waypoints,
          GOOGLE_MAPS_API_KEY
        );
      
      case 'optimize':
        return await handleRouteOptimization(
          requestData.stops!,
          GOOGLE_MAPS_API_KEY
        );
      
      case 'generate_trips':
        return await handleTripGeneration(
          requestData,
          GOOGLE_MAPS_API_KEY,
          req
        );
      
      default:
        throw new Error(`Unknown action: ${requestData.action}`);
    }
  } catch (error) {
    console.error('Route optimizer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleGeocode(address: string, apiKey: string): Promise<Response> {
  console.log('Geocoding address:', address);
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || !data.results?.length) {
    console.error('Geocoding failed:', data.status, data.error_message);
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  const result = data.results[0];
  const geocodeResult: GeocodeResult = {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  };

  console.log('Geocoding result:', geocodeResult);
  return new Response(
    JSON.stringify(geocodeResult),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDistanceCalculation(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  waypoints: { lat: number; lng: number }[] | undefined,
  apiKey: string
): Promise<Response> {
  console.log('Calculating distance from', origin, 'to', destination);

  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}`;
  
  if (waypoints && waypoints.length > 0) {
    const waypointStr = waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
    url += `&waypoints=optimize:true|${waypointStr}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    console.error('Directions API failed:', data.status, data.error_message);
    throw new Error(`Directions API failed: ${data.status}`);
  }

  const route = data.routes[0];
  let totalDistance = 0;
  let totalDuration = 0;

  for (const leg of route.legs) {
    totalDistance += leg.distance.value;
    totalDuration += leg.duration.value;
  }

  const result: DistanceResult & { optimizedWaypointOrder?: number[] } = {
    distance: totalDistance,
    duration: totalDuration,
    distanceText: `${(totalDistance / 1000).toFixed(1)} km`,
    durationText: formatDuration(totalDuration),
    optimizedWaypointOrder: route.waypoint_order,
  };

  console.log('Distance calculation result:', result);
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleRouteOptimization(
  stops: Stop[],
  apiKey: string
): Promise<Response> {
  console.log('Optimizing route for', stops.length, 'stops');

  // First geocode any stops without coordinates
  const geocodedStops = await Promise.all(
    stops.map(async (stop) => {
      if (stop.latitude && stop.longitude) {
        return stop;
      }
      
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stop.address)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results?.length) {
        return {
          ...stop,
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng,
        };
      }
      
      console.warn('Could not geocode stop:', stop.name);
      return stop;
    })
  );

  // Filter stops with valid coordinates
  const validStops = geocodedStops.filter(s => s.latitude && s.longitude);
  
  if (validStops.length < 2) {
    return new Response(
      JSON.stringify({ 
        optimizedStops: validStops,
        totalDistance: 0,
        totalDuration: 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Use first stop as origin and last as destination, optimize waypoints
  const origin = validStops[0];
  const destination = validStops[validStops.length - 1];
  const waypoints = validStops.slice(1, -1);

  if (waypoints.length === 0) {
    // Direct route, no optimization needed
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const route = data.routes[0];
      return new Response(
        JSON.stringify({
          optimizedStops: validStops,
          totalDistance: route.legs[0].distance.value,
          totalDuration: route.legs[0].duration.value,
          distanceText: route.legs[0].distance.text,
          durationText: route.legs[0].duration.text,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Optimize with waypoints
  const waypointStr = waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|');
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=optimize:true|${waypointStr}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Route optimization failed: ${data.status}`);
  }

  const route = data.routes[0];
  const waypointOrder = route.waypoint_order || [];
  
  // Reorder stops based on optimization
  const optimizedStops = [origin];
  for (const idx of waypointOrder) {
    optimizedStops.push(waypoints[idx]);
  }
  optimizedStops.push(destination);

  let totalDistance = 0;
  let totalDuration = 0;
  for (const leg of route.legs) {
    totalDistance += leg.distance.value;
    totalDuration += leg.duration.value;
  }

  console.log('Route optimization complete. Distance:', totalDistance, 'Duration:', totalDuration);
  
  return new Response(
    JSON.stringify({
      optimizedStops,
      totalDistance,
      totalDuration,
      distanceText: `${(totalDistance / 1000).toFixed(1)} km`,
      durationText: formatDuration(totalDuration),
      legs: route.legs.map((leg: any, idx: number) => ({
        from: optimizedStops[idx].name,
        to: optimizedStops[idx + 1]?.name,
        distance: leg.distance.text,
        duration: leg.duration.text,
      })),
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTripGeneration(
  request: RouteRequest,
  apiKey: string,
  req: Request
): Promise<Response> {
  console.log('Generating trips for profile:', request.profileId);

  // Get Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get auth token from request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization header required');
  }

  // Fetch route profile
  const { data: profile, error: profileError } = await supabase
    .from('route_profiles')
    .select('*')
    .eq('id', request.profileId)
    .single();

  if (profileError || !profile) {
    console.error('Profile error:', profileError);
    throw new Error('Route profile not found');
  }

  console.log('Profile found:', profile.profile_name, 'Pool type:', profile.student_pool_type);

  // Get students based on profile criteria
  // For now, we'll fetch all enrolled students from the school
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select(`
      id,
      year_group,
      school_id,
      profiles:user_id (
        first_name,
        last_name,
        address
      )
    `)
    .eq('school_id', request.schoolId)
    .eq('is_enrolled', true);

  if (studentsError) {
    console.error('Error fetching students:', studentsError);
    throw new Error('Failed to fetch students');
  }

  console.log('Found', students?.length || 0, 'enrolled students');

  // Filter students based on pool criteria if specified
  let eligibleStudents = students || [];
  
  if (profile.student_pool_type === 'year_group' && profile.student_pool_criteria?.year_groups) {
    const yearGroups = profile.student_pool_criteria.year_groups;
    eligibleStudents = eligibleStudents.filter((s: any) => yearGroups.includes(s.year_group));
    console.log('Filtered to', eligibleStudents.length, 'students by year group');
  }

  // Group students by address for efficient routing
  const addressGroups = new Map<string, any[]>();
  
  for (const student of eligibleStudents) {
    const address = (student.profiles as any)?.address || 'Unknown Address';
    if (!addressGroups.has(address)) {
      addressGroups.set(address, []);
    }
    addressGroups.get(address)!.push(student);
  }

  console.log('Grouped into', addressGroups.size, 'unique addresses');

  // Fetch available vehicles
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('*')
    .eq('school_id', request.schoolId)
    .eq('status', 'active');

  if (vehiclesError) {
    console.error('Error fetching vehicles:', vehiclesError);
  }

  const vehicleCapacity = request.vehicleCapacity || 40;
  const totalStudents = eligibleStudents.length;
  const estimatedTrips = Math.ceil(totalStudents / vehicleCapacity);

  console.log('Estimated trips needed:', estimatedTrips, 'for', totalStudents, 'students with capacity', vehicleCapacity);

  // Generate trip suggestions
  const tripSuggestions = [];
  let remainingStudents = [...eligibleStudents];
  let tripNumber = 1;

  while (remainingStudents.length > 0) {
    const tripStudents = remainingStudents.slice(0, vehicleCapacity);
    remainingStudents = remainingStudents.slice(vehicleCapacity);

    // Get unique pickup addresses for this trip
    const tripAddresses = [...new Set(tripStudents.map((s: any) => 
      (s.profiles as any)?.address || 'Unknown'
    ).filter((addr: string) => addr !== 'Unknown'))];
    
    // Create stops from addresses
    const stops: Stop[] = tripAddresses.map((addr, idx) => ({
      id: `stop-${idx}`,
      name: `Stop ${idx + 1}`,
      address: addr || '',
      estimatedStudents: tripStudents.filter((s: any) => 
        (s.profiles as any)?.address === addr
      ).length,
    }));

    let optimizedRoute = null;
    if (stops.length > 1) {
      try {
        // Geocode stops
        const geocodedStops = await Promise.all(
          stops.map(async (stop) => {
            if (!stop.address) return stop;
            
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stop.address)}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'OK' && data.results?.length) {
              return {
                ...stop,
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
              };
            }
            return stop;
          })
        );

        const validStops = geocodedStops.filter(s => s.latitude && s.longitude);
        
        if (validStops.length >= 2) {
          const origin = validStops[0];
          const destination = validStops[validStops.length - 1];
          const waypoints = validStops.slice(1, -1);
          
          let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;
          
          if (waypoints.length > 0) {
            const waypointStr = waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|');
            url += `&waypoints=optimize:true|${waypointStr}`;
          }
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.status === 'OK') {
            const route = data.routes[0];
            let totalDistance = 0;
            let totalDuration = 0;
            
            for (const leg of route.legs) {
              totalDistance += leg.distance.value;
              totalDuration += leg.duration.value;
            }
            
            optimizedRoute = {
              distance: totalDistance,
              duration: totalDuration,
              distanceText: `${(totalDistance / 1000).toFixed(1)} km`,
              durationText: formatDuration(totalDuration),
            };
          }
        }
      } catch (routeError) {
        console.error('Route optimization error:', routeError);
      }
    }

    tripSuggestions.push({
      tripNumber,
      tripName: `${profile.profile_name} - Trip ${tripNumber}`,
      studentCount: tripStudents.length,
      stops: stops.length,
      students: tripStudents.map((s: any) => s.id),
      estimatedDistance: optimizedRoute?.distanceText || 'N/A',
      estimatedDuration: optimizedRoute?.durationText || 'N/A',
      pickupAddresses: tripAddresses,
    });

    tripNumber++;
  }

  console.log('Generated', tripSuggestions.length, 'trip suggestions');

  return new Response(
    JSON.stringify({
      profileId: request.profileId,
      profileName: profile.profile_name,
      totalStudents,
      availableVehicles: vehicles?.length || 0,
      vehicleCapacity,
      tripSuggestions,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}
