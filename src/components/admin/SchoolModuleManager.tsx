import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Settings, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  useEffect(() => {
    if (currentSchool && isSuperAdmin()) {
      fetchData();
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Module Configuration
          </CardTitle>
          <CardDescription>
            Configure which modules are enabled for {currentSchool?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(groupedModules)[0]} className="space-y-4">
            <TabsList>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{module.name} Configuration</DialogTitle>
                              <DialogDescription>
                                Customize workflow and settings for this module
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <p className="text-sm text-muted-foreground">
                                Custom workflow and settings configuration will be available in the next update.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>

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
    </div>
  );
}
