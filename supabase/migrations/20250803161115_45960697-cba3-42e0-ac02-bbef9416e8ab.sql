-- Add missing RLS policies for all new tables

-- Performance Goals policies
CREATE POLICY "HR can manage performance goals" ON public.performance_goals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own goals" ON public.performance_goals
FOR SELECT USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Training courses policies
CREATE POLICY "HR can manage training courses" ON public.training_courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view training courses" ON public.training_courses
FOR SELECT USING (true);

-- Training enrollments policies
CREATE POLICY "HR can manage training enrollments" ON public.training_enrollments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own enrollments" ON public.training_enrollments
FOR SELECT USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Benefit plans policies
CREATE POLICY "HR can manage benefit plans" ON public.benefit_plans
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view benefit plans" ON public.benefit_plans
FOR SELECT USING (is_active = true);

-- Employee benefits policies
CREATE POLICY "HR can manage employee benefits" ON public.employee_benefits
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own benefits" ON public.employee_benefits
FOR SELECT USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Document categories policies
CREATE POLICY "HR can manage document categories" ON public.document_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

-- Employee documents policies
CREATE POLICY "HR can manage employee documents" ON public.employee_documents
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view own documents" ON public.employee_documents
FOR SELECT USING (
  employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()) 
  AND access_level IN ('private', 'public')
);

-- Asset categories policies
CREATE POLICY "HR can manage asset categories" ON public.asset_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

-- Company assets policies
CREATE POLICY "HR can manage company assets" ON public.company_assets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view assigned assets" ON public.company_assets
FOR SELECT USING (assigned_to = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Projects policies
CREATE POLICY "HR can manage projects" ON public.projects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Project managers can manage their projects" ON public.projects
FOR ALL USING (project_manager_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "Employees can view projects" ON public.projects
FOR SELECT USING (true);

-- Time entries policies
CREATE POLICY "HR can manage time entries" ON public.time_entries
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can manage own time entries" ON public.time_entries
FOR ALL USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Travel requests policies
CREATE POLICY "HR can manage travel requests" ON public.travel_requests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can manage own travel requests" ON public.travel_requests
FOR ALL USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Expense reports policies
CREATE POLICY "HR can manage expense reports" ON public.expense_reports
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can manage own expense reports" ON public.expense_reports
FOR ALL USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Expense items policies
CREATE POLICY "HR can manage expense items" ON public.expense_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can manage own expense items" ON public.expense_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM expense_reports er 
    WHERE er.id = expense_items.expense_report_id 
    AND er.employee_id = (SELECT id FROM employees WHERE user_id = auth.uid())
  )
);

-- Engagement surveys policies
CREATE POLICY "HR can manage engagement surveys" ON public.engagement_surveys
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can view active surveys" ON public.engagement_surveys
FOR SELECT USING (status = 'active');

-- Survey responses policies
CREATE POLICY "HR can view survey responses" ON public.survey_responses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Employees can submit survey responses" ON public.survey_responses
FOR INSERT WITH CHECK (
  employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()) OR employee_id IS NULL
);

CREATE POLICY "Employees can view own survey responses" ON public.survey_responses
FOR SELECT USING (employee_id = (SELECT id FROM employees WHERE user_id = auth.uid()));