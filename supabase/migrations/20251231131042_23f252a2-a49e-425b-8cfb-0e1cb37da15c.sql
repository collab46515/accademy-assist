-- Add missing document URL columns for drivers
ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS license_document_url TEXT,
ADD COLUMN IF NOT EXISTS psv_badge_document_url TEXT,
ADD COLUMN IF NOT EXISTS hmv_permit_document_url TEXT;

-- Create storage bucket for driver documents if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-documents', 'driver-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for driver documents
CREATE POLICY "Users can upload driver documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'driver-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view driver documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'driver-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update driver documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'driver-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete driver documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'driver-documents' AND auth.role() = 'authenticated');