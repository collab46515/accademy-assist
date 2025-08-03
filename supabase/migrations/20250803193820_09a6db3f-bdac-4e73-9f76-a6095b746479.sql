-- Add payment gateway settings table
CREATE TABLE public.payment_gateway_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id TEXT NOT NULL UNIQUE,
  gateway_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  api_key TEXT,
  secret_key TEXT,
  webhook_url TEXT,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for gateway settings (admin only)
CREATE POLICY "Admin can manage payment gateways" 
ON public.payment_gateway_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_payment_gateway_settings_updated_at
  BEFORE UPDATE ON public.payment_gateway_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_payment_gateway_settings_gateway_id ON public.payment_gateway_settings(gateway_id);
CREATE INDEX idx_payment_gateway_settings_enabled ON public.payment_gateway_settings(is_enabled);