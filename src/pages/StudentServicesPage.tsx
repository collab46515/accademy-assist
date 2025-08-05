import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CheckSquare, 
  Library, 
  Truck, 
  Heart, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  Shield,
  Activity,
  MapPin
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function StudentServicesPage() {
  const navigate = useNavigate();

  const studentServiceModules = [
    {
      title: "Student Directory",
      description: "Complete student information management and profiles",
      icon: Users,
      url: "/students",
      stats: "1,247 active students",
      color: "bg-blue-500",
      features: ["Student Profiles", "Contact Management", "Academic History", "Parent Information"]
    },
    {
      title: "Attendance Tracking",
      description: "Real-time attendance monitoring and reporting",
      icon: CheckSquare,
      url: "/attendance",
      stats: "94.2% today",
      color: "bg-green-500",
      features: ["Digital Check-in", "Absence Tracking", "Parent Notifications", "Attendance Reports"]
    },
    {
      title: "Library Services",
      description: "Digital library management and resource access",
      icon: Library,
      url: "/library",
      stats: "2,450 books available",
      color: "bg-purple-500",
      features: ["Book Catalog", "Digital Lending", "Reservations", "Fine Management"]
    },
    {
      title: "Transport Management",
      description: "School transport coordination and tracking",
      icon: Truck,
      url: "/transport",
      stats: "12 routes active",
      color: "bg-orange-500",
      features: ["Route Planning", "Vehicle Tracking", "Driver Management", "Safety Monitoring"]
    },
    {
      title: "Student Welfare",
      description: "Comprehensive student wellbeing and support services",
      icon: Heart,
      url: "/student-welfare",
      stats: "3 cases pending",
      color: "bg-red-500",
      features: ["Health Monitoring", "Counseling", "Safeguarding", "Pastoral Care"]
    },
    {
      title: "Activities & Events",
      description: "Extracurricular activities and event management",
      icon: Calendar,
      url: "/activities",
      stats: "15 events this month",
      color: "bg-indigo-500",
      features: ["Event Planning", "Activity Enrollment", "Competition Tracking", "Achievement Records"]
    },
    {
      title: "Communication",
      description: "School-wide communication and messaging platform",
      icon: MessageSquare,
      url: "/communication",
      stats: "125 messages sent",
      color: "bg-cyan-500",
      features: ["Announcements", "Parent Messaging", "Emergency Alerts", "Newsletter Distribution"]
    }
  ];

  const serviceStats = [
    { label: "Active Students", value: "1,247", trend: "+3.2%", icon: Users },
    { label: "Attendance Rate", value: "94.2%", trend: "+1.8%", icon: CheckSquare },
    { label: "Library Usage", value: "89%", trend: "+5.1%", icon: Library },
    { label: "Transport Coverage", value: "78%", trend: "+2.3%", icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="Student Services" 
        description="Comprehensive student support and service management"
      />
      
      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {serviceStats.map((stat, index) => (
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

        {/* Student Service Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentServiceModules.map((module, index) => (
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
            <CardDescription>Frequently used student service operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all duration-200"
                onClick={() => navigate('/attendance')}
              >
                <CheckSquare className="h-6 w-6 text-primary" />
                <span className="text-sm">Mark Attendance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-success/5 hover:border-success transition-all duration-200"
                onClick={() => navigate('/library/borrowing')}
              >
                <Library className="h-6 w-6 text-success" />
                <span className="text-sm">Library Checkout</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-warning/5 hover:border-warning transition-all duration-200"
                onClick={() => navigate('/transport/tracking')}
              >
                <MapPin className="h-6 w-6 text-warning" />
                <span className="text-sm">Track Transport</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-info/5 hover:border-info transition-all duration-200"
                onClick={() => navigate('/communication')}
              >
                <MessageSquare className="h-6 w-6 text-info" />
                <span className="text-sm">Send Message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}