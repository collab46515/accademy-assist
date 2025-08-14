import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

export function LoginRedirectHandler() {
  const { user } = useAuth();
  const { userRoles, loading, isSuperAdmin, isSchoolAdmin } = useRBAC();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || loading) return;

    // Wait a moment for roles to load
    const redirectTimer = setTimeout(() => {
      // Super admin or school admin - go to management portal
      if (isSuperAdmin() || isSchoolAdmin()) {
        navigate('/portals');
        return;
      }

      // Get the user's primary role
      const primaryRole = userRoles[0]?.role;

      switch (primaryRole) {
        case 'teacher':
        case 'hod':
          navigate('/portals');
          break;
        case 'parent':
          navigate('/portals');
          break;
        case 'student':
          navigate('/portals');
          break;
        default:
          // Fallback to dashboard if role is unclear
          navigate('/dashboard');
      }
    }, 500);

    return () => clearTimeout(redirectTimer);
  }, [user, userRoles, loading, navigate, isSuperAdmin, isSchoolAdmin]);

  return null; // This component doesn't render anything
}