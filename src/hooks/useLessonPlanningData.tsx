import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRBAC } from './useRBAC';
import { useToast } from './use-toast';

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  year_group: string;
  form_class?: string;
  lesson_date: string;
  period_id?: string;
  duration_minutes: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  curriculum_topic_id?: string;
  learning_objectives?: any[];
  success_criteria?: any[];
  lesson_sections?: any[];
  resources?: any[];
  differentiation?: any[];
  assessment?: any[];
  collaboration?: any[];
  sequence?: any[];
  integration?: any[];
  post_lesson_reflection?: any[];
  approved_by?: string;
  approved_at?: string;
  approval_comments?: string;
  teacher_id: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

export interface LessonPlanComment {
  id: string;
  lesson_plan_id: string;
  user_id: string;
  comment: string;
  comment_type: 'feedback' | 'approval' | 'rejection';
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}

export interface LessonPlanAssignment {
  id: string;
  lesson_plan_id: string;
  assigned_to: string;
  assigned_by: string;
  role: string;
  permissions?: any;
  created_at: string;
}

export function useLessonPlanningData(schoolId?: string) {
  const { user } = useAuth();
  const { hasRole, isSuperAdmin, isSchoolAdmin, currentSchool } = useRBAC();
  const { toast } = useToast();
  
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [comments, setComments] = useState<LessonPlanComment[]>([]);
  const [assignments, setAssignments] = useState<LessonPlanAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const activeSchoolId = schoolId || currentSchool?.id;

  // Fetch lesson plans
  const fetchLessonPlans = async () => {
    if (!user || !activeSchoolId) return;

    try {
      let query = supabase
        .from('lesson_plans')
        .select(`
          id,
          title,
          subject,
          year_group,
          form_class,
          lesson_date,
          period_id,
          duration_minutes,
          status,
          curriculum_topic_id,
          learning_objectives,
          success_criteria,
          lesson_sections,
          resources,
          differentiation,
          assessment,
          collaboration,
          sequence,
          integration,
          post_lesson_reflection,
          approved_by,
          approved_at,
          approval_comments,
          teacher_id,
          school_id,
          created_at,
          updated_at
        `)
        .eq('school_id', activeSchoolId)
        .order('lesson_date', { ascending: false });

      // Apply role-based filtering
      if (!isSuperAdmin() && !isSchoolAdmin()) {
        if (hasRole('teacher')) {
          // Teachers can see their own plans and those assigned to them
          query = query.or(`teacher_id.eq.${user.id},id.in.(${await getAssignedPlanIds()})`);
        } else if (hasRole('hod')) {
          // HODs can see all plans in their subject
          const userRoles = await supabase
            .from('user_roles')
            .select('department')
            .eq('user_id', user.id)
            .eq('role', 'hod')
            .eq('school_id', activeSchoolId);
          
          if (userRoles.data?.[0]?.department) {
            query = query.eq('subject', userRoles.data[0].department);
          }
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setLessonPlans((data || []) as LessonPlan[]);
    } catch (error) {
      console.error('Error fetching lesson plans:', error);
      toast({ title: "Error fetching lesson plans", variant: "destructive" });
    }
  };

  // Get assigned plan IDs for teachers
  const getAssignedPlanIds = async (): Promise<string> => {
    if (!user) return '';
    
    try {
      const { data } = await supabase
        .from('lesson_plan_assignments')
        .select('lesson_plan_id')
        .eq('assigned_to', user.id);
      
      return data?.map(a => a.lesson_plan_id).join(',') || '';
    } catch (error) {
      return '';
    }
  };

  // Fetch comments for a lesson plan
  const fetchComments = async (lessonPlanId: string) => {
    try {
      const { data, error } = await supabase
        .from('lesson_plan_comments')
        .select(`
          id,
          lesson_plan_id,
          user_id,
          comment,
          comment_type,
          created_at,
          profiles!user_id(first_name, last_name)
        `)
        .eq('lesson_plan_id', lessonPlanId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  // Create a new lesson plan
  const createLessonPlan = async (planData: Omit<LessonPlan, 'id' | 'teacher_id' | 'school_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !activeSchoolId) return null;

    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert({
          ...planData,
          teacher_id: user.id,
          school_id: activeSchoolId
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchLessonPlans(); // Refresh the list
      toast({ title: "Lesson plan created successfully" });
      return data;
    } catch (error) {
      console.error('Error creating lesson plan:', error);
      toast({ title: "Error creating lesson plan", variant: "destructive" });
      return null;
    }
  };

  // Update lesson plan
  const updateLessonPlan = async (id: string, updates: Partial<LessonPlan>) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchLessonPlans();
      toast({ title: "Lesson plan updated successfully" });
    } catch (error) {
      console.error('Error updating lesson plan:', error);
      toast({ title: "Error updating lesson plan", variant: "destructive" });
    }
  };

  // Submit lesson plan for approval
  const submitForApproval = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .update({ status: 'submitted' })
        .eq('id', id);

      if (error) throw error;
      
      await fetchLessonPlans();
      toast({ title: "Lesson plan submitted for approval" });
    } catch (error) {
      console.error('Error submitting lesson plan:', error);
      toast({ title: "Error submitting lesson plan", variant: "destructive" });
    }
  };

  // Approve lesson plan (HOD/Admin only)
  const approveLessonPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      
      await fetchLessonPlans();
      toast({ title: "Lesson plan approved" });
    } catch (error) {
      console.error('Error approving lesson plan:', error);
      toast({ title: "Error approving lesson plan", variant: "destructive" });
    }
  };

  // Reject lesson plan (HOD/Admin only)
  const rejectLessonPlan = async (id: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      // Add rejection comment if reason provided
      if (reason && user) {
        await addComment(id, reason, 'rejection');
      }
      
      await fetchLessonPlans();
      toast({ title: "Lesson plan rejected" });
    } catch (error) {
      console.error('Error rejecting lesson plan:', error);
      toast({ title: "Error rejecting lesson plan", variant: "destructive" });
    }
  };

  // Add comment
  const addComment = async (lessonPlanId: string, comment: string, type: 'feedback' | 'approval' | 'rejection' = 'feedback') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_plan_comments')
        .insert({
          lesson_plan_id: lessonPlanId,
          user_id: user.id,
          comment,
          comment_type: type
        });

      if (error) throw error;
      toast({ title: "Comment added successfully" });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: "Error adding comment", variant: "destructive" });
    }
  };

  // Assign lesson plan to TA
  const assignToTA = async (lessonPlanId: string, taUserId: string, notes?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_plan_assignments')
        .insert({
          lesson_plan_id: lessonPlanId,
          assigned_to: taUserId,
          assigned_by: user.id,
          role: 'support',
          permissions: { notes }
        });

      if (error) throw error;
      toast({ title: "Lesson plan assigned to TA" });
    } catch (error) {
      console.error('Error assigning lesson plan:', error);
      toast({ title: "Error assigning lesson plan", variant: "destructive" });
    }
  };

  // Check permissions
  const canEdit = async (planId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase.rpc('can_edit_lesson_plan', {
        lesson_plan_id: planId,
        user_id: user.id
      });
      return data || false;
    } catch (error) {
      return false;
    }
  };

  const canApprove = async (planId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase.rpc('can_approve_lesson_plan', {
        lesson_plan_id: planId,
        user_id: user.id
      });
      return data || false;
    } catch (error) {
      return false;
    }
  };

  const canAccess = async (planId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase.rpc('can_access_lesson_plan', {
        lesson_plan_id: planId,
        user_id: user.id
      });
      return data || false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (user && activeSchoolId) {
      setLoading(true);
      fetchLessonPlans().finally(() => setLoading(false));
    }
  }, [user, activeSchoolId]);

  return {
    lessonPlans,
    comments,
    assignments,
    loading,
    fetchLessonPlans,
    fetchComments,
    createLessonPlan,
    updateLessonPlan,
    submitForApproval,
    approveLessonPlan,
    rejectLessonPlan,
    addComment,
    assignToTA,
    canEdit,
    canApprove,
    canAccess
  };
}