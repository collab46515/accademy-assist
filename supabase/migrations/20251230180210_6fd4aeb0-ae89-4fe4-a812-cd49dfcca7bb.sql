-- Add transport-specific fields to schools table
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS transport_admin_name TEXT,
ADD COLUMN IF NOT EXISTS transport_admin_phone TEXT,
ADD COLUMN IF NOT EXISTS transport_admin_email TEXT,
ADD COLUMN IF NOT EXISTS school_head_name TEXT,
ADD COLUMN IF NOT EXISTS school_head_phone TEXT,
ADD COLUMN IF NOT EXISTS school_head_email TEXT,
ADD COLUMN IF NOT EXISTS gps_latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS gps_longitude NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS geofence_radius_meters INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS branch_name TEXT,
ADD COLUMN IF NOT EXISTS branch_principal_name TEXT,
ADD COLUMN IF NOT EXISTS branch_principal_phone TEXT,
ADD COLUMN IF NOT EXISTS branch_principal_email TEXT;

-- Add landmark field to route_stops table
ALTER TABLE public.route_stops
ADD COLUMN IF NOT EXISTS landmark TEXT;