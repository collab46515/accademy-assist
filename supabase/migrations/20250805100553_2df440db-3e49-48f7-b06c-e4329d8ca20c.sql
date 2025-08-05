-- Assign admin role to the current user
INSERT INTO public.user_roles (user_id, school_id, role, is_active)
VALUES (auth.uid(), '8cafd4e6-2974-4cf7-aa6e-39c70aef789f', 'school_admin', true)
ON CONFLICT (user_id, school_id, role) DO UPDATE SET is_active = true;