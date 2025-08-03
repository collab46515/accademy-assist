-- Enable RLS on remaining tables that need it
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job-related tables
CREATE POLICY "HR can manage job postings" ON public.job_postings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage job applications" ON public.job_applications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage interview stages" ON public.interview_stages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage interview schedules" ON public.interview_schedules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage reference checks" ON public.reference_checks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage job offers" ON public.job_offers
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage onboarding templates" ON public.onboarding_templates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Survey responses - more permissive policies
CREATE POLICY "Employees can submit survey responses" ON public.survey_responses
FOR INSERT WITH CHECK (
  employee_id = (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "HR can view survey responses" ON public.survey_responses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);