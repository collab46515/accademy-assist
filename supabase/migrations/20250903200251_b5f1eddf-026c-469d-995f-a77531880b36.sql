-- Drop the existing drivers table and recreate it properly
DROP TABLE IF EXISTS public.drivers CASCADE;

-- Create drivers table with proper structure
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  employee_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  license_type TEXT[] NOT NULL DEFAULT ARRAY['B'],
  hire_date DATE NOT NULL,
  birth_date DATE,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  dbs_check_date DATE,
  dbs_expiry DATE,
  first_aid_cert_date DATE,
  first_aid_expiry DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, employee_id)
);

-- Enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "School staff can manage drivers" ON public.drivers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = drivers.school_id
        AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Create trigger for updated_at
CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();