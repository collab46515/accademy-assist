import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  BookOpen, 
  ClipboardCheck, 
  PoundSterling,
  UserCheck,
  Library,
  Truck,
  MessageSquare,
  Shield,
  BarChart3,
  Brain,
  FileText,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  PlayCircle
} from "lucide-react";

import { ModuleShowcase } from "@/components/landing/ModuleShowcase";
import { UserManuals } from "@/components/landing/UserManuals";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { EnhancedFooter } from "@/components/landing/EnhancedFooter";
import { CallToActionSection } from "@/components/landing/CallToActionSection";
import { SignInModal } from "@/components/auth/SignInModal";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const modules = [
    {
      name: "AI Timetable Generator",
      icon: Brain,
      description: "Revolutionary AI-powered timetable generation with intelligent optimization",
      features: ["Smart Scheduling", "Conflict Resolution", "Resource Optimization", "Real-time Updates", "Teacher Preferences"],
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      highlight: true
    },
    {
      name: "Admissions Management",
      icon: GraduationCap,
      description: "Complete admissions workflow from application to enrollment",
      features: ["Application Processing", "Document Verification", "Interview Scheduling", "Admission Decisions", "Student Exit Process"],
      color: "bg-blue-500"
    },
    {
      name: "Student Management",
      icon: Users,
      description: "Comprehensive student information and lifecycle management",
      features: ["Student Profiles", "Academic Records", "Parent Portal", "Progress Tracking", "Reports"],
      color: "bg-green-500"
    },
    {
      name: "Attendance System",
      icon: Clock,
      description: "Smart attendance tracking with automated alerts",
      features: ["Digital Marking", "Real-time Alerts", "Absence Management", "Parent Notifications", "Analytics"],
      color: "bg-purple-500"
    },
    {
      name: "Curriculum & Lesson Planning",
      icon: BookOpen,
      description: "AI-powered curriculum planning and lesson management",
      features: ["Lesson Planning", "Coverage Tracking", "Gap Analysis", "Standards Alignment", "Collaboration"],
      color: "bg-orange-500"
    },
    {
      name: "Assignments & Assessment",
      icon: ClipboardCheck,
      description: "Digital assignment management and grading system",
      features: ["Assignment Creation", "Online Submission", "Auto Grading", "Feedback System", "Analytics"],
      color: "bg-red-500"
    },
    {
      name: "Fee Management",
      icon: PoundSterling,
      description: "Complete financial management for school fees",
      features: ["Fee Structure", "Payment Processing", "Installments", "Reports", "Parent Portal"],
      color: "bg-emerald-500"
    },
    {
      name: "HR Management",
      icon: UserCheck,
      description: "Comprehensive staff and recruitment management",
      features: ["Employee Records", "Recruitment", "Payroll", "Performance", "Training"],
      color: "bg-indigo-500"
    },
    {
      name: "Library Management",
      icon: Library,
      description: "Modern library system with digital resources",
      features: ["Catalog Management", "Digital Resources", "QR Checkout", "Fines Management", "Reading Analytics"],
      color: "bg-teal-500"
    },
    {
      name: "Transport Management",
      icon: Truck,
      description: "Smart transport system with live tracking",
      features: ["Route Planning", "Live Tracking", "Driver Management", "Student Assignments", "Safety Alerts"],
      color: "bg-yellow-500"
    },
    {
      name: "Communication Hub",
      icon: MessageSquare,
      description: "Multi-channel communication platform",
      features: ["Messaging", "Notifications", "Parent Communication", "Staff Updates", "Emergency Alerts"],
      color: "bg-pink-500"
    },
    {
      name: "Student Welfare",
      icon: Shield,
      description: "Complete student welfare and safeguarding system",
      features: ["Infirmary Management", "Safeguarding", "Complaints System", "Incident Tracking", "Reporting"],
      color: "bg-cyan-500"
    }
  ];

  const stats = [
    { label: "Active Schools", value: "500+", icon: GraduationCap },
    { label: "Students Managed", value: "50,000+", icon: Users },
    { label: "Teachers Supported", value: "5,000+", icon: UserCheck },
    { label: "Parents Connected", value: "40,000+", icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation - No Fixed Header */}
      <div className="container mx-auto px-4 -my-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/lovable-uploads/0a977b5c-549a-4597-a296-a9e51592864a.png" alt="Pappaya Academy Logo" className="h-80 w-80" />
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveSection("home")}
              className={`text-sm hover:text-primary transition-colors ${activeSection === "home" ? "text-primary font-medium" : ""}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveSection("modules")}
              className={`text-sm hover:text-primary transition-colors ${activeSection === "modules" ? "text-primary font-medium" : ""}`}
            >
              Modules
            </button>
            <button 
              onClick={() => setActiveSection("manuals")}
              className={`text-sm hover:text-primary transition-colors ${activeSection === "manuals" ? "text-primary font-medium" : ""}`}
            >
              User Guides
            </button>
            <button 
              onClick={() => setIsSignInModalOpen(true)}
              className="text-sm hover:text-primary transition-colors"
            >
              Login
            </button>
          </div>

          <Button 
            onClick={() => setIsSignInModalOpen(true)}
            className="md:hidden"
          >
            Login
          </Button>
        </div>
      </div>

      {/* Content Sections */}
      <div>
        {activeSection === "home" && (
          <>
            <HeroSection onGetStarted={() => setIsSignInModalOpen(true)} />
            
            {/* AI Timetable Generator Highlight Section */}
            <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    🚀 Featured Innovation
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI Timetable Generator
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Revolutionary artificial intelligence that creates perfect timetables in minutes, not hours. 
                    Automatically resolves conflicts, optimizes resources, and adapts to your school's unique requirements.
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                  <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Intelligent Scheduling</CardTitle>
                      <CardDescription>
                        AI analyzes teacher availability, room capacity, and subject requirements to create optimal schedules
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Conflict Resolution</CardTitle>
                      <CardDescription>
                        Automatically detects and resolves scheduling conflicts, ensuring every class has the right teacher, room, and time
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Real-time Updates</CardTitle>
                      <CardDescription>
                        Instantly adapts to changes in staff availability, room bookings, or curriculum adjustments
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                
                <div className="text-center mt-12">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                    onClick={() => setIsSignInModalOpen(true)}
                  >
                    Try AI Timetable Generator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Stats Section */}
            <section className="py-16 bg-primary/5">
              <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary rounded-full">
                          <stat.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <FeaturesGrid modules={modules} />
            <TestimonialsSection />
            <CallToActionSection onGetStarted={() => setIsSignInModalOpen(true)} />
          </>
        )}

        {activeSection === "modules" && (
          <ModuleShowcase modules={modules} />
        )}

        {activeSection === "manuals" && (
          <UserManuals modules={modules} />
        )}

      </div>

      <EnhancedFooter />
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </div>
  );
}