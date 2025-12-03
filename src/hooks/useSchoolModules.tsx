import { useState, useEffect, useRef } from 'react';
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

// Module-level cache to persist across re-mounts
const modulesCache: {
  schoolId: string | null;
  modules: SchoolModule[];
  lastFetched: number | null;
  isSuperAdmin: boolean;
} = {
  schoolId: null,
  modules: [],
  lastFetched: null,
  isSuperAdmin: false
};

export function useSchoolModules(schoolId: string | undefined) {
  const { isSuperAdmin } = useRBAC();
  const isSuperAdminUser = isSuperAdmin();
  
  // Check if cache is valid
  const cacheValid = modulesCache.schoolId === schoolId && 
                     modulesCache.lastFetched && 
                     modulesCache.isSuperAdmin === isSuperAdminUser;
  
  const [modules, setModules] = useState<SchoolModule[]>(
    cacheValid ? modulesCache.modules : []
  );
  const [loading, setLoading] = useState(!cacheValid && !!schoolId);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    // Skip if cache is valid
    if (modulesCache.schoolId === schoolId && 
        modulesCache.lastFetched && 
        modulesCache.isSuperAdmin === isSuperAdminUser) {
      setModules(modulesCache.modules);
      setLoading(false);
      return;
    }

    fetchSchoolModules();
  }, [schoolId, isSuperAdminUser]);

  const fetchSchoolModules = async () => {
    if (!schoolId || isFetching.current) return;

    isFetching.current = true;
    
    try {
      // Only show loading if no cached data
      if (!modulesCache.modules.length) {
        setLoading(true);
      }

      // Super Admins get ALL modules enabled by default
      if (isSuperAdminUser) {
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
        
        // Update cache
        modulesCache.schoolId = schoolId;
        modulesCache.modules = superAdminModules;
        modulesCache.lastFetched = Date.now();
        modulesCache.isSuperAdmin = true;
        
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
        
        // Update cache
        modulesCache.schoolId = schoolId;
        modulesCache.modules = data || [];
        modulesCache.lastFetched = Date.now();
        modulesCache.isSuperAdmin = false;
        
        setModules(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching school modules:', err);
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const isModuleEnabled = (moduleName: string): boolean => {
    // Super Admins have all modules enabled
    if (isSuperAdminUser) {
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
