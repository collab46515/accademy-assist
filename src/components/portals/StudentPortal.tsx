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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function StudentPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  useEffect(() => {
    if (studentData?.id) {
      fetchAttendance();
    }
  }, [studentData]);

  const fetchStudentData = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(first_name, last_name, email)
        `)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setStudentData(data);
    } catch (error: any) {
      console.error('Error fetching student data:', error);
      if (error.code === 'PGRST116') {
        // No student record found - show helpful message
        toast({
          title: "Student Record Not Found",
          description: "Your student profile is still being set up. Please contact the admissions office.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', studentData.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter(record => record.status === 'present').length;
    return Math.round((present / attendance.length) * 100);
  };

  const getTodaySchedule = () => {
    // This would come from timetable data - placeholder for now
    return [
      { time: '09:00-09:45', subject: 'Mathematics', teacher: 'Ms. Smith', room: 'M101' },
      { time: '09:45-10:30', subject: 'English', teacher: 'Mr. Wilson', room: 'E203' },
      { time: '11:00-11:45', subject: 'Science', teacher: 'Dr. Brown', room: 'S105' },
    ];
  };

  const getUpcomingAssignments = () => {
    // Placeholder assignments - would come from assignments system
    return [
      { subject: 'Mathematics', task: 'Algebra Quiz', due: 'Tomorrow', priority: 'high', completed: false },
      { subject: 'English', task: 'Essay: Romeo and Juliet', due: 'Friday', priority: 'medium', completed: false },
      { subject: 'Science', task: 'Lab Report', due: 'Next week', priority: 'medium', completed: true },
    ];
  };

  const getRecentGrades = () => {
    // Placeholder grades - would come from gradebook system
    return [
      { subject: 'Mathematics', assignment: 'Geometry Test', grade: 'A-', date: '2024-01-15' },
      { subject: 'English', assignment: 'Creative Writing', grade: 'B+', date: '2024-01-12' },
      { subject: 'Science', assignment: 'Physics Quiz', grade: 'A', date: '2024-01-10' },
    ];
  };

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

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your student profile is being set up. Please contact the admissions office for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const studentName = `${studentData.profiles?.first_name || ''} ${studentData.profiles?.last_name || ''}`.trim() || 'Student';
  const attendancePercentage = calculateAttendancePercentage();
  const todaySchedule = getTodaySchedule();
  const upcomingAssignments = getUpcomingAssignments();
  const recentGrades = getRecentGrades();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {studentName}!</h1>
            <p className="text-muted-foreground">Ready to make today amazing? Let's see what's ahead.</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">{studentData.year_group}</Badge>
              <Badge variant="outline">{studentData.form_class}</Badge>
              <Badge variant="outline">#{studentData.student_number}</Badge>
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
                { title: 'Classes Today', value: todaySchedule.length.toString(), icon: BookOpen, color: 'text-blue-600' },
                { title: 'Pending Tasks', value: upcomingAssignments.filter(a => !a.completed).length.toString(), icon: Target, color: 'text-orange-600' },
                { title: 'Recent Grades', value: recentGrades.length.toString(), icon: Trophy, color: 'text-green-600' },
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