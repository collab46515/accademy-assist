import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
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
  ExternalLink
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
  const [selectedModule, setSelectedModule] = useState(modules?.[0] || null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Navigation helpers
  const handleRoleGuideClick = (guide: string, roleName: string) => {
    toast({
      title: "Guide Available",
      description: `${guide} documentation is available in the ${roleName.toLowerCase()} portal`,
    });
    
    // Navigate to appropriate section based on role
    if (roleName === "School Administrators") {
      navigate("/admin-management");
    } else if (roleName === "Teachers") {
      navigate("/portals");
    } else {
      navigate("/dashboard");
    }
  };

  const handleModuleDocumentation = (moduleName: string) => {
    // Navigate to module or show external documentation
    const moduleRoutes: { [key: string]: string } = {
      "Student Management": "/students",
      "Finance & Fees": "/fee-management", 
      "Academics": "/academics",
      "HR Management": "/hr-management",
      "Communication": "/communication",
      "AI Suite": "/ai-suite",
      "Reports": "/report-cards"
    };
    
    const route = moduleRoutes[moduleName];
    if (route) {
      navigate(route);
      toast({
        title: "Navigating to Module",
        description: `Opening ${moduleName} section`,
      });
    } else {
      toast({
        title: "Module Documentation",
        description: `${moduleName} documentation will be available soon`,
      });
    }
  };


  const handleTrainingRequest = () => {
    toast({
      title: "Training Request",
      description: "Personal training request submitted. Our team will contact you within 24 hours.",
    });
  };

  const handlePDFDownload = (title: string, filename: string) => {
    // Import jsPDF dynamically or ensure it's available
    if (typeof window !== 'undefined' && (window as any).jsPDF) {
      const { jsPDF } = (window as any);
      const doc = new jsPDF();
      
      // Add branded header
      doc.setFillColor(59, 130, 246); // Primary blue color
      doc.rect(0, 0, 210, 25, 'F'); // Header background
      
      // Add school name/logo text in header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('DOXA', 20, 15);
      doc.setFontSize(10);
      doc.text('School Management System', 20, 20);
      
      // Reset text color for content
      doc.setTextColor(0, 0, 0);
      
      // Add title
      doc.setFontSize(18);
      doc.text(`${title} Documentation`, 20, 45);
      
      // Add metadata
      doc.setFontSize(12);
      doc.text('Module Guide', 20, 58);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 68);
      
      // Add content sections
      doc.setFontSize(11);
      let yPosition = 85;
      
      const sections = [
        {
          title: "Getting Started",
          content: `This guide will help you understand and effectively use the ${title} module. Learn the basics of navigation, key features, and common workflows.`
        },
        {
          title: "Key Features", 
          content: `Explore the main capabilities of ${title}, including user management, data entry, reporting features, and integration options.`
        },
        {
          title: "Step-by-Step Workflows",
          content: `Follow detailed instructions for common tasks and processes within the ${title} module. Includes screenshots and tips for efficient usage.`
        },
        {
          title: "Best Practices",
          content: `Learn recommended approaches, shortcuts, and optimization techniques to get the most out of the ${title} system.`
        },
        {
          title: "Troubleshooting", 
          content: `Common issues and solutions, FAQ section, and contact information for additional support when needed.`
        }
      ];
      
      sections.forEach((section) => {
        if (yPosition > 270) {
          doc.addPage();
          // Add header to new page
          doc.setFillColor(59, 130, 246);
          doc.rect(0, 0, 210, 25, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.text('DOXA', 20, 15);
          doc.setFontSize(10);
          doc.text('School Management System', 20, 20);
          doc.setTextColor(0, 0, 0);
          yPosition = 40;
        }
        
        // Section title
        doc.setFontSize(13);
        doc.text(section.title, 20, yPosition);
        yPosition += 12;
        
        // Section content
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(section.content, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 4 + 15;
      });
      
      // Save the PDF
      doc.save(filename);
      
      toast({
        title: "PDF Downloaded",
        description: `${title} guide has been downloaded`,
      });
    } else {
      // Fallback if jsPDF is not available
      toast({
        title: "Download Error",
        description: "PDF generation library not available. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuickStartGuide = (guide: any) => {
    // Import jsPDF dynamically or ensure it's available
    if (typeof window !== 'undefined' && (window as any).jsPDF) {
      const { jsPDF } = (window as any);
      const doc = new jsPDF();
      
      // Add branded header
      doc.setFillColor(59, 130, 246); // Primary blue color
      doc.rect(0, 0, 210, 25, 'F'); // Header background
      
      // Add school name/logo text in header
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('DOXA', 20, 15);
      doc.setFontSize(10);
      doc.text('School Management System', 20, 20);
      
      // Reset text color for content
      doc.setTextColor(0, 0, 0);
      
      // Add title
      doc.setFontSize(18);
      doc.text(guide.title, 20, 45);
      
      // Add metadata
      doc.setFontSize(12);
      doc.text('Quick Start Guide', 20, 58);
      doc.setFontSize(10);
      doc.text(`Duration: ${guide.duration}`, 20, 68);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 75);
      
      // Add content
      doc.setFontSize(11);
      let yPosition = 90;
      
      // Add guide description
      doc.setFontSize(13);
      doc.text('Overview', 20, yPosition);
      yPosition += 12;
      
      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(guide.description, 170);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 4 + 15;
      
      // Add step-by-step content based on guide type
      const getQuickStartContent = (title: string) => {
        const contentMap: { [key: string]: any[] } = {
          "Getting Started with Doxa": [
            { title: "Step 1: System Access", content: "Log into your Doxa account using your provided credentials. Ensure you have a stable internet connection and use a supported browser (Chrome, Firefox, Safari, or Edge)." },
            { title: "Step 2: Dashboard Overview", content: "Familiarize yourself with the main dashboard. Explore the navigation menu, quick access buttons, and key performance indicators relevant to your role." },
            { title: "Step 3: Profile Setup", content: "Complete your user profile with accurate information. Upload a profile picture and configure your notification preferences." },
            { title: "Step 4: Initial Configuration", content: "Set up your workspace preferences, language settings, and any module-specific configurations required for your role." },
            { title: "Step 5: Help Resources", content: "Locate and bookmark the help section, documentation links, and support contact information for future reference." }
          ],
          "First Week Setup Checklist": [
            { title: "Day 1: Foundation", content: "Complete initial login, profile setup, and basic navigation training. Ensure all credentials are working and access levels are correct." },
            { title: "Day 2-3: Core Features", content: "Learn the essential features for your role. Practice data entry, basic reporting, and key workflows you'll use daily." },
            { title: "Day 4-5: Advanced Setup", content: "Configure advanced settings, integrate with existing systems, and set up automated processes where applicable." },
            { title: "Week End: Review", content: "Complete knowledge check, review best practices, and ensure you're comfortable with all basic operations." }
          ],
          "User Onboarding Best Practices": [
            { title: "Preparation Phase", content: "Gather all necessary information, credentials, and resources before starting the onboarding process. Ensure technical requirements are met." },
            { title: "Structured Learning", content: "Follow a systematic approach to learning features. Start with basics and gradually progress to advanced functionality." },
            { title: "Hands-on Practice", content: "Use training data to practice key workflows. Don't hesitate to experiment with features in a safe environment." },
            { title: "Support Network", content: "Connect with administrators, colleagues, and support resources. Build relationships that will help you succeed long-term." }
          ]
        };
        return contentMap[title] || [
          { title: "Getting Started", content: "This guide will help you begin using the system effectively." },
          { title: "Key Steps", content: "Follow these important steps to set up and configure your access." },
          { title: "Best Practices", content: "Learn recommended approaches for optimal system usage." }
        ];
      };
      
      const content = getQuickStartContent(guide.title);
      content.forEach((section) => {
        if (yPosition > 270) {
          doc.addPage();
          // Add header to new page
          doc.setFillColor(59, 130, 246);
          doc.rect(0, 0, 210, 25, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.text('DOXA', 20, 15);
          doc.setFontSize(10);
          doc.text('School Management System', 20, 20);
          doc.setTextColor(0, 0, 0);
          yPosition = 40;
        }
        
        // Section title
        doc.setFontSize(13);
        doc.text(section.title, 20, yPosition);
        yPosition += 12;
        
        // Section content
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(section.content, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 4 + 15;
      });
      
      // Save the PDF
      doc.save(`${guide.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "Guide Downloaded",
        description: `${guide.title} has been downloaded as PDF`,
      });
    } else {
      // Fallback if jsPDF is not available
      toast({
        title: "Download Error", 
        description: "PDF generation library not available. Please try again.",
        variant: "destructive"
      });
    }
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
      title: "Getting Started with Doxa",
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
            Comprehensive documentation and step-by-step guides to help you 
            master every aspect of the school management system.
          </p>
        </div>

        <Tabs defaultValue="role-guides" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="role-guides">Role Guides</TabsTrigger>
            <TabsTrigger value="modules">Module Manuals</TabsTrigger>
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
                          <Badge variant="outline" className="ml-auto text-xs">New</Badge>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleRoleGuideClick(`All ${role.name} guides`, role.name)}
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
            {!modules || modules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No modules available for documentation.</p>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-semibold mb-4">Select Module</h3>
                  {modules.map((module, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedModule(module)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedModule?.name === module.name 
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
                  {selectedModule ? (
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
                            onClick={() => {
                              toast({
                                title: "Documentation Section",
                                description: `${section} documentation for ${selectedModule.name}`,
                              });
                              handleModuleDocumentation(selectedModule.name);
                            }}
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
                      <Button className="flex-1" onClick={() => handleModuleDocumentation(selectedModule.name)}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read Documentation
                      </Button>
                      <Button variant="outline" onClick={() => handlePDFDownload(selectedModule.name, `${selectedModule.name.toLowerCase().replace(/\s+/g, '-')}-guide.pdf`)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <p>Select a module to view documentation</p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                      onClick={() => handleQuickStartGuide(guide)}
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
                    Schedule Training Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </section>
  );
}