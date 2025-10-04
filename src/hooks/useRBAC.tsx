import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 
  | 'super_admin'
  | 'school_admin' 
  | 'teacher'
  | 'form_tutor'
  | 'dsl'
  | 'nurse'
  | 'hod'
  | 'parent'
  | 'student'
  | 'ta';

export type ResourceType = 
  | 'students'
  | 'grades'
  | 'attendance'
  | 'medical_records'
  | 'safeguarding_logs'
  | 'financial_data'
  | 'reports'
  | 'staff_management'
  | 'system_settings'
  | 'communications'
  | 'timetables'
  | 'admissions';

export type PermissionType = 'read' | 'write' | 'delete' | 'approve' | 'escalate';

interface UserRole {
  role: AppRole;
  school_id: string | null;
  department?: string;
  year_group?: string;
  is_active: boolean;
}

interface School {
  id: string;
  name: string;
  code: string;
}

export function useRBAC() {
  const { user, loading: authLoading } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      fetchUserData();
    } else {
      setUserRoles([]);
      setSchools([]);
      setCurrentSchool(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role,
          school_id,
          department,
          year_group
        `)
        .eq('user_id', user!.id)
        .eq('is_active', true);

      if (rolesError) throw rolesError;

      const roles: UserRole[] = rolesData?.map(item => ({
        role: item.role as AppRole,
        school_id: item.school_id,
        department: item.department,
        year_group: item.year_group,
        is_active: true,
      })) || [];

      setUserRoles(roles);

      // Check if user is super admin
      const isSuperAdminUser = roles.some(role => role.role === 'super_admin');

      let schoolsList: School[] = [];

      if (isSuperAdminUser) {
        // Super admins see ALL schools
        const { data: allSchools, error: schoolsError } = await supabase
          .from('schools')
          .select('id, name, code')
          .order('name');

        if (schoolsError) throw schoolsError;
        schoolsList = allSchools || [];
      } else {
        // Regular users only see schools they're assigned to
        const schoolIds = [...new Set(roles.map(r => r.school_id).filter(Boolean))];
        
        if (schoolIds.length > 0) {
          const { data: userSchools, error: schoolsError } = await supabase
            .from('schools')
            .select('id, name, code')
            .in('id', schoolIds)
            .order('name');

          if (schoolsError) throw schoolsError;
          schoolsList = userSchools || [];
        }
      }

      setSchools(schoolsList);
      
      // Set current school to first school if none selected
      if (schoolsList.length > 0 && !currentSchool) {
        setCurrentSchool(schoolsList[0]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole, schoolId?: string): boolean => {
    return userRoles.some(userRole => 
      userRole.role === role && 
      (schoolId ? userRole.school_id === schoolId : true)
    );
  };

  const hasPermission = async (
    resource: ResourceType, 
    permission: PermissionType, 
    schoolId?: string
  ): Promise<boolean> => {
    if (!user || !currentSchool) return false;

    const targetSchoolId = schoolId || currentSchool.id;

    try {
      const { data, error } = await supabase.rpc('has_permission', {
        user_uuid: user.id,
        school_uuid: targetSchoolId,
        resource,
        permission
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  const isSchoolAdmin = (schoolId?: string): boolean => {
    return hasRole('school_admin', schoolId);
  };

  const getCurrentSchoolRoles = (): UserRole[] => {
    // Super admin roles (school_id is null) should always be shown
    const superAdminRoles = userRoles.filter(role => 
      role.role === 'super_admin' && role.is_active
    );
    
    // If no current school, just return super admin roles
    if (!currentSchool) return superAdminRoles;
    
    // Return school-specific roles plus super admin roles
    const schoolSpecificRoles = userRoles.filter(role => 
      role.school_id === currentSchool.id && role.is_active
    );
    
    return [...superAdminRoles, ...schoolSpecificRoles];
  };

  const switchSchool = (school: School) => {
    setCurrentSchool(school);
  };

  return {
    userRoles,
    schools,
    currentSchool,
    loading: loading || authLoading,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isSchoolAdmin,
    getCurrentSchoolRoles,
    switchSchool,
    fetchUserData,
  };
}