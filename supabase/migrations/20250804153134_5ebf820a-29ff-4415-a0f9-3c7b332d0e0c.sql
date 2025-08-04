-- Create profiles table that integrates with existing user_roles system
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  
  -- Additional profile fields
  date_of_birth DATE,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- System fields
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['school_admin'::app_role, 'super_admin'::app_role]) 
    AND ur.is_active = true
  )
);

-- Update the existing handle_new_user function to work with profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation (if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint to ensure user_id uniqueness
CREATE UNIQUE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Create index for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_active ON public.profiles(is_active) WHERE is_active = true;