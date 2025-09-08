import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Simplified interfaces to match existing usage
export interface Subject {
  id: string;
  name: string;
  code: string;
  school_id: string;
  department: string;
  is_active: boolean;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  subject: Subject;
  term_id: string;
  teacher_id: string;
  year_group: string;
  credits: number;
  is_active: boolean;
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  total_marks: number;
  weight: number;
  assessment_type: 'formative' | 'summative' | 'diagnostic';
  is_published: boolean;
}

export interface StudentGrade {
  id: string;
  student_id: string;
  assessment_id: string;
  score: number;
  grade_letter: string;
  feedback: string;
  submitted_at: string;
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

export interface YearGroup {
  id: string;
  name: string;
  school_id: string;
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  year_group: string;
  teacher_id: string;
  room?: string;
  capacity?: number;
  school_id: string;
  subject?: string;
  yearGroup?: string;
}

export const useAcademicData = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    setLoading(false);
  };

  const getCoursesByTeacher = async (teacherId: string): Promise<Course[]> => {
    return [];
  };

  const getClassesByTeacher = async (teacherId: string): Promise<Class[]> => {
    return [];
  };

  const getStudentGrades = async (studentId: string) => {
    return [];
  };

  const createSubject = async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
    throw new Error('Database operation required');
  };

  const createCourse = async (course: Omit<Course, 'id' | 'subject'> & { subject_id: string }): Promise<Course> => {
    throw new Error('Database operation required');
  };

  const createAssessment = async (assessment: Omit<Assessment, 'id'>): Promise<Assessment> => {
    throw new Error('Database operation required');
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
  };
};