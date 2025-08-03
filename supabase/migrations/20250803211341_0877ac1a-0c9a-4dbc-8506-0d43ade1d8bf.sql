-- Fix search_path security issues for functions
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Fix search_path for trigger function
CREATE OR REPLACE FUNCTION set_receipt_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := generate_receipt_number();
  END IF;
  RETURN NEW;
END;
$$;