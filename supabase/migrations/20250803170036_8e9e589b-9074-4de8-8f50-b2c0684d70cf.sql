-- Enable RLS on tables that don't have it
-- Note: Some tables may already have RLS enabled, using IF condition to avoid errors

DO $$
BEGIN
    -- Enable RLS only if not already enabled
    IF NOT (SELECT row_security FROM pg_tables WHERE tablename = 'assessment_tests' AND schemaname = 'public') THEN
        ALTER TABLE public.assessment_tests ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT row_security FROM pg_tables WHERE tablename = 'candidate_assessments' AND schemaname = 'public') THEN
        ALTER TABLE public.candidate_assessments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT row_security FROM pg_tables WHERE tablename = 'candidate_pool' AND schemaname = 'public') THEN
        ALTER TABLE public.candidate_pool ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT row_security FROM pg_tables WHERE tablename = 'background_checks' AND schemaname = 'public') THEN
        ALTER TABLE public.background_checks ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Assessment tests policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'HR can manage assessment tests' AND tablename = 'assessment_tests') THEN
        CREATE POLICY "HR can manage assessment tests" ON public.assessment_tests
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
            AND ur.is_active = true
          )
        );
    END IF;

    -- Candidate assessments policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'HR can manage candidate assessments' AND tablename = 'candidate_assessments') THEN
        CREATE POLICY "HR can manage candidate assessments" ON public.candidate_assessments
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
            AND ur.is_active = true
          )
        );
    END IF;

    -- Candidate pool policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'HR can manage candidate pool' AND tablename = 'candidate_pool') THEN
        CREATE POLICY "HR can manage candidate pool" ON public.candidate_pool
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
            AND ur.is_active = true
          )
        );
    END IF;

    -- Background checks policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'HR can manage background checks' AND tablename = 'background_checks') THEN
        CREATE POLICY "HR can manage background checks" ON public.background_checks
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
            AND ur.is_active = true
          )
        );
    END IF;
END $$;