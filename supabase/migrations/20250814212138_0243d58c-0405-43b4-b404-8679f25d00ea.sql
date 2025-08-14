-- Remove any admin roles from test users to ensure clean RBAC
DELETE FROM user_roles 
WHERE user_id IN (
  SELECT p.user_id 
  FROM profiles p 
  WHERE p.email IN ('test.student@pappaya.academy', 'test.parent@pappaya.academy')
) 
AND role IN ('super_admin', 'school_admin');

-- Ensure test users only have their intended roles
-- This will clean up any duplicate or conflicting roles