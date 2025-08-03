-- Enable RLS on all unprotected recruitment tables
ALTER TABLE public.interview_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interview_schedules
CREATE POLICY "HR can manage interview schedules" 
ON public.interview_schedules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for interview_stages
CREATE POLICY "HR can manage interview stages" 
ON public.interview_stages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for job_offers
CREATE POLICY "HR can manage job offers" 
ON public.job_offers 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for job_requisitions
CREATE POLICY "HR can manage job requisitions" 
ON public.job_requisitions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for onboarding_progress
CREATE POLICY "HR can manage onboarding progress" 
ON public.onboarding_progress 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for onboarding_templates
CREATE POLICY "HR can manage onboarding templates" 
ON public.onboarding_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for recruitment_metrics
CREATE POLICY "HR can view recruitment metrics" 
ON public.recruitment_metrics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- RLS Policies for reference_checks
CREATE POLICY "HR can manage reference checks" 
ON public.reference_checks 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- Enhanced user_roles policies to prevent privilege escalation
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- New secure policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (is_super_admin(auth.uid()));

CREATE POLICY "School admins can view roles in their school" 
ON public.user_roles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'school_admin'::app_role 
    AND ur.school_id = user_roles.school_id 
    AND ur.is_active = true
  )
);

-- Prevent privilege escalation in role assignment
CREATE POLICY "Super admins can assign any role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "School admins can assign non-super-admin roles in their school" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'school_admin'::app_role 
    AND ur.school_id = user_roles.school_id 
    AND ur.is_active = true
  ) 
  AND user_roles.role != 'super_admin'::app_role
);

CREATE POLICY "Super admins can update any role" 
ON public.user_roles 
FOR UPDATE 
USING (is_super_admin(auth.uid()));

CREATE POLICY "School admins can update non-super-admin roles in their school" 
ON public.user_roles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'school_admin'::app_role 
    AND ur.school_id = user_roles.school_id 
    AND ur.is_active = true
  ) 
  AND user_roles.role != 'super_admin'::app_role
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'school_admin'::app_role 
    AND ur.school_id = user_roles.school_id 
    AND ur.is_active = true
  ) 
  AND user_roles.role != 'super_admin'::app_role
);

CREATE POLICY "Super admins can delete any role" 
ON public.user_roles 
FOR DELETE 
USING (is_super_admin(auth.uid()));

CREATE POLICY "School admins can delete non-super-admin roles in their school" 
ON public.user_roles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'school_admin'::app_role 
    AND ur.school_id = user_roles.school_id 
    AND ur.is_active = true
  ) 
  AND user_roles.role != 'super_admin'::app_role
);

-- Create function to validate role assignments
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent self-assignment of super_admin role unless user is already super_admin
  IF NEW.role = 'super_admin'::app_role AND NEW.user_id = auth.uid() THEN
    IF NOT is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Cannot self-assign super_admin role';
    END IF;
  END IF;
  
  -- Ensure school_id is provided for non-super_admin roles
  IF NEW.role != 'super_admin'::app_role AND NEW.school_id IS NULL THEN
    RAISE EXCEPTION 'School ID required for non-super-admin roles';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role validation
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.user_roles;
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();