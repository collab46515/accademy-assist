-- Comprehensive End-to-End Recruitment System

-- Job Requisitions (Starting point of recruitment)
CREATE TABLE job_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_number TEXT UNIQUE NOT NULL,
  requesting_department_id UUID REFERENCES departments(id),
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  required_skills JSONB DEFAULT '[]'::jsonb,
  preferred_skills JSONB DEFAULT '[]'::jsonb,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern', 'temporary')),
  salary_range_min DECIMAL(12,2),
  salary_range_max DECIMAL(12,2),
  currency TEXT DEFAULT 'GBP',
  location TEXT,
  remote_work_allowed BOOLEAN DEFAULT false,
  urgent_priority BOOLEAN DEFAULT false,
  hiring_manager_id UUID REFERENCES employees(id),
  hr_partner_id UUID REFERENCES employees(id),
  requested_by UUID REFERENCES employees(id) NOT NULL,
  requested_date DATE DEFAULT CURRENT_DATE,
  target_start_date DATE,
  number_of_positions INTEGER DEFAULT 1,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'on_hold')),
  approved_by UUID REFERENCES employees(id),
  approved_date DATE,
  budget_allocated DECIMAL(12,2),
  justification TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'posted', 'in_progress', 'filled', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Job Postings (Enhanced version)
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS requisition_id UUID REFERENCES job_requisitions(id);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS posting_channels JSONB DEFAULT '[]'::jsonb;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS screening_questions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS external_job_boards JSONB DEFAULT '{}'::jsonb;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;

-- Candidate Pool (Talent Database)
CREATE TABLE candidate_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  current_company TEXT,
  current_position TEXT,
  location TEXT,
  willing_to_relocate BOOLEAN DEFAULT false,
  expected_salary_min DECIMAL(12,2),
  expected_salary_max DECIMAL(12,2),
  notice_period_weeks INTEGER,
  availability_date DATE,
  skills JSONB DEFAULT '[]'::jsonb,
  experience_years INTEGER,
  education_level TEXT,
  resume_url TEXT,
  cover_letter_url TEXT,
  source TEXT, -- referral, linkedin, job_board, website, etc.
  source_details JSONB DEFAULT '{}'::jsonb,
  tags TEXT[],
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'interested', 'not_interested', 'blacklisted')),
  added_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Job Applications
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS candidate_id UUID REFERENCES candidate_pool(id);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS application_source TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS screening_answers JSONB DEFAULT '{}'::jsonb;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_score INTEGER;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS auto_screening_passed BOOLEAN;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS rejection_feedback TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'applied';
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS priority_level INTEGER DEFAULT 1;

-- Interview Stages and Process
CREATE TABLE interview_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  stage_type TEXT CHECK (stage_type IN ('phone_screen', 'video_interview', 'in_person', 'technical_test', 'presentation', 'panel_interview', 'final_interview')),
  stage_order INTEGER NOT NULL,
  duration_minutes INTEGER,
  interviewers JSONB DEFAULT '[]'::jsonb, -- Array of employee IDs
  required_skills_focus JSONB DEFAULT '[]'::jsonb,
  evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interview Schedules
CREATE TABLE interview_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  interview_stage_id UUID REFERENCES interview_stages(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  interview_type TEXT CHECK (interview_type IN ('phone', 'video', 'in_person', 'technical')),
  location TEXT,
  meeting_link TEXT,
  interviewer_ids JSONB NOT NULL, -- Array of employee IDs
  interview_notes TEXT,
  candidate_feedback TEXT,
  interviewer_feedback JSONB DEFAULT '{}'::jsonb,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  recommendation TEXT CHECK (recommendation IN ('strong_hire', 'hire', 'neutral', 'no_hire', 'strong_no_hire')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assessment Tests
CREATE TABLE assessment_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  test_type TEXT CHECK (test_type IN ('technical', 'cognitive', 'personality', 'skills', 'culture_fit')),
  description TEXT,
  duration_minutes INTEGER,
  passing_score INTEGER,
  test_url TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Candidate Assessments
CREATE TABLE candidate_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  assessment_test_id UUID REFERENCES assessment_tests(id),
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  max_score INTEGER,
  percentage_score DECIMAL(5,2),
  detailed_results JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'expired', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reference Checks
CREATE TABLE reference_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  reference_name TEXT NOT NULL,
  reference_title TEXT,
  reference_company TEXT,
  reference_email TEXT,
  reference_phone TEXT,
  relationship_to_candidate TEXT,
  contacted_date DATE,
  response_date DATE,
  overall_recommendation TEXT CHECK (overall_recommendation IN ('highly_recommend', 'recommend', 'neutral', 'not_recommend', 'strongly_not_recommend')),
  feedback JSONB DEFAULT '{}'::jsonb,
  would_rehire BOOLEAN,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'contacted', 'completed', 'failed', 'declined')),
  notes TEXT,
  conducted_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Background Checks
CREATE TABLE background_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- criminal, education, employment, credit, drug_test, etc.
  vendor_name TEXT,
  initiated_date DATE DEFAULT CURRENT_DATE,
  completed_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  result TEXT CHECK (result IN ('clear', 'consider', 'failed', 'pending')),
  details JSONB DEFAULT '{}'::jsonb,
  document_url TEXT,
  cost DECIMAL(10,2),
  initiated_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Job Offers
CREATE TABLE job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  offer_letter_url TEXT,
  position_title TEXT NOT NULL,
  department TEXT,
  reporting_manager UUID REFERENCES employees(id),
  start_date DATE,
  base_salary DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  bonus_structure JSONB DEFAULT '{}'::jsonb,
  benefits_package JSONB DEFAULT '{}'::jsonb,
  equity_details JSONB DEFAULT '{}'::jsonb,
  work_arrangement TEXT CHECK (work_arrangement IN ('office', 'remote', 'hybrid')),
  probation_period_months INTEGER DEFAULT 6,
  notice_period_weeks INTEGER DEFAULT 4,
  offer_expiry_date DATE,
  special_conditions TEXT,
  negotiation_notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'withdrawn', 'expired')),
  sent_date DATE,
  response_date DATE,
  accepted_date DATE,
  rejected_reason TEXT,
  created_by UUID REFERENCES employees(id),
  approved_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Onboarding Checklists
CREATE TABLE onboarding_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  position_level TEXT,
  checklist_items JSONB NOT NULL, -- Array of tasks with deadlines
  document_requirements JSONB DEFAULT '[]'::jsonb,
  equipment_requirements JSONB DEFAULT '[]'::jsonb,
  training_modules JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Onboarding Progress
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_offer_id UUID REFERENCES job_offers(id),
  onboarding_template_id UUID REFERENCES onboarding_templates(id),
  new_hire_email TEXT NOT NULL,
  start_date DATE NOT NULL,
  buddy_assigned UUID REFERENCES employees(id),
  hr_contact UUID REFERENCES employees(id),
  checklist_progress JSONB DEFAULT '{}'::jsonb,
  completion_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recruitment Analytics
CREATE TABLE recruitment_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id UUID REFERENCES job_postings(id),
  metric_date DATE DEFAULT CURRENT_DATE,
  applications_received INTEGER DEFAULT 0,
  qualified_candidates INTEGER DEFAULT 0,
  interviews_conducted INTEGER DEFAULT 0,
  offers_made INTEGER DEFAULT 0,
  offers_accepted INTEGER DEFAULT 0,
  cost_per_hire DECIMAL(10,2),
  time_to_hire_days INTEGER,
  source_breakdown JSONB DEFAULT '{}'::jsonb,
  stage_conversion_rates JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_job_requisitions_status ON job_requisitions(status);
CREATE INDEX idx_job_requisitions_department ON job_requisitions(requesting_department_id);
CREATE INDEX idx_candidate_pool_email ON candidate_pool(email);
CREATE INDEX idx_candidate_pool_skills ON candidate_pool USING GIN(skills);
CREATE INDEX idx_job_applications_candidate ON job_applications(candidate_id);
CREATE INDEX idx_job_applications_stage ON job_applications(current_stage);
CREATE INDEX idx_interview_schedules_date ON interview_schedules(scheduled_date);
CREATE INDEX idx_candidate_assessments_status ON candidate_assessments(status);
CREATE INDEX idx_job_offers_status ON job_offers(status);

-- Add triggers for updated_at
CREATE TRIGGER update_job_requisitions_updated_at BEFORE UPDATE ON job_requisitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_pool_updated_at BEFORE UPDATE ON candidate_pool FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_stages_updated_at BEFORE UPDATE ON interview_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_schedules_updated_at BEFORE UPDATE ON interview_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_tests_updated_at BEFORE UPDATE ON assessment_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_assessments_updated_at BEFORE UPDATE ON candidate_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reference_checks_updated_at BEFORE UPDATE ON reference_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_background_checks_updated_at BEFORE UPDATE ON background_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_offers_updated_at BEFORE UPDATE ON job_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_templates_updated_at BEFORE UPDATE ON onboarding_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON onboarding_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();