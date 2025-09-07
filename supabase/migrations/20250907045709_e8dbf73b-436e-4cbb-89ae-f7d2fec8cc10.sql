-- Create modules table for system modules
CREATE TABLE public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  route text NOT NULL,
  icon text,
  category text NOT NULL DEFAULT 'general',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  parent_module_id uuid REFERENCES public.modules(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(name),
  UNIQUE(route)
);

-- Create role permissions table for module-level permissions
CREATE TABLE public.role_module_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  can_view boolean NOT NULL DEFAULT false,
  can_create boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  can_approve boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, module_id)
);

-- Create field permissions table for field-level permissions
CREATE TABLE public.field_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  is_editable boolean NOT NULL DEFAULT false,
  is_required boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, module_id, field_name)
);

-- Enable RLS on all tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules
CREATE POLICY "Super admins can manage modules" 
ON public.modules 
FOR ALL 
USING (is_super_admin(auth.uid()));

CREATE POLICY "All authenticated users can view active modules" 
ON public.modules 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NOT NULL);

-- RLS Policies for role_module_permissions
CREATE POLICY "Super admins can manage role permissions" 
ON public.role_module_permissions 
FOR ALL 
USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can view role permissions" 
ON public.role_module_permissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for field_permissions
CREATE POLICY "Super admins can manage field permissions" 
ON public.field_permissions 
FOR ALL 
USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can view field permissions" 
ON public.field_permissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_role_module_permissions_updated_at
  BEFORE UPDATE ON public.role_module_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_field_permissions_updated_at
  BEFORE UPDATE ON public.field_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert system modules
INSERT INTO public.modules (name, description, route, icon, category, sort_order) VALUES
('Dashboard', 'Main dashboard overview', '/dashboard', 'LayoutDashboard', 'core', 1),
('Students', 'Student management and records', '/students', 'Users', 'academic', 2),
('Academics', 'Academic management', '/academics', 'BookOpen', 'academic', 3),
('Admissions', 'Student admissions workflow', '/admissions', 'UserPlus', 'admissions', 4),
('Attendance', 'Attendance tracking', '/attendance', 'Calendar', 'academic', 5),
('Assignments', 'Assignment management', '/assignments', 'FileText', 'academic', 6),
('Gradebook', 'Grade management', '/gradebook', 'Star', 'academic', 7),
('Curriculum', 'Curriculum planning', '/curriculum', 'BookOpen', 'academic', 8),
('Timetable', 'Timetable management', '/timetable', 'Clock', 'operations', 9),
('Communication', 'Communication tools', '/communication', 'MessageSquare', 'communication', 10),
('Fee Management', 'Fee collection and management', '/fee-management', 'CreditCard', 'finance', 11),
('Finance', 'Financial operations', '/finance', 'DollarSign', 'finance', 12),
('HR Management', 'Human resources', '/hr-management', 'Users', 'hr', 13),
('Staff', 'Staff management', '/staff', 'UserCheck', 'hr', 14),
('Transport', 'Transport management', '/transport', 'Bus', 'operations', 15),
('Library', 'Library management', '/library', 'Library', 'operations', 16),
('Infirmary', 'Medical records and health', '/infirmary', 'Heart', 'welfare', 17),
('Safeguarding', 'Student safeguarding', '/safeguarding', 'Shield', 'welfare', 18),
('Behavior Tracking', 'Student behavior management', '/behavior-tracking', 'AlertTriangle', 'welfare', 19),
('Activities', 'Extracurricular activities', '/activities', 'Trophy', 'activities', 20),
('Events', 'Event management', '/events', 'Calendar', 'activities', 21),
('Reports', 'Report generation', '/report-cards', 'FileBarChart', 'reports', 22),
('Analytics', 'Data analytics', '/analytics', 'BarChart3', 'reports', 23),
('AI Suite', 'AI-powered tools', '/ai-suite', 'Brain', 'ai', 24),
('Settings', 'System settings', '/school-settings', 'Settings', 'admin', 25),
('User Management', 'User and role management', '/user-management', 'Shield', 'admin', 26);

-- Create default permissions for existing roles
INSERT INTO public.role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'super_admin'::app_role,
  id,
  true,
  true,
  true,
  true,
  true
FROM public.modules;

-- School admin permissions (most modules but not user management)
INSERT INTO public.role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'school_admin'::app_role,
  id,
  true,
  CASE WHEN name IN ('User Management') THEN false ELSE true END,
  CASE WHEN name IN ('User Management') THEN false ELSE true END,
  CASE WHEN name IN ('User Management') THEN false ELSE true END,
  true
FROM public.modules;

-- Teacher permissions
INSERT INTO public.role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'teacher'::app_role,
  id,
  CASE WHEN name IN ('Dashboard', 'Students', 'Attendance', 'Assignments', 'Gradebook', 'Curriculum', 'Timetable', 'Communication', 'Reports') THEN true ELSE false END,
  CASE WHEN name IN ('Attendance', 'Assignments', 'Gradebook', 'Communication') THEN true ELSE false END,
  CASE WHEN name IN ('Attendance', 'Assignments', 'Gradebook', 'Communication', 'Students') THEN true ELSE false END,
  false,
  CASE WHEN name IN ('Assignments', 'Gradebook') THEN true ELSE false END
FROM public.modules;

-- Student permissions
INSERT INTO public.role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'student'::app_role,
  id,
  CASE WHEN name IN ('Dashboard', 'Assignments', 'Timetable', 'Communication') THEN true ELSE false END,
  CASE WHEN name IN ('Communication') THEN true ELSE false END,
  false,
  false,
  false
FROM public.modules;

-- Parent permissions
INSERT INTO public.role_module_permissions (role, module_id, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  'parent'::app_role,
  id,
  CASE WHEN name IN ('Dashboard', 'Students', 'Attendance', 'Assignments', 'Reports', 'Communication', 'Fee Management') THEN true ELSE false END,
  CASE WHEN name IN ('Communication') THEN true ELSE false END,
  false,
  false,
  false
FROM public.modules;