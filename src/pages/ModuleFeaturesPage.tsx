import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleFeaturesConfig } from '@/components/admin/ModuleFeaturesConfig';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Settings2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';
import { useSchoolModules } from '@/hooks/useSchoolModules';

export default function ModuleFeaturesPage() {
  const navigate = useNavigate();
  const { currentSchool } = useSchoolFilter();
  const { modules: schoolModules, loading } = useSchoolModules(currentSchool?.id);
  const [activeModule, setActiveModule] = useState<string>('');

  useEffect(() => {
    if (schoolModules.length > 0 && !activeModule) {
      setActiveModule(schoolModules[0].module_id);
    }
  }, [schoolModules]);

  const enabledModules = schoolModules.filter(sm => sm.is_enabled);

  console.log('📋 ModuleFeaturesPage:', {
    schoolId: currentSchool?.id,
    schoolName: currentSchool?.name,
    totalModules: schoolModules.length,
    enabledModules: enabledModules.length,
    activeModule,
    modulesList: enabledModules.map(m => ({ id: m.module_id, name: m.module.name }))
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <PageHeader
        title="Module Features Configuration"
        description={`Configure sub-features for ${currentSchool?.name || 'your school'}`}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin/schools" },
          { label: "Module Features" }
        ]}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Each module can have configurable sub-features. Enable only the features
            your school needs to keep the interface clean and focused.
          </AlertDescription>
        </Alert>

        {enabledModules.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Settings2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Modules Enabled</h3>
              <p className="text-muted-foreground mb-4">
                Enable modules first before configuring their features.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <Tabs value={activeModule} onValueChange={setActiveModule}>
              <CardContent className="p-6">
                <TabsList className="grid w-full gap-2" style={{
                  gridTemplateColumns: `repeat(${Math.min(enabledModules.length, 4)}, minmax(0, 1fr))`
                }}>
                  {enabledModules.map((sm) => (
                    <TabsTrigger
                      key={sm.module_id}
                      value={sm.module_id}
                      className="text-sm"
                    >
                      {sm.module.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="mt-6">
                  {enabledModules.map((sm) => (
                    <TabsContent key={sm.module_id} value={sm.module_id}>
                      <ModuleFeaturesConfig
                        moduleId={sm.module_id}
                        moduleName={sm.module.name}
                      />
                    </TabsContent>
                  ))}
                </div>
              </CardContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}
