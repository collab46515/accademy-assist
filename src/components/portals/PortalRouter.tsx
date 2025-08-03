import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { ManagementPortal } from './ManagementPortal';
import { TeacherPortal } from './TeacherPortal';
import { ParentPortal } from './ParentPortal';
import { StudentPortal } from './StudentPortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

export function PortalRouter() {
  const { userRoles, loading, isSuperAdmin, isSchoolAdmin } = useRBAC();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Determine user type based on roles
  const getUserType = () => {
    if (isSuperAdmin() || isSchoolAdmin()) return 'management';
    
    // Check for teacher role
    const hasTeacherRole = userRoles.some(role => 
      ['teacher', 'hod'].includes(role.role)
    );
    if (hasTeacherRole) return 'teacher';
    
    // Check for parent role (would need to be defined in user_roles)
    const hasParentRole = userRoles.some(role => 
      role.role === 'parent'
    );
    if (hasParentRole) return 'parent';
    
    // Check for student role (would need to be defined in user_roles)
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
                <p className="text-muted-foreground">No roles assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render the appropriate portal
  switch (userType) {
    case 'management':
      return <ManagementPortal />;
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