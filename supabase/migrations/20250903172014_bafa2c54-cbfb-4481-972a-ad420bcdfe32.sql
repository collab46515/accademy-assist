-- Add RLS policies for HR tables to fix security warnings

-- Employees table policies (already has policies but ensuring they're comprehensive)
DROP POLICY IF EXISTS "Employees can view own data" ON employees;
DROP POLICY IF EXISTS "HR can manage employees" ON employees;
CREATE POLICY "Employees can view own data" ON employees FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "HR can manage employees" ON employees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Attendance records HR policies
CREATE POLICY "Employees can view own attendance" ON attendance_records_hr FOR SELECT USING (employee_id = auth.uid());
CREATE POLICY "HR can manage attendance" ON attendance_records_hr FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Leave requests policies
CREATE POLICY "Employees can manage own leave requests" ON leave_requests FOR ALL USING (employee_id = auth.uid());
CREATE POLICY "HR can manage all leave requests" ON leave_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Payroll records policies
CREATE POLICY "Employees can view own payroll" ON payroll_records FOR SELECT USING (employee_id = auth.uid());
CREATE POLICY "HR can manage payroll" ON payroll_records FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Time entries policies
CREATE POLICY "Employees can manage own time entries" ON time_entries FOR ALL USING (employee_id = auth.uid());
CREATE POLICY "HR can view all time entries" ON time_entries FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Travel requests policies
CREATE POLICY "Employees can manage own travel requests" ON travel_requests FOR ALL USING (employee_id = auth.uid());
CREATE POLICY "HR can manage all travel requests" ON travel_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Expense reports policies
CREATE POLICY "Employees can manage own expense reports" ON expense_reports FOR ALL USING (employee_id = auth.uid());
CREATE POLICY "HR can manage all expense reports" ON expense_reports FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Projects policies (general access for project management)
CREATE POLICY "Authenticated users can view projects" ON projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "HR can manage projects" ON projects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Engagement surveys policies
CREATE POLICY "Authenticated users can view surveys" ON engagement_surveys FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "HR can manage surveys" ON engagement_surveys FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);