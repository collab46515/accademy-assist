import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Users,
  GraduationCap,
  Settings,
  Video,
  Star
} from 'lucide-react';

export function UserGuidesSection() {
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
      icon: FileText
    },
    {
      title: "User Onboarding Best Practices",
      duration: "8 min read",
      type: "Best Practices",
      description: "How to successfully onboard your staff and students",
      icon: Users
    }
  ];

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
          Comprehensive documentation, tutorials, and training materials 
          to help you master every aspect of the school management system.
        </p>
      </div>

      <Tabs defaultValue="role-guides" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="role-guides">Role Guides</TabsTrigger>
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
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{guide}</span>
                        <Badge variant="outline" className="ml-auto text-xs">Available</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Guides
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quick Start Guides */}
        <TabsContent value="quick-start" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
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
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide
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
                <Button size="lg">
                  <Video className="mr-2 h-4 w-4" />
                  Schedule Training Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}