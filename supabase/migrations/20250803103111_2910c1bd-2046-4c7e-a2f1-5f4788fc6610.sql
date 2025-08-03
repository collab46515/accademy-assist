-- Create enum for application roles
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

-- Create schools table for multi-tenant support
CREATE TABLE public.schools (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    address TEXT,
    date_of_birth DATE,
    profile_picture_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table (many-to-many between users and schools with roles)
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    department TEXT, -- For HoD and Teacher roles
    form_group TEXT, -- For Form Tutor role
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, school_id, role, department, form_group)
);

-- Create role permissions table for granular permissions
CREATE TABLE public.role_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role app_role NOT NULL,
    resource TEXT NOT NULL, -- e.g., 'students', 'grades', 'attendance'
    action TEXT NOT NULL, -- e.g., 'read', 'write', 'delete'
    conditions JSONB DEFAULT '{}', -- Additional conditions for permission
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    school_id UUID REFERENCES public.schools(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    is_elevated_privilege BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL, -- School-specific student ID
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    year_group TEXT,
    form_group TEXT,
    house TEXT,
    admission_date DATE,
    email TEXT,
    phone TEXT,
    address TEXT,
    medical_notes TEXT, -- Visible to nurse and DSL only
    safeguarding_notes TEXT, -- Visible to DSL only
    dietary_requirements TEXT,
    emergency_contact_1_name TEXT,
    emergency_contact_1_phone TEXT,
    emergency_contact_1_relationship TEXT,
    emergency_contact_2_name TEXT,
    emergency_contact_2_phone TEXT,
    emergency_contact_2_relationship TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(school_id, student_id)
);

-- Create student-parent relationships table
CREATE TABLE public.student_parents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL, -- 'mother', 'father', 'guardian', etc.
    is_primary_contact BOOLEAN DEFAULT false,
    has_financial_responsibility BOOLEAN DEFAULT true,
    has_emergency_contact BOOLEAN DEFAULT true,
    can_collect_student BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, parent_user_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.has_role_in_school(_user_id UUID, _school_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = _user_id 
        AND school_id = _school_id 
        AND role = _role 
        AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role_in_school(_user_id UUID, _school_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = _user_id 
        AND school_id = _school_id 
        AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = _user_id 
        AND role = 'super_admin' 
        AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_schools(_user_id UUID)
RETURNS TABLE(school_id UUID)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT DISTINCT ur.school_id
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id 
    AND ur.is_active = true
    AND ur.school_id IS NOT NULL;
$$;

-- Create RLS policies

-- Schools policies
CREATE POLICY "Super admins can view all schools" ON public.schools
    FOR SELECT TO authenticated
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "School users can view their schools" ON public.schools
    FOR SELECT TO authenticated
    USING (id IN (SELECT school_id FROM public.get_user_schools(auth.uid())));

CREATE POLICY "Super admins can insert schools" ON public.schools
    FOR INSERT TO authenticated
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update schools" ON public.schools
    FOR UPDATE TO authenticated
    USING (public.is_super_admin(auth.uid()));

-- Profiles policies
CREATE POLICY "Users can view all profiles in their schools" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.user_roles ur1, public.user_roles ur2
            WHERE ur1.user_id = auth.uid() 
            AND ur2.user_id = profiles.user_id
            AND ur1.school_id = ur2.school_id
            AND ur1.is_active = true
            AND ur2.is_active = true
        )
    );

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Super admins can view all roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "School admins can view roles in their schools" ON public.user_roles
    FOR SELECT TO authenticated
    USING (
        school_id IN (SELECT school_id FROM public.get_user_schools(auth.uid())) OR
        user_id = auth.uid()
    );

CREATE POLICY "Super admins can manage all roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "School admins can manage roles in their schools" ON public.user_roles
    FOR ALL TO authenticated
    USING (
        public.has_role_in_school(auth.uid(), school_id, 'school_admin') AND
        role != 'super_admin'
    )
    WITH CHECK (
        public.has_role_in_school(auth.uid(), school_id, 'school_admin') AND
        role != 'super_admin'
    );

-- Students policies
CREATE POLICY "School staff can view students in their schools" ON public.students
    FOR SELECT TO authenticated
    USING (public.has_any_role_in_school(auth.uid(), school_id));

CREATE POLICY "Parents can view their children" ON public.students
    FOR SELECT TO authenticated
    USING (
        id IN (
            SELECT sp.student_id 
            FROM public.student_parents sp 
            WHERE sp.parent_user_id = auth.uid()
        )
    );

CREATE POLICY "School admins can manage students" ON public.students
    FOR ALL TO authenticated
    USING (public.has_role_in_school(auth.uid(), school_id, 'school_admin'))
    WITH CHECK (public.has_role_in_school(auth.uid(), school_id, 'school_admin'));

-- Student-parent relationships policies
CREATE POLICY "Parents can view their relationships" ON public.student_parents
    FOR SELECT TO authenticated
    USING (parent_user_id = auth.uid());

CREATE POLICY "School staff can view parent relationships" ON public.student_parents
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_parents.student_id
            AND public.has_any_role_in_school(auth.uid(), s.school_id)
        )
    );

CREATE POLICY "School admins can manage parent relationships" ON public.student_parents
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_parents.student_id
            AND public.has_role_in_school(auth.uid(), s.school_id, 'school_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_parents.student_id
            AND public.has_role_in_school(auth.uid(), s.school_id, 'school_admin')
        )
    );

-- Audit logs policies
CREATE POLICY "Super admins can view all audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "School admins can view their school audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        school_id IN (SELECT school_id FROM public.get_user_schools(auth.uid())) AND
        public.has_role_in_school(auth.uid(), school_id, 'school_admin')
    );

CREATE POLICY "All authenticated users can insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Create trigger functions for automation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit logging function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
    );
    
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Audit triggers for sensitive tables
CREATE TRIGGER audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_students
    AFTER INSERT OR UPDATE OR DELETE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Update timestamp triggers
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON public.schools
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default role permissions
INSERT INTO public.role_permissions (role, resource, action, conditions) VALUES
-- Super Admin permissions
('super_admin', '*', '*', '{}'),

-- School Admin permissions
('school_admin', 'schools', 'read', '{"scope": "own_school"}'),
('school_admin', 'schools', 'update', '{"scope": "own_school"}'),
('school_admin', 'users', '*', '{"scope": "own_school"}'),
('school_admin', 'students', '*', '{"scope": "own_school"}'),
('school_admin', 'reports', '*', '{"scope": "own_school"}'),

-- Teacher permissions
('teacher', 'students', 'read', '{"scope": "assigned_classes"}'),
('teacher', 'attendance', '*', '{"scope": "assigned_classes"}'),
('teacher', 'grades', '*', '{"scope": "assigned_classes"}'),
('teacher', 'reports', 'read', '{"scope": "assigned_classes"}'),

-- Form Tutor permissions
('form_tutor', 'students', 'read', '{"scope": "form_group"}'),
('form_tutor', 'attendance', '*', '{"scope": "form_group"}'),
('form_tutor', 'pastoral_notes', '*', '{"scope": "form_group"}'),

-- DSL permissions
('dsl', 'safeguarding', '*', '{"scope": "own_school"}'),
('dsl', 'students', 'read', '{"scope": "own_school"}'),
('dsl', 'audit_logs', 'read', '{"scope": "safeguarding"}'),

-- Nurse permissions
('nurse', 'medical_records', '*', '{"scope": "own_school"}'),
('nurse', 'students', 'read', '{"scope": "medical_only"}'),

-- Head of Department permissions
('hod', 'students', 'read', '{"scope": "department"}'),
('hod', 'grades', '*', '{"scope": "department"}'),
('hod', 'reports', '*', '{"scope": "department"}'),

-- Parent permissions
('parent', 'students', 'read', '{"scope": "own_children"}'),
('parent', 'attendance', 'read', '{"scope": "own_children"}'),
('parent', 'grades', 'read', '{"scope": "own_children"}'),
('parent', 'reports', 'read', '{"scope": "own_children"}'),

-- Student permissions
('student', 'students', 'read', '{"scope": "self"}'),
('student', 'attendance', 'read', '{"scope": "self"}'),
('student', 'grades', 'read', '{"scope": "self"}'),
('student', 'timetable', 'read', '{"scope": "self"}');