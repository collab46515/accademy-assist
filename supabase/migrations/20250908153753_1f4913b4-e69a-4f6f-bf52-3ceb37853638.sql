-- Add is_active flag to departments for archive/activate capability
ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Optional: ensure updated_at maintained if table has one (safe no-op if missing)
-- NOTE: Skipping triggers as table structure not fully known; minimal change per request.