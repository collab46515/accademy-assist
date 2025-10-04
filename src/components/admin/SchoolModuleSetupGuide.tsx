import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Info, Database, Globe, Settings } from 'lucide-react';

export function SchoolModuleSetupGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Multi-Tenant Setup Guide
        </CardTitle>
        <CardDescription>
          Complete these steps to configure your multi-tenant school system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Database Setup */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0">1</Badge>
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Initialize School Modules
            </h3>
          </div>
          <Alert>
            <AlertDescription>
              <p className="mb-2">For each school, create initial module records in the database:</p>
              <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
{`-- Example: Enable modules for a school
INSERT INTO school_modules (school_id, module_id, is_enabled)
SELECT 
  'your-school-id-here'::uuid,
  id,
  true -- Enable all modules initially
FROM modules
WHERE is_active = true;`}
              </code>
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 2: Custom Domain */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0">2</Badge>
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Set Custom Domain
            </h3>
          </div>
          <Alert>
            <AlertDescription>
              <p className="mb-2">Add custom domain to your school record:</p>
              <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
{`-- Example: Set custom domain for a school
UPDATE schools
SET custom_domain = 'oakwood-school.com'
WHERE id = 'your-school-id-here';`}
              </code>
              <p className="mt-2 text-xs text-muted-foreground">
                💡 In production, you'll point the DNS A record of <code>oakwood-school.com</code> to your app's IP address
              </p>
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 3: Configure Modules */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0">3</Badge>
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configure Modules (UI)
            </h3>
          </div>
          <Alert>
            <AlertDescription>
              <p>Use the <strong>Module Configuration</strong> section above to:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                <li>Enable/disable modules per school</li>
                <li>Configure module-specific workflows</li>
                <li>Customize settings for each module</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        {/* Step 4: Test */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0">4</Badge>
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Test Multi-Tenancy
            </h3>
          </div>
          <Alert>
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p><strong>Testing Locally:</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>The system will detect your school based on domain</li>
                  <li>In development, it falls back to the first active school</li>
                  <li>Super admins see ALL modules regardless of school config</li>
                  <li>Regular users only see enabled modules for their school</li>
                </ul>
                
                <p className="mt-3"><strong>Testing Domain Detection:</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Log in as a non-super-admin user</li>
                  <li>Check the sidebar - should only show enabled modules</li>
                  <li>Toggle modules in the configuration above</li>
                  <li>Refresh - sidebar should update accordingly</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            How Multi-Tenancy Works
          </h4>
          <div className="text-sm space-y-2">
            <p><strong>1. Domain Detection:</strong> App identifies school from URL (e.g., <code>oakwood.com</code>)</p>
            <p><strong>2. Module Filtering:</strong> Only enabled modules appear in sidebar</p>
            <p><strong>3. Data Isolation:</strong> All database queries filter by <code>school_id</code></p>
            <p><strong>4. Workflow Customization:</strong> Each school can have custom workflows per module</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
