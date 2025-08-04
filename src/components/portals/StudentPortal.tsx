import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ClipboardList
} from 'lucide-react';
import { StudentAssignmentView } from '../assignments/StudentAssignmentView';

export function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const studentInfo = {
    name: 'Emma Johnson',
    class: 'Year 8A',
    house: 'Phoenix',
    overallGrade: 'A-',
    attendance: 96
  };

  const todaySchedule = [
    { time: '09:00-09:45', subject: 'Mathematics', teacher: 'Ms. Smith', room: 'M101', homework: true },
    { time: '09:45-10:30', subject: 'English', teacher: 'Mr. Wilson', room: 'E203', homework: false },
    { time: '11:00-11:45', subject: 'Science', teacher: 'Dr. Brown', room: 'S105', homework: true },
    { time: '13:30-14:15', subject: 'History', teacher: 'Ms. Davis', room: 'H301', homework: false },
    { time: '14:15-15:00', subject: 'Art', teacher: 'Mr. Taylor', room: 'A102', homework: false }
  ];

  const upcomingAssignments = [
    { subject: 'Mathematics', task: 'Algebra Quiz', due: 'Tomorrow', priority: 'high', completed: false },
    { subject: 'English', task: 'Essay: Romeo and Juliet', due: 'Friday', priority: 'medium', completed: false },
    { subject: 'Science', task: 'Lab Report', due: 'Next week', priority: 'medium', completed: true },
    { subject: 'History', task: 'World War 2 Project', due: 'Next week', priority: 'low', completed: false }
  ];

  const recentGrades = [
    { subject: 'Mathematics', assignment: 'Geometry Test', grade: 'A-', date: '2024-01-15' },
    { subject: 'English', assignment: 'Creative Writing', grade: 'B+', date: '2024-01-12' },
    { subject: 'Science', assignment: 'Physics Quiz', grade: 'A', date: '2024-01-10' },
    { subject: 'History', assignment: 'Medieval Essay', grade: 'B', date: '2024-01-08' }
  ];

  const achievements = [
    { title: 'Math Star', description: 'Top performance in algebra', icon: Star, date: '2024-01-15' },
    { title: 'Perfect Attendance', description: 'No absences this month', icon: CheckCircle, date: '2024-01-01' },
    { title: 'Science Champion', description: 'Excellent lab work', icon: Trophy, date: '2023-12-20' }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {studentInfo.name}!</h1>
            <p className="text-muted-foreground">Ready to make today amazing? Let's see what's ahead.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{studentInfo.overallGrade}</p>
              <p className="text-xs text-muted-foreground">Overall Grade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{studentInfo.attendance}%</p>
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
                { title: 'Classes Today', value: '5', icon: BookOpen, color: 'text-blue-600' },
                { title: 'Pending Tasks', value: '3', icon: Target, color: 'text-orange-600' },
                { title: 'Messages', value: '2', icon: MessageSquare, color: 'text-purple-600' },
                { title: 'Achievements', value: '12', icon: Trophy, color: 'text-green-600' }
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
                      {todaySchedule.map((lesson, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50">
                          <div className="text-center min-w-[80px]">
                            <p className="text-sm font-medium">{lesson.time}</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{lesson.subject}</p>
                            <p className="text-sm text-muted-foreground">{lesson.teacher} • Room {lesson.room}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.homework && (
                              <Badge variant="outline" className="text-orange-600">
                                <FileText className="h-3 w-3 mr-1" />
                                Homework
                              </Badge>
                            )}
                            <Badge variant="outline">Next</Badge>
                          </div>
                        </div>
                      ))}
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
                  {upcomingAssignments.map((assignment, index) => (
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
                  ))}
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

            {/* Academic Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Grades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentGrades.map((grade, index) => (
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <achievement.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Tracking */}
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Submit Assignment', description: 'Upload your latest work', icon: FileText, color: 'bg-blue-500' },
                    { title: 'Join Study Group', description: 'Connect with classmates', icon: Users, color: 'bg-green-500' },
                    { title: 'Book Library Slot', description: 'Reserve study space', icon: BookOpen, color: 'bg-purple-500' }
                  ].map((action, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-lg ${action.color} text-white flex items-center justify-center mx-auto mb-3`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <StudentAssignmentView />
          </TabsContent>

          <TabsContent value="timetable">
            <Card>
              <CardHeader>
                <CardTitle>My Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Full timetable view coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}