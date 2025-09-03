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
          🔔 No assignment data available. Connect with your school to access assignments.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Assignments Available</h3>
          <p className="text-muted-foreground">
            Assignment data will appear here once your school sets up the system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}