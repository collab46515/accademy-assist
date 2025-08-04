-- Create curriculum gaps tracking table
CREATE TABLE curriculum_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  year_group TEXT NOT NULL,
  planned_lessons INTEGER NOT NULL DEFAULT 0,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  coverage_percentage INTEGER NOT NULL DEFAULT 0,
  deadline_date DATE,
  days_behind INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  last_lesson_date DATE,
  projected_completion_date DATE,
  alert_sent BOOLEAN DEFAULT false,
  alert_count INTEGER DEFAULT 0,
  assigned_teacher_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create curriculum alerts table
CREATE TABLE curriculum_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  gap_id UUID REFERENCES curriculum_gaps(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('teacher', 'hod', 'leadership')),
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'read', 'acknowledged')),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create department coverage summary table
CREATE TABLE department_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  department TEXT NOT NULL,
  year_group TEXT NOT NULL,
  total_topics INTEGER NOT NULL DEFAULT 0,
  completed_topics INTEGER NOT NULL DEFAULT 0,
  in_progress_topics INTEGER NOT NULL DEFAULT 0,
  not_started_topics INTEGER NOT NULL DEFAULT 0,
  overall_coverage_percentage INTEGER NOT NULL DEFAULT 0,
  on_track_topics INTEGER NOT NULL DEFAULT 0,
  behind_topics INTEGER NOT NULL DEFAULT 0,
  critical_topics INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE curriculum_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_coverage ENABLE ROW LEVEL SECURITY;

-- RLS policies for curriculum_gaps
CREATE POLICY "School staff can view curriculum gaps"
ON curriculum_gaps FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = curriculum_gaps.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School admins can manage curriculum gaps"
ON curriculum_gaps FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = curriculum_gaps.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS policies for curriculum_alerts
CREATE POLICY "Users can view their own alerts"
ON curriculum_alerts FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "School staff can manage alerts"
ON curriculum_alerts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = curriculum_alerts.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS policies for department_coverage
CREATE POLICY "School staff can view department coverage"
ON department_coverage FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = department_coverage.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "HODs and admins can manage department coverage"
ON department_coverage FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = department_coverage.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_curriculum_gaps_school_subject ON curriculum_gaps(school_id, subject);
CREATE INDEX idx_curriculum_gaps_risk_level ON curriculum_gaps(risk_level);
CREATE INDEX idx_curriculum_gaps_deadline ON curriculum_gaps(deadline_date);
CREATE INDEX idx_curriculum_alerts_recipient ON curriculum_alerts(recipient_id, status);
CREATE INDEX idx_department_coverage_school_dept ON department_coverage(school_id, department);

-- Create triggers for updated_at
CREATE TRIGGER update_curriculum_gaps_updated_at
    BEFORE UPDATE ON curriculum_gaps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate gap risk level
CREATE OR REPLACE FUNCTION calculate_gap_risk_level(
  coverage_percentage INTEGER,
  days_behind INTEGER,
  deadline_date DATE
) RETURNS TEXT AS $$
BEGIN
  -- Critical: Very behind or past deadline
  IF days_behind > 14 OR deadline_date < CURRENT_DATE THEN
    RETURN 'critical';
  END IF;
  
  -- High: Significantly behind
  IF days_behind > 7 OR coverage_percentage < 30 THEN
    RETURN 'high';
  END IF;
  
  -- Medium: Somewhat behind
  IF days_behind > 3 OR coverage_percentage < 60 THEN
    RETURN 'medium';
  END IF;
  
  -- Low: On track or ahead
  RETURN 'low';
END;
$$ LANGUAGE plpgsql;