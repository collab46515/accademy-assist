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
    admission_date: '2024-09-01',
    emergency_contact_name: 'Sarah Thompson',
    emergency_contact_phone: '+44 7700 900456',
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
    admission_date: '2023-09-01',
    emergency_contact_name: 'Michael Wilson',
    emergency_contact_phone: '+44 7700 900789',
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
    admission_date: '2022-09-01',
    emergency_contact_name: 'Lisa Chen',
    emergency_contact_phone: '+44 7700 900321',
    profiles: {
      first_name: 'Sophie',
      last_name: 'Chen',
      email: 'sophie.chen@email.com',
    }
  },
  {
    id: '4',
    user_id: 'user4',
    student_number: 'STU2024004',
    school_id: 'school1',
    year_group: 'Year 10',
    form_class: '10C',
    is_enrolled: true,
    admission_date: '2021-09-01',
    emergency_contact_name: 'Andrei Dominic',
    emergency_contact_phone: '+44 7700 900654',
    profiles: {
      first_name: 'Svetlana',
      last_name: 'Dominic',
      email: 'svetlana.dominic@email.com',
    }
  },
  {
    id: '5',
    user_id: 'user5',
    student_number: 'STU2024005',
    school_id: 'school1',
    year_group: 'Year 11',
    form_class: '11A',
    is_enrolled: true,
    admission_date: '2020-09-01',
    emergency_contact_name: 'David Brown',
    emergency_contact_phone: '+44 7700 900987',
    profiles: {
      first_name: 'Oliver',
      last_name: 'Brown',
      email: 'oliver.brown@email.com',
    }
  },
  {
    id: '6',
    user_id: 'user6',
    student_number: 'STU2024006',
    school_id: 'school1',
    year_group: 'Year 12',
    form_class: '12B',
    is_enrolled: true,
    admission_date: '2019-09-01',
    emergency_contact_name: 'Rachel Davis',
    emergency_contact_phone: '+44 7700 900246',
    profiles: {
      first_name: 'Amelia',
      last_name: 'Davis',
      email: 'amelia.davis@email.com',
    }
  }
];

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSchool } = useRBAC();

  const fetchStudents = async () => {
    if (!currentSchool?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles(
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('school_id', currentSchool.id);

      if (error) {
        console.error('Error fetching students:', error);
        setStudents(mockStudents); // Fallback to mock data
      } else {
        // Transform the data to match our Student interface
        const transformedStudents = (data || []).map((student: any) => ({
          ...student,
          // Default to enrolled when field is missing in DB
          is_enrolled: student.is_enrolled ?? true,
          profiles: student.profiles || undefined
        })) as Student[];
        setStudents(transformedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents(mockStudents); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  // Create a new student
  const createStudent = async (studentData: any) => {
    try {
      const { data, error } = await supabase
        .rpc('create_student_with_user', {
          student_data: studentData,
          school_id: currentSchool?.id || ''
        });

      if (error) throw error;

      await fetchStudents(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  };

  const getStudentById = async (studentId: string): Promise<Student | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles(
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('id', studentId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Transform the data to match our Student interface
      const transformedStudent = {
        ...data,
        is_enrolled: (data as any).is_enrolled ?? true,
        profiles: (data as any).profiles || undefined
      } as Student;
      return transformedStudent;
    } catch (error) {
      console.error('Error fetching student:', error);
      return mockStudents.find(s => s.id === studentId) || null;
    }
  };

  const getStudentsByClass = async (classId: string): Promise<Student[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles(
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('form_class', classId)
        .eq('school_id', currentSchool?.id || '');

      if (error) throw error;
      // Transform the data to match our Student interface
      const transformedStudents = (data || []).map((student: any) => ({
        ...student,
        is_enrolled: student.is_enrolled ?? true,
        profiles: student.profiles || undefined
      })) as Student[];
      return transformedStudents;
    } catch (error) {
      console.error('Error fetching students by class:', error);
      return mockStudents.filter(s => s.form_class?.includes(classId.slice(-1)) || false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentSchool]);

  return {
    students,
    loading,
    fetchStudents,
    createStudent,
    getStudentById,
    getStudentsByClass,
  };
}