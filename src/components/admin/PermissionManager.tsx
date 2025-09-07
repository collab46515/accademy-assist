import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
import { AppRole } from '@/hooks/useRBAC';
import { toast } from 'sonner';
import { 
  Shield, 
  Users, 
  Eye, 
  Plus, 
  Edit, 
  Trash, 
  CheckCircle,
  Settings,
  FileText
} from 'lucide-react';

const ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full system access' },
  { value: 'school_admin', label: 'School Admin', description: 'School-wide management' },
  { value: 'teacher', label: 'Teacher', description: 'Classroom and student management' },
  { value: 'hod', label: 'Head of Department', description: 'Department oversight' },
  { value: 'parent', label: 'Parent', description: 'Child-related information' },
  { value: 'student', label: 'Student', description: 'Personal academic data' },
  { value: 'nurse', label: 'Nurse', description: 'Medical and health records' },
  { value: 'dsl', label: 'Safeguarding Lead', description: 'Student welfare and safety' },
  { value: 'ta', label: 'Teaching Assistant', description: 'Support teaching activities' }
];

const PERMISSION_TYPES = [
  { key: 'can_view', label: 'View', icon: Eye, description: 'Can view/read data' },
  { key: 'can_create', label: 'Create', icon: Plus, description: 'Can create new records' },
  { key: 'can_edit', label: 'Edit', icon: Edit, description: 'Can modify existing data' },
  { key: 'can_delete', label: 'Delete', icon: Trash, description: 'Can delete records' },
  { key: 'can_approve', label: 'Approve', icon: CheckCircle, description: 'Can approve/reject items' }
] as const;

export function PermissionManager() {
  const { 
    modules, 
    rolePermissions, 
    loading, 
    updateRolePermission,
    refetch 
  } = usePermissions();
  
  const [selectedRole, setSelectedRole] = useState<AppRole>('teacher');
  const [updating, setUpdating] = useState<string | null>(null);

  const handlePermissionChange = async (
    role: AppRole,
    moduleId: string,
    permissionType: string,
    value: boolean
  ) => {
    const updateKey = `${role}-${moduleId}-${permissionType}`;
    setUpdating(updateKey);

    try {
      await updateRolePermission(role, moduleId, {
        [permissionType]: value
      });
      
      toast.success('Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    } finally {
      setUpdating(null);
    }
  };

  const getRolePermission = (role: AppRole, moduleId: string) => {
    return rolePermissions.find(p => p.role === role && p.module_id === moduleId);
  };

  const groupModulesByCategory = () => {
    const grouped = modules.reduce((acc, module) => {
      const category = module.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(module);
      return acc;
    }, {} as Record<string, typeof modules>);

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading permissions...</p>
        </div>
      </div>
    );
  }

  const groupedModules = groupModulesByCategory();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role-Based Access Control (RBAC)
          </CardTitle>
          <CardDescription>
            Configure module permissions for each user role. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-2">
          {ROLES.map((role) => (
            <TabsTrigger 
              key={role.value} 
              value={role.value}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <span className="font-medium">{role.label}</span>
              <span className="text-xs text-muted-foreground hidden lg:block">
                {role.description}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {ROLES.map((role) => (
          <TabsContent key={role.value} value={role.value} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {role.label} Permissions
                </CardTitle>
                <CardDescription>
                  {role.description} - Configure what this role can access and do
                </CardDescription>
              </CardHeader>
            </Card>

            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {category} Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryModules.map((module) => {
                      const permission = getRolePermission(role.value, module.id);
                      
                      return (
                        <div key={module.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-primary/10">
                                <Settings className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium">{module.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{module.route}</Badge>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {PERMISSION_TYPES.map((permType) => {
                              const Icon = permType.icon;
                              const isChecked = permission?.[permType.key as keyof typeof permission] || false;
                              const isUpdating = updating === `${role.value}-${module.id}-${permType.key}`;
                              
                              return (
                                <div key={permType.key} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${role.value}-${module.id}-${permType.key}`}
                                    checked={isChecked as boolean}
                                    disabled={isUpdating}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(
                                        role.value,
                                        module.id,
                                        permType.key,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${role.value}-${module.id}-${permType.key}`}
                                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    <Icon className="h-3 w-3" />
                                    {permType.label}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}