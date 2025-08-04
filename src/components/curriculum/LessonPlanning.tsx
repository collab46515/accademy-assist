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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Calendar, Edit, Copy, Trash2, FileText, Clock, User, BookOpen, ChevronDown, Upload, Paperclip, Play, Pause, RotateCcw } from 'lucide-react';
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

// Enhanced lesson structure interfaces
interface LessonSection {
  id: string;
  title: string;
  content: string;
  duration_minutes: number;
  suggested_min: number;
  suggested_max: number;
  attachments: LessonAttachment[];
  icon: string;
  description: string;
}

interface LessonAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface LessonResources {
  materials_list: string[];
  digital_resources: DigitalResource[];
  file_attachments: LessonAttachment[];
  tech_requirements: string[];
  shared_with_students: boolean;
}

interface DigitalResource {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'google_slides' | 'pdf' | 'website' | 'other';
  description?: string;
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
  objectives_edited: boolean;
  lesson_sections: LessonSection[];
  resources: LessonResources;
  total_planned_time: number;
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
  lesson_sections: LessonSection[];
  resources: LessonResources;
}

// Default resources template
const createDefaultResources = (): LessonResources => ({
  materials_list: [],
  digital_resources: [],
  file_attachments: [],
  tech_requirements: [],
  shared_with_students: false
});

// Default lesson structure template
const createDefaultLessonSections = (): LessonSection[] => [
  {
    id: 'hook',
    title: 'Hook',
    content: '',
    duration_minutes: 8,
    suggested_min: 5,
    suggested_max: 10,
    attachments: [],
    icon: '🎯',
    description: 'Grab attention: question, video, quick quiz'
  },
  {
    id: 'main-activities',
    title: 'Main Activities', 
    content: '',
    duration_minutes: 25,
    suggested_min: 20,
    suggested_max: 30,
    attachments: [],
    icon: '📘',
    description: 'Teaching + student practice (step-by-step)'
  },
  {
    id: 'assessment',
    title: 'Assessment for Learning (AfL)',
    content: '',
    duration_minutes: 5,
    suggested_min: 3,
    suggested_max: 8,
    attachments: [],
    icon: '✅',
    description: 'How will you know they learned it? (e.g., thumbs up, exit ticket)'
  },
  {
    id: 'closure',
    title: 'Closure',
    content: '',
    duration_minutes: 5,
    suggested_min: 3,
    suggested_max: 7,
    attachments: [],
    icon: '🔚',
    description: 'Summarize, connect, preview next lesson'
  }
];

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

// Enhanced mock data with lesson sections
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
    objectives_edited: false,
    lesson_sections: [
      {
        id: 'hook',
        title: 'Hook',
        content: 'Show students pizza slices - half a pizza vs 2/4 of a pizza. Ask: "Which would you rather have?" Discuss their reasoning.',
        duration_minutes: 8,
        suggested_min: 5,
        suggested_max: 10,
        attachments: [{id: '1', name: 'pizza-fractions.jpg', url: '', type: 'image', size: 245760}],
        icon: '🎯',
        description: 'Grab attention: question, video, quick quiz'
      },
      {
        id: 'main-activities',
        title: 'Main Activities',
        content: '1. Demonstrate with fraction walls\n2. Students work in pairs with manipulatives\n3. Practice exercises on worksheets',
        duration_minutes: 30,
        suggested_min: 20,
        suggested_max: 30,
        attachments: [{id: '2', name: 'fraction-wall-worksheet.pdf', url: '', type: 'pdf', size: 512000}],
        icon: '📘',
        description: 'Teaching + student practice (step-by-step)'
      },
      {
        id: 'assessment',
        title: 'Assessment for Learning (AfL)',
        content: 'Exit ticket: Draw two equivalent fractions and explain why they are equal.',
        duration_minutes: 7,
        suggested_min: 3,
        suggested_max: 8,
        attachments: [],
        icon: '✅',
        description: 'How will you know they learned it?'
      },
      {
        id: 'closure',
        title: 'Closure',
        content: 'Recap key points about equivalent fractions. Preview tomorrow\'s lesson on simplifying fractions.',
        duration_minutes: 5,
        suggested_min: 3,
        suggested_max: 7,
        attachments: [],
        icon: '🔚',
        description: 'Summarize, connect, preview next lesson'
      }
    ],
    resources: {
      materials_list: ['Whiteboards', 'Fraction manipulatives', 'Pizza slice models'],
      digital_resources: [
        {
          id: '1',
          title: 'Equivalent Fractions Video',
          url: 'https://youtube.com/watch?v=example',
          type: 'youtube',
          description: 'Visual explanation of equivalent fractions'
        }
      ],
      file_attachments: [],
      tech_requirements: ['Projector', 'Document camera'],
      shared_with_students: true
    },
    total_planned_time: 50
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
  const [expandedSections, setExpandedSections] = useState<string[]>(['hook']);
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
    objectives_edited: false,
    lesson_sections: createDefaultLessonSections(),
    resources: createDefaultResources()
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
      objectives_edited: false,
      lesson_sections: createDefaultLessonSections(),
      resources: createDefaultResources()
    });
    setExpandedSections(['hook']);
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
        curriculum_topic: selectedTopic,
        total_planned_time: totalPlannedTime
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
      objectives_edited: plan.objectives_edited || false,
      lesson_sections: plan.lesson_sections || createDefaultLessonSections(),
      resources: plan.resources || createDefaultResources()
    });
    setExpandedSections(['hook']);
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

  // Lesson section management
  const updateLessonSection = (sectionId: string, field: keyof LessonSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      lesson_sections: prev.lesson_sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleFileUpload = async (sectionId: string, file: File) => {
    // Mock file upload - in real implementation, upload to Supabase storage
    const mockAttachment: LessonAttachment = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size
    };

    updateLessonSection(sectionId, 'attachments', [
      ...formData.lesson_sections.find(s => s.id === sectionId)?.attachments || [],
      mockAttachment
    ]);

    toast({
      title: "File uploaded",
      description: `${file.name} has been attached to ${formData.lesson_sections.find(s => s.id === sectionId)?.title}`,
    });
  };

  const removeAttachment = (sectionId: string, attachmentId: string) => {
    const section = formData.lesson_sections.find(s => s.id === sectionId);
    if (section) {
      updateLessonSection(sectionId, 'attachments', 
        section.attachments.filter(att => att.id !== attachmentId)
      );
    }
  };

  // Calculate total planned time
  const totalPlannedTime = formData.lesson_sections.reduce((total, section) => total + section.duration_minutes, 0);
  const timeVariance = totalPlannedTime - formData.duration_minutes;

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
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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

                    {/* Lesson Structure Section */}
                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-lg font-semibold">Lesson Structure</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Organize your lesson into timed sections for better flow and time management
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            Total: {totalPlannedTime} min
                          </div>
                          <div className={`text-sm ${timeVariance > 0 ? 'text-red-600' : timeVariance < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                            {timeVariance > 0 ? `+${timeVariance} min over` : 
                             timeVariance < 0 ? `${Math.abs(timeVariance)} min under` : 
                             'Perfect timing!'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {formData.lesson_sections.map((section, sectionIndex) => (
                          <div key={section.id} className="border rounded-lg overflow-hidden">
                            <Collapsible 
                              open={expandedSections.includes(section.id)}
                              onOpenChange={() => toggleSectionExpanded(section.id)}
                            >
                              <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{section.icon}</span>
                                    <div className="text-left">
                                      <div className="font-medium">{section.title}</div>
                                      <div className="text-sm text-muted-foreground">{section.description}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="font-medium">{section.duration_minutes} min</div>
                                      <div className="text-sm text-muted-foreground">
                                        Suggested: {section.suggested_min}-{section.suggested_max} min
                                      </div>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${
                                      expandedSections.includes(section.id) ? 'rotate-180' : ''
                                    }`} />
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent className="border-t bg-muted/20">
                                <div className="p-4 space-y-4">
                                  {/* Time allocation */}
                                  <div className="flex items-center gap-4">
                                    <Label className="flex items-center gap-2 min-w-fit">
                                      <Clock className="h-4 w-4" />
                                      Duration (minutes)
                                    </Label>
                                    <Input
                                      type="number"
                                      value={section.duration_minutes}
                                      onChange={(e) => updateLessonSection(section.id, 'duration_minutes', parseInt(e.target.value) || 0)}
                                      min={1}
                                      max={60}
                                      className="w-24"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      Suggested: {section.suggested_min}-{section.suggested_max} minutes
                                    </span>
                                  </div>

                                  {/* Content editor */}
                                  <div className="space-y-2">
                                    <Label>Section Content</Label>
                                    <Textarea
                                      value={section.content}
                                      onChange={(e) => updateLessonSection(section.id, 'content', e.target.value)}
                                      placeholder={`Describe your ${section.title.toLowerCase()} activities...`}
                                      className="min-h-24"
                                    />
                                  </div>

                                  {/* File attachments */}
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                      <Paperclip className="h-4 w-4" />
                                      Attachments
                                    </Label>
                                    
                                    {/* Existing attachments */}
                                    {section.attachments.length > 0 && (
                                      <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                                        {section.attachments.map((attachment) => (
                                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-background rounded border">
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-4 w-4" />
                                              <span className="text-sm">{attachment.name}</span>
                                              <span className="text-xs text-muted-foreground">
                                                ({Math.round(attachment.size / 1024)} KB)
                                              </span>
                                            </div>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeAttachment(section.id, attachment.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Upload button */}
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = 'image/*,application/pdf,.doc,.docx,.ppt,.pptx';
                                          input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) handleFileUpload(section.id, file);
                                          };
                                          input.click();
                                        }}
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Add File
                                      </Button>
                                      <span className="text-xs text-muted-foreground">
                                        Images, PDFs, Word docs, PowerPoints
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ))}
                      </div>

                      {/* Time summary */}
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span>Lesson Duration:</span>
                          <span className="font-medium">{formData.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Planned Activities:</span>
                          <span className="font-medium">{totalPlannedTime} minutes</span>
                        </div>
                        <div className={`flex items-center justify-between text-sm font-medium ${
                          timeVariance > 0 ? 'text-red-600' : timeVariance < 0 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          <span>Difference:</span>
                          <span>
                            {timeVariance > 0 ? `+${timeVariance} min (over)` : 
                             timeVariance < 0 ? `${timeVariance} min (under)` : 
                             'Perfect match!'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resources & Materials Section */}
                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-lg font-semibold">📎 Resources & Materials</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add all materials, digital resources, and tech requirements for this lesson
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="shared-with-students" className="text-sm">Share with students:</Label>
                          <input
                            type="checkbox"
                            id="shared-with-students"
                            checked={formData.resources.shared_with_students}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              resources: {
                                ...prev.resources,
                                shared_with_students: e.target.checked
                              }
                            }))}
                            className="rounded border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Materials List */}
                        <div className="space-y-3">
                          <Label className="text-base font-medium">Physical Materials</Label>
                          <div className="space-y-2">
                            {formData.resources.materials_list.map((material, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={material}
                                  onChange={(e) => {
                                    const newMaterials = [...formData.resources.materials_list];
                                    newMaterials[index] = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        materials_list: newMaterials
                                      }
                                    }));
                                  }}
                                  placeholder="e.g., Whiteboards, Scissors, Lab equipment"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newMaterials = formData.resources.materials_list.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        materials_list: newMaterials
                                      }
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                resources: {
                                  ...prev.resources,
                                  materials_list: [...prev.resources.materials_list, '']
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Material
                            </Button>
                          </div>
                        </div>

                        {/* Tech Requirements */}
                        <div className="space-y-3">
                          <Label className="text-base font-medium">Tech Requirements</Label>
                          <div className="space-y-2">
                            {formData.resources.tech_requirements.map((tech, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={tech}
                                  onChange={(e) => {
                                    const newTech = [...formData.resources.tech_requirements];
                                    newTech[index] = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        tech_requirements: newTech
                                      }
                                    }));
                                  }}
                                  placeholder="e.g., Chromebooks, Projector required"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newTech = formData.resources.tech_requirements.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        tech_requirements: newTech
                                      }
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                resources: {
                                  ...prev.resources,
                                  tech_requirements: [...prev.resources.tech_requirements, '']
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Requirement
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Digital Resources */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Digital Resources</Label>
                        <div className="space-y-3">
                          {formData.resources.digital_resources.map((resource, index) => (
                            <div key={resource.id} className="p-4 border rounded-lg space-y-3">
                              <div className="grid gap-3 md:grid-cols-3">
                                <Input
                                  value={resource.title}
                                  onChange={(e) => {
                                    const newResources = [...formData.resources.digital_resources];
                                    newResources[index] = { ...newResources[index], title: e.target.value };
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        digital_resources: newResources
                                      }
                                    }));
                                  }}
                                  placeholder="Resource title"
                                />
                                <Select
                                  value={resource.type}
                                  onValueChange={(value: any) => {
                                    const newResources = [...formData.resources.digital_resources];
                                    newResources[index] = { ...newResources[index], type: value };
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        digital_resources: newResources
                                      }
                                    }));
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="youtube">YouTube</SelectItem>
                                    <SelectItem value="google_slides">Google Slides</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newResources = formData.resources.digital_resources.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        digital_resources: newResources
                                      }
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <Input
                                  value={resource.url}
                                  onChange={(e) => {
                                    const newResources = [...formData.resources.digital_resources];
                                    newResources[index] = { ...newResources[index], url: e.target.value };
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        digital_resources: newResources
                                      }
                                    }));
                                  }}
                                  placeholder="URL"
                                />
                                <Input
                                  value={resource.description || ''}
                                  onChange={(e) => {
                                    const newResources = [...formData.resources.digital_resources];
                                    newResources[index] = { ...newResources[index], description: e.target.value };
                                    setFormData(prev => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        digital_resources: newResources
                                      }
                                    }));
                                  }}
                                  placeholder="Description (optional)"
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              resources: {
                                ...prev.resources,
                                digital_resources: [
                                  ...prev.resources.digital_resources,
                                  {
                                    id: Date.now().toString(),
                                    title: '',
                                    url: '',
                                    type: 'website',
                                    description: ''
                                  }
                                ]
                              }
                            }))}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Digital Resource
                          </Button>
                        </div>
                      </div>

                      {/* File Attachments */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">File Attachments</Label>
                        <div className="space-y-3">
                          {formData.resources.file_attachments.length > 0 && (
                            <div className="space-y-2">
                              {formData.resources.file_attachments.map((file, index) => (
                                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium text-sm">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {file.type} • {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newFiles = formData.resources.file_attachments.filter((_, i) => i !== index);
                                      setFormData(prev => ({
                                        ...prev,
                                        resources: {
                                          ...prev.resources,
                                          file_attachments: newFiles
                                        }
                                      }));
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif';
                                input.multiple = true;
                                input.onchange = (e) => {
                                  const files = Array.from((e.target as HTMLInputElement).files || []);
                                  const newAttachments = files.map(file => ({
                                    id: Date.now().toString() + Math.random(),
                                    name: file.name,
                                    url: '', // Would be set after upload
                                    type: file.type,
                                    size: file.size
                                  }));
                                  setFormData(prev => ({
                                    ...prev,
                                    resources: {
                                      ...prev.resources,
                                      file_attachments: [...prev.resources.file_attachments, ...newAttachments]
                                    }
                                  }));
                                  toast({
                                    title: "Files added",
                                    description: `${files.length} file(s) added to resources`
                                  });
                                };
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Files
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Worksheets, PPTs, rubrics, etc.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
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
                          <div className="flex items-center gap-2">
                            {plan.objectives_edited && (
                              <Badge variant="secondary" className="text-xs">
                                Customized
                              </Badge>
                            )}
                            {plan.lesson_sections && (
                              <Badge variant="outline" className="text-xs">
                                {plan.lesson_sections.filter(s => s.content.trim()).length}/{plan.lesson_sections.length} sections planned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <div className="text-sm">
                            <div>{plan.duration_minutes}min</div>
                            {plan.total_planned_time && (
                              <div className={`text-xs ${
                                plan.total_planned_time > plan.duration_minutes ? 'text-red-600' : 
                                plan.total_planned_time < plan.duration_minutes ? 'text-blue-600' : 'text-green-600'
                              }`}>
                                ({plan.total_planned_time}min planned)
                              </div>
                            )}
                          </div>
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