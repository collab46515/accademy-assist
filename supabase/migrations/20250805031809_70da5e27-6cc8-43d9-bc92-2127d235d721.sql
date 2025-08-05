-- Remove duplicate Super Admin role for user
-- Keeping the first one and removing the second duplicate
DELETE FROM user_roles 
WHERE id = 'ee6b26a5-5466-4cc2-bce4-fae1e6f9dc6d';