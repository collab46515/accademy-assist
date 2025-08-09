-- Add missing columns to schools table
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS principal_name text,
ADD COLUMN IF NOT EXISTS establishment_type text DEFAULT 'secondary',
ADD COLUMN IF NOT EXISTS motto text,
ADD COLUMN IF NOT EXISTS founded_year integer,
ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS academic_year_start date,
ADD COLUMN IF NOT EXISTS academic_year_end date;