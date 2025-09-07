import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { PermissionManager } from '@/components/admin/PermissionManager';
import { RoleManager } from '@/components/admin/RoleManager';
import { useRBAC } from '@/hooks/useRBAC';
import { Shield, Users, Settings } from 'lucide-react';

export default function PermissionManagementPage() {
  const { isSuperAdmin, loading } = useRBAC();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Only Super Administrators can access permission management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Permission Management"
        description="Configure role-based access control and manage system permissions"
      />

      <Tabs defaultValue="permissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Module Permissions
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permissions">
          <PermissionManager />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}