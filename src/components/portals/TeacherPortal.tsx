import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  ClipboardList,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TeacherPortal() {
  const navigate = useNavigate();

  const todayStats = [
    { title: 'Classes Today', value: '6', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Students', value: '127', icon: Users, color: 'text-green-600' },
    { title: 'Assignments Due', value: '8', icon: FileText, color: 'text-orange-600' },
    { title: 'Messages', value: '3', icon: MessageSquare, color: 'text-purple-600' }
  ];

  const todayClasses = [
    { time: '09:00-09:45', subject: 'Mathematics', class: 'Year 7A', room: 'M101', students: 28 },
    { time: '09:45-10:30', subject: 'Mathematics', class: 'Year 7B', room: 'M101', students: 26 },
    { time: '11:00-11:45', subject: 'Mathematics', class: 'Year 8A', room: 'M102', students: 30 },
    { time: '13:30-14:15', subject: 'Mathematics', class: 'Year 9A', room: 'M101', students: 24 }
  ];

  const pendingTasks = [
    { task: 'Grade Year 8 Math Test', due: 'Today', priority: 'high', type: 'grading' },
    { task: 'Submit lesson plans for next week', due: 'Tomorrow', priority: 'medium', type: 'planning' },
    { task: 'Parent meeting - Sarah Johnson', due: 'Friday', priority: 'medium', type: 'meeting' },
    { task: 'Update student progress reports', due: 'Next week', priority: 'low', type: 'reports' }
  ];

  const quickActions = [
    { title: 'Take Attendance', description: 'Mark student attendance', icon: CheckCircle, path: '/attendance', color: 'bg-green-500' },
    { title: 'Gradebook', description: 'Enter grades and assessments', icon: TrendingUp, path: '/gradebook', color: 'bg-blue-500' },
    { title: 'Lesson Plans', description: 'View and update plans', icon: Calendar, path: '/curriculum', color: 'bg-purple-500' },
    { title: 'Student Reports', description: 'Progress and behavior', icon: FileText, path: '/students', color: 'bg-orange-500' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grading': return TrendingUp;
      case 'planning': return Calendar;
      case 'meeting': return Users;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Good morning! Ready for another great day of teaching?</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long' })}</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayStats.map((stat, index) => (
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
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50">
                      <div className="text-center min-w-[80px]">
                        <p className="text-sm font-medium">{classItem.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{classItem.subject}</p>
                        <p className="text-sm text-muted-foreground">{classItem.class} • Room {classItem.room}</p>
                      </div>
                      <Badge variant="outline">{classItem.students} students</Badge>
                      <Button size="sm" variant="outline">
                        Start Class
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.map((task, index) => {
                const TaskIcon = getTaskIcon(task.type);
                return (
                  <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-start gap-2">
                      <TaskIcon className="h-4 w-4 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.task}</p>
                        <p className="text-xs opacity-70">Due: {task.due}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" size="sm" className="w-full">
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg ${action.color} text-white flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(action.path)}
                    >
                      Open
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
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
                {[
                  { student: 'John Smith', assignment: 'Algebra Test', grade: 'A-', class: 'Year 8A' },
                  { student: 'Emma Wilson', assignment: 'Geometry Quiz', grade: 'B+', class: 'Year 7A' },
                  { student: 'Michael Brown', assignment: 'Statistics Project', grade: 'A', class: 'Year 9A' }
                ].map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{grade.student}</p>
                      <p className="text-sm text-muted-foreground">{grade.assignment} • {grade.class}</p>
                    </div>
                    <Badge>{grade.grade}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Attendance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { student: 'Sarah Johnson', issue: 'Absent 3 days this week', class: 'Year 7B', severity: 'high' },
                  { student: 'David Lee', issue: 'Late arrival today', class: 'Year 8A', severity: 'low' },
                  { student: 'Lisa Chen', issue: 'Missed 2 classes', class: 'Year 9A', severity: 'medium' }
                ].map((alert, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{alert.student}</p>
                      <p className="text-sm text-muted-foreground">{alert.issue} • {alert.class}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}