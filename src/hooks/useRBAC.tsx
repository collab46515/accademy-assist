import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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

interface RBACContextType {
  userRoles: UserRole[];
  schools: School[];
  currentSchool: School | null;
  loading: boolean;
  hasRole: (role: AppRole, schoolId?: string) => boolean;
  hasPermission: (resource: ResourceType, permission: PermissionType, schoolId?: string) => Promise<boolean>;
  isSuperAdmin: () => boolean;
  isSchoolAdmin: (schoolId?: string) => boolean;
  getCurrentSchoolRoles: () => UserRole[];
  switchSchool: (school: School) => void;
  fetchUserData: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: ReactNode }) {
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
      
      // Check for stored school preference
      const storedSchoolId = localStorage.getItem('currentSchoolId');
      const storedSchool = schoolsList.find(s => s.id === storedSchoolId);
      
      // Set current school: prefer stored, then first in list
      if (storedSchool) {
        console.log('📍 Restoring school from localStorage:', storedSchool.name);
        setCurrentSchool(storedSchool);
      } else if (schoolsList.length > 0 && !currentSchool) {
        console.log('📍 Setting first school as current:', schoolsList[0].name);
        setCurrentSchool(schoolsList[0]);
        localStorage.setItem('currentSchoolId', schoolsList[0].id);
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
    console.log('🔄 useRBAC.switchSchool called with:', school);
    console.log('🔄 Current school before switch:', currentSchool?.name, 'ID:', currentSchool?.id);
    
    // Create a new object to force React to detect the change
    const newSchool = { ...school };
    setCurrentSchool(newSchool);
    
    // Store in localStorage for persistence
    localStorage.setItem('currentSchoolId', school.id);
    console.log('✅ School switched to:', school.name, '- Stored in localStorage');
    console.log('✅ New currentSchool state should be:', school.name, 'ID:', school.id);
  };

  const value: RBACContextType = {
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

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}