import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
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
  Activity,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Building2
} from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const schoolManagementModules = [
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
    href: "/timetable",
    stats: [{ label: "Subjects", value: "47" }, { label: "Classes", value: "284" }]
  },
  {
    title: "Academic Tracking",
    description: "Manage ENC standards and assessment levels with curriculum mapping and progress tracking across terms.",
    icon: BarChart3,
    href: "/assessment",
    stats: [{ label: "Assessments", value: "1,247" }, { label: "Overdue", value: "8" }]
  },
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
  }
];

const hrManagementModules = [
  {
    title: "Staff Management",
    description: "Complete HR management for academic and non-academic staff with contracts and performance tracking.",
    icon: Users,
    href: "/staff",
    stats: [{ label: "Staff", value: "284" }, { label: "Active", value: "276" }]
  },
  {
    title: "Recruitment",
    description: "End-to-end recruitment process with job postings, applications, interviews, and onboarding.",
    icon: UserPlus,
    href: "/staff?tab=recruitment",
    stats: [{ label: "Open Roles", value: "12" }, { label: "Candidates", value: "47" }]
  },
  {
    title: "Professional Development",
    description: "CPD tracking, training programs, and professional growth planning for all staff members.",
    icon: GraduationCap,
    href: "/staff?tab=cpd",
    status: "active" as const
  },
  {
    title: "Performance Management",
    description: "Staff appraisals, performance reviews, and goal setting with automated reminders.",
    icon: BarChart3,
    href: "/staff?tab=performance",
    status: "active" as const
  }
];

const systemModules = [
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
  const [isSchoolOpen, setIsSchoolOpen] = useState(true);
  const [isHROpen, setIsHROpen] = useState(true);
  const [isSystemOpen, setIsSystemOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-80 flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/80 to-primary/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative text-center text-primary-foreground z-10 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Student Information System</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">Complete Education Management Platform for Modern Schools</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl space-y-12">
        {/* Quick Stats */}
        <section className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 bg-card/60 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stat.value}</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <Icon className={`h-6 w-6 ${stat.color} group-hover:text-primary transition-colors duration-300`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* System Status */}
        <section className="animate-fade-in">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default" className="bg-success/90 text-success-foreground border-success/20 px-3 py-1">
                  All Systems Operational
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  18 Modules Active
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Last Updated: 2 minutes ago
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* School Management Modules */}
        <section className="animate-fade-in space-y-6">
          <Collapsible open={isSchoolOpen} onOpenChange={setIsSchoolOpen}>
            <CollapsibleTrigger className="w-full">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <span>School Management</span>
                      <Badge variant="secondary" className="ml-2">{schoolManagementModules.length} modules</Badge>
                    </div>
                    {isSchoolOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription className="text-left">Complete education management functionality for modern schools</CardDescription>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schoolManagementModules.map((module, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <ModuleCard {...module} />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* HR Management Modules */}
        <section className="animate-fade-in space-y-6">
          <Collapsible open={isHROpen} onOpenChange={setIsHROpen}>
            <CollapsibleTrigger className="w-full">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <span>HR Management</span>
                      <Badge variant="secondary" className="ml-2">{hrManagementModules.length} modules</Badge>
                    </div>
                    {isHROpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription className="text-left">Human resources and staff management tools</CardDescription>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hrManagementModules.map((module, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <ModuleCard {...module} />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* System & Integration Modules */}
        <section className="animate-fade-in space-y-6">
          <Collapsible open={isSystemOpen} onOpenChange={setIsSystemOpen}>
            <CollapsibleTrigger className="w-full">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <span>System & Integration</span>
                      <Badge variant="secondary" className="ml-2">{systemModules.length} modules</Badge>
                    </div>
                    {isSystemOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription className="text-left">AI automation and third-party integrations</CardDescription>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemModules.map((module, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <ModuleCard {...module} />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;