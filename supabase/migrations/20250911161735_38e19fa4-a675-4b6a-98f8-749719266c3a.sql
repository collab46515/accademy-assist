-- Assign 'student' role to all students who don't have user_roles yet
INSERT INTO user_roles (user_id, school_id, role, is_active, assigned_by)
SELECT 
    s.user_id,
    s.school_id,
    'student'::app_role,
    true,
    (SELECT id FROM auth.users WHERE email = 'dominic@pappayacloud.com') -- Your admin user as assigned_by
FROM students s
LEFT JOIN user_roles ur ON s.user_id = ur.user_id AND ur.role = 'student'
WHERE ur.user_id IS NULL -- Only students without existing student roles
  AND s.school_id = '2f21656b-0848-40ee-bbec-12e5e8137545';