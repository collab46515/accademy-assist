import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, Shield, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppRole } from '@/hooks/useRBAC';

const CURRENT_ROLES: { value: AppRole; label: string; description: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }[] = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full system access with all permissions', color: 'destructive' },
  { value: 'school_admin', label: 'School Admin', description: 'School-wide management and administration', color: 'default' },
  { value: 'teacher', label: 'Teacher', description: 'Classroom management and student records', color: 'secondary' },
  { value: 'hod', label: 'Head of Department', description: 'Department oversight and curriculum management', color: 'outline' },
  { value: 'parent', label: 'Parent', description: 'Access to child-related information and communication', color: 'outline' },
  { value: 'student', label: 'Student', description: 'Personal academic data and assignments', color: 'outline' },
  { value: 'nurse', label: 'Nurse', description: 'Medical and health records management', color: 'secondary' },
  { value: 'dsl', label: 'Safeguarding Lead', description: 'Student welfare and safety oversight', color: 'default' },
  { value: 'ta', label: 'Teaching Assistant', description: 'Support teaching activities and student assistance', color: 'outline' }
];

interface NewRoleForm {
  name: string;
  description: string;
}

export function RoleManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<NewRoleForm>({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    setLoading(true);
    try {
      // Note: In a real implementation, you would need to:
      // 1. Add the new role to the enum type in the database
      // 2. Update the TypeScript types
      // 3. Create default permissions for the new role
      
      toast.info('Role creation requires database schema update. Contact system administrator.');
      setIsCreateDialogOpen(false);
      setNewRole({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (role: AppRole) => {
    if (role === 'super_admin') {
      toast.error('Cannot delete Super Admin role');
      return;
    }

    // Note: In a real implementation, you would need to:
    // 1. Check if any users have this role
    // 2. Remove the role from the enum type
    // 3. Clean up associated permissions
    
    toast.info('Role deletion requires careful database cleanup. Contact system administrator.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Management
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Add a new role to the system. This will require database schema updates.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="e.g., Library Staff"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role-description">Description</Label>
                    <Textarea
                      id="role-description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Describe the role's responsibilities and scope"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Role'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage system roles and their configurations. New roles require database schema updates.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CURRENT_ROLES.map((role) => (
          <Card key={role.value} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={role.color} className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {role.label}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toast.info('Role editing requires schema updates')}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  {role.value !== 'super_admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRole(role.value)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Role ID:</span>
                  <code className="bg-muted px-1 rounded">{role.value}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy</CardTitle>
          <CardDescription>
            Understanding the permission hierarchy between roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
              <Badge variant="destructive">Super Admin</Badge>
              <span className="text-sm">Highest level - Full system access</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <Badge>School Admin</Badge>
              <span className="text-sm">School-wide management</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
              <Badge variant="secondary">HOD / DSL / Nurse</Badge>
              <span className="text-sm">Specialized department roles</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Badge variant="outline">Teacher / TA</Badge>
              <span className="text-sm">Educational staff</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Badge variant="outline">Parent / Student</Badge>
              <span className="text-sm">End users</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}