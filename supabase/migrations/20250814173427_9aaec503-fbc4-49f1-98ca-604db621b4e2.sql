-- =================================================================
-- COMPREHENSIVE SECURITY FIX: Address All Critical Issues
-- =================================================================

-- 1. CREATE MISSING RLS POLICIES FOR TABLES WITHOUT THEM
-- =================================================================

-- Fix profiles table policies (from error logs, seems to have issues)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

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

-- Fix gradebook records (likely missing policies)
CREATE POLICY "Teachers can manage gradebook records" 
ON grading_results FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin') 
    AND ur.is_active = true
  )
);

CREATE POLICY "Students can view their own grades" 
ON grading_results FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s 
    WHERE s.user_id = auth.uid() 
    AND s.id = grading_results.student_id
  )
);

-- Fix curriculum frameworks (likely missing policies)
CREATE POLICY "School staff can manage curriculum frameworks" 
ON curriculum_frameworks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_frameworks.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin') 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Fix schools table policies
CREATE POLICY "Users can view schools they belong to" 
ON schools FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = schools.id
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Super admins can manage schools" 
ON schools FOR ALL
USING (is_super_admin(auth.uid()));

-- Fix departments table (if it exists and needs policies)
CREATE POLICY "School staff can view departments" 
ON departments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = departments.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin') 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage departments" 
ON departments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = departments.school_id
    AND ur.role IN ('school_admin', 'super_admin') 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Fix subjects table
CREATE POLICY "School staff can view subjects" 
ON subjects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = subjects.school_id
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin') 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage subjects" 
ON subjects FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = subjects.school_id
    AND ur.role IN ('school_admin', 'super_admin') 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- =================================================================
-- 2. FIX FUNCTION SECURITY ISSUES - ADD SEARCH PATH SECURITY
-- =================================================================

-- Update all functions to have secure search paths
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
-- 3. CREATE SECURE HELPER FUNCTIONS FOR COMMON OPERATIONS
-- =================================================================

-- Function to safely get current user's profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  phone text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT p.user_id, p.email, p.first_name, p.last_name, p.phone
  FROM profiles p
  WHERE p.user_id = auth.uid();
$function$;

-- Function to safely check user's school membership
CREATE OR REPLACE FUNCTION public.user_belongs_to_school(user_uuid uuid, school_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = user_uuid 
    AND ur.school_id = school_uuid
    AND ur.is_active = true
  );
$function$;

-- =================================================================
-- 4. ADD AUDIT LOGGING FOR SECURITY EVENTS
-- =================================================================

-- Create security audit function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  resource_type text DEFAULT NULL,
  resource_id text DEFAULT NULL,
  details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    event_type,
    COALESCE(resource_type, 'security'),
    resource_id,
    details,
    now()
  );
END;
$function$;

-- =================================================================
-- 5. CREATE MISSING INDEXES FOR PERFORMANCE
-- =================================================================

-- Performance indexes for RLS queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_school_active 
ON user_roles (user_id, school_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_role_active 
ON user_roles (role, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_user_school 
ON students (user_id, school_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_user_id 
ON profiles (user_id);

-- =================================================================
-- 6. ENSURE ALL CRITICAL TABLES HAVE PROPER RLS ENABLED
-- =================================================================

-- Ensure RLS is enabled on all critical tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Ensure other critical tables have RLS (only if they exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'lesson_plans') THEN
    EXECUTE 'ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'grading_results') THEN
    EXECUTE 'ALTER TABLE grading_results ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'curriculum_frameworks') THEN
    EXECUTE 'ALTER TABLE curriculum_frameworks ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'departments') THEN
    EXECUTE 'ALTER TABLE departments ENABLE ROW LEVEL SECURITY';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subjects') THEN
    EXECUTE 'ALTER TABLE subjects ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- =================================================================
-- 7. ADD COMPREHENSIVE SECURITY VALIDATION
-- =================================================================

-- Function to validate user permissions before critical operations
CREATE OR REPLACE FUNCTION public.validate_user_permission(
  target_school_id uuid,
  required_role app_role,
  resource_name text DEFAULT 'resource'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_has_permission boolean := false;
BEGIN
  -- Check if user has required role in the school
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = target_school_id
    AND ur.role = required_role
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid()) INTO user_has_permission;
  
  -- Log security check
  PERFORM log_security_event(
    'permission_check',
    'authorization',
    resource_name,
    jsonb_build_object(
      'required_role', required_role,
      'school_id', target_school_id,
      'permission_granted', user_has_permission
    )
  );
  
  RETURN user_has_permission;
END;
$function$;