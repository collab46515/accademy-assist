import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  exam_board?: string;
  exam_type: string;
  grade_level?: string;
  academic_term?: string;
  academic_year: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks: number;
  instructions?: string;
  created_by?: string;
  school_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  percentage: number;
  grade?: string;
  rank?: number;
  feedback?: string;
  marked_by?: string;
  marked_at: string;
}

export interface CreateExamData {
  title: string;
  subject: string;
  exam_board?: string;
  exam_type: string;
  grade_level?: string;
  academic_term?: string;
  academic_year: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks: number;
  instructions?: string;
  school_id?: string;
}

export function useExamData() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  // Fetch exams
  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive"
      });
    }
  };

  // Fetch exam results
  const fetchExamResults = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          *,
          exams!inner(title, subject)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExamResults(data || []);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      // Don't show error toast for results as it might be permission-related
    }
  };

  // Create new exam
  const createExam = async (examData: CreateExamData) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([{
          ...examData,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam scheduled successfully"
      });

      setRefreshTrigger(prev => prev + 1);
      return data;
    } catch (error) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error",
        description: "Failed to schedule exam",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update exam
  const updateExam = async (examId: string, updates: Partial<CreateExamData>) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', examId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam updated successfully"
      });

      setRefreshTrigger(prev => prev + 1);
      return data;
    } catch (error) {
      console.error('Error updating exam:', error);
      toast({
        title: "Error",
        description: "Failed to update exam",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Record exam result (upsert by exam_id + student_id)
  const recordExamResult = async (resultData: {
    exam_id: string;
    student_id: string;
    marks_obtained: number;
    grade?: string;
    feedback?: string;
  }) => {
    try {
      // Get the exam to calculate percentage
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .select('total_marks')
        .eq('id', resultData.exam_id)
        .single();

      if (examError) throw examError;

      const percentage = exam.total_marks > 0 
        ? Math.round((resultData.marks_obtained / exam.total_marks) * 100 * 100) / 100 
        : 0;

      const { data: existing, error: existingErr } = await supabase
        .from('exam_results')
        .select('id')
        .eq('exam_id', resultData.exam_id)
        .eq('student_id', resultData.student_id)
        .maybeSingle();
      if (existingErr) throw existingErr;

      let data;
      if (existing?.id) {
        const updateRes = await supabase
          .from('exam_results')
          .update({
            marks_obtained: resultData.marks_obtained,
            grade: resultData.grade,
            feedback: resultData.feedback,
            percentage,
            marked_by: user?.id,
            marked_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
        if (updateRes.error) throw updateRes.error;
        data = updateRes.data;
      } else {
        const insertRes = await supabase
          .from('exam_results')
          .insert({
            ...resultData,
            percentage,
            marked_by: user?.id,
            marked_at: new Date().toISOString()
          })
          .select()
          .single();
        if (insertRes.error) throw insertRes.error;
        data = insertRes.data;
      }

      toast({
        title: "Success",
        description: "Result recorded successfully"
      });

      setRefreshTrigger(prev => prev + 1);
      return data;
    } catch (error) {
      console.error('Error recording result:', error);
      toast({
        title: "Error",
        description: "Failed to record result",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Get student's upcoming exams
  const getStudentUpcomingExams = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_candidates')
        .select(`
          *,
          exams!inner(*)
        `)
        .eq('student_id', studentId)
        .gte('exams.exam_date', new Date().toISOString().split('T')[0])
        .order('exams.exam_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student exams:', error);
      return [];
    }
  };

  // Get student's exam results
  const getStudentResults = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          *,
          exams!inner(title, subject, exam_date)
        `)
        .eq('student_id', studentId)
        .order('exams.exam_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student results:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchExams(), fetchExamResults()]);
      setLoading(false);
    };

    loadData();
  }, [refreshTrigger]);

  return {
    exams,
    examResults,
    loading,
    refreshTrigger,
    createExam,
    updateExam,
    recordExamResult,
    getStudentUpcomingExams,
    getStudentResults,
    refresh: () => setRefreshTrigger(prev => prev + 1)
  };
}