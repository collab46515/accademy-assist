import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  PlayCircle, 
  Download, 
  FileText, 
  Users,
  GraduationCap,
  Settings,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Brain,
  MessageSquare,
  PoundSterling,
  UserCheck,
  ClipboardCheck,
  Calendar,
  Activity,
  Video,
  HelpCircle,
  Lightbulb,
  Target,
  Star,
  Award,
  Code,
  Globe,
  Shield
} from 'lucide-react';

// Import workflow components
import { StudentManagementWorkflow } from '@/components/workflows/StudentManagementWorkflow';
import { FeeManagementWorkflow } from '@/components/workflows/FeeManagementWorkflow';
import { AdmissionsWorkflow } from '@/components/workflows/AdmissionsWorkflow';
import { HRManagementWorkflow } from '@/components/workflows/HRManagementWorkflow';
import { AITimetableWorkflow } from '@/components/workflows/AITimetableWorkflow';
import { CommunicationWorkflow } from '@/components/workflows/CommunicationWorkflow';

// Import user guides data
import { 
  financeUserGuide, 
  academicsUserGuide, 
  studentServicesUserGuide, 
  hrUserGuide 
} from '@/data/userGuides';

export function UserGuidesSection() {
  const [selectedModule, setSelectedModule] = useState('student-management');
  const [selectedGuide, setSelectedGuide] = useState('finance');
  const navigate = useNavigate();
  const { toast } = useToast();

  const modules = [
    {
      name: "Student Management",
      icon: Users,
      description: "Comprehensive student lifecycle management from enrollment to graduation",
      features: ["Student Records", "Enrollment", "Academic History", "Parent Portal"],
      color: "bg-green-500"
    },
    {
      name: "Finance & Fees",
      icon: PoundSterling,
      description: "Complete financial management including fee collection, invoicing, and reporting",
      features: ["Fee Collection", "Invoicing", "Financial Reports", "Payment Gateway"],
      color: "bg-emerald-500"
    },
    {
      name: "Academics & Curriculum",
      icon: GraduationCap,
      description: "Curriculum planning, lesson management, and academic progress tracking",
      features: ["Lesson Planning", "Curriculum Mapping", "Progress Tracking", "Standards Alignment"],
      color: "bg-blue-500"
    },
    {
      name: "HR Management",
      icon: UserCheck,
      description: "Staff management, recruitment, payroll, and performance tracking",
      features: ["Staff Records", "Recruitment", "Payroll", "Performance Management"],
      color: "bg-purple-500"
    },
    {
      name: "Communication Hub",
      icon: MessageSquare,
      description: "Multi-channel communication platform for school community",
      features: ["Messaging", "Notifications", "Announcements", "Parent Communication"],
      color: "bg-pink-500"
    },
    {
      name: "AI Suite",
      icon: Brain,
      description: "AI-powered tools for grading, lesson planning, and insights",
      features: ["AI Grading", "Lesson Planning", "Predictive Analytics", "Smart Timetables"],
      color: "bg-violet-500"
    }
  ];

  const userRoles = [
    {
      name: "School Administrators",
      icon: Settings,
      description: "Complete system administration and management",
      guides: [
        "System Setup and Configuration",
        "User Management and Permissions", 
        "School Settings and Customization",
        "Data Import and Export",
        "Backup and Security",
        "Integration Management"
      ]
    },
    {
      name: "Teachers",
      icon: Users,
      description: "Daily teaching and classroom management", 
      guides: [
        "Lesson Planning and Curriculum",
        "Attendance Marking",
        "Assignment Creation and Grading", 
        "Parent Communication",
        "Progress Tracking",
        "Classroom Management"
      ]
    },
    {
      name: "Students",
      icon: GraduationCap,
      description: "Student portal and self-service features",
      guides: [
        "Accessing Student Portal",
        "Viewing Assignments and Grades",
        "Submitting Work Online",
        "Communication Tools", 
        "Academic Calendar",
        "Study Resources"
      ]
    },
    {
      name: "Parents", 
      icon: Users,
      description: "Parent portal and engagement tools",
      guides: [
        "Parent Portal Access",
        "Viewing Child's Progress", 
        "Communication with Teachers",
        "Fee Payments",
        "Event and Activity Updates",
        "School Calendar Integration"
      ]
    }
  ];

  const workflows = [
    {
      id: "student-management",
      name: "Student Management",
      icon: Users,
      description: "Complete student lifecycle from enrollment to graduation",
      component: StudentManagementWorkflow,
      color: "bg-green-500"
    },
    {
      id: "admissions",
      name: "Admissions Process",
      icon: GraduationCap,
      description: "End-to-end admissions workflow from application to enrollment",
      component: AdmissionsWorkflow,
      color: "bg-blue-500"
    },
    {
      id: "fee-management",
      name: "Fee Management",
      icon: PoundSterling,
      description: "Complete financial workflow for fee collection and tracking",
      component: FeeManagementWorkflow,
      color: "bg-emerald-500"
    },
    {
      id: "hr-management",
      name: "HR Management",
      icon: UserCheck,
      description: "Staff recruitment and management workflow",
      component: HRManagementWorkflow,
      color: "bg-indigo-500"
    },
    {
      id: "ai-timetable",
      name: "AI Timetable Generation",
      icon: Brain,
      description: "Intelligent timetable creation with AI optimization",
      component: AITimetableWorkflow,
      color: "bg-purple-500"
    },
    {
      id: "communication",
      name: "Communication Hub",
      icon: MessageSquare,
      description: "Multi-channel communication workflow",
      component: CommunicationWorkflow,
      color: "bg-pink-500"
    }
  ];

  const quickStartGuides = [
    {
      title: "Getting Started with Pappaya",
      duration: "5 min read",
      type: "Quick Start",
      description: "Essential first steps to set up your school management system",
      icon: Star
    },
    {
      title: "First Week Setup Checklist",
      duration: "10 min read", 
      type: "Checklist",
      description: "Complete checklist for administrators to get started",
      icon: CheckCircle
    },
    {
      title: "User Onboarding Best Practices",
      duration: "8 min read",
      type: "Best Practices",
      description: "How to successfully onboard your staff and students",
      icon: Award
    },
    {
      title: "Data Migration Guide",
      duration: "15 min read",
      type: "Technical",
      description: "Step-by-step guide for migrating from other systems",
      icon: Code
    }
  ];

  const videoTutorials = [
    {
      title: "System Overview Demo",
      duration: "12 minutes",
      description: "Complete walkthrough of all main features",
      thumbnail: "/api/placeholder/300/200",
      category: "Overview"
    },
    {
      title: "Student Enrollment Process",
      duration: "8 minutes", 
      description: "Step-by-step enrollment demonstration",
      thumbnail: "/api/placeholder/300/200",
      category: "Student Management"
    },
    {
      title: "Fee Collection Workflow",
      duration: "10 minutes",
      description: "Complete fee management process",
      thumbnail: "/api/placeholder/300/200",
      category: "Finance"
    },
    {
      title: "Creating Lesson Plans",
      duration: "15 minutes",
      description: "Advanced lesson planning techniques",
      thumbnail: "/api/placeholder/300/200",
      category: "Academics"
    }
  ];

  const userGuides = {
    finance: financeUserGuide,
    academics: academicsUserGuide,
    'student-services': studentServicesUserGuide,
    hr: hrUserGuide
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedModule);
  const WorkflowComponent = selectedWorkflowData?.component;
  const selectedUserGuide = userGuides[selectedGuide as keyof typeof userGuides];

  const handleModuleNavigation = (moduleName: string) => {
    const moduleRoutes: { [key: string]: string } = {
      "Student Management": "/students",
      "Finance & Fees": "/fee-management", 
      "Academics & Curriculum": "/academics",
      "HR Management": "/hr-management",
      "Communication Hub": "/communication",
      "AI Suite": "/ai-suite"
    };
    
    const route = moduleRoutes[moduleName];
    if (route) {
      navigate(route);
      toast({
        title: "Navigating to Module",
        description: `Opening ${moduleName} section`,
      });
    }
  };

  const handlePDFDownload = (title: string, filename: string) => {
    toast({
      title: "PDF Downloaded",
      description: `${title} guide has been downloaded`,
    });
  };

  const handleVideoPlay = (video: any) => {
    toast({
      title: "Video Tutorial",
      description: `Playing: ${video.title}`,
    });
  };

  const handleTrainingRequest = () => {
    toast({
      title: "Training Request",
      description: "Personal training request submitted. Our team will contact you within 24 hours.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-primary border-primary/20">
          Complete Documentation Center
        </Badge>
        <h2 className="text-3xl font-bold">
          User Guides &
          <span className="text-primary block">Training Materials</span>
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Comprehensive documentation, interactive workflows, video tutorials, and training materials 
          to help you master every aspect of the school management system.
        </p>
      </div>

      <Tabs defaultValue="role-guides" className="space-y-8">
        <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5">
          <TabsTrigger value="role-guides">Role Guides</TabsTrigger>
          <TabsTrigger value="modules">Module Manuals</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
        </TabsList>

        {/* Role-based Guides */}
        <TabsContent value="role-guides" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {userRoles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <role.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {role.guides.map((guide, guideIndex) => (
                      <div 
                        key={guideIndex} 
                        className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
                        onClick={() => toast({
                          title: "Guide Available",
                          description: `${guide} documentation is available`,
                        })}
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{guide}</span>
                        <Badge variant="outline" className="ml-auto text-xs">New</Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({
                      title: "Complete Guide Set",
                      description: `All ${role.name} guides are now available`,
                    })}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View All Guides
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Module Documentation */}
        <TabsContent value="modules" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold mb-4">Select Module</h3>
              {modules.map((module, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGuide(module.name.toLowerCase().replace(/ & /, '-').replace(/ /, '-'))}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedGuide === module.name.toLowerCase().replace(/ & /, '-').replace(/ /, '-')
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${module.color} flex items-center justify-center`}>
                      <module.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-sm">{module.name}</span>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Module Documentation</CardTitle>
                      <CardDescription>Comprehensive guides and tutorials</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Documentation Sections</h4>
                    <div className="space-y-2">
                      {[
                        "Getting Started",
                        "Basic Operations", 
                        "Advanced Features",
                        "Best Practices",
                        "Troubleshooting",
                        "FAQ",
                        "Video Tutorials",
                        "Integration Guide"
                      ].map((section, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => toast({
                            title: "Documentation Section",
                            description: `${section} documentation available`,
                          })}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{section}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(Math.random() * 10) + 5} min read
                            </Badge>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => handleModuleNavigation("Student Management")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Documentation
                    </Button>
                    <Button variant="outline" onClick={() => handlePDFDownload("Module Guide", "module-guide.pdf")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Interactive Workflows */}
        <TabsContent value="workflows" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="font-semibold mb-4">Select Workflow</h3>
              {workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => setSelectedModule(workflow.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedModule === workflow.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${workflow.color} flex items-center justify-center`}>
                      <workflow.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{workflow.name}</div>
                      <div className="text-xs text-muted-foreground">{workflow.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              {selectedWorkflowData && WorkflowComponent ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${selectedWorkflowData.color} flex items-center justify-center`}>
                        <selectedWorkflowData.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{selectedWorkflowData.name}</CardTitle>
                        <CardDescription>{selectedWorkflowData.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-background">
                      <WorkflowComponent />
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>This interactive diagram shows the complete workflow for {selectedWorkflowData.name.toLowerCase()}. 
                      Each node represents a step in the process, and arrows show the flow of information and actions.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Select a workflow to view the interactive diagram</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Video Tutorials */}
        <TabsContent value="videos" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                    <Button 
                      size="sm" 
                      className="absolute"
                      onClick={() => handleVideoPlay(video)}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Play
                    </Button>
                    <Badge className="absolute top-2 right-2 text-xs">
                      {video.duration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">{video.category}</Badge>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription className="text-sm">{video.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Need Live Training?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our training specialists can provide live, interactive training sessions customized for your team. 
                  Perfect for schools wanting hands-on guidance.
                </p>
                <Button size="lg" onClick={handleTrainingRequest}>
                  <Video className="mr-2 h-4 w-4" />
                  Schedule Live Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Start Guides */}
        <TabsContent value="quick-start" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickStartGuides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <guide.icon className="h-5 w-5 text-primary" />
                      <Badge variant="outline" className="text-xs">{guide.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{guide.duration}</span>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handlePDFDownload(guide.title, `${guide.title.toLowerCase().replace(/\s+/g, '-')}.pdf`)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>Get help when you need it</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Access our comprehensive help center, submit support tickets, and get expert assistance.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="mr-2 h-4 w-4" />
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Best Practices</CardTitle>
                    <CardDescription>Tips for optimal system usage</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Learn industry best practices and optimization tips to get the most out of your system.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Implementation Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Security Best Practices
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Performance Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}