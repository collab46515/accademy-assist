import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';
import { useToast } from '@/hooks/use-toast';

export interface ModuleFeature {
  id: string;
  module_id: string;
  feature_name: string;
  feature_key: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export interface SchoolModuleFeature {
  id: string;
  school_id: string;
  module_id: string;
  feature_id: string;
  is_enabled: boolean;
  settings?: any; // Using any to match Json type from Supabase
  feature?: ModuleFeature;
}

export function useModuleFeatures(moduleId?: string) {
  const { currentSchoolId } = useSchoolFilter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<ModuleFeature[]>([]);
  const [schoolFeatures, setSchoolFeatures] = useState<SchoolModuleFeature[]>([]);

  useEffect(() => {
    if (currentSchoolId && moduleId) {
      fetchFeatures();
    }
  }, [currentSchoolId, moduleId]);

  const fetchFeatures = async () => {
    if (!currentSchoolId || !moduleId) return;

    try {
      setLoading(true);

      // Fetch all features for this module
      const { data: featuresData, error: featuresError } = await supabase
        .from('module_features')
        .select('*')
        .eq('module_id', moduleId)
        .eq('is_active', true)
        .order('sort_order');

      if (featuresError) throw featuresError;

      // Fetch school's enabled features
      const { data: schoolFeaturesData, error: schoolFeaturesError } = await supabase
        .from('school_module_features')
        .select(`
          *,
          feature:module_features(*)
        `)
        .eq('school_id', currentSchoolId)
        .eq('module_id', moduleId);

      if (schoolFeaturesError) throw schoolFeaturesError;

      setFeatures(featuresData || []);
      setSchoolFeatures((schoolFeaturesData as any) || []);
    } catch (error) {
      console.error('Error fetching module features:', error);
      toast({
        title: "Error",
        description: "Failed to load module features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFeatureEnabled = (featureKey: string): boolean => {
    const schoolFeature = schoolFeatures.find(
      sf => sf.feature?.feature_key === featureKey
    );
    return schoolFeature?.is_enabled || false;
  };

  const toggleFeature = async (featureId: string, enabled: boolean) => {
    if (!currentSchoolId || !moduleId) return;

    try {
      // Check if record exists
      const existing = schoolFeatures.find(sf => sf.feature_id === featureId);

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('school_module_features')
          .update({ is_enabled: enabled })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('school_module_features')
          .insert({
            school_id: currentSchoolId,
            module_id: moduleId,
            feature_id: featureId,
            is_enabled: enabled,
          });

        if (error) throw error;
      }

      await fetchFeatures();
      
      toast({
        title: "Success",
        description: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature",
        variant: "destructive",
      });
    }
  };

  const getEnabledFeatures = (): ModuleFeature[] => {
    return features.filter(feature => 
      schoolFeatures.some(
        sf => sf.feature_id === feature.id && sf.is_enabled
      )
    );
  };

  return {
    features,
    schoolFeatures,
    loading,
    isFeatureEnabled,
    toggleFeature,
    getEnabledFeatures,
    refetch: fetchFeatures,
  };
}
