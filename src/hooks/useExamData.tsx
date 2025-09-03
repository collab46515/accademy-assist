import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  exam_board: string;
  exam_type: 'internal' | 'external' | 'mock' | 'assessment';
  grade_level: string;
  academic_term: string;
  academic_year: string;
  total_marks: number;
  duration_minutes: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  instructions: string;
  created_by: string;
  school_id: string;
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
  room: string;
  invigilator_id: string;
  max_candidates: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ExamCandidate {
  id: string;
  exam_session_id: string;
  student_id: string;
  seat_number: string;
  status: 'registered' | 'present' | 'absent' | 'disqualified';
  access_arrangements: string[];
  registered_at: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  percentage: number;
  grade: string;
  rank: number | null;
  feedback: string;
  marked_by: string;
  marked_at: string;
}

// Mock data
const mockExams: Exam[] = [
  {
    id: "1",
    title: "Mathematics End of Term Assessment",
    subject: "Mathematics",
    exam_board: "Cambridge",
    exam_type: "internal",
    grade_level: "Year 10",
    academic_term: "Term 1",
    academic_year: "2023-2024",
    total_marks: 100,
    duration_minutes: 150,
    exam_date: "2024-03-15",
    start_time: "09:00",
    end_time: "11:30",
    instructions: "Answer all questions in Section A and choose 3 from Section B",
    created_by: "teacher-1",
    school_id: "school-1",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    title: "Physics IGCSE Mock Exam",
    subject: "Physics",
    exam_board: "Edexcel",
    exam_type: "mock",
    grade_level: "Year 11",
    academic_term: "Term 2",
    academic_year: "2023-2024",
    total_marks: 120,
    duration_minutes: 180,
    exam_date: "2024-03-20",
    start_time: "14:00",
    end_time: "17:00",
    instructions: "This is a mock examination. Answer all questions.",
    created_by: "teacher-2",
    school_id: "school-1",
    is_active: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "3",
    title: "English Literature A-Level",
    subject: "English Literature",
    exam_board: "AQA",
    exam_type: "external",
    grade_level: "Year 13",
    academic_term: "Term 3",
    academic_year: "2023-2024",
    total_marks: 75,
    duration_minutes: 120,
    exam_date: "2024-05-15",
    start_time: "09:00",
    end_time: "11:00",
    instructions: "Answer one question from each section",
    created_by: "teacher-3",
    school_id: "school-1",
    is_active: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z"
  }
];

const mockExamResults: ExamResult[] = [
  {
    id: "1",
    exam_id: "1",
    student_id: "student-1",
    marks_obtained: 87,
    percentage: 87,
    grade: "A",
    rank: 1,
    feedback: "Excellent work",
    marked_by: "teacher-1",
    marked_at: "2024-03-16T00:00:00Z"
  },
  {
    id: "2",
    exam_id: "1",
    student_id: "student-2",
    marks_obtained: 74,
    percentage: 74,
    grade: "B",
    rank: 5,
    feedback: "Good effort, improve calculation accuracy",
    marked_by: "teacher-1",
    marked_at: "2024-03-16T00:00:00Z"
  },
  {
    id: "3",
    exam_id: "2",
    student_id: "student-3",
    marks_obtained: 110,
    percentage: 92,
    grade: "A*",
    rank: 1,
    feedback: "Outstanding performance",
    marked_by: "teacher-2",
    marked_at: "2024-03-21T00:00:00Z"
  }
];

export function useExamData() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [examCandidates, setExamCandidates] = useState<ExamCandidate[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>(mockExamResults);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const createExam = async (examData: Omit<Exam, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'school_id'>) => {
    try {
      console.log('Creating exam with data:', examData);
      
      const newExam: Exam = {
        ...examData,
        id: Date.now().toString(),
        created_by: "current-user",
        school_id: "current-school",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('New exam created:', newExam);
      
      // Force immediate state update
      setExams(prevExams => {
        const updatedExams = [...prevExams, newExam];
        console.log('Setting exams to:', updatedExams.length, 'exams');
        return updatedExams;
      });
      
      // Force re-render by updating trigger
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('Exam scheduled successfully!');
      return newExam;
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to schedule exam');
      throw error;
    }
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    try {
      const updatedExam = exams.find(exam => exam.id === id);
      if (!updatedExam) throw new Error('Exam not found');
      
      const newExam = { ...updatedExam, ...updates, updated_at: new Date().toISOString() };
      setExams(prev => prev.map(exam => exam.id === id ? newExam : exam));
      toast.success('Exam updated successfully');
      return newExam;
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error('Failed to update exam');
      throw error;
    }
  };

  const createExamSession = async (sessionData: Omit<ExamSession, 'id' | 'created_at'>) => {
    try {
      const newSession: ExamSession = {
        ...sessionData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      setExamSessions(prev => [...prev, newSession]);
      toast.success('Exam session created successfully');
      return newSession;
    } catch (error) {
      console.error('Error creating exam session:', error);
      toast.error('Failed to create exam session');
      throw error;
    }
  };

  const registerCandidate = async (candidateData: Omit<ExamCandidate, 'id' | 'registered_at'>) => {
    try {
      const newCandidate: ExamCandidate = {
        ...candidateData,
        id: Date.now().toString(),
        registered_at: new Date().toISOString()
      };
      
      setExamCandidates(prev => [...prev, newCandidate]);
      toast.success('Candidate registered successfully');
      return newCandidate;
    } catch (error) {
      console.error('Error registering candidate:', error);
      toast.error('Failed to register candidate');
      throw error;
    }
  };

  const recordExamResult = async (resultData: Omit<ExamResult, 'id' | 'marked_at' | 'marked_by'>) => {
    try {
      const newResult: ExamResult = {
        ...resultData,
        id: Date.now().toString(),
        marked_by: "current-user",
        marked_at: new Date().toISOString()
      };
      
      setExamResults(prev => [...prev, newResult]);
      toast.success('Exam result recorded successfully');
      return newResult;
    } catch (error) {
      console.error('Error recording exam result:', error);
      toast.error('Failed to record exam result');
      throw error;
    }
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setExams(mockExams);
      setExamResults(mockExamResults);
      setLoading(false);
    }, 500);
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