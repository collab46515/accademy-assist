-- Add proper RLS policies for transport_incidents table
-- First drop the existing policy to recreate it properly
DROP POLICY IF EXISTS "School staff can manage transport incidents" ON public.transport_incidents;

-- Create separate policies for each operation
CREATE POLICY "Users can view incidents for their school"
ON public.transport_incidents
FOR SELECT
USING (
  school_id IN (SELECT public.get_user_school_ids(auth.uid()))
  OR public.is_super_admin(auth.uid())
);

CREATE POLICY "Users can create incidents for their school"
ON public.transport_incidents
FOR INSERT
WITH CHECK (
  school_id IN (SELECT public.get_user_school_ids(auth.uid()))
  OR public.is_super_admin(auth.uid())
);

CREATE POLICY "Users can update incidents for their school"
ON public.transport_incidents
FOR UPDATE
USING (
  school_id IN (SELECT public.get_user_school_ids(auth.uid()))
  OR public.is_super_admin(auth.uid())
);

CREATE POLICY "Users can delete incidents for their school"
ON public.transport_incidents
FOR DELETE
USING (
  school_id IN (SELECT public.get_user_school_ids(auth.uid()))
  OR public.is_super_admin(auth.uid())
);