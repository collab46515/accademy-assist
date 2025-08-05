-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_number TEXT NOT NULL UNIQUE,
  school_id UUID NOT NULL,
  year_group TEXT NOT NULL,
  form_class TEXT,
  date_of_birth DATE,
  admission_date DATE DEFAULT CURRENT_DATE,
  is_enrolled BOOLEAN NOT NULL DEFAULT true,
  medical_notes TEXT,
  safeguarding_notes TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_number TEXT NOT NULL UNIQUE,
  school_id UUID NOT NULL,
  department_id UUID,
  position TEXT NOT NULL,
  hire_date DATE DEFAULT CURRENT_DATE,
  employment_type TEXT DEFAULT 'full_time',
  salary NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  manager_id UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee_records table
CREATE TABLE public.fee_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id UUID NOT NULL,
  fee_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  academic_term TEXT,
  academic_year TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  school_id UUID NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_by UUID REFERENCES employees(id),
  approved_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "School staff can view students in their school" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = students.school_id 
      AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Students can view their own record" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "School admins can manage students" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = students.school_id 
      AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for employees
CREATE POLICY "School staff can view employees in their school" ON public.employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = employees.school_id 
      AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Employees can view their own record" ON public.employees
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "School admins can manage employees" ON public.employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = employees.school_id 
      AND ur.role = ANY(ARRAY['school_admin'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for fee_records
CREATE POLICY "School staff can view fee records in their school" ON public.fee_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = fee_records.school_id 
      AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "School admins can manage fee records" ON public.fee_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = fee_records.school_id 
      AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- RLS Policies for leave_requests
CREATE POLICY "School staff can view leave requests in their school" ON public.leave_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = leave_requests.school_id 
      AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

CREATE POLICY "Employees can view their own leave requests" ON public.leave_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.id = leave_requests.employee_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Employees can create their own leave requests" ON public.leave_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.id = leave_requests.employee_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "School admins can manage leave requests" ON public.leave_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.school_id = leave_requests.school_id 
      AND ur.role = ANY(ARRAY['school_admin'::app_role, 'hod'::app_role])
      AND ur.is_active = true
    ) OR is_super_admin(auth.uid())
  );

-- Add triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_records_updated_at
  BEFORE UPDATE ON public.fee_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();