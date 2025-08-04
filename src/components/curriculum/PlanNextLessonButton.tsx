import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, BookOpen, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLessonPlanningData } from '@/hooks/useLessonPlanningData';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useToast } from '@/hooks/use-toast';

interface TopicContinuation {
  topic_id: string;
  topic_name: string;
  subject: string;
  year_group: string;
  lessons_completed: number;
  lessons_planned: number;
  coverage_percentage: number;
  last_lesson_date?: string;
  framework_alignment?: string;
  expected_completion?: string;
}

interface PlanNextLessonButtonProps {
  schoolId: string;
  teacherId: string;
}

export const PlanNextLessonButton: React.FC<PlanNextLessonButtonProps> = ({
  schoolId,
  teacherId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicContinuation | null>(null);
  const [quickPlanData, setQuickPlanData] = useState({
    title: '',
    learning_objectives: '',
    duration_minutes: 50,
    lesson_date: new Date().toISOString().split('T')[0]
  });

  const { createLessonPlan, loading } = useLessonPlanningData();
  const { topics } = useCurriculumData();
  const { topicProgress, updateLessonProgress } = useProgressTracking(schoolId);
  const { toast } = useToast();

  // Mock data for topic continuations (would be real data in production)
  const topicContinuations: TopicContinuation[] = [
    {
      topic_id: 'fractions-equiv',
      topic_name: 'Recognise equivalent fractions',
      subject: 'Mathematics',
      year_group: 'Year 4',
      lessons_completed: 1,
      lessons_planned: 3,
      coverage_percentage: 33,
      last_lesson_date: '2024-01-10',
      framework_alignment: 'National Curriculum - Number: Fractions',
      expected_completion: '2024-01-20'
    },
    {
      topic_id: 'photosynthesis',
      topic_name: 'Photosynthesis in plants',
      subject: 'Science',
      year_group: 'Year 7',
      lessons_completed: 3,
      lessons_planned: 5,
      coverage_percentage: 60,
      last_lesson_date: '2024-01-08',
      framework_alignment: 'KS3 Science - Biology',
      expected_completion: '2024-01-25'
    },
    {
      topic_id: 'world-war-one',
      topic_name: 'World War One causes',
      subject: 'History',
      year_group: 'Year 9',
      lessons_completed: 0,
      lessons_planned: 4,
      coverage_percentage: 0,
      framework_alignment: 'KS3 History - Modern Britain',
      expected_completion: '2024-02-01'
    }
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    if (percentage >= 40) return 'text-info';
    return 'text-destructive';
  };

  const getUrgencyLevel = (topic: TopicContinuation) => {
    const daysUntilDeadline = topic.expected_completion ? 
      Math.ceil((new Date(topic.expected_completion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;
    
    if (daysUntilDeadline <= 7 && topic.coverage_percentage < 50) return 'critical';
    if (daysUntilDeadline <= 14 && topic.coverage_percentage < 75) return 'high';
    if (daysUntilDeadline <= 21 && topic.coverage_percentage < 80) return 'medium';
    return 'low';
  };

  const handleTopicSelect = (topic: TopicContinuation) => {
    setSelectedTopic(topic);
    
    // Auto-fill lesson title based on continuation
    const lessonNumber = topic.lessons_completed + 1;
    const suggestedTitle = `${topic.topic_name} - Lesson ${lessonNumber}`;
    
    setQuickPlanData(prev => ({
      ...prev,
      title: suggestedTitle,
      learning_objectives: `Continue building understanding of ${topic.topic_name.toLowerCase()}`
    }));
  };

  const handleQuickPlan = async () => {
    if (!selectedTopic) return;

    try {
      const lessonPlan = {
        title: quickPlanData.title,
        subject: selectedTopic.subject,
        year_group: selectedTopic.year_group,
        duration_minutes: quickPlanData.duration_minutes,
        lesson_date: quickPlanData.lesson_date,
        learning_objectives: [quickPlanData.learning_objectives],
        curriculum_topic_id: selectedTopic.topic_id,
        school_id: schoolId,
        teacher_id: teacherId,
        status: 'draft' as const,
        activities: JSON.stringify([
          {
            name: 'Starter Activity',
            duration: 10,
            description: 'Quick recap of previous learning'
          },
          {
            name: 'Main Activity',
            duration: 30,
            description: 'Core teaching and learning activities'
          },
          {
            name: 'Plenary',
            duration: 10,
            description: 'Assessment and consolidation'
          }
        ]),
        materials_needed: JSON.stringify(['Whiteboard', 'Student worksheets']),
        assessment_notes: 'Monitor student understanding through questioning and observation',
        homework_assigned: '',
        reflection_notes: ''
      };

      const result = await createLessonPlan(lessonPlan);
      
      if (result) {
        toast({
          title: "Lesson Planned Successfully! 🎯",
          description: `${quickPlanData.title} created and aligned with curriculum coverage`
        });
        
        setIsOpen(false);
        setSelectedTopic(null);
        setQuickPlanData({
          title: '',
          learning_objectives: '',
          duration_minutes: 50,
          lesson_date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error creating quick lesson plan:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <BookOpen className="h-4 w-4" />
          Plan Next Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Lesson Planning - Continue Curriculum Coverage
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Continue These Topics
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {topicContinuations.map((topic) => {
                  const urgency = getUrgencyLevel(topic);
                  return (
                    <Card 
                      key={topic.topic_id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTopic?.topic_id === topic.topic_id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{topic.topic_name}</h4>
                          {urgency === 'critical' && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {topic.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {topic.year_group}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                          <span>Progress: {topic.lessons_completed}/{topic.lessons_planned} lessons</span>
                          <span className={getProgressColor(topic.coverage_percentage)}>
                            {topic.coverage_percentage}%
                          </span>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              topic.coverage_percentage >= 80 ? 'bg-success' :
                              topic.coverage_percentage >= 60 ? 'bg-warning' :
                              topic.coverage_percentage >= 40 ? 'bg-info' : 'bg-destructive'
                            }`}
                            style={{ width: `${topic.coverage_percentage}%` }}
                          />
                        </div>

                        {topic.last_lesson_date && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Last: {new Date(topic.last_lesson_date).toLocaleDateString()}
                          </div>
                        )}

                        {topic.expected_completion && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Due: {new Date(topic.expected_completion).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Planning Form */}
          <div className="space-y-4">
            {selectedTopic ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Plan Details</h3>
                  
                  <div className="p-3 bg-muted rounded-lg mb-4">
                    <h4 className="font-medium text-sm mb-1">{selectedTopic.topic_name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedTopic.framework_alignment}
                    </p>
                    <p className="text-xs">
                      Lesson {selectedTopic.lessons_completed + 1} of {selectedTopic.lessons_planned}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={quickPlanData.title}
                      onChange={(e) => setQuickPlanData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter lesson title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="objectives">Learning Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={quickPlanData.learning_objectives}
                      onChange={(e) => setQuickPlanData(prev => ({ ...prev, learning_objectives: e.target.value }))}
                      placeholder="What will students learn in this lesson?"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Select
                        value={quickPlanData.duration_minutes.toString()}
                        onValueChange={(value) => setQuickPlanData(prev => ({ ...prev, duration_minutes: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="50">50 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">Lesson Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={quickPlanData.lesson_date}
                        onChange={(e) => setQuickPlanData(prev => ({ ...prev, lesson_date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleQuickPlan}
                      disabled={loading || !quickPlanData.title || !quickPlanData.learning_objectives}
                      className="flex-1"
                    >
                      {loading ? 'Creating...' : 'Create Lesson Plan'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a topic to continue planning</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};