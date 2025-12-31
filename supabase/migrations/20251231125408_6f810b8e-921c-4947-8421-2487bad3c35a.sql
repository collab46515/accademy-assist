
-- Ensure dominic@pappayacloud.com and demo@doxa.com have explicit school-scoped admin access
-- Needed because transport RLS checks membership via user_roles.school_id.

-- Anand Niketan school id: fe361ba1-c41e-41e9-ba78-9960efbfc7b6
-- dominic@pappayacloud.com user id: dbe5589f-d4a3-46f1-9112-07cdf908fcbe
INSERT INTO public.user_roles (user_id, school_id, role, is_active)
SELECT 'dbe5589f-d4a3-46f1-9112-07cdf908fcbe', 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6', 'school_admin'::public.app_role, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = 'dbe5589f-d4a3-46f1-9112-07cdf908fcbe'
    AND school_id = 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6'
    AND role = 'school_admin'::public.app_role
    AND is_active = true
);

-- demo@doxa.com user id: 249c79c6-3a06-43fa-aa57-ddf5f8c69209
INSERT INTO public.user_roles (user_id, school_id, role, is_active)
SELECT '249c79c6-3a06-43fa-aa57-ddf5f8c69209', 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6', 'school_admin'::public.app_role, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '249c79c6-3a06-43fa-aa57-ddf5f8c69209'
    AND school_id = 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6'
    AND role = 'school_admin'::public.app_role
    AND is_active = true
);
