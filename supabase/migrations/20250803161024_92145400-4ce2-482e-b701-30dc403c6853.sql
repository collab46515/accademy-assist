-- Performance Management Tables
CREATE TABLE public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  reviewer_id UUID NOT NULL REFERENCES public.employees(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  review_type TEXT NOT NULL CHECK (review_type IN ('annual', 'quarterly', 'probation', 'project')),
  overall_rating DECIMAL(3,2),
  goals_achievement DECIMAL(3,2),
  strengths TEXT,
  areas_for_improvement TEXT,
  development_plan TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'final')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.performance_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  goal_title TEXT NOT NULL,
  goal_description TEXT,
  target_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL CHECK (category IN ('performance', 'development', 'behavioral')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_by UUID NOT NULL REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recruitment & Hiring Tables
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  job_description TEXT NOT NULL,
  requirements TEXT,
  salary_range_min DECIMAL(15,2),
  salary_range_max DECIMAL(15,2),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
  location TEXT,
  posting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  closing_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'filled')),
  posted_by UUID NOT NULL REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  application_status TEXT NOT NULL DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'screening', 'interview', 'offered', 'hired', 'rejected')),
  interview_scheduled_at TIMESTAMP WITH TIME ZONE,
  interviewer_id UUID REFERENCES public.employees(id),
  interview_notes TEXT,
  application_score INTEGER CHECK (application_score >= 1 AND application_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training & Development Tables
CREATE TABLE public.training_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_title TEXT NOT NULL,
  course_description TEXT,
  course_provider TEXT,
  course_type TEXT NOT NULL CHECK (course_type IN ('online', 'in_person', 'hybrid')),
  duration_hours INTEGER,
  cost_per_person DECIMAL(10,2),
  max_participants INTEGER,
  course_materials JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.training_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  course_id UUID NOT NULL REFERENCES public.training_courses(id),
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_date DATE,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  final_score DECIMAL(5,2),
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Benefits Management Tables
CREATE TABLE public.benefit_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('health', 'dental', 'vision', 'retirement', 'life_insurance', 'disability')),
  provider_name TEXT,
  plan_description TEXT,
  employee_contribution DECIMAL(10,2),
  employer_contribution DECIMAL(10,2),
  coverage_details JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.employee_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  benefit_plan_id UUID NOT NULL REFERENCES public.benefit_plans(id),
  enrollment_date DATE NOT NULL,
  coverage_start_date DATE NOT NULL,
  coverage_end_date DATE,
  beneficiaries JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document Management Tables
CREATE TABLE public.document_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_confidential BOOLEAN DEFAULT false,
  retention_period_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.employee_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  category_id UUID NOT NULL REFERENCES public.document_categories(id),
  document_name TEXT NOT NULL,
  document_type TEXT,
  file_path TEXT,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES public.employees(id),
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES public.employees(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  access_level TEXT NOT NULL DEFAULT 'private' CHECK (access_level IN ('private', 'hr_only', 'manager', 'public')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Asset Management Tables
CREATE TABLE public.asset_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  description TEXT,
  depreciation_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.company_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_tag TEXT NOT NULL UNIQUE,
  asset_name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.asset_categories(id),
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_cost DECIMAL(15,2),
  current_value DECIMAL(15,2),
  location TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
  assigned_to UUID REFERENCES public.employees(id),
  assignment_date DATE,
  warranty_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Time Tracking Tables
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_code TEXT UNIQUE,
  description TEXT,
  client_name TEXT,
  start_date DATE,
  end_date DATE,
  project_manager_id UUID REFERENCES public.employees(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  budget DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  project_id UUID REFERENCES public.projects(id),
  task_description TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  hours_worked DECIMAL(5,2),
  is_billable BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'billed')),
  approved_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Travel & Expense Management Tables
CREATE TABLE public.travel_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  trip_purpose TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  estimated_cost DECIMAL(15,2),
  accommodation_required BOOLEAN DEFAULT false,
  transportation_type TEXT CHECK (transportation_type IN ('flight', 'train', 'car', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  approved_by UUID REFERENCES public.employees(id),
  approval_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.expense_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  travel_request_id UUID REFERENCES public.travel_requests(id),
  report_title TEXT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'reimbursed')),
  approved_by UUID REFERENCES public.employees(id),
  approval_date DATE,
  reimbursement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.expense_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_report_id UUID NOT NULL REFERENCES public.expense_reports(id),
  expense_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('meals', 'accommodation', 'transport', 'supplies', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_url TEXT,
  is_reimbursable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employee Engagement Tables
CREATE TABLE public.engagement_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_title TEXT NOT NULL,
  survey_description TEXT,
  survey_questions JSONB NOT NULL DEFAULT '[]',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  target_departments JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_by UUID NOT NULL REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES public.engagement_surveys(id),
  employee_id UUID REFERENCES public.employees(id), -- NULL if anonymous
  responses JSONB NOT NULL DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
CREATE POLICY "HR can manage performance reviews" ON public.performance_reviews
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own performance data" ON public.performance_reviews
FOR SELECT USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "HR can manage all job postings" ON public.job_postings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Anyone can view active job postings" ON public.job_postings
FOR SELECT USING (status = 'active');

CREATE POLICY "HR can manage applications" ON public.job_applications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

-- Add triggers for updated_at columns
CREATE TRIGGER update_performance_reviews_updated_at
BEFORE UPDATE ON public.performance_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_goals_updated_at
BEFORE UPDATE ON public.performance_goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_courses_updated_at
BEFORE UPDATE ON public.training_courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_enrollments_updated_at
BEFORE UPDATE ON public.training_enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_benefit_plans_updated_at
BEFORE UPDATE ON public.benefit_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_benefits_updated_at
BEFORE UPDATE ON public.employee_benefits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_documents_updated_at
BEFORE UPDATE ON public.employee_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_assets_updated_at
BEFORE UPDATE ON public.company_assets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
BEFORE UPDATE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_travel_requests_updated_at
BEFORE UPDATE ON public.travel_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expense_reports_updated_at
BEFORE UPDATE ON public.expense_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_engagement_surveys_updated_at
BEFORE UPDATE ON public.engagement_surveys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();