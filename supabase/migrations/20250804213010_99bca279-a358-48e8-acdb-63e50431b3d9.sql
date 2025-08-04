-- Create curriculum gaps tracking table
CREATE TABLE public.curriculum_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  subject TEXT NOT NULL,
  year_group TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  framework_id UUID,
  expected_completion_date DATE NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  lessons_planned INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  coverage_percentage NUMERIC NOT NULL DEFAULT 0,
  gap_size_days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
  assigned_teacher_id UUID,
  last_lesson_date DATE,
  next_planned_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create curriculum alerts table
CREATE TABLE public.curriculum_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  gap_id UUID REFERENCES public.curriculum_gaps(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('deadline_warning', 'gap_detected', 'coverage_low', 'teacher_support_needed')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
  triggered_by UUID,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create department coverage summary table
CREATE TABLE public.department_coverage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  department TEXT NOT NULL,
  year_group TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::TEXT,
  total_topics INTEGER NOT NULL DEFAULT 0,
  completed_topics INTEGER NOT NULL DEFAULT 0,
  in_progress_topics INTEGER NOT NULL DEFAULT 0,
  at_risk_topics INTEGER NOT NULL DEFAULT 0,
  overall_coverage_percentage NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, department, year_group, academic_year)
);

-- Enable RLS
ALTER TABLE public.curriculum_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_coverage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for curriculum_gaps
CREATE POLICY "School staff can view gaps in their school" 
ON public.curriculum_gaps FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_gaps.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "HODs and admins can manage gaps" 
ON public.curriculum_gaps FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_gaps.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS Policies for curriculum_alerts
CREATE POLICY "School staff can view alerts in their school" 
ON public.curriculum_alerts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_alerts.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "HODs and admins can manage alerts" 
ON public.curriculum_alerts FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = curriculum_alerts.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS Policies for department_coverage
CREATE POLICY "School staff can view coverage in their school" 
ON public.department_coverage FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = department_coverage.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "HODs and admins can manage coverage data" 
ON public.department_coverage FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = department_coverage.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_curriculum_gaps_school_subject ON public.curriculum_gaps(school_id, subject);
CREATE INDEX idx_curriculum_gaps_risk_level ON public.curriculum_gaps(risk_level, status);
CREATE INDEX idx_curriculum_gaps_expected_date ON public.curriculum_gaps(expected_completion_date);
CREATE INDEX idx_curriculum_alerts_school_status ON public.curriculum_alerts(school_id, status);
CREATE INDEX idx_curriculum_alerts_severity ON public.curriculum_alerts(severity, alert_type);
CREATE INDEX idx_department_coverage_school_dept ON public.department_coverage(school_id, department);

-- Create function to calculate gap risk level
CREATE OR REPLACE FUNCTION public.calculate_gap_risk_level(
  completion_date DATE,
  coverage_percentage NUMERIC,
  lessons_planned INTEGER,
  lessons_completed INTEGER
) RETURNS TEXT AS $$
DECLARE
  days_until_deadline INTEGER;
  risk_level TEXT;
BEGIN
  days_until_deadline := completion_date - CURRENT_DATE;
  
  -- Critical: Less than 7 days and low coverage
  IF days_until_deadline <= 7 AND coverage_percentage < 50 THEN
    risk_level := 'critical';
  -- High: Less than 14 days and coverage below 75%
  ELSIF days_until_deadline <= 14 AND coverage_percentage < 75 THEN
    risk_level := 'high';
  -- Medium: Less than 30 days and coverage below 80%
  ELSIF days_until_deadline <= 30 AND coverage_percentage < 80 THEN
    risk_level := 'medium';
  -- Low: Everything else
  ELSE
    risk_level := 'low';
  END IF;
  
  RETURN risk_level;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamps
CREATE TRIGGER update_curriculum_gaps_updated_at
  BEFORE UPDATE ON public.curriculum_gaps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_curriculum_alerts_updated_at
  BEFORE UPDATE ON public.curriculum_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_department_coverage_updated_at
  BEFORE UPDATE ON public.department_coverage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();