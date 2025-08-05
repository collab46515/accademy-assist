import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  PlayCircle, 
  Download, 
  FileText, 
  Video, 
  Users, 
  GraduationCap,
  Settings,
  BarChart3,
  CheckCircle
} from "lucide-react";

interface Module {
  name: string;
  icon: any;
  description: string;
  features: string[];
  color: string;
}

interface UserManualsProps {
  modules: Module[];
}

export function UserManuals({ modules }: UserManualsProps) {
  const [selectedModule, setSelectedModule] = useState(modules[0]);

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
        "Backup and Security"
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
        "Progress Tracking"
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
        "Academic Calendar"
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
        "Event and Activity Updates"
      ]
    }
  ];

  const quickStartGuides = [
    {
      title: "Getting Started with EduFlow Pro",
      duration: "5 min read",
      type: "Quick Start",
      description: "Essential first steps to set up your school management system"
    },
    {
      title: "First Week Setup Checklist",
      duration: "10 min read", 
      type: "Checklist",
      description: "Complete checklist for administrators to get started"
    },
    {
      title: "User Onboarding Best Practices",
      duration: "8 min read",
      type: "Best Practices",
      description: "How to successfully onboard your staff and students"
    }
  ];

  const videoTutorials = [
    {
      title: "Complete System Overview",
      duration: "15 minutes",
      description: "Comprehensive walkthrough of all major features",
      thumbnail: "overview"
    },
    {
      title: "Student Management Deep Dive",
      duration: "12 minutes", 
      description: "Advanced student management features and workflows",
      thumbnail: "students"
    },
    {
      title: "Setting Up Your First Academic Year",
      duration: "18 minutes",
      description: "Step-by-step guide to configure your academic calendar",
      thumbnail: "academic"
    }
  ];

  return (
    <section className="py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/20">
            Complete Documentation
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            User Guides &
            <span className="text-primary block">Training Materials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive documentation, video tutorials, and step-by-step guides to help you 
            master every aspect of the school management system.
          </p>
        </div>

        <Tabs defaultValue="role-guides" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="role-guides">Role Guides</TabsTrigger>
            <TabsTrigger value="modules">Module Manuals</TabsTrigger>
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
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
                          onClick={() => alert(`Opening guide: ${guide}`)}
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
                      onClick={() => alert(`Opening all ${role.name} guides...`)}
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
                    onClick={() => setSelectedModule(module)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedModule.name === module.name 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${module.color} flex items-center justify-center`}>
                        <module.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{module.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${selectedModule.color} flex items-center justify-center`}>
                        <selectedModule.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{selectedModule.name}</CardTitle>
                        <CardDescription>{selectedModule.description}</CardDescription>
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
                          "FAQ"
                        ].map((section, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => alert(`Opening ${section} for ${selectedModule.name}...`)}
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
                      <Button className="flex-1" onClick={() => {
                        // Simulate opening documentation
                        alert(`Opening ${selectedModule.name} documentation...`);
                      }}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read Documentation
                      </Button>
                      <Button variant="outline" onClick={() => {
                        // Simulate downloading PDF
                        alert(`Downloading ${selectedModule.name} PDF guide...`);
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Quick Start Guides */}
          <TabsContent value="quick-start" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {quickStartGuides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-fit">{guide.type}</Badge>
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
                      onClick={() => alert(`Starting ${guide.title}...`)}
                    >
                      Start Reading
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Need Personal Training?</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our training specialists can provide customized onboarding sessions for your team. 
                    Perfect for schools transitioning from other systems.
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => alert('Opening training session scheduler...')}
                  >
                    Schedule Training Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tutorials */}
          <TabsContent value="videos" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div 
                      className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center relative group cursor-pointer"
                      onClick={() => alert(`Playing video: ${video.title}`)}
                    >
                      <PlayCircle className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                      <Badge className="absolute top-2 right-2">{video.duration}</Badge>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => alert(`Playing video: ${video.title}`)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Watch Tutorial
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => alert('Opening video tutorial library...')}
              >
                <Video className="mr-2 h-5 w-5" />
                View All Video Tutorials
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}