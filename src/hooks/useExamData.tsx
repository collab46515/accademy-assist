import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  exam_board: string | null;
  exam_type: 'internal' | 'external' | 'mock' | 'assessment';
  grade_level: string | null;
  academic_term: string | null;
  academic_year: string;
  total_marks: number;
  duration_minutes: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  instructions: string | null;
  created_by: string | null;
  school_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamSession {
  id: string;
  exam_id: string;
  session_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room: string | null;
  invigilator_id: string | null;
  max_candidates: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ExamCandidate {
  id: string;
  exam_session_id: string;
  student_id: string | null;
  seat_number: string | null;
  status: 'registered' | 'present' | 'absent' | 'disqualified';
  access_arrangements: string[];
  registered_at: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string | null;
  marks_obtained: number;
  percentage: number;
  grade: string | null;
  rank: number | null;
  feedback: string | null;
  marked_by: string | null;
  marked_at: string;
}

export function useExamData() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [examCandidates, setExamCandidates] = useState<ExamCandidate[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get user's school_id from user_roles
  const getUserSchoolId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('school_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    return userRoles?.school_id || null;
  };

  // Fetch exams from Supabase
  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams((data || []) as Exam[]);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams');
    }
  };

  // Fetch exam results from Supabase
  const fetchExamResults = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('marked_at', { ascending: false });

      if (error) throw error;
      setExamResults((data || []) as ExamResult[]);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      toast.error('Failed to load exam results');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchExams(), fetchExamResults()]);
      setLoading(false);
    };

    loadData();
  }, [refreshTrigger]);

  const createExam = async (examData: Omit<Exam, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'school_id'>) => {
    try {
      console.log('Creating exam with data:', examData);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('exams')
        .insert({
          ...examData,
          created_by: user.id,
          school_id: null
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Exam created successfully:', data);
      
      // Update local state
      setExams(prev => [data as Exam, ...prev]);
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('Exam scheduled successfully!');
      return data as Exam;
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to schedule exam');
      throw error;
    }
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setExams(prev => prev.map(exam => exam.id === id ? data as Exam : exam));
      toast.success('Exam updated successfully');
      return data as Exam;
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error('Failed to update exam');
      throw error;
    }
  };

  const createExamSession = async (sessionData: Omit<ExamSession, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      setExamSessions(prev => [data as ExamSession, ...prev]);
      toast.success('Exam session created successfully');
      return data as ExamSession;
    } catch (error) {
      console.error('Error creating exam session:', error);
      toast.error('Failed to create exam session');
      throw error;
    }
  };

  const registerCandidate = async (candidateData: Omit<ExamCandidate, 'id' | 'registered_at'>) => {
    try {
      const { data, error } = await supabase
        .from('exam_candidates')
        .insert(candidateData)
        .select()
        .single();

      if (error) throw error;

      setExamCandidates(prev => [data as ExamCandidate, ...prev]);
      toast.success('Candidate registered successfully');
      return data as ExamCandidate;
    } catch (error) {
      console.error('Error registering candidate:', error);
      toast.error('Failed to register candidate');
      throw error;
    }
  };

  const recordExamResult = async (resultData: Omit<ExamResult, 'id' | 'marked_at' | 'marked_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('exam_results')
        .insert({
          ...resultData,
          marked_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setExamResults(prev => [data as ExamResult, ...prev]);
      toast.success('Exam result recorded successfully');
      return data as ExamResult;
    } catch (error) {
      console.error('Error recording exam result:', error);
      toast.error('Failed to record exam result');
      throw error;
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    exams,
    examSessions,
    examCandidates,
    examResults,
    loading,
    refreshTrigger,
    createExam,
    updateExam,
    createExamSession,
    registerCandidate,
    recordExamResult,
    refreshData
  };
}