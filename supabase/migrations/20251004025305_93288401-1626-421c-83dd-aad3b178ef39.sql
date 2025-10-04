-- Multi-Tenant School Module Configuration System

-- Add custom domain and module configuration to schools table
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS module_config JSONB DEFAULT '{
  "enabled_modules": [],
  "module_settings": {}
}'::jsonb;

-- Create school_modules table for granular per-school module control
CREATE TABLE IF NOT EXISTS school_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  custom_workflow JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(school_id, module_id)
);

-- Add comment for documentation
COMMENT ON TABLE school_modules IS 'Controls which modules are enabled for each school and stores school-specific workflows and settings';
COMMENT ON COLUMN school_modules.custom_workflow IS 'School-specific workflow configuration (e.g., admission stages, approval chains)';
COMMENT ON COLUMN school_modules.settings IS 'Module-specific settings per school (e.g., fee structures, notification preferences)';

-- Enable RLS on school_modules
ALTER TABLE school_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Super admins can manage all school modules
CREATE POLICY "Super admins can manage school modules"
ON school_modules FOR ALL
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- RLS Policy: School admins can view their school's modules
CREATE POLICY "School admins can view their school modules"
ON school_modules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_modules.school_id
    AND ur.role = 'school_admin'
    AND ur.is_active = true
  )
);

-- RLS Policy: School admins can update settings for their modules (not enable/disable)
CREATE POLICY "School admins can update their module settings"
ON school_modules FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_modules.school_id
    AND ur.role = 'school_admin'
    AND ur.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = school_modules.school_id
    AND ur.role = 'school_admin'
    AND ur.is_active = true
  )
);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_school_modules_updated_at
  BEFORE UPDATE ON school_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for fast lookups by school
CREATE INDEX IF NOT EXISTS idx_school_modules_school_id ON school_modules(school_id);
CREATE INDEX IF NOT EXISTS idx_school_modules_enabled ON school_modules(school_id, is_enabled) WHERE is_enabled = true;

-- Add index on custom_domain for fast domain-based lookups
CREATE INDEX IF NOT EXISTS idx_schools_custom_domain ON schools(custom_domain) WHERE custom_domain IS NOT NULL;