-- Create payment records table
CREATE TABLE public.payment_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  student_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number TEXT,
  invoice_id UUID,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student fee assignments table
CREATE TABLE public.student_fee_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount_due NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  class_name TEXT,
  year_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee alerts table
CREATE TABLE public.fee_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  target_audience JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_records
CREATE POLICY "School staff can manage payment records" ON public.payment_records
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = payment_records.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS Policies for student_fee_assignments
CREATE POLICY "School staff can manage student fee assignments" ON public.student_fee_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = student_fee_assignments.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- RLS Policies for fee_alerts
CREATE POLICY "School staff can manage fee alerts" ON public.fee_alerts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.school_id = fee_alerts.school_id
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'teacher'::app_role])
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Add triggers for updated_at
CREATE TRIGGER update_payment_records_updated_at
  BEFORE UPDATE ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_fee_assignments_updated_at
  BEFORE UPDATE ON public.student_fee_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_alerts_updated_at
  BEFORE UPDATE ON public.fee_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for payment_records
INSERT INTO public.payment_records (school_id, student_id, amount, payment_method, payment_date, reference_number, status) VALUES
('1e109f61-4780-4071-acf0-aa746ab119ca', gen_random_uuid(), 1250.00, 'bank_transfer', '2025-08-01', 'TXN001', 'completed'),
('1e109f61-4780-4071-acf0-aa746ab119ca', gen_random_uuid(), 1600.00, 'card', '2025-08-02', 'TXN002', 'completed'),
('1e109f61-4780-4071-acf0-aa746ab119ca', gen_random_uuid(), 800.00, 'cash', '2025-08-03', 'TXN003', 'completed'),
('0ea9fd7a-7ab8-4e87-aa69-834f73f61157', gen_random_uuid(), 1575.00, 'bank_transfer', '2025-07-30', 'TXN004', 'completed'),
('0ea9fd7a-7ab8-4e87-aa69-834f73f61157', gen_random_uuid(), 1200.00, 'card', '2025-07-31', 'TXN005', 'completed');

-- Insert sample data for student_fee_assignments
INSERT INTO public.student_fee_assignments (school_id, student_id, fee_structure_id, due_date, amount_due, amount_paid, status, class_name, year_group) VALUES
('1e109f61-4780-4071-acf0-aa746ab119ca', gen_random_uuid(), 'a2501786-0258-4e7d-b75f-5eabff8e2754', '2025-09-15', 1600.00, 1600.00, 'paid', '7A', 'Year 7'),
('1e109f61-4780-4071-acf0-aa746ab119ca', gen_random_uuid(), 'a2501786-0258-4e7d-b75f-5eabff8e2754', '2025-09-15', 1600.00, 800.00, 'partial', '8B', 'Year 8'),
('1e109f61-4780-4071-acf0-aa746ab119ca', gen_random_uuid(), 'a2501786-0258-4e7d-b75f-5eabff8e2754', '2025-09-15', 1600.00, 0.00, 'pending', '8B', 'Year 8'),
('0ea9fd7a-7ab8-4e87-aa69-834f73f61157', gen_random_uuid(), 'c3ca0106-8f65-4b4e-8a99-0d624bd605ee', '2025-09-15', 1575.00, 1575.00, 'paid', '12A', 'Year 12'),
('0ea9fd7a-7ab8-4e87-aa69-834f73f61157', gen_random_uuid(), 'c3ca0106-8f65-4b4e-8a99-0d624bd605ee', '2025-09-15', 1575.00, 1200.00, 'partial', '13B', 'Year 13');

-- Insert sample data for fee_alerts
INSERT INTO public.fee_alerts (school_id, alert_type, title, message, priority) VALUES
('1e109f61-4780-4071-acf0-aa746ab119ca', 'collection_low', 'Grade 8B Below Target', 'Grade 8B below 70% collection – follow up required', 'high'),
('1e109f61-4780-4071-acf0-aa746ab119ca', 'payment_plan', 'Payment Plan Requests', '5 parents requested payment plan – pending approval', 'medium'),
('1e109f61-4780-4071-acf0-aa746ab119ca', 'deadline', 'Registration Deadline', 'Registration fee due in 3 days for next term', 'high');