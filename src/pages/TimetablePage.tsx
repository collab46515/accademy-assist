import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentTimetableView } from '@/components/timetable/StudentTimetableView';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  Calendar, 
  Clock, 
  Settings, 
  Users, 
  AlertTriangle,
  Zap,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function TimetablePage() {
  const { currentSchool, hasRole } = useRBAC();

  if (!currentSchool) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No School Selected</h3>
            <p className="text-muted-foreground text-center">
              Please select a school to access the timetable system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check user permissions
  const canManageTimetables = hasRole('school_admin', currentSchool?.id) || hasRole('hod', currentSchool?.id);
  const canViewTimetables = hasRole('teacher', currentSchool?.id) || hasRole('student', currentSchool?.id) || hasRole('parent', currentSchool?.id) || canManageTimetables;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          School Timetable System
        </h1>
        <p className="text-muted-foreground">
          Comprehensive timetable management with real-time attendance integration
        </p>
      </div>

      {/* Permission check */}
      {!canViewTimetables && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground text-center">
              You don't have permission to view timetables. Contact your administrator.
            </p>
          </CardContent>
        </Card>
      )}

      {canViewTimetables && (
        <Tabs defaultValue="student-view" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="student-view" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student View
            </TabsTrigger>
            <TabsTrigger value="teacher-view" className="flex items-center gap-2" disabled={!hasRole('teacher') && !canManageTimetables}>
              <Users className="h-4 w-4" />
              Teacher View
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2" disabled={!canManageTimetables}>
              <Settings className="h-4 w-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          {/* Student/Parent Timetable View */}
          <TabsContent value="student-view" className="mt-6">
            <StudentTimetableView />
          </TabsContent>

          {/* Teacher Timetable View */}
          <TabsContent value="teacher-view" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Teacher Timetable View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Teacher timetable view coming soon.
                    <br />
                    Features: Personal schedule, class management, attendance integration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Management View */}
          <TabsContent value="manage" className="mt-6">
            <div className="grid gap-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">
                      Active timetable entries
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      Different subjects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Periods</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      Daily periods (6 classes + 2 breaks)
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Management Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manual Timetable Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Manual Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Create and edit timetables manually with full control over every period.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Manage Periods & Times
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Manage Subjects
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Classrooms
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Timetable Entries
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Auto-Generated Timetable (Phase 2) */}
                <Card className="border-dashed border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Auto-Generator (Coming Soon)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      AI-powered timetable generation with conflict resolution and optimization.
                    </p>
                    <div className="space-y-2 opacity-50">
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <Zap className="h-4 w-4 mr-2" />
                        Set Generation Rules
                      </Button>
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Constraints
                      </Button>
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <Calendar className="h-4 w-4 mr-2" />
                        Generate Timetable
                      </Button>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Phase 2 Features:</strong>
                        <br />• Intelligent conflict detection
                        <br />• Teacher workload optimization
                        <br />• Room allocation automation
                        <br />• One-click timetable generation
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}