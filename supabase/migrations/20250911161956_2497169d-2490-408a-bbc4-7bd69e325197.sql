-- Restrict demo@doxa.com to St Joseph only
-- 1) Remove global super_admin role
DELETE FROM public.user_roles
WHERE user_id = '249c79c6-3a06-43fa-aa57-ddf5f8c69209' AND role = 'super_admin';

-- 2) Ensure school-specific admin role exists for St Joseph
INSERT INTO public.user_roles (user_id, school_id, role, is_active)
SELECT '249c79c6-3a06-43fa-aa57-ddf5f8c69209', '2f21656b-0848-40ee-bbec-12e5e8137545', 'school_admin', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = '249c79c6-3a06-43fa-aa57-ddf5f8c69209' 
    AND school_id = '2f21656b-0848-40ee-bbec-12e5e8137545'
);
