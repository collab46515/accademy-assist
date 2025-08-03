import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Performance Management Types
export interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_period_start: string;
  review_period_end: string;
  review_type: 'annual' | 'quarterly' | 'probation' | 'project';
  overall_rating?: number;
  goals_achievement?: number;
  strengths?: string;
  areas_for_improvement?: string;
  development_plan?: string;
  status: 'draft' | 'submitted' | 'approved' | 'final';
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceGoal {
  id: string;
  employee_id: string;
  goal_title: string;
  goal_description?: string;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'performance' | 'development' | 'behavioral';
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Recruitment Types
export interface JobPosting {
  id: string;
  job_title: string;
  department_id?: string;
  job_description: string;
  requirements?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  location?: string;
  posting_date: string;
  closing_date?: string;
  status: 'draft' | 'active' | 'closed' | 'filled';
  posted_by: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_posting_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  application_status: 'submitted' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  interview_scheduled_at?: string;
  interviewer_id?: string;
  interview_notes?: string;
  application_score?: number;
  created_at: string;
  updated_at: string;
}

// Training Types
export interface TrainingCourse {
  id: string;
  course_title: string;
  course_description?: string;
  course_provider?: string;
  course_type: 'online' | 'in_person' | 'hybrid';
  duration_hours?: number;
  cost_per_person?: number;
  max_participants?: number;
  course_materials: any;
  created_at: string;
  updated_at: string;
}

export interface TrainingEnrollment {
  id: string;
  employee_id: string;
  course_id: string;
  enrollment_date: string;
  start_date?: string;
  completion_date?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress_percentage: number;
  final_score?: number;
  certificate_issued: boolean;
  created_at: string;
  updated_at: string;
}

// Benefits Types
export interface BenefitPlan {
  id: string;
  plan_name: string;
  plan_type: 'health' | 'dental' | 'vision' | 'retirement' | 'life_insurance' | 'disability';
  provider_name?: string;
  plan_description?: string;
  employee_contribution?: number;
  employer_contribution?: number;
  coverage_details: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Asset Management Types
export interface CompanyAsset {
  id: string;
  asset_tag: string;
  asset_name: string;
  category_id: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_cost?: number;
  current_value?: number;
  location?: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  assigned_to?: string;
  assignment_date?: string;
  warranty_expiry?: string;
  created_at: string;
  updated_at: string;
}

// Time Tracking Types
export interface Project {
  id: string;
  project_name: string;
  project_code?: string;
  description?: string;
  client_name?: string;
  start_date?: string;
  end_date?: string;
  project_manager_id?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  budget?: number;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  employee_id: string;
  project_id?: string;
  task_description: string;
  start_time: string;
  end_time?: string;
  hours_worked?: number;
  is_billable: boolean;
  hourly_rate?: number;
  status: 'draft' | 'submitted' | 'approved' | 'billed';
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

// Travel & Expense Types
export interface TravelRequest {
  id: string;
  employee_id: string;
  trip_purpose: string;
  destination: string;
  departure_date: string;
  return_date: string;
  estimated_cost?: number;
  accommodation_required: boolean;
  transportation_type?: 'flight' | 'train' | 'car' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approved_by?: string;
  approval_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseReport {
  id: string;
  employee_id: string;
  travel_request_id?: string;
  report_title: string;
  total_amount: number;
  currency: string;
  submission_date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  approved_by?: string;
  approval_date?: string;
  reimbursement_date?: string;
  created_at: string;
  updated_at: string;
}

// Survey Types
export interface EngagementSurvey {
  id: string;
  survey_title: string;
  survey_description?: string;
  survey_questions: any[];
  start_date: string;
  end_date: string;
  is_anonymous: boolean;
  target_departments: any[];
  status: 'draft' | 'active' | 'closed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useComprehensiveHR() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Performance Management State
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [performanceGoals, setPerformanceGoals] = useState<PerformanceGoal[]>([]);

  // Recruitment State
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  // Training State
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);
  const [trainingEnrollments, setTrainingEnrollments] = useState<TrainingEnrollment[]>([]);

  // Benefits State
  const [benefitPlans, setBenefitPlans] = useState<BenefitPlan[]>([]);

  // Asset Management State
  const [companyAssets, setCompanyAssets] = useState<CompanyAsset[]>([]);

  // Time Tracking State
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  // Travel & Expense State
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([]);
  const [expenseReports, setExpenseReports] = useState<ExpenseReport[]>([]);

  // Survey State
  const [engagementSurveys, setEngagementSurveys] = useState<EngagementSurvey[]>([]);

  // Fetch all comprehensive HR data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        reviewsRes,
        goalsRes,
        jobsRes,
        applicationsRes,
        coursesRes,
        enrollmentsRes,
        benefitsRes,
        assetsRes,
        projectsRes,
        timeRes,
        travelRes,
        expensesRes,
        surveysRes
      ] = await Promise.all([
        supabase.from('performance_reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('performance_goals').select('*').order('created_at', { ascending: false }),
        supabase.from('job_postings').select('*').order('created_at', { ascending: false }),
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('training_courses').select('*').order('created_at', { ascending: false }),
        supabase.from('training_enrollments').select('*').order('created_at', { ascending: false }),
        supabase.from('benefit_plans').select('*').order('created_at', { ascending: false }),
        supabase.from('company_assets').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('time_entries').select('*').order('created_at', { ascending: false }),
        supabase.from('travel_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('expense_reports').select('*').order('created_at', { ascending: false }),
        supabase.from('engagement_surveys').select('*').order('created_at', { ascending: false })
      ]);

      // Handle errors for any requests
      const errors = [
        reviewsRes.error,
        goalsRes.error,
        jobsRes.error,
        applicationsRes.error,
        coursesRes.error,
        enrollmentsRes.error,
        benefitsRes.error,
        assetsRes.error,
        projectsRes.error,
        timeRes.error,
        travelRes.error,
        expensesRes.error,
        surveysRes.error
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error('Some HR data fetch errors:', errors);
        toast({
          title: "Partial Data Load",
          description: "Some HR data couldn't be loaded. Please check your permissions.",
          variant: "destructive",
        });
      }

      // Set state with successful responses (casting to our types)
      setPerformanceReviews((reviewsRes.data as PerformanceReview[]) || []);
      setPerformanceGoals((goalsRes.data as PerformanceGoal[]) || []);
      setJobPostings((jobsRes.data as JobPosting[]) || []);
      setJobApplications((applicationsRes.data as JobApplication[]) || []);
      setTrainingCourses((coursesRes.data as TrainingCourse[]) || []);
      setTrainingEnrollments((enrollmentsRes.data as TrainingEnrollment[]) || []);
      setBenefitPlans((benefitsRes.data as BenefitPlan[]) || []);
      setCompanyAssets((assetsRes.data as CompanyAsset[]) || []);
      setProjects((projectsRes.data as Project[]) || []);
      setTimeEntries((timeRes.data as TimeEntry[]) || []);
      setTravelRequests((travelRes.data as TravelRequest[]) || []);
      setExpenseReports((expensesRes.data as ExpenseReport[]) || []);
      setEngagementSurveys((surveysRes.data as EngagementSurvey[]) || []);

    } catch (error) {
      console.error('Error fetching comprehensive HR data:', error);
      toast({
        title: "Error",
        description: "Failed to load HR data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for each module
  // Performance Management
  const createPerformanceReview = async (reviewData: Omit<PerformanceReview, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      setPerformanceReviews(prev => [data as PerformanceReview, ...prev]);
      toast({ title: "Success", description: "Performance review created successfully." });
      return data;
    } catch (error) {
      console.error('Error creating performance review:', error);
      toast({ title: "Error", description: "Failed to create performance review.", variant: "destructive" });
      throw error;
    }
  };

  const createJobPosting = async (jobData: Omit<JobPosting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;

      setJobPostings(prev => [data as JobPosting, ...prev]);
      toast({ title: "Success", description: "Job posting created successfully." });
      return data;
    } catch (error) {
      console.error('Error creating job posting:', error);
      toast({ title: "Error", description: "Failed to create job posting.", variant: "destructive" });
      throw error;
    }
  };

  const createTrainingCourse = async (courseData: Omit<TrainingCourse, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('training_courses')
        .insert([courseData])
        .select()
        .single();

      if (error) throw error;

      setTrainingCourses(prev => [data as TrainingCourse, ...prev]);
      toast({ title: "Success", description: "Training course created successfully." });
      return data;
    } catch (error) {
      console.error('Error creating training course:', error);
      toast({ title: "Error", description: "Failed to create training course.", variant: "destructive" });
      throw error;
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data as Project, ...prev]);
      toast({ title: "Success", description: "Project created successfully." });
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
      throw error;
    }
  };

  const createTimeEntry = async (timeData: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert([timeData])
        .select()
        .single();

      if (error) throw error;

      setTimeEntries(prev => [data as TimeEntry, ...prev]);
      toast({ title: "Success", description: "Time entry created successfully." });
      return data;
    } catch (error) {
      console.error('Error creating time entry:', error);
      toast({ title: "Error", description: "Failed to create time entry.", variant: "destructive" });
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: JobApplication['application_status'], notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ 
          application_status: status,
          interview_notes: notes 
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      setJobApplications(prev => prev.map(app => app.id === applicationId ? data as JobApplication : app));
      toast({ title: "Success", description: `Application ${status} successfully.` });
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({ title: "Error", description: "Failed to update application status.", variant: "destructive" });
      throw error;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    loading,
    
    // Performance Management
    performanceReviews,
    performanceGoals,
    createPerformanceReview,
    
    // Recruitment
    jobPostings,
    jobApplications,
    createJobPosting,
    updateApplicationStatus,
    
    // Training
    trainingCourses,
    trainingEnrollments,
    createTrainingCourse,
    
    // Benefits
    benefitPlans,
    
    // Assets
    companyAssets,
    
    // Time Tracking
    projects,
    timeEntries,
    createProject,
    createTimeEntry,
    
    // Travel & Expense
    travelRequests,
    expenseReports,
    
    // Surveys
    engagementSurveys,
    
    // General
    refreshData: fetchAllData,
  };
}