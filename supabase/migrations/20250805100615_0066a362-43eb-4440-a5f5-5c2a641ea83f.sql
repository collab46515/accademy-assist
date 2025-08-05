-- Assign school admin role to the current user
INSERT INTO public.user_roles (user_id, school_id, role, is_active, assigned_at)
VALUES (auth.uid(), '8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'school_admin', true, now());