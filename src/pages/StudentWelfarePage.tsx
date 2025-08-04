import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { Activity, MessageSquare, Shield, Heart, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentWelfarePage = () => {
  const navigate = useNavigate();

  const welfareModules = [
    {
      title: "Infirmary",
      description: "Manage student health records, medical visits, and medicine administration",
      icon: Activity,
      path: "/student-welfare/infirmary",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Complaints",
      description: "Handle student and parent complaints with tracking and resolution",
      icon: MessageSquare,
      path: "/student-welfare/complaints",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Safeguarding",
      description: "Manage safeguarding concerns, actions, and reviews for student protection",
      icon: Shield,
      path: "/student-welfare/safeguarding",
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const stats = [
    {
      title: "Active Medical Cases",
      value: "12",
      icon: Heart,
      description: "Students with ongoing medical needs"
    },
    {
      title: "Open Complaints",
      value: "3",
      icon: AlertTriangle,
      description: "Complaints requiring attention"
    },
    {
      title: "Safeguarding Cases",
      value: "5",
      icon: Shield,
      description: "Active safeguarding concerns"
    },
    {
      title: "Welfare Staff",
      value: "8",
      icon: Users,
      description: "Staff involved in student welfare"
    }
  ];

  return (
    <div className="w-full">
      <PageHeader
        title="Student Welfare"
        description="Comprehensive student welfare management system for health, complaints, and safeguarding"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Student Welfare' }
        ]}
      />
      <div className="space-y-6 p-6">

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {welfareModules.map((module) => (
          <Card key={module.title} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4`}>
                <module.icon className={`h-6 w-6 ${module.color}`} />
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="text-sm">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(module.path)}
                className="w-full"
              >
                Access {module.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common welfare management tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" onClick={() => navigate("/student-welfare/infirmary")}>
              Record Medical Visit
            </Button>
            <Button variant="outline" onClick={() => navigate("/student-welfare/complaints")}>
              Log New Complaint
            </Button>
            <Button variant="outline" onClick={() => navigate("/student-welfare/safeguarding")}>
              Report Safeguarding Concern
            </Button>
            <Button variant="outline">
              Generate Welfare Report
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentWelfarePage;