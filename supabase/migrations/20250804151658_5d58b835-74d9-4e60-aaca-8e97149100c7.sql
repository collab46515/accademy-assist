-- Create enums for communication system
CREATE TYPE communication_type AS ENUM (
  'announcement',
  'newsletter', 
  'emergency_alert',
  'event_notification',
  'academic_update',
  'administrative_notice',
  'parent_communication',
  'staff_memo'
);

CREATE TYPE communication_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'sent',
  'scheduled'
);

CREATE TYPE audience_type AS ENUM (
  'entire_school',
  'specific_classes',
  'specific_teachers',
  'specific_parents',
  'specific_students',
  'year_groups',
  'departments',
  'custom_list'
);

CREATE TYPE communication_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);

-- Create communications table
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  communication_type communication_type NOT NULL,
  status communication_status NOT NULL DEFAULT 'draft',
  priority communication_priority NOT NULL DEFAULT 'normal',
  audience_type audience_type NOT NULL,
  audience_details JSONB DEFAULT '{}',
  
  -- Approval workflow
  created_by UUID NOT NULL,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Attachments and media
  attachments JSONB DEFAULT '[]',
  
  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  delivery_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication recipients table for tracking
CREATE TABLE public.communication_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL,
  recipient_type TEXT NOT NULL, -- 'student', 'parent', 'teacher', 'staff'
  
  -- Delivery tracking
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  delivery_status TEXT DEFAULT 'pending',
  delivery_method TEXT, -- 'email', 'sms', 'app_notification', 'portal'
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication templates table
CREATE TABLE public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  template_type communication_type NOT NULL,
  subject_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  default_audience_type audience_type,
  default_priority communication_priority DEFAULT 'normal',
  
  -- Template metadata
  description TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communications
CREATE POLICY "School staff can manage communications" 
ON public.communications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = communications.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Users can view communications sent to them" 
ON public.communications 
FOR SELECT 
USING (
  status = 'sent' AND (
    -- Students can see communications sent to their classes/year groups
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.user_id = auth.uid() 
      AND s.school_id = communications.school_id
      AND (
        audience_type = 'entire_school' OR
        (audience_type = 'year_groups' AND s.year_group = ANY(ARRAY(SELECT jsonb_array_elements_text(audience_details->'year_groups')))) OR
        (audience_type = 'specific_students' AND s.id::text = ANY(ARRAY(SELECT jsonb_array_elements_text(audience_details->'student_ids'))))
      )
    ) OR
    -- Parents can see communications sent to them or their children
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN students s ON s.id = sp.student_id
      WHERE sp.parent_id = auth.uid()
      AND s.school_id = communications.school_id
      AND (
        audience_type = 'entire_school' OR
        audience_type = 'specific_parents' OR
        (audience_type = 'year_groups' AND s.year_group = ANY(ARRAY(SELECT jsonb_array_elements_text(audience_details->'year_groups')))) OR
        (audience_type = 'specific_students' AND s.id::text = ANY(ARRAY(SELECT jsonb_array_elements_text(audience_details->'student_ids'))))
      )
    )
  )
);

-- RLS Policies for communication recipients
CREATE POLICY "Staff can manage communication recipients" 
ON public.communication_recipients 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM communications c
    JOIN user_roles ur ON ur.school_id = c.school_id
    WHERE c.id = communication_recipients.communication_id
    AND ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Users can view their own recipient records" 
ON public.communication_recipients 
FOR SELECT 
USING (recipient_id = auth.uid());

-- RLS Policies for communication templates
CREATE POLICY "School staff can manage templates" 
ON public.communication_templates 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = communication_templates.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_communications_school_status ON communications(school_id, status);
CREATE INDEX idx_communications_created_by ON communications(created_by);
CREATE INDEX idx_communications_scheduled_for ON communications(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_communication_recipients_communication_id ON communication_recipients(communication_id);
CREATE INDEX idx_communication_recipients_recipient ON communication_recipients(recipient_id, recipient_type);
CREATE INDEX idx_communication_templates_school_type ON communication_templates(school_id, template_type);

-- Create triggers for updated_at
CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON communications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON communication_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();