import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  due_date: string;
  total_marks: number;
  attachment_urls?: string[];
  assignment_type: 'homework' | 'classwork' | 'project' | 'assessment';
  curriculum_topic_id?: string;
  lesson_plan_id?: string;
  subject: string;
  year_group: string;
  created_by: string;
  school_id: string;
  status: 'draft' | 'published' | 'closed';
  submission_type: 'file_upload' | 'text_entry' | 'both';
  allow_late_submissions: boolean;
  late_penalty_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at?: string;
  submission_text?: string;
  attachment_urls?: string[];
  marks_awarded?: number;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
  status: 'not_submitted' | 'submitted' | 'graded' | 'late';
  is_late: boolean;
  created_at: string;
  updated_at: string;
}

export const useAssignmentData = (schoolId?: string) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentSchool } = useRBAC();

  const activeSchoolId = schoolId || currentSchool?.id;

  // Mock data for now until database is synced
  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Mathematics Homework - Fractions',
      description: 'Complete exercises 1-10 on equivalent fractions',
      instructions: 'Show all working and use diagrams where helpful',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      total_marks: 20,
      attachment_urls: [],
      assignment_type: 'homework',
      curriculum_topic_id: 'fractions-equiv',
      lesson_plan_id: 'lesson-123',
      subject: 'Mathematics',
      year_group: 'Year 4',
      created_by: user?.id || 'teacher-1',
      school_id: activeSchoolId || 'school-1',
      status: 'published',
      submission_type: 'both',
      allow_late_submissions: true,
      late_penalty_percentage: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Science Project - Plant Growth',
      description: 'Design and conduct an experiment to test factors affecting plant growth',
      instructions: 'Include hypothesis, method, results, and conclusion',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      total_marks: 50,
      attachment_urls: [],
      assignment_type: 'project',
      curriculum_topic_id: 'plant-growth',
      subject: 'Science',
      year_group: 'Year 6',
      created_by: user?.id || 'teacher-2',
      school_id: activeSchoolId || 'school-1',
      status: 'published',
      submission_type: 'file_upload',
      allow_late_submissions: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Fetch assignments (using mock data for now)
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Supabase query when types are ready
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create assignment
  const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'school_id'>) => {
    if (!activeSchoolId || !user) return null;

    try {
      // TODO: Replace with actual Supabase query when types are ready
      const newAssignment: Assignment = {
        ...assignmentData,
        id: `assignment-${Date.now()}`,
        created_by: user.id,
        school_id: activeSchoolId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setAssignments(prev => [newAssignment, ...prev]);
      
      toast({
        title: "Success",
        description: "Assignment created successfully"
      });

      return newAssignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive"
      });
      return null;
    }
  };

  // Update assignment
  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    try {
      setAssignments(prev => prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, ...updates, updated_at: new Date().toISOString() }
          : assignment
      ));

      toast({
        title: "Success",
        description: "Assignment updated successfully"
      });
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive"
      });
    }
  };

  // Get assignment statistics
  const getAssignmentStats = (assignmentId: string) => {
    const assignmentSubmissions = submissions.filter(s => s.assignment_id === assignmentId);
    const totalSubmissions = assignmentSubmissions.length;
    const gradedSubmissions = assignmentSubmissions.filter(s => s.status === 'graded').length;
    const lateSubmissions = assignmentSubmissions.filter(s => s.is_late).length;
    const averageGrade = assignmentSubmissions
      .filter(s => s.marks_awarded !== null)
      .reduce((sum, s) => sum + (s.marks_awarded || 0), 0) / gradedSubmissions || 0;

    return {
      totalSubmissions,
      gradedSubmissions,
      lateSubmissions,
      averageGrade: Math.round(averageGrade * 100) / 100,
      pendingGrading: totalSubmissions - gradedSubmissions
    };
  };

  useEffect(() => {
    if (activeSchoolId) {
      fetchAssignments();
    }
  }, [activeSchoolId]);

  return {
    assignments,
    submissions,
    loading,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    getAssignmentStats
  };
};