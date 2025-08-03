-- Create enrollment types configuration table
CREATE TYPE enrollment_pathway AS ENUM (
  'standard_digital',
  'sibling_automatic', 
  'internal_progression',
  'staff_child',
  'partner_school',
  'emergency_safeguarding'
);

CREATE TYPE enrollment_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'documents_pending',
  'assessment_scheduled',
  'assessment_complete',
  'interview_scheduled', 
  'interview_complete',
  'pending_approval',
  'approved',
  'offer_sent',
  'offer_accepted',
  'offer_declined',
  'enrolled',
  'rejected',
  'withdrawn',
  'on_hold',
  'requires_override'
);

CREATE TYPE approval_status AS ENUM (
  'pending',
  'approved', 
  'rejected',
  'escalated'
);

CREATE TYPE override_reason AS ENUM (
  'policy_exception',
  'emergency_circumstances',
  'safeguarding_priority',
  'staff_discretion',
  'technical_issue',
  'data_correction'
);

-- Core enrollment types configuration
CREATE TABLE public.enrollment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pathway enrollment_pathway NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_assessment BOOLEAN NOT NULL DEFAULT true,
  requires_interview BOOLEAN NOT NULL DEFAULT true,
  requires_payment BOOLEAN NOT NULL DEFAULT true,
  auto_approve_siblings BOOLEAN NOT NULL DEFAULT false,
  priority_level INTEGER NOT NULL DEFAULT 1,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Main enrollment applications table
CREATE TABLE public.enrollment_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number TEXT NOT NULL UNIQUE,
  pathway enrollment_pathway NOT NULL,
  status enrollment_status NOT NULL DEFAULT 'draft',
  priority_score INTEGER DEFAULT 0,
  
  -- Student information
  student_name TEXT NOT NULL,
  student_email TEXT,
  student_phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  gender TEXT,
  year_group TEXT NOT NULL,
  house_preference TEXT,
  form_class_preference TEXT,
  
  -- Parent/Guardian information
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,
  parent_relationship TEXT DEFAULT 'Parent',
  
  -- Emergency contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Address information
  home_address TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United Kingdom',
  
  -- Academic information
  previous_school TEXT,
  current_year_group TEXT,
  academic_notes TEXT,
  special_requirements TEXT,
  medical_information TEXT,
  
  -- Application metadata
  source_school_id UUID, -- For partner school applications
  referring_staff_id UUID, -- For staff child applications
  sibling_student_id UUID, -- For sibling applications
  bulk_operation_id UUID, -- For bulk operations
  
  -- Workflow tracking
  current_workflow_step UUID,
  workflow_completion_percentage INTEGER DEFAULT 0,
  
  -- Financial
  fee_status TEXT DEFAULT 'full_fees',
  bursary_application BOOLEAN DEFAULT false,
  scholarship_application BOOLEAN DEFAULT false,
  
  -- System fields
  school_id UUID NOT NULL,
  submitted_by UUID,
  assigned_to UUID,
  submitted_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Flexible data storage
  additional_data JSONB DEFAULT '{}',
  
  CONSTRAINT fk_enrollment_school FOREIGN KEY (school_id) REFERENCES schools(id),
  CONSTRAINT fk_enrollment_submitted_by FOREIGN KEY (submitted_by) REFERENCES profiles(user_id),
  CONSTRAINT fk_enrollment_assigned_to FOREIGN KEY (assigned_to) REFERENCES profiles(user_id)
);

-- Workflow definitions
CREATE TABLE public.enrollment_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pathway enrollment_pathway NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  steps_config JSONB NOT NULL DEFAULT '[]',
  approval_matrix JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual workflow steps
CREATE TABLE public.enrollment_workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL,
  application_id UUID NOT NULL,
  step_name TEXT NOT NULL,
  step_type TEXT NOT NULL, -- 'document_upload', 'assessment', 'interview', 'approval', 'payment'
  status enrollment_status NOT NULL DEFAULT 'draft',
  order_index INTEGER NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  can_skip BOOLEAN NOT NULL DEFAULT false,
  
  -- Step-specific data
  step_data JSONB DEFAULT '{}',
  
  -- Tracking
  assigned_to UUID,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_workflow_step_workflow FOREIGN KEY (workflow_id) REFERENCES enrollment_workflows(id) ON DELETE CASCADE,
  CONSTRAINT fk_workflow_step_application FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_workflow_step_assigned_to FOREIGN KEY (assigned_to) REFERENCES profiles(user_id)
);

-- Document management
CREATE TABLE public.enrollment_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  document_type TEXT NOT NULL, -- 'birth_certificate', 'passport', 'school_reports', etc.
  document_name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_enrollment_document_application FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_document_verified_by FOREIGN KEY (verified_by) REFERENCES profiles(user_id),
  CONSTRAINT fk_enrollment_document_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES profiles(user_id)
);

-- Approval tracking
CREATE TABLE public.enrollment_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  workflow_step_id UUID,
  approval_type TEXT NOT NULL, -- 'workflow_step', 'override', 'final_approval'
  status approval_status NOT NULL DEFAULT 'pending',
  priority_level INTEGER DEFAULT 1,
  
  -- Approval details
  requested_by UUID NOT NULL,
  approver_role TEXT,
  assigned_approver UUID,
  approved_by UUID,
  
  -- Content
  request_reason TEXT,
  approval_notes TEXT,
  conditions TEXT,
  
  -- Timing
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  approval_data JSONB DEFAULT '{}',
  
  CONSTRAINT fk_enrollment_approval_application FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_approval_workflow_step FOREIGN KEY (workflow_step_id) REFERENCES enrollment_workflow_steps(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_approval_requested_by FOREIGN KEY (requested_by) REFERENCES profiles(user_id),
  CONSTRAINT fk_enrollment_approval_assigned_approver FOREIGN KEY (assigned_approver) REFERENCES profiles(user_id),
  CONSTRAINT fk_enrollment_approval_approved_by FOREIGN KEY (approved_by) REFERENCES profiles(user_id)
);

-- Override tracking
CREATE TABLE public.enrollment_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  override_type override_reason NOT NULL,
  field_name TEXT NOT NULL,
  original_value TEXT,
  override_value TEXT NOT NULL,
  
  -- Justification
  reason TEXT NOT NULL,
  justification TEXT,
  supporting_evidence TEXT,
  
  -- Approval
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  approval_id UUID,
  
  -- Tracking
  requested_by UUID NOT NULL,
  approved_by UUID,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- System
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_enrollment_override_application FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_override_approval FOREIGN KEY (approval_id) REFERENCES enrollment_approvals(id),
  CONSTRAINT fk_enrollment_override_requested_by FOREIGN KEY (requested_by) REFERENCES profiles(user_id),
  CONSTRAINT fk_enrollment_override_approved_by FOREIGN KEY (approved_by) REFERENCES profiles(user_id)
);

-- Bulk operations tracking
CREATE TABLE public.enrollment_bulk_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL, -- 'year_progression', 'partner_import', 'bulk_approval'
  operation_name TEXT NOT NULL,
  pathway enrollment_pathway,
  
  -- Configuration
  source_data JSONB, -- For CSV imports, progression rules, etc.
  operation_config JSONB DEFAULT '{}',
  
  -- Progress tracking
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  successful_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
  error_log JSONB DEFAULT '[]',
  
  -- Tracking
  school_id UUID NOT NULL,
  initiated_by UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_bulk_operation_school FOREIGN KEY (school_id) REFERENCES schools(id),
  CONSTRAINT fk_bulk_operation_initiated_by FOREIGN KEY (initiated_by) REFERENCES profiles(user_id)
);

-- Assessment results
CREATE TABLE public.enrollment_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  assessment_type TEXT NOT NULL, -- 'cat4', 'entrance_exam', 'portfolio_review'
  assessment_date DATE,
  
  -- Results
  overall_score DECIMAL(5,2),
  subject_scores JSONB DEFAULT '{}',
  recommendations TEXT,
  assessor_notes TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
  
  -- Tracking
  scheduled_by UUID,
  assessed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_enrollment_assessment_application FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_assessment_scheduled_by FOREIGN KEY (scheduled_by) REFERENCES profiles(user_id),
  CONSTRAINT fk_enrollment_assessment_assessed_by FOREIGN KEY (assessed_by) REFERENCES profiles(user_id)
);

-- Payment tracking
CREATE TABLE public.enrollment_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  payment_type TEXT NOT NULL, -- 'application_fee', 'deposit', 'registration_fee'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  
  -- Payment details
  stripe_payment_intent_id TEXT,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  
  -- Tracking
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Metadata
  payment_metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_enrollment_payment_application FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE public.enrollment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_payments ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_enrollment_applications_pathway ON public.enrollment_applications(pathway);
CREATE INDEX idx_enrollment_applications_status ON public.enrollment_applications(status);
CREATE INDEX idx_enrollment_applications_school_id ON public.enrollment_applications(school_id);
CREATE INDEX idx_enrollment_applications_submitted_at ON public.enrollment_applications(submitted_at);
CREATE INDEX idx_enrollment_applications_last_activity ON public.enrollment_applications(last_activity_at);
CREATE INDEX idx_enrollment_workflow_steps_application_id ON public.enrollment_workflow_steps(application_id);
CREATE INDEX idx_enrollment_documents_application_id ON public.enrollment_documents(application_id);
CREATE INDEX idx_enrollment_approvals_application_id ON public.enrollment_approvals(application_id);
CREATE INDEX idx_enrollment_approvals_status ON public.enrollment_approvals(status);

-- Insert default enrollment types
INSERT INTO public.enrollment_types (pathway, name, description, requires_assessment, requires_interview, requires_payment, priority_level, settings) VALUES
('standard_digital', 'Standard Digital Admissions', 'Full online application process for external families', true, true, true, 1, '{"assessment_types": ["cat4", "entrance_exam"], "required_documents": ["birth_certificate", "school_reports", "passport"], "interview_required": true}'),
('sibling_automatic', 'Sibling Automatic Enrolment', 'Priority enrollment for siblings of current students', false, false, true, 2, '{"auto_approve": false, "reduced_assessment": true, "same_house_placement": true}'),
('internal_progression', 'Internal Year Group Progression', 'Automatic promotion between year groups', false, false, false, 3, '{"batch_processing": true, "auto_assign_classes": true, "retain_pastoral_data": true}'),
('staff_child', 'Staff Child Placement', 'Preferential entry for children of staff members', false, false, false, 4, '{"fee_waiver": true, "fast_track": true, "minimal_requirements": true}'),
('partner_school', 'Partner School Acquisition', 'Bulk intake from feeder/partner schools', true, false, true, 2, '{"bulk_import": true, "partner_verification": true, "group_processing": true}'),
('emergency_safeguarding', 'Emergency/Safeguarding Referral', 'Urgent enrollment for vulnerable children', false, false, false, 5, '{"immediate_placement": true, "dsl_assignment": true, "minimal_data_required": true, "no_fees": true}');

-- Insert default workflows for each pathway
INSERT INTO public.enrollment_workflows (pathway, name, description, is_default, steps_config) VALUES
('standard_digital', 'Standard Digital Application Workflow', 'Complete application process with assessment and interview', true, '[
  {"step": "document_upload", "name": "Document Upload", "required": true, "order": 1},
  {"step": "assessment", "name": "Academic Assessment", "required": true, "order": 2},
  {"step": "interview", "name": "Interview", "required": true, "order": 3},
  {"step": "approval", "name": "Admissions Decision", "required": true, "order": 4},
  {"step": "payment", "name": "Deposit Payment", "required": true, "order": 5}
]'),
('sibling_automatic', 'Sibling Enrollment Workflow', 'Streamlined process for sibling applications', true, '[
  {"step": "verification", "name": "Sibling Verification", "required": true, "order": 1},
  {"step": "document_upload", "name": "Essential Documents", "required": true, "order": 2},
  {"step": "approval", "name": "Priority Approval", "required": true, "order": 3},
  {"step": "payment", "name": "Registration Fee", "required": true, "order": 4}
]'),
('internal_progression', 'Year Group Progression Workflow', 'Bulk promotion workflow', true, '[
  {"step": "eligibility_check", "name": "Eligibility Verification", "required": true, "order": 1},
  {"step": "class_assignment", "name": "Class Assignment", "required": true, "order": 2},
  {"step": "parent_notification", "name": "Parent Notification", "required": true, "order": 3}
]'),
('staff_child', 'Staff Child Enrollment Workflow', 'Fast-track process for staff children', true, '[
  {"step": "staff_verification", "name": "Staff Employment Verification", "required": true, "order": 1},
  {"step": "basic_documents", "name": "Basic Documentation", "required": true, "order": 2},
  {"step": "placement", "name": "Class Placement", "required": true, "order": 3}
]'),
('partner_school', 'Partner School Import Workflow', 'Bulk processing for partner school students', true, '[
  {"step": "data_import", "name": "Student Data Import", "required": true, "order": 1},
  {"step": "verification", "name": "Data Verification", "required": true, "order": 2},
  {"step": "parent_contact", "name": "Parent Contact & Documents", "required": true, "order": 3},
  {"step": "batch_approval", "name": "Batch Approval", "required": true, "order": 4}
]'),
('emergency_safeguarding', 'Emergency Enrollment Workflow', 'Urgent placement process', true, '[
  {"step": "referral_verification", "name": "Referral Verification", "required": true, "order": 1},
  {"step": "immediate_placement", "name": "Immediate Class Placement", "required": true, "order": 2},
  {"step": "dsl_assignment", "name": "DSL Assignment", "required": true, "order": 3},
  {"step": "support_setup", "name": "Support Services Setup", "required": true, "order": 4}
]');

-- Create triggers for automatic timestamps
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

CREATE TRIGGER update_enrollment_assessments_updated_at
  BEFORE UPDATE ON public.enrollment_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Automatic application number generation function
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := 'APP' || DATE_PART('year', NOW()) || 
                              LPAD(NEXTVAL('application_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for application numbers
CREATE SEQUENCE IF NOT EXISTS application_number_seq START 1;

-- Create trigger for application number generation
CREATE TRIGGER generate_application_number_trigger
  BEFORE INSERT ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_application_number();