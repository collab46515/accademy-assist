-- Create a trigger function to auto-reject applications when assessment/interview fails
CREATE OR REPLACE FUNCTION public.auto_reject_on_fail_result()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if assessment result is fail
  IF NEW.assessment_data IS NOT NULL AND 
     NEW.assessment_data->>'result' = 'fail' AND
     NEW.status NOT IN ('rejected', 'withdrawn', 'offer_declined') THEN
    NEW.status := 'rejected';
  END IF;
  
  -- Check if interview result is fail
  IF NEW.interview_data IS NOT NULL AND 
     NEW.interview_data->>'result' = 'fail' AND
     NEW.status NOT IN ('rejected', 'withdrawn', 'offer_declined') THEN
    NEW.status := 'rejected';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_auto_reject_on_fail ON public.enrollment_applications;
CREATE TRIGGER trigger_auto_reject_on_fail
  BEFORE UPDATE ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_reject_on_fail_result();

-- Also update existing applications with fail results to rejected status
UPDATE public.enrollment_applications
SET status = 'rejected'
WHERE (assessment_data->>'result' = 'fail' OR interview_data->>'result' = 'fail')
  AND status NOT IN ('rejected', 'withdrawn', 'offer_declined');