import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface School {
  id: string;
  name: string;
  code: string;
  custom_domain: string | null;
  module_config: any;
}

export function useSchoolDetection() {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectSchool();
  }, []);

  const detectSchool = async () => {
    try {
      setLoading(true);
      const hostname = window.location.hostname;

      console.log('🌐 Detecting school from domain:', hostname);

      // Try to find school by custom domain
      const { data: schoolByDomain, error: domainError } = await supabase
        .from('schools')
        .select('*')
        .eq('custom_domain', hostname)
        .eq('is_active', true)
        .maybeSingle();

      if (domainError) {
        console.error('Error fetching school by domain:', domainError);
        setError(domainError.message);
        setLoading(false);
        return;
      }

      if (schoolByDomain) {
        console.log('✅ School detected by domain:', schoolByDomain.name);
        setSchool(schoolByDomain);
        setLoading(false);
        return;
      }

      // If no custom domain match, this might be the default domain
      // In production, you'd fetch the default school or show school selector
      console.log('⚠️ No school matched domain. Using default/fallback logic.');
      
      // Fetch first active school as fallback (for development)
      const { data: fallbackSchool, error: fallbackError } = await supabase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fallbackError) {
        console.error('Error fetching fallback school:', fallbackError);
        setError(fallbackError.message);
      } else if (fallbackSchool) {
        console.log('📍 Using fallback school:', fallbackSchool.name);
        setSchool(fallbackSchool);
      } else {
        setError('No active schools found in the system');
      }
    } catch (err) {
      console.error('School detection error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { school, loading, error, refetch: detectSchool };
}
