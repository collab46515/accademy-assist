-- Fix corrupted school_admin permissions where toggle bug reset can_view to false
-- Set can_view to true for all school_admin module permissions (admins should be able to view all modules)
UPDATE public.role_module_permissions
SET can_view = true,
    can_edit = true,
    can_delete = true,
    can_approve = true,
    updated_at = now()
WHERE role = 'school_admin';
