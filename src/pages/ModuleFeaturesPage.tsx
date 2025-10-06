import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ModuleFeaturesConfig } from '@/components/admin/ModuleFeaturesConfig';
import { Settings2, ChevronRight, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';
import { useSchoolModules } from '@/hooks/useSchoolModules';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ModuleFeaturesPage() {
  const navigate = useNavigate();
  const { currentSchool } = useSchoolFilter();
  const { modules: schoolModules, loading } = useSchoolModules(currentSchool?.id);
  const [activeModule, setActiveModule] = useState<string>('');
  const [modulesWithFeatures, setModulesWithFeatures] = useState<string[]>([]);

  useEffect(() => {
    const fetchModulesWithFeatures = async () => {
      const { data } = await supabase
        .from('module_features')
        .select('module_id')
        .eq('is_active', true);
      
      const uniqueModuleIds = [...new Set(data?.map(f => f.module_id) || [])];
      setModulesWithFeatures(uniqueModuleIds);
    };

    fetchModulesWithFeatures();
  }, []);

  useEffect(() => {
    const enabledWithFeatures = enabledModules.filter(sm => 
      modulesWithFeatures.includes(sm.module_id)
    );
    
    if (enabledWithFeatures.length > 0 && !activeModule) {
      setActiveModule(enabledWithFeatures[0].module_id);
    }
  }, [schoolModules, modulesWithFeatures]);

  const enabledModules = schoolModules.filter(sm => sm.is_enabled);
  const modulesWithConfigurableFeatures = enabledModules.filter(sm => 
    modulesWithFeatures.includes(sm.module_id)
  );

  console.log('📋 ModuleFeaturesPage:', {
    schoolId: currentSchool?.id,
    schoolName: currentSchool?.name,
    totalModules: schoolModules.length,
    enabledModules: enabledModules.length,
    modulesWithFeatures: modulesWithConfigurableFeatures.length,
    activeModule,
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Module Features"
        description={`Configure features for ${currentSchool?.name || 'your school'}`}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin/schools" },
          { label: "Module Features" }
        ]}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Currently only Finance and HR Management modules have configurable features. More modules will be added soon.
          </AlertDescription>
        </Alert>

        {modulesWithConfigurableFeatures.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Settings2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Configurable Features</h3>
              <p className="text-muted-foreground">
                The enabled modules don't have configurable features yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Module List */}
            <div className="col-span-3">
              <Card>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {modulesWithConfigurableFeatures.map((sm) => (
                      <button
                        key={sm.module_id}
                        onClick={() => setActiveModule(sm.module_id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-colors",
                          activeModule === sm.module_id
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <span>{sm.module.name}</span>
                        {activeModule === sm.module_id && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Features Config */}
            <div className="col-span-9">
              {modulesWithConfigurableFeatures.map((sm) => (
                activeModule === sm.module_id && (
                  <ModuleFeaturesConfig
                    key={sm.module_id}
                    moduleId={sm.module_id}
                    moduleName={sm.module.name}
                  />
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
