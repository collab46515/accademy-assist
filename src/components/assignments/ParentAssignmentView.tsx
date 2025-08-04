import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Clock, CheckCircle, AlertCircle, MessageSquare, User } from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useAuth } from '@/hooks/useAuth';

export function ParentAssignmentView() {
  const { user } = useAuth();
  const { assignments = [] } = useAssignmentData();

  // Mock child data - in real app, this would come from database
  const childData = {
    id: "ada-smith",
    name: "Ada Smith",
    class: "Year 4A",
    avatar: "/placeholder.svg"
  };

  // Mock data for the first two assignments to match the spec
  const mockAssignmentsData = [
    {
      id: "math-fractions",
      title: "Equivalent Fractions",
      subject: "Math",
      due_date: "2025-04-08",
      teacher: "Mr. Ade",
      status: "submitted",
      feedback: "Excellent work! You used the fraction wall correctly and showed clear understanding of equivalent fractions."
    },
    {
      id: "english-letter",
      title: "Persuasive Letter",
      subject: "English", 
      due_date: "2025-04-10",
      teacher: "Mrs. Smith",
      status: "in-progress",
      feedback: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'graded': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'not-started': return <AlertCircle className="h-4 w-4" />;
      case 'graded': return <MessageSquare className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      case 'graded': return 'Graded';
      default: return 'Unknown';
    }
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{childData.name}'s Assignments</h1>
            <p className="text-muted-foreground">{childData.class}</p>
          </div>
        </div>
      </div>

      {/* Notification Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Bell className="h-4 w-4" />
        <AlertDescription>
          🔔 You will be notified when {childData.name} submits assignments and when feedback is ready.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="progress">Progress Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">📌 Upcoming</h2>
            
            {mockAssignmentsData.map((assignment) => {
              const status = assignment.status;
              const feedback = assignment.feedback;
              
              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">
                            {assignment.subject}: {assignment.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(assignment.due_date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })} | Status: {getStatusIcon(status)} {getStatusText(status)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Teacher: {assignment.teacher}
                          </p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(status)}>
                          {getStatusIcon(status)}
                          <span className="ml-1">{getStatusText(status)}</span>
                        </Badge>
                      </div>

                      {status === 'submitted' && feedback && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Teacher Feedback</p>
                              <p className="text-sm text-green-700">{feedback}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {status === 'submitted' && !feedback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700">
                            Feedback will appear here once graded.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {mockAssignmentsData.filter(a => a.status === 'submitted').map((assignment) => {
            const feedback = assignment.feedback;
            
            return (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">
                          {assignment.subject}: {assignment.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Completed • Teacher: {assignment.teacher}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        <span className="ml-1">Completed</span>
                      </Badge>
                    </div>
                    
                    {feedback && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800">Teacher Feedback</p>
                            <p className="text-sm text-green-700">{feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completion Rate</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-Time Submissions</span>
                  <span className="font-semibold text-blue-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Grade</span>
                  <span className="font-semibold text-purple-600">B+</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Assignment due reminders</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Submission confirmations</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback ready alerts</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}