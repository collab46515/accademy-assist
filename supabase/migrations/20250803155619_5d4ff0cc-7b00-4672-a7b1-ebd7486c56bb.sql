-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  department_head_id UUID,
  budget DECIMAL(15,2),
  cost_center TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  user_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id),
  position TEXT NOT NULL,
  manager_id UUID REFERENCES public.employees(id),
  start_date DATE NOT NULL,
  salary DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  work_type TEXT NOT NULL DEFAULT 'full_time' CHECK (work_type IN ('full_time', 'part_time', 'contract', 'intern')),
  location TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  bank_account_details JSONB DEFAULT '{}',
  tax_information JSONB DEFAULT '{}',
  benefits JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_records table (for HR attendance, different from student attendance)
CREATE TABLE public.attendance_records_hr (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  break_duration INTEGER DEFAULT 0, -- minutes
  total_hours DECIMAL(5,2),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Create payroll_records table
CREATE TABLE public.payroll_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  basic_salary DECIMAL(15,2) NOT NULL,
  allowances DECIMAL(15,2) DEFAULT 0,
  overtime_pay DECIMAL(15,2) DEFAULT 0,
  bonus DECIMAL(15,2) DEFAULT 0,
  gross_salary DECIMAL(15,2) NOT NULL,
  tax_deduction DECIMAL(15,2) DEFAULT 0,
  insurance_deduction DECIMAL(15,2) DEFAULT 0,
  other_deductions DECIMAL(15,2) DEFAULT 0,
  total_deductions DECIMAL(15,2) DEFAULT 0,
  net_salary DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processed', 'paid')),
  pay_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records_hr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments
CREATE POLICY "HR can manage departments" ON public.departments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('hr_admin', 'school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

-- Create RLS policies for employees
CREATE POLICY "HR can manage employees" ON public.employees
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('hr_admin', 'school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own data" ON public.employees
FOR SELECT USING (user_id = auth.uid());

-- Create RLS policies for leave_requests
CREATE POLICY "HR can manage leave requests" ON public.leave_requests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('hr_admin', 'school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own leave requests" ON public.leave_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = leave_requests.employee_id 
    AND e.user_id = auth.uid()
  )
);

CREATE POLICY "Employees can create own leave requests" ON public.leave_requests
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = leave_requests.employee_id 
    AND e.user_id = auth.uid()
  )
);

-- Create RLS policies for attendance_records_hr
CREATE POLICY "HR can manage attendance records" ON public.attendance_records_hr
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('hr_admin', 'school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own attendance" ON public.attendance_records_hr
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = attendance_records_hr.employee_id 
    AND e.user_id = auth.uid()
  )
);

-- Create RLS policies for payroll_records
CREATE POLICY "HR can manage payroll records" ON public.payroll_records
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('hr_admin', 'school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own payroll" ON public.payroll_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = payroll_records.employee_id 
    AND e.user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_hr_updated_at
BEFORE UPDATE ON public.attendance_records_hr
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_records_updated_at
BEFORE UPDATE ON public.payroll_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add department head foreign key constraint
ALTER TABLE public.departments 
ADD CONSTRAINT fk_department_head 
FOREIGN KEY (department_head_id) REFERENCES public.employees(id);