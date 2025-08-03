-- Create payment_records table for fee collections
CREATE TABLE public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  parent_name TEXT,
  fee_type TEXT NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank', 'online', 'cheque')),
  reference_number TEXT,
  notes TEXT,
  cashier_id UUID,
  cashier_name TEXT,
  school_id UUID,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_time TIME NOT NULL DEFAULT CURRENT_TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Create policies for payment records
CREATE POLICY "School staff can view payment records" 
ON public.payment_records 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND (ur.school_id = payment_records.school_id OR payment_records.school_id IS NULL)
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

CREATE POLICY "School staff can insert payment records" 
ON public.payment_records 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND (ur.school_id = payment_records.school_id OR payment_records.school_id IS NULL)
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create sequence for receipt numbers
CREATE SEQUENCE receipt_number_seq START 1;

-- Create function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_part TEXT;
  receipt_num TEXT;
BEGIN
  -- Get current year
  year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  -- Get next sequence number and format with leading zeros
  sequence_part := LPAD(nextval('receipt_number_seq')::TEXT, 5, '0');
  
  -- Combine into final format
  receipt_num := 'RCP-' || year_part || '-' || sequence_part;
  
  RETURN receipt_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate receipt numbers
CREATE OR REPLACE FUNCTION set_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := generate_receipt_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on payment_records
CREATE TRIGGER auto_receipt_number
  BEFORE INSERT ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION set_receipt_number();

-- Create trigger for updated_at
CREATE TRIGGER update_payment_records_updated_at
  BEFORE UPDATE ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster receipt number lookups
CREATE INDEX idx_payment_records_receipt_number ON public.payment_records(receipt_number);
CREATE INDEX idx_payment_records_date ON public.payment_records(payment_date);
CREATE INDEX idx_payment_records_student ON public.payment_records(student_id);
CREATE INDEX idx_payment_records_school ON public.payment_records(school_id);