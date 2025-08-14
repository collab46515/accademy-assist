-- =================================================================
-- TARGETED SECURITY FIX: Address Existing Critical Issues  
-- =================================================================

-- 1. FIX PROFILES TABLE POLICIES (Critical - from error logs)
-- =================================================================

-- Ensure profiles table has proper policies
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
-- 2. FIX EXISTING FUNCTION SECURITY ISSUES
-- =================================================================

-- Update functions to have secure search paths (fixing the 6 function issues)
CREATE OR REPLACE FUNCTION public.can_access_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.can_edit_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.can_approve_lesson_plan(lesson_plan_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

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

-- =================================================================
-- 3. ADD MISSING POLICIES FOR TABLES THAT HAVE RLS BUT NO POLICIES
-- =================================================================

-- Check if tables exist and add policies only for existing ones
DO $$ 
BEGIN
    -- Fix schools table if it has RLS enabled but no proper policies
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schools') THEN
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Users can view schools they belong to" ON schools;
        DROP POLICY IF EXISTS "Super admins can manage schools" ON schools;
        
        -- Create proper policies
        EXECUTE '
        CREATE POLICY "Users can view schools they belong to" 
        ON schools FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.school_id = schools.id
            AND ur.is_active = true
          ) OR is_super_admin(auth.uid())
        )';
        
        EXECUTE '
        CREATE POLICY "Super admins can manage schools" 
        ON schools FOR ALL
        USING (is_super_admin(auth.uid()))';
    END IF;

    -- Fix departments table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'departments') THEN
        DROP POLICY IF EXISTS "School staff can view departments" ON departments;
        DROP POLICY IF EXISTS "Admins can manage departments" ON departments;
        
        EXECUTE '
        CREATE POLICY "School staff can view departments" 
        ON departments FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.school_id = departments.school_id
            AND ur.role IN (''teacher'', ''school_admin'', ''hod'', ''super_admin'') 
            AND ur.is_active = true
          ) OR is_super_admin(auth.uid())
        )';
        
        EXECUTE '
        CREATE POLICY "Admins can manage departments" 
        ON departments FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.school_id = departments.school_id
            AND ur.role IN (''school_admin'', ''super_admin'') 
            AND ur.is_active = true
          ) OR is_super_admin(auth.uid())
        )';
    END IF;

    -- Fix subjects table if it exists  
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subjects') THEN
        DROP POLICY IF EXISTS "School staff can view subjects" ON subjects;
        DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
        
        EXECUTE '
        CREATE POLICY "School staff can view subjects" 
        ON subjects FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.school_id = subjects.school_id
            AND ur.role IN (''teacher'', ''school_admin'', ''hod'', ''super_admin'') 
            AND ur.is_active = true
          ) OR is_super_admin(auth.uid())
        )';
        
        EXECUTE '
        CREATE POLICY "Admins can manage subjects" 
        ON subjects FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.school_id = subjects.school_id
            AND ur.role IN (''school_admin'', ''super_admin'') 
            AND ur.is_active = true
          ) OR is_super_admin(auth.uid())
        )';
    END IF;
END $$;

-- =================================================================
-- 4. CREATE PERFORMANCE INDEXES FOR RLS QUERIES
-- =================================================================

-- Critical indexes for RLS performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_school_active 
ON user_roles (user_id, school_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_role_active 
ON user_roles (role, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_user_school 
ON students (user_id, school_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_user_id 
ON profiles (user_id);

-- =================================================================
-- 5. ENSURE CRITICAL TABLES HAVE RLS ENABLED
-- =================================================================

-- Ensure RLS is enabled on all critical tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Enable RLS on other tables if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schools') THEN
    EXECUTE 'ALTER TABLE schools ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'departments') THEN
    EXECUTE 'ALTER TABLE departments ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subjects') THEN
    EXECUTE 'ALTER TABLE subjects ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;