-- Create enrollment types lookup table
CREATE TABLE public.enrollment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'external', 'internal', 'priority', 'bulk', 'emergency'
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}', -- Flexible configuration per type
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create main enrollment applications table
CREATE TABLE public.enrollment_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number TEXT NOT NULL UNIQUE,
  enrollment_type_id UUID NOT NULL REFERENCES public.enrollment_types(id),
  school_id UUID NOT NULL REFERENCES public.schools(id),
  status TEXT NOT NULL DEFAULT 'draft', -- draft, submitted, under_review, approved, rejected, enrolled, withdrawn
  priority_level INTEGER NOT NULL DEFAULT 5, -- 1=highest, 5=normal, 10=lowest
  
  -- Student Information
  student_first_name TEXT,
  student_last_name TEXT,
  student_dob DATE,
  student_gender TEXT,
  year_group TEXT,
  form_class TEXT,
  house TEXT,
  
  -- Parent/Guardian Information
  primary_parent_id UUID, -- References profiles.user_id when parent has account
  primary_parent_first_name TEXT,
  primary_parent_last_name TEXT,
  primary_parent_email TEXT,
  primary_parent_phone TEXT,
  
  -- Application Data (flexible JSONB for different enrollment types)
  application_data JSONB NOT NULL DEFAULT '{}',
  
  -- Workflow tracking
  current_step TEXT,
  workflow_data JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  source TEXT, -- 'online_portal', 'admin_created', 'bulk_import', 'partner_school', 'referral'
  referral_source TEXT,
  notes TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  enrolled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Foreign keys
  created_by UUID REFERENCES public.profiles(user_id),
  assigned_to UUID REFERENCES public.profiles(user_id)
);

-- Create enrollment workflows table
CREATE TABLE public.enrollment_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_type_id UUID NOT NULL REFERENCES public.enrollment_types(id),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  steps JSONB NOT NULL DEFAULT '[]', -- Array of step configurations
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollment workflow steps tracking
CREATE TABLE public.enrollment_workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  step_code TEXT NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, skipped, failed
  assigned_to UUID REFERENCES public.profiles(user_id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES public.profiles(user_id),
  step_data JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollment documents table
CREATE TABLE public.enrollment_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'birth_certificate', 'passport', 'school_report', 'medical_form', etc.
  document_name TEXT NOT NULL,
  file_path TEXT, -- Storage path
  file_size INTEGER,
  mime_type TEXT,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES public.profiles(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollment approvals table (for override and approval tracking)
CREATE TABLE public.enrollment_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL, -- 'standard', 'override', 'emergency', 'bulk'
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  requested_by UUID NOT NULL REFERENCES public.profiles(user_id),
  approved_by UUID REFERENCES public.profiles(user_id),
  reason TEXT,
  comments TEXT,
  override_data JSONB DEFAULT '{}', -- What was overridden
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollment bulk operations table
CREATE TABLE public.enrollment_bulk_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL, -- 'import', 'promotion', 'transfer'
  school_id UUID NOT NULL REFERENCES public.schools(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  total_records INTEGER NOT NULL DEFAULT 0,
  processed_records INTEGER NOT NULL DEFAULT 0,
  failed_records INTEGER NOT NULL DEFAULT 0,
  operation_data JSONB NOT NULL DEFAULT '{}',
  error_log JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollment assessments table
CREATE TABLE public.enrollment_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'cat4', 'entrance_exam', 'interview', 'portfolio'
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, waived
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  assessor_id UUID REFERENCES public.profiles(user_id),
  results JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollment payments table
CREATE TABLE public.enrollment_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL, -- 'deposit', 'registration_fee', 'assessment_fee'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded, waived
  payment_method TEXT, -- 'card', 'bank_transfer', 'cash', 'waived'
  payment_reference TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.enrollment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enrollment_types
CREATE POLICY "Anyone can view active enrollment types" ON public.enrollment_types
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage enrollment types" ON public.enrollment_types
FOR ALL USING (has_permission(auth.uid(), (SELECT school_id FROM user_roles WHERE user_id = auth.uid() LIMIT 1), 'admissions'::resource_type, 'write'::permission_type));

-- RLS Policies for enrollment_applications
CREATE POLICY "Users can view applications they created" ON public.enrollment_applications
FOR SELECT USING (created_by = auth.uid() OR primary_parent_id = auth.uid());

CREATE POLICY "Admissions staff can view school applications" ON public.enrollment_applications
FOR SELECT USING (has_permission(auth.uid(), school_id, 'admissions'::resource_type, 'read'::permission_type));

CREATE POLICY "Users can create applications" ON public.enrollment_applications
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admissions staff can manage applications" ON public.enrollment_applications
FOR ALL USING (has_permission(auth.uid(), school_id, 'admissions'::resource_type, 'write'::permission_type));

-- RLS Policies for enrollment_workflows
CREATE POLICY "Admissions staff can view workflows" ON public.enrollment_workflows
FOR SELECT USING (has_permission(auth.uid(), (SELECT school_id FROM user_roles WHERE user_id = auth.uid() LIMIT 1), 'admissions'::resource_type, 'read'::permission_type));

CREATE POLICY "Admins can manage workflows" ON public.enrollment_workflows
FOR ALL USING (has_permission(auth.uid(), (SELECT school_id FROM user_roles WHERE user_id = auth.uid() LIMIT 1), 'admissions'::resource_type, 'write'::permission_type));

-- RLS Policies for workflow steps
CREATE POLICY "Users can view workflow steps for their applications" ON public.enrollment_workflow_steps
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND (ea.created_by = auth.uid() OR ea.primary_parent_id = auth.uid())
  )
);

CREATE POLICY "Staff can view workflow steps for school applications" ON public.enrollment_workflow_steps
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'read'::permission_type)
  )
);

CREATE POLICY "Staff can manage workflow steps" ON public.enrollment_workflow_steps
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'write'::permission_type)
  )
);

-- RLS Policies for documents
CREATE POLICY "Users can view documents for their applications" ON public.enrollment_documents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND (ea.created_by = auth.uid() OR ea.primary_parent_id = auth.uid())
  )
);

CREATE POLICY "Staff can view documents for school applications" ON public.enrollment_documents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'read'::permission_type)
  )
);

CREATE POLICY "Users can upload documents for their applications" ON public.enrollment_documents
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND (ea.created_by = auth.uid() OR ea.primary_parent_id = auth.uid())
  )
);

CREATE POLICY "Staff can manage documents" ON public.enrollment_documents
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'write'::permission_type)
  )
);

-- RLS Policies for approvals
CREATE POLICY "Staff can view approvals for school applications" ON public.enrollment_approvals
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'read'::permission_type)
  )
);

CREATE POLICY "Staff can manage approvals" ON public.enrollment_approvals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'write'::permission_type)
  )
);

-- RLS Policies for bulk operations
CREATE POLICY "Staff can view bulk operations for their school" ON public.enrollment_bulk_operations
FOR SELECT USING (has_permission(auth.uid(), school_id, 'admissions'::resource_type, 'read'::permission_type));

CREATE POLICY "Staff can manage bulk operations" ON public.enrollment_bulk_operations
FOR ALL USING (has_permission(auth.uid(), school_id, 'admissions'::resource_type, 'write'::permission_type));

-- RLS Policies for assessments
CREATE POLICY "Users can view assessments for their applications" ON public.enrollment_assessments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND (ea.created_by = auth.uid() OR ea.primary_parent_id = auth.uid())
  )
);

CREATE POLICY "Staff can view assessments for school applications" ON public.enrollment_assessments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'read'::permission_type)
  )
);

CREATE POLICY "Staff can manage assessments" ON public.enrollment_assessments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'write'::permission_type)
  )
);

-- RLS Policies for payments
CREATE POLICY "Users can view payments for their applications" ON public.enrollment_payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND (ea.created_by = auth.uid() OR ea.primary_parent_id = auth.uid())
  )
);

CREATE POLICY "Staff can view payments for school applications" ON public.enrollment_payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'read'::permission_type)
  )
);

CREATE POLICY "Staff can manage payments" ON public.enrollment_payments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.enrollment_applications ea 
    WHERE ea.id = application_id 
    AND has_permission(auth.uid(), ea.school_id, 'admissions'::resource_type, 'write'::permission_type)
  )
);

-- Create indexes for performance
CREATE INDEX idx_enrollment_applications_school_id ON public.enrollment_applications(school_id);
CREATE INDEX idx_enrollment_applications_status ON public.enrollment_applications(status);
CREATE INDEX idx_enrollment_applications_enrollment_type ON public.enrollment_applications(enrollment_type_id);
CREATE INDEX idx_enrollment_applications_created_by ON public.enrollment_applications(created_by);
CREATE INDEX idx_enrollment_applications_primary_parent ON public.enrollment_applications(primary_parent_id);
CREATE INDEX idx_enrollment_workflow_steps_application_id ON public.enrollment_workflow_steps(application_id);
CREATE INDEX idx_enrollment_workflow_steps_status ON public.enrollment_workflow_steps(status);
CREATE INDEX idx_enrollment_documents_application_id ON public.enrollment_documents(application_id);
CREATE INDEX idx_enrollment_approvals_application_id ON public.enrollment_approvals(application_id);
CREATE INDEX idx_enrollment_assessments_application_id ON public.enrollment_assessments(application_id);
CREATE INDEX idx_enrollment_payments_application_id ON public.enrollment_payments(application_id);

-- Insert default enrollment types
INSERT INTO public.enrollment_types (code, name, description, category, config) VALUES
('standard_external', 'Standard Digital Admissions', 'For new external families applying online', 'external', '{
  "requires_assessment": true,
  "requires_interview": true,
  "requires_documents": ["birth_certificate", "passport", "school_reports"],
  "requires_payment": true,
  "workflow_steps": ["application", "documents", "assessment", "interview", "decision", "payment", "enrollment"]
}'),
('sibling_auto', 'Sibling Automatic Enrolment', 'For younger siblings of current students with priority entry', 'priority', '{
  "requires_assessment": false,
  "requires_interview": false,
  "requires_documents": ["birth_certificate", "medical_form"],
  "requires_payment": true,
  "workflow_steps": ["application", "documents", "admin_review", "decision", "payment", "enrollment"],
  "auto_assign_house": true
}'),
('year_progression', 'Internal Year Group Progression', 'For students moving to the next key stage within the same school', 'internal', '{
  "requires_assessment": false,
  "requires_interview": false,
  "requires_documents": [],
  "requires_payment": false,
  "workflow_steps": ["promotion", "timetable_assignment", "notification"],
  "bulk_operation": true
}'),
('staff_child', 'Staff Child Placement', 'For children of teachers and staff with preferential entry', 'priority', '{
  "requires_assessment": false,
  "requires_interview": false,
  "requires_documents": ["birth_certificate", "medical_form"],
  "requires_payment": false,
  "workflow_steps": ["hr_verification", "admin_approval", "placement", "enrollment"],
  "fee_waiver": true
}'),
('partner_school', 'Partner School Acquisition', 'For bulk intake from feeder or partner schools', 'bulk', '{
  "requires_assessment": false,
  "requires_interview": false,
  "requires_documents": ["transfer_form"],
  "requires_payment": true,
  "workflow_steps": ["bulk_import", "parent_completion", "admin_review", "enrollment"],
  "bulk_operation": true
}'),
('emergency_referral', 'Emergency / Safeguarding Referral', 'For vulnerable children referred by LA, social services, or DSL network', 'emergency', '{
  "requires_assessment": false,
  "requires_interview": false,
  "requires_documents": [],
  "requires_payment": false,
  "workflow_steps": ["referral_received", "immediate_placement", "documentation", "support_setup"],
  "expedited": true,
  "fee_waiver": true
}');

-- Create function to generate application numbers
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TEXT AS $$
DECLARE
  year_code TEXT;
  sequence_num INTEGER;
  application_number TEXT;
BEGIN
  -- Get current academic year (Sept-Aug)
  year_code := CASE 
    WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 9 
    THEN CONCAT(EXTRACT(YEAR FROM CURRENT_DATE), '/', RIGHT((EXTRACT(YEAR FROM CURRENT_DATE) + 1)::TEXT, 2))
    ELSE CONCAT(EXTRACT(YEAR FROM CURRENT_DATE) - 1, '/', RIGHT(EXTRACT(YEAR FROM CURRENT_DATE)::TEXT, 2))
  END;
  
  -- Get next sequence number for this academic year
  SELECT COALESCE(MAX(
    CASE 
      WHEN application_number ~ '^[0-9]{4}/[0-9]{2}-[0-9]+$' 
      THEN (regexp_split_to_array(application_number, '-'))[2]::INTEGER
      ELSE 0 
    END
  ), 0) + 1
  INTO sequence_num
  FROM public.enrollment_applications
  WHERE application_number LIKE year_code || '-%';
  
  -- Format: 2024/25-0001
  application_number := year_code || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN application_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate application numbers
CREATE OR REPLACE FUNCTION public.set_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
    NEW.application_number := public.generate_application_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_number_trigger
  BEFORE INSERT ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_application_number();

-- Create updated_at triggers for all tables
CREATE TRIGGER update_enrollment_types_updated_at
  BEFORE UPDATE ON public.enrollment_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_applications_updated_at
  BEFORE UPDATE ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_workflows_updated_at
  BEFORE UPDATE ON public.enrollment_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_workflow_steps_updated_at
  BEFORE UPDATE ON public.enrollment_workflow_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_documents_updated_at
  BEFORE UPDATE ON public.enrollment_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_bulk_operations_updated_at
  BEFORE UPDATE ON public.enrollment_bulk_operations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_assessments_updated_at
  BEFORE UPDATE ON public.enrollment_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollment_payments_updated_at
  BEFORE UPDATE ON public.enrollment_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();