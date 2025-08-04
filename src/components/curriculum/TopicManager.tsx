import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash, BookOpen, Clock, Target, CheckCircle } from 'lucide-react';
import { CurriculumFramework, CurriculumTopic, TopicCoverage, useCurriculumData } from '@/hooks/useCurriculumData';
import { useToast } from '@/hooks/use-toast';

interface TopicManagerProps {
  framework: CurriculumFramework;
  topics: CurriculumTopic[];
  coverage: TopicCoverage[];
  schoolId: string;
  academicYear: string;
  canEdit: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function TopicManager({ 
  framework, 
  topics, 
  coverage, 
  schoolId, 
  academicYear, 
  canEdit,
  searchTerm,
  onSearchChange
}: TopicManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState<CurriculumTopic | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  
  const { updateTopicCoverage } = useCurriculumData();
  const { toast } = useToast();

  // New topic form state
  const [newTopic, setNewTopic] = useState({
    subject: '',
    grade_level: '',
    academic_period: '',
    title: '',
    description: '',
    learning_objectives: [''],
    skills: [''],
    estimated_hours: 1,
    difficulty_level: 1,
    is_mandatory: true
  });

  const handleMarkProgress = async (topicId: string, status: string, percentage: number) => {
    try {
      await updateTopicCoverage(topicId, {
        status: status as any,
        completion_percentage: percentage,
        school_id: schoolId,
        academic_year: academicYear
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const addObjectiveOrSkill = (field: 'learning_objectives' | 'skills') => {
    setNewTopic(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateObjectiveOrSkill = (field: 'learning_objectives' | 'skills', index: number, value: string) => {
    setNewTopic(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeObjectiveOrSkill = (field: 'learning_objectives' | 'skills', index: number) => {
    setNewTopic(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Filter topics by selected filters
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.grade_level.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || topic.subject === selectedSubject;
    const matchesGrade = !selectedGradeLevel || topic.grade_level === selectedGradeLevel;
    const matchesPeriod = !selectedPeriod || topic.academic_period === selectedPeriod;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesPeriod;
  });

  // Get unique subjects and periods for filters
  const uniqueSubjects = [...new Set(topics.map(t => t.subject))];
  const uniquePeriods = [...new Set(topics.map(t => t.academic_period).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Topic Management
              </CardTitle>
              <CardDescription>
                Manage curriculum topics for {framework.name}
              </CardDescription>
            </div>
            {canEdit && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Topic</DialogTitle>
                    <DialogDescription>
                      Create a new curriculum topic for {framework.name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={newTopic.subject} onValueChange={(value) => setNewTopic(prev => ({ ...prev, subject: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {framework.subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="grade_level">Grade Level</Label>
                        <Select value={newTopic.grade_level} onValueChange={(value) => setNewTopic(prev => ({ ...prev, grade_level: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {framework.grade_levels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="academic_period">Academic Period</Label>
                      <Select value={newTopic.academic_period} onValueChange={(value) => setNewTopic(prev => ({ ...prev, academic_period: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          {framework.academic_periods.map((period) => (
                            <SelectItem key={period} value={period}>{period}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTopic.title}
                        onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Introduction to Fractions"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTopic.description}
                        onChange={(e) => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this topic covers"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Learning Objectives</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => addObjectiveOrSkill('learning_objectives')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {newTopic.learning_objectives.map((objective, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={objective}
                            onChange={(e) => updateObjectiveOrSkill('learning_objectives', index, e.target.value)}
                            placeholder={`Learning objective ${index + 1}`}
                          />
                          {newTopic.learning_objectives.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeObjectiveOrSkill('learning_objectives', index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hours">Estimated Hours</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="1"
                          max="100"
                          value={newTopic.estimated_hours}
                          onChange={(e) => setNewTopic(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                        <Input
                          id="difficulty"
                          type="number"
                          min="1"
                          max="5"
                          value={newTopic.difficulty_level}
                          onChange={(e) => setNewTopic(prev => ({ ...prev, difficulty_level: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Topic Creation",
                          description: "Topic creation functionality will be implemented with the backend.",
                        });
                        setShowAddDialog(false);
                      }}
                      className="w-full"
                    >
                      Create Topic
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grades</SelectItem>
                {framework.grade_levels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Periods</SelectItem>
                {uniquePeriods.map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topics Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  {canEdit && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTopics.map((topic) => {
                  const topicCoverage = coverage.find(c => c.topic_id === topic.id);
                  const status = topicCoverage?.status || 'not_started';
                  const progress = topicCoverage?.completion_percentage || 0;
                  
                  return (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{topic.title}</div>
                          {topic.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {topic.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{topic.subject}</TableCell>
                      <TableCell>{topic.grade_level}</TableCell>
                      <TableCell>
                        {topic.academic_period && (
                          <Badge variant="outline">{topic.academic_period}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {topic.estimated_hours}h
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {topic.difficulty_level}/5
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === 'completed' ? 'default' :
                            status === 'in_progress' ? 'secondary' :
                            status === 'reviewed' ? 'outline' : 'destructive'
                          }
                        >
                          {status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{progress}%</span>
                        </div>
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right space-x-2">
                          {status === 'not_started' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkProgress(topic.id, 'in_progress', 25)}
                            >
                              Start
                            </Button>
                          )}
                          {status === 'in_progress' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkProgress(topic.id, 'completed', 100)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Topics Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedSubject || selectedGradeLevel || selectedPeriod
                  ? "No topics match your current filters"
                  : "No topics have been added to this curriculum yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}