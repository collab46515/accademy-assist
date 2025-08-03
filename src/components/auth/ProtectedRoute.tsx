import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC, AppRole, ResourceType, PermissionType } from '@/hooks/useRBAC';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: AppRole;
  requiredResource?: ResourceType;
  requiredPermission?: PermissionType;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  requiredResource,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { loading: rbacLoading, hasRole, hasPermission, currentSchool } = useRBAC();
  const location = useLocation();

  const loading = authLoading || rbacLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole, currentSchool?.id)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check resource and permission requirement
  if (requiredResource && requiredPermission) {
    // This is async, so we need to handle it differently
    // For now, we'll just render the children and let the component handle permission checking
    // A better approach would be to use a permission provider
  }

  return <>{children}</>;
}

// Hook for permission-based rendering
export function usePermissionCheck() {
  const { hasPermission } = useRBAC();

  const checkPermission = async (
    resource: ResourceType,
    permission: PermissionType,
    schoolId?: string
  ): Promise<boolean> => {
    return await hasPermission(resource, permission, schoolId);
  };

  return { checkPermission };
}