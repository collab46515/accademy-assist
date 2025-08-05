import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Target, 
  DollarSign, 
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Shield
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function StaffHRPage() {
  const navigate = useNavigate();

  const hrModules = [
    {
      title: "Employee Management",
      description: "Comprehensive employee lifecycle and profile management",
      icon: Users,
      url: "/hr-management",
      stats: "145 active employees",
      color: "bg-blue-500",
      features: ["Employee Profiles", "Organizational Structure", "Role Management", "Performance Tracking"]
    },
    {
      title: "Staff Directory",
      description: "Detailed staff information and contact management",
      icon: UserCheck,
      url: "/staff",
      stats: "12 departments",
      color: "bg-green-500",
      features: ["Contact Directory", "Department Structure", "Qualifications", "Emergency Contacts"]
    },
    {
      title: "Recruitment",
      description: "End-to-end recruitment and hiring process management",
      icon: UserPlus,
      url: "/hr-management?tab=recruitment",
      stats: "8 open positions",
      color: "bg-purple-500",
      features: ["Job Postings", "Application Tracking", "Interview Scheduling", "Offer Management"]
    },
    {
      title: "Performance & Training",
      description: "Performance reviews and professional development programs",
      icon: Target,
      url: "/hr-management?tab=performance",
      stats: "85% completion rate",
      color: "bg-orange-500",
      features: ["Performance Reviews", "Goal Setting", "Training Programs", "Skill Development"]
    },
    {
      title: "Payroll & Benefits",
      description: "Comprehensive payroll processing and benefits administration",
      icon: DollarSign,
      url: "/hr-management?tab=payroll",
      stats: "£245k monthly",
      color: "bg-red-500",
      features: ["Salary Processing", "Benefits Management", "Tax Calculations", "Compensation Analysis"]
    },
    {
      title: "Time & Attendance",
      description: "Work time tracking and attendance monitoring",
      icon: Clock,
      url: "/hr-management?tab=timeTracking",
      stats: "96.8% attendance",
      color: "bg-indigo-500",
      features: ["Time Tracking", "Leave Management", "Overtime Calculation", "Attendance Reports"]
    }
  ];

  const hrStats = [
    { label: "Total Employees", value: "145", trend: "+5 this month", icon: Users },
    { label: "Active Staff", value: "142", trend: "98% retention", icon: UserCheck },
    { label: "Avg Performance", value: "4.2/5", trend: "+0.3 this quarter", icon: Target },
    { label: "Open Positions", value: "8", trend: "12 applications", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="Staff & HR Management" 
        description="Comprehensive human resources and staff management platform"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {hrStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-success">{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* HR Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hrModules.map((module, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.url)}
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
            <CardDescription>Frequently used HR operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                onClick={() => navigate('/hr-management?tab=employees')}
              >
                <UserPlus className="h-6 w-6 text-primary" />
                <span className="text-sm">Add Employee</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-success/5 hover:border-success transition-all duration-200"
                onClick={() => navigate('/hr-management?tab=payroll')}
              >
                <DollarSign className="h-6 w-6 text-success" />
                <span className="text-sm">Process Payroll</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-warning/5 hover:border-warning transition-all duration-200"
                onClick={() => navigate('/hr-management?tab=performance')}
              >
                <Award className="h-6 w-6 text-warning" />
                <span className="text-sm">Performance Review</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-info/5 hover:border-info transition-all duration-200"
                onClick={() => navigate('/hr-management?tab=timeTracking')}
              >
                <Clock className="h-6 w-6 text-info" />
                <span className="text-sm">Time Tracking</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}