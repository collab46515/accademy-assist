-- Create transport_notifications table
CREATE TABLE public.transport_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  type TEXT NOT NULL,
  recipients TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  send_sms BOOLEAN DEFAULT false,
  send_email BOOLEAN DEFAULT false,
  send_push BOOLEAN DEFAULT false,
  sent_by UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recipient_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transport_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "School staff can manage transport notifications" 
ON public.transport_notifications 
FOR ALL 
USING (
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = transport_notifications.school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

-- Add trigger for updated_at
CREATE TRIGGER update_transport_notifications_updated_at
BEFORE UPDATE ON public.transport_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();