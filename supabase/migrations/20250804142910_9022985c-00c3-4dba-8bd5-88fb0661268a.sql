-- Create custom types for Student Welfare system
CREATE TYPE public.medical_visit_type AS ENUM ('routine_checkup', 'illness', 'injury', 'medication_administration', 'emergency', 'follow_up');
CREATE TYPE public.medical_visit_status AS ENUM ('pending', 'in_progress', 'completed', 'referred');
CREATE TYPE public.complaint_type AS ENUM ('academic', 'behavioral', 'facility', 'staff', 'bullying', 'discrimination', 'other');
CREATE TYPE public.complaint_status AS ENUM ('submitted', 'under_review', 'investigating', 'resolved', 'closed');
CREATE TYPE public.complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.safeguarding_concern_type AS ENUM ('physical_abuse', 'emotional_abuse', 'sexual_abuse', 'neglect', 'bullying', 'self_harm', 'domestic_violence', 'online_safety', 'other');
CREATE TYPE public.safeguarding_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.safeguarding_status AS ENUM ('reported', 'assessed', 'investigating', 'action_taken', 'monitoring', 'closed');

-- Create sequences for reference numbers
CREATE SEQUENCE public.medical_visit_ref_seq START 1000;
CREATE SEQUENCE public.complaint_ref_seq START 1000;
CREATE SEQUENCE public.safeguarding_ref_seq START 1000;

-- Medical/Infirmary Records
CREATE TABLE public.medical_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT NOT NULL DEFAULT 'MED-' || nextval('medical_visit_ref_seq'),
  student_id UUID NOT NULL,
  visit_type public.medical_visit_type NOT NULL,
  status public.medical_visit_status NOT NULL DEFAULT 'pending',
  chief_complaint TEXT,
  symptoms TEXT,
  vital_signs JSONB, -- {temperature, blood_pressure, pulse, etc.}
  treatment_given TEXT,
  medications_administered JSONB, -- [{name, dosage, time, administered_by}]
  recommendations TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  parent_notified BOOLEAN DEFAULT false,
  parent_notification_time TIMESTAMP WITH TIME ZONE,
  discharge_time TIMESTAMP WITH TIME ZONE,
  attended_by UUID, -- staff member
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student Medical Information
CREATE TABLE public.student_medical_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL UNIQUE,
  allergies TEXT[],
  medical_conditions TEXT[],
  current_medications JSONB, -- [{name, dosage, frequency, prescribing_doctor}]
  emergency_contacts JSONB, -- [{name, relationship, phone, email, is_primary}]
  blood_type TEXT,
  special_dietary_requirements TEXT,
  medical_notes TEXT,
  consent_for_treatment BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Complaints System
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT NOT NULL DEFAULT 'COMP-' || nextval('complaint_ref_seq'),
  complainant_name TEXT NOT NULL,
  complainant_email TEXT,
  complainant_phone TEXT,
  complainant_relationship TEXT, -- parent, student, staff, other
  student_id UUID, -- if complaint relates to a specific student
  complaint_type public.complaint_type NOT NULL,
  priority public.complaint_priority NOT NULL DEFAULT 'medium',
  status public.complaint_status NOT NULL DEFAULT 'submitted',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  witnesses TEXT,
  evidence_files TEXT[], -- file paths/urls
  assigned_to UUID, -- staff member handling the complaint
  resolution_notes TEXT,
  resolution_date TIMESTAMP WITH TIME ZONE,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Complaint Actions/Updates
CREATE TABLE public.complaint_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- investigation_started, evidence_reviewed, meeting_scheduled, etc.
  description TEXT NOT NULL,
  taken_by UUID NOT NULL,
  action_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safeguarding System
CREATE TABLE public.safeguarding_concerns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT NOT NULL DEFAULT 'SAFE-' || nextval('safeguarding_ref_seq'),
  student_id UUID NOT NULL,
  concern_type public.safeguarding_concern_type NOT NULL,
  risk_level public.safeguarding_risk_level NOT NULL,
  status public.safeguarding_status NOT NULL DEFAULT 'reported',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  reporter_name TEXT NOT NULL,
  reporter_role TEXT NOT NULL,
  reporter_contact TEXT,
  witnesses TEXT,
  immediate_action_taken TEXT,
  parents_informed BOOLEAN DEFAULT false,
  parent_notification_date TIMESTAMP WITH TIME ZONE,
  external_agencies_contacted BOOLEAN DEFAULT false,
  external_agencies_details TEXT,
  designated_safeguarding_lead UUID, -- staff member
  case_notes TEXT,
  outcome TEXT,
  closure_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safeguarding Actions/Reviews
CREATE TABLE public.safeguarding_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concern_id UUID NOT NULL REFERENCES public.safeguarding_concerns(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- assessment, investigation, meeting, referral, etc.
  description TEXT NOT NULL,
  taken_by UUID NOT NULL,
  action_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_review_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.medical_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Medical Visits (very restricted access)
CREATE POLICY "Medical staff can manage medical visits" 
ON public.medical_visits 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('nurse', 'doctor', 'medical_staff', 'admin')
));

-- RLS Policies for Student Medical Info (very restricted access)
CREATE POLICY "Medical staff can manage student medical info" 
ON public.student_medical_info 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('nurse', 'doctor', 'medical_staff', 'admin')
));

-- RLS Policies for Complaints (restricted access)
CREATE POLICY "Authorized staff can manage complaints" 
ON public.complaints 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('admin', 'principal', 'vice_principal', 'complaints_officer')
));

-- RLS Policies for Complaint Actions
CREATE POLICY "Authorized staff can manage complaint actions" 
ON public.complaint_actions 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('admin', 'principal', 'vice_principal', 'complaints_officer')
));

-- RLS Policies for Safeguarding Concerns (highly restricted access)
CREATE POLICY "Safeguarding team can manage concerns" 
ON public.safeguarding_concerns 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('admin', 'safeguarding_lead', 'deputy_safeguarding_lead')
));

-- RLS Policies for Safeguarding Actions
CREATE POLICY "Safeguarding team can manage actions" 
ON public.safeguarding_actions 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('admin', 'safeguarding_lead', 'deputy_safeguarding_lead')
));

-- Create indexes for better performance
CREATE INDEX idx_medical_visits_student_id ON public.medical_visits(student_id);
CREATE INDEX idx_medical_visits_status ON public.medical_visits(status);
CREATE INDEX idx_medical_visits_created_at ON public.medical_visits(created_at);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_complaints_student_id ON public.complaints(student_id);
CREATE INDEX idx_complaints_assigned_to ON public.complaints(assigned_to);
CREATE INDEX idx_safeguarding_concerns_student_id ON public.safeguarding_concerns(student_id);
CREATE INDEX idx_safeguarding_concerns_status ON public.safeguarding_concerns(status);
CREATE INDEX idx_safeguarding_concerns_risk_level ON public.safeguarding_concerns(risk_level);

-- Create triggers for updating timestamps
CREATE TRIGGER update_medical_visits_updated_at
  BEFORE UPDATE ON public.medical_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_medical_info_updated_at
  BEFORE UPDATE ON public.student_medical_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safeguarding_concerns_updated_at
  BEFORE UPDATE ON public.safeguarding_concerns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();