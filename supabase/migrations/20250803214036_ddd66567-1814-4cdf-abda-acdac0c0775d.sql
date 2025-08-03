-- Create fee_discounts table
CREATE TABLE public.fee_discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  applicable_fee_types TEXT[] NOT NULL DEFAULT '{}',
  conditions TEXT,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_by UUID NOT NULL,
  school_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee_waivers table
CREATE TABLE public.fee_waivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  fee_type TEXT NOT NULL,
  original_amount NUMERIC NOT NULL CHECK (original_amount > 0),
  waived_amount NUMERIC NOT NULL CHECK (waived_amount >= 0),
  waiver_percentage NUMERIC NOT NULL DEFAULT 0 CHECK (waiver_percentage >= 0 AND waiver_percentage <= 100),
  reason TEXT NOT NULL,
  requested_by UUID NOT NULL,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reviewed_by UUID,
  review_date DATE,
  approval_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  supporting_documents TEXT[] DEFAULT '{}',
  school_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fee_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_waivers ENABLE ROW LEVEL SECURITY;

-- Create policies for fee_discounts
CREATE POLICY "School staff can manage discounts" 
ON public.fee_discounts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_discounts.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create policies for fee_waivers
CREATE POLICY "School staff can manage waivers" 
ON public.fee_waivers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_waivers.school_id 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_fee_discounts_updated_at
BEFORE UPDATE ON public.fee_discounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_waivers_updated_at
BEFORE UPDATE ON public.fee_waivers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();