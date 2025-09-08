import { useState, useEffect } from 'react';

export interface Grade {
  id: string;
  student_name: string;
  student_id: string;
  subject: string;
  assessment_name: string;
  assessment_type: 'formative' | 'summative' | 'coursework';
  score: number;
  grade: string;
  term: string;
  effort: 'poor' | 'needs_improvement' | 'satisfactory' | 'good' | 'excellent';
  behavior: 'poor' | 'needs_improvement' | 'satisfactory' | 'good' | 'excellent';
  comments: string;
  date_recorded: string;
  teacher_id: string;
  year_group: string;
  max_score: number;
  weight: number;
}

export interface GradingRubric {
  id: string;
  name: string;
  subject: string;
  criteria: any[];
  created_by: string;
  created_at: string;
}

export interface GradeBoundary {
  id: string;
  year_group: string;
  subject: string;
  grade_letter: string;
  min_percentage: number;
  max_percentage: number;
  grade_points: number;
  description: string;
}

export interface ReportCard {
  id: string;
  student_id: string;
  student_name: string;
  term: string;
  year: string;
  year_group: string;
  subjects: any[];
  overall_grade: string;
  average_grade: string;
  subject_count: number;
  attendance_percentage: number;
  teacher_comments: string;
  head_teacher_comments: string;
  generated_at: string;
  generated_date: string;
  status: string;
}

export const useGradingData = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [rubrics, setRubrics] = useState<GradingRubric[]>([]);
  const [gradeBoundaries, setGradeBoundaries] = useState<GradeBoundary[]>([]);
  const [reports, setReports] = useState<ReportCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [gradingRubrics, setGradingRubrics] = useState<GradingRubric[]>([]);

  useEffect(() => {
    fetchGradingData();
  }, []);

  const fetchGradingData = async () => {
    setLoading(false);
  };

  const createGrade = async (gradeData: Omit<Grade, 'id'>) => {
    throw new Error('Database operation required');
  };

  const updateGrade = async (id: string, updates: Partial<Grade>) => {
    throw new Error('Database operation required');
  };

  const calculateGrade = (percentage: number, yearGroup: string, subject: string): { letter: string; points: number } => {
    if (percentage >= 90) return { letter: 'A*', points: 8 };
    if (percentage >= 80) return { letter: 'A', points: 7 };
    if (percentage >= 70) return { letter: 'B', points: 6 };
    if (percentage >= 60) return { letter: 'C', points: 5 };
    if (percentage >= 50) return { letter: 'D', points: 4 };
    if (percentage >= 40) return { letter: 'E', points: 3 };
    return { letter: 'F', points: 0 };
  };

  const generateAnalytics = () => {
    return {
      totalGrades: 0,
      averageScore: 0,
      gradeDistribution: {},
      subjectPerformance: {}
    };
  };

  const refreshData = () => {
    fetchGradingData();
  };

  return {
    grades,
    rubrics,
    gradingRubrics,
    gradeBoundaries,
    reports,
    loading,
    createGrade,
    updateGrade,
    calculateGrade,
    generateAnalytics,
    refreshData,
  };
};