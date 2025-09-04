-- Remove mock/demo data from profiles and user_roles while preserving Auth users
-- Defines demo patterns and deletes associated entries

CREATE OR REPLACE FUNCTION public.remove_demo_profiles_and_roles()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  demo_patterns TEXT[] := ARRAY[
    '%@demo.school.com%',
    '%demo.school.com%',
    '%@example.com%',
    '%lovabledemo%'
  ];
  profiles_removed INT := 0;
  roles_removed INT := 0;
BEGIN
  -- Delete roles for demo profiles
  WITH demo_users AS (
    SELECT user_id
    FROM profiles p
    WHERE EXISTS (
      SELECT 1 FROM unnest(demo_patterns) pat
      WHERE p.email ILIKE pat
    )
  )
  DELETE FROM user_roles ur
  USING demo_users du
  WHERE ur.user_id = du.user_id;
  GET DIAGNOSTICS roles_removed = ROW_COUNT;

  -- Delete demo profiles
  WITH demo_profiles AS (
    SELECT id
    FROM profiles p
    WHERE EXISTS (
      SELECT 1 FROM unnest(demo_patterns) pat
      WHERE p.email ILIKE pat
    )
  )
  DELETE FROM profiles p2
  USING demo_profiles dp
  WHERE p2.id = dp.id;
  GET DIAGNOSTICS profiles_removed = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'profiles_removed', profiles_removed,
    'roles_removed', roles_removed,
    'message', 'Demo profiles and roles removed.'
  );
END;
$$;

-- Execute cleanup now
SELECT public.remove_demo_profiles_and_roles();