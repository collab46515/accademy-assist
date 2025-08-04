import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Plus,
  FileText,
  GraduationCap
} from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useRBAC } from '@/hooks/useRBAC';
import { AssignmentsList } from './AssignmentsList';
import { CreateAssignmentDialog } from './CreateAssignmentDialog';

export const AssignmentDashboard = () => {
  const { currentSchool } = useRBAC();
  const { assignments, loading } = useAssignmentData(currentSchool?.id);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const stats = {
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter(a => a.status === 'published').length,
    draftAssignments: assignments.filter(a => a.status === 'draft').length,
    overdueAssignments: assignments.filter(a => 
      a.status === 'published' && new Date(a.due_date) < new Date()
    ).length
  };

  const upcomingDeadlines = assignments
    .filter(a => a.status === 'published' && new Date(a.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments & Homework</h1>
          <p className="text-muted-foreground">Create, assign, and track student assignments</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">All assignments created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAssignments}</div>
            <p className="text-xs text-muted-foreground">Currently published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Assignments</CardTitle>
            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftAssignments}</div>
            <p className="text-xs text-muted-foreground">Pending publication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueAssignments}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Assignments</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AssignmentsList 
                assignments={assignments} 
                loading={loading}
                title="All Assignments"
              />
            </TabsContent>

            <TabsContent value="active">
              <AssignmentsList 
                assignments={assignments.filter(a => a.status === 'published')} 
                loading={loading}
                title="Active Assignments"
              />
            </TabsContent>

            <TabsContent value="draft">
              <AssignmentsList 
                assignments={assignments.filter(a => a.status === 'draft')} 
                loading={loading}
                title="Draft Assignments"
              />
            </TabsContent>

            <TabsContent value="overdue">
              <AssignmentsList 
                assignments={assignments.filter(a => 
                  a.status === 'published' && new Date(a.due_date) < new Date()
                )} 
                loading={loading}
                title="Overdue Assignments"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Next assignments due
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              ) : (
                upcomingDeadlines.map((assignment) => (
                  <div key={assignment.id} className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.subject} - {assignment.year_group}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {assignment.assignment_type}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View All Submissions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Grade Pending Work
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Assignment Dialog */}
      <CreateAssignmentDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};