-- Add school_id to route_stops table
ALTER TABLE public.route_stops 
ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id);

-- Update existing route_stops with school_id from their routes
UPDATE public.route_stops rs
SET school_id = tr.school_id
FROM public.transport_routes tr
WHERE rs.route_id = tr.id AND rs.school_id IS NULL;

-- Create helper function to get user's school_id(s)
CREATE OR REPLACE FUNCTION public.get_user_school_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT school_id 
  FROM public.user_roles 
  WHERE user_id = _user_id 
    AND is_active = true
    AND school_id IS NOT NULL
$$;

-- Create RLS policies for drivers table
CREATE POLICY "Users can view drivers in their school"
ON public.drivers FOR SELECT
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can insert drivers in their school"
ON public.drivers FOR INSERT
TO authenticated
WITH CHECK (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can update drivers in their school"
ON public.drivers FOR UPDATE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can delete drivers in their school"
ON public.drivers FOR DELETE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

-- Create RLS policies for vehicles table
CREATE POLICY "Users can view vehicles in their school"
ON public.vehicles FOR SELECT
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can insert vehicles in their school"
ON public.vehicles FOR INSERT
TO authenticated
WITH CHECK (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can update vehicles in their school"
ON public.vehicles FOR UPDATE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can delete vehicles in their school"
ON public.vehicles FOR DELETE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

-- Create RLS policies for route_stops table
CREATE POLICY "Users can view route_stops in their school"
ON public.route_stops FOR SELECT
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can insert route_stops in their school"
ON public.route_stops FOR INSERT
TO authenticated
WITH CHECK (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can update route_stops in their school"
ON public.route_stops FOR UPDATE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can delete route_stops in their school"
ON public.route_stops FOR DELETE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

-- Create RLS policies for vehicle_contracts table
CREATE POLICY "Users can view vehicle_contracts in their school"
ON public.vehicle_contracts FOR SELECT
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can insert vehicle_contracts in their school"
ON public.vehicle_contracts FOR INSERT
TO authenticated
WITH CHECK (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can update vehicle_contracts in their school"
ON public.vehicle_contracts FOR UPDATE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can delete vehicle_contracts in their school"
ON public.vehicle_contracts FOR DELETE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

-- Create RLS policies for transport_contractors table
CREATE POLICY "Users can view transport_contractors in their school"
ON public.transport_contractors FOR SELECT
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can insert transport_contractors in their school"
ON public.transport_contractors FOR INSERT
TO authenticated
WITH CHECK (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can update transport_contractors in their school"
ON public.transport_contractors FOR UPDATE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can delete transport_contractors in their school"
ON public.transport_contractors FOR DELETE
TO authenticated
USING (school_id IN (SELECT public.get_user_school_ids(auth.uid())));

-- Create RLS policies for schools table
CREATE POLICY "Users can view their own school"
ON public.schools FOR SELECT
TO authenticated
USING (id IN (SELECT public.get_user_school_ids(auth.uid())));

CREATE POLICY "Users can update their own school"
ON public.schools FOR UPDATE
TO authenticated
USING (id IN (SELECT public.get_user_school_ids(auth.uid())));