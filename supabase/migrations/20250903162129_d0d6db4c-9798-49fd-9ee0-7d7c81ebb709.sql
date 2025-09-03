-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam_board TEXT,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('internal', 'external', 'mock', 'assessment')),
  grade_level TEXT,
  academic_term TEXT,
  academic_year TEXT NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  instructions TEXT,
  created_by UUID REFERENCES auth.users(id),
  school_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam_sessions table
CREATE TABLE public.exam_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  invigilator_id UUID REFERENCES auth.users(id),
  max_candidates INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam_candidates table
CREATE TABLE public.exam_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_session_id UUID REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  seat_number TEXT,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'present', 'absent', 'disqualified')),
  access_arrangements TEXT[] DEFAULT '{}',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam_results table
CREATE TABLE public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  marks_obtained INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  grade TEXT,
  rank INTEGER,
  feedback TEXT,
  marked_by UUID REFERENCES auth.users(id),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Create policies for exams table using user_roles
CREATE POLICY "Users can view exams from their school" 
ON public.exams 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = exams.school_id
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can create exams for their school" 
ON public.exams 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = exams.school_id
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can update exams they created or manage" 
ON public.exams 
FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = exams.school_id
    AND ur.role = ANY (ARRAY['school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Create policies for exam_sessions table
CREATE POLICY "Users can view exam sessions from their school" 
ON public.exam_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.exams e
    JOIN public.user_roles ur ON ur.school_id = e.school_id
    WHERE e.id = exam_sessions.exam_id 
    AND ur.user_id = auth.uid()
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can create exam sessions for their school" 
ON public.exam_sessions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.exams e
    JOIN public.user_roles ur ON ur.school_id = e.school_id
    WHERE e.id = exam_sessions.exam_id 
    AND ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Create policies for exam_candidates table
CREATE POLICY "Users can view exam candidates from their school" 
ON public.exam_candidates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.exam_sessions es
    JOIN public.exams e ON e.id = es.exam_id
    JOIN public.user_roles ur ON ur.school_id = e.school_id
    WHERE es.id = exam_candidates.exam_session_id 
    AND ur.user_id = auth.uid()
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can register candidates for their school" 
ON public.exam_candidates 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.exam_sessions es
    JOIN public.exams e ON e.id = es.exam_id
    JOIN public.user_roles ur ON ur.school_id = e.school_id
    WHERE es.id = exam_candidates.exam_session_id 
    AND ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Create policies for exam_results table
CREATE POLICY "Users can view exam results from their school" 
ON public.exam_results 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.exams e
    JOIN public.user_roles ur ON ur.school_id = e.school_id
    WHERE e.id = exam_results.exam_id 
    AND ur.user_id = auth.uid()
    AND ur.is_active = true
  )
);

CREATE POLICY "Users can create exam results for their school" 
ON public.exam_results 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.exams e
    JOIN public.user_roles ur ON ur.school_id = e.school_id
    WHERE e.id = exam_results.exam_id 
    AND ur.user_id = auth.uid()
    AND ur.role = ANY (ARRAY['teacher'::app_role, 'school_admin'::app_role, 'hod'::app_role])
    AND ur.is_active = true
  )
);

-- Create trigger for automatic timestamp updates  
CREATE TRIGGER update_exams_updated_at
BEFORE UPDATE ON public.exams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();