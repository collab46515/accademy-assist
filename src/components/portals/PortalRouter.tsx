import React, { useState } from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { useAuth } from '@/hooks/useAuth';
import { ManagementPortal } from './ManagementPortal';
import { TeacherPortal } from './TeacherPortal';
import { ParentPortal } from './ParentPortal';
import { StudentPortal } from './StudentPortal';
import { HODPortal } from './HODPortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, Users, GraduationCap, Home, User, Target, AlertTriangle } from 'lucide-react';

export function PortalRouter() {
  const { userRoles, loading, isSuperAdmin, isSchoolAdmin, currentSchool } = useRBAC();
  const { user, session } = useAuth();
  const [activePortal, setActivePortal] = useState('management');
  const [showDebug, setShowDebug] = useState(false);

  // TEMPORARY: Show current user email prominently
  if (user) {
    console.log('🚨 CURRENT USER:', user.email);
  }

  // Debug information
  const debugInfo = {
    user: user ? { id: user.id, email: user.email } : null,
    session: session ? { expires_at: session.expires_at } : null,
    userRoles: userRoles || [],
    currentSchool: currentSchool ? { id: currentSchool.id, name: currentSchool.name } : null,
    loading,
    isSuperAdmin: isSuperAdmin(),
    isSchoolAdmin: isSchoolAdmin()
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your portal...</p>
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg max-w-md mx-auto">
            <p className="text-red-800 font-medium">🚨 CURRENT USER: {user?.email || 'No user'}</p>
            <p className="text-sm text-red-600 mt-1">If this is not "test.parent@pappaya.academy", you need to log out and login correctly!</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </Button>
          {showDebug && (
            <Card className="mt-4 max-w-lg mx-auto text-left">
              <CardContent className="pt-4">
                <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Add debug panel for troubleshooting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                You need to be logged in to access the portals. Please sign in first.
              </AlertDescription>
            </Alert>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </Button>
            {showDebug && (
              <div className="mt-4 p-4 bg-muted rounded">
                <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is admin (super admin or school admin)
  // Temporary fix: explicitly check roles instead of using RBAC functions
  const hasAdminRole = userRoles.some(role => 
    role.role === 'super_admin' || role.role === 'school_admin'
  );
  const isAdmin = hasAdminRole;
  
  console.log('🔍 Admin Check:', {
    userEmail: user?.email,
    userRoles: userRoles.map(r => r.role),
    hasAdminRole,
    isAdmin
  });

  // If user is admin, show all portals with tabs
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Portal Manager</h1>
                <p className="text-sm text-muted-foreground">
                  Access and manage all portal experiences
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Shield className="h-4 w-4" />
              Administrator
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activePortal} onValueChange={setActivePortal} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Management
              </TabsTrigger>
              <TabsTrigger value="hod" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                HOD View
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teacher View
              </TabsTrigger>
              <TabsTrigger value="parent" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Parent View
              </TabsTrigger>
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="management" className="mt-0">
              <ManagementPortal />
            </TabsContent>

            <TabsContent value="hod" className="mt-0">
              <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Preview Mode:</strong> This is how the portal appears to Heads of Department
                </p>
              </div>
              <HODPortal />
            </TabsContent>

            <TabsContent value="teacher" className="mt-0">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Preview Mode:</strong> This is how the portal appears to teachers
                </p>
              </div>
              <TeacherPortal />
            </TabsContent>

            <TabsContent value="parent" className="mt-0">
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Preview Mode:</strong> This is how the portal appears to parents
                </p>
              </div>
              <ParentPortal />
            </TabsContent>

            <TabsContent value="student" className="mt-0">
              <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  <strong>Preview Mode:</strong> This is how the portal appears to students
                </p>
              </div>
              <StudentPortal />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // For non-admin users, determine their specific portal
  const getUserType = () => {
    // Check for HOD role
    const hasHODRole = userRoles.some(role => 
      role.role === 'hod'
    );
    if (hasHODRole) return 'hod';
    
    // Check for teacher role
    const hasTeacherRole = userRoles.some(role => 
      ['teacher'].includes(role.role)
    );
    if (hasTeacherRole) return 'teacher';
    
    // Check for parent role
    const hasParentRole = userRoles.some(role => 
      role.role === 'parent'
    );
    if (hasParentRole) return 'parent';
    
    // Check for student role
    const hasStudentRole = userRoles.some(role => 
      role.role === 'student'
    );
    if (hasStudentRole) return 'student';
    
    return null;
  };

  const userType = getUserType();

  // If no specific role is found, show role selection or access denied
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Unable to determine your portal access level. Please contact your system administrator to assign appropriate roles.
            </AlertDescription>
          </Alert>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Current Roles</CardTitle>
            </CardHeader>
            <CardContent>
              {userRoles.length > 0 ? (
                <div className="space-y-2">
                  {userRoles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded border">
                      <span className="font-medium capitalize">{role.role.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">
                        {role.department && `${role.department} - `}
                        {role.year_group && `${role.year_group} - `}
                        School ID: {role.school_id?.slice(0, 8)}...
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">No roles assigned</p>
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <AlertDescription className="text-orange-700">
                      <strong>Portal Access Issue:</strong> Your account doesn't have any roles assigned yet. 
                      This is normal for new accounts. Please contact your school administrator to:
                      <ul className="list-disc ml-4 mt-2">
                        <li>Assign you a student, parent, or staff role</li>
                        <li>Link you to the appropriate school</li>
                        <li>Set up your profile data</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </Button>
              {showDebug && (
                <div className="mt-4 p-4 bg-muted rounded">
                  <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render the appropriate portal for non-admin users
  switch (userType) {
    case 'hod':
      return <HODPortal />;
    case 'teacher':
      return <TeacherPortal />;
    case 'parent':
      return <ParentPortal />;
    case 'student':
      return <StudentPortal />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Access denied. Contact your administrator for portal access.
            </AlertDescription>
          </Alert>
        </div>
      );
  }
}