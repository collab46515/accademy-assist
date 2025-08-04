import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Calendar, Edit, Copy, Trash2, FileText, Clock, User, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock data interfaces (will be replaced with actual types after migration)
interface CurriculumTopic {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  learning_objectives: string[];
  assessment_criteria: string[];
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  year_group: string;
  form_class?: string;
  lesson_date: string;
  period_id?: string;
  duration_minutes: number;
  status: 'draft' | 'published' | 'completed';
  teacher_name: string;
  curriculum_topic_id?: string;
  curriculum_topic?: CurriculumTopic;
  learning_objectives: string[];
  success_criteria: string[];
  objectives_edited: boolean; // Track if teacher has modified the auto-filled objectives
}

interface LessonPlanFormData {
  title: string;
  subject: string;
  year_group: string;
  form_class?: string;
  lesson_date: string;
  period_id?: string;
  duration_minutes: number;
  curriculum_topic_id?: string;
  learning_objectives: string[];
  success_criteria: string[];
  objectives_edited: boolean;
}

// Mock curriculum topics with learning objectives
const mockCurriculumTopics: CurriculumTopic[] = [
  {
    id: 'topic-1',
    title: 'Recognise equivalent fractions',
    subject: 'Mathematics',
    grade_level: 'Year 7',
    learning_objectives: [
      'I can find fractions that are the same size',
      'I can identify equivalent fractions using visual representations',
      'I can simplify fractions to their lowest terms'
    ],
    assessment_criteria: [
      'I can draw 1/2 and 2/4 and explain why they\'re equal',
      'I can use a fraction wall to find equivalents',
      'I can explain equivalent fractions using real-world examples'
    ]
  },
  {
    id: 'topic-2',
    title: 'Photosynthesis Process',
    subject: 'Science',
    grade_level: 'Year 8',
    learning_objectives: [
      'I can explain the process of photosynthesis',
      'I can identify the key components needed for photosynthesis',
      'I can describe how plants make their own food'
    ],
    assessment_criteria: [
      'I can label the parts of a leaf involved in photosynthesis',
      'I can write the word equation for photosynthesis',
      'I can explain why plants need sunlight, water, and carbon dioxide'
    ]
  },
  {
    id: 'topic-3',
    title: 'Creative Writing - Character Development',
    subject: 'English',
    grade_level: 'Year 7',
    learning_objectives: [
      'I can create believable and interesting characters',
      'I can describe characters using both direct and indirect characterization',
      'I can develop character arcs throughout a story'
    ],
    assessment_criteria: [
      'I can write a character description that brings them to life',
      'I can show character traits through actions and dialogue',
      'I can explain how my character changes in the story'
    ]
  }
];

// Mock data for development
const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    title: 'Introduction to Equivalent Fractions',
    subject: 'Mathematics',
    year_group: 'Year 7',
    form_class: '7A',
    lesson_date: '2024-01-15',
    period_id: 'period-1',
    duration_minutes: 60,
    status: 'published',
    teacher_name: 'Ms. Johnson',
    curriculum_topic_id: 'topic-1',
    curriculum_topic: mockCurriculumTopics[0],
    learning_objectives: [
      'I can find fractions that are the same size',
      'I can identify equivalent fractions using visual representations'
    ],
    success_criteria: [
      'I can draw 1/2 and 2/4 and explain why they\'re equal',
      'I can use a fraction wall to find equivalents'
    ],
    objectives_edited: false
  },
  {
    id: '2',
    title: 'How Plants Make Food',
    subject: 'Science',
    year_group: 'Year 8',
    form_class: '8B',
    lesson_date: '2024-01-16',
    period_id: 'period-2',
    duration_minutes: 45,
    status: 'draft',
    teacher_name: 'Mr. Smith',
    curriculum_topic_id: 'topic-2',
    curriculum_topic: mockCurriculumTopics[1],
    learning_objectives: [
      'I can explain the process of photosynthesis',
      'I can identify the key components needed for photosynthesis'
    ],
    success_criteria: [
      'I can label the parts of a leaf involved in photosynthesis',
      'I can write the word equation for photosynthesis'
    ],
    objectives_edited: true // Teacher has customized the objectives
  }
];

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Music', 'PE'];
const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'];
const formClasses = ['A', 'B', 'C', 'D'];
const periods = [
  { id: 'period-1', name: 'Period 1 (9:00-10:00)' },
  { id: 'period-2', name: 'Period 2 (10:15-11:15)' },
  { id: 'period-3', name: 'Period 3 (11:30-12:30)' },
  { id: 'period-4', name: 'Period 4 (13:30-14:30)' },
  { id: 'period-5', name: 'Period 5 (14:45-15:45)' }
];

interface LessonPlanningProps {
  schoolId: string;
  canEdit?: boolean;
}

export const LessonPlanning: React.FC<LessonPlanningProps> = ({ schoolId, canEdit = true }) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(mockLessonPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<LessonPlanFormData>({
    title: '',
    subject: '',
    year_group: '',
    form_class: '',
    lesson_date: '',
    period_id: '',
    duration_minutes: 60,
    curriculum_topic_id: '',
    learning_objectives: [''],
    success_criteria: [''],
    objectives_edited: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      year_group: '',
      form_class: '',
      lesson_date: '',
      period_id: '',
      duration_minutes: 60,
      curriculum_topic_id: '',
      learning_objectives: [''],
      success_criteria: [''],
      objectives_edited: false
    });
    setEditingPlan(null);
  };

  // Auto-fill objectives when curriculum topic is selected
  const handleCurriculumTopicChange = (topicId: string) => {
    const selectedTopic = mockCurriculumTopics.find(topic => topic.id === topicId);
    
    if (selectedTopic) {
      setFormData(prev => ({
        ...prev,
        curriculum_topic_id: topicId,
        learning_objectives: selectedTopic.learning_objectives,
        success_criteria: selectedTopic.assessment_criteria,
        objectives_edited: false // Reset the edited flag when topic changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        curriculum_topic_id: '',
        learning_objectives: [''],
        success_criteria: [''],
        objectives_edited: false
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlan) {
      // Update existing plan
      setLessonPlans(prev => prev.map(plan => 
        plan.id === editingPlan.id 
          ? { ...plan, ...formData, teacher_name: 'Current User' }
          : plan
      ));
      toast({
        title: "Success",
        description: "Lesson plan updated successfully",
      });
    } else {
      // Create new plan
      const selectedTopic = mockCurriculumTopics.find(topic => topic.id === formData.curriculum_topic_id);
      const newPlan: LessonPlan = {
        id: Date.now().toString(),
        ...formData,
        status: 'draft',
        teacher_name: 'Current User',
        curriculum_topic: selectedTopic
      };
      setLessonPlans(prev => [...prev, newPlan]);
      toast({
        title: "Success",
        description: "Lesson plan created successfully",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      subject: plan.subject,
      year_group: plan.year_group,
      form_class: plan.form_class || '',
      lesson_date: plan.lesson_date,
      period_id: plan.period_id || '',
      duration_minutes: plan.duration_minutes,
      curriculum_topic_id: plan.curriculum_topic_id || '',
      learning_objectives: plan.learning_objectives || [''],
      success_criteria: plan.success_criteria || [''],
      objectives_edited: plan.objectives_edited || false
    });
    setIsDialogOpen(true);
  };

  const handleDuplicate = (plan: LessonPlan) => {
    const duplicatedPlan: LessonPlan = {
      ...plan,
      id: Date.now().toString(),
      title: `${plan.title} (Copy)`,
      status: 'draft'
    };
    setLessonPlans(prev => [...prev, duplicatedPlan]);
    toast({
      title: "Success",
      description: "Lesson plan duplicated successfully",
    });
  };

  const handleDelete = (id: string) => {
    setLessonPlans(prev => prev.filter(plan => plan.id !== id));
    toast({
      title: "Success",
      description: "Lesson plan deleted successfully",
    });
  };

  const filteredPlans = lessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.year_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || plan.subject === filterSubject;
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: [...prev.learning_objectives, ''],
      objectives_edited: true
    }));
  };

  const updateLearningObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.map((obj, i) => i === index ? value : obj),
      objectives_edited: true
    }));
  };

  const removeLearningObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index),
      objectives_edited: true
    }));
  };

  const addSuccessCriteria = () => {
    setFormData(prev => ({
      ...prev,
      success_criteria: [...prev.success_criteria, '']
    }));
  };

  const updateSuccessCriteria = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      success_criteria: prev.success_criteria.map((criteria, i) => i === index ? value : criteria)
    }));
  };

  const removeSuccessCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      success_criteria: prev.success_criteria.filter((_, i) => i !== index)
    }));
  };

  const stats = {
    total: lessonPlans.length,
    draft: lessonPlans.filter(p => p.status === 'draft').length,
    published: lessonPlans.filter(p => p.status === 'published').length,
    completed: lessonPlans.filter(p => p.status === 'completed').length
  };

  // Get available curriculum topics for the selected subject and year group
  const availableTopics = mockCurriculumTopics.filter(topic => 
    (!formData.subject || topic.subject === formData.subject) &&
    (!formData.year_group || topic.grade_level === formData.year_group)
  );

  const selectedTopic = mockCurriculumTopics.find(topic => topic.id === formData.curriculum_topic_id);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-3xl font-bold text-blue-600">{stats.published}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lesson Planning
              </CardTitle>
              <CardDescription>
                Create and manage lesson plans with curriculum alignment
              </CardDescription>
            </div>
            {canEdit && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Lesson Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPlan ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the basic information for your lesson plan
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Lesson Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter lesson title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year_group">Year Group *</Label>
                        <Select value={formData.year_group} onValueChange={(value) => setFormData(prev => ({ ...prev, year_group: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearGroups.map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form_class">Form Class</Label>
                        <Select value={formData.form_class} onValueChange={(value) => setFormData(prev => ({ ...prev, form_class: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {formClasses.map(cls => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration_minutes}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                          min="15"
                          max="120"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lesson_date">Lesson Date *</Label>
                        <Input
                          id="lesson_date"
                          type="date"
                          value={formData.lesson_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, lesson_date: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="period">Period</Label>
                        <Select value={formData.period_id} onValueChange={(value) => setFormData(prev => ({ ...prev, period_id: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            {periods.map(period => (
                              <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="curriculum_topic">Curriculum Topic</Label>
                      <Select 
                        value={formData.curriculum_topic_id} 
                        onValueChange={handleCurriculumTopicChange}
                        disabled={availableTopics.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            availableTopics.length === 0 
                              ? "Select subject and year group first" 
                              : "Select curriculum topic"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTopics.map(topic => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedTopic && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Topic:</strong> {selectedTopic.title}
                        </div>
                      )}
                    </div>

                    {/* Learning Objectives Section */}
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Learning Objectives</Label>
                        {formData.curriculum_topic_id && (
                          <div className="flex items-center gap-2">
                            <Badge variant={formData.objectives_edited ? "secondary" : "default"}>
                              {formData.objectives_edited ? "Customized" : "Auto-filled"}
                            </Badge>
                            {!formData.objectives_edited && selectedTopic && (
                              <div className="text-sm text-muted-foreground">
                                From: {selectedTopic.title}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {formData.curriculum_topic_id && !formData.objectives_edited && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600 mt-1" />
                            <div className="text-sm text-blue-800">
                              <strong>Auto-filled from curriculum:</strong> These objectives are linked to your selected topic. 
                              You can edit them, but the curriculum alignment will be maintained.
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {formData.learning_objectives.map((objective, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={objective}
                              onChange={(e) => updateLearningObjective(index, e.target.value)}
                              placeholder={`Learning objective ${index + 1}`}
                            />
                            {formData.learning_objectives.length > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeLearningObjective(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addLearningObjective}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Learning Objective
                        </Button>
                      </div>
                    </div>

                    {/* Success Criteria Section */}
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Success Criteria (Student-Friendly)</Label>
                        {selectedTopic && (
                          <div className="text-sm text-muted-foreground">
                            Auto-filled from: {selectedTopic.title}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-green-600 mt-1" />
                          <div className="text-sm text-green-800">
                            <strong>Student-friendly language:</strong> Write these as "I can..." statements 
                            that students can understand and self-assess against.
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {formData.success_criteria.map((criteria, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={criteria}
                              onChange={(e) => updateSuccessCriteria(index, e.target.value)}
                              placeholder={`Success criteria ${index + 1} (I can...)`}
                            />
                            {formData.success_criteria.length > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeSuccessCriteria(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addSuccessCriteria}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Success Criteria
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingPlan ? 'Update' : 'Create'} Lesson Plan
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lesson plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lesson Plans Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Curriculum Topic</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Teacher</TableHead>
                  {canEdit && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No lesson plans found</p>
                          {canEdit && (
                            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                              Create your first lesson plan
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.title}</TableCell>
                      <TableCell>{plan.subject}</TableCell>
                      <TableCell>{plan.year_group}{plan.form_class ? ` ${plan.form_class}` : ''}</TableCell>
                      <TableCell>{format(new Date(plan.lesson_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {plan.curriculum_topic?.title || 'No topic selected'}
                          </div>
                          {plan.objectives_edited && (
                            <Badge variant="secondary" className="text-xs">
                              Customized
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {plan.duration_minutes}min
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            plan.status === 'completed' ? 'default' :
                            plan.status === 'published' ? 'secondary' : 'outline'
                          }
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {plan.teacher_name}
                        </div>
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDuplicate(plan)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};