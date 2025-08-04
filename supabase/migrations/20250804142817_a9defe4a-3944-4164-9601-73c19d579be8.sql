-- Create enums for status tracking
CREATE TYPE incident_type AS ENUM ('injury', 'illness', 'accident', 'medication', 'emergency', 'other');
CREATE TYPE incident_severity AS ENUM ('minor', 'moderate', 'serious', 'critical');
CREATE TYPE complaint_type AS ENUM ('academic', 'behavioral', 'bullying', 'staff_conduct', 'facilities', 'discrimination', 'other');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE safeguarding_concern_type AS ENUM ('physical_abuse', 'emotional_abuse', 'sexual_abuse', 'neglect', 'bullying', 'self_harm', 'domestic_violence', 'online_safety', 'radicalisation', 'other');
CREATE TYPE safeguarding_risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE record_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'escalated');

-- ============= INFIRMARY/MEDICAL MANAGEMENT =============

-- Medical Records table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    school_id UUID NOT NULL,
    medical_conditions TEXT[],
    allergies TEXT[],
    medications JSONB DEFAULT '[]'::jsonb,
    emergency_contact_medical JSONB,
    doctor_details JSONB,
    dietary_requirements TEXT,
    special_needs TEXT,
    medical_notes TEXT,
    created_by UUID NOT NULL,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Incidents table
CREATE TABLE medical_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_number TEXT UNIQUE NOT NULL DEFAULT 'INC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('incident_sequence')::text, 4, '0'),
    student_id UUID NOT NULL,
    school_id UUID NOT NULL,
    incident_type incident_type NOT NULL,
    severity incident_severity NOT NULL DEFAULT 'minor',
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    symptoms TEXT[],
    treatment_given TEXT,
    medication_administered JSONB,
    staff_present TEXT[],
    witnesses TEXT[],
    parent_notified BOOLEAN DEFAULT FALSE,
    parent_notification_time TIMESTAMP WITH TIME ZONE,
    hospital_referral BOOLEAN DEFAULT FALSE,
    hospital_details JSONB,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT,
    status record_status DEFAULT 'open',
    reported_by UUID NOT NULL,
    treated_by UUID,
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicine Administration Log
CREATE TABLE medicine_administration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    school_id UUID NOT NULL,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    administration_time TIMESTAMP WITH TIME ZONE NOT NULL,
    administered_by UUID NOT NULL,
    witnessed_by UUID,
    reason TEXT,
    side_effects TEXT,
    parent_consent BOOLEAN DEFAULT TRUE,
    consent_document_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= COMPLAINTS MANAGEMENT =============

-- Complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_number TEXT UNIQUE NOT NULL DEFAULT 'COMP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('complaint_sequence')::text, 4, '0'),
    school_id UUID NOT NULL,
    complaint_type complaint_type NOT NULL,
    priority complaint_priority DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    complainant_name TEXT NOT NULL,
    complainant_email TEXT,
    complainant_phone TEXT,
    complainant_relationship TEXT, -- parent, student, staff, visitor
    anonymous BOOLEAN DEFAULT FALSE,
    student_involved UUID,
    staff_involved UUID[],
    incident_date DATE,
    location TEXT,
    witnesses TEXT[],
    evidence_urls TEXT[],
    desired_outcome TEXT,
    status record_status DEFAULT 'open',
    assigned_to UUID,
    escalated_to UUID,
    resolution TEXT,
    actions_taken TEXT[],
    lessons_learned TEXT,
    submitted_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    target_resolution_date DATE
);

-- Complaint Communication Log
CREATE TABLE complaint_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    communication_type TEXT NOT NULL, -- email, phone, meeting, letter
    direction TEXT NOT NULL, -- inbound, outbound
    participants TEXT[],
    summary TEXT NOT NULL,
    attachments TEXT[],
    communication_date TIMESTAMP WITH TIME ZONE NOT NULL,
    logged_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= SAFEGUARDING =============

-- Safeguarding Concerns table (most sensitive)
CREATE TABLE safeguarding_concerns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concern_number TEXT UNIQUE NOT NULL DEFAULT 'SG-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('safeguarding_sequence')::text, 4, '0'),
    school_id UUID NOT NULL,
    concern_type safeguarding_concern_type NOT NULL,
    risk_level safeguarding_risk_level NOT NULL,
    student_id UUID NOT NULL,
    concern_details TEXT NOT NULL,
    incident_date DATE,
    location TEXT,
    witnesses TEXT[],
    immediate_action_taken TEXT,
    agencies_contacted TEXT[],
    parents_informed BOOLEAN DEFAULT FALSE,
    parent_notification_details TEXT,
    police_involved BOOLEAN DEFAULT FALSE,
    police_reference TEXT,
    social_services_involved BOOLEAN DEFAULT FALSE,
    social_services_reference TEXT,
    status record_status DEFAULT 'open',
    reported_by UUID NOT NULL,
    dsl_assigned UUID, -- Designated Safeguarding Lead
    case_notes TEXT,
    next_review_date DATE,
    outcome TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Safeguarding Actions table
CREATE TABLE safeguarding_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concern_id UUID NOT NULL REFERENCES safeguarding_concerns(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- assessment, referral, investigation, support_plan, review
    action_description TEXT NOT NULL,
    assigned_to UUID NOT NULL,
    due_date DATE,
    completion_date DATE,
    outcome TEXT,
    evidence_urls TEXT[],
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, overdue
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safeguarding Reviews table
CREATE TABLE safeguarding_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concern_id UUID NOT NULL REFERENCES safeguarding_concerns(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    review_type TEXT NOT NULL, -- weekly, monthly, case_closure, escalation
    attendees TEXT[],
    review_notes TEXT NOT NULL,
    decisions_made TEXT[],
    next_actions TEXT[],
    next_review_date DATE,
    risk_assessment TEXT,
    conducted_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS incident_sequence START 1;
CREATE SEQUENCE IF NOT EXISTS complaint_sequence START 1;
CREATE SEQUENCE IF NOT EXISTS safeguarding_sequence START 1;

-- Enable RLS on all tables
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_administration ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_reviews ENABLE ROW LEVEL SECURITY;

-- ============= RLS POLICIES =============

-- Medical Records Policies
CREATE POLICY "School medical staff can manage medical records"
ON medical_records FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = medical_records.school_id 
        AND ur.role IN ('school_admin', 'nurse', 'first_aider')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- Medical Incidents Policies  
CREATE POLICY "School staff can view medical incidents"
ON medical_incidents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = medical_incidents.school_id 
        AND ur.role IN ('school_admin', 'teacher', 'nurse', 'first_aider')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Authorized staff can create medical incidents"
ON medical_incidents FOR INSERT
WITH CHECK (
    reported_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = medical_incidents.school_id 
        AND ur.role IN ('school_admin', 'teacher', 'nurse', 'first_aider')
        AND ur.is_active = true
    )
);

-- Medicine Administration Policies
CREATE POLICY "Authorized staff can manage medicine administration"
ON medicine_administration FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = medicine_administration.school_id 
        AND ur.role IN ('school_admin', 'nurse', 'first_aider')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- Complaints Policies
CREATE POLICY "School staff can view complaints"
ON complaints FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = complaints.school_id 
        AND ur.role IN ('school_admin', 'teacher', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid()) OR submitted_by = auth.uid()
);

CREATE POLICY "Anyone can submit complaints"
ON complaints FOR INSERT
WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Assigned staff can update complaints"
ON complaints FOR UPDATE
USING (
    assigned_to = auth.uid() OR
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = complaints.school_id 
        AND ur.role IN ('school_admin', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- Complaint Communications Policies
CREATE POLICY "Staff can manage complaint communications"
ON complaint_communications FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM complaints c
        JOIN user_roles ur ON ur.school_id = c.school_id
        WHERE c.id = complaint_communications.complaint_id
        AND ur.user_id = auth.uid()
        AND ur.role IN ('school_admin', 'teacher', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- SAFEGUARDING POLICIES (Most Restrictive)
CREATE POLICY "Only DSL and admins can view safeguarding concerns"
ON safeguarding_concerns FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = safeguarding_concerns.school_id 
        AND ur.role IN ('school_admin', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

CREATE POLICY "DSL can create safeguarding concerns"
ON safeguarding_concerns FOR INSERT
WITH CHECK (
    reported_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = safeguarding_concerns.school_id 
        AND ur.role IN ('school_admin', 'dsl', 'teacher')
        AND ur.is_active = true
    )
);

CREATE POLICY "DSL and admins can update safeguarding concerns"
ON safeguarding_concerns FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.school_id = safeguarding_concerns.school_id 
        AND ur.role IN ('school_admin', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- Safeguarding Actions Policies
CREATE POLICY "DSL can manage safeguarding actions"
ON safeguarding_actions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM safeguarding_concerns sc
        JOIN user_roles ur ON ur.school_id = sc.school_id
        WHERE sc.id = safeguarding_actions.concern_id
        AND ur.user_id = auth.uid()
        AND ur.role IN ('school_admin', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- Safeguarding Reviews Policies  
CREATE POLICY "DSL can manage safeguarding reviews"
ON safeguarding_reviews FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM safeguarding_concerns sc
        JOIN user_roles ur ON ur.school_id = sc.school_id
        WHERE sc.id = safeguarding_reviews.concern_id
        AND ur.user_id = auth.uid()
        AND ur.role IN ('school_admin', 'dsl')
        AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_medical_records_updated_at
    BEFORE UPDATE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_incidents_updated_at
    BEFORE UPDATE ON medical_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safeguarding_concerns_updated_at
    BEFORE UPDATE ON safeguarding_concerns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safeguarding_actions_updated_at
    BEFORE UPDATE ON safeguarding_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();