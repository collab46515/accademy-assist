-- Relax NOT NULL constraint to allow global super_admin roles
ALTER TABLE public.user_roles
  ALTER COLUMN school_id DROP NOT NULL;

-- Ensure business rule enforcement via trigger (non-super_admin must have school_id)
DROP TRIGGER IF EXISTS trg_validate_role_assignment ON public.user_roles;
CREATE TRIGGER trg_validate_role_assignment
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.validate_role_assignment();
