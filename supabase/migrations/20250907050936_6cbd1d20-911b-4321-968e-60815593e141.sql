-- Add missing Administration modules to the modules table
INSERT INTO modules (name, description, route, icon, category, is_active, sort_order) VALUES
  ('School Settings', 'Configure school-specific settings and preferences', '/school-settings', 'Building', 'Administration', true, 170),
  ('User Management', 'Manage system users and their access', '/user-management', 'UserCog', 'Administration', true, 171),
  ('System Settings', 'Configure system-wide settings and parameters', '/admin-management', 'Settings', 'Administration', true, 173),
  ('Master Data', 'Manage master data and reference tables', '/master-data', 'Database', 'Administration', true, 174),
  ('Data Integrity Test', 'Test and validate data integrity', '/data-integrity-test', 'CheckCircle', 'Administration', true, 175),
  ('Technical Docs', 'Access technical documentation', '/technical-docs', 'FileText', 'Administration', true, 176),
  ('Integrations', 'Manage system integrations', '/integrations', 'Globe', 'Administration', true, 177),
  ('Portals', 'Access external portals and services', '/portals', 'ExternalLink', 'Administration', true, 178)
ON CONFLICT (route) DO NOTHING;

-- Grant view permissions for school admins and super admins on these modules
INSERT INTO role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'school_admin'::app_role,
  m.id,
  true,
  true,
  true,
  true,
  true
FROM modules m 
WHERE m.category = 'Administration'
  AND m.name IN ('School Settings', 'System Settings', 'Master Data', 'Data Integrity Test', 'Technical Docs', 'Integrations', 'Portals')
ON CONFLICT (role, module_id) DO NOTHING;

-- Grant permissions for super admin on all administration modules
INSERT INTO role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'super_admin'::app_role,
  m.id,
  true,
  true,
  true,
  true,
  true
FROM modules m 
WHERE m.category = 'Administration'
ON CONFLICT (role, module_id) DO NOTHING;