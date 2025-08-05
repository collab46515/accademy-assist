import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Mock data structures for now - will be replaced with real data once migration is confirmed
export interface Grade {
  id: string;
  student_name: string;
  student_id: string;
  subject: string;
  assessment_name: string;
  assessment_type: string;
  score: number;
  grade: string;
  term: string;
  effort: string;
  behavior?: string;
  comments?: string;
  date_recorded: string;
  teacher_id: string;
  year_group: string;
  max_score: number;
  weight: number;
}

export interface GradingRubric {
  id: string;
  subject: string;
  year_group: string;
  rubric_name: string;
  criteria: {
    name: string;
    description: string;
    max_points: number;
    levels: {
      name: string;
      description: string;
      points: number;
    }[];
  }[];
  max_points: number;
  is_active: boolean;
}

export interface GradeBoundary {
  id: string;
  year_group: string;
  subject: string;
  grade_letter: string;
  min_percentage: number;
  max_percentage: number;
  grade_points: number;
  description?: string;
}

export interface ReportCard {
  id: string;
  student_name: string;
  student_id: string;
  term: string;
  year: string;
  average_grade: number;
  subject_count: number;
  status: string;
  generated_date: string;
}

// Mock data for comprehensive grading system
const mockGrades: Grade[] = [
  {
    id: '1',
    student_name: 'Emily Johnson',
    student_id: 'STU001',
    subject: 'Mathematics',
    assessment_name: 'Algebra Test 1',
    assessment_type: 'summative',
    score: 87,
    grade: 'A-',
    term: 'Term 1',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Excellent understanding of algebraic concepts',
    date_recorded: '2024-01-15',
    teacher_id: 'TCH001',
    year_group: 'Year 9',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '2',
    student_name: 'Michael Chen',
    student_id: 'STU002',
    subject: 'English Literature',
    assessment_name: 'Essay on Shakespeare',
    assessment_type: 'coursework',
    score: 92,
    grade: 'A',
    term: 'Term 1',
    effort: 'excellent',
    behavior: 'good',
    comments: 'Outstanding analytical skills demonstrated',
    date_recorded: '2024-01-18',
    teacher_id: 'TCH002',
    year_group: 'Year 10',
    max_score: 100,
    weight: 0.4
  },
  {
    id: '3',
    student_name: 'Sarah Williams',
    student_id: 'STU003',
    subject: 'Chemistry',
    assessment_name: 'Periodic Table Quiz',
    assessment_type: 'formative',
    score: 76,
    grade: 'B',
    term: 'Term 1',
    effort: 'good',
    behavior: 'satisfactory',
    comments: 'Good progress, needs more practice with electron configuration',
    date_recorded: '2024-01-20',
    teacher_id: 'TCH003',
    year_group: 'Year 11',
    max_score: 100,
    weight: 0.2
  }
];

const mockRubrics: GradingRubric[] = [
  {
    id: '1',
    subject: 'English Literature',
    year_group: 'Year 10',
    rubric_name: 'Essay Assessment Rubric',
    criteria: [
      {
        name: 'Analysis',
        description: 'Depth of literary analysis',
        max_points: 25,
        levels: [
          { name: 'Excellent', description: 'Sophisticated analysis with deep insights', points: 25 },
          { name: 'Good', description: 'Clear analysis with good understanding', points: 20 },
          { name: 'Satisfactory', description: 'Basic analysis present', points: 15 },
          { name: 'Needs Improvement', description: 'Limited analysis', points: 10 }
        ]
      },
      {
        name: 'Evidence',
        description: 'Use of textual evidence',
        max_points: 25,
        levels: [
          { name: 'Excellent', description: 'Compelling evidence well integrated', points: 25 },
          { name: 'Good', description: 'Relevant evidence used effectively', points: 20 },
          { name: 'Satisfactory', description: 'Some evidence present', points: 15 },
          { name: 'Needs Improvement', description: 'Minimal evidence', points: 10 }
        ]
      }
    ],
    max_points: 100,
    is_active: true
  }
];

const mockGradeBoundaries: GradeBoundary[] = [
  { id: '1', year_group: 'Year 9', subject: 'Mathematics', grade_letter: 'A*', min_percentage: 90, max_percentage: 100, grade_points: 9, description: 'Outstanding' },
  { id: '2', year_group: 'Year 9', subject: 'Mathematics', grade_letter: 'A', min_percentage: 80, max_percentage: 89, grade_points: 8, description: 'Excellent' },
  { id: '3', year_group: 'Year 9', subject: 'Mathematics', grade_letter: 'B', min_percentage: 70, max_percentage: 79, grade_points: 7, description: 'Good' },
  { id: '4', year_group: 'Year 9', subject: 'Mathematics', grade_letter: 'C', min_percentage: 60, max_percentage: 69, grade_points: 6, description: 'Satisfactory' },
  { id: '5', year_group: 'Year 9', subject: 'Mathematics', grade_letter: 'D', min_percentage: 50, max_percentage: 59, grade_points: 5, description: 'Pass' },
  { id: '6', year_group: 'Year 9', subject: 'Mathematics', grade_letter: 'U', min_percentage: 0, max_percentage: 49, grade_points: 0, description: 'Ungraded' }
];

const mockReports: ReportCard[] = [
  {
    id: '1',
    student_name: 'Emily Johnson',
    student_id: 'STU001',
    term: 'Term 1',
    year: '2024',
    average_grade: 85,
    subject_count: 8,
    status: 'generated',
    generated_date: '2024-01-25'
  },
  {
    id: '2',
    student_name: 'Michael Chen',
    student_id: 'STU002',
    term: 'Term 1',
    year: '2024',
    average_grade: 88,
    subject_count: 8,
    status: 'sent',
    generated_date: '2024-01-25'
  }
];

export function useGradingData(schoolId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [gradingRubrics, setGradingRubrics] = useState<GradingRubric[]>(mockRubrics);
  const [gradeBoundaries, setGradeBoundaries] = useState<GradeBoundary[]>(mockGradeBoundaries);
  const [reports, setReports] = useState<ReportCard[]>(mockReports);

  // Simulate data loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Create/Update grade
  const createGrade = async (gradeData: Omit<Grade, 'id'>) => {
    try {
      const newGrade = {
        ...gradeData,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      setGrades(prev => [...prev, newGrade]);
      toast({
        title: "Success",
        description: "Grade recorded successfully",
      });

      return newGrade;
    } catch (error) {
      console.error('Error creating grade:', error);
      toast({
        title: "Error",
        description: "Failed to record grade",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update grade
  const updateGrade = async (id: string, updates: Partial<Grade>) => {
    try {
      setGrades(prev => prev.map(grade => 
        grade.id === id ? { ...grade, ...updates } : grade
      ));
      
      toast({
        title: "Success",
        description: "Grade updated successfully",
      });

      return { id, ...updates };
    } catch (error) {
      console.error('Error updating grade:', error);
      toast({
        title: "Error",
        description: "Failed to update grade",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Calculate grade from percentage
  const calculateGrade = (percentage: number, yearGroup: string, subject: string): { letter: string; points: number } => {
    const boundary = gradeBoundaries.find(b => 
      b.year_group === yearGroup && 
      b.subject === subject && 
      percentage >= b.min_percentage && 
      percentage <= b.max_percentage
    );

    return {
      letter: boundary?.grade_letter || 'U',
      points: boundary?.grade_points || 0
    };
  };

  // Generate analytics
  const generateAnalytics = async () => {
    try {
      toast({
        title: "Success",
        description: "Grade analytics generated successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error generating analytics:', error);
      toast({
        title: "Error",
        description: "Failed to generate analytics",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    loading,
    grades,
    gradingRubrics,
    gradeBoundaries,
    reports,
    createGrade,
    updateGrade,
    calculateGrade,
    generateAnalytics,
    refreshData: () => {
      // Refresh mock data
      setGrades([...mockGrades]);
      setGradingRubrics([...mockRubrics]);
      setGradeBoundaries([...mockGradeBoundaries]);
      setReports([...mockReports]);
    }
  };
}