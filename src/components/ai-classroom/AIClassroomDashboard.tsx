import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Sparkles,
  Users,
  BarChart3,
  Zap,
  BookOpen,
  Target,
  MessageSquare,
  Mic,
  Eye,
  TrendingUp,
  Play,
  Settings,
  Plus,
  Clock,
  Star,
  Activity,
  Award,
  Lightbulb,
  Gamepad2,
  Palette,
  Volume2,
  Camera,
  FileText
} from 'lucide-react';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'beta' | 'coming-soon';
  category: 'assistant' | 'content' | 'analysis' | 'management' | 'creative';
  capabilities: string[];
}

const aiFeatures: AIFeature[] = [
  // AI Teaching Assistant 2.0
  {
    id: 'adaptive-explanations',
    title: 'Adaptive Explanations',
    description: 'AI monitors comprehension and adjusts difficulty in real-time',
    icon: <Brain className="h-5 w-5" />,
    status: 'active',
    category: 'assistant',
    capabilities: ['Comprehension monitoring', 'Difficulty adjustment', 'Alternative examples']
  },
  {
    id: 'multimodal-help',
    title: 'Multi-modal Help',
    description: 'Text, voice, diagrams, and live whiteboard explanations',
    icon: <MessageSquare className="h-5 w-5" />,
    status: 'active',
    category: 'assistant',
    capabilities: ['Voice explanations', 'Visual diagrams', 'Interactive whiteboard', 'Text summaries']
  },
  {
    id: 'proactive-intervention',
    title: 'Proactive Intervention',
    description: 'Detects confusion and offers help before students ask',
    icon: <Target className="h-5 w-5" />,
    status: 'active',
    category: 'assistant',
    capabilities: ['Confusion detection', 'Proactive prompts', 'Smart recaps']
  },
  
  // Dynamic Content Generation
  {
    id: 'live-adaptation',
    title: 'Live Lesson Adaptation',
    description: 'Generates examples and exercises based on student performance',
    icon: <Zap className="h-5 w-5" />,
    status: 'active',
    category: 'content',
    capabilities: ['Dynamic examples', 'Adaptive exercises', 'Real-time content']
  },
  {
    id: 'instant-quizzes',
    title: 'Instant Quiz Creation',
    description: 'Creates assessments from lesson content in under 10 seconds',
    icon: <Sparkles className="h-5 w-5" />,
    status: 'active',
    category: 'content',
    capabilities: ['10-second generation', 'Auto-grading', 'Multiple formats']
  },
  {
    id: 'personalized-practice',
    title: 'Personalized Practice',
    description: 'Unique problems aligned with individual student weaknesses',
    icon: <BookOpen className="h-5 w-5" />,
    status: 'active',
    category: 'content',
    capabilities: ['Individual targeting', 'Weakness analysis', 'Adaptive difficulty']
  },

  // Intelligent Student Analysis
  {
    id: 'learning-styles',
    title: 'Learning Style Detection',
    description: 'Classifies visual, auditory, and kinesthetic learners',
    icon: <Eye className="h-5 w-5" />,
    status: 'active',
    category: 'analysis',
    capabilities: ['Style classification', 'Preference analysis', 'Adaptive delivery']
  },
  {
    id: 'attention-monitoring',
    title: 'Attention Monitoring',
    description: 'Privacy-safe engagement scoring and focus tracking',
    icon: <Activity className="h-5 w-5" />,
    status: 'active',
    category: 'analysis',
    capabilities: ['Engagement scoring', 'Focus tracking', 'Privacy-safe monitoring']
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics',
    description: 'Identifies at-risk students before they fall behind',
    icon: <TrendingUp className="h-5 w-5" />,
    status: 'active',
    category: 'analysis',
    capabilities: ['Risk prediction', 'Performance trends', 'Early intervention alerts']
  },

  // AI Classroom Management
  {
    id: 'smart-grouping',
    title: 'Smart Grouping',
    description: 'Optimal breakout assignments based on learning data',
    icon: <Users className="h-5 w-5" />,
    status: 'active',
    category: 'management',
    capabilities: ['Skill-based grouping', 'Personality matching', 'Mixed-strength teams']
  },
  {
    id: 'behavior-coaching',
    title: 'Behavior Coaching',
    description: 'Gentle nudges and focus reminders for students',
    icon: <Award className="h-5 w-5" />,
    status: 'active',
    category: 'management',
    capabilities: ['Private nudges', 'Participation prompts', 'Focus reminders']
  },
  {
    id: 'auto-differentiation',
    title: 'Automatic Differentiation',
    description: 'Same concept delivered at different difficulty levels',
    icon: <BarChart3 className="h-5 w-5" />,
    status: 'active',
    category: 'management',
    capabilities: ['Multi-level delivery', 'Skill adaptation', 'Individual pacing']
  },

  // Creative AI Features
  {
    id: 'ai-avatars',
    title: 'AI Tutor Avatars',
    description: 'Subject-specific visual AI assistants',
    icon: <Gamepad2 className="h-5 w-5" />,
    status: 'beta',
    category: 'creative',
    capabilities: ['Subject personalities', 'Visual characters', 'Interactive avatars']
  },
  {
    id: 'voice-cloning',
    title: 'Voice Cloning',
    description: 'Familiar voices for personalized AI tutors',
    icon: <Volume2 className="h-5 w-5" />,
    status: 'beta',
    category: 'creative',
    capabilities: ['Voice synthesis', 'Familiar tones', 'Comfort enhancement']
  },
  {
    id: 'story-learning',
    title: 'Story-Based Learning',
    description: 'Wraps lessons in engaging narratives and scenarios',
    icon: <Palette className="h-5 w-5" />,
    status: 'active',
    category: 'creative',
    capabilities: ['Narrative wrapping', 'Scenario creation', 'Engagement boost']
  }
];

const mockClassrooms = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    subject: 'Mathematics',
    students: 28,
    status: 'live',
    engagement: 94,
    aiFeatures: 8,
    nextSession: 'Now',
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    subject: 'Physics',
    students: 24,
    status: 'scheduled',
    engagement: 87,
    aiFeatures: 6,
    nextSession: '2:30 PM',
  },
  {
    id: '3',
    title: 'Chemistry Lab',
    subject: 'Chemistry',
    students: 22,
    status: 'completed',
    engagement: 91,
    aiFeatures: 7,
    nextSession: 'Tomorrow',
  }
];

export const AIClassroomDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'beta': return 'Beta';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  const filteredFeatures = selectedCategory === 'all' 
    ? aiFeatures 
    : aiFeatures.filter(f => f.category === selectedCategory);

  const startAISession = (classroomId: string) => {
    navigate(`/ai-classroom/session/${classroomId}`);
  };

  // Add click handlers for all buttons
  const handleConfigureFeature = (featureId: string, featureTitle: string) => {
    console.log(`Configuring AI feature: ${featureTitle}`, featureId);
    const feature = aiFeatures.find(f => f.id === featureId);
    if (feature) {
      setSelectedFeature(feature);
      setConfigDialogOpen(true);
    }
    toast({
      title: "Opening Configuration",
      description: `Configuring ${featureTitle}...`,
    });
  };

  const handleViewFeatureDocs = (featureId: string, featureTitle: string) => {
    console.log(`Viewing documentation for: ${featureTitle}`, featureId);
    toast({
      title: "Opening Documentation",
      description: `Loading docs for ${featureTitle}...`,
    });
  };

  const handleCreateClassroom = () => {
    console.log('Creating new AI classroom...');
    toast({
      title: "Creating AI Classroom",
      description: "Setting up your new AI-enhanced classroom...",
    });
  };

  const handleClassroomSettings = (classroomId: string, classroomTitle: string) => {
    console.log(`Opening settings for classroom: ${classroomTitle}`, classroomId);
    toast({
      title: "Opening Settings",
      description: `Configuring ${classroomTitle}...`,
    });
  };

  const handleSaveFeatureConfig = () => {
    if (selectedFeature) {
      toast({
        title: "Configuration Saved",
        description: `${selectedFeature.title} has been configured successfully.`,
      });
      setConfigDialogOpen(false);
      setSelectedFeature(null);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Brain className="h-10 w-10" />
              AI Classroom Suite
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Revolutionary AI-powered teaching and learning environment
            </p>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>15 AI Features</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>74 Active Students</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>94% Engagement</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 w-full"
                onClick={() => startAISession('1')}
              >
                <Play className="h-5 w-5 mr-2" />
                Start AI Session
              </Button>
              <Button 
                size="sm"
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 w-full"
                onClick={() => navigate('/', { state: { section: 'workflows', workflow: 'ai-classroom' } })}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Workflow Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">AI Features</TabsTrigger>
          <TabsTrigger value="classrooms">Active Classrooms</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Categories */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Features
            </Button>
            <Button
              variant={selectedCategory === 'assistant' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('assistant')}
            >
              <Brain className="h-4 w-4 mr-1" />
              AI Assistant
            </Button>
            <Button
              variant={selectedCategory === 'content' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('content')}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Content Gen
            </Button>
            <Button
              variant={selectedCategory === 'analysis' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('analysis')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button
              variant={selectedCategory === 'management' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('management')}
            >
              <Users className="h-4 w-4 mr-1" />
              Management
            </Button>
            <Button
              variant={selectedCategory === 'creative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('creative')}
            >
              <Palette className="h-4 w-4 mr-1" />
              Creative
            </Button>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => (
              <Card key={feature.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getStatusColor(feature.status)}`}
                  >
                    {getStatusLabel(feature.status)}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>

                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {feature.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleConfigureFeature(feature.id, feature.title)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewFeatureDocs(feature.id, feature.title)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classrooms" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active AI Classrooms</h2>
            <Button onClick={handleCreateClassroom}>
              <Plus className="h-4 w-4 mr-2" />
              Create AI Classroom
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClassrooms.map((classroom) => (
              <Card key={classroom.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{classroom.title}</h3>
                    <p className="text-sm text-muted-foreground">{classroom.subject}</p>
                  </div>
                  <Badge 
                    variant={classroom.status === 'live' ? 'default' : 'secondary'}
                    className={classroom.status === 'live' ? 'bg-green-500' : ''}
                  >
                    {classroom.status === 'live' ? '🔴 Live' : classroom.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Students
                    </span>
                    <span className="font-medium">{classroom.students}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Engagement</span>
                    <span className="font-medium">{classroom.engagement}%</span>
                  </div>
                  <Progress value={classroom.engagement} className="h-2" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Features Active
                    </span>
                    <span className="font-medium">{classroom.aiFeatures}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Next Session
                    </span>
                    <span className="font-medium">{classroom.nextSession}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => startAISession(classroom.id)}
                    disabled={classroom.status === 'completed'}
                  >
                    {classroom.status === 'live' ? 'Join Session' : 'Start Session'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleClassroomSettings(classroom.id, classroom.title)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">AI Performance Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Accuracy</p>
                  <p className="text-2xl font-bold">96.2%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">0.3s</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Interventions</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">94.8%</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent AI Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Proactive Intervention Success</p>
                  <p className="text-sm text-muted-foreground">
                    AI detected 23 struggling students and provided timely help, improving their performance by 18%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Dynamic Content Generation</p>
                  <p className="text-sm text-muted-foreground">
                    Generated 156 personalized exercises today, with 92% student satisfaction
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Smart Grouping Optimization</p>
                  <p className="text-sm text-muted-foreground">
                    AI-optimized groups showed 26% better collaboration scores than manual assignments
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeature?.icon}
              Configure {selectedFeature?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedFeature?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Current Status</h4>
              <Badge 
                className={`text-white ${getStatusColor(selectedFeature?.status || 'active')}`}
              >
                {getStatusLabel(selectedFeature?.status || 'active')}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Capabilities</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedFeature?.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Configuration Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
                  <div>
                    <p className="font-medium">Enable Feature</p>
                    <p className="text-sm text-muted-foreground">Turn this AI feature on or off</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {selectedFeature?.status === 'active' ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
                  <div>
                    <p className="font-medium">Sensitivity Level</p>
                    <p className="text-sm text-muted-foreground">Adjust AI responsiveness</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Medium
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts when AI takes action</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1" 
              onClick={handleSaveFeatureConfig}
            >
              <Settings className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setConfigDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};