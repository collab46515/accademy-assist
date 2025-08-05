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
  Car
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
          title: "Manage Routes",
          description: "Set up and optimize transport routes",
          icon: Car,
          action: "Configure transport routes and schedules",
          tips: [
            "Plan efficient route coverage",
            "Consider safety and timing",
            "Regular route optimization"
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
    }
  ]
};

export const libraryUserGuide = {
  moduleName: "Library Management",
  sections: [
    {
      title: "Book Management",
      description: "Manage library catalog and borrowing",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Catalog Books",
          description: "Add books to library system",
          icon: BookOpen,
          action: "Add books to catalog",
          tips: [
            "Use standard cataloging practices",
            "Include complete book details",
            "Set borrowing policies"
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
    }
  ]
};

export const infirmaryUserGuide = {
  moduleName: "Health & Infirmary",
  sections: [
    {
      title: "Health Records Management",
      description: "Maintain student and staff health records",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Record Medical Visit",
          description: "Document health consultations",
          icon: Stethoscope,
          action: "Create medical visit record",
          tips: [
            "Record symptoms and treatment",
            "Update health history",
            "Follow up if needed"
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
    }
  ]
};

export const communicationUserGuide = {
  moduleName: "Communication",
  sections: [
    {
      title: "School Communication",
      description: "Manage internal and external communications",
      difficulty: "Beginner" as const,
      steps: [
        {
          title: "Send Announcements",
          description: "Broadcast important information",
          icon: MessageSquare,
          action: "Create and send announcements",
          tips: [
            "Target appropriate audience",
            "Use clear, concise messaging",
            "Schedule for optimal timing"
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
    }
  ]
};

export const safeguardingUserGuide = {
  moduleName: "Safeguarding",
  sections: [
    {
      title: "Safeguarding Procedures",
      description: "Handle safeguarding concerns and incidents",
      difficulty: "Intermediate" as const,
      steps: [
        {
          title: "Report Concern",
          description: "Log safeguarding concerns properly",
          icon: Shield,
          action: "Use safeguarding reporting form",
          tips: [
            "Document all details accurately",
            "Follow escalation procedures",
            "Maintain confidentiality"
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
  safeguarding: safeguardingUserGuide
};