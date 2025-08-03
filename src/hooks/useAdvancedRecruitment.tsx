import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Enhanced Recruitment Types
export interface JobRequisition {
  id: string;
  requisition_number: string;
  title: string;
  department_id?: string;
  reporting_manager_id?: string;
  justification?: string;
  urgency_level: string;
  budget_allocated?: number;
  headcount_requested: number;
  employment_type: string;
  location?: string;
  remote_work_option: boolean;
  salary_range_min?: number;
  salary_range_max?: number;
  required_start_date?: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  requested_by: string;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  candidate_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  current_location?: string;
  willing_to_relocate: boolean;
  current_salary?: number;
  expected_salary?: number;
  notice_period_weeks?: number;
  availability_date?: string;
  source?: string;
  source_details?: string;
  cv_file_path?: string;
  cover_letter_file_path?: string;
  skills: any[];
  experience_years?: number;
  education: any[];
  certifications: any[];
  languages: any[];
  notes?: string;
  tags: any[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  application_number: string;
  job_posting_id: string;
  candidate_id: string;
  requisition_id?: string;
  application_date: string;
  status: string;
  current_stage?: string;
  priority_level: string;
  assigned_recruiter_id?: string;
  screening_score?: number;
  overall_rating?: number;
  feedback?: string;
  rejection_reason?: string;
  application_data: any;
  created_at: string;
  updated_at: string;
}

export interface InterviewStage {
  id: string;
  job_posting_id: string;
  stage_name: string;
  stage_order: number;
  stage_type: string;
  duration_minutes: number;
  is_required: boolean;
  description?: string;
  evaluation_criteria: any[];
  created_at: string;
  updated_at: string;
}

export interface InterviewSchedule {
  id: string;
  application_id: string;
  stage_id: string;
  scheduled_date: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  interviewer_ids: string[];
  status: string;
  feedback?: string;
  score?: number;
  recommendation?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentTest {
  id: string;
  test_name: string;
  test_type: string;
  description?: string;
  duration_minutes?: number;
  passing_score?: number;
  test_url?: string;
  instructions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CandidateAssessment {
  id: string;
  application_id: string;
  assessment_test_id: string;
  assigned_date: string;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  score?: number;
  max_score?: number;
  percentage_score?: number;
  status: string;
  results: any;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface ReferenceCheck {
  id: string;
  application_id: string;
  reference_name: string;
  reference_title?: string;
  reference_company?: string;
  reference_email?: string;
  reference_phone?: string;
  relationship?: string;
  contacted_date?: string;
  response_received_date?: string;
  status: string;
  overall_rating?: number;
  would_rehire?: boolean;
  feedback?: string;
  notes?: string;
  conducted_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BackgroundCheck {
  id: string;
  application_id: string;
  check_type: string;
  vendor?: string;
  initiated_date: string;
  completed_date?: string;
  status: string;
  results: any;
  notes?: string;
  initiated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface JobOffer {
  id: string;
  application_id: string;
  offer_date: string;
  expiry_date?: string;
  salary: number;
  currency: string;
  employment_type: string;
  start_date?: string;
  benefits: any;
  terms_and_conditions?: string;
  offer_letter_path?: string;
  status: string;
  candidate_response_date?: string;
  negotiation_notes?: string;
  final_salary?: number;
  created_by: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingTemplate {
  id: string;
  template_name: string;
  department_id?: string;
  job_role?: string;
  checklist_items: any[];
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgress {
  id: string;
  employee_id: string;
  template_id: string;
  start_date: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  progress_percentage: number;
  completed_items: any[];
  status: string;
  buddy_assigned_id?: string;
  hr_contact_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useAdvancedRecruitment() {
  const [loading, setLoading] = useState(false);

  // Enhanced Recruitment State
  const [jobRequisitions, setJobRequisitions] = useState<JobRequisition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [interviewStages, setInterviewStages] = useState<InterviewStage[]>([]);
  const [interviewSchedules, setInterviewSchedules] = useState<InterviewSchedule[]>([]);
  const [assessmentTests, setAssessmentTests] = useState<AssessmentTest[]>([]);
  const [candidateAssessments, setCandidateAssessments] = useState<CandidateAssessment[]>([]);
  const [referenceChecks, setReferenceChecks] = useState<ReferenceCheck[]>([]);
  const [backgroundChecks, setBackgroundChecks] = useState<BackgroundCheck[]>([]);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [onboardingTemplates, setOnboardingTemplates] = useState<OnboardingTemplate[]>([]);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress[]>([]);

  // Fetch all advanced recruitment data
  const fetchAllRecruitmentData = async () => {
    setLoading(true);
    try {
      const [
        requisitionsRes,
        candidatesRes,
        applicationsRes,
        stagesRes,
        schedulesRes,
        testsRes,
        assessmentsRes,
        referencesRes,
        backgroundsRes,
        offersRes,
        templatesRes,
        progressRes
      ] = await Promise.all([
        supabase.from('job_requisitions').select('*').order('created_at', { ascending: false }),
        supabase.from('candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('interview_stages').select('*').order('stage_order', { ascending: true }),
        supabase.from('interview_schedules').select('*').order('scheduled_date', { ascending: false }),
        supabase.from('assessment_tests').select('*').order('created_at', { ascending: false }),
        supabase.from('candidate_assessments').select('*').order('assigned_date', { ascending: false }),
        supabase.from('reference_checks').select('*').order('created_at', { ascending: false }),
        supabase.from('background_checks').select('*').order('initiated_date', { ascending: false }),
        supabase.from('job_offers').select('*').order('offer_date', { ascending: false }),
        supabase.from('onboarding_templates').select('*').order('created_at', { ascending: false }),
        supabase.from('onboarding_progress').select('*').order('start_date', { ascending: false })
      ]);

      // Set state with successful responses
      setJobRequisitions((requisitionsRes.data as JobRequisition[]) || []);
      setCandidates((candidatesRes.data as Candidate[]) || []);
      setJobApplications((applicationsRes.data as JobApplication[]) || []);
      setInterviewStages((stagesRes.data as InterviewStage[]) || []);
      setInterviewSchedules((schedulesRes.data as InterviewSchedule[]) || []);
      setAssessmentTests((testsRes.data as AssessmentTest[]) || []);
      setCandidateAssessments((assessmentsRes.data as CandidateAssessment[]) || []);
      setReferenceChecks((referencesRes.data as ReferenceCheck[]) || []);
      setBackgroundChecks((backgroundsRes.data as BackgroundCheck[]) || []);
      setJobOffers((offersRes.data as JobOffer[]) || []);
      setOnboardingTemplates((templatesRes.data as OnboardingTemplate[]) || []);
      setOnboardingProgress((progressRes.data as OnboardingProgress[]) || []);

      toast.success("Recruitment data loaded successfully");
    } catch (error) {
      console.error('Error fetching advanced recruitment data:', error);
      toast.error("Failed to load recruitment data");
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations

  // Job Requisitions
  const createJobRequisition = async (requisitionData: Omit<JobRequisition, 'id' | 'created_at' | 'updated_at' | 'requisition_number'>) => {
    try {
      const { data, error } = await supabase
        .from('job_requisitions')
        .insert([requisitionData])
        .select()
        .single();

      if (error) throw error;

      setJobRequisitions(prev => [data as JobRequisition, ...prev]);
      toast.success("Job requisition created successfully");
      return data;
    } catch (error) {
      console.error('Error creating job requisition:', error);
      toast.error("Failed to create job requisition");
      throw error;
    }
  };

  // Candidates
  const createCandidate = async (candidateData: Omit<Candidate, 'id' | 'created_at' | 'updated_at' | 'candidate_number'>) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select()
        .single();

      if (error) throw error;

      setCandidates(prev => [data as Candidate, ...prev]);
      toast.success("Candidate added successfully");
      return data;
    } catch (error) {
      console.error('Error creating candidate:', error);
      toast.error("Failed to add candidate");
      throw error;
    }
  };

  // Job Applications
  const createJobApplication = async (applicationData: Omit<JobApplication, 'id' | 'created_at' | 'updated_at' | 'application_number'>) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      setJobApplications(prev => [data as JobApplication, ...prev]);
      toast.success("Job application created successfully");
      return data;
    } catch (error) {
      console.error('Error creating job application:', error);
      toast.error("Failed to create job application");
      throw error;
    }
  };

  // Interview Scheduling
  const scheduleInterview = async (scheduleData: Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('interview_schedules')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;

      setInterviewSchedules(prev => [data as InterviewSchedule, ...prev]);
      toast.success("Interview scheduled successfully");
      return data;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error("Failed to schedule interview");
      throw error;
    }
  };

  // Job Offers
  const createJobOffer = async (offerData: Omit<JobOffer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .insert([offerData])
        .select()
        .single();

      if (error) throw error;

      setJobOffers(prev => [data as JobOffer, ...prev]);
      toast.success("Job offer created successfully");
      return data;
    } catch (error) {
      console.error('Error creating job offer:', error);
      toast.error("Failed to create job offer");
      throw error;
    }
  };

  // Update Application Status
  const updateApplicationStatus = async (applicationId: string, status: string, feedback?: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ 
          status,
          feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      setJobApplications(prev => 
        prev.map(app => app.id === applicationId ? data as JobApplication : app)
      );
      toast.success(`Application ${status} successfully`);
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error("Failed to update application status");
      throw error;
    }
  };

  useEffect(() => {
    fetchAllRecruitmentData();
  }, []);

  return {
    loading,
    
    // Data
    jobRequisitions,
    candidates,
    jobApplications,
    interviewStages,
    interviewSchedules,
    assessmentTests,
    candidateAssessments,
    referenceChecks,
    backgroundChecks,
    jobOffers,
    onboardingTemplates,
    onboardingProgress,
    
    // Actions
    createJobRequisition,
    createCandidate,
    createJobApplication,
    scheduleInterview,
    createJobOffer,
    updateApplicationStatus,
    
    // Refresh
    refreshData: fetchAllRecruitmentData,
  };
}