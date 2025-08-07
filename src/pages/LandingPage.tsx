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
import { WorkflowDiagrams } from "@/components/landing/WorkflowDiagrams";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { EnhancedFooter } from "@/components/landing/EnhancedFooter";
import { CallToActionSection } from "@/components/landing/CallToActionSection";
import { SignInModal } from "@/components/auth/SignInModal";
import { ContactModal } from "@/components/landing/ContactModal";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const modules = [
    {
      name: "Qrypta - AI Question Paper Generator",
      icon: Brain,
      description: "Revolutionary AI-powered automatic question paper generation with intelligent difficulty balancing",
      features: ["Auto Question Generation", "Difficulty Balancing", "Curriculum Alignment", "Multiple Question Types", "Instant Export", "Learning Objectives Mapping"],
      color: "bg-gradient-to-r from-violet-600 to-purple-600",
      highlight: true
    },
    {
      name: "AI Timetable Generator",
      icon: Calendar,
      description: "Revolutionary AI-powered timetable generation with intelligent optimization",
      features: ["Smart Scheduling", "Conflict Resolution", "Resource Optimization", "Real-time Updates", "Teacher Preferences"],
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      highlight: true
    },
    {
      name: "AI Lesson Planner",
      icon: BookOpen,
      description: "AI-powered lesson planning with intelligent content generation",
      features: ["Smart Lesson Creation", "Standards Alignment", "Resource Suggestions", "Assessment Integration", "Collaboration Tools"],
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      highlight: true
    },
    {
      name: "AI Grading Assistant",
      icon: CheckCircle,
      description: "Intelligent grading and feedback system with AI recommendations",
      features: ["Auto Grading", "Smart Feedback", "Rubric Analysis", "Progress Tracking", "Bias Detection"],
      color: "bg-gradient-to-r from-green-600 to-blue-600",
      highlight: true
    },
    {
      name: "AI Comment Generator",
      icon: FileText,
      description: "Generate personalized student report comments with AI",
      features: ["Personalized Comments", "Multiple Tones", "Grade-specific Language", "Behavior Integration", "Parent-friendly"],
      color: "bg-gradient-to-r from-orange-600 to-red-600",
      highlight: true
    },
    {
      name: "AI Predictive Insights",
      icon: BarChart3,
      description: "Early warning system with predictive analytics",
      features: ["Risk Analysis", "Performance Predictions", "Intervention Alerts", "Trend Analysis", "Data Visualization"],
      color: "bg-gradient-to-r from-red-600 to-pink-600",
      highlight: true
    },
    {
      name: "AI Knowledge Base",
      icon: Brain,
      description: "Comprehensive educational intelligence and best practices",
      features: ["Educational Guidance", "Policy Information", "Curriculum Support", "Teaching Methods", "Research Access"],
      color: "bg-gradient-to-r from-indigo-600 to-purple-600",
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
      description: "Traditional curriculum planning and lesson management",
      features: ["Lesson Planning", "Coverage Tracking", "Gap Analysis", "Standards Alignment", "Collaboration"],
      color: "bg-orange-500"
    },
    {
      name: "Assignments & Assessment",
      icon: ClipboardCheck,
      description: "Digital assignment management and grading system",
      features: ["Assignment Creation", "Online Submission", "Manual Grading", "Feedback System", "Analytics"],
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


  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation - No Fixed Header */}
      <div className="container mx-auto px-4 -my-24">
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
              onClick={() => setActiveSection("workflows")}
              className={`text-sm hover:text-primary transition-colors ${activeSection === "workflows" ? "text-primary font-medium" : ""}`}
            >
              Workflows
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
            
            {/* AI ERP First of its Kind Highlight Section */}
            <section className="py-20 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg px-6 py-2">
                    🚀 WORLD'S FIRST AI ERP FOR SCHOOLS
                  </Badge>
                  <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Qrypta - AI Question Paper Generator
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                    Revolutionary AI that automatically generates complete question papers with perfect difficulty balancing, 
                    curriculum alignment, and learning objectives mapping. The first intelligent question paper generator 
                    that understands your educational needs.
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                  <Card className="border-2 border-violet-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Auto Question Generation</CardTitle>
                      <CardDescription>
                        AI creates diverse questions types automatically - MCQs, short answers, essays, and practical questions aligned to curriculum standards
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center mb-4">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Intelligent Difficulty Balancing</CardTitle>
                      <CardDescription>
                        Smart algorithms ensure perfect distribution of easy, medium, and difficult questions for optimal assessment
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-2 border-violet-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Learning Objectives Mapping</CardTitle>
                      <CardDescription>
                        Every question is intelligently mapped to specific learning objectives and curriculum standards for comprehensive assessment
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                
                <div className="text-center mt-12">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                    onClick={() => setIsSignInModalOpen(true)}
                  >
                    Try Qrypta AI Question Generator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </section>

            <FeaturesGrid modules={modules} />
            <TestimonialsSection />
            <CallToActionSection 
              onGetStarted={() => setIsSignInModalOpen(true)}
              onScheduleDemo={() => setIsContactModalOpen(true)}
            />
          </>
        )}

        {activeSection === "modules" && (
          <ModuleShowcase modules={modules} />
        )}

        {activeSection === "workflows" && (
          <WorkflowDiagrams modules={modules} />
        )}

      </div>

      <EnhancedFooter />
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
      
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}