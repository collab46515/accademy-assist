import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Link as LinkIcon
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
  const [formData, setFormData] = useState({
    // Basic Information
    title: editingPlan?.title || '',
    subject: editingPlan?.subject || '',
    year_group: editingPlan?.year_group || '',
    form_class: editingPlan?.form_class || '',
    lesson_date: editingPlan?.lesson_date || '',
    duration_minutes: editingPlan?.duration_minutes || 60,
    
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addItem = (path: string, index?: number) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (Array.isArray(current[lastKey])) {
        current[lastKey].push('');
      }
      
      return newData;
    });
  };

  const removeItem = (path: string, index: number) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (Array.isArray(current[lastKey]) && current[lastKey].length > 1) {
        current[lastKey].splice(index, 1);
      }
      
      return newData;
    });
  };

  const updateItem = (path: string, index: number | null, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (index !== null) {
        current[lastKey][index] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };

  const ArrayField = ({ 
    label, 
    path, 
    placeholder, 
    icon: Icon 
  }: { 
    label: string; 
    path: string; 
    placeholder: string; 
    icon: React.ElementType; 
  }) => {
    const keys = path.split('.');
    let items: string[] = formData as any;
    for (const key of keys) {
      items = items[key];
    }

    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4" />
          {label}
        </Label>
        {items.map((item: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateItem(path, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeItem(path, index)}
              disabled={items.length <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addItem(path)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {label.slice(0, -1)}
        </Button>
      </div>
    );
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
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="differentiation">Differentiation</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
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
                      onChange={(e) => updateItem('title', null, e.target.value)}
                      placeholder="Enter lesson title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => updateItem('subject', null, value)}
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
                      onValueChange={(value) => updateItem('year_group', null, value)}
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
                      onChange={(e) => updateItem('form_class', null, e.target.value)}
                      placeholder="e.g., 7A, 8B"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lesson_date">Lesson Date</Label>
                    <Input
                      id="lesson_date"
                      type="date"
                      value={formData.lesson_date}
                      onChange={(e) => updateItem('lesson_date', null, e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => updateItem('duration_minutes', null, parseInt(e.target.value))}
                      min="15"
                      max="180"
                      step="5"
                    />
                  </div>
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
                <ArrayField
                  label="Learning Objectives"
                  path="learning_objectives"
                  placeholder="Students will be able to..."
                  icon={Target}
                />
                <Separator />
                <ArrayField
                  label="Success Criteria"
                  path="success_criteria"
                  placeholder="I can..."
                  icon={CheckCircle2}
                />
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
                {formData.lesson_sections.map((section, index) => (
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
                            updateItem('lesson_sections', null, newSections);
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
                          updateItem('lesson_sections', null, newSections);
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
                <ArrayField
                  label="Materials"
                  path="resources.materials"
                  placeholder="Textbooks, worksheets, equipment..."
                  icon={FileText}
                />
                <ArrayField
                  label="Technology"
                  path="resources.technology"
                  placeholder="Interactive whiteboard, tablets, software..."
                  icon={Lightbulb}
                />
                <ArrayField
                  label="Handouts"
                  path="resources.handouts"
                  placeholder="Student worksheets, reference sheets..."
                  icon={FileText}
                />
                <ArrayField
                  label="References"
                  path="resources.references"
                  placeholder="Books, websites, videos..."
                  icon={LinkIcon}
                />
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArrayField
                  label="Formative Assessment"
                  path="assessment.formative"
                  placeholder="Questioning, observation, mini-whiteboards..."
                  icon={MessageSquare}
                />
                <ArrayField
                  label="Summative Assessment"
                  path="assessment.summative"
                  placeholder="Quiz, test, project..."
                  icon={CheckCircle2}
                />
                <ArrayField
                  label="Self-Assessment"
                  path="assessment.self_assessment"
                  placeholder="Reflection questions, checklists..."
                  icon={Users}
                />
                <ArrayField
                  label="Peer Assessment"
                  path="assessment.peer_assessment"
                  placeholder="Peer feedback, group evaluation..."
                  icon={Users}
                />
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArrayField
                  label="Support Strategies"
                  path="differentiation.support_strategies"
                  placeholder="Scaffolding, visual aids, simplified tasks..."
                  icon={Users}
                />
                <ArrayField
                  label="Extension Activities"
                  path="differentiation.extension_activities"
                  placeholder="Challenge tasks, independent research..."
                  icon={Star}
                />
                <ArrayField
                  label="Special Needs Support"
                  path="differentiation.special_needs"
                  placeholder="SEND adaptations, accessibility..."
                  icon={AlertCircle}
                />
                <ArrayField
                  label="EAL Support"
                  path="differentiation.eal_support"
                  placeholder="Language support, visual vocabulary..."
                  icon={MessageSquare}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration */}
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Cross-Curricular Links & Life Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Literacy Links</Label>
                    <Textarea
                      value={formData.integration.literacy}
                      onChange={(e) => updateItem('integration.literacy', null, e.target.value)}
                      placeholder="Reading, writing, speaking opportunities..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Numeracy Links</Label>
                    <Textarea
                      value={formData.integration.numeracy}
                      onChange={(e) => updateItem('integration.numeracy', null, e.target.value)}
                      placeholder="Mathematical skills and concepts..."
                      rows={3}
                    />
                  </div>
                </div>
                <ArrayField
                  label="Other Subject Links"
                  path="integration.other_subjects"
                  placeholder="Science, History, Geography connections..."
                  icon={LinkIcon}
                />
                <div>
                  <Label>Life Skills</Label>
                  <Textarea
                    value={formData.integration.life_skills}
                    onChange={(e) => updateItem('integration.life_skills', null, e.target.value)}
                    placeholder="Problem-solving, teamwork, communication..."
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