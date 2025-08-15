import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StudentTimetableView } from '@/components/timetable/StudentTimetableView';
import { PeriodsManager } from '@/components/timetable/management/PeriodsManager';
import { SubjectsManager } from '@/components/timetable/management/SubjectsManager';
import { ClassroomsManager } from '@/components/timetable/management/ClassroomsManager';
import { TimetableEntriesManager } from '@/components/timetable/management/TimetableEntriesManager';
import { AITimetableGenerator } from '@/components/ai-timetable/AITimetableGenerator';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  Calendar, 
  Clock, 
  Settings, 
  Users, 
  AlertTriangle,
  Zap,
  BookOpen,
  GraduationCap,
  Wand2,
  Brain
} from 'lucide-react';

function AIAutoGeneratorCard() {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wand2 className="h-5 w-5 text-primary" />
          </div>
          <span>AI Automatic Timetable Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Revolutionary AI-powered timetable generation with conflict resolution and optimization.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-background/50">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Intelligent Conflict Detection</span>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-background/50">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Teacher Workload Optimization</span>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-background/50">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Room Allocation Automation</span>
          </div>
        </div>
        
        <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
          <DialogTrigger asChild>
            <Button className="w-full shadow-[var(--shadow-elegant)]">
              <Zap className="h-4 w-4 mr-2" />
              Launch AI Timetable Generator
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Timetable Generator
              </DialogTitle>
            </DialogHeader>
            <AITimetableGenerator onClose={() => setIsGeneratorOpen(false)} />
          </DialogContent>
        </Dialog>
        
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <strong className="text-primary">AI Features:</strong>
            <br />• One-click timetable generation with 95%+ optimization
            <br />• Automatic conflict resolution and constraint satisfaction
            <br />• Real-time analytics and performance insights
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TimetablePage() {
  const { currentSchool, hasRole, userRoles, loading } = useRBAC();

  // Debug logging
  console.log('Timetable Debug:', { currentSchool, userRoles, loading });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
  const isSuperAdmin = hasRole('super_admin', currentSchool?.id);
  const canManageTimetables = isSuperAdmin || hasRole('school_admin', currentSchool?.id) || hasRole('hod', currentSchool?.id);
  const canViewTimetables = isSuperAdmin || hasRole('teacher', currentSchool?.id) || hasRole('student', currentSchool?.id) || hasRole('parent', currentSchool?.id) || canManageTimetables;

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
            <TabsTrigger value="teacher-view" className="flex items-center gap-2" disabled={!hasRole('teacher', currentSchool?.id) && !canManageTimetables}>
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
              <div className="space-y-6">
                <Tabs defaultValue="periods" className="w-full">
                  <TabsList className="grid w-full max-w-lg grid-cols-4">
                    <TabsTrigger value="periods">Periods</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="entries">Entries</TabsTrigger>
                  </TabsList>

                  <TabsContent value="periods" className="mt-6">
                    <PeriodsManager />
                  </TabsContent>

                  <TabsContent value="subjects" className="mt-6">
                    <SubjectsManager />
                  </TabsContent>

                  <TabsContent value="rooms" className="mt-6">
                    <ClassroomsManager />
                  </TabsContent>

                  <TabsContent value="entries" className="mt-6">
                    <TimetableEntriesManager />
                  </TabsContent>
                </Tabs>
              </div>

              {/* AI Auto-Generator Section */}
              <div className="grid grid-cols-1 gap-6">
                <AIAutoGeneratorCard />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}