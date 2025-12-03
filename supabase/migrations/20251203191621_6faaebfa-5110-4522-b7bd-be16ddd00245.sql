-- Drop the restrictive super-admin-only INSERT policy (redundant since ALL policy covers this)
DROP POLICY IF EXISTS "Super admins can insert subjects" ON public.subjects;

-- The "Admins can manage subjects" policy with cmd:ALL already handles INSERT for both super_admins and school_admin/hod