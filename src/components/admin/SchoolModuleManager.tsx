import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateSchoolDialog } from './CreateSchoolDialog';
import { ModuleConfigDialog } from './ModuleConfigDialog';

interface Module {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  category: string;
}

interface SchoolModule {
  id: string;
  school_id: string;
  module_id: string;
  is_enabled: boolean;
  custom_workflow: any;
  settings: any;
}

export function SchoolModuleManager() {
  const { currentSchool, isSuperAdmin } = useRBAC();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [schoolModules, setSchoolModules] = useState<SchoolModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configModule, setConfigModule] = useState<{ id: string; name: string } | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setConfigModule(null);
    };
  }, []);

  useEffect(() => {
    if (currentSchool && isSuperAdmin()) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentSchool]);

  const fetchData = async () => {
    if (!currentSchool) return;

    try {
      setLoading(true);

      // Fetch all available modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch school's module configuration
      const { data: schoolModulesData, error: schoolModulesError } = await supabase
        .from('school_modules')
        .select('*')
        .eq('school_id', currentSchool.id);

      if (schoolModulesError) throw schoolModulesError;

      setModules(modulesData || []);
      setSchoolModules(schoolModulesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load module configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleId: string, enabled: boolean) => {
    if (!currentSchool) return;

    setSaving(true);
    try {
      const existingConfig = schoolModules.find((sm) => sm.module_id === moduleId);

      if (existingConfig) {
        // Update existing
        const { error } = await supabase
          .from('school_modules')
          .update({ is_enabled: enabled })
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('school_modules')
          .insert({
            school_id: currentSchool.id,
            module_id: moduleId,
            is_enabled: enabled,
            custom_workflow: {},
            settings: {},
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Module ${enabled ? 'enabled' : 'disabled'} successfully`,
      });

      fetchData();
    } catch (error) {
      console.error('Error toggling module:', error);
      toast({
        title: 'Error',
        description: 'Failed to update module',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const isModuleEnabled = (moduleId: string): boolean => {
    const config = schoolModules.find((sm) => sm.module_id === moduleId);
    return config?.is_enabled || false;
  };

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            You must be a super admin to manage school modules.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Group modules by category
  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  return (
    <div className="w-full max-w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Module Configuration
              </CardTitle>
              <CardDescription>
                Configure which modules are enabled for {currentSchool?.name}
              </CardDescription>
            </div>
            <CreateSchoolDialog onSchoolCreated={fetchData} />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Tabs defaultValue={Object.keys(groupedModules)[0]} className="w-full space-y-4">
            <TabsList className="w-full flex flex-wrap justify-start">
              {Object.keys(groupedModules).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {categoryModules.map((module) => {
                  const enabled = isModuleEnabled(module.id);
                  return (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{module.name}</h4>
                          <Badge variant={enabled ? 'default' : 'secondary'}>
                            {enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Route: {module.route}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfigModule({ id: module.id, name: module.name })}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Configure
                        </Button>

                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => toggleModule(module.id, checked)}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {configModule && currentSchool && (
        <ModuleConfigDialog
          open={!!configModule}
          onOpenChange={(open) => !open && setConfigModule(null)}
          moduleId={configModule.id}
          moduleName={configModule.name}
          schoolId={currentSchool.id}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}
