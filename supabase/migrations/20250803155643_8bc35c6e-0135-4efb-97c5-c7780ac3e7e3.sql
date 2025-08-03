-- Fix RLS policies to use existing enum values
DROP POLICY "HR can manage departments" ON public.departments;
DROP POLICY "HR can manage employees" ON public.employees;
DROP POLICY "HR can manage leave requests" ON public.leave_requests;
DROP POLICY "HR can manage attendance records" ON public.attendance_records_hr;
DROP POLICY "HR can manage payroll records" ON public.payroll_records;

-- Create corrected RLS policies using existing roles
CREATE POLICY "HR can manage departments" ON public.departments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage employees" ON public.employees
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage leave requests" ON public.leave_requests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage attendance records" ON public.attendance_records_hr
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "HR can manage payroll records" ON public.payroll_records
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);