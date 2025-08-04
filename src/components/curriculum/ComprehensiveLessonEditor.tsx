import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  Plus, 
  Minus, 
  Save, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  Users, 
  FileText, 
  Clock, 
  Lightbulb,
  Star,
  AlertCircle,
  MessageSquare,
  Link as LinkIcon,
  Wand2,
  Calendar,
  Info
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ComprehensiveLessonEditorProps {
  editingPlan: any;
  onCancel: () => void;
  onSave: (planData: any) => void;
}

export const ComprehensiveLessonEditor: React.FC<ComprehensiveLessonEditorProps> = ({
  editingPlan,
  onCancel,
  onSave
}) => {
  const { currentSchool } = useRBAC();
  const [curriculumTopics, setCurriculumTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState(editingPlan?.curriculum_topic_id || '');
  const [loadingTopics, setLoadingTopics] = useState(false);

  const [formData, setFormData] = useState(() => ({
    // Basic Information
    title: editingPlan?.title || '',
    subject: editingPlan?.subject || '',
    year_group: editingPlan?.year_group || '',
    form_class: editingPlan?.form_class || '',
    lesson_date: editingPlan?.lesson_date || '',
    duration_minutes: editingPlan?.duration_minutes || 60,
    curriculum_topic_id: editingPlan?.curriculum_topic_id || '',
    
    // Learning Objectives
    learning_objectives: editingPlan?.learning_objectives || [''],
    success_criteria: editingPlan?.success_criteria || [''],
    
    // Lesson Structure
    lesson_sections: editingPlan?.lesson_sections || [
      { name: 'Starter', duration: 10, description: '', activities: [''] },
      { name: 'Main Activity', duration: 35, description: '', activities: [''] },
      { name: 'Plenary', duration: 15, description: '', activities: [''] }
    ],
    
    // Resources
    resources: editingPlan?.resources || {
      materials: [''],
      technology: [''],
      handouts: [''],
      references: ['']
    },
    
    // Assessment
    assessment: editingPlan?.assessment || {
      formative: [''],
      summative: [''],
      self_assessment: [''],
      peer_assessment: ['']
    },
    
    // Differentiation
    differentiation: editingPlan?.differentiation || {
      support_strategies: [''],
      extension_activities: [''],
      special_needs: [''],
      eal_support: ['']
    },
    
    // Cross-curricular Links
    integration: editingPlan?.integration || {
      literacy: '',
      numeracy: '',
      other_subjects: [''],
      life_skills: ''
    },
    
    // Collaboration
    collaboration: editingPlan?.collaboration || {
      group_work: '',
      pair_work: '',
      whole_class: '',
      independent: ''
    },
    
    // Sequence
    sequence: editingPlan?.sequence || {
      prior_learning: '',
      next_lesson: '',
      homework_set: '',
      follow_up_activities: ['']
    }
  }));

  // Fetch curriculum topics when subject changes
  useEffect(() => {
    if (formData.subject && currentSchool?.id) {
      fetchCurriculumTopics();
    }
  }, [formData.subject, currentSchool?.id]);

  const fetchCurriculumTopics = async () => {
    // TODO: Fetch curriculum topics from the database
    // Temporarily disabled due to TypeScript issues
    console.log('Fetching curriculum topics for subject:', formData.subject);
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setFormData(prev => ({ ...prev, curriculum_topic_id: topicId }));
    
    // Auto-fill curriculum content based on selected topic
    if (topicId === 'fractions-equiv') {
      setFormData(prev => ({
        ...prev,
        curriculum_topic_id: topicId,
        learning_objectives: [
          "I can find fractions that are the same size"
        ],
        success_criteria: [
          "I can draw 1/2 and 2/4 and explain why they're equal",
          "I can use a fraction wall to find equivalent fractions"
        ],
        lesson_sections: [
          { 
            name: 'Starter', 
            duration: 10, 
            description: 'Show 1/2 and 2/4 — are they the same?',
            activities: ['Show 1/2 and 2/4 — are they the same?']
          },
          { 
            name: 'Main Activity', 
            duration: 35, 
            description: 'Use fraction walls to find 3 fractions equal to 1/2',
            activities: ['Use fraction walls to find 3 fractions equal to 1/2']
          },
          { 
            name: 'Plenary', 
            duration: 15, 
            description: 'Review equivalent fractions found and share strategies',
            activities: ['Review equivalent fractions found and share strategies']
          }
        ],
        differentiation: {
          support_strategies: ['Use physical fraction tiles for hands-on learning'],
          extension_activities: ['Find 3 fractions equal to 3/6'],
          special_needs: ['Visual fraction representations and manipulatives'],
          eal_support: ['Key vocabulary cards: equivalent, equal, fraction']
        }
      }));
    } else if (topicId === 'fractions-add') {
      setFormData(prev => ({
        ...prev,
        curriculum_topic_id: topicId,
        learning_objectives: [
          "I can add fractions with the same denominator"
        ],
        success_criteria: [
          "I can add two fractions like 1/4 + 2/4",
          "I can explain my method using diagrams"
        ],
        lesson_sections: [
          { 
            name: 'Starter', 
            duration: 10, 
            description: 'Quick recall: What is 1/4 + 1/4?',
            activities: ['Quick recall: What is 1/4 + 1/4?']
          },
          { 
            name: 'Main Activity', 
            duration: 35, 
            description: 'Practice adding fractions with same denominators using visual models',
            activities: ['Practice adding fractions with same denominators using visual models']
          },
          { 
            name: 'Plenary', 
            duration: 15, 
            description: 'Share methods and check understanding',
            activities: ['Share methods and check understanding']
          }
        ],
        differentiation: {
          support_strategies: ['Use fraction bars and visual models'],
          extension_activities: ['Try adding fractions with different denominators'],
          special_needs: ['Concrete manipulatives before abstract work'],
          eal_support: ['Vocabulary support: add, plus, total, altogether']
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [parent]: { ...prev[parent as keyof typeof prev], [field]: value }
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: [...(prev[field as keyof typeof prev] as any[]), '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const array = prev[field as keyof typeof prev] as any[];
      if (array.length > 1) {
        return { 
          ...prev, 
          [field]: array.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData(prev => {
      const array = [...(prev[field as keyof typeof prev] as any[])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Framework Alignment - Inspection Ready */}
      {selectedTopic && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-3">Framework Alignment</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-green-700">Aligned with:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base">🇬🇧</span>
                <span className="font-medium text-green-900">
                  English National Curriculum – Year 4 – Mathematics
                </span>
              </div>
            </div>
            <div className="text-sm text-green-700">
              <span className="font-medium">Reference:</span> Ma4/2.2b
            </div>
            <div className="text-xs text-green-600 mt-3">
              <div className="mb-1">
                <span className="font-medium">Pulls from:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>curriculum_topics.curriculum_id</li>
                <li>curricula.name, curricula.region</li>
              </ul>
            </div>
            <div className="bg-green-100 rounded-md p-2 mt-3">
              <p className="text-sm font-medium text-green-800">
                This is inspection-ready — no manual tagging.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {editingPlan ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
          </h1>
          <p className="text-muted-foreground">
            Comprehensive lesson planning with curriculum alignment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              const completedData = { ...formData, status: 'completed' };
              onSave(completedData);
            }} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Save as Completed
          </Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="differentiation">Differentiation</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Enter lesson title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => updateField('subject', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="PE">Physical Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year_group">Year Group</Label>
                    <Select 
                      value={formData.year_group} 
                      onValueChange={(value) => updateField('year_group', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Year 7">Year 7</SelectItem>
                        <SelectItem value="Year 8">Year 8</SelectItem>
                        <SelectItem value="Year 9">Year 9</SelectItem>
                        <SelectItem value="Year 10">Year 10</SelectItem>
                        <SelectItem value="Year 11">Year 11</SelectItem>
                        <SelectItem value="Year 12">Year 12</SelectItem>
                        <SelectItem value="Year 13">Year 13</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="form_class">Form Class</Label>
                    <Input
                      id="form_class"
                      value={formData.form_class}
                      onChange={(e) => updateField('form_class', e.target.value)}
                      placeholder="e.g., 7A, 8B"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lesson_date">Lesson Date</Label>
                    <Input
                      id="lesson_date"
                      type="date"
                      value={formData.lesson_date}
                      onChange={(e) => updateField('lesson_date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => updateField('duration_minutes', parseInt(e.target.value))}
                      min="15"
                      max="180"
                      step="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Section */}
          <TabsContent value="curriculum">
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                  📌 Curriculum Section
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Auto-filled, Editable
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Topic Selection and Framework Info */}
                <div className="bg-white/60 rounded-lg p-4 border border-emerald-200 space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-emerald-700">Selected Topic:</Label>
                      <Select 
                        value={selectedTopic} 
                        onValueChange={handleTopicSelect}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select curriculum topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fractions-equiv">Recognise equivalent fractions</SelectItem>
                          <SelectItem value="fractions-add">Add and subtract fractions</SelectItem>
                          <SelectItem value="photosynthesis">Photosynthesis in plants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="text-sm text-emerald-600 space-y-1">
                        <div><strong>Framework:</strong> English National Curriculum</div>
                        <div><strong>Reference:</strong> Ma4/2.2b</div>
                        <div className="flex items-center gap-2">
                          <strong>Teaching Hours:</strong> 3 | 
                          <span className="text-emerald-700 font-medium">Completed: 1 of 3 (33%)</span>
                          <div className="flex-1 bg-emerald-100 rounded-full h-2 ml-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Objective */}
                <div className="bg-white/60 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🎯</span>
                    <Label className="text-sm font-medium text-emerald-700">Learning Objective</Label>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Auto-filled
                    </Badge>
                  </div>
                  <Input 
                    value={formData.learning_objectives[0] || "I can find fractions that are the same size"}
                    onChange={(e) => updateArrayItem('learning_objectives', 0, e.target.value)}
                    className="bg-blue-50/50 border-blue-200"
                  />
                </div>

                {/* Success Criteria */}
                <div className="bg-white/60 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">✅</span>
                    <Label className="text-sm font-medium text-emerald-700">Success Criteria</Label>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Auto-filled
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Checkbox id="criteria1" className="mt-1" />
                      <Label htmlFor="criteria1" className="text-sm leading-relaxed">
                        {formData.success_criteria[0] || "I can draw 1/2 and 2/4 and explain why they're equal"}
                      </Label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="criteria2" className="mt-1" />
                      <Label htmlFor="criteria2" className="text-sm leading-relaxed">
                        {formData.success_criteria[1] || "I can use a fraction wall to find equivalent fractions"}
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-600 h-8 px-2">
                      <Plus className="h-3 w-3 mr-1" />
                      Add criteria
                    </Button>
                  </div>
                </div>

                {/* Suggested Activities */}
                <div className="bg-white/60 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💡</span>
                    <Label className="text-sm font-medium text-emerald-700">Suggested Activities</Label>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Auto-filled, optional
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Starter:</Label>
                      <Input 
                        value={formData.lesson_sections[0]?.description || "Show 1/2 and 2/4 — are they equal?"}
                        onChange={(e) => {
                          const newSections = [...formData.lesson_sections];
                          if (newSections[0]) newSections[0].description = e.target.value;
                          updateField('lesson_sections', newSections);
                        }}
                        className="mt-1 bg-blue-50/50 border-blue-200"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Main:</Label>
                      <Input 
                        value={formData.lesson_sections[1]?.description || "Use fraction walls to find 3 fractions equal to 1/2"}
                        onChange={(e) => {
                          const newSections = [...formData.lesson_sections];
                          if (newSections[1]) newSections[1].description = e.target.value;
                          updateField('lesson_sections', newSections);
                        }}
                        className="mt-1 bg-blue-50/50 border-blue-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Topic Details */}
                {selectedTopic && (
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Selected Topic Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🔹</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">Recognise equivalent fractions</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Ma4/2.2b
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              3 hours
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Autumn Term
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">0% taught (0 of 3 lessons completed)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Auto-fill notification */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Auto-fill Available</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Learning objectives, success criteria, and suggested activities will be automatically populated from this curriculum topic.
                        </p>
                      </div>
                      
                      {/* Progress Impact Visualization */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-2">Progress Impact</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-700">Current Coverage:</span>
                            <span className="font-medium text-purple-900">33% (1 of 3 lessons)</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                          </div>
                          <div className="text-purple-600 text-xs">
                            When this lesson is completed → <span className="font-medium">67% coverage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Objectives */}
          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives & Success Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto-fill indicator */}
                {selectedTopic && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Auto-filled from Curriculum</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Content below has been auto-populated from your selected curriculum topic. You can edit but cannot delete to ensure curriculum alignment.
                    </p>
                  </div>
                )}
                
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Target className="h-4 w-4" />
                    Learning Objectives
                    {selectedTopic && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
                  </Label>
                  {formData.learning_objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={objective}
                        onChange={(e) => updateArrayItem('learning_objectives', index, e.target.value)}
                        placeholder="Students will be able to..."
                        className={`flex-1 ${selectedTopic && objective === "I can find fractions that are the same size" ? 'bg-blue-50 border-blue-200' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('learning_objectives', index)}
                        disabled={formData.learning_objectives.length <= 1}
                        title={selectedTopic && objective === "I can find fractions that are the same size" ? "Cannot delete curriculum-aligned content" : "Remove objective"}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('learning_objectives')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Learning Objective
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <CheckCircle2 className="h-4 w-4" />
                    Success Criteria
                  </Label>
                  {formData.success_criteria.map((criteria: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={criteria}
                        onChange={(e) => updateArrayItem('success_criteria', index, e.target.value)}
                        placeholder="I can..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('success_criteria', index)}
                        disabled={formData.success_criteria.length <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('success_criteria')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Success Criteria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lesson Structure */}
          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Lesson Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.lesson_sections.map((section: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{section.name}</h4>
                      <Badge variant="outline">{section.duration} min</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={section.duration}
                          onChange={(e) => {
                            const newSections = [...formData.lesson_sections];
                            newSections[index].duration = parseInt(e.target.value) || 0;
                            updateField('lesson_sections', newSections);
                          }}
                          min="1"
                          max="60"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={section.description}
                        onChange={(e) => {
                          const newSections = [...formData.lesson_sections];
                          newSections[index].description = e.target.value;
                          updateField('lesson_sections', newSections);
                        }}
                        placeholder="Describe the activities for this section..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resources & Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Materials</Label>
                  {formData.resources.materials.map((material: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={material}
                        onChange={(e) => {
                          const newMaterials = [...formData.resources.materials];
                          newMaterials[index] = e.target.value;
                          updateNestedField('resources', 'materials', newMaterials);
                        }}
                        placeholder="Textbooks, worksheets, equipment..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newMaterials = formData.resources.materials.filter((_, i) => i !== index);
                          if (newMaterials.length > 0) {
                            updateNestedField('resources', 'materials', newMaterials);
                          }
                        }}
                        disabled={formData.resources.materials.length <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateNestedField('resources', 'materials', [...formData.resources.materials, ''])}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessment */}
          <TabsContent value="assessment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Assessment Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Formative Assessment</Label>
                  {formData.assessment.formative.map((assessment: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={assessment}
                        onChange={(e) => {
                          const newAssessments = [...formData.assessment.formative];
                          newAssessments[index] = e.target.value;
                          updateNestedField('assessment', 'formative', newAssessments);
                        }}
                        placeholder="Questioning, observation, mini-whiteboards..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newAssessments = formData.assessment.formative.filter((_, i) => i !== index);
                          if (newAssessments.length > 0) {
                            updateNestedField('assessment', 'formative', newAssessments);
                          }
                        }}
                        disabled={formData.assessment.formative.length <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateNestedField('assessment', 'formative', [...formData.assessment.formative, ''])}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Formative Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Differentiation */}
          <TabsContent value="differentiation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Differentiation & Inclusion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto-fill indicator for differentiation */}
                {selectedTopic && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Auto-filled Differentiation</span>
                    </div>
                    <p className="text-xs text-purple-700 mt-1">
                      Support and challenge strategies have been auto-populated from curriculum guidelines.
                    </p>
                  </div>
                )}
                
                <div>
                  <Label className="flex items-center gap-2">
                    Support Strategies
                    {selectedTopic && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
                  </Label>
                  <Textarea
                    value={formData.differentiation.support_strategies[0] || ''}
                    onChange={(e) => updateNestedField('differentiation', 'support_strategies', [e.target.value])}
                    placeholder="Scaffolding, visual aids, simplified tasks..."
                    className={selectedTopic && formData.differentiation.support_strategies[0]?.includes('physical fraction tiles') ? 'bg-purple-50 border-purple-200' : ''}
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    Extension Activities  
                    {selectedTopic && <Badge variant="secondary" className="text-xs">Auto-filled</Badge>}
                  </Label>
                  <Textarea
                    value={formData.differentiation.extension_activities[0] || ''}
                    onChange={(e) => updateNestedField('differentiation', 'extension_activities', [e.target.value])}
                    placeholder="Challenge tasks, independent research..."
                    className={selectedTopic && formData.differentiation.extension_activities[0]?.includes('3/6') ? 'bg-purple-50 border-purple-200' : ''}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Special Needs Support</Label>
                  <Textarea
                    value={formData.differentiation.special_needs[0] || ''}
                    onChange={(e) => updateNestedField('differentiation', 'special_needs', [e.target.value])}
                    placeholder="SEND adaptations, accessibility..."
                    className={selectedTopic && formData.differentiation.special_needs[0]?.includes('Visual') ? 'bg-purple-50 border-purple-200' : ''}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>EAL Support</Label>
                  <Textarea
                    value={formData.differentiation.eal_support[0] || ''}
                    onChange={(e) => updateNestedField('differentiation', 'eal_support', [e.target.value])}
                    placeholder="Language support, visual vocabulary..."
                    className={selectedTopic && formData.differentiation.eal_support[0]?.includes('vocabulary') ? 'bg-purple-50 border-purple-200' : ''}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};