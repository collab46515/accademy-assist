import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database,
  UserPlus,
  User,
  Clock,
  Calendar,
  BarChart3,
  FileText,
  Trophy,
  Shield,
  MessageSquare,
  CreditCard,
  Users,
  CalendarDays,
  TrendingUp,
  Bot,
  Settings,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const coreModules = [
  {
    title: "Student Information System",
    description: "Central database for all student data, demographics, enrollment history, and family links with UK-styled Student IDs.",
    icon: Database,
    href: "/students",
    stats: [{ label: "Students", value: "2,847" }, { label: "Active", value: "2,791" }]
  },
  {
    title: "Admissions & Applications",
    description: "End-to-end digital admissions with e-signatures, document upload, interview scheduling, and waitlist management.",
    icon: UserPlus,
    href: "/admissions",
    stats: [{ label: "Applications", value: "156" }, { label: "Pending", value: "23" }]
  },
  {
    title: "Dynamic Student Profiles",
    description: "Unified, real-time view of each student including academic records, behavior, medical info, and safeguarding notes.",
    icon: User,
    href: "/students",
    stats: [{ label: "Profiles", value: "2,847" }, { label: "Updated", value: "2,791" }]
  },
  {
    title: "Attendance & Registration",
    description: "Real-time tracking with QR codes, biometric options, automated roll call, and KCSIE-compliant reporting.",
    icon: Clock,
    href: "/attendance",
    stats: [{ label: "Attendance", value: "94.2%" }, { label: "Alerts", value: "12" }]
  },
  {
    title: "Curriculum & Timetabling",
    description: "AI-powered scheduling for British curriculum with auto-generation, option blocks, and exam timetable builder.",
    icon: Calendar,
    href: "/curriculum",
    stats: [{ label: "Subjects", value: "47" }, { label: "Classes", value: "284" }]
  },
  {
    title: "Academic Tracking",
    description: "Manage ENC standards and assessment levels with curriculum mapping and progress tracking across terms.",
    icon: BarChart3,
    href: "/assessment",
    stats: [{ label: "Assessments", value: "1,247" }, { label: "Overdue", value: "8" }]
  }
];

const additionalModules = [
  {
    title: "Gradebook & Reporting",
    description: "Termly reports with UK-style comments, AI-assisted generation, and parent portal access.",
    icon: FileText,
    href: "/gradebook",
    status: "active" as const
  },
  {
    title: "Exams & Qualifications",
    description: "Full exam board lifecycle with entry management, access arrangements, and results tracking.",
    icon: Trophy,
    href: "/exams",
    status: "active" as const
  },
  {
    title: "Teacher & Staff Management",
    description: "HR for academic and non-academic staff with contracts, CPD tracking, and performance reviews.",
    icon: Users,
    href: "/staff",
    status: "active" as const
  },
  {
    title: "Communication Hub",
    description: "Centralized messaging with broadcast emails, parent-teacher messaging, and emergency alerts.",
    icon: MessageSquare,
    href: "/communication",
    status: "active" as const
  },
  {
    title: "Parent & Student Portals",
    description: "Mobile-first engagement with real-time grades, attendance, assignments, and fee payments.",
    icon: User,
    href: "/portals",
    status: "active" as const
  },
  {
    title: "Finance & Fee Management",
    description: "Full financial operations with automated invoicing, payment plans, and multi-currency support.",
    icon: CreditCard,
    href: "/finance",
    status: "active" as const
  },
  {
    title: "Extracurricular Activities",
    description: "Track co-curricular engagement, DofE, house points, and trip participation.",
    icon: Trophy,
    href: "/activities",
    status: "active" as const
  },
  {
    title: "Safeguarding & Pastoral",
    description: "KCSIE-compliant DSL tools with incident logging, risk assessments, and welfare tracking.",
    icon: Shield,
    href: "/safeguarding",
    status: "active" as const
  },
  {
    title: "Calendar & Events",
    description: "Unified school calendar with academic dates, parent evenings, and booking systems.",
    icon: CalendarDays,
    href: "/events",
    status: "active" as const
  },
  {
    title: "Data Analytics & Insights",
    description: "Turn data into action with attendance dashboards, at-risk alerts, and custom reports.",
    icon: TrendingUp,
    href: "/analytics",
    status: "active" as const
  },
  {
    title: "AI & Automation Suite",
    description: "Smart features with AI-generated comments, predictive analytics, and automated scheduling.",
    icon: Bot,
    href: "/ai-suite",
    status: "beta" as const
  },
  {
    title: "Integration & API Platform",
    description: "Connect with external tools via SSO, LMS integration, and third-party app marketplace.",
    icon: Settings,
    href: "/integrations",
    status: "active" as const
  }
];

const quickStats = [
  { label: "Total Students", value: "2,847", icon: User, color: "text-primary" },
  { label: "Active Staff", value: "284", icon: Users, color: "text-success" },
  { label: "Today's Attendance", value: "94.2%", icon: CheckCircle, color: "text-success" },
  { label: "Pending Tasks", value: "23", icon: AlertCircle, color: "text-warning" }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="relative text-center text-primary-foreground z-10">
          <h1 className="text-4xl font-bold mb-2">Student Information System</h1>
          <p className="text-xl opacity-90">Complete Education Management Platform</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status */}
        <Card className="mb-8 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-success" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-success text-success-foreground">
                All Systems Operational
              </Badge>
              <Badge variant="secondary">
                18 Modules Active
              </Badge>
              <Badge variant="outline">
                Last Updated: 2 minutes ago
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Core Modules */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Core Modules</h2>
            <p className="text-muted-foreground">Essential education management functionality</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreModules.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>
        </div>

        {/* Additional Modules */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Additional Modules</h2>
            <p className="text-muted-foreground">Extended functionality for comprehensive school management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {additionalModules.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;