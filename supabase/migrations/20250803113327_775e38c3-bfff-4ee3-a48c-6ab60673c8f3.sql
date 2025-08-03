-- RLS Policies for Enrollment System

-- Enrollment Types (Configuration) - Admin only
CREATE POLICY "Super admins can view enrollment types" 
ON public.enrollment_types 
FOR SELECT 
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage enrollment types" 
ON public.enrollment_types 
FOR ALL 
USING (is_super_admin(auth.uid()));

-- Enrollment Applications - Multi-level access
CREATE POLICY "Users can view applications in their school" 
ON public.enrollment_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = enrollment_applications.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR submitted_by = auth.uid()
);

CREATE POLICY "Admins can manage applications in their school" 
ON public.enrollment_applications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = enrollment_applications.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Users can create applications" 
ON public.enrollment_applications 
FOR INSERT 
WITH CHECK (
  submitted_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = enrollment_applications.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Enrollment Workflows - Admin configuration
CREATE POLICY "Admins can view workflows" 
ON public.enrollment_workflows 
FOR SELECT 
USING (
  is_super_admin(auth.uid()) 
  OR EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
);

CREATE POLICY "Super admins can manage workflows" 
ON public.enrollment_workflows 
FOR ALL 
USING (is_super_admin(auth.uid()));

-- Enrollment Workflow Steps - Application access
CREATE POLICY "Users can view workflow steps for accessible applications" 
ON public.enrollment_workflow_steps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_workflow_steps.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR assigned_to = auth.uid()
);

CREATE POLICY "Admins can manage workflow steps" 
ON public.enrollment_workflow_steps 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_workflow_steps.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Enrollment Documents - Application-based access
CREATE POLICY "Users can view documents for accessible applications" 
ON public.enrollment_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_documents.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR uploaded_by = auth.uid()
);

CREATE POLICY "Users can upload documents" 
ON public.enrollment_documents 
FOR INSERT 
WITH CHECK (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_documents.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Admins can manage documents" 
ON public.enrollment_documents 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_documents.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Enrollment Approvals - Role-based access
CREATE POLICY "Users can view approvals for accessible applications" 
ON public.enrollment_approvals 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_approvals.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR requested_by = auth.uid()
  OR assigned_approver = auth.uid()
);

CREATE POLICY "Users can create approval requests" 
ON public.enrollment_approvals 
FOR INSERT 
WITH CHECK (
  requested_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_approvals.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Assigned approvers can update approvals" 
ON public.enrollment_approvals 
FOR UPDATE 
USING (
  assigned_approver = auth.uid()
  OR is_super_admin(auth.uid())
  OR EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_approvals.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = 'school_admin'::app_role
    AND ur.is_active = true
  )
);

-- Enrollment Overrides - Admin access with approval
CREATE POLICY "Users can view overrides for accessible applications" 
ON public.enrollment_overrides 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_overrides.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR requested_by = auth.uid()
);

CREATE POLICY "Admins can create overrides" 
ON public.enrollment_overrides 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_overrides.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Super admins can approve overrides" 
ON public.enrollment_overrides 
FOR UPDATE 
USING (is_super_admin(auth.uid()));

-- Enrollment Bulk Operations - School admin access
CREATE POLICY "Users can view bulk operations in their school" 
ON public.enrollment_bulk_operations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = enrollment_bulk_operations.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR initiated_by = auth.uid()
);

CREATE POLICY "Admins can manage bulk operations" 
ON public.enrollment_bulk_operations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = enrollment_bulk_operations.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Enrollment Assessments - Application-based access
CREATE POLICY "Users can view assessments for accessible applications" 
ON public.enrollment_assessments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_assessments.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR assessed_by = auth.uid()
  OR scheduled_by = auth.uid()
);

CREATE POLICY "Admins can manage assessments" 
ON public.enrollment_assessments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_assessments.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Enrollment Payments - Application-based access
CREATE POLICY "Users can view payments for accessible applications" 
ON public.enrollment_payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_payments.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
  OR EXISTS (
    SELECT 1 FROM enrollment_applications ea
    WHERE ea.id = enrollment_payments.application_id
    AND ea.submitted_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage payments" 
ON public.enrollment_payments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM enrollment_applications ea
    JOIN user_roles ur ON ur.school_id = ea.school_id
    WHERE ea.id = enrollment_payments.application_id
    AND ur.user_id = auth.uid()
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'dsl'::app_role])
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);

-- Fix the function search path issue
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := 'APP' || DATE_PART('year', NOW()) || 
                              LPAD(NEXTVAL('application_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';