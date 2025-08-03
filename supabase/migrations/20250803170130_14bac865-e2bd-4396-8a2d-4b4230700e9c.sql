-- Enable RLS on specific tables that need it
ALTER TABLE public.assessment_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_assessments ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.candidate_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_checks ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for recruitment tables
CREATE POLICY "HR can manage assessment tests" ON public.assessment_tests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage candidate assessments" ON public.candidate_assessments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage candidate pool" ON public.candidate_pool
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage background checks" ON public.background_checks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);