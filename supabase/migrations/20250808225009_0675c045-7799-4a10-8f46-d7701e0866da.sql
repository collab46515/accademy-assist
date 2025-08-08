-- Create storage bucket for school assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for school assets bucket
-- Allow school admins to manage their school's assets
CREATE POLICY "School admins can manage their school assets" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'school-assets' AND 
  (storage.foldername(name))[1] IN (
    SELECT s.id::text 
    FROM schools s 
    JOIN user_roles ur ON ur.school_id = s.id 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin') 
    AND ur.is_active = true
  )
)
WITH CHECK (
  bucket_id = 'school-assets' AND 
  (storage.foldername(name))[1] IN (
    SELECT s.id::text 
    FROM schools s 
    JOIN user_roles ur ON ur.school_id = s.id 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('school_admin', 'super_admin') 
    AND ur.is_active = true
  )
);

-- Allow public read access to school assets (for logos)
CREATE POLICY "Public can view school assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'school-assets');

-- Super admins can manage all school assets
CREATE POLICY "Super admins can manage all school assets" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'school-assets' AND 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'super_admin' 
    AND ur.is_active = true
  )
)
WITH CHECK (
  bucket_id = 'school-assets' AND 
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'super_admin' 
    AND ur.is_active = true
  )
);