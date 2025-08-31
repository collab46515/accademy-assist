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
    // Create a proper PDF with actual content and logo
    const doc = new jsPDF();
    
    // Add logo (we'll use a placeholder since we can't easily load external images in jsPDF without additional setup)
    // For now, we'll create a branded header
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
    doc.setFontSize(20);
    doc.text(`${roleName} Complete Guide`, 20, 45);
    
    // Add subtitle with date
    doc.setFontSize(12);
    doc.text('Comprehensive User Documentation', 20, 58);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 68);
    
    // Add content based on role
    doc.setFontSize(12);
    let yPosition = 85;
    
    const roleContent = getRoleContent(roleName);
    roleContent.forEach((section, index) => {
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
    // Create a proper PDF for quick start guides with branding
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
    const content = getQuickStartContent(guide.title);
    let yPosition = 90;
    
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
      "Getting Started with Doxa": [
        {
          title: "📋 Pre-Setup Checklist",
          content: "Before you begin:\n• Ensure stable internet connection\n• Have your admin credentials ready\n• Gather school basic information\n• Prepare staff and student lists\n• Review your current academic structure"
        },
        {
          title: "🚀 Step 1: First Login & Profile Setup",
          content: "WORKFLOW:\n1. Open your web browser and navigate to your Doxa URL\n2. Enter your admin credentials (provided by your IT team)\n3. Complete the mandatory password change for security\n4. Fill in your personal profile information\n5. Set your timezone and language preferences\n\nExpected time: 10 minutes"
        },
        {
          title: "🏫 Step 2: School Configuration",
          content: "WORKFLOW:\n1. Navigate to Administration → School Settings\n2. Enter school name, address, and contact details\n3. Upload school logo and configure branding\n4. Set academic year dates and term structure\n5. Configure school holidays and working days\n6. Save and verify all settings\n\nExpected time: 20 minutes"
        },
        {
          title: "👥 Step 3: User Management Setup",
          content: "WORKFLOW:\n1. Go to Administration → User Management\n2. Create user roles (Admin, Teacher, Student, Parent)\n3. Set permissions for each role\n4. Create initial admin and teacher accounts\n5. Send login credentials to key staff members\n6. Test login with different user types\n\nExpected time: 30 minutes"
        },
        {
          title: "📚 Step 4: Academic Structure",
          content: "WORKFLOW:\n1. Navigate to Academics → Curriculum\n2. Create classes/grades (e.g., Grade 1, Grade 2, etc.)\n3. Add subjects for each class\n4. Create sections/divisions if needed\n5. Set up grading scales and assessment periods\n6. Configure academic calendar\n\nExpected time: 25 minutes"
        },
        {
          title: "✅ Step 5: Verification & Testing",
          content: "WORKFLOW:\n1. Test student enrollment process\n2. Create a sample class and subject\n3. Test teacher assignment to classes\n4. Verify parent portal access\n5. Check all notification systems\n6. Run a complete system backup\n\nExpected time: 15 minutes\n\nTotal Setup Time: Approximately 1.5-2 hours"
        }
      ],
      "First Week Setup Checklist": [
        {
          title: "📅 Day 1: Foundation Setup",
          content: "MORNING TASKS (9 AM - 12 PM):\n• Complete system configuration from Quick Start Guide\n• Set up basic user accounts for key staff\n• Configure school branding and basic settings\n\nAFTERNOON TASKS (1 PM - 5 PM):\n• Import existing student data (if available)\n• Create teacher accounts and assign permissions\n• Test basic functionality with sample data\n\nEVENING REVIEW:\n• Document any issues encountered\n• Prepare materials for tomorrow's staff training"
        },
        {
          title: "📅 Day 2-3: Staff Onboarding",
          content: "DAY 2 WORKFLOW:\n1. Conduct teacher orientation session (2 hours)\n2. Hands-on training for core features\n3. Create individual teacher accounts\n4. Test lesson planning and gradebook features\n\nDAY 3 WORKFLOW:\n1. Administrative staff training (2 hours)\n2. Student enrollment process training\n3. Fee management system overview\n4. Parent communication tools setup\n\nDELIVERABLES:\n• All teachers can log in and navigate\n• Basic lesson plans created\n• Student enrollment tested"
        },
        {
          title: "📅 Day 4-5: Data Migration & Setup",
          content: "DAY 4 WORKFLOW:\n1. Import historical student records\n2. Set up current academic year data\n3. Configure fee structures and payment plans\n4. Test attendance marking system\n\nDAY 5 WORKFLOW:\n1. Parent account creation and portal setup\n2. Communication system configuration\n3. Library and transport module setup (if applicable)\n4. Generate first set of reports\n\nVERIFICATION CHECKLIST:\n• All student data correctly imported\n• Parents can access portals\n• Fee collection system operational"
        },
        {
          title: "📅 Day 6-7: Go-Live Preparation",
          content: "DAY 6 WORKFLOW:\n1. Final system testing with real data\n2. User acceptance testing by key staff\n3. Performance and security checks\n4. Backup and disaster recovery testing\n\nDAY 7 WORKFLOW:\n1. Staff refresher training session\n2. Parent orientation and portal demo\n3. Student account setup and testing\n4. Go-live decision and announcement\n\nGO-LIVE CHECKLIST:\n• All critical functions tested\n• Support procedures documented\n• Emergency contacts established\n• Communication plan activated"
        },
        {
          title: "🎯 Week 1 Success Metrics",
          content: "TECHNICAL METRICS:\n• 100% user login success rate\n• All core modules functional\n• Data integrity verified\n• System performance acceptable\n\nUSER ADOPTION METRICS:\n• 80% of teachers actively using system\n• 60% of parents registered and active\n• 90% of students able to access portal\n• Support tickets under 10 per day\n\nNEXT STEPS:\n• Plan Week 2 advanced feature rollout\n• Schedule user feedback sessions\n• Document lessons learned\n• Prepare for full production launch"
        }
      ],
      "User Onboarding Best Practices": [
        {
          title: "🎯 Onboarding Strategy Overview",
          content: "PHASED APPROACH:\nPhase 1: Core Admin Team (Week 1)\nPhase 2: Teaching Staff (Week 2)\nPhase 3: Students & Parents (Week 3)\nPhase 4: Full School Community (Week 4)\n\nSUCCESS FACTORS:\n• Role-based training materials\n• Hands-on practice sessions\n• Peer mentoring system\n• Continuous support availability"
        },
        {
          title: "👨‍💼 Administrator Onboarding Workflow",
          content: "WEEK 1 SCHEDULE:\nDay 1-2: System Administration Training\n• User management and permissions\n• School configuration settings\n• Data import and export procedures\n• Security and backup protocols\n\nDay 3-4: Academic Management\n• Curriculum setup and management\n• Grading systems configuration\n• Report generation and analytics\n• Integration with existing systems\n\nDay 5: Testing and Validation\n• End-to-end system testing\n• Security audit and compliance check\n• Performance optimization\n• Go-live decision criteria"
        },
        {
          title: "👩‍🏫 Teacher Onboarding Workflow",
          content: "TRAINING SCHEDULE (2-week program):\n\nWEEK 1: Core Features\n• Portal navigation and dashboard\n• Student information management\n• Attendance marking procedures\n• Basic gradebook operations\n\nWEEK 2: Advanced Features\n• Lesson planning and curriculum mapping\n• Assignment creation and grading\n• Parent communication tools\n• Report generation and analytics\n\nSUPPORT STRUCTURE:\n• Buddy system with experienced users\n• Daily Q&A sessions during first week\n• Quick reference guides and video tutorials\n• Dedicated support chat during transition"
        },
        {
          title: "👨‍👩‍👧‍👦 Parent & Student Onboarding",
          content: "COMMUNICATION STRATEGY:\n\nPre-Launch (1 week before):\n• Send welcome email with portal information\n• Provide step-by-step setup instructions\n• Schedule optional orientation sessions\n• Create FAQ document for common questions\n\nLaunch Week:\n• Live demonstration sessions (optional)\n• Phone/email support for login issues\n• Peer ambassador program\n• Quick wins focus (viewing grades, messaging)\n\nPost-Launch (2 weeks after):\n• Usage analytics review\n• Feedback collection and improvements\n• Advanced feature introduction\n• Success story sharing"
        },
        {
          title: "📊 Measuring Onboarding Success",
          content: "KEY PERFORMANCE INDICATORS:\n\nUSER ADOPTION:\n• Login frequency by user type\n• Feature utilization rates\n• Time-to-first-value metrics\n• User satisfaction scores\n\nSYSTEM PERFORMANCE:\n• Support ticket volume and resolution time\n• Error rates and system stability\n• Data accuracy and completeness\n• Integration success rates\n\nBUSINESS IMPACT:\n• Administrative time savings\n• Communication efficiency improvements\n• Academic performance insights\n• Parent engagement increases\n\nCONTINUOUS IMPROVEMENT:\n• Monthly user feedback surveys\n• Quarterly training refreshers\n• Annual system optimization review\n• Feature request prioritization"
        }
      ]
    };
    
    return content[title as keyof typeof content] || [
      {
        title: "Guide Content",
        content: `This is a comprehensive guide for ${title}. It contains detailed instructions and best practices to help you make the most of the Doxa school management system.`
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
      title: "Getting Started with Doxa",
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