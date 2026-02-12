import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAssignmentData, Assignment } from '@/hooks/useAssignmentData';
import { useCurriculumData } from '@/hooks/useCurriculumData';
import { useLessonPlanningData } from '@/hooks/useLessonPlanningData';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Lightbulb, Target } from 'lucide-react';

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAssignmentDialog: React.FC<CreateAssignmentDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { createAssignment } = useAssignmentData();
  const { frameworks, topics, fetchTopics } = useCurriculumData();
  const { lessonPlans } = useLessonPlanningData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);
  const [showLessonPlans, setShowLessonPlans] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    due_date: '',
    total_marks: 10,
    assignment_type: 'homework' as Assignment['assignment_type'],
    curriculum_topic_id: '',
    lesson_plan_id: '',
    subject: '',
    year_group: '',
    submission_type: 'both' as Assignment['submission_type'],
    allow_late_submissions: true,
    late_penalty_percentage: 10,
    status: 'draft' as Assignment['status']
  });

  // Load curriculum topics when subject/year changes
  useEffect(() => {
    if (formData.subject && formData.year_group) {
      // Mock curriculum topics - in real app, fetch from curriculum_topics table
      const mockTopics = [
        { id: 'fractions-equiv', name: 'Recognise equivalent fractions', subject: 'Mathematics', year_group: 'Year 4' },
        { id: 'fractions-add', name: 'Add and subtract fractions', subject: 'Mathematics', year_group: 'Year 4' },
        { id: 'place-value', name: 'Place value and number', subject: 'Mathematics', year_group: 'Year 4' },
        { id: 'photosynthesis', name: 'Photosynthesis in plants', subject: 'Science', year_group: 'Year 7' },
        { id: 'ecosystems', name: 'Ecosystems and food chains', subject: 'Science', year_group: 'Year 7' },
        { id: 'creative-writing', name: 'Creative writing techniques', subject: 'English', year_group: 'Year 6' },
        { id: 'shakespeare', name: 'Shakespeare - Romeo and Juliet', subject: 'English', year_group: 'Year 9' },
        { id: 'world-war', name: 'World War II and its impact', subject: 'History', year_group: 'Year 8' }
      ];
      
      const filteredTopics = mockTopics.filter(t => 
        t.subject === formData.subject && t.year_group === formData.year_group
      );
      setAvailableTopics(filteredTopics);
    } else {
      setAvailableTopics([]);
    }
  }, [formData.subject, formData.year_group]);

  // Load related lesson plans when topic changes
  useEffect(() => {
    if (formData.curriculum_topic_id) {
      const relatedLessons = lessonPlans.filter(l => 
        l.curriculum_topic_id === formData.curriculum_topic_id
      );
      setAvailableLessons(relatedLessons);
    } else {
      setAvailableLessons([]);
    }
  }, [formData.curriculum_topic_id, lessonPlans]);

  // Create from lesson plan
  const createFromLessonPlan = (lessonPlan: any) => {
    setFormData(prev => ({
      ...prev,
      title: `${lessonPlan.title} - Assignment`,
      description: `Follow up assignment for: ${lessonPlan.title}`,
      instructions: lessonPlan.learning_objectives?.join('\n') || '',
      lesson_plan_id: lessonPlan.id,
      subject: lessonPlan.subject,
      year_group: lessonPlan.year_group,
      curriculum_topic_id: lessonPlan.curriculum_topic_id || ''
    }));
    setShowLessonPlans(false);
    toast({
      title: "Template Applied",
      description: "Assignment details filled from lesson plan"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.due_date || !formData.subject || !formData.year_group) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createAssignment({
        ...formData,
        curriculum_topic_id: formData.curriculum_topic_id || undefined,
        lesson_plan_id: formData.lesson_plan_id || undefined,
        instructions: formData.instructions || undefined,
      });
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        due_date: '',
        total_marks: 10,
        assignment_type: 'homework',
        curriculum_topic_id: '',
        lesson_plan_id: '',
        subject: '',
        year_group: '',
        submission_type: 'both',
        allow_late_submissions: true,
        late_penalty_percentage: 10,
        status: 'draft'
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Art', 'Music', 'Physical Education', 'Computing', 'Languages'
  ];

  const yearGroups = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 
    'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 
    'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment or homework for your students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLessonPlans(!showLessonPlans)}
              className="gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Create from Lesson Plan
            </Button>
          </div>

          {/* Lesson Plan Selector */}
          {showLessonPlans && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Select a Lesson Plan Template
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {lessonPlans.slice(0, 6).map((lesson) => (
                  <div key={lesson.id} className="border rounded p-3 bg-background">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{lesson.title}</h5>
                        <p className="text-xs text-muted-foreground">
                          {lesson.subject} • {lesson.year_group}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => createFromLessonPlan(lesson)}
                      >
                        Use
                      </Button>
                    </div>
                    {lesson.learning_objectives && (
                      <div className="text-xs text-muted-foreground">
                        <Target className="h-3 w-3 inline mr-1" />
                        {lesson.learning_objectives.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Assignment title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignment_type">Type</Label>
                <Select 
                  value={formData.assignment_type}
                  onValueChange={(value: Assignment['assignment_type']) => 
                    setFormData(prev => ({ ...prev, assignment_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="classwork">Classwork</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assignment"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Detailed instructions for students"
                rows={4}
              />
            </div>
          </div>

          {/* Curriculum Integration */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Curriculum Links
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select 
                  value={formData.subject}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year_group">Year Group *</Label>
                <Select 
                  value={formData.year_group}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, year_group: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearGroups.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Curriculum Topic Selector */}
            {availableTopics.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="curriculum_topic_id">Curriculum Topic (Optional)</Label>
                <Select 
                  value={formData.curriculum_topic_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, curriculum_topic_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to curriculum topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.curriculum_topic_id && (
                  <Badge variant="secondary" className="mt-2">
                    <Target className="h-3 w-3 mr-1" />
                    Linked to curriculum
                  </Badge>
                )}
              </div>
            )}

            {/* Related Lesson Plans */}
            {availableLessons.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="lesson_plan_id">Related Lesson Plan (Optional)</Label>
                <Select 
                  value={formData.lesson_plan_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, lesson_plan_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to lesson plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.lesson_plan_id && (
                  <Badge variant="secondary" className="mt-2">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Linked to lesson plan
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_marks">Total Marks</Label>
              <Input
                id="total_marks"
                type="number"
                min="1"
                value={formData.total_marks}
                onChange={(e) => setFormData(prev => ({ ...prev, total_marks: parseInt(e.target.value) || 10 }))}
              />
            </div>
          </div>

          {/* Submission Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submission_type">Submission Type</Label>
              <Select 
                value={formData.submission_type}
                onValueChange={(value: Assignment['submission_type']) => 
                  setFormData(prev => ({ ...prev, submission_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file_upload">File Upload Only</SelectItem>
                  <SelectItem value="text_entry">Text Entry Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow_late">Allow Late Submissions</Label>
                <p className="text-sm text-muted-foreground">
                  Students can submit after the due date
                </p>
              </div>
              <Switch
                id="allow_late"
                checked={formData.allow_late_submissions}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, allow_late_submissions: checked }))
                }
              />
            </div>

            {formData.allow_late_submissions && (
              <div className="space-y-2">
                <Label htmlFor="late_penalty">Late Penalty (%)</Label>
                <Input
                  id="late_penalty"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.late_penalty_percentage}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    late_penalty_percentage: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status}
              onValueChange={(value: Assignment['status']) => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};