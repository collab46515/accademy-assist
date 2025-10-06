import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ModuleFeaturesConfig } from '@/components/admin/ModuleFeaturesConfig';
import { Settings2, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSchoolFilter } from '@/hooks/useSchoolFilter';
import { useSchoolModules } from '@/hooks/useSchoolModules';
import { cn } from '@/lib/utils';

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

      <div className="p-6 max-w-7xl mx-auto">
        {enabledModules.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Settings2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Modules Enabled</h3>
              <p className="text-muted-foreground">
                Enable modules first before configuring their features.
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
                    {enabledModules.map((sm) => (
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
              {enabledModules.map((sm) => (
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
