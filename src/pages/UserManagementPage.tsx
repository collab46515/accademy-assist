import { useState, useEffect } from 'react';
import { useRBAC, AppRole } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, UserPlus, Edit, Trash2, Users, Shield, Settings, Key, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string; // Add user_id field
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_active: boolean;
}

interface UserRole {
  id: string;
  role: AppRole;
  school_id: string;
  department?: string;
  year_group?: string;
  school_name: string;
  is_active: boolean;
}

const roleOptions: { value: AppRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'school_admin', label: 'School Admin' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'form_tutor', label: 'Form Tutor' },
  { value: 'dsl', label: 'DSL (Designated Safeguarding Lead)' },
  { value: 'nurse', label: 'School Nurse' },
  { value: 'hod', label: 'Head of Department' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' }
];

export function UserManagementPage() {
  const { schools, currentSchool, isSuperAdmin, isSchoolAdmin } = useRBAC();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({});
  const [loading, setLoading] = useState(true);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');

  const anySuperAdmin = Object.values(userRoles).some((roles) => roles.some(r => r.role === 'super_admin' && r.is_active));

  const bootstrapDominic = async () => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: 'dominic@pappayacloud.com',
          first_name: 'Dominic',
          last_name: 'Smith',
          password: 'TempPass123!',
          bootstrap: true,
        },
      });
      if (error) throw error;
      const tempPassword = (data as any)?.temp_password || 'TempPass123!';
      toast({ title: 'Super Admin Bootstrapped', description: `Created. Temporary password: ${tempPassword}` });
      fetchUsers();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to bootstrap super admin', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentSchool]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all users (profiles)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch user roles with school information
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          school_id,
          department,
          year_group,
          is_active,
          schools!inner(name)
        `)
        .eq('is_active', true);

      if (rolesError) throw rolesError;

      // Group roles by user_id
      const rolesByUser: Record<string, UserRole[]> = {};
      rolesData?.forEach(role => {
        if (!rolesByUser[role.user_id]) {
          rolesByUser[role.user_id] = [];
        }
        rolesByUser[role.user_id].push({
          id: role.id,
          role: role.role as AppRole,
          school_id: role.school_id,
          department: role.department,
          year_group: role.year_group,
          school_name: (role.schools as any).name,
          is_active: role.is_active
        });
      });

      setUsers(usersData || []);
      setUserRoles(rolesByUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        },
      });

      if (error) throw error;

      const tempPassword = (data as any)?.temp_password || password;

      toast({
        title: 'User Created',
        description: `User ${email} created. Temporary password: ${tempPassword}`,
      });

      setCreateUserOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };
  const assignRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    const role = formData.get('role') as AppRole;
    const schoolId = formData.get('schoolId') as string;
    const department = formData.get('department') as string;
    const yearGroup = formData.get('yearGroup') as string;

    console.log('Attempting to assign role:', {
      user_id: selectedUserId,
      role,
      school_id: schoolId,
      department: department || null,
      year_group: yearGroup || null
    });

    try {
      // Check if user already has this role in this school
      const existingRoles = userRoles[selectedUserId] || [];
      const duplicateRole = existingRoles.find(existingRole => 
        existingRole.role === role && 
        existingRole.school_id === schoolId &&
        existingRole.is_active === true
      );

      if (duplicateRole) {
        toast({
          title: "Role Already Assigned",
          description: `User already has the ${role.replace('_', ' ')} role in this school.`,
          variant: "destructive"
        });
        setIsCreating(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUserId,
          role,
          school_id: schoolId,
          department: department || null,
          year_group: yearGroup || null,
          is_active: true
        })
        .select();

      console.log('Role assignment result:', { data, error });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role assigned successfully",
      });

      setAssignRoleOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Role assignment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  if (!isSuperAdmin() && !isSchoolAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access user management.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage users and their roles across the system</p>
          </div>
        </div>
        
        {isSuperAdmin() && (
          <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Create a new user account (super admins only)
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!anySuperAdmin && (
        <Alert className="mb-6">
          <AlertDescription>
            No super admin found. Click to bootstrap dominic@pappayacloud.com as Super Admin.
          </AlertDescription>
          <div className="mt-3">
            <Button onClick={bootstrapDominic} disabled={isCreating}>Bootstrap Super Admin</Button>
          </div>
        </Alert>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('users')}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-muted-foreground">Create and manage user accounts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('roles')}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Crown className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">User Roles</h3>
              <p className="text-sm text-muted-foreground">Assign roles to users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('permissions')}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Permissions</h3>
              <p className="text-sm text-muted-foreground">Configure role permissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'roles'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Crown className="h-4 w-4 inline mr-2" />
          Role Management
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'permissions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Permissions
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>
              Manage user accounts and their role assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Created {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                     <TableCell>
                       <div className="flex flex-wrap gap-1">
                         {(userRoles[user.user_id] || []).map((role, index) => (
                           <Badge key={index} variant="secondary" className="text-xs">
                             {role.role.replace('_', ' ').toUpperCase()}
                             {role.school_name && ` @ ${role.school_name}`}
                           </Badge>
                         ))}
                         {(!userRoles[user.user_id] || userRoles[user.user_id].length === 0) && (
                           <Badge variant="outline">No roles assigned</Badge>
                         )}
                       </div>
                     </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUserId(user.user_id); // Use user_id instead of id
                            setAssignRoleOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Role
                        </Button>
                        <Button
                          size="sm"
                          variant={user.is_active ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          )}

          {/* Role Management Tab */}
          {activeTab === 'roles' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Available User Roles
                </CardTitle>
                <CardDescription>
                  These are the predefined roles available in the system. Use the "Assign Role" buttons to assign these roles to users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roleOptions.map((role) => (
                    <Card key={role.value} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {role.value === 'super_admin' && <Key className="h-4 w-4 text-primary" />}
                            {role.value === 'school_admin' && <Settings className="h-4 w-4 text-primary" />}
                            {role.value === 'teacher' && <Users className="h-4 w-4 text-primary" />}
                            {role.value === 'hod' && <Crown className="h-4 w-4 text-primary" />}
                            {role.value === 'dsl' && <Shield className="h-4 w-4 text-primary" />}
                            {!['super_admin', 'school_admin', 'teacher', 'hod', 'dsl'].includes(role.value) && (
                              <Users className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{role.label}</h4>
                            <Badge variant="outline" className="mt-1">
                              {role.value.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {role.value === 'super_admin' && 'Full system access across all schools'}
                          {role.value === 'school_admin' && 'Administrative access within assigned school'}
                          {role.value === 'teacher' && 'Teaching staff with classroom management access'}
                          {role.value === 'form_tutor' && 'Form tutor responsibilities and pastoral care'}
                          {role.value === 'hod' && 'Head of Department with subject leadership'}
                          {role.value === 'dsl' && 'Designated Safeguarding Lead responsibilities'}
                          {role.value === 'nurse' && 'School health and medical management'}
                          {role.value === 'parent' && 'Parent portal access for student information'}
                          {role.value === 'student' && 'Student portal access for learning resources'}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Users with this role:</span>
                            <span className="font-medium">
                              {Object.values(userRoles).flat().filter(r => r.role === role.value).length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">How to Assign Roles</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        1. Go to the "Users" tab<br/>
                        2. Find the user you want to assign a role to<br/>
                        3. Click the "+ Role" button in their row<br/>
                        4. Select the appropriate role and school from the dropdown
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Permissions Overview
                </CardTitle>
                <CardDescription>
                  View the permissions associated with each role in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {roleOptions.map((role) => (
                    <Card key={role.value} className="border border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {role.value === 'super_admin' && <Key className="h-4 w-4 text-primary" />}
                            {role.value === 'school_admin' && <Settings className="h-4 w-4 text-primary" />}
                            {role.value === 'teacher' && <Users className="h-4 w-4 text-primary" />}
                            {role.value === 'hod' && <Crown className="h-4 w-4 text-primary" />}
                            {role.value === 'dsl' && <Shield className="h-4 w-4 text-primary" />}
                            {!['super_admin', 'school_admin', 'teacher', 'hod', 'dsl'].includes(role.value) && (
                              <Users className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <CardTitle className="text-lg">{role.label}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {role.value === 'super_admin' && (
                            <>
                              <Badge variant="default">Full System Access</Badge>
                              <Badge variant="default">All Schools Management</Badge>
                              <Badge variant="default">User Management</Badge>
                              <Badge variant="default">System Configuration</Badge>
                            </>
                          )}
                          {role.value === 'school_admin' && (
                            <>
                              <Badge variant="secondary">School Management</Badge>
                              <Badge variant="secondary">User Management (School)</Badge>
                              <Badge variant="secondary">Academic Operations</Badge>
                              <Badge variant="secondary">Financial Management</Badge>
                              <Badge variant="secondary">Reports & Analytics</Badge>
                            </>
                          )}
                          {role.value === 'teacher' && (
                            <>
                              <Badge variant="outline">Classroom Management</Badge>
                              <Badge variant="outline">Gradebook Access</Badge>
                              <Badge variant="outline">Attendance Marking</Badge>
                              <Badge variant="outline">Assignment Creation</Badge>
                              <Badge variant="outline">Student Communication</Badge>
                            </>
                          )}
                          {role.value === 'hod' && (
                            <>
                              <Badge variant="secondary">Department Management</Badge>
                              <Badge variant="secondary">Curriculum Oversight</Badge>
                              <Badge variant="secondary">Teacher Supervision</Badge>
                              <Badge variant="secondary">Departmental Reports</Badge>
                            </>
                          )}
                          {role.value === 'dsl' && (
                            <>
                              <Badge variant="destructive">Safeguarding Access</Badge>
                              <Badge variant="destructive">Incident Management</Badge>
                              <Badge variant="destructive">Child Protection</Badge>
                              <Badge variant="destructive">Welfare Monitoring</Badge>
                            </>
                          )}
                          {role.value === 'parent' && (
                            <>
                              <Badge variant="outline">Student Information</Badge>
                              <Badge variant="outline">Academic Progress</Badge>
                              <Badge variant="outline">Communication</Badge>
                              <Badge variant="outline">Event Booking</Badge>
                            </>
                          )}
                          {role.value === 'student' && (
                            <>
                              <Badge variant="outline">Learning Resources</Badge>
                              <Badge variant="outline">Assignment Submission</Badge>
                              <Badge variant="outline">Timetable Access</Badge>
                              <Badge variant="outline">Grade Viewing</Badge>
                            </>
                          )}
                          {['form_tutor', 'nurse'].includes(role.value) && (
                            <>
                              <Badge variant="outline">Specialized Access</Badge>
                              <Badge variant="outline">Student Welfare</Badge>
                              <Badge variant="outline">Communication</Badge>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Alert className="mt-6">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> Permissions are automatically enforced based on user roles. 
                    Role-based access control (RBAC) ensures users only see and access features appropriate to their assigned roles.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Assign Role Dialog */}
      <Dialog open={assignRoleOpen} onOpenChange={setAssignRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a new role to the selected user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={assignRole} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schoolId">School</Label>
              <Select name="schoolId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name} ({school.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input id="department" name="department" placeholder="e.g., Mathematics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearGroup">Year Group (Optional)</Label>
                <Input id="yearGroup" name="yearGroup" placeholder="e.g., Year 7" />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Assign Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}