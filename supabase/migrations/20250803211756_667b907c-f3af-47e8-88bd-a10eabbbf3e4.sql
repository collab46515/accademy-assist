-- Create fee collection role enum 
CREATE TYPE public.fee_collection_role AS ENUM ('cashier', 'supervisor', 'admin');

-- Update user_roles table to include fee collection roles
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS fee_collection_role fee_collection_role;

-- Create collection_sessions table
CREATE TABLE public.collection_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cashier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  opening_cash_amount DECIMAL(10,2) DEFAULT 0,
  closing_cash_amount DECIMAL(10,2),
  expected_cash_amount DECIMAL(10,2) DEFAULT 0,
  variance_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'reconciled', 'approved')),
  notes TEXT,
  supervisor_approved_by UUID REFERENCES auth.users(id),
  supervisor_approved_at TIMESTAMP WITH TIME ZONE,
  supervisor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on collection_sessions
ALTER TABLE public.collection_sessions ENABLE ROW LEVEL SECURITY;

-- Collection sessions policies
CREATE POLICY "Cashiers can view their own sessions" 
ON public.collection_sessions 
FOR SELECT 
USING (cashier_id = auth.uid());

CREATE POLICY "Cashiers can create their own sessions" 
ON public.collection_sessions 
FOR INSERT 
WITH CHECK (cashier_id = auth.uid());

CREATE POLICY "Cashiers can update their own active sessions" 
ON public.collection_sessions 
FOR UPDATE 
USING (cashier_id = auth.uid() AND status = 'active');

CREATE POLICY "Supervisors can view all sessions in their school" 
ON public.collection_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = collection_sessions.school_id
    AND (ur.fee_collection_role = 'supervisor' OR ur.fee_collection_role = 'admin')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "Supervisors can approve sessions" 
ON public.collection_sessions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = collection_sessions.school_id
    AND (ur.fee_collection_role = 'supervisor' OR ur.fee_collection_role = 'admin')
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Add collection_session_id to payment_records
ALTER TABLE public.payment_records 
ADD COLUMN IF NOT EXISTS collection_session_id UUID REFERENCES public.collection_sessions(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_records_session ON public.payment_records(collection_session_id);
CREATE INDEX IF NOT EXISTS idx_collection_sessions_cashier ON public.collection_sessions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_collection_sessions_school ON public.collection_sessions(school_id);

-- Create trigger for updated_at on collection_sessions
CREATE TRIGGER update_collection_sessions_updated_at
  BEFORE UPDATE ON public.collection_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();