-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent self-assignment of super_admin role unless user is already super_admin
  IF NEW.role = 'super_admin'::app_role AND NEW.user_id = auth.uid() THEN
    IF NOT is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Cannot self-assign super_admin role';
    END IF;
  END IF;
  
  -- Ensure school_id is provided for non-super_admin roles
  IF NEW.role != 'super_admin'::app_role AND NEW.school_id IS NULL THEN
    RAISE EXCEPTION 'School ID required for non-super-admin roles';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';