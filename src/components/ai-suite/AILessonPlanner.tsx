import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  BookOpen, 
  Wand2, 
  Clock, 
  Target, 
  Users, 
  FileText, 
  Lightbulb,
  Settings,
  Download,
  Copy,
  Play,
  Sparkles,
  Brain,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  Eye,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { UserGuide } from '@/components/shared/UserGuide';
import { userGuides } from '@/data/userGuides';
import { supabase } from '@/integrations/supabase/client';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  yearGroup: string;
  duration: number;
  learningObjectives: string[];
  successCriteria: string[];
  lessonStructure: LessonSection[];
  resources: string[];
  assessment: string[];
  differentiation: {
    support: string[];
    extension: string[];
  };
  generatedAt: string;
  status: 'draft' | 'generated' | 'reviewed';
  recap?: string;
}

interface LessonSection {
  name: string;
  duration: number;
  description: string;
  activities: string[];
}

interface Assignment {
  id: string;
  title: string;
  type: 'homework' | 'classwork' | 'project' | 'assessment';
  questions: Question[];
  rubric: string[];
  linkedToLesson: boolean;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  generatedAt: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'practical';
  question: string;
  options?: string[];
  answer?: string;
  marks: number;
  skillLevel: string;
}

export const AILessonPlanner = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('planner');
  const [generating, setGenerating] = useState(false);
  const [generatingRecap, setGeneratingRecap] = useState<string | null>(null);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Form state for lesson planning
  const [planForm, setPlanForm] = useState({
    topic: '',
    subject: '',
    yearGroup: '',
    duration: 60,
    learningStyle: 'balanced',
    priorKnowledge: '',
    learningObjectives: '',
    keyVocabulary: '',
    curriculum: 'any',
    specialNeeds: false,
    teachingApproach: 'mixed'
  });

  // Form state for assignment generation
  const [assignmentForm, setAssignmentForm] = useState({
    assignmentType: 'homework',
    questionCount: 5,
    difficulty: 'medium',
    includeRubric: true,
    timeLimit: 30,
    questionTypes: {
      multipleChoice: true,
      shortAnswer: true,
      essay: false,
      practical: false
    }
  });

  const handleGenerateLesson = async () => {
    if (!planForm.topic || !planForm.subject || !planForm.yearGroup) {
      toast({
        title: "Missing Information",
        description: "Please fill in topic, subject, and year group",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newLesson: LessonPlan = {
        id: `lesson-${Date.now()}`,
        title: `${planForm.topic} - ${planForm.subject}`,
        subject: planForm.subject,
        yearGroup: planForm.yearGroup,
        duration: planForm.duration,
        learningObjectives: [
          `Students will understand the key concepts of ${planForm.topic}`,
          `Students will be able to apply ${planForm.topic} in practical contexts`,
          `Students will develop analytical skills related to ${planForm.topic}`
        ],
        successCriteria: [
          `I can explain what ${planForm.topic} means`,
          `I can give examples of ${planForm.topic}`,
          `I can solve problems involving ${planForm.topic}`
        ],
        lessonStructure: [
          {
            name: 'Starter Activity',
            duration: 10,
            description: `Quick review of prior knowledge related to ${planForm.topic}`,
            activities: ['Think-pair-share exercise', 'Quick quiz on prerequisites']
          },
          {
            name: 'Main Teaching',
            duration: 30,
            description: `Introduction and exploration of ${planForm.topic}`,
            activities: [
              `Interactive demonstration of ${planForm.topic}`,
              'Guided practice with scaffolded examples',
              'Student discussion and questioning'
            ]
          },
          {
            name: 'Independent Practice',
            duration: 15,
            description: `Students work on ${planForm.topic} problems`,
            activities: ['Individual worksheet completion', 'Peer checking and support']
          },
          {
            name: 'Plenary',
            duration: 5,
            description: 'Review and consolidation',
            activities: ['Exit ticket', 'Next lesson preview']
          }
        ],
        resources: [
          `${planForm.topic} worksheets`,
          'Interactive whiteboard materials',
          'Manipulatives and visual aids',
          'Assessment rubric'
        ],
        assessment: [
          'Formative: Observation during activities',
          'Formative: Exit ticket responses',
          'Summative: End of lesson quiz'
        ],
        differentiation: {
          support: [
            'Visual aids and graphic organizers',
            'Peer support partnerships',
            'Simplified language and examples'
          ],
          extension: [
            `Advanced ${planForm.topic} challenges`,
            'Research opportunities',
            'Leadership roles in group work'
          ]
        },
        generatedAt: new Date().toISOString(),
        status: 'generated'
      };

      setLessonPlans(prev => [newLesson, ...prev]);
      
      toast({
        title: "Lesson Plan Generated!",
        description: "Your AI-generated lesson plan is ready for review",
      });
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate lesson plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAssignment = async (fromLesson?: LessonPlan) => {
    setGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const questions: Question[] = [];
      let questionId = 1;
      
      // Generate different types of questions based on form settings
      if (assignmentForm.questionTypes.multipleChoice) {
        for (let i = 0; i < Math.floor(assignmentForm.questionCount / 2); i++) {
          questions.push({
            id: `q${questionId++}`,
            type: 'multiple-choice',
            question: fromLesson 
              ? `Which of the following best describes ${fromLesson.title.split(' - ')[0]}?`
              : `What is the main concept in this topic?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: 'Option A',
            marks: 2,
            skillLevel: 'Knowledge'
          });
        }
      }
      
      if (assignmentForm.questionTypes.shortAnswer) {
        for (let i = 0; i < Math.ceil(assignmentForm.questionCount / 2); i++) {
          questions.push({
            id: `q${questionId++}`,
            type: 'short-answer',
            question: fromLesson 
              ? `Explain how ${fromLesson.title.split(' - ')[0]} applies in real-world situations.`
              : `Explain the key concepts learned in today's lesson.`,
            marks: 5,
            skillLevel: 'Understanding'
          });
        }
      }

      const newAssignment: Assignment = {
        id: `assignment-${Date.now()}`,
        title: fromLesson 
          ? `${fromLesson.title} - ${assignmentForm.assignmentType}`
          : `Generated ${assignmentForm.assignmentType}`,
        type: assignmentForm.assignmentType as Assignment['type'],
        questions,
        rubric: assignmentForm.includeRubric ? [
          'Excellent (4): Complete understanding with detailed explanations',
          'Good (3): Good understanding with some detail',
          'Satisfactory (2): Basic understanding shown',
          'Needs Improvement (1): Limited understanding evident'
        ] : [],
        linkedToLesson: !!fromLesson,
        estimatedTime: assignmentForm.timeLimit,
        difficulty: assignmentForm.difficulty as Assignment['difficulty'],
        generatedAt: new Date().toISOString()
      };

      setAssignments(prev => [newAssignment, ...prev]);
      
      toast({
        title: "Assignment Generated!",
        description: `${assignmentForm.questionCount} questions created successfully`,
      });
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateRecap = async (lesson: LessonPlan) => {
    setGeneratingRecap(lesson.id);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Please log in to generate recaps');
      }

      // Prepare recap data
      const recapData = {
        lesson_topic: lesson.title.split(' - ')[0],
        subject: lesson.subject,
        grade: lesson.yearGroup,
        learning_objectives: lesson.learningObjectives.join(', '),
        lesson_points: lesson.lessonStructure.map(section => 
          `${section.name}: ${section.description}`
        ).join('; '),
        homework: lesson.assessment.join(', '),
        lesson_date: new Date().toLocaleDateString(),
        language: 'English'
      };

      const { data, error } = await supabase.functions.invoke('generate-lesson-recap', {
        body: recapData,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      // Update lesson plan with generated recap
      setLessonPlans(prev => prev.map(plan => 
        plan.id === lesson.id 
          ? { ...plan, recap: data.recap }
          : plan
      ));

      toast({
        title: "Lesson Recap Generated!",
        description: "Student-friendly recap created successfully",
      });

    } catch (error: any) {
      console.error('Error generating recap:', error);
      toast({
        title: "Failed to Generate Recap",
        description: error.message || "Please check your API key configuration and try again",
        variant: "destructive"
      });
    } finally {
      setGeneratingRecap(null);
    }
  };

  const handleCopyRecap = async (recap: string) => {
    try {
      await navigator.clipboard.writeText(recap);
      toast({
        title: "Copied to Clipboard",
        description: "Lesson recap copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            AI Lesson Planner & Assignment Generator
            <Badge className="bg-warning text-warning-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </h2>
          <p className="text-muted-foreground">Generate comprehensive lesson plans and assignments using AI - curriculum independent</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Smart Generation
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Curriculum Agnostic
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative">
          <TabsList className="grid w-full grid-cols-5 relative overflow-x-auto scrollbar-hide">
            <TabsTrigger 
              value="planner" 
              className="flex items-center gap-2 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-t-full transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              Smart Planner
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="flex items-center gap-2 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-t-full transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              AI Assignments
            </TabsTrigger>
            <TabsTrigger 
              value="generated" 
              className="flex items-center gap-2 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-t-full transition-all duration-200"
            >
              <Clock className="h-4 w-4" />
              Generated Content
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-t-full transition-all duration-200"
            >
              <Brain className="h-4 w-4" />
              Predictive Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="flex items-center gap-2 relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-t-full transition-all duration-200"
            >
              <Sparkles className="h-4 w-4" />
              Smart Resources
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="planner">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lesson Plan Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Create Lesson Plan
                </CardTitle>
                <CardDescription>
                  Enter basic information and let AI generate a comprehensive lesson plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic">Topic/Title</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Fractions, Photosynthesis, The Romans"
                      value={planForm.topic}
                      onChange={(e) => setPlanForm(prev => ({...prev, topic: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={planForm.subject} onValueChange={(value) => setPlanForm(prev => ({...prev, subject: value}))}>
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
                        <SelectItem value="PE">Physical Education</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Computing">Computing</SelectItem>
                        <SelectItem value="Languages">Modern Languages</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearGroup">Year Group/Grade</Label>
                    <Select value={planForm.yearGroup} onValueChange={(value) => setPlanForm(prev => ({...prev, yearGroup: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reception">Reception</SelectItem>
                        <SelectItem value="Year 1">Year 1</SelectItem>
                        <SelectItem value="Year 2">Year 2</SelectItem>
                        <SelectItem value="Year 3">Year 3</SelectItem>
                        <SelectItem value="Year 4">Year 4</SelectItem>
                        <SelectItem value="Year 5">Year 5</SelectItem>
                        <SelectItem value="Year 6">Year 6</SelectItem>
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
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select value={planForm.duration.toString()} onValueChange={(value) => setPlanForm(prev => ({...prev, duration: parseInt(value)}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priorKnowledge">Prior Knowledge/Prerequisites</Label>
                  <Textarea
                    id="priorKnowledge"
                    placeholder="What should students already know? Any previous lessons to build on?"
                    value={planForm.priorKnowledge}
                    onChange={(e) => setPlanForm(prev => ({...prev, priorKnowledge: e.target.value}))}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="learningObjectives">Specific Learning Goals (Optional)</Label>
                  <Textarea
                    id="learningObjectives"
                    placeholder="What specific outcomes do you want? Leave blank for AI to generate..."
                    value={planForm.learningObjectives}
                    onChange={(e) => setPlanForm(prev => ({...prev, learningObjectives: e.target.value}))}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teachingApproach">Teaching Approach</Label>
                    <Select value={planForm.teachingApproach} onValueChange={(value) => setPlanForm(prev => ({...prev, teachingApproach: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed/Balanced</SelectItem>
                        <SelectItem value="direct">Direct Instruction</SelectItem>
                        <SelectItem value="inquiry">Inquiry-Based</SelectItem>
                        <SelectItem value="collaborative">Collaborative Learning</SelectItem>
                        <SelectItem value="hands-on">Hands-On/Practical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox 
                      id="specialNeeds"
                      checked={planForm.specialNeeds}
                      onCheckedChange={(checked) => setPlanForm(prev => ({...prev, specialNeeds: !!checked}))}
                    />
                    <Label htmlFor="specialNeeds">Include SEN support</Label>
                  </div>
                </div>

                <Separator />

                <Button 
                  onClick={handleGenerateLesson} 
                  disabled={generating}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Lesson Plan...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate AI Lesson Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Start Templates
                </CardTitle>
                <CardDescription>
                  Use these templates for common lesson types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Introduction Lesson", desc: "Introducing a new topic", icon: "🌟" },
                  { title: "Practice & Consolidation", desc: "Reinforcing previous learning", icon: "💪" },
                  { title: "Assessment Lesson", desc: "Testing understanding", icon: "📝" },
                  { title: "Review & Revision", desc: "Preparing for exams", icon: "🔄" },
                  { title: "Practical Investigation", desc: "Hands-on exploration", icon: "🔬" },
                  { title: "Creative Project", desc: "Student-led creation", icon: "🎨" }
                ].map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => {
                      setPlanForm(prev => ({
                        ...prev,
                        topic: template.title,
                        learningObjectives: template.desc
                      }));
                    }}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 font-medium">
                        <span>{template.icon}</span>
                        {template.title}
                      </div>
                      <p className="text-xs text-muted-foreground">{template.desc}</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignment Generation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate Assignment
                </CardTitle>
                <CardDescription>
                  Create homework, classwork, or assessments with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignmentType">Assignment Type</Label>
                    <Select value={assignmentForm.assignmentType} onValueChange={(value) => setAssignmentForm(prev => ({...prev, assignmentType: value}))}>
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
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={assignmentForm.difficulty} onValueChange={(value) => setAssignmentForm(prev => ({...prev, difficulty: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Select value={assignmentForm.questionCount.toString()} onValueChange={(value) => setAssignmentForm(prev => ({...prev, questionCount: parseInt(value)}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 questions</SelectItem>
                        <SelectItem value="5">5 questions</SelectItem>
                        <SelectItem value="10">10 questions</SelectItem>
                        <SelectItem value="15">15 questions</SelectItem>
                        <SelectItem value="20">20 questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeLimit">Estimated Time (min)</Label>
                    <Select value={assignmentForm.timeLimit.toString()} onValueChange={(value) => setAssignmentForm(prev => ({...prev, timeLimit: parseInt(value)}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Question Types</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mcq"
                        checked={assignmentForm.questionTypes.multipleChoice}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({
                          ...prev, 
                          questionTypes: {...prev.questionTypes, multipleChoice: !!checked}
                        }))}
                      />
                      <Label htmlFor="mcq">Multiple Choice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="shortAnswer"
                        checked={assignmentForm.questionTypes.shortAnswer}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({
                          ...prev, 
                          questionTypes: {...prev.questionTypes, shortAnswer: !!checked}
                        }))}
                      />
                      <Label htmlFor="shortAnswer">Short Answer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="essay"
                        checked={assignmentForm.questionTypes.essay}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({
                          ...prev, 
                          questionTypes: {...prev.questionTypes, essay: !!checked}
                        }))}
                      />
                      <Label htmlFor="essay">Essay Questions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="practical"
                        checked={assignmentForm.questionTypes.practical}
                        onCheckedChange={(checked) => setAssignmentForm(prev => ({
                          ...prev, 
                          questionTypes: {...prev.questionTypes, practical: !!checked}
                        }))}
                      />
                      <Label htmlFor="practical">Practical Tasks</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeRubric"
                    checked={assignmentForm.includeRubric}
                    onCheckedChange={(checked) => setAssignmentForm(prev => ({...prev, includeRubric: !!checked}))}
                  />
                  <Label htmlFor="includeRubric">Generate marking rubric</Label>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button 
                    onClick={() => handleGenerateAssignment()}
                    disabled={generating}
                    className="w-full"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Assignment...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Standalone Assignment
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Or generate from an existing lesson plan in the "Generated Content" tab
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Assignment Features
                </CardTitle>
                <CardDescription>
                  Advanced capabilities powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      icon: <Brain className="h-5 w-5 text-blue-500" />,
                      title: "Smart Question Generation",
                      desc: "AI creates varied questions at appropriate difficulty levels"
                    },
                    {
                      icon: <Target className="h-5 w-5 text-green-500" />,
                      title: "Bloom's Taxonomy Alignment",
                      desc: "Questions mapped to different cognitive skill levels"
                    },
                    {
                      icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
                      title: "Auto-Generated Rubrics",
                      desc: "Detailed marking schemes with clear criteria"
                    },
                    {
                      icon: <RefreshCw className="h-5 w-5 text-orange-500" />,
                      title: "Variation Generation",
                      desc: "Create multiple versions to prevent copying"
                    },
                    {
                      icon: <Users className="h-5 w-5 text-red-500" />,
                      title: "Differentiation Support",
                      desc: "Adaptive questions for different ability levels"
                    },
                    {
                      icon: <Clock className="h-5 w-5 text-cyan-500" />,
                      title: "Time Estimation",
                      desc: "Accurate completion time predictions"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {feature.icon}
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generated">
          <div className="space-y-6">
            {/* Generated Lesson Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Generated Lesson Plans ({lessonPlans.length})
                </CardTitle>
                <CardDescription>
                  AI-generated lesson plans ready for review and use
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lessonPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No lesson plans generated yet</p>
                    <p className="text-sm text-muted-foreground">Create your first AI lesson plan using the Lesson Planner tab</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessonPlans.map((lesson) => (
                      <div key={lesson.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {lesson.yearGroup} • {lesson.duration} minutes • {new Date(lesson.generatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={lesson.status === 'reviewed' ? 'default' : 'secondary'}>
                              {lesson.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateRecap(lesson)}
                              disabled={generatingRecap === lesson.id}
                            >
                              {generatingRecap === lesson.id ? (
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <MessageSquare className="h-3 w-3 mr-1" />
                              )}
                              {lesson.recap ? 'Regenerate Recap' : 'Generate Recap'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateAssignment(lesson)}
                              disabled={generating}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Generate Assignment
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-xs text-muted-foreground mb-1">LEARNING OBJECTIVES</p>
                            <ul className="text-xs space-y-1">
                              {lesson.learningObjectives.map((obj, i) => (
                                <li key={i}>• {obj}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-xs text-muted-foreground mb-1">LESSON STRUCTURE</p>
                            <div className="text-xs space-y-1">
                              {lesson.lessonStructure.map((section, i) => (
                                <div key={i}>
                                  <span className="font-medium">{section.name}</span> ({section.duration}min)
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-xs text-muted-foreground mb-1">RESOURCES</p>
                            <ul className="text-xs space-y-1">
                              {lesson.resources.slice(0, 3).map((resource, i) => (
                                <li key={i}>• {resource}</li>
                              ))}
                              {lesson.resources.length > 3 && (
                                <li className="text-muted-foreground">+ {lesson.resources.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        
                        {lesson.recap && (
                          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm text-primary flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Student Lesson Recap
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopyRecap(lesson.recap!)}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Share2 className="h-3 w-3 mr-1" />
                                  Share
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm whitespace-pre-wrap font-mono bg-background/50 p-3 rounded border">
                              {lesson.recap}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Assignments ({assignments.length})
                </CardTitle>
                <CardDescription>
                  AI-generated assignments and assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No assignments generated yet</p>
                    <p className="text-sm text-muted-foreground">Create your first AI assignment using the Assignment Generator tab</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {assignment.questions.length} questions • {assignment.estimatedTime} min • {assignment.difficulty}
                              {assignment.linkedToLesson && (
                                <Badge variant="outline" className="ml-2">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Linked to Lesson
                                </Badge>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              assignment.type === 'homework' ? 'bg-blue-100 text-blue-800' :
                              assignment.type === 'assessment' ? 'bg-red-100 text-red-800' :
                              assignment.type === 'project' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {assignment.type}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-medium text-xs text-muted-foreground mb-2">QUESTIONS PREVIEW</p>
                          <div className="space-y-2">
                            {assignment.questions.slice(0, 2).map((question, i) => (
                              <div key={i} className="text-xs border-l-2 border-gray-200 pl-3">
                                <span className="font-medium">Q{i + 1} ({question.type}): </span>
                                {question.question}
                                <span className="text-muted-foreground ml-2">[{question.marks} marks]</span>
                              </div>
                            ))}
                            {assignment.questions.length > 2 && (
                              <p className="text-xs text-muted-foreground pl-3">+ {assignment.questions.length - 2} more questions...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Configuration & Settings
              </CardTitle>
              <CardDescription>
                Configure AI models and generation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-warning/10 border border-warning rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <h4 className="font-medium">AI API Configuration Required</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This feature requires AI API keys to be configured by an administrator. 
                  The keys are securely stored and managed through Supabase Edge Functions.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Supported AI Services:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• OpenAI GPT-4 (Recommended for lesson planning)</li>
                    <li>• Anthropic Claude (Good for detailed explanations)</li>
                    <li>• Google Gemini (Cost-effective option)</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Generation Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Default Lesson Duration</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Assignment Complexity</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="complex">Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="includeExtension" defaultChecked />
                      <Label htmlFor="includeExtension">Always include extension activities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="senSupport" defaultChecked />
                      <Label htmlFor="senSupport">Auto-generate SEN support strategies</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Quality Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>AI Model Temperature</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative">Creative (0.9)</SelectItem>
                          <SelectItem value="balanced">Balanced (0.7)</SelectItem>
                          <SelectItem value="focused">Focused (0.3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Response Length</Label>
                      <Select defaultValue="detailed">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="autoReview" />
                      <Label htmlFor="autoReview">Enable AI self-review</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="saveTemplates" defaultChecked />
                      <Label htmlFor="saveTemplates">Save as reusable templates</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Usage Statistics</h4>
                  <p className="text-sm text-muted-foreground">
                    Generated: {lessonPlans.length} lesson plans, {assignments.length} assignments
                  </p>
                </div>
                <Button variant="outline">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Predictive Analytics Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-full mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Predictive Analytics</h2>
              <p className="text-muted-foreground">AI-powered insights for lesson planning optimization</p>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">87%</p>
                      <p className="text-sm text-muted-foreground">Student Engagement Score</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">73%</p>
                      <p className="text-sm text-muted-foreground">Concept Mastery Prediction</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">12</p>
                      <p className="text-sm text-muted-foreground">At-Risk Students</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Outcome Predictions
                </CardTitle>
                <CardDescription>AI predictions for upcoming lesson topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: "Quadratic Equations", difficulty: "High", prediction: "68% mastery", risk: "Medium", recommendation: "Add visual examples" },
                    { topic: "Photosynthesis", difficulty: "Medium", prediction: "82% mastery", risk: "Low", recommendation: "Continue current approach" },
                    { topic: "World War II", difficulty: "Medium", prediction: "75% mastery", risk: "Low", recommendation: "Include primary sources" },
                    { topic: "Chemical Bonding", difficulty: "High", prediction: "61% mastery", risk: "High", recommendation: "Extend practice time" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.topic}</h4>
                        <p className="text-sm text-muted-foreground">Difficulty: {item.difficulty}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{item.prediction}</p>
                          <p className="text-muted-foreground">Expected Mastery</p>
                        </div>
                        <Badge variant={item.risk === 'High' ? 'destructive' : item.risk === 'Medium' ? 'secondary' : 'default'}>
                          {item.risk} Risk
                        </Badge>
                        <div className="max-w-48">
                          <p className="text-muted-foreground">{item.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Performance Insights
                </CardTitle>
                <CardDescription>Individual student predictions and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", class: "Year 9A", risk: "High", strength: "Visual Learning", weakness: "Abstract Concepts", suggestion: "Use more diagrams and real-world examples" },
                    { name: "Michael Chen", class: "Year 9B", risk: "Medium", strength: "Problem Solving", weakness: "Reading Comprehension", suggestion: "Provide shorter, clearer instructions" },
                    { name: "Emma Watson", class: "Year 9A", risk: "Low", strength: "Critical Thinking", weakness: "Time Management", suggestion: "Offer additional practice with timed exercises" }
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.class}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant={student.risk === 'High' ? 'destructive' : student.risk === 'Medium' ? 'secondary' : 'default'}>
                          {student.risk} Risk
                        </Badge>
                        <div className="max-w-64">
                          <p className="font-medium">Strength: {student.strength}</p>
                          <p className="text-muted-foreground">Suggestion: {student.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="space-y-6">
            {/* Auto-Resource Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Smart Resource Integration
                </CardTitle>
                <CardDescription>
                  AI-powered resource discovery and embedding from verified educational databases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resource Search Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resourceTopic">Topic/Subject</Label>
                    <Input
                      id="resourceTopic"
                      placeholder="Enter topic to find resources..."
                      value={planForm.topic}
                      onChange={(e) => setPlanForm(prev => ({...prev, topic: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resourceType">Resource Type</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Resources</SelectItem>
                        <SelectItem value="videos">Educational Videos</SelectItem>
                        <SelectItem value="worksheets">Worksheets & Activities</SelectItem>
                        <SelectItem value="simulations">Interactive Simulations</SelectItem>
                        <SelectItem value="assessments">Assessment Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Searching Resources",
                    description: "Finding relevant educational content from verified databases...",
                  });
                }}>
                  <Target className="h-4 w-4 mr-2" />
                  Find Smart Resources
                </Button>

                {/* Integrated Resource Platforms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Khan Academy",
                      type: "Educational Videos & Exercises",
                      count: "15+ matches",
                      color: "bg-green-100 text-green-800"
                    },
                    {
                      name: "BBC Bitesize",
                      type: "Interactive Content",
                      count: "8+ matches",
                      color: "bg-blue-100 text-blue-800"
                    },
                    {
                      name: "YouTube EDU",
                      type: "Curated Educational Videos",
                      count: "25+ matches",
                      color: "bg-red-100 text-red-800"
                    }
                  ].map((platform, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{platform.name}</h4>
                          <Badge className={platform.color}>{platform.count}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{platform.type}</p>
                        <Button variant="outline" size="sm" className="mt-2 w-full">
                          <Eye className="h-3 w-3 mr-1" />
                          View Resources
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Resource Embedding Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resource Embedding Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Auto-Embed in Lessons",
                          description: "Automatically include relevant resources in lesson plans",
                          enabled: true
                        },
                        {
                          title: "Quality Verification",
                          description: "Only include resources from verified educational databases",
                          enabled: true
                        },
                        {
                          title: "Age-Appropriate Filter",
                          description: "Filter content based on year group and maturity level",
                          enabled: true
                        },
                        {
                          title: "Curriculum Alignment",
                          description: "Match resources to specific curriculum objectives",
                          enabled: false
                        }
                      ].map((option, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{option.title}</h4>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          <Switch checked={option.enabled} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recently Found Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recently Found Resources</CardTitle>
                    <CardDescription>AI-suggested resources for your recent lesson topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Photosynthesis Interactive Simulation",
                          source: "Khan Academy",
                          type: "Interactive",
                          subject: "Science",
                          rating: "4.8/5"
                        },
                        {
                          title: "World War II Primary Sources Collection",
                          source: "BBC Bitesize",
                          type: "Document Set",
                          subject: "History",
                          rating: "4.9/5"
                        },
                        {
                          title: "Fractions Visualization Tool",
                          source: "YouTube EDU",
                          type: "Video Series",
                          subject: "Mathematics",
                          rating: "4.7/5"
                        }
                      ].map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{resource.title}</h4>
                              <Badge variant="outline">{resource.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {resource.source} • {resource.subject} • {resource.rating}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Lesson
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Guide Section */}
      <div className="mt-12">
        <UserGuide 
          moduleName={userGuides.academics.moduleName}
          sections={userGuides.academics.sections}
          quickActions={userGuides.academics.quickActions}
        />
      </div>
    </div>
  );
};