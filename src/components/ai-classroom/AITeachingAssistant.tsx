import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Lightbulb,
  Target,
  MessageSquare,
  Volume2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  BookOpen,
  HelpCircle,
  Mic,
  Image,
  PenTool,
  Activity,
  Users,
  ArrowRight,
  Sparkles,
  Timer,
  Star,
  ThumbsUp,
  Plus,
  Settings
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  comprehensionLevel: number;
  engagementScore: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  strugglingTopics: string[];
  strengths: string[];
}

interface AIInsight {
  id: string;
  type: 'comprehension' | 'engagement' | 'prediction' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  studentId?: string;
  actionable: boolean;
  timestamp: Date;
}

interface AdaptiveExplanation {
  id: string;
  topic: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  format: 'text' | 'voice' | 'visual' | 'interactive';
  content: string;
  effectiveness: number;
  generatedFor: string[];
}

interface AITeachingAssistantProps {
  roomId: string;
  students: Student[];
  userRole: 'teacher' | 'student';
  insights: AIInsight[];
}

export const AITeachingAssistant: React.FC<AITeachingAssistantProps> = ({
  roomId,
  students,
  userRole,
  insights
}) => {
  const [adaptiveExplanations, setAdaptiveExplanations] = useState<AdaptiveExplanation[]>([
    {
      id: '1',
      topic: 'Quadratic Equations',
      difficulty: 'basic',
      format: 'visual',
      content: 'Think of a quadratic equation like a U-shaped curve. The highest or lowest point is called the vertex...',
      effectiveness: 87,
      generatedFor: ['3', '5']
    },
    {
      id: '2',
      topic: 'Factoring',
      difficulty: 'intermediate',
      format: 'interactive',
      content: 'Let\'s break down this expression step by step using our interactive factoring tool...',
      effectiveness: 92,
      generatedFor: ['1', '4']
    }
  ]);

  const [activeInterventions, setActiveInterventions] = useState([
    {
      id: '1',
      studentName: 'Emma Davis',
      issue: 'Struggling with algebraic manipulation',
      interventionType: 'Adaptive Explanation',
      status: 'active',
      startTime: new Date(Date.now() - 120000),
      progress: 45
    },
    {
      id: '2',
      studentName: 'Class Average',
      issue: 'Comprehension drop detected',
      interventionType: 'Alternative Approach',
      status: 'ready',
      startTime: new Date(),
      progress: 0
    }
  ]);

  const [aiCapabilities] = useState([
    {
      name: 'Adaptive Explanations',
      description: 'Adjusts complexity based on student understanding',
      status: 'active',
      successRate: 94,
      icon: <Brain className="h-4 w-4" />
    },
    {
      name: 'Multi-modal Help',
      description: 'Text, voice, visual, and interactive assistance',
      status: 'active',
      successRate: 89,
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      name: 'Proactive Intervention',
      description: 'Detects confusion before students ask for help',
      status: 'active',
      successRate: 91,
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'Context Awareness',
      description: 'Knows current lesson context and student history',
      status: 'active',
      successRate: 96,
      icon: <Eye className="h-4 w-4" />
    }
  ]);

  const generateAdaptiveExplanation = (topic: string, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const difficulty = student.comprehensionLevel > 80 ? 'advanced' : 
                     student.comprehensionLevel > 60 ? 'intermediate' : 'basic';
    
    const format = student.learningStyle === 'visual' ? 'visual' :
                  student.learningStyle === 'auditory' ? 'voice' : 'interactive';

    const newExplanation: AdaptiveExplanation = {
      id: Date.now().toString(),
      topic,
      difficulty,
      format,
      content: `Generating personalized ${format} explanation for ${student.name}...`,
      effectiveness: 0,
      generatedFor: [studentId]
    };

    setAdaptiveExplanations(prev => [...prev, newExplanation]);
  };

  const triggerProactiveIntervention = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const intervention = {
      id: Date.now().toString(),
      studentName: student.name,
      issue: `Comprehension level dropped to ${student.comprehensionLevel}%`,
      interventionType: 'Proactive Support',
      status: 'active',
      startTime: new Date(),
      progress: 0
    };

    setActiveInterventions(prev => [...prev, intervention]);
  };

  const getStrugglingStuents = () => {
    return students.filter(s => s.comprehensionLevel < 70);
  };

  const getHighPriorityInsights = () => {
    return insights.filter(i => i.priority === 'high' || i.priority === 'critical');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">AI Teaching Assistant</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time adaptive learning support and proactive interventions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="interventions" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="interventions" className="text-xs">Active</TabsTrigger>
            <TabsTrigger value="explanations" className="text-xs">Adaptive</TabsTrigger>
            <TabsTrigger value="capabilities" className="text-xs">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="interventions" className="px-4 pb-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Active Interventions</h4>
              <div className="space-y-3">
                {activeInterventions.map((intervention) => (
                  <Card key={intervention.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium">{intervention.studentName}</div>
                        <div className="text-xs text-muted-foreground">{intervention.issue}</div>
                      </div>
                      <Badge 
                        variant={intervention.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {intervention.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">{intervention.interventionType}</span>
                    </div>
                    
                    {intervention.status === 'active' && (
                      <>
                        <Progress value={intervention.progress} className="h-1 mb-2" />
                        <div className="text-xs text-muted-foreground mb-2">
                          Progress: {intervention.progress}%
                        </div>
                      </>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Priority Insights</h4>
              <div className="space-y-2">
                {getHighPriorityInsights().map((insight) => (
                  <div key={insight.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm">{insight.message}</div>
                        <div className="text-xs text-orange-700 mt-1">
                          {insight.type} • {insight.priority} priority
                        </div>
                      </div>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" className="mt-2 h-7 text-xs w-full">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Take Action
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {getStrugglingStuents().length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Students Needing Support</h4>
                  <div className="space-y-2">
                    {getStrugglingStuents().map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                        <div>
                          <div className="text-sm font-medium">{student.name}</div>
                          <div className="text-xs text-red-700">
                            {student.comprehensionLevel}% comprehension
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => triggerProactiveIntervention(student.id)}
                        >
                          <HelpCircle className="h-3 w-3 mr-1" />
                          Help
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="explanations" className="px-4 pb-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Adaptive Explanations</h4>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </div>
              
              <div className="space-y-3">
                {adaptiveExplanations.map((explanation) => (
                  <Card key={explanation.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium">{explanation.topic}</div>
                        <div className="text-xs text-muted-foreground">
                          {explanation.difficulty} level • {explanation.format} format
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{explanation.effectiveness}%</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">
                      {explanation.content.substring(0, 80)}...
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        For {explanation.generatedFor.length} student(s)
                      </div>
                      <div className="flex gap-1">
                        {explanation.format === 'voice' && <Volume2 className="h-3 w-3 text-blue-600" />}
                        {explanation.format === 'visual' && <Image className="h-3 w-3 text-green-600" />}
                        {explanation.format === 'interactive' && <PenTool className="h-3 w-3 text-purple-600" />}
                        {explanation.format === 'text' && <BookOpen className="h-3 w-3 text-gray-600" />}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Deliver
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Quick Adaptive Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Simplify
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Advance
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Image className="h-3 w-3 mr-1" />
                  Visualize
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Narrate
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="px-4 pb-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">AI Capabilities Status</h4>
              <div className="space-y-3">
                {aiCapabilities.map((capability, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded bg-primary/10 text-primary">
                        {capability.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">{capability.name}</div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {capability.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {capability.description}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Success Rate: {capability.successRate}%
                          </div>
                          <Progress value={capability.successRate} className="h-1 w-16" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Interventions Today</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Success Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Avg Response Time</span>
                  <span className="font-medium">0.3s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Students Helped</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                <Settings className="h-3 w-3 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};