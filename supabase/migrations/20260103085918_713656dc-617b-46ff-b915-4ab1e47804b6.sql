-- Make driver-documents bucket public so documents can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'driver-documents';