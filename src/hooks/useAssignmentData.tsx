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
  status: 'not_submitted' | 'in_progress' | 'submitted' | 'graded' | 'late';
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

  // Fetch assignments from database
  const fetchAssignments = async () => {
    if (!activeSchoolId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('school_id', activeSchoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data as Assignment[]);
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

  // Fetch submissions for assignments
  const fetchSubmissions = async () => {
    if (!activeSchoolId) return;
    
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .select(`
          *,
          assignments!inner(school_id)
        `)
        .eq('assignments.school_id', activeSchoolId);

      if (error) throw error;
      setSubmissions(data as AssignmentSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  // Create assignment
  const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'school_id'>) => {
    if (!activeSchoolId || !user) return null;

    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          created_by: user.id,
          school_id: activeSchoolId,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newAssignment = data as Assignment;
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
      const { error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

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
      fetchSubmissions();
    }
  }, [activeSchoolId]);

  const updateSubmission = async (assignmentId: string, updates: Partial<AssignmentSubmission>): Promise<void> => {
    try {
      const existingSubmission = submissions.find(s => s.assignment_id === assignmentId);
      
      if (existingSubmission) {
        // Update existing submission in database
        const { error } = await supabase
          .from('assignment_submissions')
          .update(updates)
          .eq('id', existingSubmission.id);

        if (error) throw error;

        const updatedSubmissions = submissions.map(s => 
          s.assignment_id === assignmentId ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
        );
        setSubmissions(updatedSubmissions);
      } else {
        // Create new submission in database
        const { data, error } = await supabase
          .from('assignment_submissions')
          .insert({
            assignment_id: assignmentId,
            student_id: user?.id,
            status: 'not_submitted',
            is_late: false,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;

        setSubmissions(prev => [...prev, data as AssignmentSubmission]);
      }
    } catch (error) {
      console.error('Failed to update submission:', error);
      throw error;
    }
  };

  const getSubmissionByAssignmentId = (assignmentId: string): AssignmentSubmission | undefined => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  return {
    assignments,
    submissions,
    loading,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    updateSubmission,
    getSubmissionByAssignmentId,
    getAssignmentStats
  };
};