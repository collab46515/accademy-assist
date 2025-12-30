-- Drop the incorrect policies that reference profiles.school_id
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

-- Drop the old ALL policies too for cleaner setup
DROP POLICY IF EXISTS "Users can manage route profiles in their school" ON public.route_profiles;
DROP POLICY IF EXISTS "Users can manage contractors in their school" ON public.transport_contractors;
DROP POLICY IF EXISTS "Users can manage holidays in their school" ON public.transport_holidays;

-- Create correct RLS policies using user_roles table
-- Route Profiles
CREATE POLICY "route_profiles_select" ON public.route_profiles FOR SELECT
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = route_profiles.school_id AND user_roles.is_active = true));

CREATE POLICY "route_profiles_insert" ON public.route_profiles FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = route_profiles.school_id AND user_roles.is_active = true));

CREATE POLICY "route_profiles_update" ON public.route_profiles FOR UPDATE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = route_profiles.school_id AND user_roles.is_active = true));

CREATE POLICY "route_profiles_delete" ON public.route_profiles FOR DELETE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = route_profiles.school_id AND user_roles.is_active = true));

-- Transport Contractors
CREATE POLICY "transport_contractors_select" ON public.transport_contractors FOR SELECT
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_contractors.school_id AND user_roles.is_active = true));

CREATE POLICY "transport_contractors_insert" ON public.transport_contractors FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_contractors.school_id AND user_roles.is_active = true));

CREATE POLICY "transport_contractors_update" ON public.transport_contractors FOR UPDATE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_contractors.school_id AND user_roles.is_active = true));

CREATE POLICY "transport_contractors_delete" ON public.transport_contractors FOR DELETE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_contractors.school_id AND user_roles.is_active = true));

-- Transport Holidays
CREATE POLICY "transport_holidays_select" ON public.transport_holidays FOR SELECT
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_holidays.school_id AND user_roles.is_active = true));

CREATE POLICY "transport_holidays_insert" ON public.transport_holidays FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_holidays.school_id AND user_roles.is_active = true));

CREATE POLICY "transport_holidays_update" ON public.transport_holidays FOR UPDATE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_holidays.school_id AND user_roles.is_active = true));

CREATE POLICY "transport_holidays_delete" ON public.transport_holidays FOR DELETE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.school_id = transport_holidays.school_id AND user_roles.is_active = true));