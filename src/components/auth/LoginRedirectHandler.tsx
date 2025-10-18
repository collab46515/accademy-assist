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

    console.log('🔄 LoginRedirectHandler:', {
      user: user.email,
      userRoles: userRoles?.map(r => r.role),
      isSuperAdmin: isSuperAdmin(),
      isSchoolAdmin: isSchoolAdmin(),
      loading
    });

    // Wait a moment for roles to load
    const redirectTimer = setTimeout(() => {
      // Super admin or school admin - go to management portal
      if (isSuperAdmin() || isSchoolAdmin()) {
        console.log('✅ Redirecting Super Admin/School Admin to /portals');
        navigate('/portals');
        return;
      }

      // Get the user's primary role
      const primaryRole = userRoles[0]?.role;

      console.log('📍 Redirecting based on primary role:', primaryRole);

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
          console.warn('⚠️ No role found, redirecting to dashboard');
          navigate('/dashboard');
      }
    }, 500);

    return () => clearTimeout(redirectTimer);
  }, [user, userRoles, loading, navigate, isSuperAdmin, isSchoolAdmin]);

  return null; // This component doesn't render anything
}