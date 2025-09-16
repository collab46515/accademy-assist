-- Fix transport RLS policies and add missing school_id requirements
-- Add school_id to transport tables where missing and fix RLS policies

-- Update drivers table to add school_id if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'school_id') THEN
    ALTER TABLE public.drivers ADD COLUMN school_id uuid;
    
    -- Update existing drivers with a default school_id from schools table
    UPDATE public.drivers 
    SET school_id = (SELECT id FROM schools WHERE is_active = true LIMIT 1)
    WHERE school_id IS NULL;
    
    -- Make school_id NOT NULL after updating existing records
    ALTER TABLE public.drivers ALTER COLUMN school_id SET NOT NULL;
  END IF;
END $$;

-- Update vehicles table to add school_id if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'school_id') THEN
    ALTER TABLE public.vehicles ADD COLUMN school_id uuid;
    
    -- Update existing vehicles with a default school_id from schools table
    UPDATE public.vehicles 
    SET school_id = (SELECT id FROM schools WHERE is_active = true LIMIT 1)
    WHERE school_id IS NULL;
    
    -- Make school_id NOT NULL after updating existing records
    ALTER TABLE public.vehicles ALTER COLUMN school_id SET NOT NULL;
  END IF;
END $$;

-- Create function to increment activity enrollment
CREATE OR REPLACE FUNCTION public.increment_activity_enrollment(activity_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.activities 
  SET enrolled = enrolled + 1
  WHERE id = activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to decrement activity enrollment
CREATE OR REPLACE FUNCTION public.decrement_activity_enrollment(activity_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.activities 
  SET enrolled = GREATEST(enrolled - 1, 0)
  WHERE id = activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure all transport tables have proper RLS policies
-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drivers policies
  DROP POLICY IF EXISTS "School staff can manage drivers" ON public.drivers;
  CREATE POLICY "School staff can manage drivers" 
  ON public.drivers 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.school_id = drivers.school_id
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.school_id = drivers.school_id
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

  -- Vehicles policies
  DROP POLICY IF EXISTS "School staff can manage vehicles" ON public.vehicles;
  CREATE POLICY "School staff can manage vehicles" 
  ON public.vehicles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.school_id = vehicles.school_id
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.school_id = vehicles.school_id
      AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );
END $$;