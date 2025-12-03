import { useState, useEffect, useRef } from 'react';
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

// Module-level cache to persist data across re-mounts
const studentCache: {
  schoolId: string | null;
  students: Student[];
  lastFetched: number | null;
} = {
  schoolId: null,
  students: [],
  lastFetched: null
};

// Mock data for fallback
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
  const { currentSchool } = useRBAC();
  const schoolId = currentSchool?.id;
  
  // Initialize from cache if available for the same school
  const cacheValid = studentCache.schoolId === schoolId && studentCache.lastFetched;
  
  const [students, setStudents] = useState<Student[]>(
    cacheValid ? studentCache.students : []
  );
  const [loading, setLoading] = useState(!cacheValid);
  const isFetching = useRef(false);

  const fetchStudents = async (forceRefresh = false) => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    // Skip if already fetching or cache is valid (unless forced)
    if (isFetching.current) return;
    if (!forceRefresh && studentCache.schoolId === schoolId && studentCache.lastFetched) {
      setStudents(studentCache.students);
      setLoading(false);
      return;
    }

    isFetching.current = true;
    // Only show loading if we don't have cached data
    if (studentCache.schoolId !== schoolId || !studentCache.students.length) {
      setLoading(true);
    }
    
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
        .eq('school_id', schoolId);

      if (error) {
        console.error('Error fetching students:', error);
        setStudents(mockStudents);
      } else {
        const transformedStudents = (data || []).map((student: any) => ({
          ...student,
          is_enrolled: student.is_enrolled ?? true,
          profiles: student.profiles || undefined
        })) as Student[];
        
        // Update cache
        studentCache.schoolId = schoolId;
        studentCache.students = transformedStudents;
        studentCache.lastFetched = Date.now();
        
        setStudents(transformedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents(mockStudents);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const createStudent = async (studentData: any) => {
    try {
      const { data, error } = await supabase
        .rpc('create_student_with_user', {
          student_data: studentData,
          school_id: schoolId || ''
        });

      if (error) throw error;

      await fetchStudents(true); // Force refresh after creation
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
        .eq('school_id', schoolId || '');

      if (error) throw error;
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
    // Only fetch if school changed or cache is empty
    const needsFetch = schoolId && (studentCache.schoolId !== schoolId || !studentCache.lastFetched);
    if (needsFetch) {
      fetchStudents();
    }
  }, [schoolId]);

  return {
    students,
    loading,
    fetchStudents: () => fetchStudents(true), // Expose force refresh for explicit calls
    createStudent,
    getStudentById,
    getStudentsByClass,
  };
}
