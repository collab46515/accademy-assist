import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from './useRBAC';
import { useToast } from '@/hooks/use-toast';
import { enrollmentFormSchema, type EnrollmentFormData, type PathwayType, pathwayConfig } from '@/lib/enrollment-schemas';

interface UseEnrollmentFormProps {
  pathway: PathwayType;
  applicationId?: string;
  schoolId?: string;
}

export function useEnrollmentForm({ pathway, applicationId, schoolId }: UseEnrollmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(applicationId || null);
  const { currentSchool } = useRBAC();
  const { toast } = useToast();
  
  // Use provided schoolId or currentSchool.id, with fallback to Demo School for unauthenticated users
  const effectiveSchoolId = schoolId || currentSchool?.id || 'c8b1e1e0-7b8a-4c9d-9e2f-3a4b5c6d7e8f';
  
  const config = pathwayConfig[pathway];
  const totalSteps = config.totalSteps;

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      pathway,
    } as EnrollmentFormData,
    mode: 'onBlur',
  });

  const { watch, getValues, setValue, reset } = form;

  // Helper function to serialize form data for JSON storage
  const serializeFormData = useCallback((data: any) => {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
  }, []);

  // Helper function to map frontend pathway types to database enum values
  const mapPathwayToDatabase = useCallback((frontendPathway: PathwayType): string => {
    const pathwayMapping: Record<PathwayType, string> = {
      'standard': 'standard_digital',
      'sen': 'standard_digital', // SEN uses standard digital pathway
      'staff_child': 'staff_child',
      'emergency': 'emergency_safeguarding',
      'bulk_import': 'standard_digital', // Bulk import uses standard digital
      'internal_progression': 'internal_progression',
    };
    
    return pathwayMapping[frontendPathway] || 'standard_digital';
  }, []);

  // Helper function to safely extract common fields from any pathway
  const extractCommonFields = useCallback((data: any) => {
    // Try to extract student name from different pathway structures
    let studentName = '';
    if (data.student_name) {
      studentName = data.student_name;
    } else if (data.student_first_name && data.student_last_name) {
      studentName = `${data.student_first_name} ${data.student_last_name}`;
    }

    // Extract year group - some pathways might not have it
    const yearGroup = data.year_group || data.current_year_group || data.target_year_group || '';

    // Extract parent info - not all pathways have parent_name/parent_email
    const parentName = data.parent_name || data.staff_member_name || data.referral_source_name || '';
    const parentEmail = data.parent_email || data.staff_member_email || data.referral_source_email || '';

    // Extract date of birth with different field names
    let dateOfBirth = null;
    if (data.date_of_birth) {
      dateOfBirth = data.date_of_birth instanceof Date 
        ? data.date_of_birth.toISOString().split('T')[0] 
        : data.date_of_birth;
    } else if (data.student_dob) {
      dateOfBirth = data.student_dob instanceof Date 
        ? data.student_dob.toISOString().split('T')[0] 
        : data.student_dob;
    }

    return {
      studentName,
      yearGroup,
      parentName,
      parentEmail,
      dateOfBirth,
    };
  }, []);

  // Auto-save functionality with debouncing
  const saveAsDraft = useCallback(async (data: Partial<EnrollmentFormData>, silent = false) => {
    if (!effectiveSchoolId) return;
    
    setIsSaving(true);
    try {
      const commonFields = extractCommonFields(data);
      
      // Map form data to database schema
      const mappedData = {
        // Required fields for database
        application_number: `DRAFT-${Date.now()}`,
        pathway: mapPathwayToDatabase(pathway) as any,
        school_id: effectiveSchoolId,
        
        // Map extracted common fields
        student_name: commonFields.studentName,
        year_group: commonFields.yearGroup,
        parent_name: commonFields.parentName,
        parent_email: commonFields.parentEmail,
        date_of_birth: commonFields.dateOfBirth,
        
        // Status and draft fields
        status: 'draft' as const,
        
        // Store all form data in additional_data as JSON
        additional_data: serializeFormData({
          pathway_data: data,
          draft_data: data,
          progress_step: currentStep,
          total_steps: totalSteps,
          auto_saved_at: new Date().toISOString(),
        }),
      };

      let result;
      if (currentDraftId || applicationId) {
        // Update existing draft
        result = await supabase
          .from('enrollment_applications')
          .update(mappedData)
          .eq('id', currentDraftId || applicationId)
          .select()
          .single();
      } else {
        // Check if there's already a recent draft for this user/school to avoid duplicates
        const { data: existingDraft } = await supabase
          .from('enrollment_applications')
          .select('id')
          .eq('status', 'draft')
          .eq('school_id', effectiveSchoolId)
          .eq('pathway', mapPathwayToDatabase(pathway) as any)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Within last 24 hours
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingDraft) {
          // Update existing recent draft instead of creating new one
          result = await supabase
            .from('enrollment_applications')
            .update(mappedData)
            .eq('id', existingDraft.id)
            .select()
            .single();
          
          // Store the draft ID for future updates
          setCurrentDraftId(existingDraft.id);
        } else {
          // Create new draft only if no recent draft exists
          result = await supabase
            .from('enrollment_applications')
            .insert([mappedData])
            .select()
            .single();
          
          // Store the new draft ID for future updates
          if (result.data) {
            setCurrentDraftId(result.data.id);
          }
        }
      }

      if (result.error) throw result.error;

      if (!silent) {
        toast({
          title: "Draft saved",
          description: "Your progress has been saved automatically.",
        });
      }

      return result.data.id;
    } catch (error) {
      console.error('Error saving draft:', error);
      if (!silent) {
        toast({
          title: "Save failed",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [effectiveSchoolId, currentStep, totalSteps, pathway, applicationId, toast, extractCommonFields, mapPathwayToDatabase]);

  // Watch for form changes and trigger auto-save
  useEffect(() => {
    const subscription = watch((data) => {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Set new timeout for auto-save (debounced)
      const timeout = setTimeout(() => {
        saveAsDraft(data as Partial<EnrollmentFormData>, true);
      }, 2000); // 2 second debounce

      setAutoSaveTimeout(timeout);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [watch, saveAsDraft, autoSaveTimeout]);

  // Load existing draft
  const loadDraft = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.additional_data && typeof data.additional_data === 'object') {
        const additionalData = data.additional_data as any;
        if (additionalData.draft_data) {
          reset(additionalData.draft_data as EnrollmentFormData);
          setCurrentStep(additionalData.progress_step || 1);
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      toast({
        title: "Load failed",
        description: "Failed to load your saved progress.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [reset, toast]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  // Submit final application
  const submitApplication = useCallback(async (data: EnrollmentFormData) => {
    if (!effectiveSchoolId || isSubmitted || isLoading) return;

    setIsLoading(true);
    try {
      const commonFields = extractCommonFields(data);
      
      const applicationData = {
        // Required fields for database
        application_number: `APP-${Date.now()}`,
        pathway: mapPathwayToDatabase(pathway) as any,
        school_id: effectiveSchoolId,
        
        // Map extracted common fields
        student_name: commonFields.studentName,
        year_group: commonFields.yearGroup,
        parent_name: commonFields.parentName,
        parent_email: commonFields.parentEmail,
        date_of_birth: commonFields.dateOfBirth,
        
        // Status and submission fields
        status: 'submitted' as const,
        submitted_at: new Date().toISOString(),
        submitted_by: (await supabase.auth.getUser()).data.user?.id,
        
        // Store all form data in additional_data
        additional_data: serializeFormData({
          pathway_data: data,
          submitted_data: data,
          progress_step: totalSteps,
          total_steps: totalSteps,
          submitted_at: new Date().toISOString(),
        }),
      };

      let result;
      if (applicationId) {
        // Update existing application
        result = await supabase
          .from('enrollment_applications')
          .update(applicationData)
          .eq('id', applicationId)
          .select()
          .single();
      } else {
        // Create new application
        result = await supabase
          .from('enrollment_applications')
          .insert([applicationData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Application submitted",
        description: `Your ${config.name.toLowerCase()} application has been submitted successfully.`,
      });

      setIsSubmitted(true);
      return result.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [effectiveSchoolId, applicationId, totalSteps, config.name, toast, extractCommonFields, pathway, mapPathwayToDatabase, isSubmitted, isLoading]);

  // Get field validation status
  const getFieldErrors = useCallback((fieldPath: string) => {
    const errors = form.formState.errors;
    return fieldPath.split('.').reduce((acc, key) => acc?.[key], errors as any);
  }, [form.formState.errors]);

  // Check if current step is valid
  const isStepValid = useCallback((step: number): boolean => {
    // This would need to be implemented based on which fields are required for each step
    // For now, return true
    return true;
  }, []);

  return {
    // Form
    form,
    
    // State
    currentStep,
    totalSteps,
    isLoading,
    isSaving,
    isSubmitted,
    config,
    
    // Navigation
    nextStep,
    previousStep,
    goToStep,
    
    // Persistence
    saveAsDraft,
    loadDraft,
    submitApplication,
    
    // Validation
    getFieldErrors,
    isStepValid,
    
    // Progress
    progress: totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
}