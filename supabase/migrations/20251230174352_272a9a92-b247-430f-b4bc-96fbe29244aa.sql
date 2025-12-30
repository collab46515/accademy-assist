-- Drop existing policies first if they exist, then recreate all
DROP POLICY IF EXISTS "Users can view route profiles in their school" ON public.route_profiles;
DROP POLICY IF EXISTS "Users can insert route profiles in their school" ON public.route_profiles;
DROP POLICY IF EXISTS "Users can update route profiles in their school" ON public.route_profiles;
DROP POLICY IF EXISTS "Users can delete route profiles in their school" ON public.route_profiles;

DROP POLICY IF EXISTS "Users can view contractors in their school" ON public.transport_contractors;
DROP POLICY IF EXISTS "Users can insert contractors in their school" ON public.transport_contractors;
DROP POLICY IF EXISTS "Users can update contractors in their school" ON public.transport_contractors;
DROP POLICY IF EXISTS "Users can delete contractors in their school" ON public.transport_contractors;

DROP POLICY IF EXISTS "Users can view holidays in their school" ON public.transport_holidays;
DROP POLICY IF EXISTS "Users can insert holidays in their school" ON public.transport_holidays;
DROP POLICY IF EXISTS "Users can update holidays in their school" ON public.transport_holidays;
DROP POLICY IF EXISTS "Users can delete holidays in their school" ON public.transport_holidays;

-- Create RLS policies for route_profiles table
CREATE POLICY "Users can view route profiles in their school"
ON public.route_profiles FOR SELECT
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert route profiles in their school"
ON public.route_profiles FOR INSERT
WITH CHECK (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update route profiles in their school"
ON public.route_profiles FOR UPDATE
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete route profiles in their school"
ON public.route_profiles FOR DELETE
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

-- Create RLS policies for transport_contractors table
CREATE POLICY "Users can view contractors in their school"
ON public.transport_contractors FOR SELECT
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert contractors in their school"
ON public.transport_contractors FOR INSERT
WITH CHECK (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update contractors in their school"
ON public.transport_contractors FOR UPDATE
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete contractors in their school"
ON public.transport_contractors FOR DELETE
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

-- Create RLS policies for transport_holidays table
CREATE POLICY "Users can view holidays in their school"
ON public.transport_holidays FOR SELECT
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert holidays in their school"
ON public.transport_holidays FOR INSERT
WITH CHECK (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update holidays in their school"
ON public.transport_holidays FOR UPDATE
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete holidays in their school"
ON public.transport_holidays FOR DELETE
USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));