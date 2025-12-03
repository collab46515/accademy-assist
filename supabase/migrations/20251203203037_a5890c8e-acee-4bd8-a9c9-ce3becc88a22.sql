-- Update existing fee heads to link to the current school (Anand Niketan)
UPDATE fee_heads 
SET school_id = 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6' 
WHERE school_id = '2f21656b-0848-40ee-bbec-12e5e8137545';

-- Also update fee_structures if any exist with the old school_id
UPDATE fee_structures 
SET school_id = 'fe361ba1-c41e-41e9-ba78-9960efbfc7b6' 
WHERE school_id = '2f21656b-0848-40ee-bbec-12e5e8137545';