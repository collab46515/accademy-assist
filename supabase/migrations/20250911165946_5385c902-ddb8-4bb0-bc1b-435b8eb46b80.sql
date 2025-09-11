-- Enable replica identity full for enrollment_applications table to capture complete row data during updates
ALTER TABLE public.enrollment_applications REPLICA IDENTITY FULL;

-- Add the enrollment_applications table to the supabase_realtime publication to enable real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.enrollment_applications;