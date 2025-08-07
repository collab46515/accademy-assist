import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Users,
  GraduationCap,
  Settings,
  Video,
  Star,
  ExternalLink
} from 'lucide-react';

export function UserGuidesSection() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleGuideClick = (guide: string, roleName: string) => {
    toast({
      title: "Guide Available",
      description: `${guide} documentation is ready to view`,
    });
    
    // Navigate to appropriate section based on role
    if (roleName === "School Administrators") {
      navigate("/admin-management");
    } else if (roleName === "Teachers") {
      navigate("/portals");
    } else if (roleName === "Students") {
      navigate("/portals");
    } else if (roleName === "Parents") {
      navigate("/portals");
    }
  };

  const handleViewAllGuides = (roleName: string) => {
    toast({
      title: "Complete Guide Set",
      description: `All ${roleName} guides are now available for download`,
    });
    
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvT3V0bGluZXMKL0NvdW50IDAKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs0IDAgUl0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA5IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjcyIDcyMCBUZAooSGVsbG8gV29ybGQhKSBUagpFVApzdHJlYW0KZW5kb2JqCjkgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCnhyZWYKMCAxMAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKMDAwMDAwMDQ0NyAwMDAwMCBuIAowMDAwMDAwNTQzIDAwMDAwIG4gCjAwMDAwMDA2MjIgMDAwMDAgbiAKMDAwMDAwMDY1NCAwMDAwMCBuIAowMDAwMDAwNzI4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMTAKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjgzNgolJUVPRg==';
    link.download = `${roleName.toLowerCase().replace(/\s+/g, '-')}-complete-guide.pdf`;
    link.click();
  };

  const handleQuickStartDownload = (guide: any) => {
    toast({
      title: "Guide Downloaded",
      description: `${guide.title} has been downloaded`,
    });
    
    // Create a mock markdown download
    const content = `# ${guide.title}\n\n${guide.description}\n\nThis comprehensive guide contains step-by-step instructions for ${guide.title.toLowerCase()}.\n\n## Getting Started\n\n1. System Overview\n2. Initial Setup\n3. Basic Operations\n4. Advanced Features\n5. Best Practices\n6. Troubleshooting\n\n## Support\n\nFor additional help, contact our support team or visit the help center.`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${guide.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
  };

  const handleTrainingRequest = () => {
    toast({
      title: "Training Request Submitted",
      description: "Our team will contact you within 24 hours to schedule your training session",
    });
  };
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
                        onClick={() => handleRoleGuideClick(guide, role.name)}
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{guide}</span>
                        <Badge variant="outline" className="ml-auto text-xs">Available</Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewAllGuides(role.name)}
                  >
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
                  <Button 
                    className="w-full"
                    onClick={() => handleQuickStartDownload(guide)}
                  >
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
                <Button 
                  size="lg"
                  onClick={handleTrainingRequest}
                >
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