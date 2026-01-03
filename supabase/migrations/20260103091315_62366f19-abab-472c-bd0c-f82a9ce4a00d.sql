-- Create storage bucket for transport documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('transport-documents', 'transport-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for transport documents
CREATE POLICY "Anyone can view transport documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'transport-documents');

CREATE POLICY "Authenticated users can upload transport documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'transport-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their transport documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'transport-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their transport documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'transport-documents' AND auth.role() = 'authenticated');