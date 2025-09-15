-- Fix workflow completion percentage for enrolled students
UPDATE enrollment_applications 
SET workflow_completion_percentage = 100 
WHERE status = 'enrolled' AND (workflow_completion_percentage IS NULL OR workflow_completion_percentage = 0);