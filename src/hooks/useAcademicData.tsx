import { useState } from 'react';

// Mock data structures until database tables are available
export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  school_id: string;
}

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

// Mock data
const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH', school_id: 'school1' },
  { id: '2', name: 'English', code: 'ENG', school_id: 'school1' },
  { id: '3', name: 'Science', code: 'SCI', school_id: 'school1' },
  { id: '4', name: 'History', code: 'HIST', school_id: 'school1' },
];

const mockYearGroups: YearGroup[] = [
  { id: '1', name: 'Year 7', school_id: 'school1' },
  { id: '2', name: 'Year 8', school_id: 'school1' },
  { id: '3', name: 'Year 9', school_id: 'school1' },
  { id: '4', name: 'Year 10', school_id: 'school1' },
];

const mockClasses: Class[] = [
  { id: '1', name: 'Math 7A', subject: mockSubjects[0], yearGroup: mockYearGroups[0], room: 'M1' },
  { id: '2', name: 'English 7A', subject: mockSubjects[1], yearGroup: mockYearGroups[0], room: 'E1' },
  { id: '3', name: 'Science 8B', subject: mockSubjects[2], yearGroup: mockYearGroups[1], room: 'S1' },
];

export function useAcademicData() {
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [yearGroups] = useState<YearGroup[]>(mockYearGroups);
  const [classes] = useState<Class[]>(mockClasses);
  const [loading] = useState(false);

  const fetchAcademicData = async () => {
    // Mock implementation
  };

  const getClassesByTeacher = async (teacherId: string): Promise<Class[]> => {
    return mockClasses.filter(c => c.teacher_id === teacherId);
  };

  const getStudentGrades = async (studentId: string) => {
    return [];
  };

  return {
    subjects,
    yearGroups,
    classes,
    loading,
    fetchAcademicData,
    getClassesByTeacher,
    getStudentGrades,
  };
}