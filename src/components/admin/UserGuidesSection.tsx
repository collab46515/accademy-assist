import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
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
    // Create a proper PDF with actual content
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`${roleName} Complete Guide`, 20, 30);
    
    // Add subtitle
    doc.setFontSize(14);
    doc.text('Pappaya School Management System', 20, 45);
    
    // Add content based on role
    doc.setFontSize(12);
    let yPosition = 65;
    
    const roleContent = getRoleContent(roleName);
    roleContent.forEach((section, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Section title
      doc.setFontSize(14);
      doc.text(section.title, 20, yPosition);
      yPosition += 15;
      
      // Section content
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(section.content, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 10;
    });
    
    // Save the PDF
    doc.save(`${roleName.toLowerCase().replace(/\s+/g, '-')}-complete-guide.pdf`);
    
    toast({
      title: "Guide Downloaded",
      description: `Complete ${roleName} guide has been downloaded as PDF`,
    });
  };

  const getRoleContent = (roleName: string) => {
    const content = {
      "School Administrators": [
        {
          title: "1. System Setup and Configuration",
          content: "Learn how to configure your school's basic settings, academic years, terms, and organizational structure. This section covers initial system setup, school profile configuration, and essential administrative settings."
        },
        {
          title: "2. User Management and Permissions",
          content: "Comprehensive guide to creating user accounts, assigning roles, and managing permissions. Learn how to set up teachers, students, parents, and staff accounts with appropriate access levels."
        },
        {
          title: "3. Academic Structure Setup",
          content: "Configure classes, subjects, sections, and academic calendar. Set up grading systems, assessment periods, and curriculum framework to match your school's academic structure."
        },
        {
          title: "4. Data Import and Migration",
          content: "Step-by-step instructions for importing existing student data, staff records, and academic information from other systems. Includes data validation and cleanup procedures."
        },
        {
          title: "5. Reports and Analytics",
          content: "Generate comprehensive reports for academic performance, attendance, financial data, and administrative analytics. Learn to create custom reports and automated report scheduling."
        }
      ],
      "Teachers": [
        {
          title: "1. Getting Started with Teacher Portal",
          content: "Navigate your teacher dashboard, understand the interface, and access key features. Learn how to customize your workspace and set up your teaching preferences."
        },
        {
          title: "2. Lesson Planning and Curriculum",
          content: "Create detailed lesson plans, map curriculum objectives, and track teaching progress. Use built-in templates and collaborate with other teachers on curriculum development."
        },
        {
          title: "3. Attendance Management",
          content: "Mark daily attendance, handle late arrivals and early departures, generate attendance reports, and communicate with parents about attendance issues."
        },
        {
          title: "4. Assignment and Assessment",
          content: "Create assignments, set due dates, collect submissions, provide feedback, and grade student work. Learn to use rubrics and automated grading features."
        },
        {
          title: "5. Parent Communication",
          content: "Send messages to parents, schedule parent-teacher conferences, share student progress updates, and maintain professional communication records."
        }
      ],
      "Students": [
        {
          title: "1. Accessing Your Student Portal",
          content: "Log in to your student account, navigate the dashboard, and understand available features. Learn how to update your profile and manage account settings."
        },
        {
          title: "2. Viewing Academic Information",
          content: "Check your grades, view report cards, track academic progress, and access curriculum information. Understand how to read your academic reports and transcripts."
        },
        {
          title: "3. Assignment Submission",
          content: "Submit assignments online, check due dates, track submission status, and view teacher feedback. Learn about different submission formats and requirements."
        },
        {
          title: "4. Communication Tools",
          content: "Message teachers, participate in class discussions, join study groups, and access announcements. Learn proper online communication etiquette."
        },
        {
          title: "5. Resources and Support",
          content: "Access digital textbooks, library resources, study materials, and help documentation. Learn how to get technical support and academic assistance."
        }
      ],
      "Parents": [
        {
          title: "1. Parent Portal Setup",
          content: "Create your parent account, link to your children's profiles, and configure notification preferences. Learn how to manage multiple children in one account."
        },
        {
          title: "2. Monitoring Child's Progress",
          content: "View grades, attendance records, behavior reports, and academic progress. Understand how to interpret report cards and assessment results."
        },
        {
          title: "3. Communication with School",
          content: "Message teachers and staff, respond to school communications, schedule conferences, and participate in school events. Learn about communication protocols."
        },
        {
          title: "4. Fee Management",
          content: "View fee statements, make online payments, track payment history, and set up automatic payments. Understand fee structures and payment policies."
        },
        {
          title: "5. School Engagement",
          content: "Access school calendar, register for events, volunteer for activities, and stay informed about school policies and announcements."
        }
      ]
    };
    
    return content[roleName as keyof typeof content] || [];
  };

  const handleQuickStartDownload = (guide: any) => {
    // Create a proper PDF for quick start guides
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(guide.title, 20, 30);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.text('Pappaya School Management System', 20, 45);
    doc.text(`Duration: ${guide.duration}`, 20, 55);
    
    // Add content
    doc.setFontSize(11);
    const content = getQuickStartContent(guide.title);
    let yPosition = 75;
    
    content.forEach((section) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Section title
      doc.setFontSize(13);
      doc.text(section.title, 20, yPosition);
      yPosition += 12;
      
      // Section content
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(section.content, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 4 + 10;
    });
    
    // Save the PDF
    doc.save(`${guide.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    
    toast({
      title: "Guide Downloaded",
      description: `${guide.title} has been downloaded as PDF`,
    });
  };

  const getQuickStartContent = (title: string) => {
    const content = {
      "Getting Started with Pappaya": [
        {
          title: "Welcome to Pappaya",
          content: "Pappaya is a comprehensive school management system designed to streamline all aspects of educational administration. This guide will help you get started quickly."
        },
        {
          title: "System Requirements",
          content: "Pappaya works on any modern web browser including Chrome, Firefox, Safari, and Edge. Ensure you have a stable internet connection for the best experience."
        },
        {
          title: "First Login",
          content: "Use the credentials provided by your system administrator. Change your password on first login for security. Complete your profile information to get started."
        },
        {
          title: "Dashboard Overview",
          content: "The dashboard provides an overview of all key metrics and quick access to frequently used features. Customize your dashboard widgets based on your role and preferences."
        },
        {
          title: "Getting Help",
          content: "Access help documentation, video tutorials, and live support through the help menu. Join training sessions for hands-on learning and best practices."
        }
      ],
      "First Week Setup Checklist": [
        {
          title: "Day 1: System Configuration",
          content: "Set up basic school information, academic year settings, and organizational structure. Configure user roles and permissions for different staff members."
        },
        {
          title: "Day 2-3: User Accounts",
          content: "Create user accounts for all staff, teachers, students, and parents. Send login credentials and conduct basic training sessions for key users."
        },
        {
          title: "Day 4-5: Academic Setup",
          content: "Configure classes, subjects, sections, and academic calendar. Set up grading systems and assessment periods to match your school's structure."
        },
        {
          title: "Day 6-7: Data Import",
          content: "Import existing student data, staff records, and historical academic information. Verify data accuracy and complete any missing information."
        },
        {
          title: "Week 1 Review",
          content: "Conduct system testing, user feedback collection, and address any initial issues. Plan for expanded rollout and advanced feature training."
        }
      ]
    };
    
    return content[title as keyof typeof content] || [
      {
        title: "Guide Content",
        content: `This is a comprehensive guide for ${title}. It contains detailed instructions and best practices to help you make the most of the Pappaya school management system.`
      }
    ];
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