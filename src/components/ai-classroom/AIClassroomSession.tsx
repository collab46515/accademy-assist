import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, MicOff, Video, VideoOff, Volume2, Phone, Settings, 
  Brain, Users, Target, Zap, Lightbulb, Eye, Sparkles, 
  Presentation, Bot, AlertCircle, Clock, BarChart3, 
  Palette, Play, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Import existing components
import { InteractiveWhiteboard } from '@/components/communication/InteractiveWhiteboard';
import { AITeachingAssistant } from './AITeachingAssistant';
import { DynamicContentGenerator } from './DynamicContentGenerator';
import { StudentAnalyticsDashboard } from './StudentAnalyticsDashboard';
import { AIClassroomManager } from './AIClassroomManager';
import { CreativeAIFeatures } from './CreativeAIFeatures';
import { VoiceControls } from './VoiceControls';
import { DemoNotificationBanner } from './DemoNotificationBanner';

// Import new components
import { ClassroomHeader } from './ClassroomHeader';
import { ClassroomControls } from './ClassroomControls';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  hasAudio: boolean;
  hasVideo: boolean;
  isHandRaised: boolean;
  handRaisedAt?: Date;
  attentionStatus: 'focused' | 'distracted' | 'away';
  participationScore: number;
  joinedAt: Date;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  comprehensionLevel: number;
  engagementScore: number;
  aiInteractions: number;
  strugglingTopics: string[];
  strengths: string[];
}

interface AIInsight {
  id: string;
  type: 'learning_style' | 'attention' | 'risk_prediction' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  studentId?: string;
  actionable: boolean;
  timestamp: Date;
  confidence: number;
}

interface AIClassroomSessionProps {
  roomId: string;
  userRole: 'teacher' | 'student';
  userName: string;
  userId: string;
  lessonTitle?: string;
  isDemoMode?: boolean;
}

export const AIClassroomSession: React.FC<AIClassroomSessionProps> = ({
  roomId,
  userRole,
  userName,
  userId,
  lessonTitle = "AI-Enhanced Mathematics - Algebra Fundamentals",
  isDemoMode = false
}) => {
  // Enhanced student data with AI metrics (enhanced for demo mode)
  const [students, setStudents] = useState<Student[]>(
    isDemoMode ? [
      {
        id: '1',
        name: 'Sarah Johnson (Demo)',
        hasAudio: false,
        hasVideo: true,
        isHandRaised: true,
        handRaisedAt: new Date(Date.now() - 2000),
        attentionStatus: 'focused',
        participationScore: 85,
        joinedAt: new Date(Date.now() - 300000),
        learningStyle: 'visual',
        comprehensionLevel: 78,
        engagementScore: 92,
        aiInteractions: 12,
        strugglingTopics: ['quadratic formulas'],
        strengths: ['graphing', 'basic algebra']
      },
      {
        id: '2', 
        name: 'Mike Chen (Demo)',
        hasAudio: true,
        hasVideo: false,
        isHandRaised: false,
        attentionStatus: 'focused',
        participationScore: 92,
        joinedAt: new Date(Date.now() - 280000),
        learningStyle: 'auditory',
        comprehensionLevel: 94,
        engagementScore: 88,
        aiInteractions: 8,
        strugglingTopics: [],
        strengths: ['problem solving', 'logical reasoning']
      },
      {
        id: '3',
        name: 'Emma Davis (Demo)',
        hasAudio: false,
        hasVideo: true,
        isHandRaised: true,
        handRaisedAt: new Date(Date.now() - 5000),
        attentionStatus: 'distracted',
        participationScore: 67,
        joinedAt: new Date(Date.now() - 250000),
        learningStyle: 'kinesthetic',
        comprehensionLevel: 58,
        engagementScore: 72,
        aiInteractions: 15,
        strugglingTopics: ['algebraic manipulation', 'word problems'],
        strengths: ['geometric concepts']
      },
      {
        id: '4',
        name: 'Alex Thompson (Demo)',
        hasAudio: true,
        hasVideo: true,
        isHandRaised: false,
        attentionStatus: 'focused',
        participationScore: 88,
        joinedAt: new Date(Date.now() - 320000),
        learningStyle: 'mixed',
        comprehensionLevel: 89,
        engagementScore: 95,
        aiInteractions: 6,
        strugglingTopics: [],
        strengths: ['analytical thinking', 'pattern recognition']
      },
      {
        id: '5',
        name: 'Lisa Park (Demo)',
        hasAudio: false,
        hasVideo: true,
        isHandRaised: false,
        attentionStatus: 'away',
        participationScore: 45,
        joinedAt: new Date(Date.now() - 200000),
        learningStyle: 'visual',
        comprehensionLevel: 62,
        engagementScore: 55,
        aiInteractions: 20,
        strugglingTopics: ['basic operations', 'word problems'],
        strengths: ['memorization']
      }
    ] : [
      {
        id: '1',
        name: 'Sarah Johnson',
        hasAudio: false,
        hasVideo: true,
        isHandRaised: true,
        handRaisedAt: new Date(Date.now() - 2000),
        attentionStatus: 'focused',
        participationScore: 85,
        joinedAt: new Date(Date.now() - 300000),
        learningStyle: 'visual',
        comprehensionLevel: 78,
        engagementScore: 92,
        aiInteractions: 12,
        strugglingTopics: ['quadratic formulas'],
        strengths: ['graphing', 'basic algebra']
      },
      {
        id: '2', 
        name: 'Mike Chen',
        hasAudio: true,
        hasVideo: false,
        isHandRaised: false,
        attentionStatus: 'focused',
        participationScore: 92,
        joinedAt: new Date(Date.now() - 280000),
        learningStyle: 'auditory',
        comprehensionLevel: 94,
        engagementScore: 88,
        aiInteractions: 8,
        strugglingTopics: [],
        strengths: ['problem solving', 'logical reasoning']
      },
      {
        id: '3',
        name: 'Emma Davis',
        hasAudio: false,
        hasVideo: true,
        isHandRaised: true,
        handRaisedAt: new Date(Date.now() - 5000),
        attentionStatus: 'distracted',
        participationScore: 67,
        joinedAt: new Date(Date.now() - 250000),
        learningStyle: 'kinesthetic',
        comprehensionLevel: 58,
        engagementScore: 72,
        aiInteractions: 15,
        strugglingTopics: ['algebraic manipulation', 'word problems'],
        strengths: ['geometric concepts']
      }
    ]
  );

  // AI Teaching Assistant insights (different format)
  const [teachingInsights, setTeachingInsights] = useState<{
    id: string;
    type: 'comprehension' | 'engagement' | 'prediction' | 'suggestion';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    studentId?: string;
    actionable: boolean;
    timestamp: Date;
  }[]>([
    {
      id: '1',
      type: 'prediction',
      priority: 'high',
      message: 'Emma may need additional support with algebraic manipulation - consider providing visual aids',
      studentId: '3',
      actionable: true,
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '2',
      type: 'engagement',
      priority: 'medium',
      message: 'Class engagement dropped 12% during quadratic formula explanation - suggest interactive example',
      actionable: true,
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '3',
      type: 'suggestion',
      priority: 'low',
      message: 'Sarah shows strong visual learning preference - whiteboard exercises are highly effective',
      studentId: '1',
      actionable: false,
      timestamp: new Date(Date.now() - 90000)
    }
  ]);

  // AI Insights for StudentAnalyticsDashboard  
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'risk_prediction',
      priority: 'high',
      message: 'Emma Davis (Demo) showing signs of disengagement - recommend immediate intervention with visual aids',
      studentId: '3',
      actionable: true,
      timestamp: new Date(Date.now() - 30000),
      confidence: 89
    },
    {
      id: '2',
      type: 'attention',
      priority: 'medium',
      message: 'Class attention dropped 15% during quadratic formula explanation - suggest interactive demonstration',
      actionable: true,
      timestamp: new Date(Date.now() - 60000),
      confidence: 94
    },
    {
      id: '3',
      type: 'recommendation',
      priority: 'low',
      message: 'Mike Chen (Demo) shows exceptional audio learning preference - increase verbal explanations',
      studentId: '2',
      actionable: false,
      timestamp: new Date(Date.now() - 90000),
      confidence: 96
    },
    {
      id: '4',
      type: 'learning_style',
      priority: 'medium',
      message: 'Lisa Park (Demo) requires more structured approach - break down complex problems into smaller steps',
      studentId: '5',
      actionable: true,
      timestamp: new Date(Date.now() - 120000),
      confidence: 87
    }
  ]);

  // Enhanced classroom metrics for demo
  const [classroomMetrics, setClassroomMetrics] = useState({
    totalStudents: isDemoMode ? 5 : 3,
    activeStudents: isDemoMode ? 4 : 3,
    averageEngagement: isDemoMode ? 78 : 84,
    averageComprehension: isDemoMode ? 76 : 77,
    handsRaised: isDemoMode ? 2 : 2,
    aiInterventions: isDemoMode ? 8 : 5,
    sessionDuration: '34:28',
    topicsCovered: isDemoMode ? 4 : 3,
    questionsAsked: isDemoMode ? 17 : 12,
    averageResponseTime: isDemoMode ? '2.4s' : '3.1s'
  });

  // Update metrics periodically for demo realism
  useEffect(() => {
    if (!isDemoMode) return;
    
    const interval = setInterval(() => {
      setClassroomMetrics(prev => ({
        ...prev,
        averageEngagement: Math.min(95, Math.max(65, prev.averageEngagement + (Math.random() - 0.5) * 4)),
        averageComprehension: Math.min(100, Math.max(60, prev.averageComprehension + (Math.random() - 0.5) * 3)),
        questionsAsked: prev.questionsAsked + (Math.random() > 0.7 ? 1 : 0),
        aiInterventions: prev.aiInterventions + (Math.random() > 0.85 ? 1 : 0)
      }));
      
      // Update student metrics randomly
      setStudents(prevStudents => 
        prevStudents.map(student => ({
          ...student,
          engagementScore: Math.min(100, Math.max(40, student.engagementScore + (Math.random() - 0.5) * 5)),
          comprehensionLevel: Math.min(100, Math.max(30, student.comprehensionLevel + (Math.random() - 0.5) * 4)),
          participationScore: Math.min(100, Math.max(20, student.participationScore + (Math.random() - 0.5) * 3)),
          attentionStatus: Math.random() > 0.8 ? 
            (['focused', 'distracted', 'away'] as const)[Math.floor(Math.random() * 3)] : 
            student.attentionStatus
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  // UI state
  const [activeAITab, setActiveAITab] = useState('assistant');
  const [aiSystemsActive, setAISystemsActive] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [autoInterventionEnabled, setAutoInterventionEnabled] = useState(true);
  const [classStartTime] = useState(new Date(Date.now() - 1800000));
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Voice controls integration - simplified fallback
  const voiceControls = {
    isVoiceEnabled: false,
    selectedVoice: 'alloy' as const,
    setIsVoiceEnabled: (enabled: boolean) => {
      console.log('Voice enabled:', enabled);
    },
    speakText: (text: string) => {
      console.log('Speaking text:', text);
    }
  };

  // AI metrics
  const [aiMetrics, setAIMetrics] = useState({
    totalInterventions: 23,
    successfulPredictions: 18,
    engagementImprovement: 15,
    comprehensionBoost: 22,
    adaptiveContentGenerated: 7,
    studentsSupportedToday: 12
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getClassDuration = () => {
    return Math.floor((Date.now() - classStartTime.getTime()) / 1000);
  };

  const getOverallEngagement = () => {
    return Math.round(students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length);
  };

  const getAverageComprehension = () => {
    return Math.round(students.reduce((sum, s) => sum + s.comprehensionLevel, 0) / students.length);
  };

  const getAtRiskStudents = () => {
    return students.filter(s => s.comprehensionLevel < 70 || s.engagementScore < 75);
  };

  const getPriorityInsights = () => {
    return aiInsights.filter(i => i.priority === 'high' || i.priority === 'critical');
  };

  // Click handlers
  const handleQuickQuiz = () => {
    console.log('Generating quick quiz...');
    // AI generates a quick quiz based on current topic
  };

  const handleIntervention = () => {
    console.log('Starting AI intervention...');
    // AI provides targeted support to struggling students
  };

  const handleViewAllInsights = () => {
    console.log('Viewing all AI insights...');
    setShowAIInsights(!showAIInsights);
  };

  const handleGenerateExample = () => {
    console.log('Generating AI example...');
    // AI creates a visual example for current concept
  };

  const handlePreviewExample = () => {
    console.log('Previewing example...');
    // Preview the generated example
  };

  const handleAIAssist = () => {
    console.log('Toggling AI whiteboard assist...');
    // Toggle AI whiteboard assistance
  };

  const handleEndSession = () => {
    console.log('Ending classroom session...');
    if (confirm('Are you sure you want to end this session?')) {
      // End the classroom session
      window.location.href = '/ai-classroom/dashboard';
    }
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Open AI classroom settings
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    if (command === 'create_quiz') {
      setActiveAITab('content');
      handleQuickQuiz();
    } else if (command === 'show_example') {
      handleGenerateExample();
    } else if (command.startsWith('explain:')) {
      const topic = command.replace('explain:', '').trim();
      voiceControls.speakText(`Let me explain ${topic}. This is an important concept that...`);
    } else if (command.startsWith('query:')) {
      const query = command.replace('query:', '').trim();
      // Send to AI assistant
      console.log('AI query:', query);
    }
  };

  const handleStudentUpdate = (studentId: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, ...updates } : s
    ));
  };

  const handleGroupsUpdate = (groups: any[]) => {
    console.log('Groups updated:', groups);
    // Handle breakout groups update
  };

  const handleStudentFocus = (studentId: string) => {
    console.log('Focusing on student:', studentId);
    // Implement student focus functionality
  };

  const handleInterventionTrigger = (type: string, studentId: string) => {
    console.log('Triggering intervention:', type, 'for student:', studentId);
    // Handle AI intervention
  };

  const handleFeatureActivate = (feature: string, config: any) => {
    console.log('Activating feature:', feature, config);
    // Handle creative AI feature activation
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Demo Mode Banner */}
      {isDemoMode && <DemoNotificationBanner />}

      {/* Demo Quick Actions - Repositioned to avoid overlap */}
      {isDemoMode && (
        <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
          <Card className="p-3 bg-white/95 backdrop-blur shadow-lg border border-gray-200 max-w-[200px]">
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-gray-900">🚀 Demo Actions</h4>
              <div className="space-y-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs py-1 h-7"
                  onClick={() => window.open('/landing', '_blank')}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Workflow Guide
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs py-1 h-7"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Share Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced Header */}
      <ClassroomHeader
        lessonTitle={lessonTitle}
        aiSystemsActive={aiSystemsActive}
        onAISystemsToggle={() => setAISystemsActive(!aiSystemsActive)}
        onQuickQuiz={handleQuickQuiz}
        onIntervention={handleIntervention}
        onViewAllInsights={handleViewAllInsights}
        formatTime={formatTime}
        getClassDuration={getClassDuration}
        getOverallEngagement={getOverallEngagement}
        getAverageComprehension={getAverageComprehension}
        studentsCount={students.length + 1}
        atRiskStudents={getAtRiskStudents()}
        priorityInsights={getPriorityInsights()}
      />

      {/* Main Content with Professional Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Central Lesson Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Presentation Area */}
          <div className="flex-1 relative m-4 mb-2 overflow-hidden">
            <div className="h-full bg-slate-900 relative rounded-lg shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center text-slate-300 max-w-lg">
                  <div className="p-4 rounded-full bg-slate-800/50 mb-4 inline-block">
                    <Presentation className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {isDemoMode ? '🚀 AI Demo Classroom' : 'AI-Enhanced Presentation'}
                  </h3>
                  <p className="text-sm opacity-75 mb-4">
                    {isDemoMode 
                      ? 'Experience live AI features - all components are fully functional!' 
                      : 'Interactive content with real-time AI assistance'
                    }
                  </p>
                  {isDemoMode && (
                    <div className="space-y-2">
                      <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 mr-2 mb-2">
                        ✓ AI Teaching Assistant
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 mr-2 mb-2">
                        ✓ Voice Controls
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 mr-2 mb-2">
                        ✓ Real-time Analytics
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Compact Status Overlays */}
              <div className="absolute top-4 left-4 space-y-2">
                <Card className="p-3 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Class Comprehension</span>
                  </div>
                  <Progress value={getAverageComprehension()} className="h-2 w-32" />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {getAverageComprehension()}% Understanding
                  </span>
                </Card>
              </div>

              {/* Compact AI Suggestions */}
              <div className="absolute top-4 right-4 w-72">
                <Card className="p-4 bg-white/95 backdrop-blur-sm border shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-sm">AI Suggestion</span>
                    <Badge variant="secondary" className="text-xs">Live</Badge>
                  </div>
                  <p className="text-sm mb-3">
                    3 students are struggling with the current concept. Consider using a visual demonstration.
                  </p>
                   <div className="flex gap-2">
                     <Button size="sm" className="flex-1" onClick={handleGenerateExample}>
                       <Sparkles className="h-3 w-3 mr-1" />
                       Generate Example
                     </Button>
                     <Button size="sm" variant="outline" onClick={handlePreviewExample}>
                       <Eye className="h-3 w-3" />
                     </Button>
                   </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Interactive Whiteboard - Improved Layout */}
          <div className="mx-4 mb-4">
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                  <div className="p-1 rounded bg-primary/10">
                    <Presentation className="h-4 w-4 text-primary" />
                  </div>
                  AI-Powered Collaborative Whiteboard
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-background">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Assist: On
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={handleAIAssist}>
                    <Sparkles className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="h-80">
                <InteractiveWhiteboard roomId={roomId} />
              </div>
            </div>
          </div>
        </div>

        {/* Right AI Panel - Fixed clickable tabs */}
        <div className="w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col shadow-sm">
          <Tabs value={activeAITab} onValueChange={setActiveAITab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 m-2 bg-muted">
              <TabsTrigger 
                value="assistant" 
                className="text-xs p-2 data-[state=active]:bg-white data-[state=active]:text-primary cursor-pointer"
              >
                <Brain className="h-3 w-3" />
                <span className="hidden lg:inline ml-1">AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="text-xs p-2 data-[state=active]:bg-white data-[state=active]:text-primary cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span className="hidden lg:inline ml-1">Content</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-xs p-2 data-[state=active]:bg-white data-[state=active]:text-primary cursor-pointer"
              >
                <BarChart3 className="h-3 w-3" />
                <span className="hidden lg:inline ml-1">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="management" 
                className="text-xs p-2 data-[state=active]:bg-white data-[state=active]:text-primary cursor-pointer"
              >
                <Users className="h-3 w-3" />
                <span className="hidden lg:inline ml-1">Manage</span>
              </TabsTrigger>
              <TabsTrigger 
                value="creative" 
                className="text-xs p-2 data-[state=active]:bg-white data-[state=active]:text-primary cursor-pointer"
              >
                <Palette className="h-3 w-3" />
                <span className="hidden lg:inline ml-1">Creative</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden min-h-0">
              <TabsContent value="assistant" className="h-full p-0 m-0 data-[state=inactive]:hidden">
                <AITeachingAssistant
                  roomId={roomId}
                  students={students}
                  userRole={userRole}
                  insights={teachingInsights}
                />
              </TabsContent>

              <TabsContent value="content" className="h-full p-0 m-0 data-[state=inactive]:hidden">
                <DynamicContentGenerator
                  roomId={roomId}
                  lessonTitle={lessonTitle}
                  students={students}
                  currentTopic="Quadratic Equations"
                />
              </TabsContent>

              <TabsContent value="analytics" className="h-full p-0 m-0 data-[state=inactive]:hidden">
                <StudentAnalyticsDashboard
                  students={students.map(s => ({
                    id: s.id,
                    name: s.name,
                    learningStyle: s.learningStyle,
                    attentionStatus: s.attentionStatus,
                    comprehensionLevel: s.comprehensionLevel,
                    engagementScore: s.engagementScore,
                    participationRate: s.participationScore,
                    strugglingTopics: s.strugglingTopics,
                    strengths: s.strengths,
                    riskLevel: s.comprehensionLevel < 50 ? 'critical' : s.comprehensionLevel < 70 ? 'high' : 'low',
                    aiInteractions: s.aiInteractions,
                    responseTime: [2000, 1800, 2200],
                    accuracy: [85, 78, 92]
                  }))}
                  insights={aiInsights}
                  metrics={{
                    classAverage: Math.round(students.reduce((sum, s) => sum + s.comprehensionLevel, 0) / students.length),
                    engagementTrend: 12,
                    atRiskCount: students.filter(s => s.comprehensionLevel < 70).length,
                    topPerformers: students.filter(s => s.comprehensionLevel > 85).length
                  }}
                  onStudentFocus={handleStudentFocus}
                  onInterventionTrigger={handleInterventionTrigger}
                />
              </TabsContent>

              <TabsContent value="management" className="h-full p-0 m-0 data-[state=inactive]:hidden">
                <AIClassroomManager
                  students={students.map(s => ({
                    id: s.id,
                    name: s.name,
                    learningStyle: s.learningStyle,
                    attentionStatus: s.attentionStatus,
                    comprehensionLevel: s.comprehensionLevel,
                    engagementScore: s.engagementScore,
                    participationScore: s.participationScore,
                    behaviorScore: s.participationScore,
                    strengths: s.strengths,
                    needsSupport: s.strugglingTopics,
                    isHandRaised: s.isHandRaised,
                    handRaisedAt: s.handRaisedAt
                  }))}
                  roomId={roomId}
                  userRole={userRole}
                  onStudentUpdate={handleStudentUpdate}
                  onGroupsUpdate={handleGroupsUpdate}
                />
              </TabsContent>

              <TabsContent value="creative" className="h-full p-0 m-0 data-[state=inactive]:hidden">
                <CreativeAIFeatures
                  roomId={roomId}
                  currentSubject="Mathematics"
                  lessonTheme={lessonTitle}
                  onFeatureActivate={handleFeatureActivate}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Voice Controls Panel */}
          <div className="p-4 border-t">
            <VoiceControls
              roomId={roomId}
              userRole={userRole}
              onTranscription={(text, isComplete) => {
                console.log('Voice transcription:', text, isComplete);
              }}
              onVoiceCommand={handleVoiceCommand}
              aiVoiceEnabled={voiceControls.isVoiceEnabled}
              selectedVoice={voiceControls.selectedVoice}
            />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <ClassroomControls
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        isVoiceEnabled={voiceControls.isVoiceEnabled}
        onMuteToggle={() => setIsMuted(!isMuted)}
        onCameraToggle={() => setIsCameraOn(!isCameraOn)}
        onVoiceToggle={() => voiceControls.setIsVoiceEnabled(!voiceControls.isVoiceEnabled)}
        onSettings={handleSettings}
        onEndSession={handleEndSession}
      />
    </div>
  );
};