-- Create module_features table for sub-features within each module
CREATE TABLE IF NOT EXISTS public.module_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_key TEXT NOT NULL, -- Used in code (e.g., 'timeTracking', 'payroll')
  description TEXT,
  icon TEXT, -- Lucide icon name
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(module_id, feature_key)
);

-- Create school_module_features table to track enabled features per school
CREATE TABLE IF NOT EXISTS public.school_module_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.module_features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(school_id, feature_id)
);

-- Enable RLS
ALTER TABLE public.module_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_module_features ENABLE ROW LEVEL SECURITY;

-- Policies for module_features (readable by authenticated users)
CREATE POLICY "Users can view module features"
  ON public.module_features FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admins can manage module features"
  ON public.module_features FOR ALL
  USING (is_super_admin(auth.uid()));

-- Policies for school_module_features
CREATE POLICY "School staff can view their school's feature config"
  ON public.school_module_features FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = school_module_features.school_id
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "School admins can manage their school's features"
  ON public.school_module_features FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = school_module_features.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Insert HR sub-features
INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Employee Management',
  'employees',
  'Manage employee records and information',
  'Users',
  1
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Time & Attendance',
  'timeTracking',
  'Track employee hours and timesheets',
  'Timer',
  2
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Leave Management',
  'leave',
  'Manage employee leave requests',
  'Calendar',
  3
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Recruitment',
  'recruitment',
  'Job postings and candidate management',
  'UserPlus',
  4
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Performance Management',
  'performance',
  'Employee performance reviews and goals',
  'Target',
  5
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Training & Development',
  'training',
  'Training courses and employee development',
  'BookOpen',
  6
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Payroll',
  'payroll',
  'Payroll processing and salary management',
  'DollarSign',
  7
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Benefits',
  'benefits',
  'Employee benefits and compensation',
  'Award',
  8
FROM public.modules m WHERE m.name = 'HR Management'
ON CONFLICT (module_id, feature_key) DO NOTHING;

-- Insert Finance sub-features
INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'General Accounting',
  'accounting',
  'Chart of accounts and general ledger',
  'Calculator',
  1
FROM public.modules m WHERE m.name = 'Finance'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Budget Management',
  'budget',
  'Budget planning and variance analysis',
  'Target',
  2
FROM public.modules m WHERE m.name = 'Finance'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Vendor Management',
  'vendors',
  'Supplier and vendor relationship management',
  'Building2',
  3
FROM public.modules m WHERE m.name = 'Finance'
ON CONFLICT (module_id, feature_key) DO NOTHING;

INSERT INTO public.module_features (module_id, feature_name, feature_key, description, icon, sort_order)
SELECT 
  m.id,
  'Purchase Orders',
  'purchaseOrders',
  'Procurement and purchase management',
  'ShoppingCart',
  4
FROM public.modules m WHERE m.name = 'Finance'
ON CONFLICT (module_id, feature_key) DO NOTHING;

-- Add triggers for updated_at
CREATE TRIGGER update_module_features_updated_at
  BEFORE UPDATE ON public.module_features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_module_features_updated_at
  BEFORE UPDATE ON public.school_module_features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();