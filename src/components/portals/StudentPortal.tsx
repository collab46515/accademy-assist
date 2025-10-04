import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  Users,
  MessageSquare,
  FileText,
  Star,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  Award,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { StudentAssignmentView } from '../assignments/StudentAssignmentView';
import { StudentTimetableView } from '../timetable/StudentTimetableView';
import { useAuth } from '@/hooks/useAuth';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';

export function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const {
    loading,
    stats,
    studentData,
    todaySchedule,
    upcomingAssignments,
    recentGrades
  } = useStudentDashboard();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const finalStudentData = studentData || {
    id: 'no-data',
    user_id: user?.id,
    student_number: 'N/A',
    year_group: 'N/A',
    form_class: 'N/A',
    profiles: {
      first_name: 'Student',
      last_name: 'User',
      email: user?.email || ''
    }
  };

  const studentName = `${finalStudentData.profiles?.first_name || ''} ${finalStudentData.profiles?.last_name || ''}`.trim() || 'Student';
  const attendancePercentage = stats.attendancePercentage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {studentName}!</h1>
            <p className="text-muted-foreground">Ready to make today amazing? Let's see what's ahead.</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">{finalStudentData.year_group}</Badge>
              <Badge variant="outline">{finalStudentData.form_class}</Badge>
              <Badge variant="outline">#{finalStudentData.student_number}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">A-</p>
              <p className="text-xs text-muted-foreground">Overall Grade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{attendancePercentage}%</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              My Assignments
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timetable
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Classes Today', value: stats.classesToday.toString(), icon: BookOpen, color: 'text-blue-600' },
                { title: 'Pending Tasks', value: stats.pendingTasks.toString(), icon: Target, color: 'text-orange-600' },
                { title: 'Recent Grades', value: stats.recentGrades.toString(), icon: Trophy, color: 'text-green-600' },
                { title: 'Attendance', value: `${attendancePercentage}%`, icon: CheckCircle, color: 'text-purple-600' }
              ].map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todaySchedule.length > 0 ? todaySchedule.map((lesson, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50">
                          <div className="text-center min-w-[80px]">
                            <p className="text-sm font-medium">{lesson.time}</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{lesson.subject}</p>
                            <p className="text-sm text-muted-foreground">{lesson.teacher} • Room {lesson.room}</p>
                          </div>
                          <Badge variant="outline">Next</Badge>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No classes scheduled for today</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Assignments Quick View */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingAssignments.length > 0 ? upcomingAssignments.map((assignment, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(assignment.priority)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">{assignment.subject}</p>
                        {assignment.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <p className="text-sm">{assignment.task}</p>
                      <p className="text-xs opacity-70 mt-1">Due: {assignment.due}</p>
                    </div>
                  )) : (
                    <div className="text-center py-4">
                      <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No assignments due</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab('assignments')}
                  >
                    View All Assignments
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Grades */}
            {recentGrades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Grades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentGrades.slice(0, 6).map((grade, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{grade.subject}</p>
                          <p className="text-sm text-muted-foreground">{grade.assignment}</p>
                          <p className="text-xs text-muted-foreground">{grade.date}</p>
                        </div>
                        <Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Academic Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Subject Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { subject: 'Mathematics', progress: 85, grade: 'A-', trend: 'up' },
                    { subject: 'English', progress: 78, grade: 'B+', trend: 'stable' },
                    { subject: 'Science', progress: 92, grade: 'A', trend: 'up' },
                    { subject: 'History', progress: 73, grade: 'B', trend: 'down' }
                  ].map((subject, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{subject.subject}</h3>
                        <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                      <div className="flex items-center gap-1">
                        {subject.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {subject.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                        {subject.trend === 'stable' && <div className="w-4 h-4 border-t-2 border-gray-400" />}
                        <span className="text-xs text-muted-foreground capitalize">{subject.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <StudentAssignmentView />
          </TabsContent>

          <TabsContent value="timetable">
            <StudentTimetableView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}