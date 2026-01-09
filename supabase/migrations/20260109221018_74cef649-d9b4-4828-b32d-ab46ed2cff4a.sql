-- Add pickup/transport address fields to student_transport table
ALTER TABLE public.student_transport 
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS pickup_latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS pickup_longitude NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS dropoff_address TEXT,
ADD COLUMN IF NOT EXISTS dropoff_latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS dropoff_longitude NUMERIC(11, 8);

-- Add index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_student_transport_pickup_coords 
ON public.student_transport(pickup_latitude, pickup_longitude) 
WHERE pickup_latitude IS NOT NULL AND pickup_longitude IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.student_transport.pickup_address IS 'Student pickup location address for transport';
COMMENT ON COLUMN public.student_transport.pickup_latitude IS 'Latitude of pickup location';
COMMENT ON COLUMN public.student_transport.pickup_longitude IS 'Longitude of pickup location';