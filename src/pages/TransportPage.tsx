import React from 'react';
import { TransportDashboard } from '@/components/transport/TransportDashboard';
import { useSchoolModules } from '@/hooks/useSchoolModules';
import { useRBAC } from '@/hooks/useRBAC';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const TransportPage = () => {
  const { currentSchool } = useRBAC();
  const { isModuleEnabled, loading } = useSchoolModules(currentSchool?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isModuleEnabled('Transport Management')) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Module Not Enabled
            </CardTitle>
            <CardDescription>
              The Transport Management module is not enabled for your school.
              Please contact your administrator to enable this feature.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <TransportDashboard />;
};

export default TransportPage;