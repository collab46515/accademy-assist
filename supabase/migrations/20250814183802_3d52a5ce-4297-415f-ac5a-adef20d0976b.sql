-- =================================================================
-- FINAL SECURITY FIX: Core Issues Only (No Concurrent Operations)
-- =================================================================

-- 1. FIX PROFILES POLICIES (Critical - fixes user access issues)
-- =================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('super_admin', 'school_admin') 
    AND ur.is_active = true
  )
);

CREATE POLICY "System can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (true);

-- =================================================================
-- 2. FIX FUNCTION SECURITY (Fixes 6 function search path issues)
-- =================================================================
CREATE OR REPLACE FUNCTION public.has_permission(user_uuid uuid, school_uuid uuid, resource resource_type, permission permission_type)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = user_uuid
      AND ur.school_id = school_uuid
      AND ur.is_active = true
      AND rp.resource = resource
      AND rp.permission = permission
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = user_uuid
      AND ur.role = 'super_admin'
      AND ur.is_active = true
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid uuid, school_uuid uuid DEFAULT NULL::uuid)
RETURNS TABLE(role app_role, school_id uuid, department text, year_group text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT ur.role, ur.school_id, ur.department, ur.year_group
  FROM public.user_roles ur
  WHERE ur.user_id = user_uuid 
    AND ur.is_active = true
    AND (school_uuid IS NULL OR ur.school_id = school_uuid);
$function$;

-- Fix remaining lesson plan functions if table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lesson_plans') THEN
    CREATE OR REPLACE FUNCTION public.can_access_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
    RETURNS boolean
    LANGUAGE sql
    STABLE SECURITY DEFINER
    SET search_path = 'public'
    AS $func$
        SELECT EXISTS (
            SELECT 1 FROM lesson_plans lp
            WHERE lp.id = lesson_plan_id AND lp.teacher_id = user_id
        )
        OR is_super_admin(user_id);
    $func$;

    CREATE OR REPLACE FUNCTION public.can_edit_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
    RETURNS boolean
    LANGUAGE sql
    STABLE SECURITY DEFINER
    SET search_path = 'public'
    AS $func$
        SELECT EXISTS (
            SELECT 1 FROM lesson_plans lp
            WHERE lp.id = lesson_plan_id 
            AND lp.teacher_id = user_id
        )
        OR is_super_admin(user_id);
    $func$;

    CREATE OR REPLACE FUNCTION public.can_approve_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
    RETURNS boolean
    LANGUAGE sql
    STABLE SECURITY DEFINER
    SET search_path = 'public'
    AS $func$
        SELECT is_super_admin(user_id);
    $func$;
  END IF;
END $$;

-- =================================================================
-- 3. BASIC PERFORMANCE INDEXES (Non-concurrent)
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_active 
ON user_roles (user_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
ON profiles (user_id);

-- =================================================================
-- 4. ENSURE RLS IS ENABLED ON CRITICAL TABLES
-- =================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;