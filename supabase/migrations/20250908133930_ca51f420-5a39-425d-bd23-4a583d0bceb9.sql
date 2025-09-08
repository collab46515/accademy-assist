-- Create RLS policies for fee_heads table
CREATE POLICY "School staff can manage fee heads" 
ON public.fee_heads 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_heads.school_id 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create RLS policies for fee_structures table
CREATE POLICY "School staff can manage fee structures" 
ON public.fee_structures 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_structures.school_id 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create RLS policies for fee_discounts table
CREATE POLICY "School staff can manage fee discounts" 
ON public.fee_discounts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_discounts.school_id 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create RLS policies for fee_waivers table
CREATE POLICY "School staff can manage fee waivers" 
ON public.fee_waivers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_waivers.school_id 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create RLS policies for fee_alerts table
CREATE POLICY "School staff can manage fee alerts" 
ON public.fee_alerts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = fee_alerts.school_id 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);

-- Create RLS policies for student_fee_assignments table
CREATE POLICY "School staff can manage student fee assignments" 
ON public.student_fee_assignments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = student_fee_assignments.school_id 
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'teacher'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  ) OR is_super_admin(auth.uid())
);