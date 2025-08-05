-- Add password management fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN must_change_password boolean DEFAULT false,
ADD COLUMN password_reset_at timestamp with time zone;

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  school_id uuid REFERENCES public.schools(id),
  department text,
  year_group text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role, school_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Admins can manage user roles" ON public.user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('super_admin', 'school_admin') 
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- Create function for admins to request password reset
CREATE OR REPLACE FUNCTION public.request_password_reset(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the requesting user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'school_admin') 
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  -- Update the target user's profile to require password change
  UPDATE public.profiles 
  SET 
    must_change_password = true,
    password_reset_at = now()
  WHERE user_id = target_user_id;
  
  RETURN true;
END;
$$;

-- Create function to check if user must change password
CREATE OR REPLACE FUNCTION public.check_must_change_password()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(must_change_password, false)
  FROM public.profiles 
  WHERE user_id = auth.uid();
$$;

-- Create function to clear password change requirement
CREATE OR REPLACE FUNCTION public.clear_password_change_requirement()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    must_change_password = false,
    password_reset_at = null
  WHERE user_id = auth.uid();
END;
$$;