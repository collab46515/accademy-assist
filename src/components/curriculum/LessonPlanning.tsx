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
import { Plus, Search, Calendar, Edit, Copy, Trash2, FileText, Clock, User, BookOpen, ChevronDown, Upload, Paperclip, Play, Pause, RotateCcw, Share2, Users, Link, Zap, BarChart3, TrendingUp, X } from 'lucide-react';
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

interface AssessmentMethod {
  id: string;
  type: 'formative' | 'summative';
  method: string;
  description: string;
  rubric_url?: string;
  links_to_gradebook: boolean;
  skills_assessed: string[];
}

interface LessonAssessment {
  formative: AssessmentMethod[];
  summative: AssessmentMethod[];
  skills_assessed: string[];
  rubrics: {
    id: string;
    name: string;
    url: string;
    type: 'attached' | 'linked';
  }[];
}

interface LessonTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  usage_count: number;
  created_by: string;
  is_public: boolean;
  tags: string[];
}

interface LessonCollaboration {
  shared_with: {
    user_id: string;
    name: string;
    role: 'hod' | 'ta' | 'co_teacher';
    permission: 'view' | 'edit';
  }[];
  created_by: string;
  last_modified_by: string;
  modification_history: {
    user_id: string;
    timestamp: string;
    changes: string;
  }[];
}

interface LessonSequence {
  is_part_of_sequence: boolean;
  sequence_id?: string;
  sequence_title?: string;
  lesson_number?: number;
  total_lessons?: number;
  previous_lesson_id?: string;
  next_lesson_id?: string;
  sequence_description?: string;
}

interface LessonIntegration {
  timetable_entry_id?: string;
  class_id?: string;
  period_info?: {
    day: string;
    time: string;
    duration: number;
    room: string;
  };
  auto_assignment?: {
    enabled: boolean;
    title: string;
    due_date: string;
    description: string;
  };
}

interface LessonDifferentiation {
  support: string[];
  challenge: string[];
  sen: string[];
  eal: string[];
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
  differentiation: LessonDifferentiation;
  assessment: LessonAssessment;
  collaboration: LessonCollaboration;
  sequence: LessonSequence;
  integration: LessonIntegration;
  total_planned_time: number;
  post_lesson_reflection?: PostLessonReflection;
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
  differentiation: LessonDifferentiation;
  assessment: LessonAssessment;
  collaboration: LessonCollaboration;
  sequence: LessonSequence;
  integration: LessonIntegration;
  status: 'draft' | 'completed';
  post_lesson_reflection?: PostLessonReflection;
}

// Post-lesson reflection for professional growth
interface PostLessonReflection {
  completed_at?: string;
  completed_by?: string;
  actual_duration_minutes?: number;
  reflection_notes: string;
  student_feedback?: string;
  next_steps: string[];
  what_worked_well: string[];
  areas_for_improvement: string[];
  student_engagement_rating: number; // 1-5 scale
  learning_objectives_met: boolean[];
  would_teach_again: boolean;
  modifications_for_next_time: string;
}
const createDefaultCollaboration = (): LessonCollaboration => ({
  shared_with: [],
  created_by: 'current-user-id',
  last_modified_by: 'current-user-id',
  modification_history: []
});

// Default post-lesson reflection
const createDefaultPostLessonReflection = (): PostLessonReflection => ({
  reflection_notes: '',
  student_feedback: '',
  next_steps: [''],
  what_worked_well: [''],
  areas_for_improvement: [''],
  student_engagement_rating: 3,
  learning_objectives_met: [],
  would_teach_again: true,
  modifications_for_next_time: ''
});

// Default sequence template
const createDefaultSequence = (): LessonSequence => ({
  is_part_of_sequence: false
});

// Default integration template
const createDefaultIntegration = (): LessonIntegration => ({
  auto_assignment: {
    enabled: false,
    title: '',
    due_date: '',
    description: ''
  }
});

// Default assessment template
const createDefaultAssessment = (): LessonAssessment => ({
  formative: [],
  summative: [],
  skills_assessed: [],
  rubrics: []
});

// Default differentiation template
const createDefaultDifferentiation = (): LessonDifferentiation => ({
  support: [],
  challenge: [],
  sen: [],
  eal: []
});

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
    differentiation: {
      support: ['Use fraction tiles', 'Pair with buddy'],
      challenge: ['Find 3 fractions = 3/6', 'Create your own equivalent fraction problem'],
      sen: ['Use visual schedule', 'Reduce task size to 3 problems'],
      eal: ['Use bilingual glossary', 'Pair with fluent speaker']
    },
    assessment: {
      formative: [
        {
          id: '1',
          type: 'formative',
          method: 'Exit ticket',
          description: 'Draw two equivalent fractions and explain why they are equal',
          links_to_gradebook: false,
          skills_assessed: ['Understanding equivalent fractions', 'Mathematical reasoning']
        }
      ],
      summative: [],
      skills_assessed: ['Number sense', 'Fraction understanding', 'Mathematical communication'],
      rubrics: []
    },
    collaboration: createDefaultCollaboration(),
    sequence: {
      is_part_of_sequence: true,
      sequence_id: 'seq-fractions-101',
      sequence_title: 'Introduction to Fractions',
      lesson_number: 2,
      total_lessons: 4,
      sequence_description: 'Complete introduction to fraction concepts and operations'
    },
    integration: {
      timetable_entry_id: 'tt-001',
      class_id: 'class-7a',
      period_info: {
        day: 'Monday',
        time: '10:00',
        duration: 50,
        room: 'Room 12'
      },
      auto_assignment: {
        enabled: true,
        title: 'Equivalent Fractions Practice',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Complete worksheet on equivalent fractions'
      }
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
    resources: createDefaultResources(),
    differentiation: createDefaultDifferentiation(),
    assessment: createDefaultAssessment(),
    collaboration: createDefaultCollaboration(),
    sequence: createDefaultSequence(),
    integration: createDefaultIntegration(),
    status: 'draft',
    post_lesson_reflection: createDefaultPostLessonReflection()
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
      resources: createDefaultResources(),
      differentiation: createDefaultDifferentiation(),
      assessment: createDefaultAssessment(),
      collaboration: createDefaultCollaboration(),
      sequence: createDefaultSequence(),
      integration: createDefaultIntegration(),
      status: 'draft',
      post_lesson_reflection: createDefaultPostLessonReflection()
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
      resources: plan.resources || createDefaultResources(),
      differentiation: plan.differentiation || createDefaultDifferentiation(),
      assessment: plan.assessment || createDefaultAssessment(),
      collaboration: plan.collaboration || createDefaultCollaboration(),
      sequence: plan.sequence || createDefaultSequence(),
      integration: plan.integration || createDefaultIntegration(),
      status: 'draft',
      post_lesson_reflection: plan.post_lesson_reflection || createDefaultPostLessonReflection()
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

                    {/* Differentiation & Accessibility Section */}
                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-lg font-semibold">🎯 Differentiation & Accessibility</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ensure inclusive planning for all learners with targeted support and challenges
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Support Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">S</span>
                            </div>
                            <div>
                              <Label className="text-base font-medium">Support</Label>
                              <p className="text-sm text-muted-foreground">For students who need extra help</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {formData.differentiation.support.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={item}
                                  onChange={(e) => {
                                    const newSupport = [...formData.differentiation.support];
                                    newSupport[index] = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        support: newSupport
                                      }
                                    }));
                                  }}
                                  placeholder="e.g., Use fraction tiles, Pair with buddy, Extra time"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSupport = formData.differentiation.support.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        support: newSupport
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
                                differentiation: {
                                  ...prev.differentiation,
                                  support: [...prev.differentiation.support, '']
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Support Strategy
                            </Button>
                          </div>
                        </div>

                        {/* Challenge Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">C</span>
                            </div>
                            <div>
                              <Label className="text-base font-medium">Challenge</Label>
                              <p className="text-sm text-muted-foreground">For students who need extension</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {formData.differentiation.challenge.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={item}
                                  onChange={(e) => {
                                    const newChallenge = [...formData.differentiation.challenge];
                                    newChallenge[index] = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        challenge: newChallenge
                                      }
                                    }));
                                  }}
                                  placeholder="e.g., Find 3 fractions = 3/6, Create your own"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newChallenge = formData.differentiation.challenge.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        challenge: newChallenge
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
                                differentiation: {
                                  ...prev.differentiation,
                                  challenge: [...prev.differentiation.challenge, '']
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Challenge Activity
                            </Button>
                          </div>
                        </div>

                        {/* SEN Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold text-sm">SEN</span>
                            </div>
                            <div>
                              <Label className="text-base font-medium">Special Educational Needs</Label>
                              <p className="text-sm text-muted-foreground">Specific accommodations and adaptations</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {formData.differentiation.sen.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={item}
                                  onChange={(e) => {
                                    const newSen = [...formData.differentiation.sen];
                                    newSen[index] = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        sen: newSen
                                      }
                                    }));
                                  }}
                                  placeholder="e.g., Use visual schedule, Reduce task size"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newSen = formData.differentiation.sen.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        sen: newSen
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
                                differentiation: {
                                  ...prev.differentiation,
                                  sen: [...prev.differentiation.sen, '']
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add SEN Support
                            </Button>
                          </div>
                        </div>

                        {/* EAL Section */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-sm">EAL</span>
                            </div>
                            <div>
                              <Label className="text-base font-medium">English as Additional Language</Label>
                              <p className="text-sm text-muted-foreground">Language support and scaffolding</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {formData.differentiation.eal.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={item}
                                  onChange={(e) => {
                                    const newEal = [...formData.differentiation.eal];
                                    newEal[index] = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        eal: newEal
                                      }
                                    }));
                                  }}
                                  placeholder="e.g., Use bilingual glossary, Pair with fluent speaker"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newEal = formData.differentiation.eal.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                      ...prev,
                                      differentiation: {
                                        ...prev.differentiation,
                                        eal: newEal
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
                                differentiation: {
                                  ...prev.differentiation,
                                  eal: [...prev.differentiation.eal, '']
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add EAL Support
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Differentiation Summary */}
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Inclusive Planning Summary:</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-bold">S</span>
                            </div>
                            <span>{formData.differentiation.support.filter(s => s.trim()).length} Support strategies</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-xs font-bold">C</span>
                            </div>
                            <span>{formData.differentiation.challenge.filter(c => c.trim()).length} Challenge activities</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-xs font-bold">SEN</span>
                            </div>
                            <span>{formData.differentiation.sen.filter(s => s.trim()).length} SEN accommodations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-xs font-bold">EAL</span>
                            </div>
                            <span>{formData.differentiation.eal.filter(e => e.trim()).length} EAL supports</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Methods Section */}
                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-lg font-semibold">📊 Assessment Methods</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Plan how you'll assess student learning and track progress
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Formative Assessment */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">F</span>
                            </div>
                            <div>
                              <Label className="text-base font-medium">Formative Assessment</Label>
                              <p className="text-sm text-muted-foreground">Ongoing feedback during learning</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {formData.assessment.formative.map((assessment, index) => (
                              <div key={assessment.id} className="p-4 border rounded-lg space-y-3">
                                <div className="grid gap-3 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm">Method</Label>
                                    <select
                                      value={assessment.method}
                                      onChange={(e) => {
                                        const newFormative = [...formData.assessment.formative];
                                        newFormative[index] = { ...newFormative[index], method: e.target.value };
                                        setFormData(prev => ({
                                          ...prev,
                                          assessment: {
                                            ...prev.assessment,
                                            formative: newFormative
                                          }
                                        }));
                                      }}
                                      className="w-full p-2 border rounded-md text-sm"
                                    >
                                      <option value="">Select method</option>
                                      <option value="Exit ticket">Exit ticket</option>
                                      <option value="Questioning">Questioning</option>
                                      <option value="Observation checklist">Observation checklist</option>
                                      <option value="Thumbs up/down">Thumbs up/down</option>
                                      <option value="Mini whiteboard">Mini whiteboard</option>
                                      <option value="Peer assessment">Peer assessment</option>
                                      <option value="Self-assessment">Self-assessment</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`gradebook-${assessment.id}`}
                                      checked={assessment.links_to_gradebook}
                                      onChange={(e) => {
                                        const newFormative = [...formData.assessment.formative];
                                        newFormative[index] = { ...newFormative[index], links_to_gradebook: e.target.checked };
                                        setFormData(prev => ({
                                          ...prev,
                                          assessment: {
                                            ...prev.assessment,
                                            formative: newFormative
                                          }
                                        }));
                                      }}
                                      className="rounded"
                                    />
                                    <Label htmlFor={`gradebook-${assessment.id}`} className="text-sm">Link to Gradebook</Label>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm">Description</Label>
                                  <Textarea
                                    value={assessment.description}
                                    onChange={(e) => {
                                      const newFormative = [...formData.assessment.formative];
                                      newFormative[index] = { ...newFormative[index], description: e.target.value };
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          formative: newFormative
                                        }
                                      }));
                                    }}
                                    placeholder="Describe the assessment activity"
                                    className="min-h-[60px]"
                                  />
                                </div>

                                <div className="flex justify-between items-center">
                                  <Label className="text-sm">Skills Assessed</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newFormative = formData.assessment.formative.filter((_, i) => i !== index);
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          formative: newFormative
                                        }
                                      }));
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  {assessment.skills_assessed.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="flex gap-2">
                                      <Input
                                        value={skill}
                                        onChange={(e) => {
                                          const newFormative = [...formData.assessment.formative];
                                          const newSkills = [...newFormative[index].skills_assessed];
                                          newSkills[skillIndex] = e.target.value;
                                          newFormative[index] = { ...newFormative[index], skills_assessed: newSkills };
                                          setFormData(prev => ({
                                            ...prev,
                                            assessment: {
                                              ...prev.assessment,
                                              formative: newFormative
                                            }
                                          }));
                                        }}
                                        placeholder="e.g., Understanding equivalent fractions"
                                        className="flex-1 text-sm"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newFormative = [...formData.assessment.formative];
                                          const newSkills = newFormative[index].skills_assessed.filter((_, i) => i !== skillIndex);
                                          newFormative[index] = { ...newFormative[index], skills_assessed: newSkills };
                                          setFormData(prev => ({
                                            ...prev,
                                            assessment: {
                                              ...prev.assessment,
                                              formative: newFormative
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
                                    onClick={() => {
                                      const newFormative = [...formData.assessment.formative];
                                      newFormative[index] = {
                                        ...newFormative[index],
                                        skills_assessed: [...newFormative[index].skills_assessed, '']
                                      };
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          formative: newFormative
                                        }
                                      }));
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Skill
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                assessment: {
                                  ...prev.assessment,
                                  formative: [
                                    ...prev.assessment.formative,
                                    {
                                      id: Date.now().toString(),
                                      type: 'formative',
                                      method: '',
                                      description: '',
                                      links_to_gradebook: false,
                                      skills_assessed: ['']
                                    }
                                  ]
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Formative Assessment
                            </Button>
                          </div>
                        </div>

                        {/* Summative Assessment */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">S</span>
                            </div>
                            <div>
                              <Label className="text-base font-medium">Summative Assessment</Label>
                              <p className="text-sm text-muted-foreground">Final evaluation of learning</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {formData.assessment.summative.map((assessment, index) => (
                              <div key={assessment.id} className="p-4 border rounded-lg space-y-3">
                                <div className="grid gap-3 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm">Method</Label>
                                    <select
                                      value={assessment.method}
                                      onChange={(e) => {
                                        const newSummative = [...formData.assessment.summative];
                                        newSummative[index] = { ...newSummative[index], method: e.target.value };
                                        setFormData(prev => ({
                                          ...prev,
                                          assessment: {
                                            ...prev.assessment,
                                            summative: newSummative
                                          }
                                        }));
                                      }}
                                      className="w-full p-2 border rounded-md text-sm"
                                    >
                                      <option value="">Select method</option>
                                      <option value="Quiz">Quiz</option>
                                      <option value="Project">Project</option>
                                      <option value="End-of-topic test">End-of-topic test</option>
                                      <option value="Portfolio">Portfolio</option>
                                      <option value="Presentation">Presentation</option>
                                      <option value="Lab report">Lab report</option>
                                      <option value="Essay">Essay</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`gradebook-sum-${assessment.id}`}
                                      checked={assessment.links_to_gradebook}
                                      onChange={(e) => {
                                        const newSummative = [...formData.assessment.summative];
                                        newSummative[index] = { ...newSummative[index], links_to_gradebook: e.target.checked };
                                        setFormData(prev => ({
                                          ...prev,
                                          assessment: {
                                            ...prev.assessment,
                                            summative: newSummative
                                          }
                                        }));
                                      }}
                                      className="rounded"
                                    />
                                    <Label htmlFor={`gradebook-sum-${assessment.id}`} className="text-sm">Link to Gradebook</Label>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm">Description</Label>
                                  <Textarea
                                    value={assessment.description}
                                    onChange={(e) => {
                                      const newSummative = [...formData.assessment.summative];
                                      newSummative[index] = { ...newSummative[index], description: e.target.value };
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          summative: newSummative
                                        }
                                      }));
                                    }}
                                    placeholder="Describe the assessment activity"
                                    className="min-h-[60px]"
                                  />
                                </div>

                                <div className="flex justify-between items-center">
                                  <Label className="text-sm">Skills Assessed</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newSummative = formData.assessment.summative.filter((_, i) => i !== index);
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          summative: newSummative
                                        }
                                      }));
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  {assessment.skills_assessed.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="flex gap-2">
                                      <Input
                                        value={skill}
                                        onChange={(e) => {
                                          const newSummative = [...formData.assessment.summative];
                                          const newSkills = [...newSummative[index].skills_assessed];
                                          newSkills[skillIndex] = e.target.value;
                                          newSummative[index] = { ...newSummative[index], skills_assessed: newSkills };
                                          setFormData(prev => ({
                                            ...prev,
                                            assessment: {
                                              ...prev.assessment,
                                              summative: newSummative
                                            }
                                          }));
                                        }}
                                        placeholder="e.g., Mathematical reasoning"
                                        className="flex-1 text-sm"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newSummative = [...formData.assessment.summative];
                                          const newSkills = newSummative[index].skills_assessed.filter((_, i) => i !== skillIndex);
                                          newSummative[index] = { ...newSummative[index], skills_assessed: newSkills };
                                          setFormData(prev => ({
                                            ...prev,
                                            assessment: {
                                              ...prev.assessment,
                                              summative: newSummative
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
                                    onClick={() => {
                                      const newSummative = [...formData.assessment.summative];
                                      newSummative[index] = {
                                        ...newSummative[index],
                                        skills_assessed: [...newSummative[index].skills_assessed, '']
                                      };
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          summative: newSummative
                                        }
                                      }));
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Skill
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                assessment: {
                                  ...prev.assessment,
                                  summative: [
                                    ...prev.assessment.summative,
                                    {
                                      id: Date.now().toString(),
                                      type: 'summative',
                                      method: '',
                                      description: '',
                                      links_to_gradebook: true,
                                      skills_assessed: ['']
                                    }
                                  ]
                                }
                              }))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Summative Assessment
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Rubrics Section */}
                      <div className="space-y-3 border-t pt-4">
                        <Label className="text-base font-medium">Rubrics & Grading Criteria</Label>
                        <div className="space-y-3">
                          {formData.assessment.rubrics.length > 0 && (
                            <div className="space-y-2">
                              {formData.assessment.rubrics.map((rubric, index) => (
                                <div key={rubric.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium text-sm">{rubric.name}</p>
                                      <p className="text-xs text-muted-foreground capitalize">{rubric.type}</p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newRubrics = formData.assessment.rubrics.filter((_, i) => i !== index);
                                      setFormData(prev => ({
                                        ...prev,
                                        assessment: {
                                          ...prev.assessment,
                                          rubrics: newRubrics
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
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf,.doc,.docx';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    const newRubric = {
                                      id: Date.now().toString(),
                                      name: file.name,
                                      url: '', // Would be set after upload
                                      type: 'attached' as const
                                    };
                                    setFormData(prev => ({
                                      ...prev,
                                      assessment: {
                                        ...prev.assessment,
                                        rubrics: [...prev.assessment.rubrics, newRubric]
                                      }
                                    }));
                                    toast({
                                      title: "Rubric attached",
                                      description: `${file.name} has been attached`
                                    });
                                  }
                                };
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Attach Rubric
                            </Button>
                            <Input
                              placeholder="Or paste rubric URL"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  const url = e.currentTarget.value.trim();
                                  const newRubric = {
                                    id: Date.now().toString(),
                                    name: 'Linked Rubric',
                                    url: url,
                                    type: 'linked' as const
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    assessment: {
                                      ...prev.assessment,
                                      rubrics: [...prev.assessment.rubrics, newRubric]
                                    }
                                  }));
                                  e.currentTarget.value = '';
                                  toast({
                                    title: "Rubric linked",
                                    description: "URL has been added to rubrics"
                                  });
                                }
                              }}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Assessment Summary */}
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Assessment Overview:</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-bold">F</span>
                            </div>
                            <span>{formData.assessment.formative.length} Formative</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-xs font-bold">S</span>
                            </div>
                            <span>{formData.assessment.summative.length} Summative</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                            <span>{formData.assessment.rubrics.length} Rubrics</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">→ Gradebook:</span>
                            <span>
                              {[...formData.assessment.formative, ...formData.assessment.summative]
                                .filter(a => a.links_to_gradebook).length} linked
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integration Features Section - The Power Layer */}
                    <div className="space-y-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-lg font-semibold flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            Integration Features
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            The Power Layer - Connect your lesson to curriculum, templates, collaboration, and more
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Curriculum Link */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <Label className="text-base font-medium">Curriculum Link</Label>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm">Selected Topic</Label>
                              <div className="flex gap-2 mt-1">
                                <Select
                                  value={formData.curriculum_topic_id}
                                  onValueChange={(value) => setFormData(prev => ({ ...prev, curriculum_topic_id: value }))}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Search and select curriculum topic" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockCurriculumTopics.map(topic => (
                                      <SelectItem key={topic.id} value={topic.id}>
                                        <div>
                                          <div className="font-medium">{topic.title}</div>
                                          <div className="text-xs text-muted-foreground">{topic.subject} • {topic.grade_level}</div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button type="button" variant="outline" size="sm">
                                  <Search className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {selectedTopic && (
                              <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                                <strong>Auto-aligned:</strong> Learning objectives and skills will sync with this curriculum topic
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Template Library */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                          <div className="flex items-center gap-2">
                            <Copy className="h-5 w-5 text-purple-600" />
                            <Label className="text-base font-medium">Template Library</Label>
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" size="sm" className="flex-1">
                                <Upload className="h-4 w-4 mr-2" />
                                Save as Template
                              </Button>
                              <Button type="button" variant="outline" size="sm" className="flex-1">
                                <Copy className="h-4 w-4 mr-2" />
                                Load Template
                              </Button>
                            </div>
                            <div className="text-xs text-purple-700 space-y-1">
                              <div className="flex justify-between">
                                <span>📚 Science Lab</span>
                                <span className="text-muted-foreground">Used 12x</span>
                              </div>
                              <div className="flex justify-between">
                                <span>🔢 Math Drill</span>
                                <span className="text-muted-foreground">Used 8x</span>
                              </div>
                              <div className="flex justify-between">
                                <span>📖 Reading Circle</span>
                                <span className="text-muted-foreground">Used 15x</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Collaboration */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                          <div className="flex items-center gap-2">
                            <Share2 className="h-5 w-5 text-green-600" />
                            <Label className="text-base font-medium">Collaboration</Label>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              {formData.collaboration.shared_with.map((person, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3" />
                                    <span>{person.name}</span>
                                    <Badge variant="secondary" className="text-xs">{person.role.toUpperCase()}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={person.permission === 'edit' ? 'text-orange-600' : 'text-gray-600'}>
                                      {person.permission}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newShared = formData.collaboration.shared_with.filter((_, i) => i !== index);
                                        setFormData(prev => ({
                                          ...prev,
                                          collaboration: {
                                            ...prev.collaboration,
                                            shared_with: newShared
                                          }
                                        }));
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Share with HOD/TA/Co-teacher
                            </Button>
                          </div>
                        </div>

                        {/* Sequence Planning */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-orange-600" />
                            <Label className="text-base font-medium">Sequence Planning</Label>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="part-of-sequence"
                                checked={formData.sequence.is_part_of_sequence}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  sequence: {
                                    ...prev.sequence,
                                    is_part_of_sequence: e.target.checked
                                  }
                                }))}
                                className="rounded"
                              />
                              <Label htmlFor="part-of-sequence" className="text-sm">Part of lesson sequence</Label>
                            </div>
                            
                            {formData.sequence.is_part_of_sequence && (
                              <div className="space-y-2 pl-6 border-l-2 border-orange-200">
                                <Input
                                  placeholder="Sequence title"
                                  value={formData.sequence.sequence_title || ''}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    sequence: {
                                      ...prev.sequence,
                                      sequence_title: e.target.value
                                    }
                                  }))}
                                  className="text-sm"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Lesson #"
                                    value={formData.sequence.lesson_number || ''}
                                    onChange={(e) => setFormData(prev => ({
                                      ...prev,
                                      sequence: {
                                        ...prev.sequence,
                                        lesson_number: parseInt(e.target.value) || 1
                                      }
                                    }))}
                                    className="text-sm"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="of Total"
                                    value={formData.sequence.total_lessons || ''}
                                    onChange={(e) => setFormData(prev => ({
                                      ...prev,
                                      sequence: {
                                        ...prev.sequence,
                                        total_lessons: parseInt(e.target.value) || 1
                                      }
                                    }))}
                                    className="text-sm"
                                  />
                                </div>
                                {formData.sequence.lesson_number && formData.sequence.total_lessons && (
                                  <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                                    📋 Auto-suggest: "Lesson {(formData.sequence.lesson_number || 0) + 1} of {formData.sequence.total_lessons}" will be suggested next
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timetable Link */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-cyan-600" />
                            <Label className="text-base font-medium">Timetable Link</Label>
                          </div>
                          <div className="space-y-3">
                            {formData.integration.period_info ? (
                              <div className="text-xs space-y-1 bg-white p-3 rounded border">
                                <div className="font-medium text-cyan-700">📅 Connected to Timetable</div>
                                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                                  <span>Day: {formData.integration.period_info.day}</span>
                                  <span>Time: {formData.integration.period_info.time}</span>
                                  <span>Duration: {formData.integration.period_info.duration}min</span>
                                  <span>Room: {formData.integration.period_info.room}</span>
                                </div>
                              </div>
                            ) : (
                              <Button type="button" variant="outline" size="sm" className="w-full">
                                <Link className="h-4 w-4 mr-2" />
                                Link to Timetable Entry
                              </Button>
                            )}
                            <div className="text-xs text-cyan-700">
                              🎯 Knows which class is being taught when
                            </div>
                          </div>
                        </div>

                        {/* Create Assignment */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-600" />
                            <Label className="text-base font-medium">Create Assignment</Label>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="auto-assignment"
                                checked={formData.integration.auto_assignment?.enabled || false}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  integration: {
                                    ...prev.integration,
                                    auto_assignment: {
                                      ...prev.integration.auto_assignment!,
                                      enabled: e.target.checked
                                    }
                                  }
                                }))}
                                className="rounded"
                              />
                              <Label htmlFor="auto-assignment" className="text-sm">Auto-create homework assignment</Label>
                            </div>
                            
                            {formData.integration.auto_assignment?.enabled && (
                              <div className="space-y-2 pl-6 border-l-2 border-emerald-200">
                                <Input
                                  placeholder="Assignment title"
                                  value={formData.integration.auto_assignment.title}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    integration: {
                                      ...prev.integration,
                                      auto_assignment: {
                                        ...prev.integration.auto_assignment!,
                                        title: e.target.value
                                      }
                                    }
                                  }))}
                                  className="text-sm"
                                />
                                <Input
                                  type="date"
                                  value={formData.integration.auto_assignment.due_date}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    integration: {
                                      ...prev.integration,
                                      auto_assignment: {
                                        ...prev.integration.auto_assignment!,
                                        due_date: e.target.value
                                      }
                                    }
                                  }))}
                                  className="text-sm"
                                />
                                <Textarea
                                  placeholder="Assignment description"
                                  value={formData.integration.auto_assignment.description}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    integration: {
                                      ...prev.integration,
                                      auto_assignment: {
                                        ...prev.integration.auto_assignment!,
                                        description: e.target.value
                                      }
                                    }
                                  }))}
                                  className="text-sm min-h-[60px]"
                                />
                                <div className="text-xs text-emerald-700 bg-emerald-100 p-2 rounded">
                                  🚀 One-click: Assignment will be created automatically with these details
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                        {/* Curriculum Progress Tracking */}
                        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 md:col-span-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                            <Label className="text-base font-medium">Curriculum Progress</Label>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="mark-as-done"
                                  checked={formData.status === 'completed'}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.checked ? 'completed' : 'draft'
                                  }))}
                                  className="rounded text-indigo-600"
                                />
                                <Label htmlFor="mark-as-done" className="text-sm font-medium">Mark as Done</Label>
                              </div>
                              {formData.status === 'completed' && (
                                <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>
                              )}
                            </div>
                            
                            {formData.curriculum_topic_id && (
                              <div className="space-y-2 bg-white p-3 rounded border">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">Topic Coverage</span>
                                  <span className="text-indigo-600">
                                    {formData.status === 'completed' ? '✅ 100%' : '🔄 In Progress'}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      formData.status === 'completed' 
                                        ? 'bg-green-500 w-full' 
                                        : 'bg-indigo-500 w-3/4'
                                    }`}
                                  ></div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  📊 Updates curriculum coverage % automatically when marked complete
                                </div>
                              </div>
                            )}
                            
                            {selectedTopic && (
                              <div className="space-y-2 text-xs">
                                <div className="font-medium text-indigo-700">Unit Progress Overview:</div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-white p-2 rounded border text-center">
                                    <div className="text-green-600 font-bold">3/5</div>
                                    <div className="text-muted-foreground">Lessons</div>
                                  </div>
                                  <div className="bg-white p-2 rounded border text-center">
                                    <div className="text-blue-600 font-bold">60%</div>
                                    <div className="text-muted-foreground">Coverage</div>
                                  </div>
                                  <div className="bg-white p-2 rounded border text-center">
                                    <div className="text-purple-600 font-bold">2</div>
                                    <div className="text-muted-foreground">Remaining</div>
                                  </div>
                                </div>
                                {formData.status === 'completed' && (
                                  <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                                    🎉 Great! This lesson will increase unit coverage to 80%
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Integration Summary */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-5 w-5 text-amber-600" />
                            <span className="font-medium text-amber-800">Integration Status</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-sm">
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <BookOpen className={`h-4 w-4 mb-1 ${formData.curriculum_topic_id ? 'text-blue-600' : 'text-gray-400'}`} />
                              <span className="text-xs text-center">
                                {formData.curriculum_topic_id ? '✅ Linked' : '⚪ Curriculum'}
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <Share2 className={`h-4 w-4 mb-1 ${formData.collaboration.shared_with.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className="text-xs text-center">
                                {formData.collaboration.shared_with.length > 0 ? `✅ ${formData.collaboration.shared_with.length} shared` : '⚪ Solo'}
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <BarChart3 className={`h-4 w-4 mb-1 ${formData.sequence.is_part_of_sequence ? 'text-orange-600' : 'text-gray-400'}`} />
                              <span className="text-xs text-center">
                                {formData.sequence.is_part_of_sequence ? 
                                  `✅ ${formData.sequence.lesson_number}/${formData.sequence.total_lessons}` : 
                                  '⚪ Standalone'}
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <Calendar className={`h-4 w-4 mb-1 ${formData.integration.period_info ? 'text-cyan-600' : 'text-gray-400'}`} />
                              <span className="text-xs text-center">
                                {formData.integration.period_info ? '✅ Scheduled' : '⚪ Timetable'}
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <FileText className={`h-4 w-4 mb-1 ${formData.integration.auto_assignment?.enabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                              <span className="text-xs text-center">
                                {formData.integration.auto_assignment?.enabled ? '✅ Auto-HW' : '⚪ Assignment'}
                              </span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <Copy className="h-4 w-4 mb-1 text-purple-600" />
                              <span className="text-xs text-center">✅ Template</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white rounded border">
                              <BarChart3 className={`h-4 w-4 mb-1 ${formData.status === 'completed' ? 'text-indigo-600' : 'text-gray-400'}`} />
                              <span className="text-xs text-center">
                                {formData.status === 'completed' ? '✅ Done' : '⚪ Progress'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Post-Lesson Reflection (Professional Growth) */}
                        {formData.status === 'completed' && (
                          <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <TrendingUp className="h-5 w-5 text-emerald-600" />
                              <span className="font-medium text-emerald-800">Post-Lesson Reflection (Professional Growth)</span>
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs">🔁 Continuous Improvement</Badge>
                            </div>
                            
                            <div className="space-y-4">
                              {/* Auto-Log */}
                              <div className="bg-white p-3 rounded border">
                                <Label className="text-sm font-medium text-gray-700">📊 Auto-Log</Label>
                                <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Completed by:</span>
                                    <div className="font-medium">{formData.post_lesson_reflection?.completed_by || 'Current Teacher'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Completed at:</span>
                                    <div className="font-medium">{formData.post_lesson_reflection?.completed_at || new Date().toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Actual duration:</span>
                                    <div className="font-medium">
                                      {formData.post_lesson_reflection?.actual_duration_minutes || formData.duration_minutes} minutes
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Student Engagement Rating */}
                              <div>
                                <Label htmlFor="engagement-rating" className="text-sm font-medium">
                                  Student Engagement Rating (1-5 scale)
                                </Label>
                                <div className="flex items-center gap-3 mt-2">
                                  <input
                                    type="range"
                                    id="engagement-rating"
                                    min="1"
                                    max="5"
                                    value={formData.post_lesson_reflection?.student_engagement_rating || 3}
                                    onChange={(e) => setFormData(prev => ({
                                      ...prev,
                                      post_lesson_reflection: {
                                        ...prev.post_lesson_reflection!,
                                        student_engagement_rating: parseInt(e.target.value)
                                      }
                                    }))}
                                    className="flex-1"
                                  />
                                  <span className="text-lg font-bold text-emerald-600">
                                    {formData.post_lesson_reflection?.student_engagement_rating || 3}/5
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Low</span>
                                  <span>High</span>
                                </div>
                              </div>

                              {/* Reflection Notes */}
                              <div>
                                <Label htmlFor="reflection-notes" className="text-sm font-medium">
                                  Reflection Notes
                                </Label>
                                <textarea
                                  id="reflection-notes"
                                  placeholder="e.g., Students struggled with zero in place value, Used too much time on starter..."
                                  value={formData.post_lesson_reflection?.reflection_notes || ''}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    post_lesson_reflection: {
                                      ...prev.post_lesson_reflection!,
                                      reflection_notes: e.target.value
                                    }
                                  }))}
                                  className="w-full p-3 border rounded-md text-sm min-h-[80px] resize-y"
                                />
                              </div>

                              {/* Student Feedback */}
                              <div>
                                <Label htmlFor="student-feedback" className="text-sm font-medium">
                                  Student Feedback (Optional)
                                </Label>
                                <textarea
                                  id="student-feedback"
                                  placeholder="e.g., 3 students asked for more examples, Most enjoyed the hands-on activity..."
                                  value={formData.post_lesson_reflection?.student_feedback || ''}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    post_lesson_reflection: {
                                      ...prev.post_lesson_reflection!,
                                      student_feedback: e.target.value
                                    }
                                  }))}
                                  className="w-full p-3 border rounded-md text-sm min-h-[60px] resize-y"
                                />
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                {/* What Worked Well */}
                                <div>
                                  <Label className="text-sm font-medium">What Worked Well ✅</Label>
                                  <div className="space-y-2 mt-2">
                                    {formData.post_lesson_reflection?.what_worked_well.map((item, index) => (
                                      <div key={index} className="flex gap-2">
                                        <input
                                          type="text"
                                          placeholder="e.g., Visual aids helped understanding"
                                          value={item}
                                          onChange={(e) => {
                                            const newItems = [...(formData.post_lesson_reflection?.what_worked_well || [''])];
                                            newItems[index] = e.target.value;
                                            setFormData(prev => ({
                                              ...prev,
                                              post_lesson_reflection: {
                                                ...prev.post_lesson_reflection!,
                                                what_worked_well: newItems
                                              }
                                            }));
                                          }}
                                          className="flex-1 p-2 border rounded text-sm"
                                        />
                                        {index > 0 && (
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const newItems = formData.post_lesson_reflection?.what_worked_well.filter((_, i) => i !== index) || [];
                                              setFormData(prev => ({
                                                ...prev,
                                                post_lesson_reflection: {
                                                  ...prev.post_lesson_reflection!,
                                                  what_worked_well: newItems
                                                }
                                              }));
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setFormData(prev => ({
                                        ...prev,
                                        post_lesson_reflection: {
                                          ...prev.post_lesson_reflection!,
                                          what_worked_well: [...(prev.post_lesson_reflection?.what_worked_well || []), '']
                                        }
                                      }))}
                                      className="text-xs"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Success
                                    </Button>
                                  </div>
                                </div>

                                {/* Areas for Improvement */}
                                <div>
                                  <Label className="text-sm font-medium">Areas for Improvement 🎯</Label>
                                  <div className="space-y-2 mt-2">
                                    {formData.post_lesson_reflection?.areas_for_improvement.map((item, index) => (
                                      <div key={index} className="flex gap-2">
                                        <input
                                          type="text"
                                          placeholder="e.g., Need more wait time for questions"
                                          value={item}
                                          onChange={(e) => {
                                            const newItems = [...(formData.post_lesson_reflection?.areas_for_improvement || [''])];
                                            newItems[index] = e.target.value;
                                            setFormData(prev => ({
                                              ...prev,
                                              post_lesson_reflection: {
                                                ...prev.post_lesson_reflection!,
                                                areas_for_improvement: newItems
                                              }
                                            }));
                                          }}
                                          className="flex-1 p-2 border rounded text-sm"
                                        />
                                        {index > 0 && (
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const newItems = formData.post_lesson_reflection?.areas_for_improvement.filter((_, i) => i !== index) || [];
                                              setFormData(prev => ({
                                                ...prev,
                                                post_lesson_reflection: {
                                                  ...prev.post_lesson_reflection!,
                                                  areas_for_improvement: newItems
                                                }
                                              }));
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setFormData(prev => ({
                                        ...prev,
                                        post_lesson_reflection: {
                                          ...prev.post_lesson_reflection!,
                                          areas_for_improvement: [...(prev.post_lesson_reflection?.areas_for_improvement || []), '']
                                        }
                                      }))}
                                      className="text-xs"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Improvement
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Next Steps */}
                              <div>
                                <Label className="text-sm font-medium">Next Steps 🚀</Label>
                                <div className="space-y-2 mt-2">
                                  {formData.post_lesson_reflection?.next_steps.map((step, index) => (
                                    <div key={index} className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="e.g., Re-teach on Friday, Move to next topic"
                                        value={step}
                                        onChange={(e) => {
                                          const newSteps = [...(formData.post_lesson_reflection?.next_steps || [''])];
                                          newSteps[index] = e.target.value;
                                          setFormData(prev => ({
                                            ...prev,
                                            post_lesson_reflection: {
                                              ...prev.post_lesson_reflection!,
                                              next_steps: newSteps
                                            }
                                          }));
                                        }}
                                        className="flex-1 p-2 border rounded text-sm"
                                      />
                                      {index > 0 && (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const newSteps = formData.post_lesson_reflection?.next_steps.filter((_, i) => i !== index) || [];
                                            setFormData(prev => ({
                                              ...prev,
                                              post_lesson_reflection: {
                                                ...prev.post_lesson_reflection!,
                                                next_steps: newSteps
                                              }
                                            }));
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      post_lesson_reflection: {
                                        ...prev.post_lesson_reflection!,
                                        next_steps: [...(prev.post_lesson_reflection?.next_steps || []), '']
                                      }
                                    }))}
                                    className="text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Next Step
                                  </Button>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div>
                                <Label className="text-sm font-medium">Quick Reflection Questions</Label>
                                <div className="space-y-3 mt-2">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      id="would-teach-again"
                                      checked={formData.post_lesson_reflection?.would_teach_again || false}
                                      onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        post_lesson_reflection: {
                                          ...prev.post_lesson_reflection!,
                                          would_teach_again: e.target.checked
                                        }
                                      }))}
                                      className="rounded text-emerald-600"
                                    />
                                    <Label htmlFor="would-teach-again" className="text-sm">
                                      Would you teach this lesson the same way again?
                                    </Label>
                                  </div>
                                  
                                  {!formData.post_lesson_reflection?.would_teach_again && (
                                    <div>
                                      <Label htmlFor="modifications" className="text-sm font-medium text-orange-700">
                                        What would you change for next time?
                                      </Label>
                                      <textarea
                                        id="modifications"
                                        placeholder="Describe the key modifications you would make..."
                                        value={formData.post_lesson_reflection?.modifications_for_next_time || ''}
                                        onChange={(e) => setFormData(prev => ({
                                          ...prev,
                                          post_lesson_reflection: {
                                            ...prev.post_lesson_reflection!,
                                            modifications_for_next_time: e.target.value
                                          }
                                        }))}
                                        className="w-full p-3 border rounded-md text-sm min-h-[60px] resize-y mt-2"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Professional Growth Summary */}
                              <div className="bg-emerald-100 p-3 rounded border text-center">
                                <div className="text-sm text-emerald-800">
                                  🌟 <strong>Professional Growth Tracker</strong> - This reflection will help you identify patterns and improve your teaching practice over time.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingPlan ? 'Update' : 'Create'} Lesson Plan
                          </Button>
                        </div>
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