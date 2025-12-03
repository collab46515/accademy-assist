-- Delete duplicate draft applications where a submitted version exists for the same student
DELETE FROM enrollment_applications 
WHERE id IN (
  '12d7052d-0f67-4a7f-bc00-a1e164c822d9',  -- Isreal draft
  '09ced758-d092-4cd7-8394-40103d5f23f4'   -- Jacob draft
);