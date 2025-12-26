
-- Phase 4: Communication & Notifications for Transport

-- 1. Transport Notification Templates
CREATE TABLE IF NOT EXISTS public.transport_notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('sms', 'email', 'push', 'whatsapp')),
  event_trigger TEXT NOT NULL CHECK (event_trigger IN ('trip_start', 'trip_end', 'student_board', 'student_alight', 'delay', 'breakdown', 'accident', 'sos', 'arrival_soon', 'no_show', 'route_change', 'driver_change', 'custom')),
  subject_template TEXT,
  body_template TEXT NOT NULL,
  variables TEXT[],
  is_active BOOLEAN DEFAULT true,
  send_to_parent BOOLEAN DEFAULT true,
  send_to_admin BOOLEAN DEFAULT false,
  send_to_driver BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Parent Notification Preferences
CREATE TABLE IF NOT EXISTS public.transport_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  parent_id UUID NOT NULL,
  student_id UUID NOT NULL,
  notify_trip_start BOOLEAN DEFAULT true,
  notify_trip_end BOOLEAN DEFAULT true,
  notify_student_board BOOLEAN DEFAULT true,
  notify_student_alight BOOLEAN DEFAULT true,
  notify_delays BOOLEAN DEFAULT true,
  notify_emergencies BOOLEAN DEFAULT true,
  notify_arrival_soon BOOLEAN DEFAULT true,
  arrival_notify_minutes INTEGER DEFAULT 5,
  preferred_channel TEXT DEFAULT 'sms' CHECK (preferred_channel IN ('sms', 'email', 'push', 'whatsapp', 'all')),
  phone_number TEXT,
  email TEXT,
  whatsapp_number TEXT,
  push_token TEXT,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- 3. Transport Notification Log
CREATE TABLE IF NOT EXISTS public.transport_notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  template_id UUID REFERENCES public.transport_notification_templates(id) ON DELETE SET NULL,
  trip_instance_id UUID REFERENCES public.trip_instances(id) ON DELETE SET NULL,
  trip_event_id UUID REFERENCES public.trip_events(id) ON DELETE SET NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('parent', 'admin', 'driver', 'student')),
  recipient_id UUID NOT NULL,
  recipient_contact TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'push', 'whatsapp')),
  event_trigger TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  variables_used JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  external_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Emergency Contacts for Transport
CREATE TABLE IF NOT EXISTS public.transport_emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  student_id UUID NOT NULL,
  contact_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone_primary TEXT NOT NULL,
  phone_secondary TEXT,
  email TEXT,
  is_authorized_pickup BOOLEAN DEFAULT false,
  priority_order INTEGER DEFAULT 1,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Geofence Notifications (for "arriving soon" alerts)
CREATE TABLE IF NOT EXISTS public.transport_geofences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  name TEXT NOT NULL,
  geofence_type TEXT NOT NULL CHECK (geofence_type IN ('school', 'stop', 'zone', 'custom')),
  reference_id UUID,
  center_lat NUMERIC(10,7) NOT NULL,
  center_lng NUMERIC(10,7) NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 500,
  trigger_on_entry BOOLEAN DEFAULT true,
  trigger_on_exit BOOLEAN DEFAULT false,
  notification_template_id UUID REFERENCES public.transport_notification_templates(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transport_notif_templates_school ON public.transport_notification_templates(school_id);
CREATE INDEX IF NOT EXISTS idx_transport_notif_templates_trigger ON public.transport_notification_templates(event_trigger);
CREATE INDEX IF NOT EXISTS idx_transport_notif_prefs_parent ON public.transport_notification_preferences(parent_id);
CREATE INDEX IF NOT EXISTS idx_transport_notif_prefs_student ON public.transport_notification_preferences(student_id);
CREATE INDEX IF NOT EXISTS idx_transport_notif_logs_trip ON public.transport_notification_logs(trip_instance_id);
CREATE INDEX IF NOT EXISTS idx_transport_notif_logs_status ON public.transport_notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_transport_emergency_student ON public.transport_emergency_contacts(student_id);
CREATE INDEX IF NOT EXISTS idx_transport_geofences_school ON public.transport_geofences(school_id);

-- Enable RLS
ALTER TABLE public.transport_notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_geofences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "View notification templates" ON public.transport_notification_templates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_notification_templates.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage notification templates" ON public.transport_notification_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_notification_templates.school_id AND ur.role IN ('school_admin', 'hod') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "View notification preferences" ON public.transport_notification_preferences
  FOR SELECT USING (
    parent_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_notification_preferences.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage own notification preferences" ON public.transport_notification_preferences
  FOR ALL USING (
    parent_id = auth.uid()
    OR EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_notification_preferences.school_id AND ur.role IN ('school_admin', 'hod') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "View notification logs" ON public.transport_notification_logs
  FOR SELECT USING (
    recipient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_notification_logs.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Insert notification logs" ON public.transport_notification_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "View emergency contacts" ON public.transport_emergency_contacts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_emergency_contacts.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage emergency contacts" ON public.transport_emergency_contacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_emergency_contacts.school_id AND ur.role IN ('school_admin', 'hod', 'teacher') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "View geofences" ON public.transport_geofences
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_geofences.school_id AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Manage geofences" ON public.transport_geofences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.school_id = transport_geofences.school_id AND ur.role IN ('school_admin', 'hod') AND ur.is_active = true)
    OR public.is_super_admin(auth.uid())
  );

-- Triggers
CREATE TRIGGER update_transport_notification_templates_updated_at BEFORE UPDATE ON public.transport_notification_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transport_notification_preferences_updated_at BEFORE UPDATE ON public.transport_notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transport_emergency_contacts_updated_at BEFORE UPDATE ON public.transport_emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transport_geofences_updated_at BEFORE UPDATE ON public.transport_geofences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
