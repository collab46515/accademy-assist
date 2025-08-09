import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ContactModal } from '@/components/landing/ContactModal';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Brain,
  Mic,
  Eye,
  BookOpen,
  MessageSquare,
  BarChart3,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Volume2,
  Camera,
  FileText,
  Activity,
  Award,
  Lightbulb,
  Monitor,
  Headphones,
  Star,
  TrendingUp
} from 'lucide-react';

const ProcessStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  color = "blue",
  isActive = false 
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color?: string;
  isActive?: boolean;
}) => (
  <div className={`relative p-6 rounded-xl border-2 transition-all ${
    isActive 
      ? `border-${color}-300 bg-${color}-50 shadow-lg` 
      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
  }`}>
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center ${
        isActive ? 'ring-4 ring-blue-200' : ''
      }`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={isActive ? "default" : "secondary"} className="text-xs font-semibold">
            Step {number}
          </Badge>
          <h3 className={`text-lg font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
        <p className={`leading-relaxed ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

const FeatureHighlight = ({ 
  icon: Icon, 
  title, 
  description, 
  badge,
  color = "blue" 
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  badge?: string;
  color?: string;
}) => (
  <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const UserJourney = ({ userType }: { userType: 'teacher' | 'student' }) => {
  const teacherSteps = [
    {
      number: 1,
      title: "Create or Join Classroom",
      description: "Teacher sets up an AI-enhanced session with lesson materials. The system automatically prepares personalized content for different learning styles.",
      icon: Users,
      color: "blue"
    },
    {
      number: 2,
      title: "AI Assistant Activation",
      description: "The AI Teaching Assistant analyzes lesson content, student profiles, and learning objectives to prepare adaptive support.",
      icon: Brain,
      color: "purple"
    },
    {
      number: 3,
      title: "Live Teaching with AI Support",
      description: "Begin teaching while AI monitors student engagement, suggests explanations, and provides real-time insights on comprehension levels.",
      icon: Monitor,
      color: "green"
    },
    {
      number: 4,
      title: "Real-time Interventions",
      description: "AI detects when students need help and provides instant suggestions for alternative explanations, examples, or activities.",
      icon: Zap,
      color: "orange"
    },
    {
      number: 5,
      title: "Analytics & Improvement",
      description: "Review detailed analytics on student performance, engagement patterns, and receive AI recommendations for future lessons.",
      icon: BarChart3,
      color: "red"
    }
  ];

  const studentSteps = [
    {
      number: 1,
      title: "Easy Access",
      description: "Join the AI classroom with a simple link or code. Works on any device - computer, tablet, or smartphone.",
      icon: Users,
      color: "blue"
    },
    {
      number: 2,
      title: "Personalized Experience",
      description: "AI immediately adapts to your learning style - visual, auditory, or interactive - providing customized explanations.",
      icon: Target,
      color: "purple"
    },
    {
      number: 3,
      title: "Interactive Learning",
      description: "Participate through voice, text, or gestures. Ask questions naturally and get AI-powered instant responses and clarifications.",
      icon: MessageSquare,
      color: "green"
    },
    {
      number: 4,
      title: "Smart Assistance",
      description: "When you're confused, AI provides hints, alternative explanations, or connects you with peer support - all automatically.",
      icon: Lightbulb,
      color: "orange"
    },
    {
      number: 5,
      title: "Progress Tracking",
      description: "See your learning progress, achievements, and get personalized recommendations for improvement through gamified analytics.",
      icon: Award,
      color: "red"
    }
  ];

  const steps = userType === 'teacher' ? teacherSteps : studentSteps;

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.number}>
          <ProcessStep
            number={step.number}
            title={step.title}
            description={step.description}
            icon={step.icon}
            color={step.color}
          />
          {index < steps.length - 1 && (
            <div className="flex justify-center my-4">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const AIClassroomWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const startLiveDemo = () => {
    toast({
      title: "Starting AI Classroom Demo",
      description: "Redirecting you to the live AI Classroom session...",
    });
    // Navigate to AI classroom session
    navigate('/ai-classroom/session/demo-session-1');
  };

  const requestDemo = () => {
    setIsContactModalOpen(true);
  };

  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Teaching Assistant",
      description: "AI that understands context and provides relevant teaching support",
      badge: "Real-time",
      color: "purple"
    },
    {
      icon: Volume2,
      title: "Voice Recognition",
      description: "Natural speech processing for questions and commands",
      badge: "Multi-language",
      color: "blue"
    },
    {
      icon: Eye,
      title: "Engagement Detection",
      description: "Computer vision monitoring attention and participation levels",
      badge: "Live",
      color: "green"
    },
    {
      icon: MessageSquare,
      title: "Instant Translation",
      description: "Real-time language translation for multilingual classrooms",
      badge: "50+ Languages",
      color: "orange"
    },
    {
      icon: Sparkles,
      title: "Content Generation",
      description: "AI creates custom examples and exercises on demand",
      badge: "Adaptive",
      color: "pink"
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description: "Advanced analysis identifying patterns and predicting outcomes",
      badge: "Predictive",
      color: "red"
    }
  ];

  const systemComponents = [
    {
      title: "AI Teaching Assistant",
      description: "Powered by GPT-4o, provides intelligent support and adaptive explanations",
      icon: Brain,
      features: ["Natural conversation", "Context awareness", "Curriculum alignment", "Multi-modal explanations"]
    },
    {
      title: "Voice Intelligence",
      description: "ElevenLabs integration for natural speech synthesis and recognition",
      icon: Headphones,
      features: ["Text-to-speech", "Voice commands", "Multiple voices", "Real-time processing"]
    },
    {
      title: "Real-time Analytics",
      description: "Student behavior analysis and engagement monitoring",
      icon: Activity,
      features: ["Attention tracking", "Comprehension levels", "Participation metrics", "Risk prediction"]
    },
    {
      title: "Creative AI Features",
      description: "Advanced AI capabilities for immersive learning experiences",
      icon: Sparkles,
      features: ["AI avatars", "Voice cloning", "Story generation", "Interactive scenarios"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm">
          AI Classroom Suite Workflow
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900">
          How Our AI Classroom Works
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A comprehensive guide to understanding our revolutionary AI-powered teaching platform
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="teacher">Teacher Journey</TabsTrigger>
          <TabsTrigger value="student">Student Experience</TabsTrigger>
          <TabsTrigger value="features">AI Features</TabsTrigger>
        </TabsList>

        {/* System Overview */}
        <TabsContent value="overview" className="mt-8">
          <div className="space-y-8">
            {/* High-level Architecture */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center">AI Classroom Architecture</CardTitle>
                <CardDescription className="text-center">
                  Complete ecosystem for AI-enhanced teaching and learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {systemComponents.map((component, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <component.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{component.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{component.description}</p>
                      <div className="space-y-1">
                        {component.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Simple Process Flow */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center">5-Step Process Flow</CardTitle>
                <CardDescription className="text-center">
                  How AI Classroom works from start to finish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ProcessStep
                    number={1}
                    icon={Play}
                    title="Session Initialization"
                    description="Teacher creates AI-enhanced classroom session. System loads curriculum data, student profiles, and prepares personalized learning materials."
                    color="blue"
                  />
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <ProcessStep
                    number={2}
                    icon={Brain}
                    title="AI System Activation"
                    description="AI Teaching Assistant analyzes lesson objectives and student learning styles. Real-time monitoring systems come online."
                    color="purple"
                  />
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <ProcessStep
                    number={3}
                    icon={Eye}
                    title="Live Monitoring & Analysis"
                    description="Continuous tracking of student engagement, comprehension levels, and participation. AI processes verbal and visual cues in real-time."
                    color="green"
                  />
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <ProcessStep
                    number={4}
                    icon={Zap}
                    title="Intelligent Interventions"
                    description="When confusion or disengagement is detected, AI provides instant suggestions, alternative explanations, or activates support protocols."
                    color="orange"
                  />
                  <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <ProcessStep
                    number={5}
                    icon={TrendingUp}
                    title="Continuous Learning & Improvement"
                    description="System learns from each interaction, improving recommendations and personalizing future experiences for better learning outcomes."
                    color="red"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teacher Journey */}
        <TabsContent value="teacher" className="mt-8">
          <Card className="p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Teacher's Workflow</CardTitle>
              <CardDescription>
                Step-by-step guide for educators using the AI Classroom Suite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserJourney userType="teacher" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Experience */}
        <TabsContent value="student" className="mt-8">
          <Card className="p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Student's Learning Journey</CardTitle>
              <CardDescription>
                How students interact with and benefit from AI-enhanced learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserJourney userType="student" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Features */}
        <TabsContent value="features" className="mt-8">
          <div className="space-y-8">
            {/* AI Capabilities */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Intelligent AI Features</CardTitle>
                <CardDescription>
                  Advanced AI capabilities that power the learning experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiFeatures.map((feature, index) => (
                    <FeatureHighlight
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      badge={feature.badge}
                      color={feature.color}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits Comparison */}
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Key Benefits</CardTitle>
                <CardDescription>
                  What makes AI Classroom Suite revolutionary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      For Educators
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Reduce lesson preparation time by 60%",
                        "Get real-time insights on student understanding",
                        "Receive AI-powered teaching suggestions",
                        "Automated progress tracking and reporting",
                        "Personalized intervention recommendations"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-600" />
                      For Students
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Learning adapted to individual style",
                        "Instant help when confused or stuck",
                        "Interactive and engaging experience",
                        "Clear visibility of learning progress",
                        "Gamified achievements and rewards"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="p-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience AI-Enhanced Learning?</h2>
        <p className="text-lg mb-6 opacity-90">
          Join the future of education with our revolutionary AI Classroom Suite
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100"
            onClick={startLiveDemo}
          >
            <Play className="h-5 w-5 mr-2" />
            Try Live Demo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            onClick={requestDemo}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Request Personalized Demo
          </Button>
        </div>
        <p className="text-sm mt-4 opacity-75">
          Live demo available instantly • Personalized demo scheduled within 24 hours
        </p>
      </Card>
      
      {/* Contact Modal for Demo Requests */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};