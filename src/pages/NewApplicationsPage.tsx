import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, UserPlus, FileText, Calendar, Clock, Users } from 'lucide-react';

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

  const recentApplications = [
    { id: "APP001", name: "John Smith", yearGroup: "Year 7", submittedDate: "2024-01-15", status: "Draft" },
    { id: "APP002", name: "Emma Johnson", yearGroup: "Year 9", submittedDate: "2024-01-15", status: "Submitted" },
    { id: "APP003", name: "Michael Brown", yearGroup: "Year 8", submittedDate: "2024-01-14", status: "Under Review" },
    { id: "APP004", name: "Sarah Wilson", yearGroup: "Year 10", submittedDate: "2024-01-14", status: "Draft" },
    { id: "APP005", name: "David Taylor", yearGroup: "Year 7", submittedDate: "2024-01-13", status: "Submitted" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="New Applications" 
        description="Manage new student applications and admissions intake"
      />

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
            <Plus className="h-5 w-5" />
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
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span>Import Applications</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Open Day</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Application ID</th>
                  <th className="text-left py-3 px-4 font-medium">Student Name</th>
                  <th className="text-left py-3 px-4 font-medium">Year Group</th>
                  <th className="text-left py-3 px-4 font-medium">Submitted Date</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((application) => (
                  <tr key={application.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{application.id}</td>
                    <td className="py-3 px-4 font-medium">{application.name}</td>
                    <td className="py-3 px-4">{application.yearGroup}</td>
                    <td className="py-3 px-4">{application.submittedDate}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}