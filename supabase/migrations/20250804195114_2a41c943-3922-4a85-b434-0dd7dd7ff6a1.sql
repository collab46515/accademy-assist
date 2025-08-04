-- Create storage bucket for lesson plan attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-attachments', 'lesson-attachments', true);

-- Create policies for lesson plan attachments
CREATE POLICY "Teachers can view lesson attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-attachments');

CREATE POLICY "Teachers can upload lesson attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Teachers can update their lesson attachments"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Teachers can delete their lesson attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-attachments' AND auth.role() = 'authenticated');