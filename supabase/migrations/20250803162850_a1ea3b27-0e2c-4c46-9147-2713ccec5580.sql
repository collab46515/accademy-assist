-- Create comprehensive recruitment system tables

-- Job requisitions (formal request to hire)
CREATE TABLE public.job_requisitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requisition_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  reporting_manager_id UUID REFERENCES public.employees(id),
  justification TEXT,
  urgency_level TEXT NOT NULL DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  budget_allocated NUMERIC,
  headcount_requested INTEGER NOT NULL DEFAULT 1,
  employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'temporary', 'internship')),
  location TEXT,
  remote_work_option BOOLEAN DEFAULT false,
  salary_range_min NUMERIC,
  salary_range_max NUMERIC,
  required_start_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'on_hold', 'cancelled', 'filled')),
  approved_by UUID REFERENCES public.employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  requested_by UUID REFERENCES public.employees(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced candidate pool
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  current_location TEXT,
  willing_to_relocate BOOLEAN DEFAULT false,
  current_salary NUMERIC,
  expected_salary NUMERIC,
  notice_period_weeks INTEGER,
  availability_date DATE,
  source TEXT CHECK (source IN ('website', 'linkedin', 'referral', 'agency', 'job_board', 'social_media', 'career_fair', 'other')),
  source_details TEXT,
  cv_file_path TEXT,
  cover_letter_file_path TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  experience_years NUMERIC,
  education JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'qualified', 'contacted', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced job applications
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number TEXT NOT NULL UNIQUE,
  job_posting_id UUID REFERENCES public.job_postings(id) NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) NOT NULL,
  requisition_id UUID REFERENCES public.job_requisitions(id),
  application_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'screening', 'phone_interview', 'technical_interview', 'final_interview', 'reference_check', 'background_check', 'offer_pending', 'offer_made', 'offer_accepted', 'offer_declined', 'hired', 'rejected', 'withdrawn')),
  current_stage TEXT,
  priority_level TEXT DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high')),
  assigned_recruiter_id UUID REFERENCES public.employees(id),
  screening_score NUMERIC,
  overall_rating NUMERIC CHECK (overall_rating >= 1 AND overall_rating <= 5),
  feedback TEXT,
  rejection_reason TEXT,
  application_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_posting_id, candidate_id)
);

-- Interview stages/rounds
CREATE TABLE public.interview_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID REFERENCES public.job_postings(id) NOT NULL,
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL,
  stage_type TEXT NOT NULL CHECK (stage_type IN ('phone_screening', 'video_interview', 'technical_test', 'in_person_interview', 'panel_interview', 'presentation', 'assessment_center')),
  duration_minutes INTEGER DEFAULT 60,
  is_required BOOLEAN DEFAULT true,
  description TEXT,
  evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Interview schedules
CREATE TABLE public.interview_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) NOT NULL,
  stage_id UUID REFERENCES public.interview_stages(id) NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location TEXT,
  meeting_link TEXT,
  interviewer_ids UUID[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show')),
  feedback TEXT,
  score NUMERIC CHECK (score >= 1 AND score <= 5),
  recommendation TEXT CHECK (recommendation IN ('strong_hire', 'hire', 'neutral', 'no_hire', 'strong_no_hire')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Assessment tests
CREATE TABLE public.assessment_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('technical', 'cognitive', 'personality', 'skills', 'language', 'custom')),
  description TEXT,
  duration_minutes INTEGER,
  passing_score NUMERIC,
  test_url TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Candidate assessments
CREATE TABLE public.candidate_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) NOT NULL,
  assessment_test_id UUID REFERENCES public.assessment_tests(id) NOT NULL,
  assigned_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score NUMERIC,
  max_score NUMERIC,
  percentage_score NUMERIC,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue', 'cancelled')),
  results JSONB DEFAULT '{}'::jsonb,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reference checks
CREATE TABLE public.reference_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) NOT NULL,
  reference_name TEXT NOT NULL,
  reference_title TEXT,
  reference_company TEXT,
  reference_email TEXT,
  reference_phone TEXT,
  relationship TEXT,
  contacted_date TIMESTAMP WITH TIME ZONE,
  response_received_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'declined', 'unreachable')),
  overall_rating NUMERIC CHECK (overall_rating >= 1 AND overall_rating <= 5),
  would_rehire BOOLEAN,
  feedback TEXT,
  notes TEXT,
  conducted_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Background checks
CREATE TABLE public.background_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('criminal', 'employment', 'education', 'credit', 'driving', 'drug_test', 'reference')),
  vendor TEXT,
  initiated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'clear', 'flag', 'fail', 'cancelled')),
  results JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  initiated_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job offers
CREATE TABLE public.job_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.job_applications(id) NOT NULL,
  offer_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  salary NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'temporary')),
  start_date DATE,
  benefits JSONB DEFAULT '{}'::jsonb,
  terms_and_conditions TEXT,
  offer_letter_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'declined', 'negotiating', 'withdrawn', 'expired')),
  candidate_response_date TIMESTAMP WITH TIME ZONE,
  negotiation_notes TEXT,
  final_salary NUMERIC,
  created_by UUID REFERENCES public.employees(id) NOT NULL,
  approved_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Onboarding templates
CREATE TABLE public.onboarding_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  job_role TEXT,
  checklist_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Onboarding progress
CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  template_id UUID REFERENCES public.onboarding_templates(id) NOT NULL,
  start_date DATE NOT NULL,
  expected_completion_date DATE,
  actual_completion_date DATE,
  progress_percentage NUMERIC DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_items JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
  buddy_assigned_id UUID REFERENCES public.employees(id),
  hr_contact_id UUID REFERENCES public.employees(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recruitment metrics
CREATE TABLE public.recruitment_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL,
  job_posting_id UUID REFERENCES public.job_postings(id),
  department_id UUID REFERENCES public.departments(id),
  applications_received INTEGER DEFAULT 0,
  candidates_screened INTEGER DEFAULT 0,
  interviews_conducted INTEGER DEFAULT 0,
  offers_made INTEGER DEFAULT 0,
  offers_accepted INTEGER DEFAULT 0,
  hires_made INTEGER DEFAULT 0,
  time_to_hire_days NUMERIC,
  cost_per_hire NUMERIC,
  source_breakdown JSONB DEFAULT '{}'::jsonb,
  quality_of_hire NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_job_requisitions_status ON public.job_requisitions(status);
CREATE INDEX idx_job_requisitions_department ON public.job_requisitions(department_id);
CREATE INDEX idx_candidates_status ON public.candidates(status);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_posting ON public.job_applications(job_posting_id);
CREATE INDEX idx_job_applications_candidate ON public.job_applications(candidate_id);
CREATE INDEX idx_interview_schedules_date ON public.interview_schedules(scheduled_date);
CREATE INDEX idx_candidate_assessments_status ON public.candidate_assessments(status);
CREATE INDEX idx_job_offers_status ON public.job_offers(status);
CREATE INDEX idx_onboarding_progress_employee ON public.onboarding_progress(employee_id);

-- Enable RLS on all tables
ALTER TABLE public.job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for HR and recruiting team access
CREATE POLICY "HR can manage job requisitions" ON public.job_requisitions FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage candidates" ON public.candidates FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage job applications" ON public.job_applications FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage interview stages" ON public.interview_stages FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage interview schedules" ON public.interview_schedules FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage assessment tests" ON public.assessment_tests FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage candidate assessments" ON public.candidate_assessments FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage reference checks" ON public.reference_checks FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage background checks" ON public.background_checks FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage job offers" ON public.job_offers FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage onboarding templates" ON public.onboarding_templates FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can manage onboarding progress" ON public.onboarding_progress FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

CREATE POLICY "HR can view recruitment metrics" ON public.recruitment_metrics FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
  AND ur.is_active = true
));

-- Create updated_at triggers for all tables
CREATE TRIGGER update_job_requisitions_updated_at
  BEFORE UPDATE ON public.job_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interview_stages_updated_at
  BEFORE UPDATE ON public.interview_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interview_schedules_updated_at
  BEFORE UPDATE ON public.interview_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_tests_updated_at
  BEFORE UPDATE ON public.assessment_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidate_assessments_updated_at
  BEFORE UPDATE ON public.candidate_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reference_checks_updated_at
  BEFORE UPDATE ON public.reference_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_background_checks_updated_at
  BEFORE UPDATE ON public.background_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_offers_updated_at
  BEFORE UPDATE ON public.job_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_templates_updated_at
  BEFORE UPDATE ON public.onboarding_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruitment_metrics_updated_at
  BEFORE UPDATE ON public.recruitment_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();