-- Update auth settings to improve security
-- These settings address the security warnings from the linter

-- Enable password strength requirements and leaked password protection
INSERT INTO auth.config (parameter, value) VALUES 
  ('password_min_length', '8'),
  ('password_require_symbols', 'true'),
  ('password_require_numbers', 'true'),
  ('password_require_uppercase', 'true'),
  ('password_require_lowercase', 'true'),
  ('enable_leaked_password_protection', 'true')
ON CONFLICT (parameter) DO UPDATE SET value = EXCLUDED.value;

-- Update OTP expiry to recommended settings (shorter expiry for better security)
UPDATE auth.config 
SET value = '3600' -- 1 hour instead of default longer period
WHERE parameter = 'otp_expiry';