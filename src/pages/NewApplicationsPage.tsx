import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, UserPlus, FileText, Calendar, Clock, Users, FolderOpen, ArrowRight } from 'lucide-react';

export default function NewApplicationsPage() {
  const navigate = useNavigate();

  // Handle application type selection
  const handleStartApplication = (applicationType: string) => {
    console.log(`Starting ${applicationType} application`);
    toast({
      title: "Starting Application",
      description: `Redirecting to ${applicationType} enrollment form...`,
    });
    
    // Navigate to enrollment with application type
    navigate(`/admissions/enroll?type=${applicationType.toLowerCase().replace(' ', '_')}`);
  };

  const stats = [
    { label: "Draft Applications", value: "12", icon: FileText, color: "bg-blue-500" },
    { label: "Today's Submissions", value: "5", icon: Calendar, color: "bg-green-500" },
    { label: "Pending Review", value: "8", icon: Clock, color: "bg-yellow-500" },
    { label: "Total Applicants", value: "156", icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Applications" 
        description="Manage student applications and enrollment"
      />

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start New Application Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
          onClick={() => navigate('/admissions/enroll')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Start New Application</CardTitle>
                  <CardDescription>Begin a new student enrollment</CardDescription>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Choose from multiple enrollment pathways including standard admission, SEN, staff children, and emergency placements.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Standard</Badge>
              <Badge variant="outline">SEN</Badge>
              <Badge variant="outline">Staff Child</Badge>
              <Badge variant="outline">Emergency</Badge>
            </div>
          </CardContent>
        </Card>

        {/* My Applications Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
          onClick={() => navigate('/admissions/my-applications')}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>View and manage your applications</CardDescription>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resume draft applications, track submission status, and view application history for all your enrollment applications.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Drafts</Badge>
              <Badge variant="outline">Submitted</Badge>
              <Badge variant="outline">Under Review</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="h-16 flex flex-col gap-2"
              onClick={() => handleStartApplication("Online Application")}
            >
              <UserPlus className="h-5 w-5" />
              <span>Start New Application</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2"
              onClick={() => navigate('/admissions/my-applications')}
            >
              <FolderOpen className="h-5 w-5" />
              <span>My Applications</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Open Day</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}