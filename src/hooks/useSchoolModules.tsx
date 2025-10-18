import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from './useRBAC';

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
  const { isSuperAdmin } = useRBAC();
  const [modules, setModules] = useState<SchoolModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    fetchSchoolModules();
  }, [schoolId, isSuperAdmin]);

  const fetchSchoolModules = async () => {
    if (!schoolId) return;

    try {
      setLoading(true);

      // Super Admins get ALL modules enabled by default
      if (isSuperAdmin()) {
        console.log('🔑 Super Admin detected - loading ALL modules');
        
        const { data: allModules, error: fetchError } = await supabase
          .from('modules')
          .select('*')
          .eq('is_active', true);

        if (fetchError) throw fetchError;

        // Transform to match SchoolModule interface
        const superAdminModules: SchoolModule[] = (allModules || []).map(mod => ({
          id: mod.id,
          school_id: schoolId,
          module_id: mod.id,
          is_enabled: true,
          custom_workflow: {},
          settings: {},
          module: {
            name: mod.name,
            route: mod.route,
            icon: mod.icon,
            category: mod.category,
            description: mod.description,
          }
        }));

        console.log('📦 Loaded ALL modules for Super Admin:', superAdminModules.length);
        setModules(superAdminModules);
        setError(null);
      } else {
        // Regular users only get enabled school modules
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
          .eq('is_enabled', true);

        if (fetchError) throw fetchError;

        console.log('📦 Loaded school modules:', data?.length || 0);
        setModules(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching school modules:', err);
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const isModuleEnabled = (moduleName: string): boolean => {
    // Super Admins have all modules enabled
    if (isSuperAdmin()) {
      return true;
    }
    
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
