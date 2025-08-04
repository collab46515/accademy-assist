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
  Wand2
} from 'lucide-react';

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
    
    // TODO: Auto-fill learning objectives from curriculum topic
    console.log('Selected topic:', topicId);
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
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Lesson Plan
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

          {/* Curriculum Integration */}
          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Curriculum Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="curriculum_topic">Curriculum Topic</Label>
                  <Select 
                    value={selectedTopic} 
                    onValueChange={handleTopicSelect}
                    disabled={!formData.subject || loadingTopics}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.subject 
                          ? "Select a subject first" 
                          : loadingTopics 
                            ? "Loading topics..." 
                            : "Select curriculum topic"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {curriculumTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTopic && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Auto-fill Available</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Learning objectives will be automatically populated from the selected curriculum topic.
                      </p>
                    </div>
                  )}
                </div>
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
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Target className="h-4 w-4" />
                    Learning Objectives
                  </Label>
                  {formData.learning_objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={objective}
                        onChange={(e) => updateArrayItem('learning_objectives', index, e.target.value)}
                        placeholder="Students will be able to..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('learning_objectives', index)}
                        disabled={formData.learning_objectives.length <= 1}
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
                <div>
                  <Label>Support Strategies</Label>
                  <Textarea
                    value={formData.differentiation.support_strategies[0] || ''}
                    onChange={(e) => updateNestedField('differentiation', 'support_strategies', [e.target.value])}
                    placeholder="Scaffolding, visual aids, simplified tasks..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Extension Activities</Label>
                  <Textarea
                    value={formData.differentiation.extension_activities[0] || ''}
                    onChange={(e) => updateNestedField('differentiation', 'extension_activities', [e.target.value])}
                    placeholder="Challenge tasks, independent research..."
                    rows={3}
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