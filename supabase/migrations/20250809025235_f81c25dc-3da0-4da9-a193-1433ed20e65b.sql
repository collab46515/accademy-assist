-- Enable RLS on schools table if not already enabled
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for schools table
-- School admins and super admins can manage schools
CREATE POLICY "School admins can manage their school data" ON public.schools
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = schools.id 
    AND ur.role IN ('school_admin', 'super_admin') 
    AND ur.is_active = true
  ) 
  OR is_super_admin(auth.uid())
);

-- Allow users to view schools they have access to (for staff/teachers/students)
CREATE POLICY "Users can view their school" ON public.schools
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = schools.id 
    AND ur.is_active = true
  )
  OR is_super_admin(auth.uid())
);