import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  average_grade: string;
  subject_count: number;
  status: string;
  generated_date: string;
}

// Mock data for comprehensive grading system
const mockGrades: Grade[] = [
  // Emma Thompson - Year 7
  {
    id: '1',
    student_name: 'Emma Thompson',
    student_id: 'STU2024001',
    subject: 'Mathematics',
    assessment_name: 'Basic Algebra Test',
    assessment_type: 'summative',
    score: 85,
    grade: 'A',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Shows strong mathematical reasoning and problem-solving skills',
    date_recorded: '2024-01-15',
    teacher_id: 'TCH001',
    year_group: 'Year 7',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '2',
    student_name: 'Emma Thompson',
    student_id: 'STU2024001',
    subject: 'English',
    assessment_name: 'Creative Writing',
    assessment_type: 'coursework',
    score: 78,
    grade: 'B+',
    term: 'Autumn Term',
    effort: 'good',
    behavior: 'excellent',
    comments: 'Imaginative storytelling with good use of descriptive language',
    date_recorded: '2024-01-18',
    teacher_id: 'TCH002',
    year_group: 'Year 7',
    max_score: 100,
    weight: 0.4
  },
  
  // James Wilson - Year 8
  {
    id: '3',
    student_name: 'James Wilson',
    student_id: 'STU2024002',
    subject: 'Science',
    assessment_name: 'Forces and Motion Test',
    assessment_type: 'summative',
    score: 92,
    grade: 'A*',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'good',
    comments: 'Exceptional understanding of physics concepts and practical applications',
    date_recorded: '2024-01-20',
    teacher_id: 'TCH003',
    year_group: 'Year 8',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '4',
    student_name: 'James Wilson',
    student_id: 'STU2024002',
    subject: 'History',
    assessment_name: 'Medieval Britain Essay',
    assessment_type: 'coursework',
    score: 83,
    grade: 'A-',
    term: 'Autumn Term',
    effort: 'good',
    behavior: 'satisfactory',
    comments: 'Well-researched essay with clear arguments and good use of sources',
    date_recorded: '2024-01-22',
    teacher_id: 'TCH004',
    year_group: 'Year 8',
    max_score: 100,
    weight: 0.4
  },
  
  // Sophie Chen - Year 9
  {
    id: '5',
    student_name: 'Sophie Chen',
    student_id: 'STU2024003',
    subject: 'Mathematics',
    assessment_name: 'Quadratic Equations Test',
    assessment_type: 'summative',
    score: 76,
    grade: 'B',
    term: 'Autumn Term',
    effort: 'good',
    behavior: 'excellent',
    comments: 'Good understanding of concepts, needs more practice with complex problems',
    date_recorded: '2024-01-25',
    teacher_id: 'TCH001',
    year_group: 'Year 9',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '6',
    student_name: 'Sophie Chen',
    student_id: 'STU2024003',
    subject: 'Art',
    assessment_name: 'Portrait Drawing Project',
    assessment_type: 'coursework',
    score: 95,
    grade: 'A*',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Outstanding artistic skill and creativity demonstrated',
    date_recorded: '2024-01-28',
    teacher_id: 'TCH005',
    year_group: 'Year 9',
    max_score: 100,
    weight: 0.5
  },
  
  // Svetlana Dominic - Year 10
  {
    id: '7',
    student_name: 'Svetlana Dominic',
    student_id: 'STU2024004',
    subject: 'Chemistry',
    assessment_name: 'Organic Chemistry Test',
    assessment_type: 'summative',
    score: 88,
    grade: 'A',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Excellent grasp of organic chemistry principles and mechanisms',
    date_recorded: '2024-01-30',
    teacher_id: 'TCH006',
    year_group: 'Year 10',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '8',
    student_name: 'Svetlana Dominic',
    student_id: 'STU2024004',
    subject: 'Geography',
    assessment_name: 'Climate Change Report',
    assessment_type: 'coursework',
    score: 79,
    grade: 'B+',
    term: 'Autumn Term',
    effort: 'good',
    behavior: 'good',
    comments: 'Thorough research and analysis of climate change impacts',
    date_recorded: '2024-02-02',
    teacher_id: 'TCH007',
    year_group: 'Year 10',
    max_score: 100,
    weight: 0.4
  },
  
  // Oliver Brown - Year 11
  {
    id: '9',
    student_name: 'Oliver Brown',
    student_id: 'STU2024005',
    subject: 'Physics',
    assessment_name: 'Electricity and Magnetism Exam',
    assessment_type: 'summative',
    score: 91,
    grade: 'A*',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Exceptional problem-solving skills and deep understanding of physics',
    date_recorded: '2024-02-05',
    teacher_id: 'TCH008',
    year_group: 'Year 11',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '10',
    student_name: 'Oliver Brown',
    student_id: 'STU2024005',
    subject: 'Computer Science',
    assessment_name: 'Programming Project',
    assessment_type: 'coursework',
    score: 96,
    grade: 'A*',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Outstanding programming skills and innovative solution design',
    date_recorded: '2024-02-08',
    teacher_id: 'TCH009',
    year_group: 'Year 11',
    max_score: 100,
    weight: 0.5
  },
  
  // Amelia Davis - Year 12
  {
    id: '11',
    student_name: 'Amelia Davis',
    student_id: 'STU2024006',
    subject: 'Biology',
    assessment_name: 'Genetics and Evolution Test',
    assessment_type: 'summative',
    score: 84,
    grade: 'A-',
    term: 'Autumn Term',
    effort: 'good',
    behavior: 'excellent',
    comments: 'Strong understanding of genetic principles with good analytical skills',
    date_recorded: '2024-02-10',
    teacher_id: 'TCH010',
    year_group: 'Year 12',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '12',
    student_name: 'Amelia Davis',
    student_id: 'STU2024006',
    subject: 'Psychology',
    assessment_name: 'Research Methods Essay',
    assessment_type: 'coursework',
    score: 87,
    grade: 'A',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Excellent critical analysis and understanding of research methodologies',
    date_recorded: '2024-02-12',
    teacher_id: 'TCH011',
    year_group: 'Year 12',
    max_score: 100,
    weight: 0.4
  },
  
  // Additional students with extended data
  {
    id: '13',
    student_name: 'Alexander Kim',
    student_id: 'STU2024007',
    subject: 'Mathematics',
    assessment_name: 'Calculus Assessment',
    assessment_type: 'summative',
    score: 89,
    grade: 'A',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'good',
    comments: 'Strong mathematical abilities with excellent problem-solving approach',
    date_recorded: '2024-02-15',
    teacher_id: 'TCH001',
    year_group: 'Year 13',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '14',
    student_name: 'Zara Patel',
    student_id: 'STU2024008',
    subject: 'English Literature',
    assessment_name: 'Modern Poetry Analysis',
    assessment_type: 'coursework',
    score: 93,
    grade: 'A*',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Sophisticated literary analysis with exceptional insight and expression',
    date_recorded: '2024-02-18',
    teacher_id: 'TCH002',
    year_group: 'Year 12',
    max_score: 100,
    weight: 0.4
  },
  {
    id: '15',
    student_name: 'Lucas Martinez',
    student_id: 'STU2024009',
    subject: 'Spanish',
    assessment_name: 'Oral Presentation',
    assessment_type: 'summative',
    score: 81,
    grade: 'B+',
    term: 'Autumn Term',
    effort: 'good',
    behavior: 'good',
    comments: 'Good pronunciation and vocabulary, needs work on complex grammar',
    date_recorded: '2024-02-20',
    teacher_id: 'TCH012',
    year_group: 'Year 10',
    max_score: 100,
    weight: 0.3
  },
  {
    id: '16',
    student_name: 'Isabella Wright',
    student_id: 'STU2024010',
    subject: 'Drama',
    assessment_name: 'Shakespeare Performance',
    assessment_type: 'practical',
    score: 94,
    grade: 'A*',
    term: 'Autumn Term',
    effort: 'excellent',
    behavior: 'excellent',
    comments: 'Outstanding dramatic performance with excellent character interpretation',
    date_recorded: '2024-02-22',
    teacher_id: 'TCH013',
    year_group: 'Year 11',
    max_score: 100,
    weight: 0.5
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
    average_grade: 'A-',
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
    average_grade: 'A',
    subject_count: 8,
    status: 'sent',
    generated_date: '2024-01-25'
  }
];

export function useGradingData(schoolId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradingRubrics, setGradingRubrics] = useState<GradingRubric[]>([]);
  const [gradeBoundaries, setGradeBoundaries] = useState<GradeBoundary[]>([]);
  const [reports, setReports] = useState<ReportCard[]>([]);

  // Initialize with mock data for now
  useEffect(() => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setGrades(mockGrades);
      setGradingRubrics(mockRubrics);
      setGradeBoundaries(mockGradeBoundaries);
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, [schoolId]);

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

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setGrades([...mockGrades]);
      setGradingRubrics([...mockRubrics]);
      setGradeBoundaries([...mockGradeBoundaries]);
      setReports([...mockReports]);
      setLoading(false);
      toast({
        title: "Data Refreshed",
        description: "All grading data has been updated",
      });
    }, 1000);
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
    refreshData
  };
}