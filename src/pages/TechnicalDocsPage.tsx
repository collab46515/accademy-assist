import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileCode, 
  Database, 
  Server, 
  Layers, 
  GitBranch, 
  Settings, 
  Shield, 
  Zap, 
  Globe,
  Code,
  BookOpen,
  Users,
  Cloud,
  Lock,
  Monitor,
  Smartphone,
  Brain,
  ArrowRight,
  ExternalLink,
  Copy,
  Terminal,
  Package,
  Workflow
} from 'lucide-react';

export default function TechnicalDocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const techStack = [
    { 
      name: "React 18", 
      description: "Frontend framework with hooks, concurrent features, and automatic batching", 
      icon: Code, 
      category: "Frontend",
      version: "18.3.1",
      purpose: "Main UI framework providing component-based architecture"
    },
    { 
      name: "TypeScript", 
      description: "Strongly typed JavaScript with compile-time error checking", 
      icon: FileCode, 
      category: "Language",
      version: "5.x",
      purpose: "Type safety, better IDE support, and reduced runtime errors"
    },
    { 
      name: "Tailwind CSS", 
      description: "Utility-first CSS framework with custom design system", 
      icon: Monitor, 
      category: "Styling",
      version: "3.x",
      purpose: "Consistent styling, responsive design, and design tokens"
    },
    { 
      name: "Vite", 
      description: "Next-generation build tool with HMR and lightning-fast builds", 
      icon: Zap, 
      category: "Build Tool",
      version: "5.x",
      purpose: "Development server, build optimization, and module bundling"
    },
    { 
      name: "Supabase", 
      description: "Open-source Firebase alternative with PostgreSQL", 
      icon: Database, 
      category: "Backend",
      version: "2.x",
      purpose: "Authentication, database, real-time subscriptions, and storage"
    },
    { 
      name: "React Router", 
      description: "Declarative client-side routing for React applications", 
      icon: Globe, 
      category: "Routing",
      version: "6.x",
      purpose: "Navigation, protected routes, and URL management"
    },
    { 
      name: "TanStack Query", 
      description: "Powerful data synchronization for React (formerly React Query)", 
      icon: Server, 
      category: "Data Management",
      version: "5.x",
      purpose: "Server state management, caching, and background updates"
    },
    { 
      name: "Shadcn/UI", 
      description: "Radix-based component library with customizable design", 
      icon: Layers, 
      category: "Components",
      version: "Latest",
      purpose: "Accessible UI components with consistent design system"
    },
    { 
      name: "Lucide React", 
      description: "Beautiful & consistent icon toolkit", 
      icon: Smartphone, 
      category: "Icons",
      version: "0.462.0",
      purpose: "Consistent iconography across the application"
    },
    { 
      name: "Zod", 
      description: "TypeScript-first schema declaration and validation library", 
      icon: Shield, 
      category: "Validation",
      version: "3.x",
      purpose: "Runtime type checking and form validation"
    }
  ];

  const projectStructure = `
DOXA Education Platform/
├── 📁 public/                           # Static assets and public files
│   ├── favicon.ico                      # Browser favicon
│   ├── placeholder.svg                  # Default placeholder image
│   └── 📁 lovable-uploads/             # User-uploaded images and assets
│
├── 📁 src/                             # Source code directory
│   ├── 📁 components/                  # Reusable React components
│   │   ├── 📁 ui/                     # Base UI components (Shadcn/UI)
│   │   │   ├── button.tsx             # Button component with variants
│   │   │   ├── card.tsx               # Card layouts
│   │   │   ├── dialog.tsx             # Modal dialogs
│   │   │   ├── form.tsx               # Form components
│   │   │   ├── input.tsx              # Input fields
│   │   │   ├── select.tsx             # Dropdown selects
│   │   │   ├── table.tsx              # Data tables
│   │   │   ├── tabs.tsx               # Tab navigation
│   │   │   └── ...                    # Other base components
│   │   │
│   │   ├── 📁 auth/                   # Authentication components
│   │   │   ├── SignInModal.tsx        # Login modal
│   │   │   ├── ProtectedRoute.tsx     # Route protection
│   │   │   └── RoleBasedAccess.tsx    # RBAC components
│   │   │
│   │   ├── 📁 layout/                 # Layout and navigation
│   │   │   ├── AppSidebar.tsx         # Main sidebar navigation
│   │   │   ├── Navbar.tsx             # Top navigation bar
│   │   │   ├── UserMenu.tsx           # User dropdown menu
│   │   │   └── ...                    # Other layout components
│   │   │
│   │   ├── 📁 dashboard/              # Dashboard-specific components
│   │   │   ├── StatsCards.tsx         # Dashboard statistics
│   │   │   ├── RecentActivity.tsx     # Activity feed
│   │   │   └── QuickActions.tsx       # Quick action buttons
│   │   │
│   │   ├── 📁 students/               # Student management components
│   │   │   ├── StudentList.tsx        # Student directory
│   │   │   ├── StudentProfile.tsx     # Individual student profile
│   │   │   ├── AddStudentForm.tsx     # New student form
│   │   │   └── BulkImport.tsx         # Bulk student import
│   │   │
│   │   ├── 📁 attendance/             # Attendance system components
│   │   │   ├── AttendanceMarking.tsx  # Mark attendance interface
│   │   │   ├── AttendanceReports.tsx  # Attendance reporting
│   │   │   ├── ClassAttendance.tsx    # Class-wide attendance
│   │   │   └── AbsenceAlerts.tsx      # Absence notifications
│   │   │
│   │   ├── 📁 curriculum/             # Curriculum & lesson planning
│   │   │   ├── LessonPlanner.tsx      # Lesson planning interface
│   │   │   ├── CurriculumTracker.tsx  # Curriculum progress
│   │   │   ├── AssignmentCreator.tsx  # Assignment creation
│   │   │   └── GradingInterface.tsx   # Grading system
│   │   │
│   │   ├── 📁 timetable/              # Timetable management
│   │   │   ├── TimetableGrid.tsx      # Weekly timetable view
│   │   │   ├── PeriodEditor.tsx       # Period configuration
│   │   │   ├── ClassSchedule.tsx      # Class scheduling
│   │   │   └── TeacherSchedule.tsx    # Teacher timetables
│   │   │
│   │   ├── 📁 ai-classroom/           # AI Classroom Suite
│   │   │   ├── LiveAnalytics.tsx      # Real-time analytics
│   │   │   ├── EngagementMetrics.tsx  # Student engagement data
│   │   │   ├── AIAssistant.tsx        # AI teaching assistant
│   │   │   └── SmartInterventions.tsx # Automated interventions
│   │   │
│   │   ├── 📁 landing/                # Landing page components
│   │   │   ├── HeroSection.tsx        # Main hero section
│   │   │   ├── FeaturesGrid.tsx       # Feature showcase
│   │   │   ├── TestimonialsSection.tsx # Customer testimonials
│   │   │   └── ContactModal.tsx       # Contact form
│   │   │
│   │   └── 📁 [feature]/             # Other feature-specific components
│       │   ├── Component1.tsx         
│       │   └── Component2.tsx
│       └── ...
│
│   ├── 📁 pages/                      # Page-level components (Route handlers)
│   │   ├── Dashboard.tsx              # Main dashboard page
│   │   ├── StudentsPage.tsx           # Student management page
│   │   ├── AttendancePage.tsx         # Attendance management
│   │   ├── CurriculumPage.tsx         # Curriculum planning
│   │   ├── TimetablePage.tsx          # Timetable management
│   │   ├── AISuitePage.tsx            # AI features hub
│   │   ├── LandingPage.tsx            # Public landing page
│   │   ├── TechnicalDocsPage.tsx      # This documentation page
│   │   └── ...                        # Other page components
│
│   ├── 📁 hooks/                      # Custom React hooks
│   │   ├── useAuth.ts                 # Authentication hook
│   │   ├── useRBAC.ts                 # Role-based access control
│   │   ├── useLocalStorage.ts         # Local storage management
│   │   ├── useDebounce.ts             # Debounced values
│   │   └── ...                        # Other custom hooks
│
│   ├── 📁 integrations/               # External service integrations
│   │   └── 📁 supabase/              # Supabase configuration
│   │       ├── client.ts              # Supabase client setup
│   │       ├── types.ts               # Generated database types
│   │       └── auth.ts                # Authentication helpers
│
│   ├── 📁 lib/                        # Utility functions and configurations
│   │   ├── utils.ts                   # Common utility functions
│   │   ├── constants.ts               # Application constants
│   │   ├── validators.ts              # Zod validation schemas
│   │   └── formatters.ts              # Data formatting utilities
│
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   ├── index.css                      # Global styles and design tokens
│   └── vite-env.d.ts                  # Vite type definitions
│
├── 📁 supabase/                       # Database schema and migrations
│   ├── 📁 migrations/                # SQL migration files
│   │   ├── 20240101000000_initial_schema.sql
│   │   ├── 20240102000000_rbac_system.sql
│   │   ├── 20240103000000_student_management.sql
│   │   └── ...                        # Other migration files
│   └── config.toml                    # Supabase configuration
│
├── 📄 Configuration Files
├── package.json                       # Project dependencies and scripts
├── package-lock.json                  # Locked dependency versions
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.app.json                  # App-specific TypeScript config
├── tsconfig.node.json                 # Node-specific TypeScript config
├── vite.config.ts                     # Vite build configuration
├── components.json                    # Shadcn/UI component configuration
├── postcss.config.js                  # PostCSS configuration
├── .gitignore                         # Git ignore patterns
└── README.md                          # Project documentation
  `;

  const databaseSchema = [
    { 
      name: "profiles", 
      description: "User profiles with personal information and preferences", 
      type: "Core",
      columns: "id, email, full_name, avatar_url, role, created_at, updated_at",
      relationships: "Links to user_school_roles, attendance_records"
    },
    { 
      name: "schools", 
      description: "School organizations with settings and configuration", 
      type: "Core",
      columns: "id, name, address, contact_info, settings, created_at",
      relationships: "Parent to all school-specific data"
    },
    { 
      name: "user_school_roles", 
      description: "Role-based access control system linking users to schools", 
      type: "Authentication",
      columns: "id, user_id, school_id, role, permissions, is_active",
      relationships: "Links profiles to schools with specific roles"
    },
    { 
      name: "students", 
      description: "Complete student records and academic information", 
      type: "Students",
      columns: "id, school_id, student_id, first_name, last_name, date_of_birth, class_id, parent_info",
      relationships: "Links to classes, attendance_records, academic_records"
    },
    { 
      name: "classes", 
      description: "Class/form groups with teacher assignments", 
      type: "Academic",
      columns: "id, school_id, class_name, year_group, form_teacher, max_capacity",
      relationships: "Contains students, links to timetable_entries"
    },
    { 
      name: "subjects", 
      description: "Academic subjects with curriculum standards", 
      type: "Academic",
      columns: "id, school_id, subject_name, subject_code, color_code, curriculum_standards",
      relationships: "Used in timetable_entries, lesson_plans, assessments"
    },
    { 
      name: "attendance_records", 
      description: "Daily attendance tracking with real-time updates", 
      type: "Attendance",
      columns: "id, student_id, school_id, date, status, period_id, marked_by, notes",
      relationships: "Links to students, periods, marking teacher"
    },
    { 
      name: "timetable_entries", 
      description: "Complete schedule management with AI optimization", 
      type: "Timetable",
      columns: "id, school_id, class_id, subject_id, teacher_id, period_id, day_of_week, room_id",
      relationships: "Links classes, subjects, teachers, periods, rooms"
    },
    { 
      name: "school_periods", 
      description: "Flexible period definitions supporting various schedules", 
      type: "Timetable",
      columns: "id, school_id, period_name, start_time, end_time, days_of_week, is_active",
      relationships: "Used in timetable_entries, attendance_records"
    },
    { 
      name: "classrooms", 
      description: "Physical and virtual classroom resource management", 
      type: "Resources",
      columns: "id, school_id, room_name, room_type, capacity, equipment, availability",
      relationships: "Assigned in timetable_entries"
    },
    { 
      name: "lesson_plans", 
      description: "AI-enhanced lesson planning with curriculum alignment", 
      type: "Curriculum",
      columns: "id, teacher_id, subject_id, class_id, title, objectives, content, assessment_criteria",
      relationships: "Links to subjects, classes, teachers"
    },
    { 
      name: "ai_classroom_sessions", 
      description: "AI classroom analytics and real-time session data", 
      type: "AI Features",
      columns: "id, session_id, teacher_id, class_id, engagement_metrics, interventions, analytics_data",
      relationships: "Links to classes, teachers, stores AI-generated insights"
    },
    { 
      name: "assignments", 
      description: "Assignment management with AI-powered grading", 
      type: "Academic",
      columns: "id, teacher_id, class_id, subject_id, title, description, due_date, max_score",
      relationships: "Links to subjects, classes, connects to submissions"
    },
    { 
      name: "assessment_results", 
      description: "Comprehensive assessment tracking and analytics", 
      type: "Academic",
      columns: "id, student_id, assignment_id, score, feedback, grading_criteria, submitted_at",
      relationships: "Links students to assignments with detailed results"
    }
  ];

  const apiEndpoints = [
    { 
      method: "GET", 
      endpoint: "/api/students", 
      description: "Fetch paginated student list with filtering and search", 
      auth: "Teacher+",
      parameters: "page, limit, search, class_id, status",
      response: "Array of student objects with pagination metadata"
    },
    { 
      method: "POST", 
      endpoint: "/api/students", 
      description: "Create new student record with validation", 
      auth: "Admin/Teacher",
      parameters: "student_data (name, class, parent_info, etc.)",
      response: "Created student object with generated ID"
    },
    { 
      method: "PUT", 
      endpoint: "/api/students/:id", 
      description: "Update existing student information", 
      auth: "Admin/Teacher",
      parameters: "student_id, updated_fields",
      response: "Updated student object"
    },
    { 
      method: "DELETE", 
      endpoint: "/api/students/:id", 
      description: "Soft delete student record (archive)", 
      auth: "Admin only",
      parameters: "student_id, reason",
      response: "Success confirmation"
    },
    { 
      method: "GET", 
      endpoint: "/api/attendance", 
      description: "Retrieve attendance records with date range filtering", 
      auth: "Teacher+",
      parameters: "date_from, date_to, class_id, student_id",
      response: "Attendance records with statistics"
    },
    { 
      method: "POST", 
      endpoint: "/api/attendance/mark", 
      description: "Mark attendance for students (single or bulk)", 
      auth: "Teacher+",
      parameters: "date, period_id, attendance_data[]",
      response: "Updated attendance records"
    },
    { 
      method: "GET", 
      endpoint: "/api/timetable", 
      description: "Fetch timetable data for classes or teachers", 
      auth: "All authenticated",
      parameters: "class_id, teacher_id, week_date",
      response: "Structured timetable with periods and subjects"
    },
    { 
      method: "POST", 
      endpoint: "/api/ai-classroom/analytics", 
      description: "Submit AI classroom session data and get insights", 
      auth: "Teacher+",
      parameters: "session_id, engagement_data, student_metrics",
      response: "AI-generated insights and recommendations"
    },
    { 
      method: "GET", 
      endpoint: "/api/ai/generate-lesson", 
      description: "AI-powered lesson plan generation", 
      auth: "Teacher+",
      parameters: "subject_id, class_id, topic, duration, learning_objectives",
      response: "Generated lesson plan with activities and resources"
    },
    { 
      method: "POST", 
      endpoint: "/api/ai/generate-questions", 
      description: "Automatic question paper generation with difficulty balancing", 
      auth: "Teacher+",
      parameters: "subject_id, difficulty_level, question_types, curriculum_topics",
      response: "Generated question paper with marking scheme"
    }
  ];

  const aiFeatures = [
    {
      name: "AI Classroom Suite",
      description: "Revolutionary real-time classroom analytics and intervention system",
      capabilities: [
        "Real-time student engagement monitoring using computer vision",
        "Attention pattern analysis and distraction detection",
        "Adaptive teaching assistance with contextual suggestions",
        "Smart intervention triggers based on classroom dynamics",
        "Behavioral coaching for both students and teachers",
        "Performance prediction using machine learning models",
        "Automated report generation with actionable insights"
      ],
      technology: "Computer Vision, Natural Language Processing, Machine Learning",
      integration: "WebRTC for video streaming, TensorFlow.js for client-side AI"
    },
    {
      name: "AI Question Paper Generator (Qrypta)",
      description: "Intelligent assessment creation with curriculum alignment",
      capabilities: [
        "Automatic question generation from curriculum content",
        "Difficulty level balancing and bloom's taxonomy alignment",
        "Multiple question type support (MCQ, Short Answer, Essay)",
        "Learning objective mapping and standards compliance",
        "Instant export to various formats (PDF, Word, Online)",
        "Plagiarism detection and question uniqueness verification",
        "Historical performance analysis for question optimization"
      ],
      technology: "GPT-based Language Models, Curriculum Analysis AI",
      integration: "PDF generation, Word document export, LMS integration"
    },
    {
      name: "AI Timetable Generator",
      description: "Intelligent scheduling with constraint optimization",
      capabilities: [
        "Smart scheduling with conflict resolution algorithms",
        "Resource optimization (rooms, teachers, equipment)",
        "Teacher preference integration and workload balancing",
        "Real-time updates and dynamic rescheduling",
        "Holiday and event calendar integration",
        "Substitution teacher assignment automation",
        "Efficiency metrics and schedule quality scoring"
      ],
      technology: "Constraint Satisfaction Algorithms, Optimization AI",
      integration: "Calendar systems, resource management, notification services"
    },
    {
      name: "AI Lesson Planner",
      description: "Comprehensive lesson planning with intelligent content generation",
      capabilities: [
        "Smart lesson structure creation with learning objectives",
        "Curriculum standards alignment and gap analysis",
        "Resource and activity suggestions based on content",
        "Assessment integration with rubric generation",
        "Collaborative planning tools for teaching teams",
        "Progress tracking and lesson effectiveness analysis",
        "Differentiated instruction recommendations"
      ],
      technology: "Educational Content AI, Curriculum Analysis, NLP",
      integration: "Learning Management Systems, Resource libraries"
    },
    {
      name: "AI Grading Assistant",
      description: "Intelligent assessment with bias detection and feedback generation",
      capabilities: [
        "Automated grading for various assessment types",
        "Smart feedback generation with improvement suggestions",
        "Rubric-based analysis with consistency checking",
        "Progress tracking and learning analytics",
        "Bias detection and fairness monitoring",
        "Plagiarism detection and academic integrity checks",
        "Parent-friendly progress explanations"
      ],
      technology: "Natural Language Processing, Machine Learning, Statistical Analysis",
      integration: "Learning Management Systems, Grade books, Parent portals"
    },
    {
      name: "AI Predictive Insights",
      description: "Early warning system with performance predictions",
      capabilities: [
        "At-risk student identification using multiple data points",
        "Performance trend analysis and prediction modeling",
        "Intervention recommendation engine",
        "Learning style analysis and personalization suggestions",
        "Attendance pattern correlation with academic performance",
        "Behavioral indicator tracking and analysis",
        "Success probability scoring and improvement pathways"
      ],
      technology: "Predictive Analytics, Machine Learning, Statistical Modeling",
      integration: "Student Information Systems, Learning Analytics platforms"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileCode className="h-8 w-8 text-primary" />
                Technical Documentation
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive development guide for the DOXA Education Platform - Everything your development team needs to know
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Version 1.0.0
              </Badge>
              <Badge variant="outline" className="text-sm">
                Last Updated: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="ai-features">AI Features</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Project Overview
                </CardTitle>
                <CardDescription>
                  DOXA is a comprehensive AI-powered education management platform designed to revolutionize school operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Core Features & Modules</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span><strong>AI Classroom Suite</strong> - Real-time student analytics and engagement monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span><strong>Student Information System</strong> - Complete student lifecycle management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-primary" />
                        <span><strong>Attendance Management</strong> - Digital attendance with automated alerts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span><strong>Curriculum & Lesson Planning</strong> - AI-enhanced lesson creation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span><strong>AI Timetable Generator</strong> - Intelligent scheduling optimization</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span><strong>Role-Based Access Control</strong> - Granular permission system</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span><strong>Multi-school Support</strong> - Scalable architecture for multiple institutions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span><strong>Real-time Updates</strong> - Live data synchronization across all modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-primary" />
                        <span><strong>Advanced Analytics</strong> - Predictive insights and reporting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-primary" />
                        <span><strong>Cloud-Native</strong> - Scalable, secure, and accessible from anywhere</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Technology Stack Details</h3>
                  <div className="grid gap-4">
                    {techStack.map((tech, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-4">
                          <tech.icon className="h-6 w-6 text-primary mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{tech.name}</h4>
                              <Badge variant="outline" className="text-xs">{tech.version}</Badge>
                              <Badge variant="secondary" className="text-xs">{tech.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{tech.description}</p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Purpose:</strong> {tech.purpose}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Detailed Project Structure
                </CardTitle>
                <CardDescription>
                  Complete directory structure with explanations for each component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(projectStructure)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                    <code>{projectStructure}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  System Architecture
                </CardTitle>
                <CardDescription>
                  Comprehensive overview of the system's architectural patterns and data flow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Frontend Layer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>React 18</strong> - Component-based UI with concurrent features</li>
                        <li>• <strong>TypeScript</strong> - Static type checking and better developer experience</li>
                        <li>• <strong>React Router v6</strong> - Client-side routing with protected routes</li>
                        <li>• <strong>Context API</strong> - Global state management for auth and school context</li>
                        <li>• <strong>TanStack Query</strong> - Server state management and caching</li>
                        <li>• <strong>Tailwind CSS</strong> - Utility-first styling with design system</li>
                        <li>• <strong>Shadcn/UI</strong> - Accessible component library</li>
                        <li>• <strong>Responsive Design</strong> - Mobile-first approach with breakpoints</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Backend Layer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Supabase</strong> - Backend-as-a-Service platform</li>
                        <li>• <strong>PostgreSQL</strong> - Relational database with ACID compliance</li>
                        <li>• <strong>Row Level Security</strong> - Database-level access control</li>
                        <li>• <strong>Real-time subscriptions</strong> - Live data updates</li>
                        <li>• <strong>Edge Functions</strong> - Serverless compute for AI processing</li>
                        <li>• <strong>Authentication</strong> - JWT-based auth with social logins</li>
                        <li>• <strong>Storage</strong> - File upload and management</li>
                        <li>• <strong>APIs</strong> - RESTful and real-time API endpoints</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>AI Classroom Analytics</strong> - Real-time engagement monitoring</li>
                        <li>• <strong>Question Generation</strong> - Automated assessment creation</li>
                        <li>• <strong>Timetable Optimization</strong> - Constraint-based scheduling</li>
                        <li>• <strong>Lesson Planning</strong> - AI-assisted content creation</li>
                        <li>• <strong>Grading Assistant</strong> - Automated assessment with feedback</li>
                        <li>• <strong>Predictive Analytics</strong> - Early intervention systems</li>
                        <li>• <strong>Natural Language Processing</strong> - Content analysis and generation</li>
                        <li>• <strong>Machine Learning</strong> - Pattern recognition and predictions</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Authentication & Authorization Flow</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                        <div>
                          <strong>User Authentication:</strong> User logs in via Supabase Auth (email/password or social login)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                        <div>
                          <strong>JWT Token Issuance:</strong> Supabase issues JWT access token and refresh token
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                        <div>
                          <strong>RBAC Verification:</strong> useRBAC hook fetches user roles and school associations
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                        <div>
                          <strong>Route Protection:</strong> ProtectedRoute component checks authentication status
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">5</div>
                        <div>
                          <strong>Permission Enforcement:</strong> Component-level access control based on user roles
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">6</div>
                        <div>
                          <strong>Session Management:</strong> Automatic token refresh and logout on expiration
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Flow Architecture</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                        <div>
                          <strong>API Requests:</strong> React components make API calls via Supabase client
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                        <div>
                          <strong>Query Management:</strong> TanStack Query handles caching, background updates, and error states
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                        <div>
                          <strong>Database Security:</strong> PostgreSQL with RLS ensures data isolation and security
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                        <div>
                          <strong>Real-time Updates:</strong> Supabase subscriptions provide live data synchronization
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">5</div>
                        <div>
                          <strong>Optimistic Updates:</strong> UI updates immediately for better user experience
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">6</div>
                        <div>
                          <strong>Error Handling:</strong> Comprehensive error boundaries and retry mechanisms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Schema & Architecture
                </CardTitle>
                <CardDescription>
                  PostgreSQL database with Row Level Security (RLS) and comprehensive data modeling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {databaseSchema.map((table, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-semibold text-lg">{table.name}</h4>
                            <p className="text-sm text-muted-foreground">{table.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{table.type}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Key Columns:</strong> <code className="bg-muted px-1 py-0.5 rounded text-xs">{table.columns}</code>
                        </div>
                        <div>
                          <strong>Relationships:</strong> {table.relationships}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  API Endpoints Reference
                </CardTitle>
                <CardDescription>
                  Complete API documentation with authentication requirements and usage examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiEndpoints.map((endpoint, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={
                              endpoint.method === 'GET' ? 'secondary' : 
                              endpoint.method === 'POST' ? 'default' : 
                              endpoint.method === 'PUT' ? 'outline' : 'destructive'
                            }
                            className="min-w-[60px] justify-center"
                          >
                            {endpoint.method}
                          </Badge>
                          <div>
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                            <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{endpoint.auth}</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Parameters:</strong>
                          <p className="text-muted-foreground">{endpoint.parameters}</p>
                        </div>
                        <div>
                          <strong>Response:</strong>
                          <p className="text-muted-foreground">{endpoint.response}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Component Architecture & Design System
                </CardTitle>
                <CardDescription>
                  Comprehensive component organization and design system implementation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Component Hierarchy</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Base UI Components
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Button</strong> - Multiple variants (default, outline, ghost, destructive)</li>
                        <li>• <strong>Card</strong> - Content containers with header, content, footer</li>
                        <li>• <strong>Dialog/Modal</strong> - Accessible overlay components</li>
                        <li>• <strong>Form Controls</strong> - Input, Select, Textarea, Checkbox, Radio</li>
                        <li>• <strong>Navigation</strong> - Tabs, Breadcrumbs, Pagination</li>
                        <li>• <strong>Data Display</strong> - Table, Badge, Avatar, Separator</li>
                        <li>• <strong>Feedback</strong> - Toast, Alert, Loading states</li>
                        <li>• <strong>Layout</strong> - Grid, Flex utilities, Spacing components</li>
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Feature Components
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>StudentManagement</strong> - Student CRUD operations and profiles</li>
                        <li>• <strong>AttendanceSystem</strong> - Attendance marking and reporting</li>
                        <li>• <strong>TimetableManager</strong> - Schedule creation and management</li>
                        <li>• <strong>AIClassroomSuite</strong> - Real-time analytics dashboard</li>
                        <li>• <strong>CurriculumPlanning</strong> - Lesson plans and curriculum tracking</li>
                        <li>• <strong>AssessmentTools</strong> - Grading and feedback systems</li>
                        <li>• <strong>ReportingDashboard</strong> - Analytics and insights</li>
                        <li>• <strong>UserManagement</strong> - RBAC and user administration</li>
                      </ul>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Design System Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Color System</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• <strong>Semantic Tokens:</strong> CSS custom properties defined in index.css</div>
                        <div>• <strong>Theme Support:</strong> Light/dark mode with automatic switching</div>
                        <div>• <strong>Accessibility:</strong> WCAG AA compliant color contrasts</div>
                        <div>• <strong>Brand Colors:</strong> Primary, secondary, accent colors with variants</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Typography Scale</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• <strong>Font Stack:</strong> System fonts with fallbacks for performance</div>
                        <div>• <strong>Size Scale:</strong> Modular scale from 12px to 48px</div>
                        <div>• <strong>Line Heights:</strong> Optimized for readability and visual rhythm</div>
                        <div>• <strong>Font Weights:</strong> Regular (400), Medium (500), Semibold (600), Bold (700)</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Spacing & Layout</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• <strong>Spacing Scale:</strong> 4px base unit with 8px increments</div>
                        <div>• <strong>Container Sizes:</strong> Responsive containers with max-widths</div>
                        <div>• <strong>Grid System:</strong> CSS Grid and Flexbox utilities</div>
                        <div>• <strong>Breakpoints:</strong> Mobile-first responsive design (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Component Variants</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• <strong>Class Variance Authority:</strong> Type-safe variant generation</div>
                        <div>• <strong>Size Variants:</strong> xs, sm, default, lg, xl for consistent sizing</div>
                        <div>• <strong>State Variants:</strong> Default, hover, focus, active, disabled states</div>
                        <div>• <strong>Intent Variants:</strong> Primary, secondary, success, warning, danger</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">State Management Patterns</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Global State</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• React Context for authentication state</li>
                        <li>• School context for multi-tenant data</li>
                        <li>• Theme and user preferences</li>
                        <li>• Notification and alert state</li>
                      </ul>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Server State</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• TanStack Query for API data</li>
                        <li>• Optimistic updates for better UX</li>
                        <li>• Background synchronization</li>
                        <li>• Error handling and retry logic</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Deployment & Infrastructure
                </CardTitle>
                <CardDescription>
                  Complete deployment guide with environment setup and production considerations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Development Environment Setup</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Quick Start Commands</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`# Clone the repository
git clone <repository-url>
cd doxa-education-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview`)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{`# Clone the repository
git clone <repository-url>
cd doxa-education-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Environment Variables Configuration</h3>
                  <div className="space-y-3">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Required Environment Variables</h4>
                        <Badge variant="destructive">Required</Badge>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 border rounded-lg">
                          <code className="font-mono">VITE_SUPABASE_URL</code>
                          <p className="text-muted-foreground mt-1">Your Supabase project URL (found in project settings)</p>
                          <p className="text-xs text-muted-foreground">Example: https://your-project.supabase.co</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>
                          <p className="text-muted-foreground mt-1">Supabase anonymous/public key for client-side operations</p>
                          <p className="text-xs text-muted-foreground">Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Optional Environment Variables</h4>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 border rounded-lg">
                          <code className="font-mono">VITE_APP_TITLE</code>
                          <p className="text-muted-foreground mt-1">Custom application title (defaults to "DOXA Education Platform")</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <code className="font-mono">VITE_ENABLE_ANALYTICS</code>
                          <p className="text-muted-foreground mt-1">Enable/disable analytics tracking (true/false)</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Production Deployment</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Monitor className="h-5 w-5" />
                          Frontend Deployment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <strong>Platform:</strong> Vercel, Netlify, or similar static hosting
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <strong>Build Command:</strong> <code>npm run build</code>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <strong>Output Directory:</strong> <code>dist</code>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <strong>Node Version:</strong> 18.x or higher
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <strong>Auto-deploy:</strong> Connected to Git repository for automatic deployments
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <strong>Custom Domain:</strong> Configure DNS and SSL certificates
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="p-4">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Backend Infrastructure
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                            <div>
                              <strong>Database:</strong> Supabase hosted PostgreSQL with automatic backups
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                            <div>
                              <strong>Authentication:</strong> Supabase Auth with social login providers
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                            <div>
                              <strong>File Storage:</strong> Supabase Storage with CDN distribution
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                            <div>
                              <strong>Real-time:</strong> WebSocket connections for live updates
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                            <div>
                              <strong>Edge Functions:</strong> Serverless functions for AI processing
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                            <div>
                              <strong>Monitoring:</strong> Built-in logging and performance monitoring
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Optimization</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Frontend Optimizations</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Code splitting with React.lazy() for route-based splitting</li>
                        <li>• Image optimization with lazy loading and WebP format</li>
                        <li>• Bundle analysis and tree shaking for minimal bundle size</li>
                        <li>• Service worker for offline capabilities</li>
                        <li>• Preloading of critical resources</li>
                        <li>• Gzip/Brotli compression</li>
                      </ul>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Backend Optimizations</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Database query optimization with proper indexing</li>
                        <li>• Connection pooling for efficient database connections</li>
                        <li>• Redis caching for frequently accessed data</li>
                        <li>• CDN for static asset delivery</li>
                        <li>• API rate limiting and request throttling</li>
                        <li>• Database read replicas for scaling</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Features Tab */}
          <TabsContent value="ai-features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Features & Implementation
                </CardTitle>
                <CardDescription>
                  Comprehensive overview of AI capabilities, technologies, and integration patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiFeatures.map((feature, index) => (
                    <Card key={index} className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          {feature.name}
                        </h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            Capabilities
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {feature.capabilities.map((capability, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-muted-foreground">{capability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            Technology Stack
                          </h4>
                          <p className="text-sm text-muted-foreground">{feature.technology}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-1">
                            <Workflow className="h-4 w-4" />
                            Integration
                          </h4>
                          <p className="text-sm text-muted-foreground">{feature.integration}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Separator className="my-8" />

                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Integration Architecture</h3>
                  <div className="bg-muted p-6 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-medium">Frontend AI Components</h4>
                          <p className="text-sm text-muted-foreground">React components trigger AI requests through user interactions (button clicks, form submissions, real-time events)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-medium">Supabase Edge Functions</h4>
                          <p className="text-sm text-muted-foreground">Serverless functions process AI requests, handle authentication, and manage API rate limiting</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-medium">AI Provider Integration</h4>
                          <p className="text-sm text-muted-foreground">Integration with multiple AI providers (OpenAI, Anthropic, Google AI) for different capabilities and redundancy</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        <div>
                          <h4 className="font-medium">Data Processing & Storage</h4>
                          <p className="text-sm text-muted-foreground">AI results are processed, validated, and stored in PostgreSQL with proper data relationships</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</div>
                        <div>
                          <h4 className="font-medium">Real-time Updates</h4>
                          <p className="text-sm text-muted-foreground">Supabase real-time subscriptions push updates to frontend components for immediate UI updates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Development Workflow & Best Practices
                </CardTitle>
                <CardDescription>
                  Complete development guidelines, coding standards, and team collaboration practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Git Workflow & Collaboration</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Branch Strategy</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• <strong>main</strong> - Production-ready code, protected branch</li>
                        <li>• <strong>develop</strong> - Integration branch for features</li>
                        <li>• <strong>feature/[task-id]-[description]</strong> - Feature development branches</li>
                        <li>• <strong>hotfix/[issue-description]</strong> - Critical production fixes</li>
                        <li>• <strong>release/[version]</strong> - Release preparation branches</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Pull Request Process</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Create feature branch from develop</li>
                        <li>• Implement feature with comprehensive tests</li>
                        <li>• Run linting, type checking, and tests locally</li>
                        <li>• Create pull request with detailed description</li>
                        <li>• Code review by at least one team member</li>
                        <li>• Automated CI/CD checks must pass</li>
                        <li>• Merge to develop after approval</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Code Standards & Quality</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        TypeScript Standards
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Strict mode enabled with comprehensive type checking</li>
                        <li>• Interface definitions for all data structures and API responses</li>
                        <li>• Generic types for reusable components and utilities</li>
                        <li>• Proper error handling with typed error objects</li>
                        <li>• No any types allowed - use unknown and type guards</li>
                        <li>• Consistent naming conventions (PascalCase for components, camelCase for functions)</li>
                      </ul>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        React Best Practices
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Functional components with hooks only</li>
                        <li>• Custom hooks for business logic and API calls</li>
                        <li>• Proper dependency arrays in useEffect and useCallback</li>
                        <li>• Error boundaries for component-level error handling</li>
                        <li>• Memoization with React.memo for performance</li>
                        <li>• PropTypes or TypeScript interfaces for component props</li>
                      </ul>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Testing Strategy</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Testing Pyramid</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <div>
                            <strong>Unit Tests (70%)</strong> - Test individual functions, components, and hooks in isolation
                            <p className="text-muted-foreground">Tools: Jest, React Testing Library</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <div>
                            <strong>Integration Tests (20%)</strong> - Test component interactions and API integrations
                            <p className="text-muted-foreground">Tools: React Testing Library, MSW for API mocking</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <div>
                            <strong>E2E Tests (10%)</strong> - Test critical user journeys and workflows
                            <p className="text-muted-foreground">Tools: Playwright or Cypress</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Coverage Requirements</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Minimum 80% code coverage for all new features</li>
                        <li>• 100% coverage for utility functions and business logic</li>
                        <li>• Integration tests for all API endpoints</li>
                        <li>• E2E tests for authentication and critical user flows</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Optimization Guidelines</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Frontend Performance</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Lazy loading for routes and heavy components</li>
                        <li>• Image optimization with proper sizing and formats</li>
                        <li>• Bundle size monitoring and tree shaking</li>
                        <li>• Efficient re-rendering with React.memo and useMemo</li>
                        <li>• Debounced inputs for search and filters</li>
                        <li>• Virtual scrolling for large data sets</li>
                      </ul>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Database Performance</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Proper indexing on frequently queried columns</li>
                        <li>• Query optimization with EXPLAIN ANALYZE</li>
                        <li>• Connection pooling for efficient resource usage</li>
                        <li>• Pagination for large result sets</li>
                        <li>• Database function optimization</li>
                        <li>• Regular performance monitoring and alerts</li>
                      </ul>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Troubleshooting & Debugging</h3>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Common Issues & Solutions</h4>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                          <strong className="text-red-700 dark:text-red-300">Build Errors:</strong>
                          <p className="text-red-600 dark:text-red-400 mt-1">Check TypeScript types, import paths, and dependency versions. Run npm install to ensure all dependencies are installed.</p>
                        </div>
                        <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
                          <strong className="text-yellow-700 dark:text-yellow-300">Database Issues:</strong>
                          <p className="text-yellow-600 dark:text-yellow-400 mt-1">Verify RLS policies, check user permissions, and ensure proper data relationships. Use Supabase dashboard for debugging.</p>
                        </div>
                        <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
                          <strong className="text-blue-700 dark:text-blue-300">Authentication Problems:</strong>
                          <p className="text-blue-600 dark:text-blue-400 mt-1">Check Supabase configuration, JWT token validity, and RBAC role assignments. Clear localStorage if needed.</p>
                        </div>
                        <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10">
                          <strong className="text-green-700 dark:text-green-300">Performance Issues:</strong>
                          <p className="text-green-600 dark:text-green-400 mt-1">Use React DevTools Profiler, check for unnecessary re-renders, optimize database queries, and implement caching strategies.</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Debug Tools & Resources</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Development Tools:</strong>
                          <ul className="mt-2 space-y-1 text-muted-foreground">
                            <li>• React DevTools for component debugging</li>
                            <li>• Browser DevTools for network and performance</li>
                            <li>• Supabase Dashboard for database inspection</li>
                            <li>• VS Code extensions for TypeScript and React</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Monitoring & Logging:</strong>
                          <ul className="mt-2 space-y-1 text-muted-foreground">
                            <li>• Console logging with proper log levels</li>
                            <li>• Error boundary reporting</li>
                            <li>• Performance monitoring with Web Vitals</li>
                            <li>• Database query performance tracking</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}