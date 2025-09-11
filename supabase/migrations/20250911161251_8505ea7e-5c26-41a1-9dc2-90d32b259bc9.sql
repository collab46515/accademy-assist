-- First, move all students from demo school to the real school
UPDATE students 
SET school_id = '2f21656b-0848-40ee-bbec-12e5e8137545'
WHERE school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';

-- Move enrollment applications to the real school
UPDATE enrollment_applications 
SET school_id = '2f21656b-0848-40ee-bbec-12e5e8137545'
WHERE school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';

-- Clean up demo user roles
DELETE FROM user_roles 
WHERE school_id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';

-- Now delete the demo school
DELETE FROM schools 
WHERE id = 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';