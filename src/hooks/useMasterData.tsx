import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';

// Core Master Data Types - matching actual database schema
export interface School {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  settings?: any;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  school_id: string;
  subject_name: string;
  subject_code: string;
  color_code?: string;
  requires_lab?: boolean;
  periods_per_week?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  school_id: string;
  student_number: string;
  year_group: string;
  form_class?: string;
  admission_date?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  safeguarding_notes?: string;
  is_enrolled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Parent {
  id: string;
  parent_id?: string;
  student_id: string;
  relationship_type?: string;
  created_at: string;
}

export interface Staff {
  id: string;
  school_id?: string;
  staff_number?: string;
  title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  department?: string;
  employment_status?: string;
  employment_start_date?: string;
  qualifications?: any;
  subjects_qualified?: any;
  created_at: string;
  updated_at: string;
}

export interface YearGroup {
  id: string;
  school_id?: string;
  year_code: string;
  year_name: string;
  key_stage?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface House {
  id: string;
  school_id?: string;
  house_code: string;
  house_name: string;
  house_color?: string;
  house_motto?: string;
  head_of_house_id?: string;
  points?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBDepartment {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  cost_center?: string;
  department_head_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  class_name: string;
  year_group: string;
  form_teacher_id?: string;
  classroom_id?: string;
  capacity: number;
  current_enrollment: number;
  is_active: boolean;
  academic_year: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useMasterData() {
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [departments, setDepartments] = useState<DBDepartment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const { toast } = useToast();
  const { currentSchool } = useRBAC();

  // Fetch all master data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [
        schoolsResponse,
        subjectsResponse,
        studentsResponse,
        parentsResponse,
        staffResponse,
        departmentsResponse,
        yearGroupsResponse,
        housesResponse,
        classesResponse
      ] = await Promise.all([
        supabase.from('schools').select('*').order('name'),
        supabase.from('subjects').select('*').order('subject_name'),
        supabase.from('students').select('*').order('student_number'),
        supabase.from('student_parents').select(`
          id,
          parent_id,
          student_id,
          created_at
        `),
        supabase.from('staff').select('*').order('last_name'),
        supabase.from('departments').select('*').order('name'),
        supabase.from('year_groups' as any).select('*').order('sort_order'),
        supabase.from('houses' as any).select('*').order('house_name'),
        supabase.from('classes').select('*').order('year_group, class_name')
      ]);

      if (schoolsResponse.error) throw schoolsResponse.error;
      if (subjectsResponse.error) throw subjectsResponse.error;
      if (studentsResponse.error) throw studentsResponse.error;
      if (parentsResponse.error) throw parentsResponse.error;

      setSchools(schoolsResponse.data as School[] || []);
      setSubjects(subjectsResponse.data as Subject[] || []);
      setStudents(studentsResponse.data as Student[] || []);
      setStaff(staffResponse.data as Staff[] || []);
      setDepartments(departmentsResponse.data as DBDepartment[] || []);
      setClasses(classesResponse.data as Class[] || []);
      
      // Handle new tables that might not be in types yet
      if (!yearGroupsResponse.error && yearGroupsResponse.data) {
        setYearGroups((yearGroupsResponse.data as unknown) as YearGroup[] || []);
      }
      if (!housesResponse.error && housesResponse.data) {
        setHouses((housesResponse.data as unknown) as House[] || []);
      }
      
      // Process parent relationships to show meaningful data
      const parentRelationships = parentsResponse.data?.map((rel: any) => ({
        id: rel.id,
        parent_id: rel.parent_id,
        student_id: rel.student_id,
        relationship_type: rel.relationship_type || 'Parent',
        created_at: rel.created_at
      })) || [];
      setParents(parentRelationships);

      toast({
        title: "Success",
        description: "Master data loaded successfully",
      });
    } catch (error: any) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Failed to load master data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create functions
  const createSchool = async (schoolData: Omit<School, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert([schoolData])
        .select()
        .single();

      if (error) throw error;

      setSchools(prev => [...prev, data as School]);
      toast({
        title: "Success",
        description: "School created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating school:', error);
      toast({
        title: "Error",
        description: "Failed to create school",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createSubject = async (subjectData: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const defaultSchoolId = currentSchool?.id || schools[0]?.id;
      const payload = {
        ...subjectData,
        school_id: subjectData.school_id || defaultSchoolId,
      };
      const { data, error } = await supabase
        .from('subjects')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      setSubjects(prev => [...prev, data as Subject]);
      toast({
        title: "Success",
        description: "Subject created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating subject:', error);
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [...prev, data as Student]);
      toast({
        title: "Success",
        description: "Student created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "Failed to create student",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createClass = async (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const payload = {
        ...classData,
        school_id: (classData as any).school_id || currentSchool?.id,
      } as any;
      const { data, error } = await supabase
        .from('classes')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      setClasses(prev => [...prev, data as Class]);
      toast({
        title: "Success",
        description: "Class created successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast({
        title: "Error",
        description: "Failed to create class",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update functions
  const updateSchool = async (id: string, updates: Partial<School>) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSchools(prev => prev.map(school => school.id === id ? data as School : school));
      toast({
        title: "Success",
        description: "School updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating school:', error);
      toast({
        title: "Error",
        description: "Failed to update school",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSubjects(prev => prev.map(subject => subject.id === id ? data as Subject : subject));
      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating subject:', error);
      toast({
        title: "Error",
        description: "Failed to update subject",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => prev.map(student => student.id === id ? data as Student : student));
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateClass = async (id: string, updates: Partial<Class>) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClasses(prev => prev.map(cls => cls.id === id ? data as Class : cls));
      toast({
        title: "Success",
        description: "Class updated successfully",
      });
      return data;
    } catch (error: any) {
      console.error('Error updating class:', error);
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete functions
  const deleteRecord = async (tableName: 'schools' | 'subjects' | 'students' | 'classes', id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state based on table
      switch (tableName) {
        case 'schools':
          setSchools(prev => prev.filter(item => item.id !== id));
          break;
        case 'subjects':
          setSubjects(prev => prev.filter(item => item.id !== id));
          break;
        case 'students':
          setStudents(prev => prev.filter(item => item.id !== id));
          break;
        case 'classes':
          setClasses(prev => prev.filter(item => item.id !== id));
          break;
      }

      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Statistics and analytics
  const getEntityCounts = () => {
    return {
      schools: schools.length,
      subjects: subjects.length,
      students: students.length,
      parents: parents.length,
      staff: staff.length,
      yearGroups: yearGroups.length,
      houses: houses.length,
      departments: departments.length,
      classes: classes.length
    };
  };

  const getActiveEntities = () => {
    return {
      schools: schools.filter(s => s.is_active).length,
      subjects: subjects.filter(s => s.is_active).length,
      students: students.filter(s => s.is_enrolled === true).length,
      classes: classes.filter(c => c.is_active).length
    };
  };

  const refreshData = () => {
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    isLoading,
    schools,
    subjects,
    students,
    staff,
    parents,
    yearGroups,
    houses,
    departments,
    classes,
    createSchool,
    createSubject,
    createStudent,
    createClass,
    updateSchool,
    updateSubject,
    updateStudent,
    updateClass,
    deleteRecord,
    getEntityCounts,
    getActiveEntities,
    refreshData
  };
}