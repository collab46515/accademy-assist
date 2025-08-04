import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CurriculumFramework {
  id: string;
  name: string;
  type: string;
  description?: string;
  country?: string;
  grade_levels: string[];
  academic_periods: string[];
  period_type: string;
  subjects: string[];
  is_active: boolean;
  is_template: boolean;
  school_id?: string;
}

export interface CurriculumTopic {
  id: string;
  framework_id: string;
  subject: string;
  grade_level: string;
  academic_period?: string;
  topic_code?: string;
  title: string;
  description?: string;
  learning_objectives: string[];
  skills: string[];
  prerequisites: string[];
  estimated_hours?: number;
  difficulty_level?: number;
  topic_order: number;
  tags: string[];
  resources: any[];
  assessment_criteria: string[];
  parent_topic_id?: string;
  is_mandatory: boolean;
}

export interface TopicCoverage {
  id: string;
  topic_id: string;
  class_id?: string;
  teacher_id?: string;
  school_id: string;
  academic_year: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'reviewed';
  planned_start_date?: string;
  actual_start_date?: string;
  planned_end_date?: string;
  actual_end_date?: string;
  completion_percentage: number;
  teaching_notes?: string;
  resources_used: any[];
  assessment_completed: boolean;
}

export interface SchoolCurriculumAdoption {
  id: string;
  school_id: string;
  framework_id: string;
  academic_year: string;
  customizations: any;
  is_active: boolean;
}

export function useCurriculumData() {
  const [frameworks, setFrameworks] = useState<CurriculumFramework[]>([]);
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [coverage, setCoverage] = useState<TopicCoverage[]>([]);
  const [schoolAdoption, setSchoolAdoption] = useState<SchoolCurriculumAdoption | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch curriculum frameworks (templates and school-specific)
  const fetchFrameworks = async () => {
    try {
      const { data, error } = await supabase
        .from('curriculum_frameworks')
        .select('*')
        .eq('is_active', true)
        .order('is_template', { ascending: false })
        .order('name');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        grade_levels: Array.isArray(item.grade_levels) ? item.grade_levels.map(String) : [],
        academic_periods: Array.isArray(item.academic_periods) ? item.academic_periods.map(String) : [],
        subjects: Array.isArray(item.subjects) ? item.subjects.map(String) : []
      })) || [];
      
      setFrameworks(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching frameworks",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch topics for a specific framework
  const fetchTopics = async (frameworkId: string) => {
    try {
      const { data, error } = await supabase
        .from('curriculum_topics')
        .select('*')
        .eq('framework_id', frameworkId)
        .order('subject')
        .order('grade_level')
        .order('topic_order');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        learning_objectives: Array.isArray(item.learning_objectives) ? item.learning_objectives.map(String) : [],
        skills: Array.isArray(item.skills) ? item.skills.map(String) : [],
        prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites.map(String) : [],
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
        resources: Array.isArray(item.resources) ? item.resources : [],
        assessment_criteria: Array.isArray(item.assessment_criteria) ? item.assessment_criteria.map(String) : []
      })) || [];
      
      setTopics(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching topics",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch topic coverage for current academic year
  const fetchCoverage = async (schoolId: string, academicYear: string) => {
    try {
      const { data, error } = await supabase
        .from('topic_coverage')
        .select('*')
        .eq('school_id', schoolId)
        .eq('academic_year', academicYear);

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        resources_used: Array.isArray(item.resources_used) ? item.resources_used : []
      })) || [];
      
      setCoverage(transformedData);
    } catch (error: any) {
      toast({
        title: "Error fetching coverage",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch school's current curriculum adoption
  const fetchSchoolAdoption = async (schoolId: string, academicYear: string) => {
    try {
      const { data, error } = await supabase
        .from('school_curriculum_adoption')
        .select('*')
        .eq('school_id', schoolId)
        .eq('academic_year', academicYear)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSchoolAdoption(data);
    } catch (error: any) {
      toast({
        title: "Error fetching school adoption",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Adopt a curriculum framework for school
  const adoptFramework = async (schoolId: string, frameworkId: string, academicYear: string) => {
    try {
      // Deactivate current adoption
      await supabase
        .from('school_curriculum_adoption')
        .update({ is_active: false })
        .eq('school_id', schoolId)
        .eq('academic_year', academicYear);

      // Create new adoption
      const { data, error } = await supabase
        .from('school_curriculum_adoption')
        .insert({
          school_id: schoolId,
          framework_id: frameworkId,
          academic_year: academicYear,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      setSchoolAdoption(data);
      
      toast({
        title: "Curriculum adopted",
        description: "The curriculum framework has been successfully adopted.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error adopting framework",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create custom framework from template
  const createCustomFramework = async (templateId: string, schoolId: string, customizations: any): Promise<CurriculumFramework> => {
    try {
      // Get template
      const { data: template, error: templateError } = await supabase
        .from('curriculum_frameworks')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Create custom framework
      const { data: newFramework, error: frameworkError } = await supabase
        .from('curriculum_frameworks')
        .insert({
          ...template,
          id: undefined,
          name: `${template.name} (Custom)`,
          is_template: false,
          school_id: schoolId,
          ...customizations
        })
        .select()
        .single();

      if (frameworkError) throw frameworkError;

      // Copy topics
      const { data: templateTopics, error: topicsError } = await supabase
        .from('curriculum_topics')
        .select('*')
        .eq('framework_id', templateId);

      if (topicsError) throw topicsError;

      if (templateTopics?.length) {
        const topicsToInsert = templateTopics.map(topic => ({
          ...topic,
          id: undefined,
          framework_id: newFramework.id
        }));

        const { error: insertError } = await supabase
          .from('curriculum_topics')
          .insert(topicsToInsert);

        if (insertError) throw insertError;
      }

      toast({
        title: "Custom curriculum created",
        description: "Your custom curriculum has been created successfully.",
      });

      await fetchFrameworks();
      
      // Transform the returned framework to match our interface
      const transformedFramework: CurriculumFramework = {
        ...newFramework,
        grade_levels: Array.isArray(newFramework.grade_levels) ? newFramework.grade_levels.map(String) : [],
        academic_periods: Array.isArray(newFramework.academic_periods) ? newFramework.academic_periods.map(String) : [],
        subjects: Array.isArray(newFramework.subjects) ? newFramework.subjects.map(String) : []
      };
      
      return transformedFramework;
    } catch (error: any) {
      toast({
        title: "Error creating custom framework",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update topic coverage
  const updateTopicCoverage = async (topicId: string, updates: Partial<TopicCoverage>) => {
    try {
      // Ensure required fields are present
      const upsertData = {
        topic_id: topicId,
        school_id: updates.school_id || '',
        academic_year: updates.academic_year || new Date().getFullYear().toString(),
        status: updates.status || 'not_started' as const,
        completion_percentage: updates.completion_percentage || 0,
        assessment_completed: updates.assessment_completed || false,
        resources_used: updates.resources_used || [],
        ...updates
      };

      const { data, error } = await supabase
        .from('topic_coverage')
        .upsert(upsertData)
        .select()
        .single();

      if (error) throw error;

      // Transform response data
      const transformedData = {
        ...data,
        resources_used: Array.isArray(data.resources_used) ? data.resources_used : []
      };

      // Update local state
      setCoverage(prev => {
        const existing = prev.find(c => c.topic_id === topicId);
        if (existing) {
          return prev.map(c => c.topic_id === topicId ? { ...c, ...transformedData } : c);
        } else {
          return [...prev, transformedData];
        }
      });

      toast({
        title: "Progress updated",
        description: "Topic coverage has been updated successfully.",
      });

      return transformedData;
    } catch (error: any) {
      toast({
        title: "Error updating coverage",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Import curriculum from file
  const importCurriculum = async (file: File, frameworkId?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (frameworkId) formData.append('framework_id', frameworkId);

      // This would typically call an edge function for file processing
      // For now, we'll create a placeholder implementation
      
      toast({
        title: "Import started",
        description: "Your curriculum import is being processed.",
      });

      // Log the import attempt
      const { error } = await supabase
        .from('curriculum_imports')
        .insert({
          framework_id: frameworkId,
          file_name: file.name,
          file_size: file.size,
          import_type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          total_records: 0,
          successful_records: 0,
          failed_records: 0
        });

      if (error) throw error;

    } catch (error: any) {
      toast({
        title: "Error importing curriculum",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Generate coverage report
  const generateCoverageReport = async (schoolId: string, academicYear: string, filters?: any) => {
    try {
      const { data, error } = await supabase
        .from('topic_coverage')
        .select(`
          *,
          curriculum_topics (
            title,
            subject,
            grade_level,
            academic_period,
            estimated_hours
          )
        `)
        .eq('school_id', schoolId)
        .eq('academic_year', academicYear);

      if (error) throw error;

      // Process data for reporting
      const report = data?.reduce((acc: any, coverage: any) => {
        const subject = coverage.curriculum_topics.subject;
        const grade = coverage.curriculum_topics.grade_level;
        
        if (!acc[subject]) acc[subject] = {};
        if (!acc[subject][grade]) acc[subject][grade] = {
          total: 0,
          completed: 0,
          in_progress: 0,
          not_started: 0,
          hours_planned: 0,
          hours_completed: 0
        };

        acc[subject][grade].total++;
        acc[subject][grade][coverage.status]++;
        acc[subject][grade].hours_planned += coverage.curriculum_topics.estimated_hours || 0;
        
        if (coverage.status === 'completed') {
          acc[subject][grade].hours_completed += coverage.curriculum_topics.estimated_hours || 0;
        }

        return acc;
      }, {});

      return report;
    } catch (error: any) {
      toast({
        title: "Error generating report",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFrameworks().finally(() => setLoading(false));
  }, []);

  return {
    frameworks,
    topics,
    coverage,
    schoolAdoption,
    loading,
    fetchFrameworks,
    fetchTopics,
    fetchCoverage,
    fetchSchoolAdoption,
    adoptFramework,
    createCustomFramework,
    updateTopicCoverage,
    importCurriculum,
    generateCoverageReport
  };
}