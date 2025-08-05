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
import { AuthSection } from "@/components/landing/AuthSection";
import { ModuleShowcase } from "@/components/landing/ModuleShowcase";
import { UserManuals } from "@/components/landing/UserManuals";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");

  const modules = [
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
    },
    {
      name: "AI Suite",
      icon: Brain,
      description: "AI-powered analytics and automation",
      features: ["Predictive Analytics", "Automated Insights", "Performance Forecasting", "Risk Assessment", "Smart Recommendations"],
      color: "bg-violet-500"
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">EduFlow Pro</span>
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
                onClick={() => setActiveSection("auth")}
                className={`text-sm hover:text-primary transition-colors ${activeSection === "auth" ? "text-primary font-medium" : ""}`}
              >
                Login
              </button>
            </div>

            <Button 
              onClick={() => setActiveSection("auth")}
              className="md:hidden"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="pt-20">
        {activeSection === "home" && (
          <>
            <HeroSection onGetStarted={() => setActiveSection("auth")} />
            
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
          </>
        )}

        {activeSection === "modules" && (
          <ModuleShowcase modules={modules} />
        )}

        {activeSection === "manuals" && (
          <UserManuals modules={modules} />
        )}

        {activeSection === "auth" && (
          <AuthSection />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">EduFlow Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete school management system designed for modern educational institutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Modules</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Student Management</li>
                <li>Admissions</li>
                <li>Fee Management</li>
                <li>Library System</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>User Guides</li>
                <li>Video Tutorials</li>
                <li>Help Center</li>
                <li>Contact Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@eduflowpro.com</li>
                <li>+44 (0) 20 1234 5678</li>
                <li>Live Chat Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 EduFlow Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}