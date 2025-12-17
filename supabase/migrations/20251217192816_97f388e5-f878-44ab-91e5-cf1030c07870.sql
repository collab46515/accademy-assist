-- Add session field to attendance_records table for morning/afternoon tracking
ALTER TABLE public.attendance_records 
ADD COLUMN IF NOT EXISTS session VARCHAR(20) DEFAULT 'morning' CHECK (session IN ('morning', 'afternoon'));

-- Add is_completed flag to track when attendance is fully submitted for a session
ALTER TABLE public.attendance_records 
ADD COLUMN IF NOT EXISTS is_submitted BOOLEAN DEFAULT false;

-- Create attendance_session_summaries table to track session completion status
CREATE TABLE IF NOT EXISTS public.attendance_session_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  class_id VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  session VARCHAR(20) NOT NULL CHECK (session IN ('morning', 'afternoon')),
  total_students INTEGER NOT NULL DEFAULT 0,
  present_count INTEGER NOT NULL DEFAULT 0,
  absent_count INTEGER NOT NULL DEFAULT 0,
  late_count INTEGER NOT NULL DEFAULT 0,
  is_submitted BOOLEAN DEFAULT false,
  submitted_by UUID,
  submitted_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, class_id, date, session)
);

-- Enable RLS
ALTER TABLE public.attendance_session_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view attendance summaries for their school" 
ON public.attendance_session_summaries 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = attendance_session_summaries.school_id 
    AND ur.is_active = true
  )
);

CREATE POLICY "Teachers and admins can insert attendance summaries" 
ON public.attendance_session_summaries 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = attendance_session_summaries.school_id 
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin')
    AND ur.is_active = true
  )
);

CREATE POLICY "Teachers and admins can update attendance summaries" 
ON public.attendance_session_summaries 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.school_id = attendance_session_summaries.school_id 
    AND ur.role IN ('teacher', 'school_admin', 'hod', 'super_admin')
    AND ur.is_active = true
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_session_summaries_lookup 
ON public.attendance_session_summaries(school_id, date, session);

CREATE INDEX IF NOT EXISTS idx_attendance_records_session 
ON public.attendance_records(school_id, date, session);