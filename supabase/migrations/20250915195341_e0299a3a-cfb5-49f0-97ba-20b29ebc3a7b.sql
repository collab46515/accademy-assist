-- Create exam boards table
CREATE TABLE public.exam_boards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  full_name text NOT NULL,
  description text,
  website text,
  contact_email text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exam_boards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view exam boards" 
ON public.exam_boards 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "School admins can manage exam boards" 
ON public.exam_boards 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles ur
  WHERE ur.user_id = auth.uid()
    AND ur.role IN ('school_admin', 'super_admin')
    AND ur.is_active = true
));

-- Add trigger for updated_at
CREATE TRIGGER update_exam_boards_updated_at
  BEFORE UPDATE ON public.exam_boards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();