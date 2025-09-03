-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view communications sent to them" ON public.communications;

-- Update the main policy to properly handle all operations including SELECT for staff
DROP POLICY IF EXISTS "School staff can manage communications" ON public.communications;

-- Create separate policies for better clarity
CREATE POLICY "School staff can manage all communications" 
ON public.communications
FOR ALL 
TO public
USING (
  (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = communications.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = communications.school_id 
    AND ur.role = ANY(ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role]) 
    AND ur.is_active = true
  )) OR is_super_admin(auth.uid())
);

-- Create a separate policy for end users (students/parents) to view only sent communications
CREATE POLICY "Recipients can view sent communications" 
ON public.communications
FOR SELECT 
TO public
USING (
  status = 'sent'::communication_status 
  AND (
    -- Students can view communications sent to their school/year/them specifically
    (EXISTS (
      SELECT 1 FROM students s 
      WHERE s.user_id = auth.uid() 
      AND s.school_id = communications.school_id 
      AND (
        communications.audience_type = 'entire_school'::audience_type
        OR (
          communications.audience_type = 'year_groups'::audience_type 
          AND s.year_group = ANY(
            SELECT jsonb_array_elements_text(communications.audience_details->'year_groups')
          )
        )
        OR (
          communications.audience_type = 'specific_students'::audience_type 
          AND s.id::text = ANY(
            SELECT jsonb_array_elements_text(communications.audience_details->'student_ids')
          )
        )
      )
    ))
    OR 
    -- Parents can view communications sent to their children's school/year/them specifically
    (EXISTS (
      SELECT 1 FROM student_parents sp 
      JOIN students s ON s.id = sp.student_id 
      WHERE sp.parent_id = auth.uid() 
      AND s.school_id = communications.school_id 
      AND (
        communications.audience_type = 'entire_school'::audience_type
        OR communications.audience_type = 'specific_parents'::audience_type
        OR (
          communications.audience_type = 'year_groups'::audience_type 
          AND s.year_group = ANY(
            SELECT jsonb_array_elements_text(communications.audience_details->'year_groups')
          )
        )
        OR (
          communications.audience_type = 'specific_students'::audience_type 
          AND s.id::text = ANY(
            SELECT jsonb_array_elements_text(communications.audience_details->'student_ids')
          )
        )
      )
    ))
  )
);