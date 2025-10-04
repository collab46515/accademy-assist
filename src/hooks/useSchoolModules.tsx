import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SchoolModule {
  id: string;
  school_id: string;
  module_id: string;
  is_enabled: boolean;
  custom_workflow: any;
  settings: any;
  module: {
    name: string;
    route: string;
    icon: string;
    category: string;
    description?: string;
  };
}

export function useSchoolModules(schoolId: string | undefined) {
  const [modules, setModules] = useState<SchoolModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    fetchSchoolModules();
  }, [schoolId]);

  const fetchSchoolModules = async () => {
    if (!schoolId) return;

    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('school_modules')
        .select(`
          *,
          module:modules(
            name,
            route,
            icon,
            category,
            description
          )
        `)
        .eq('school_id', schoolId)
        .eq('is_enabled', true)
        .order('module(sort_order)', { ascending: true });

      if (fetchError) throw fetchError;

      console.log('📦 Loaded school modules:', data?.length || 0);
      setModules(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching school modules:', err);
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const isModuleEnabled = (moduleName: string): boolean => {
    return modules.some(
      (sm) => sm.module.name === moduleName && sm.is_enabled
    );
  };

  const getModuleWorkflow = (moduleName: string): Record<string, any> | null => {
    const module = modules.find((sm) => sm.module.name === moduleName);
    return module?.custom_workflow || null;
  };

  const getModuleSettings = (moduleName: string): Record<string, any> | null => {
    const module = modules.find((sm) => sm.module.name === moduleName);
    return module?.settings || null;
  };

  return {
    modules,
    loading,
    error,
    isModuleEnabled,
    getModuleWorkflow,
    getModuleSettings,
    refetch: fetchSchoolModules,
  };
}
