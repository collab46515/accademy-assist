-- Reset the enrollment application status back to submitted so we can test the workflow
UPDATE enrollment_applications 
SET status = 'submitted' 
WHERE application_number = 'APP-1754678456630';