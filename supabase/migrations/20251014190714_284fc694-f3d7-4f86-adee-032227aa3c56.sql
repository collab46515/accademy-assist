-- Assign super_admin role to dominic@pappayacloud.com
-- Note: super_admin role doesn't require a school_id
INSERT INTO user_roles (user_id, role, is_active)
VALUES ('dbe5589f-d4a3-46f1-9112-07cdf908fcbe', 'super_admin', true);