-- Remove Transport Management database objects safely
-- This will drop all transport-related tables if they exist
-- Note: CASCADE ensures dependent constraints/policies/views are also removed

-- Drop child/dependent tables first
DROP TABLE IF EXISTS public.transport_incidents CASCADE;
DROP TABLE IF EXISTS public.route_stops CASCADE;
DROP TABLE IF EXISTS public.student_transport CASCADE;
DROP TABLE IF EXISTS public.vehicle_maintenance CASCADE;

-- Then drop parent tables
DROP TABLE IF EXISTS public.transport_routes CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;

-- Also drop notifications tied to transport module
DROP TABLE IF EXISTS public.transport_notifications CASCADE;

-- If there were any transport-specific enums or sequences, optionally drop them here
-- Example (uncomment if present in your schema):
-- DROP TYPE IF EXISTS public.transport_incident_type CASCADE;
-- DROP TYPE IF EXISTS public.vehicle_status CASCADE;
-- DROP SEQUENCE IF EXISTS public.transport_sequence CASCADE;