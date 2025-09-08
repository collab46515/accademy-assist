-- Create table for discounts & waivers
CREATE TABLE IF NOT EXISTS public.fee_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  name text NOT NULL,
  discount_type text NOT NULL, -- 'percentage' | 'fixed'
  value numeric NOT NULL,
  applicable_fee_head_ids uuid[] NOT NULL DEFAULT '{}',
  criteria jsonb NOT NULL DEFAULT '{}',
  validity_start date,
  validity_end date,
  status text NOT NULL DEFAULT 'active',
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fee_discounts ENABLE ROW LEVEL SECURITY;

-- Policy: School staff can manage fee discounts
DROP POLICY IF EXISTS "School staff can manage fee discounts" ON public.fee_discounts;
CREATE POLICY "School staff can manage fee discounts"
ON public.fee_discounts
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = fee_discounts.school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.school_id = fee_discounts.school_id
      AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_fee_discounts_updated_at ON public.fee_discounts;
CREATE TRIGGER update_fee_discounts_updated_at
BEFORE UPDATE ON public.fee_discounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_fee_discounts_school_id ON public.fee_discounts (school_id);
