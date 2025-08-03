-- Create enum types for roles and permissions
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'school_admin', 
  'teacher',
  'form_tutor',
  'dsl',
  'nurse',
  'hod',
  'parent',
  'student'
);

CREATE TYPE public.permission_type AS ENUM (
  'read',
  'write',
  'delete',
  'approve',
  'escalate'
);

CREATE TYPE public.resource_type AS ENUM (
  'students',
  'grades',
  'attendance',
  'medical_records',
  'safeguarding_logs',
  'financial_data',
  'reports',
  'staff_management',
  'system_settings',
  'communications',
  'timetables',
  'admissions'
);

-- Schools table for multi-tenancy
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table (users can have multiple roles across different schools)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  department TEXT, -- For HoD and Teacher roles
  year_group TEXT, -- For Form Tutor roles
  is_active BOOLEAN NOT NULL DEFAULT true,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, school_id, role, department, year_group)
);

-- Permissions matrix
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  resource resource_type NOT NULL,
  permission permission_type NOT NULL,
  conditions JSONB DEFAULT '{}', -- Additional conditions like "own_students_only"
  UNIQUE(role, resource, permission)
);

-- Audit log for compliance
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  school_id UUID REFERENCES public.schools(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  elevated_privilege BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student-parent relationships
CREATE TABLE public.student_parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL, -- 'mother', 'father', 'guardian', etc.
  is_primary BOOLEAN DEFAULT false,
  emergency_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_number TEXT NOT NULL,
  year_group TEXT NOT NULL,
  form_class TEXT,
  admission_date DATE,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  safeguarding_notes TEXT,
  is_enrolled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, student_number)
);

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID, school_uuid UUID DEFAULT NULL)
RETURNS TABLE(role app_role, school_id UUID, department TEXT, year_group TEXT)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT ur.role, ur.school_id, ur.department, ur.year_group
  FROM public.user_roles ur
  WHERE ur.user_id = user_uuid 
    AND ur.is_active = true
    AND (school_uuid IS NULL OR ur.school_id = school_uuid);
$$;

CREATE OR REPLACE FUNCTION public.has_permission(
  user_uuid UUID, 
  school_uuid UUID, 
  resource resource_type, 
  permission permission_type
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    WHERE ur.user_id = user_uuid
      AND ur.school_id = school_uuid
      AND ur.is_active = true
      AND rp.resource = resource
      AND rp.permission = permission
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = user_uuid
      AND ur.role = 'super_admin'
      AND ur.is_active = true
  );
$$;

-- RLS Policies

-- Schools: Super admins see all, others see only their schools
CREATE POLICY "Super admins can view all schools" ON public.schools
  FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their assigned schools" ON public.schools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
        AND ur.school_id = id 
        AND ur.is_active = true
    )
  );

-- Profiles: Users can view their own profile, admins can view others
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles in their school" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
        AND ur.role IN ('super_admin', 'school_admin')
        AND ur.is_active = true
    )
  );

-- User roles: Users can view their own roles, admins can manage others
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view roles in their school" ON public.user_roles
  FOR SELECT USING (
    public.has_permission(auth.uid(), school_id, 'staff_management', 'read')
  );

-- Students: Complex permissions based on role and relationships
CREATE POLICY "Teachers can view their students" ON public.students
  FOR SELECT USING (
    -- Form tutors can see their form class
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = students.school_id
        AND ur.role = 'form_tutor'
        AND ur.year_group = students.form_class
        AND ur.is_active = true
    )
    OR
    -- DSL can see all students in their school
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.school_id = students.school_id
        AND ur.role = 'dsl'
        AND ur.is_active = true
    )
    OR
    -- School admins can see all in their school
    public.has_permission(auth.uid(), students.school_id, 'students', 'read')
  );

CREATE POLICY "Parents can view their children" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_parents sp
      WHERE sp.student_id = students.user_id
        AND sp.parent_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own data" ON public.students
  FOR SELECT USING (user_id = auth.uid());

-- Insert default permissions for each role
INSERT INTO public.role_permissions (role, resource, permission, conditions) VALUES
-- Super Admin
('super_admin', 'system_settings', 'read', '{}'),
('super_admin', 'system_settings', 'write', '{}'),
('super_admin', 'staff_management', 'read', '{}'),
('super_admin', 'staff_management', 'write', '{}'),

-- School Admin  
('school_admin', 'students', 'read', '{"scope": "school_only"}'),
('school_admin', 'students', 'write', '{"scope": "school_only"}'),
('school_admin', 'staff_management', 'read', '{"scope": "school_only"}'),
('school_admin', 'staff_management', 'write', '{"scope": "school_only"}'),
('school_admin', 'reports', 'read', '{"scope": "school_only"}'),
('school_admin', 'admissions', 'read', '{"scope": "school_only"}'),
('school_admin', 'admissions', 'write', '{"scope": "school_only"}'),
('school_admin', 'timetables', 'read', '{"scope": "school_only"}'),
('school_admin', 'timetables', 'write', '{"scope": "school_only"}'),

-- Teacher
('teacher', 'students', 'read', '{"scope": "assigned_classes_only"}'),
('teacher', 'grades', 'read', '{"scope": "assigned_classes_only"}'),
('teacher', 'grades', 'write', '{"scope": "assigned_classes_only"}'),
('teacher', 'attendance', 'read', '{"scope": "assigned_classes_only"}'),
('teacher', 'attendance', 'write', '{"scope": "assigned_classes_only"}'),
('teacher', 'communications', 'read', '{"scope": "assigned_classes_only"}'),
('teacher', 'communications', 'write', '{"scope": "assigned_classes_only"}'),

-- Form Tutor
('form_tutor', 'students', 'read', '{"scope": "form_class_only"}'),
('form_tutor', 'attendance', 'read', '{"scope": "form_class_only"}'),
('form_tutor', 'attendance', 'write', '{"scope": "form_class_only"}'),
('form_tutor', 'communications', 'read', '{"scope": "form_class_only"}'),
('form_tutor', 'communications', 'write', '{"scope": "form_class_only"}'),

-- DSL
('dsl', 'safeguarding_logs', 'read', '{"scope": "school_only"}'),
('dsl', 'safeguarding_logs', 'write', '{"scope": "school_only"}'),
('dsl', 'students', 'read', '{"scope": "school_only", "includes": "full_profile"}'),

-- Nurse
('nurse', 'medical_records', 'read', '{"scope": "school_only"}'),
('nurse', 'medical_records', 'write', '{"scope": "school_only"}'),
('nurse', 'students', 'read', '{"scope": "school_only", "fields": "medical_only"}'),

-- Head of Department
('hod', 'grades', 'read', '{"scope": "department_only"}'),
('hod', 'grades', 'approve', '{"scope": "department_only"}'),
('hod', 'reports', 'read', '{"scope": "department_only"}'),

-- Parent
('parent', 'students', 'read', '{"scope": "own_children_only"}'),
('parent', 'grades', 'read', '{"scope": "own_children_only"}'),
('parent', 'attendance', 'read', '{"scope": "own_children_only"}'),
('parent', 'communications', 'read', '{"scope": "own_children_only"}'),

-- Student
('student', 'grades', 'read', '{"scope": "own_only"}'),
('student', 'attendance', 'read', '{"scope": "own_only"}'),
('student', 'timetables', 'read', '{"scope": "own_only"}');

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to key tables
CREATE TRIGGER audit_students_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add timestamp triggers
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();