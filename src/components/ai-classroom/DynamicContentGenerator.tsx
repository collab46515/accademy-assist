import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Zap,
  BookOpen,
  BarChart3,
  Clock,
  Target,
  CheckSquare,
  Plus,
  Eye,
  Play,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Brain,
  Lightbulb,
  PenTool,
  Image,
  Calculator,
  FileText,
  Award,
  Timer,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  comprehensionLevel: number;
  strugglingTopics: string[];
  strengths: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

interface GeneratedContent {
  id: string;
  type: 'example' | 'exercise' | 'quiz' | 'explanation';
  title: string;
  content: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  targetStudents: string[];
  generatedAt: Date;
  effectiveness: number;
  used: boolean;
  topic: string;
}

interface QuickQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  topic: string;
}

interface DynamicContentGeneratorProps {
  roomId: string;
  lessonTitle: string;
  students: Student[];
  currentTopic: string;
}

export const DynamicContentGenerator: React.FC<DynamicContentGeneratorProps> = ({
  roomId,
  lessonTitle,
  students,
  currentTopic
}) => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([
    {
      id: '1',
      type: 'example',
      title: 'Visual Quadratic Example',
      content: 'A ball is thrown upward with equation h = -16t² + 32t + 6...',
      difficulty: 'basic',
      targetStudents: ['3'],
      generatedAt: new Date(Date.now() - 300000),
      effectiveness: 87,
      used: true,
      topic: 'Quadratic Equations'
    },
    {
      id: '2',
      type: 'exercise',
      title: 'Interactive Factoring Practice',
      content: 'Factor these expressions: x² + 5x + 6, x² - 9, 2x² + 7x + 3...',
      difficulty: 'intermediate',
      targetStudents: ['1', '2'],
      generatedAt: new Date(Date.now() - 180000),
      effectiveness: 92,
      used: false,
      topic: 'Factoring'
    }
  ]);

  const [activeQuizzes, setActiveQuizzes] = useState<QuickQuiz[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStats, setGenerationStats] = useState({
    totalGenerated: 47,
    successRate: 94,
    avgTime: 3.2,
    studentsHelped: 28
  });

  const generateInstantQuiz = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newQuiz: QuickQuiz = {
        id: Date.now().toString(),
        question: "What is the vertex of the parabola y = x² - 4x + 3?",
        options: ["(2, -1)", "(-2, 1)", "(2, 1)", "(-2, -1)"],
        correctAnswer: 0,
        explanation: "Complete the square: y = (x-2)² - 1, so vertex is (2, -1)",
        difficulty: "intermediate",
        topic: currentTopic
      };

      setActiveQuizzes(prev => [...prev, newQuiz]);
      
      // Update stats
      setGenerationStats(prev => ({
        ...prev,
        totalGenerated: prev.totalGenerated + 1
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAdaptiveContent = async (contentType: string) => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const strugglingStudents = students.filter(s => s.comprehensionLevel < 70);
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType as any,
        title: `Adaptive ${contentType} - ${currentTopic}`,
        content: `AI-generated ${contentType} tailored for struggling students...`,
        difficulty: 'basic',
        targetStudents: strugglingStudents.map(s => s.id),
        generatedAt: new Date(),
        effectiveness: 0,
        used: false,
        topic: currentTopic
      };

      setGeneratedContent(prev => [...prev, newContent]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePersonalizedPractice = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const personalizedContent = students.map(student => ({
        id: `${Date.now()}-${student.id}`,
        type: 'exercise' as const,
        title: `Personal Practice - ${student.name}`,
        content: `Customized problems focusing on ${student.strugglingTopics.join(', ')} while leveraging ${student.strengths.join(', ')}`,
        difficulty: student.comprehensionLevel > 80 ? 'advanced' as const : 
                   student.comprehensionLevel > 60 ? 'intermediate' as const : 'basic' as const,
        targetStudents: [student.id],
        generatedAt: new Date(),
        effectiveness: 0,
        used: false,
        topic: currentTopic
      }));

      setGeneratedContent(prev => [...prev, ...personalizedContent]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'example': return <Lightbulb className="h-4 w-4" />;
      case 'exercise': return <PenTool className="h-4 w-4" />;
      case 'quiz': return <CheckSquare className="h-4 w-4" />;
      case 'explanation': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Dynamic Content Generator</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Zap className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time content generation based on student performance
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="generator" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="generator" className="text-xs">Generate</TabsTrigger>
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="px-4 pb-4 space-y-4">
            {/* Quick Generation Actions */}
            <div>
              <h4 className="text-sm font-medium mb-3">Instant Generation</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={generateInstantQuiz}
                  disabled={isGenerating}
                >
                  <CheckSquare className="h-4 w-4" />
                  <span className="text-xs">Quick Quiz</span>
                  <span className="text-xs text-muted-foreground">~10s</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={() => generateAdaptiveContent('example')}
                  disabled={isGenerating}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-xs">Example</span>
                  <span className="text-xs text-muted-foreground">~15s</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={() => generateAdaptiveContent('exercise')}
                  disabled={isGenerating}
                >
                  <PenTool className="h-4 w-4" />
                  <span className="text-xs">Exercise</span>
                  <span className="text-xs text-muted-foreground">~20s</span>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-16 flex-col gap-1"
                  onClick={generatePersonalizedPractice}
                  disabled={isGenerating}
                >
                  <Target className="h-4 w-4" />
                  <span className="text-xs">Personal</span>
                  <span className="text-xs text-muted-foreground">~30s</span>
                </Button>
              </div>
            </div>

            {/* Generation Status */}
            {isGenerating && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">AI Generating Content...</div>
                    <div className="text-xs text-blue-700">
                      Analyzing student performance and lesson context
                    </div>
                  </div>
                </div>
                <Progress value={33} className="mt-3" />
              </Card>
            )}

            <Separator />

            {/* Active Quiz Display */}
            {activeQuizzes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Active Quizzes</h4>
                <div className="space-y-3">
                  {activeQuizzes.slice(-2).map((quiz) => (
                    <Card key={quiz.id} className="p-3 border-green-200 bg-green-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium">{quiz.question}</div>
                          <div className="text-xs text-muted-foreground">
                            {quiz.topic} • {quiz.difficulty}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Live
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        {quiz.options.map((option, index) => (
                          <div key={index} className="text-xs p-2 bg-white rounded border">
                            {String.fromCharCode(65 + index)}) {option}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 h-7 text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Launch to Class
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            <div>
              <h4 className="text-sm font-medium mb-3">AI Suggestions</h4>
              <div className="space-y-2">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Comprehension Drop Detected</div>
                      <div className="text-xs text-orange-700 mb-2">
                        3 students struggling with current concept
                      </div>
                      <Button size="sm" className="h-6 text-xs">
                        Generate Simpler Example
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Engagement Opportunity</div>
                      <div className="text-xs text-blue-700 mb-2">
                        Perfect time for interactive content
                      </div>
                      <Button size="sm" className="h-6 text-xs">
                        Create Interactive Exercise
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Stats */}
            <div>
              <h4 className="text-sm font-medium mb-3">Today's Generation Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-slate-50 rounded">
                  <div className="font-semibold text-lg">{generationStats.totalGenerated}</div>
                  <div className="text-muted-foreground">Content Pieces</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded">
                  <div className="font-semibold text-lg">{generationStats.successRate}%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded">
                  <div className="font-semibold text-lg">{generationStats.avgTime}s</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded">
                  <div className="font-semibold text-lg">{generationStats.studentsHelped}</div>
                  <div className="text-muted-foreground">Students Helped</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="px-4 pb-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Generated Content Library</h4>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>

            <div className="space-y-3">
              {generatedContent.map((content) => (
                <Card key={content.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-primary/10 text-primary">
                      {getContentTypeIcon(content.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">{content.title}</div>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="secondary" 
                            className={getDifficultyColor(content.difficulty)}
                          >
                            {content.difficulty}
                          </Badge>
                          {content.used && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Used
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-2">
                        {content.content.substring(0, 60)}...
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="text-muted-foreground">
                          For {content.targetStudents.length} student(s) • {content.topic}
                        </div>
                        {content.effectiveness > 0 && (
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 text-yellow-500" />
                            <span>{content.effectiveness}%</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="flex-1 h-6 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-6 text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="px-4 pb-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Content Performance</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Quiz Completion Rate</span>
                  <span className="text-xs font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs">Exercise Effectiveness</span>
                  <span className="text-xs font-medium">89%</span>
                </div>
                <Progress value={89} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs">Example Clarity</span>
                  <span className="text-xs font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Generation Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Content Generated Today</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Average Generation Time</span>
                  <span className="font-medium">3.2s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Success Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Students Actively Helped</span>
                  <span className="font-medium">28</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Most Effective Content</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <div className="text-xs font-medium">Interactive Factoring</div>
                    <div className="text-xs text-muted-foreground">Exercise</div>
                  </div>
                  <div className="text-xs font-medium text-green-600">98%</div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div>
                    <div className="text-xs font-medium">Visual Quadratics</div>
                    <div className="text-xs text-muted-foreground">Example</div>
                  </div>
                  <div className="text-xs font-medium text-blue-600">95%</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};