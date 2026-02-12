import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from './useRBAC';
import { AppRole } from './useRBAC';

export interface Module {
  id: string;
  name: string;
  description?: string;
  route: string;
  icon?: string;
  category: string;
  is_active: boolean;
  sort_order?: number;
  parent_module_id?: string;
}

export interface RoleModulePermission {
  id: string;
  role: AppRole;
  module_id: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
  module?: Module;
}

export interface FieldPermission {
  id: string;
  role: AppRole;
  module_id: string;
  field_name: string;
  is_visible: boolean;
  is_editable: boolean;
  is_required: boolean;
}

export function usePermissions() {
  const { userRoles, currentSchool } = useRBAC();
  const [modules, setModules] = useState<Module[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RoleModulePermission[]>([]);
  const [fieldPermissions, setFieldPermissions] = useState<FieldPermission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all modules
  const fetchModules = async () => {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching modules:', error);
      return;
    }
    
    setModules(data || []);
  };

  // Fetch role permissions
  const fetchRolePermissions = async () => {
    const { data, error } = await supabase
      .from('role_module_permissions')
      .select(`
        *,
        module:modules(*)
      `);
    
    if (error) {
      console.error('Error fetching role permissions:', error);
      return;
    }
    
    setRolePermissions(data || []);
  };

  // Fetch field permissions
  const fetchFieldPermissions = async () => {
    const { data, error } = await supabase
      .from('field_permissions')
      .select('*');
    
    if (error) {
      console.error('Error fetching field permissions:', error);
      return;
    }
    
    setFieldPermissions(data || []);
  };

  // Update role permission
  const updateRolePermission = async (
    role: AppRole,
    moduleId: string,
    permissions: Partial<Pick<RoleModulePermission, 'can_view' | 'can_create' | 'can_edit' | 'can_delete' | 'can_approve'>>
  ) => {
    // Check if a record already exists
    const existing = rolePermissions.find(p => p.role === role && p.module_id === moduleId);
    
    if (existing) {
      // Update existing record by ID - most reliable approach
      const { error } = await supabase
        .from('role_module_permissions')
        .update({
          ...permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating role permission:', error);
        throw error;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('role_module_permissions')
        .insert({
          role,
          module_id: moduleId,
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_approve: false,
          ...permissions
        });

      if (error) {
        console.error('Error inserting role permission:', error);
        throw error;
      }
    }

    await fetchRolePermissions();
  };

  // Update field permission
  const updateFieldPermission = async (
    role: AppRole,
    moduleId: string,
    fieldName: string,
    permissions: Partial<Pick<FieldPermission, 'is_visible' | 'is_editable' | 'is_required'>>
  ) => {
    const { error } = await supabase
      .from('field_permissions')
      .upsert({
        role,
        module_id: moduleId,
        field_name: fieldName,
        ...permissions
      });

    if (error) {
      console.error('Error updating field permission:', error);
      throw error;
    }

    await fetchFieldPermissions();
  };

  // Check if user has permission for specific module and action
  const hasModulePermission = (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve'): boolean => {
    const module = modules.find(m => m.name === moduleName);
    if (!module) return false;

    // Super admins have all permissions
    if (userRoles.some(r => r.role === 'super_admin')) return true;

    const currentRoles = userRoles.filter(role => 
      !currentSchool || role.school_id === currentSchool.id || role.role === 'super_admin'
    );

    return currentRoles.some(userRole => {
      const permission = rolePermissions.find(p => 
        p.role === userRole.role && p.module_id === module.id
      );
      
      if (!permission) return false;

      switch (action) {
        case 'view': return permission.can_view;
        case 'create': return permission.can_create;
        case 'edit': return permission.can_edit;
        case 'delete': return permission.can_delete;
        case 'approve': return permission.can_approve;
        default: return false;
      }
    });
  };

  // Get user's accessible modules
  const getAccessibleModules = (): Module[] => {
    const currentRoles = userRoles.filter(role => 
      !currentSchool || role.school_id === currentSchool.id || role.role === 'super_admin'
    );

    // Super admins can access all active modules
    const isSuperAdminUser = currentRoles.some(r => r.role === 'super_admin');
    if (isSuperAdminUser) {
      return modules
        .filter(m => m.is_active)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    const accessibleModuleIds = new Set<string>();
    
    currentRoles.forEach(userRole => {
      rolePermissions
        .filter(p => p.role === userRole.role && p.can_view)
        .forEach(p => accessibleModuleIds.add(p.module_id));
    });

    return modules
      .filter(m => m.is_active && accessibleModuleIds.has(m.id))
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  // Check field permission
  const hasFieldPermission = (moduleName: string, fieldName: string, type: 'visible' | 'editable' | 'required'): boolean => {
    const module = modules.find(m => m.name === moduleName);
    if (!module) return false;

    const currentRoles = userRoles.filter(role => 
      !currentSchool || role.school_id === currentSchool.id || role.role === 'super_admin'
    );

    return currentRoles.some(userRole => {
      const permission = fieldPermissions.find(p => 
        p.role === userRole.role && 
        p.module_id === module.id && 
        p.field_name === fieldName
      );
      
      if (!permission) {
        // Default permissions if not explicitly set
        switch (type) {
          case 'visible': return true;
          case 'editable': return false;
          case 'required': return false;
        }
      }

      switch (type) {
        case 'visible': return permission.is_visible;
        case 'editable': return permission.is_editable;
        case 'required': return permission.is_required;
        default: return false;
      }
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchModules(),
        fetchRolePermissions(),
        fetchFieldPermissions()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    modules,
    rolePermissions,
    fieldPermissions,
    loading,
    updateRolePermission,
    updateFieldPermission,
    hasModulePermission,
    getAccessibleModules,
    hasFieldPermission,
    refetch: async () => {
      await Promise.all([
        fetchModules(),
        fetchRolePermissions(),
        fetchFieldPermissions()
      ]);
    }
  };
}