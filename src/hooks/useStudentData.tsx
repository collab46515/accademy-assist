import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from './useRBAC';

export interface Student {
  id: string;
  user_id: string;
  student_number: string;
  school_id: string;
  year_group: string;
  form_class?: string;
  date_of_birth?: string;
  admission_date?: string;
  is_enrolled: boolean;
  medical_notes?: string;
  safeguarding_notes?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
}

// Mock data for now
const mockStudents: Student[] = [
  {
    id: '1',
    user_id: 'user1',
    student_number: 'STU2024001',
    school_id: 'school1',
    year_group: 'Year 7',
    form_class: '7A',
    is_enrolled: true,
    profiles: {
      first_name: 'Emma',
      last_name: 'Thompson',
      email: 'emma.thompson@email.com',
    }
  },
  {
    id: '2',
    user_id: 'user2',
    student_number: 'STU2024002',
    school_id: 'school1',
    year_group: 'Year 8',
    form_class: '8B',
    is_enrolled: true,
    profiles: {
      first_name: 'James',
      last_name: 'Wilson',
      email: 'james.wilson@email.com',
    }
  },
  {
    id: '3',
    user_id: 'user3',
    student_number: 'STU2024003',
    school_id: 'school1',
    year_group: 'Year 9',
    form_class: '9A',
    is_enrolled: true,
    profiles: {
      first_name: 'Sophie',
      last_name: 'Chen',
      email: 'sophie.chen@email.com',
    }
  }
];

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSchool } = useRBAC();

  const fetchStudents = async () => {
    if (!currentSchool) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use mock data since the database migration hasn't been applied yet
      // Once the user applies the migration, this can be updated to use real data
      console.log('Using mock data until database migration is applied');
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students, using mock data:', error);
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const getStudentById = async (studentId: string): Promise<Student | null> => {
    return mockStudents.find(s => s.id === studentId) || null;
  };

  const getStudentsByClass = async (classId: string): Promise<Student[]> => {
    return mockStudents.filter(s => s.form_class?.includes(classId.slice(-1)) || false);
  };

  useEffect(() => {
    fetchStudents();
  }, [currentSchool]);

  return {
    students,
    loading,
    fetchStudents,
    getStudentById,
    getStudentsByClass,
  };
}