-- Update app_role enum to include teaching roles if not already present
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'hod', 'ta', 'student', 'parent');
    ELSE
        -- Add new roles if they don't exist
        BEGIN
            ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hod';
        EXCEPTION WHEN duplicate_object THEN
            NULL;
        END;
        BEGIN
            ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ta';
        EXCEPTION WHEN duplicate_object THEN
            NULL;
        END;
    END IF;
END $$;

-- Create lesson_plans table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    year_group TEXT NOT NULL,
    form_class TEXT,
    lesson_date DATE NOT NULL,
    period_id TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'approved')),
    curriculum_topic_id UUID,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    success_criteria JSONB DEFAULT '[]'::jsonb,
    lesson_sections JSONB DEFAULT '[]'::jsonb,
    resources JSONB DEFAULT '{}'::jsonb,
    differentiation JSONB DEFAULT '{}'::jsonb,
    assessment JSONB DEFAULT '{}'::jsonb,
    collaboration JSONB DEFAULT '{}'::jsonb,
    sequence JSONB DEFAULT '{}'::jsonb,
    integration JSONB DEFAULT '{}'::jsonb,
    post_lesson_reflection JSONB,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson_plan_assignments table for TA assignments
CREATE TABLE IF NOT EXISTS public.lesson_plan_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_plan_id UUID NOT NULL REFERENCES public.lesson_plans(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('ta', 'observer', 'co_teacher')),
    permissions JSONB DEFAULT '{"view": true, "comment": false, "edit": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(lesson_plan_id, assigned_to)
);

-- Create lesson_plan_comments table for HOD/Admin feedback
CREATE TABLE IF NOT EXISTS public.lesson_plan_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_plan_id UUID NOT NULL REFERENCES public.lesson_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    comment_type TEXT DEFAULT 'general' CHECK (comment_type IN ('general', 'approval', 'suggestion', 'concern')),
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plan_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plan_comments ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for permission checking
CREATE OR REPLACE FUNCTION public.can_access_lesson_plan(
    lesson_plan_id UUID,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Check if user is the teacher who created the lesson
    SELECT EXISTS (
        SELECT 1 FROM lesson_plans lp
        WHERE lp.id = lesson_plan_id AND lp.teacher_id = user_id
    )
    OR 
    -- Check if user is HOD for the subject
    EXISTS (
        SELECT 1 FROM lesson_plans lp
        JOIN user_roles ur ON ur.user_id = user_id
        WHERE lp.id = lesson_plan_id 
        AND ur.role = 'hod'
        AND ur.department = lp.subject
        AND ur.school_id = lp.school_id
        AND ur.is_active = true
    )
    OR
    -- Check if user is assigned as TA
    EXISTS (
        SELECT 1 FROM lesson_plan_assignments lpa
        WHERE lpa.lesson_plan_id = lesson_plan_id
        AND lpa.assigned_to = user_id
    )
    OR
    -- Check if user is school admin or super admin
    EXISTS (
        SELECT 1 FROM lesson_plans lp
        JOIN user_roles ur ON ur.user_id = user_id
        WHERE lp.id = lesson_plan_id
        AND ur.school_id = lp.school_id
        AND ur.role IN ('school_admin', 'super_admin')
        AND ur.is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.can_edit_lesson_plan(
    lesson_plan_id UUID,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Only the teacher who created it can edit (unless it's approved)
    SELECT EXISTS (
        SELECT 1 FROM lesson_plans lp
        WHERE lp.id = lesson_plan_id 
        AND lp.teacher_id = user_id
        AND lp.status != 'approved'
    )
    OR
    -- School admin or super admin can always edit
    EXISTS (
        SELECT 1 FROM lesson_plans lp
        JOIN user_roles ur ON ur.user_id = user_id
        WHERE lp.id = lesson_plan_id
        AND ur.school_id = lp.school_id
        AND ur.role IN ('school_admin', 'super_admin')
        AND ur.is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.can_approve_lesson_plan(
    lesson_plan_id UUID,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- HOD can approve lessons in their subject
    SELECT EXISTS (
        SELECT 1 FROM lesson_plans lp
        JOIN user_roles ur ON ur.user_id = user_id
        WHERE lp.id = lesson_plan_id
        AND ur.role = 'hod'
        AND ur.department = lp.subject
        AND ur.school_id = lp.school_id
        AND ur.is_active = true
    )
    OR
    -- School admin or super admin can approve
    EXISTS (
        SELECT 1 FROM lesson_plans lp
        JOIN user_roles ur ON ur.user_id = user_id
        WHERE lp.id = lesson_plan_id
        AND ur.school_id = lp.school_id
        AND ur.role IN ('school_admin', 'super_admin')
        AND ur.is_active = true
    );
$$;

-- Create RLS policies for lesson_plans table

-- Teachers can view their own plans and approved ones from colleagues
CREATE POLICY "Teachers can view own and approved lesson plans"
ON public.lesson_plans
FOR SELECT
TO authenticated
USING (
    teacher_id = auth.uid()
    OR status = 'approved'
    OR can_access_lesson_plan(id, auth.uid())
);

-- Teachers can create their own lesson plans
CREATE POLICY "Teachers can create lesson plans"
ON public.lesson_plans
FOR INSERT
TO authenticated
WITH CHECK (
    teacher_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.school_id = lesson_plans.school_id
        AND ur.role IN ('teacher', 'hod', 'school_admin', 'super_admin')
        AND ur.is_active = true
    )
);

-- Teachers can edit their own plans (if not approved), HODs and admins can edit any
CREATE POLICY "Authorized users can edit lesson plans"
ON public.lesson_plans
FOR UPDATE
TO authenticated
USING (can_edit_lesson_plan(id, auth.uid()));

-- Only admins can delete lesson plans
CREATE POLICY "Admins can delete lesson plans"
ON public.lesson_plans
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.school_id = lesson_plans.school_id
        AND ur.role IN ('school_admin', 'super_admin')
        AND ur.is_active = true
    )
);

-- RLS policies for lesson_plan_assignments

-- Users can view assignments they created or are assigned to
CREATE POLICY "Users can view relevant assignments"
ON public.lesson_plan_assignments
FOR SELECT
TO authenticated
USING (
    assigned_to = auth.uid()
    OR assigned_by = auth.uid()
    OR can_access_lesson_plan(lesson_plan_id, auth.uid())
);

-- Teachers and HODs can create assignments
CREATE POLICY "Teachers and HODs can create assignments"
ON public.lesson_plan_assignments
FOR INSERT
TO authenticated
WITH CHECK (
    assigned_by = auth.uid()
    AND can_access_lesson_plan(lesson_plan_id, auth.uid())
);

-- Assignment creators can update assignments
CREATE POLICY "Assignment creators can update assignments"
ON public.lesson_plan_assignments
FOR UPDATE
TO authenticated
USING (assigned_by = auth.uid());

-- Assignment creators can delete assignments
CREATE POLICY "Assignment creators can delete assignments"
ON public.lesson_plan_assignments
FOR DELETE
TO authenticated
USING (assigned_by = auth.uid());

-- RLS policies for lesson_plan_comments

-- Users can view comments on lessons they have access to
CREATE POLICY "Users can view comments on accessible lessons"
ON public.lesson_plan_comments
FOR SELECT
TO authenticated
USING (
    can_access_lesson_plan(lesson_plan_id, auth.uid())
    AND (is_private = false OR user_id = auth.uid())
);

-- Users can create comments on lessons they have access to
CREATE POLICY "Users can comment on accessible lessons"
ON public.lesson_plan_comments
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND can_access_lesson_plan(lesson_plan_id, auth.uid())
);

-- Users can edit their own comments
CREATE POLICY "Users can edit own comments"
ON public.lesson_plan_comments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own comments, admins can delete any
CREATE POLICY "Users can delete own comments"
ON public.lesson_plan_comments
FOR DELETE
TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM lesson_plans lp
        JOIN user_roles ur ON ur.user_id = auth.uid()
        WHERE lp.id = lesson_plan_comments.lesson_plan_id
        AND ur.school_id = lp.school_id
        AND ur.role IN ('school_admin', 'super_admin')
        AND ur.is_active = true
    )
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lesson_plans_updated_at
    BEFORE UPDATE ON public.lesson_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_plans_teacher_id ON public.lesson_plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_school_subject ON public.lesson_plans(school_id, subject);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_status ON public.lesson_plans(status);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_date ON public.lesson_plans(lesson_date);
CREATE INDEX IF NOT EXISTS idx_lesson_plan_assignments_assigned_to ON public.lesson_plan_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lesson_plan_comments_lesson_id ON public.lesson_plan_comments(lesson_plan_id);