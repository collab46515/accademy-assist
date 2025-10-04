import React from 'react';
import { useSchoolModules } from '@/hooks/useSchoolModules';
import { useRBAC } from '@/hooks/useRBAC';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';

interface ModuleGuardProps {
  moduleName: string;
  children: React.ReactNode;
}

/**
 * ModuleGuard - Wraps module pages to ensure they're only accessible when enabled
 * 
 * Usage:
 * <ModuleGuard moduleName="Transport Management">
 *   <YourModuleComponent />
 * </ModuleGuard>
 */
export const ModuleGuard: React.FC<ModuleGuardProps> = ({ moduleName, children }) => {
  const { currentSchool } = useRBAC();
  const { isModuleEnabled, loading } = useSchoolModules(currentSchool?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isModuleEnabled(moduleName)) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Module Not Enabled
            </CardTitle>
            <CardDescription>
              The {moduleName} module is not enabled for your school.
              Please contact your administrator to enable this feature.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
