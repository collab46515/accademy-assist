-- Create missing custom types for Student Welfare system
CREATE TYPE public.medical_visit_type AS ENUM ('routine_checkup', 'illness', 'injury', 'medication_administration', 'emergency', 'follow_up');
CREATE TYPE public.medical_visit_status AS ENUM ('pending', 'in_progress', 'completed', 'referred');
CREATE TYPE public.complaint_status AS ENUM ('submitted', 'under_review', 'investigating', 'resolved', 'closed');
CREATE TYPE public.safeguarding_status AS ENUM ('reported', 'assessed', 'investigating', 'action_taken', 'monitoring', 'closed');

-- Create missing sequences for reference numbers
CREATE SEQUENCE IF NOT EXISTS public.medical_visit_ref_seq START 1000;

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

-- Enable RLS on new tables
ALTER TABLE public.medical_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Medical Visits (very restricted access)
CREATE POLICY "Medical staff can manage medical visits" 
ON public.medical_visits 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['nurse'::app_role, 'school_admin'::app_role, 'super_admin'::app_role])
  AND ur.is_active = true
));

-- RLS Policies for Student Medical Info (very restricted access)
CREATE POLICY "Medical staff can manage student medical info" 
ON public.student_medical_info 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['nurse'::app_role, 'school_admin'::app_role, 'super_admin'::app_role])
  AND ur.is_active = true
));

-- RLS Policies for Complaint Actions
CREATE POLICY "Authorized staff can manage complaint actions" 
ON public.complaint_actions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() 
  AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role, 'dsl'::app_role])
  AND ur.is_active = true
));

-- Create indexes for better performance
CREATE INDEX idx_medical_visits_student_id ON public.medical_visits(student_id);
CREATE INDEX idx_medical_visits_status ON public.medical_visits(status);
CREATE INDEX idx_medical_visits_created_at ON public.medical_visits(created_at);
CREATE INDEX idx_complaint_actions_complaint_id ON public.complaint_actions(complaint_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_medical_visits_updated_at
  BEFORE UPDATE ON public.medical_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_medical_info_updated_at
  BEFORE UPDATE ON public.student_medical_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();