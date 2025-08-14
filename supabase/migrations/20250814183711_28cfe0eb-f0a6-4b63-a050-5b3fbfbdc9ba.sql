-- =================================================================
-- MINIMAL SECURITY FIX: Address Core Critical Issues Only
-- =================================================================

-- 1. FIX PROFILES POLICIES (Critical from error logs)
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
-- 2. FIX FUNCTION SECURITY (Fix the 6 function search path issues)
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

-- Fix lesson plan functions (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lesson_plans') THEN
    PERFORM 1; -- Table exists, functions should work
    
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
        OR 
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN user_roles ur ON ur.user_id = user_id
            WHERE lp.id = lesson_plan_id 
            AND ur.role = 'hod'
            AND ur.department = lp.subject
            AND ur.school_id = lp.school_id
            AND ur.is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM lesson_plan_assignments lpa
            WHERE lpa.lesson_plan_id = lesson_plan_id
            AND lpa.assigned_to = user_id
        )
        OR
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN user_roles ur ON ur.user_id = user_id
            WHERE lp.id = lesson_plan_id
            AND ur.school_id = lp.school_id
            AND ur.role IN ('school_admin', 'super_admin')
            AND ur.is_active = true
        );
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
            AND lp.status != 'approved'
        )
        OR
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN user_roles ur ON ur.user_id = user_id
            WHERE lp.id = lesson_plan_id
            AND ur.school_id = lp.school_id
            AND ur.role IN ('school_admin', 'super_admin')
            AND ur.is_active = true
        );
    $func$;

    CREATE OR REPLACE FUNCTION public.can_approve_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
    RETURNS boolean
    LANGUAGE sql
    STABLE SECURITY DEFINER
    SET search_path = 'public'
    AS $func$
        SELECT EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN user_roles ur ON ur.user_id = user_id
            WHERE lp.id = lesson_plan_id
            AND ur.role = 'hod'
            AND ur.department = lp.subject
            AND ur.school_id = lp.school_id
            AND ur.is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM lesson_plans lp
            JOIN user_roles ur ON ur.user_id = user_id
            WHERE lp.id = lesson_plan_id
            AND ur.school_id = lp.school_id
            AND ur.role IN ('school_admin', 'super_admin')
            AND ur.is_active = true
        );
    $func$;
  END IF;
END $$;

-- =================================================================
-- 3. CRITICAL PERFORMANCE INDEXES
-- =================================================================
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_school_active 
ON user_roles (user_id, school_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_role_active 
ON user_roles (role, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_user_school 
ON students (user_id, school_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_user_id 
ON profiles (user_id);

-- =================================================================
-- 4. ENSURE RLS IS ENABLED ON CRITICAL TABLES
-- =================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;