import { useState } from 'react';

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  school_id: string;
  department?: string;
  is_active: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  subject: Subject;
  term_id: string;
  teacher_id: string;
  year_group: string;
  credits?: number;
  description?: string;
  is_active: boolean;
}

export interface Assessment {
  id: string;
  name: string;
  type: string;
  course_id: string;
  total_marks: number;
  weight_percentage: number;
  due_date?: string;
  description?: string;
  is_published: boolean;
}

export interface StudentGrade {
  id: string;
  student_id: string;
  assessment_id: string;
  marks_obtained: number;
  feedback?: string;
  graded_by: string;
  graded_at: string;
}

export interface AcademicTerm {
  id: string;
  name: string;
  school_id: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

// Mock data until database tables are available
const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH', school_id: 'school1', department: 'Mathematics', is_active: true },
  { id: '2', name: 'English', code: 'ENG', school_id: 'school1', department: 'English', is_active: true },
  { id: '3', name: 'Science', code: 'SCI', school_id: 'school1', department: 'Science', is_active: true },
  { id: '4', name: 'History', code: 'HIST', school_id: 'school1', department: 'Humanities', is_active: true },
];

const mockTerms: AcademicTerm[] = [
  { id: '1', name: 'Autumn Term 2024', school_id: 'school1', start_date: '2024-09-01', end_date: '2024-12-20', is_current: true },
  { id: '2', name: 'Spring Term 2025', school_id: 'school1', start_date: '2025-01-06', end_date: '2025-04-11', is_current: false },
];

const mockCourses: Course[] = [
  { 
    id: '1', 
    name: 'Year 7 Mathematics', 
    code: 'MATH-Y7', 
    subject: mockSubjects[0], 
    term_id: '1', 
    teacher_id: 'teacher1', 
    year_group: 'Year 7',
    credits: 5,
    is_active: true 
  },
  { 
    id: '2', 
    name: 'Year 8 English', 
    code: 'ENG-Y8', 
    subject: mockSubjects[1], 
    term_id: '1', 
    teacher_id: 'teacher2', 
    year_group: 'Year 8',
    credits: 4,
    is_active: true 
  },
];

const mockAssessments: Assessment[] = [
  {
    id: '1',
    name: 'Mid-term Exam',
    type: 'exam',
    course_id: '1',
    total_marks: 100,
    weight_percentage: 40,
    due_date: '2024-11-15',
    is_published: true
  },
  {
    id: '2',
    name: 'Essay Assignment',
    type: 'assignment',
    course_id: '2',
    total_marks: 50,
    weight_percentage: 30,
    due_date: '2024-11-20',
    is_published: true
  },
];

// Legacy interfaces for backward compatibility
export interface YearGroup {
  id: string;
  name: string;
  description?: string;
  school_id: string;
}

export interface Class {
  id: string;
  name: string;
  subject: Subject;
  yearGroup: YearGroup;
  teacher_id?: string;
  room?: string;
  students?: any[];
}

// Mock year groups for backward compatibility
const mockYearGroups: YearGroup[] = [
  { id: '1', name: 'Year 7', school_id: 'school1' },
  { id: '2', name: 'Year 8', school_id: 'school1' },
  { id: '3', name: 'Year 9', school_id: 'school1' },
  { id: '4', name: 'Year 10', school_id: 'school1' },
];

// Mock classes for backward compatibility
const mockClasses: Class[] = [
  { id: '1', name: 'Math 7A', subject: mockSubjects[0], yearGroup: mockYearGroups[0], room: 'M1' },
  { id: '2', name: 'English 7A', subject: mockSubjects[1], yearGroup: mockYearGroups[0], room: 'E1' },
  { id: '3', name: 'Science 8B', subject: mockSubjects[2], yearGroup: mockYearGroups[1], room: 'S1' },
];

export function useAcademicData() {
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [courses] = useState<Course[]>(mockCourses);
  const [assessments] = useState<Assessment[]>(mockAssessments);
  const [terms] = useState<AcademicTerm[]>(mockTerms);
  const [yearGroups] = useState<YearGroup[]>(mockYearGroups);
  const [classes] = useState<Class[]>(mockClasses);
  const [loading] = useState(false);

  const fetchAcademicData = async () => {
    // Mock implementation
  };

  const getCoursesByTeacher = async (teacherId: string): Promise<Course[]> => {
    return mockCourses.filter(c => c.teacher_id === teacherId);
  };

  const getStudentGrades = async (studentId: string) => {
    return [];
  };

  const createSubject = async (subject: Omit<Subject, 'id'>) => {
    // Mock implementation
    return { id: 'new', ...subject };
  };

  const createCourse = async (course: Omit<Course, 'id' | 'subject'> & { subject_id: string }) => {
    // Mock implementation
    return { id: 'new', ...course };
  };

  const createAssessment = async (assessment: Omit<Assessment, 'id'>) => {
    // Mock implementation
    return { id: 'new', ...assessment };
  };

  // Legacy compatibility methods
  const getClassesByTeacher = async (teacherId: string): Promise<Class[]> => {
    return mockClasses.filter(c => c.teacher_id === teacherId);
  };

  return {
    subjects,
    courses,
    assessments,
    terms,
    yearGroups,
    classes,
    loading,
    fetchAcademicData,
    getCoursesByTeacher,
    getClassesByTeacher,
    getStudentGrades,
    createSubject,
    createCourse,
    createAssessment,
    refetch: {
      subjects: () => Promise.resolve(),
      courses: () => Promise.resolve(),
      assessments: () => Promise.resolve(),
      terms: () => Promise.resolve()
    }
  };
}