import { 
  DollarSign, 
  FileText, 
  BarChart3, 
  Settings, 
  Users, 
  Calendar,
  Download,
  Filter,
  Eye,
  Plus,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building2,
  UserCheck,
  BookOpen,
  GraduationCap,
  Bus,
  Heart,
  Shield,
  MessageSquare,
  ClipboardCheck,
  Stethoscope,
  Car,
  Bell,
  Clock,
  Wand2,
  Target,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Brain
} from 'lucide-react';

export const financeUserGuide = {
  moduleName: "Finance & Accounting",
  sections: [
    {
      title: "Getting Started with Finance Dashboard",
      description: "Learn how to navigate and understand your financial overview",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Access Finance Dashboard",
          description: "Navigate to the Finance Operations page to view your financial overview",
          icon: BarChart3,
          action: "Click on 'Finance Operations' in the main navigation menu",
          tips: [
            "The dashboard shows real-time financial data",
            "All amounts are displayed in British Pounds (£)",
            "Data refreshes automatically every few minutes"
          ]
        },
        {
          title: "Understand Key Metrics",
          description: "Review the four main financial metrics displayed on cards",
          icon: TrendingUp,
          action: "Look at Monthly Revenue, Outstanding Fees, Budget Utilization, and Vendor Payments",
          tips: [
            "Green arrows indicate positive trends",
            "Red arrows show areas needing attention",
            "Click on any metric card for detailed breakdown"
          ]
        },
        {
          title: "View Detailed Reports",
          description: "Click on metric cards to access drill-down reports",
          icon: Eye,
          action: "Click on any statistical card to open detailed analysis",
          tips: [
            "Each metric has its own detailed view",
            "Use filters to narrow down data",
            "Export data as CSV for external analysis"
          ]
        }
      ]
    },
    {
      title: "Managing Fee Collections",
      description: "Step-by-step process for handling student fee collections",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Set Up Fee Structure",
          description: "Configure fee heads and amounts for different student categories",
          icon: Settings,
          action: "Go to Fee Management → Fee Structure Builder",
          tips: [
            "Create separate fee heads for tuition, transport, lunch, etc.",
            "Set different amounts for different classes/streams",
            "Consider seasonal variations in fees"
          ]
        },
        {
          title: "Process Fee Collection",
          description: "Record incoming fee payments from students",
          icon: CreditCard,
          action: "Use Payment Collection interface to record payments",
          tips: [
            "Always verify payment amount before recording",
            "Select correct payment method (cash, card, transfer)",
            "Generate receipt immediately after payment"
          ]
        },
        {
          title: "Handle Outstanding Fees",
          description: "Track and follow up on pending payments",
          icon: AlertTriangle,
          action: "Review Outstanding Fees section regularly",
          tips: [
            "Send reminders for overdue payments",
            "Use bulk actions for efficiency",
            "Maintain payment plans for special cases"
          ]
        },
        {
          title: "Generate Financial Reports",
          description: "Create comprehensive financial reports for management",
          icon: FileText,
          action: "Access Reports & Analytics section",
          tips: [
            "Export reports in multiple formats",
            "Schedule automated report generation",
            "Share reports with relevant stakeholders"
          ]
        }
      ]
    },
    {
      title: "Advanced Financial Analytics",
      description: "Deep dive into financial data analysis and forecasting",
      difficulty: "Advanced" as const,
      steps: [
        {
          title: "Analyze Revenue Trends",
          description: "Study income patterns and seasonal variations",
          icon: TrendingUp,
          action: "Use the Analytics tab in Finance Dashboard",
          tips: [
            "Compare month-over-month performance",
            "Identify peak collection periods",
            "Plan for seasonal fluctuations"
          ]
        },
        {
          title: "Budget Planning & Monitoring",
          description: "Set budgets and monitor spending against targets",
          icon: Building2,
          action: "Configure budget parameters in Budget Utilization section",
          tips: [
            "Set realistic budget targets",
            "Monitor spending patterns regularly",
            "Adjust budgets based on actual performance"
          ]
        },
        {
          title: "Vendor Payment Management",
          description: "Track and manage payments to suppliers and vendors",
          icon: CheckCircle,
          action: "Monitor Vendor Payments metric and detailed breakdown",
          tips: [
            "Maintain vendor payment schedules",
            "Negotiate favorable payment terms",
            "Track vendor performance metrics"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Record New Payment",
      description: "Quickly record a student fee payment",
      icon: Plus,
      action: "Start Payment Entry"
    },
    {
      title: "Generate Invoice",
      description: "Create invoice for outstanding fees",
      icon: FileText,
      action: "Create Invoice"
    },
    {
      title: "Export Financial Report",
      description: "Download comprehensive financial data",
      icon: Download,
      action: "Export Report"
    },
    {
      title: "View Outstanding Fees",
      description: "Check all pending payments",
      icon: AlertTriangle,
      action: "View Outstanding"
    }
  ]
};

export const academicsUserGuide = {
  moduleName: "Academics & Curriculum",
  sections: [
    {
      title: "Curriculum Management Basics",
      description: "Learn to manage curriculum and lesson planning",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Set Up Academic Structure",
          description: "Configure classes, subjects, and academic terms",
          icon: GraduationCap,
          action: "Navigate to Academics → Curriculum Management",
          tips: [
            "Define clear academic year structure",
            "Set up subjects for each class level",
            "Configure assessment periods"
          ]
        },
        {
          title: "Create Lesson Plans",
          description: "Develop detailed lesson plans for each subject",
          icon: BookOpen,
          action: "Use Lesson Planning interface",
          tips: [
            "Align with curriculum standards",
            "Include learning objectives",
            "Plan assessment activities"
          ]
        },
        {
          title: "Track Curriculum Progress",
          description: "Monitor teaching progress across subjects",
          icon: BarChart3,
          action: "Access Progress Dashboard",
          tips: [
            "Regular progress reviews",
            "Identify lagging areas",
            "Adjust teaching pace as needed"
          ]
        }
      ]
    },
    {
      title: "Advanced Lesson Planning",
      description: "Master advanced curriculum planning features",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Create Topic Dependencies",
          description: "Set up prerequisite relationships between topics",
          icon: Settings,
          action: "Configure topic relationships in Topic Manager",
          tips: [
            "Map topic prerequisites clearly",
            "Ensure logical flow of concepts",
            "Consider student learning progression"
          ]
        },
        {
          title: "Generate Coverage Reports",
          description: "Create detailed curriculum coverage analysis",
          icon: FileText,
          action: "Use Coverage Reporting tools",
          tips: [
            "Weekly and monthly coverage tracking",
            "Identify gaps in teaching",
            "Plan catch-up sessions"
          ]
        },
        {
          title: "Manage Gap Alerts",
          description: "Handle curriculum gap notifications",
          icon: AlertTriangle,
          action: "Respond to Gap Alerts System notifications",
          tips: [
            "Address gaps promptly",
            "Plan remedial sessions",
            "Communicate with HODs"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Create Lesson Plan",
      description: "Start a new lesson plan",
      icon: Plus,
      action: "New Lesson Plan"
    },
    {
      title: "View Curriculum Progress",
      description: "Check curriculum coverage",
      icon: BarChart3,
      action: "Progress Dashboard"
    },
    {
      title: "Topic Manager",
      description: "Manage subject topics",
      icon: BookOpen,
      action: "Topic Management"
    },
    {
      title: "Generate Report",
      description: "Create coverage report",
      icon: FileText,
      action: "Coverage Report"
    }
  ]
};

export const studentServicesUserGuide = {
  moduleName: "Student Services",
  sections: [
    {
      title: "Student Enrollment Process",
      description: "Complete guide to enrolling new students",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Collect Application",
          description: "Gather all required documents and information",
          icon: FileText,
          action: "Start with Enrollment Form",
          tips: [
            "Verify all required documents",
            "Check application completeness",
            "Confirm eligibility criteria"
          ]
        },
        {
          title: "Process Admission",
          description: "Review application and make admission decision",
          icon: CheckCircle,
          action: "Use Admissions Workflow",
          tips: [
            "Follow admission criteria strictly",
            "Document decision reasons",
            "Communicate decision promptly"
          ]
        },
        {
          title: "Student Registration",
          description: "Complete student registration and class assignment",
          icon: UserCheck,
          action: "Process through Registration System",
          tips: [
            "Assign to appropriate class/section",
            "Generate student ID number",
            "Setup parent portal access"
          ]
        }
      ]
    },
    {
      title: "Student Information Management",
      description: "Manage comprehensive student records",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Maintain Student Profiles",
          description: "Keep student information up-to-date",
          icon: Users,
          action: "Update student profiles regularly",
          tips: [
            "Verify contact information quarterly",
            "Update emergency contacts",
            "Record any special needs or requirements"
          ]
        },
        {
          title: "Handle Student Transfers",
          description: "Process student transfers and withdrawals",
          icon: Settings,
          action: "Use Transfer/Withdrawal workflow",
          tips: [
            "Generate transfer certificates",
            "Update records accordingly",
            "Communicate with receiving institution"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "New Student Enrollment",
      description: "Start enrollment process",
      icon: UserCheck,
      action: "Begin Enrollment"
    },
    {
      title: "Student Search",
      description: "Find student records",
      icon: Eye,
      action: "Search Students"
    },
    {
      title: "Generate Reports",
      description: "Student data reports",
      icon: FileText,
      action: "Create Report"
    },
    {
      title: "Bulk Operations",
      description: "Bulk student actions",
      icon: Settings,
      action: "Bulk Actions"
    }
  ]
};

// Add guides for other modules
export const hrUserGuide = {
  moduleName: "Human Resources",
  sections: [
    {
      title: "Employee Management",
      description: "Manage staff records and HR processes",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Add New Employee",
          description: "Create comprehensive employee records",
          icon: Users,
          action: "Go to HR Management → Add Employee",
          tips: [
            "Collect all personal and professional details",
            "Verify qualifications and experience",
            "Set up payroll information"
          ]
        },
        {
          title: "Employee Onboarding",
          description: "Complete new employee orientation process",
          icon: UserCheck,
          action: "Follow onboarding checklist",
          tips: [
            "Prepare welcome package",
            "Schedule orientation sessions",
            "Set up IT accounts and access"
          ]
        },
        {
          title: "Manage Employee Records",
          description: "Maintain up-to-date staff information",
          icon: FileText,
          action: "Regular record updates",
          tips: [
            "Annual qualification reviews",
            "Track professional development",
            "Update contact information"
          ]
        }
      ]
    },
    {
      title: "Recruitment & Hiring",
      description: "Complete recruitment process management",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Create Job Requisitions",
          description: "Define job requirements and posting",
          icon: Plus,
          action: "Use Job Requisitions Manager",
          tips: [
            "Define clear job requirements",
            "Set competitive compensation",
            "Include essential qualifications"
          ]
        },
        {
          title: "Manage Applications",
          description: "Review and process job applications",
          icon: ClipboardCheck,
          action: "Process through Applications Manager",
          tips: [
            "Screen applications systematically",
            "Maintain communication with candidates",
            "Document selection decisions"
          ]
        },
        {
          title: "Conduct Interviews",
          description: "Schedule and manage interview process",
          icon: Calendar,
          action: "Use Interview Scheduler",
          tips: [
            "Prepare structured interview questions",
            "Include multiple interviewers",
            "Document interview feedback"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Add New Employee",
      description: "Create new staff record",
      icon: Plus,
      action: "New Employee"
    },
    {
      title: "View Recruitment",
      description: "Check recruitment pipeline",
      icon: Users,
      action: "Recruitment Dashboard"
    },
    {
      title: "Employee Directory",
      description: "Browse staff directory",
      icon: Eye,
      action: "Staff Directory"
    },
    {
      title: "Generate HR Reports",
      description: "Create staff reports",
      icon: FileText,
      action: "HR Reports"
    }
  ]
};

export const transportUserGuide = {
  moduleName: "Transport Management",
  sections: [
    {
      title: "Transport Operations",
      description: "Manage school transport system",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Set Up Transport Routes",
          description: "Create and configure transport routes",
          icon: Car,
          action: "Navigate to Transport → Routes & Schedules",
          tips: [
            "Plan efficient route coverage",
            "Consider safety and timing",
            "Map pickup and drop-off points"
          ]
        },
        {
          title: "Manage Vehicle Fleet",
          description: "Register and maintain vehicle information",
          icon: Bus,
          action: "Go to Vehicle Management section",
          tips: [
            "Keep maintenance records updated",
            "Track vehicle capacity",
            "Monitor fuel consumption"
          ]
        },
        {
          title: "Assign Students to Routes",
          description: "Allocate students to appropriate transport routes",
          icon: Users,
          action: "Use Student Assignments interface",
          tips: [
            "Consider route capacity",
            "Optimize pickup locations",
            "Maintain waiting lists"
          ]
        }
      ]
    },
    {
      title: "Advanced Transport Features",
      description: "Utilize advanced transport management capabilities",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Real-time Vehicle Tracking",
          description: "Monitor vehicle locations and status",
          icon: Eye,
          action: "Access Vehicle Tracking dashboard",
          tips: [
            "Monitor arrival times",
            "Track route deviations",
            "Alert parents of delays"
          ]
        },
        {
          title: "Driver Management",
          description: "Manage driver records and assignments",
          icon: UserCheck,
          action: "Use Driver Management module",
          tips: [
            "Verify driver licenses",
            "Track performance metrics",
            "Schedule training sessions"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Track Vehicles",
      description: "Monitor vehicle locations",
      icon: Bus,
      action: "Vehicle Tracking"
    },
    {
      title: "Route Planning",
      description: "Create new routes",
      icon: Car,
      action: "Plan Routes"
    },
    {
      title: "Student Assignments",
      description: "Assign students to routes",
      icon: Users,
      action: "Student Transport"
    },
    {
      title: "Transport Reports",
      description: "Generate transport analytics",
      icon: BarChart3,
      action: "Transport Reports"
    }
  ]
};

export const libraryUserGuide = {
  moduleName: "Library Management",
  sections: [
    {
      title: "Book Management Fundamentals",
      description: "Manage library catalog and collection",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Catalog New Books",
          description: "Add books to the library system",
          icon: BookOpen,
          action: "Go to Library → Book Catalog",
          tips: [
            "Use ISBN for quick cataloging",
            "Include complete bibliographic details",
            "Set appropriate reading levels"
          ]
        },
        {
          title: "Manage Book Borrowing",
          description: "Handle book checkouts and returns",
          icon: Users,
          action: "Use Borrowing & Returns interface",
          tips: [
            "Verify student identity",
            "Check borrowing limits",
            "Set appropriate due dates"
          ]
        },
        {
          title: "Digital Resource Management",
          description: "Manage electronic books and resources",
          icon: Settings,
          action: "Access Digital Resources section",
          tips: [
            "Set up digital access credentials",
            "Monitor usage statistics",
            "Maintain subscription renewals"
          ]
        }
      ]
    },
    {
      title: "Advanced Library Operations",
      description: "Master library administration features",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Library Analytics",
          description: "Track library usage and trends",
          icon: BarChart3,
          action: "Generate Library Reports",
          tips: [
            "Monitor popular books",
            "Track borrowing patterns",
            "Identify collection gaps"
          ]
        },
        {
          title: "Fine Management",
          description: "Handle overdue fines and penalties",
          icon: AlertTriangle,
          action: "Use Library Fines module",
          tips: [
            "Set fair fine policies",
            "Send overdue reminders",
            "Process fine payments"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Issue Book",
      description: "Lend book to student",
      icon: BookOpen,
      action: "Book Issue"
    },
    {
      title: "Return Book",
      description: "Process book return",
      icon: CheckCircle,
      action: "Book Return"
    },
    {
      title: "Search Catalog",
      description: "Find books in catalog",
      icon: Eye,
      action: "Book Search"
    },
    {
      title: "Library Reports",
      description: "Generate usage reports",
      icon: FileText,
      action: "Generate Reports"
    }
  ]
};

export const infirmaryUserGuide = {
  moduleName: "Health & Infirmary",
  sections: [
    {
      title: "Health Records Management",
      description: "Maintain comprehensive health records",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Record Medical Visits",
          description: "Document health consultations and treatments",
          icon: Stethoscope,
          action: "Create new medical visit record",
          tips: [
            "Record symptoms accurately",
            "Document treatment provided",
            "Note any follow-up required"
          ]
        },
        {
          title: "Manage Student Health Profiles",
          description: "Maintain individual health information",
          icon: Users,
          action: "Update student health records",
          tips: [
            "Record allergies and medical conditions",
            "Update emergency contacts",
            "Track vaccination records"
          ]
        },
        {
          title: "Medicine Administration",
          description: "Track and administer medications",
          icon: Heart,
          action: "Use Medicine Given interface",
          tips: [
            "Verify prescription details",
            "Record dosage and timing",
            "Monitor for side effects"
          ]
        }
      ]
    },
    {
      title: "Health Monitoring & Analytics",
      description: "Track health trends and generate reports",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Health Trend Analysis",
          description: "Monitor health patterns across the school",
          icon: BarChart3,
          action: "Generate health analytics reports",
          tips: [
            "Track seasonal illness patterns",
            "Identify health risk factors",
            "Plan preventive measures"
          ]
        },
        {
          title: "Emergency Response",
          description: "Handle medical emergencies effectively",
          icon: AlertTriangle,
          action: "Follow emergency protocols",
          tips: [
            "Maintain emergency contact lists",
            "Know location of emergency equipment",
            "Have clear evacuation procedures"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "New Medical Visit",
      description: "Record health consultation",
      icon: Heart,
      action: "Medical Visit"
    },
    {
      title: "View Today's Cases",
      description: "Check today's visits",
      icon: Eye,
      action: "Today's Visits"
    },
    {
      title: "Medicine Administration",
      description: "Record medicine given",
      icon: Stethoscope,
      action: "Medicine Given"
    },
    {
      title: "Health Reports",
      description: "Generate health analytics",
      icon: FileText,
      action: "Health Reports"
    }
  ]
};

export const communicationUserGuide = {
  moduleName: "Communication",
  sections: [
    {
      title: "School Communication Basics",
      description: "Manage internal and external communications",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Create Announcements",
          description: "Broadcast important information to school community",
          icon: MessageSquare,
          action: "Go to Communication → Create Announcement",
          tips: [
            "Choose appropriate audience (students, parents, staff)",
            "Use clear, concise messaging",
            "Schedule for optimal timing"
          ]
        },
        {
          title: "Send Targeted Messages",
          description: "Send messages to specific groups or individuals",
          icon: Users,
          action: "Use targeted messaging features",
          tips: [
            "Select recipients carefully",
            "Personalize messages when appropriate",
            "Track delivery and read receipts"
          ]
        },
        {
          title: "Manage Communication Templates",
          description: "Create reusable message templates",
          icon: FileText,
          action: "Set up communication templates",
          tips: [
            "Create templates for common messages",
            "Include placeholder text for personalization",
            "Organize templates by category"
          ]
        }
      ]
    },
    {
      title: "Advanced Communication Features",
      description: "Master advanced messaging and notification features",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Automated Notifications",
          description: "Set up automated alerts and reminders",
          icon: Bell,
          action: "Configure automated communication rules",
          tips: [
            "Set up attendance alerts",
            "Configure fee payment reminders",
            "Schedule regular announcements"
          ]
        },
        {
          title: "Communication Analytics",
          description: "Track communication effectiveness",
          icon: BarChart3,
          action: "Review communication reports",
          tips: [
            "Monitor message delivery rates",
            "Track engagement metrics",
            "Optimize timing and content"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Send Message",
      description: "Send communication",
      icon: MessageSquare,
      action: "New Message"
    },
    {
      title: "Create Announcement",
      description: "Broadcast to school",
      icon: Bell,
      action: "New Announcement"
    },
    {
      title: "Message Templates",
      description: "Manage templates",
      icon: FileText,
      action: "Templates"
    },
    {
      title: "Communication Reports",
      description: "View analytics",
      icon: BarChart3,
      action: "Reports"
    }
  ]
};

export const safeguardingUserGuide = {
  moduleName: "Safeguarding",
  sections: [
    {
      title: "Safeguarding Fundamentals",
      description: "Essential safeguarding procedures and documentation",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Report Safeguarding Concerns",
          description: "Log safeguarding concerns and incidents properly",
          icon: Shield,
          action: "Use safeguarding reporting form",
          tips: [
            "Document all details accurately and objectively",
            "Follow escalation procedures immediately",
            "Maintain strict confidentiality",
            "Include only factual information"
          ]
        },
        {
          title: "Incident Documentation",
          description: "Create comprehensive incident records",
          icon: FileText,
          action: "Complete incident documentation",
          tips: [
            "Record timeline of events",
            "Include witness statements",
            "Photograph evidence if appropriate",
            "Store securely and confidentially"
          ]
        },
        {
          title: "Follow-up Actions",
          description: "Track and manage ongoing safeguarding cases",
          icon: CheckCircle,
          action: "Monitor case progress",
          tips: [
            "Regular review meetings",
            "Update action plans",
            "Communicate with relevant agencies",
            "Monitor student wellbeing"
          ]
        }
      ]
    },
    {
      title: "Advanced Safeguarding Management",
      description: "Complex case management and reporting",
      difficulty: "Advanced" as const,
      steps: [
        {
          title: "Multi-Agency Coordination",
          description: "Work with external safeguarding agencies",
          icon: Users,
          action: "Coordinate with external partners",
          tips: [
            "Maintain professional relationships",
            "Share information appropriately",
            "Follow legal requirements",
            "Document all interactions"
          ]
        },
        {
          title: "Safeguarding Analytics",
          description: "Monitor safeguarding trends and patterns",
          icon: BarChart3,
          action: "Generate safeguarding reports",
          tips: [
            "Identify recurring patterns",
            "Monitor intervention effectiveness",
            "Plan preventive measures",
            "Report to governing body"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Report Concern",
      description: "Log safeguarding issue",
      icon: Shield,
      action: "New Report"
    },
    {
      title: "View Active Cases",
      description: "Check ongoing cases",
      icon: Eye,
      action: "Active Cases"
    },
    {
      title: "Generate Reports",
      description: "Create safeguarding reports",
      icon: FileText,
      action: "Reports"
    },
    {
      title: "Training Records",
      description: "Manage staff training",
      icon: GraduationCap,
      action: "Training"
    }
  ]
};

// Add new comprehensive user guides for additional modules
export const attendanceUserGuide = {
  moduleName: "Attendance Management",
  sections: [
    {
      title: "Daily Attendance Operations",
      description: "Manage daily student attendance recording",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Mark Class Attendance",
          description: "Record student attendance for each class period",
          icon: CheckCircle,
          action: "Go to Attendance → Mark Attendance",
          tips: [
            "Mark attendance promptly at lesson start",
            "Use appropriate absence codes",
            "Note any late arrivals with reasons"
          ]
        },
        {
          title: "Handle Late Arrivals",
          description: "Process and record student late arrivals",
          icon: Clock,
          action: "Record late arrival with reason",
          tips: [
            "Document arrival time accurately",
            "Record reason for lateness",
            "Issue late passes when required"
          ]
        },
        {
          title: "Manage Absence Requests",
          description: "Process authorized absence requests",
          icon: FileText,
          action: "Review and approve absence requests",
          tips: [
            "Verify supporting documentation",
            "Apply appropriate absence codes",
            "Communicate decisions to parents"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Mark Attendance",
      description: "Record class attendance",
      icon: CheckCircle,
      action: "Mark Present/Absent"
    },
    {
      title: "Attendance Reports",
      description: "Generate attendance analytics",
      icon: BarChart3,
      action: "View Reports"
    }
  ]
};

export const timetableUserGuide = {
  moduleName: "AI Timetable Generator",
  sections: [
    {
      title: "Getting Started with AI Timetable",
      description: "Set up and configure your AI-powered timetable system",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Academic Structure Setup",
          description: "Configure your school's basic academic framework including terms, periods, and breaks",
          icon: Calendar,
          action: "Go to Data Setup → Academic Structure",
          tips: [
            "Define clear start and end times for each period",
            "Include break times and lunch periods",
            "Set up different day types (full days, half days, etc.)",
            "Consider transition time between periods"
          ]
        },
        {
          title: "Subject Configuration",
          description: "Set up subjects with their specific requirements and constraints",
          icon: BookOpen,
          action: "Configure subjects in Subject Configuration",
          tips: [
            "Specify room type requirements (lab, gym, classroom)",
            "Set frequency requirements per week",
            "Define double periods where needed",
            "Add subject-specific timing preferences"
          ]
        },
        {
          title: "Teacher & Room Management",
          description: "Configure teacher availability and classroom assignments",
          icon: Users,
          action: "Set up teachers and rooms in Data Setup",
          tips: [
            "Mark teacher availability periods",
            "Assign subjects to qualified teachers",
            "Set room capacities and equipment",
            "Define special room requirements"
          ]
        }
      ]
    },
    {
      title: "AI Timetable Generation",
      description: "Use AI to automatically create optimized timetables",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Set Generation Constraints",
          description: "Define rules and preferences for the AI timetable generator",
          icon: Settings,
          action: "Access Constraints Manager",
          tips: [
            "Set core subject distribution preferences",
            "Define teacher workload limits",
            "Specify room utilization goals",
            "Add scheduling conflict rules"
          ]
        },
        {
          title: "Run AI Generation",
          description: "Execute the AI timetable generation process",
          icon: Wand2,
          action: "Click Generate Timetable",
          tips: [
            "Monitor generation progress in real-time",
            "Review constraint satisfaction scores",
            "Check for any unresolved conflicts",
            "Save multiple generation attempts for comparison"
          ]
        },
        {
          title: "Review & Optimize",
          description: "Evaluate and fine-tune the generated timetable",
          icon: Target,
          action: "Use Interactive Timetable Editor",
          tips: [
            "Review teacher workload distribution",
            "Check room utilization efficiency",
            "Verify no scheduling conflicts exist",
            "Make manual adjustments where needed"
          ]
        }
      ]
    },
    {
      title: "Live Timetable Management",
      description: "Manage real-time timetable operations and changes",
      difficulty: "Advanced" as const,
      steps: [
        {
          title: "Conflict Detection",
          description: "Monitor and resolve timetable conflicts as they arise",
          icon: AlertCircle,
          action: "Use Conflict Detector",
          tips: [
            "Set up automatic conflict alerts",
            "Review daily conflict reports",
            "Resolve clashes quickly to minimize disruption",
            "Document resolution decisions"
          ]
        },
        {
          title: "Substitution Planning",
          description: "Handle teacher absences and emergency schedule changes",
          icon: RefreshCw,
          action: "Access Substitution Planner",
          tips: [
            "Maintain updated cover teacher list",
            "Plan substitutions in advance where possible",
            "Communicate changes to affected parties",
            "Track substitution patterns for planning"
          ]
        },
        {
          title: "Auto-Regeneration",
          description: "Use AI to automatically adjust timetables for changes",
          icon: Sparkles,
          action: "Enable Auto-Regeneration",
          tips: [
            "Set regeneration triggers and thresholds",
            "Review auto-generated changes before implementation",
            "Maintain backup versions of stable timetables",
            "Monitor system performance during regeneration"
          ]
        }
      ]
    },
    {
      title: "Analytics & Optimization",
      description: "Use data insights to continuously improve your timetable",
      difficulty: "Advanced" as const,
      steps: [
        {
          title: "Performance Analytics",
          description: "Analyze timetable effectiveness and utilization",
          icon: BarChart3,
          action: "View Analytics Dashboard",
          tips: [
            "Monitor room utilization rates",
            "Track teacher workload distribution",
            "Analyze student movement patterns",
            "Review constraint satisfaction metrics"
          ]
        },
        {
          title: "AI Learning Optimization",
          description: "Help the AI learn from your preferences and decisions",
          icon: Brain,
          action: "Review AI Learning Dashboard",
          tips: [
            "Provide feedback on generated timetables",
            "Rate the quality of different solutions",
            "Update constraints based on experience",
            "Document successful timetable patterns"
          ]
        }
      ]
    }
  ],
  quickActions: [
    {
      title: "Generate New Timetable",
      description: "Start AI timetable generation",
      icon: Wand2,
      action: "Quick Generate"
    },
    {
      title: "View Current Timetable",
      description: "Check active schedules",
      icon: Calendar,
      action: "View Schedule"
    },
    {
      title: "Manage Substitutions",
      description: "Handle teacher coverage",
      icon: RefreshCw,
      action: "Substitution Planner"
    },
    {
      title: "Export Timetables",
      description: "Download schedule files",
      icon: Download,
      action: "Export Manager"
    },
    {
      title: "Conflict Resolution",
      description: "Fix scheduling issues",
      icon: AlertCircle,
      action: "Resolve Conflicts"
    }
  ]
};

// Export all guides
export const userGuides = {
  finance: financeUserGuide,
  academics: academicsUserGuide,
  studentServices: studentServicesUserGuide,
  hr: hrUserGuide,
  transport: transportUserGuide,
  library: libraryUserGuide,
  infirmary: infirmaryUserGuide,
  communication: communicationUserGuide,
  safeguarding: safeguardingUserGuide,
  attendance: attendanceUserGuide,
  timetable: timetableUserGuide
};