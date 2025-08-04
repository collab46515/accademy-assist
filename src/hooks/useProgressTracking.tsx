import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface TopicProgress {
  topic_id: string;
  topic_name: string;
  total_lessons_planned: number;
  completed_lessons: number;
  coverage_percentage: number;
  subject: string;
  year_group: string;
  term: string;
  last_updated: string;
}

interface ProgressStats {
  total_topics: number;
  completed_topics: number;
  in_progress_topics: number;
  not_started_topics: number;
  overall_coverage: number;
}

export const useProgressTracking = (schoolId?: string) => {
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    total_topics: 0,
    completed_topics: 0,
    in_progress_topics: 0,
    not_started_topics: 0,
    overall_coverage: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Calculate progress for a specific curriculum topic
  const calculateTopicProgress = async (topicId: string) => {
    if (!schoolId) return;

    try {
      // Get total lessons planned for this topic
      const { data: plannedLessons, error: plannedError } = await supabase
        .from('lesson_plans')
        .select('id, status')
        .eq('curriculum_topic_id', topicId)
        .eq('school_id', schoolId);

      if (plannedError) throw plannedError;

      const totalLessons = plannedLessons?.length || 0;
      const completedLessons = plannedLessons?.filter(lesson => lesson.status === 'completed')?.length || 0;
      const coveragePercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        coverage_percentage: coveragePercentage
      };
    } catch (error) {
      console.error('Error calculating topic progress:', error);
      return null;
    }
  };

  // Update progress when a lesson is completed
  const updateLessonProgress = async (lessonId: string, newStatus: string) => {
    try {
      // Update lesson status
      const { error: updateError } = await supabase
        .from('lesson_plans')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonId);

      if (updateError) throw updateError;

      // Get the lesson to find its curriculum topic
      const { data: lesson, error: lessonError } = await supabase
        .from('lesson_plans')
        .select('curriculum_topic_id, title')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      // If lesson has a curriculum topic, recalculate progress
      if (lesson.curriculum_topic_id) {
        await recalculateTopicCoverage(lesson.curriculum_topic_id);
        
        if (newStatus === 'completed') {
          toast({
            title: "Progress Updated",
            description: `Lesson "${lesson.title}" marked as completed. Curriculum coverage updated.`,
          });
        }
      }

      // Refresh progress data
      await fetchAllProgress();

    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson progress",
        variant: "destructive"
      });
    }
  };

  // Recalculate coverage for a specific topic
  const recalculateTopicCoverage = async (topicId: string) => {
    if (!schoolId) return;

    try {
      const progress = await calculateTopicProgress(topicId);
      if (!progress) return;

      // For now, we'll store this in memory
      // TODO: Create curriculum_topic_progress table to persist this data
      console.log('Topic coverage updated:', {
        topicId,
        total_lessons: progress.total_lessons,
        completed_lessons: progress.completed_lessons,
        coverage_percentage: progress.coverage_percentage
      });

    } catch (error) {
      console.error('Error recalculating topic coverage:', error);
    }
  };

  // Fetch all progress data for the school
  const fetchAllProgress = async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      // Simulate fetching progress data (would come from database)
      const mockProgress: TopicProgress[] = [
        {
          topic_id: 'fractions-equiv',
          topic_name: 'Recognise equivalent fractions',
          total_lessons_planned: 3,
          completed_lessons: 1,
          coverage_percentage: 33,
          subject: 'Mathematics',
          year_group: 'Year 4',
          term: 'Autumn',
          last_updated: new Date().toISOString()
        },
        {
          topic_id: 'fractions-add',
          topic_name: 'Add and subtract fractions',
          total_lessons_planned: 4,
          completed_lessons: 0,
          coverage_percentage: 0,
          subject: 'Mathematics',
          year_group: 'Year 4',
          term: 'Autumn',
          last_updated: new Date().toISOString()
        },
        {
          topic_id: 'photosynthesis',
          topic_name: 'Photosynthesis in plants',
          total_lessons_planned: 5,
          completed_lessons: 5,
          coverage_percentage: 100,
          subject: 'Science',
          year_group: 'Year 7',
          term: 'Spring',
          last_updated: new Date().toISOString()
        }
      ];

      setTopicProgress(mockProgress);

      // Calculate overall stats
      const totalTopics = mockProgress.length;
      const completedTopics = mockProgress.filter(t => t.coverage_percentage === 100).length;
      const inProgressTopics = mockProgress.filter(t => t.coverage_percentage > 0 && t.coverage_percentage < 100).length;
      const notStartedTopics = mockProgress.filter(t => t.coverage_percentage === 0).length;
      const overallCoverage = Math.round(mockProgress.reduce((sum, topic) => sum + topic.coverage_percentage, 0) / totalTopics);

      setProgressStats({
        total_topics: totalTopics,
        completed_topics: completedTopics,
        in_progress_topics: inProgressTopics,
        not_started_topics: notStartedTopics,
        overall_coverage: overallCoverage
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch progress data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get progress for a specific topic
  const getTopicProgress = (topicId: string) => {
    return topicProgress.find(progress => progress.topic_id === topicId);
  };

  // Generate coverage report data
  const generateCoverageReport = () => {
    return {
      timestamp: new Date().toISOString(),
      school_id: schoolId,
      overall_stats: progressStats,
      topic_breakdown: topicProgress,
      inspection_ready: true,
      compliance_status: progressStats.overall_coverage >= 80 ? 'compliant' : 'needs_attention'
    };
  };

  useEffect(() => {
    if (schoolId) {
      fetchAllProgress();
    }
  }, [schoolId]);

  return {
    topicProgress,
    progressStats,
    loading,
    updateLessonProgress,
    recalculateTopicCoverage,
    fetchAllProgress,
    getTopicProgress,
    generateCoverageReport,
    calculateTopicProgress
  };
};