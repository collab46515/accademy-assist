import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStudentData } from '@/hooks/useStudentData';
import { 
  GraduationCap, 
  UserPlus, 
  BookOpen, 
  Clock, 
  ClipboardCheck, 
  ClipboardList, 
  Target,
  TrendingUp,
  Users,
  Calendar,
  BookOpenCheck
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AcademicOperationsPage() {
  const navigate = useNavigate();
  const { students, loading } = useStudentData();

  const academicModules = [
    {
      title: "Admissions Workflow",
      description: "Complete student admission process from application to enrollment",
      icon: UserPlus,
      url: "/admissions",
      stats: "45 pending applications",
      color: "bg-blue-500",
      features: ["Application Management", "Document Verification", "Interview Scheduling", "Decision Tracking"]
    },
    {
      title: "Curriculum & Lessons",
      description: "Comprehensive curriculum planning and lesson management",
      icon: BookOpen,
      url: "/curriculum",
      stats: "12 subjects covered",
      color: "bg-green-500",
      features: ["Lesson Planning", "Curriculum Mapping", "Progress Tracking", "Resource Management"]
    },
    {
      title: "Timetable Management",
      description: "Intelligent scheduling and timetable optimization",
      icon: Clock,
      url: "/timetable",
      stats: "35 classes scheduled",
      color: "bg-purple-500",
      features: ["Smart Scheduling", "Conflict Resolution", "Resource Allocation", "AI Optimization"]
    },
    {
      title: "Exams & Assessment",
      description: "Comprehensive examination and assessment management",
      icon: ClipboardCheck,
      url: "/exams",
      stats: "8 exams scheduled",
      color: "bg-orange-500",
      features: ["Exam Scheduling", "Question Banks", "Result Processing", "Performance Analytics"]
    },
    {
      title: "Assignments",
      description: "Assignment creation, distribution, and grading system",
      icon: ClipboardList,
      url: "/academics/assignments",
      stats: "23 active assignments",
      color: "bg-red-500",
      features: ["Assignment Creation", "Digital Submission", "Automated Grading", "Feedback System"]
    },
    {
      title: "HOD Dashboard",
      description: "Department head oversight and management tools",
      icon: Target,
      url: "/hod-dashboard",
      stats: "5 departments",
      color: "bg-indigo-500",
      features: ["Department Analytics", "Staff Performance", "Curriculum Oversight", "Resource Planning"]
    }
  ];

  const academicStats = [
    { 
      label: "Total Students", 
      value: loading ? "..." : students.length.toLocaleString(), 
      trend: loading ? "..." : `${students.length} enrolled`, 
      icon: Users 
    },
    { label: "Active Courses", value: "45", trend: "+2.1%", icon: BookOpenCheck },
    { label: "Completion Rate", value: "94.8%", trend: "+1.3%", icon: TrendingUp },
    { label: "This Term", value: "Term 2", trend: "2024-25", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="Academic Operations" 
        description="Comprehensive academic management and educational excellence"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {academicStats.map((stat, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              onClick={() => {
                console.log('Stat card clicked:', stat.label);
                switch(stat.label) {
                  case "Total Students":
                    navigate('/students');
                    break;
                  case "Active Courses":
                    navigate('/curriculum');
                    break;
                  case "Completion Rate":
                    navigate('/analytics');
                    break;
                  case "This Term":
                    navigate('/academics');
                    break;
                  default:
                    console.log('No navigation defined for:', stat.label);
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">{stat.label}</p>
                    <p className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">{stat.value}</p>
                    <p className="text-xs text-success">{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <stat.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Academic Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicModules.map((module, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              onClick={() => {
                console.log('Navigating to:', module.url);
                navigate(module.url);
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-lg ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.stats}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="space-y-2">
                    {module.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Button clicked for:', module.url);
                      navigate(module.url);
                    }}
                  >
                    Access {module.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Frequently used academic operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                onClick={() => navigate('/admissions/new')}
              >
                <UserPlus className="h-6 w-6 text-primary" />
                <span className="text-sm">Applications</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-success/5 hover:border-success transition-all duration-200"
                onClick={() => navigate('/academics/lesson-planning')}
              >
                <BookOpen className="h-6 w-6 text-success" />
                <span className="text-sm">Plan Lesson</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-warning/5 hover:border-warning transition-all duration-200"
                onClick={() => navigate('/timetable')}
              >
                <Clock className="h-6 w-6 text-warning" />
                <span className="text-sm">View Timetable</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-info/5 hover:border-info transition-all duration-200"
                onClick={() => navigate('/academics/assignments')}
              >
                <ClipboardList className="h-6 w-6 text-info" />
                <span className="text-sm">Create Assignment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}