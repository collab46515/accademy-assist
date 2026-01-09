import { useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { supabase } from '@/integrations/supabase/client';

let isInitialized = false;
let loadPromise: Promise<void> | null = null;

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMaps = useCallback(async () => {
    if (isLoaded || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch API key from edge function
      const { data, error: fetchError } = await supabase.functions.invoke('maps-api', {
        body: { action: 'get_api_key' }
      });

      if (fetchError) throw fetchError;
      if (!data?.apiKey) throw new Error('API key not available');

      // Initialize options once
      if (!isInitialized) {
        setOptions({
          key: data.apiKey,
          v: 'weekly',
          libraries: ['places', 'geometry', 'marker']
        });
        isInitialized = true;
      }

      // Load the maps and marker libraries
      if (!loadPromise) {
        loadPromise = Promise.all([
          importLibrary('maps'),
          importLibrary('marker')
        ]).then(() => {});
      }

      await loadPromise;
      setIsLoaded(true);
    } catch (err: any) {
      console.error('Error loading Google Maps:', err);
      setError(err.message || 'Failed to load Google Maps');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading]);

  return { isLoaded, isLoading, error, loadMaps };
};