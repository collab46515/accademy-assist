-- Add receipt_number column to existing payment_records table
ALTER TABLE public.payment_records 
ADD COLUMN IF NOT EXISTS receipt_number TEXT UNIQUE;

-- Add additional columns for better audit trail
ALTER TABLE public.payment_records 
ADD COLUMN IF NOT EXISTS student_name TEXT,
ADD COLUMN IF NOT EXISTS student_class TEXT,
ADD COLUMN IF NOT EXISTS parent_name TEXT,
ADD COLUMN IF NOT EXISTS fee_type TEXT,
ADD COLUMN IF NOT EXISTS amount_due DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS cashier_id UUID,
ADD COLUMN IF NOT EXISTS cashier_name TEXT,
ADD COLUMN IF NOT EXISTS payment_time TIME DEFAULT CURRENT_TIME;

-- Create sequence for receipt numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS receipt_number_seq START 1;

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

-- Create trigger function to auto-generate receipt numbers
CREATE OR REPLACE FUNCTION set_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := generate_receipt_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS auto_receipt_number ON public.payment_records;
CREATE TRIGGER auto_receipt_number
  BEFORE INSERT ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION set_receipt_number();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_records_receipt_number ON public.payment_records(receipt_number);
CREATE INDEX IF NOT EXISTS idx_payment_records_date ON public.payment_records(payment_date);
CREATE INDEX IF NOT EXISTS idx_payment_records_student_name ON public.payment_records(student_name);

-- Add check constraint for payment_method
ALTER TABLE public.payment_records 
DROP CONSTRAINT IF EXISTS payment_records_payment_method_check;

ALTER TABLE public.payment_records 
ADD CONSTRAINT payment_records_payment_method_check 
CHECK (payment_method IN ('cash', 'bank', 'online', 'cheque'));