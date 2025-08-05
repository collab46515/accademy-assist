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
import { Loader2, Plus, UserPlus, Edit, Trash2, Users } from 'lucide-react';
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
      // Use regular signup instead of admin API
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success", 
        description: `User ${email} created successfully. They will receive a confirmation email.`,
      });

      setCreateUserOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
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
        
        <div className="flex gap-2">
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
                  Create a new user account in the system
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
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
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