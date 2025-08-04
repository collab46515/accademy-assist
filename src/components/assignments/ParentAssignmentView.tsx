import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  FileText, 
  BookOpen,
  CheckCircle, 
  AlertCircle,
  Timer,
  TrendingUp,
  MessageSquare,
  Download,
  Bell,
  User,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useRBAC } from '@/hooks/useRBAC';
import { useAuth } from '@/hooks/useAuth';

export const ParentAssignmentView = () => {
  const { currentSchool } = useRBAC();
  const { user } = useAuth();
  const { assignments } = useAssignmentData(currentSchool?.id);
  const [selectedChild, setSelectedChild] = useState<string>('child-1');

  // Mock children data - in real app, fetch from student_parents table
  const children = [
    {
      id: 'child-1',
      name: 'Emma Thompson',
      year_group: 'Year 4',
      form_class: '4A',
      student_number: 'S2024001'
    },
    {
      id: 'child-2', 
      name: 'Oliver Thompson',
      year_group: 'Year 6',
      form_class: '6B',
      student_number: 'S2024002'
    }
  ];

  const selectedChildData = children.find(c => c.id === selectedChild);

  // Mock assignment data for the selected child
  const childAssignments = assignments.map(assignment => ({
    ...assignment,
    submissionStatus: Math.random() > 0.3 ? 'submitted' : 'not_submitted',
    grade: Math.random() > 0.6 ? Math.floor(Math.random() * assignment.total_marks) : null,
    feedback: Math.random() > 0.7 ? "Excellent work! Keep up the good effort." : null,
    submittedAt: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    teacherName: `${assignment.subject} Teacher`
  }));

  const upcomingAssignments = childAssignments.filter(a => 
    new Date(a.due_date) > new Date() && a.submissionStatus === 'not_submitted'
  ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const overdueAssignments = childAssignments.filter(a => 
    new Date(a.due_date) < new Date() && a.submissionStatus === 'not_submitted'
  );

  const completedAssignments = childAssignments.filter(a => 
    a.submissionStatus === 'submitted'
  );

  const gradedAssignments = childAssignments.filter(a => 
    a.grade !== null
  );

  // Calculate stats
  const stats = {
    totalAssignments: childAssignments.length,
    completed: completedAssignments.length,
    pending: childAssignments.length - completedAssignments.length,
    overdue: overdueAssignments.length,
    averageGrade: gradedAssignments.length > 0 
      ? Math.round(gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length)
      : 0,
    onTimeRate: completedAssignments.length > 0 
      ? Math.round((completedAssignments.filter(a => !a.submittedAt || new Date(a.submittedAt) <= new Date(a.due_date)).length / completedAssignments.length) * 100)
      : 100
  };

  const getStatusColor = (assignment: any) => {
    if (assignment.submissionStatus === 'submitted') {
      return assignment.grade !== null ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (new Date(assignment.due_date) < new Date()) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusIcon = (assignment: any) => {
    if (assignment.submissionStatus === 'submitted') {
      return assignment.grade !== null ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-blue-600" />;
    }
    if (new Date(assignment.due_date) < new Date()) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <Timer className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusText = (assignment: any) => {
    if (assignment.submissionStatus === 'submitted') {
      return assignment.grade !== null ? 'Graded' : 'Submitted';
    }
    if (new Date(assignment.due_date) < new Date()) {
      return 'Overdue';
    }
    return 'Pending';
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const subjectPerformance = [...new Set(childAssignments.map(a => a.subject))].map(subject => {
    const subjectAssignments = childAssignments.filter(a => a.subject === subject && a.grade !== null);
    const avgGrade = subjectAssignments.length > 0 
      ? subjectAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / subjectAssignments.length
      : 0;
    const totalMarks = subjectAssignments.length > 0 
      ? subjectAssignments.reduce((sum, a) => sum + a.total_marks, 0) / subjectAssignments.length
      : 20;
    
    return {
      subject,
      average: Math.round(avgGrade),
      percentage: totalMarks > 0 ? Math.round((avgGrade / totalMarks) * 100) : 0,
      assignments: subjectAssignments.length
    };
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Child's Assignments</h1>
          <p className="text-muted-foreground">Track homework progress and performance</p>
        </div>
        
        {/* Child Selector */}
        {children.length > 1 && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <select 
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.year_group})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Child Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {selectedChildData?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{selectedChildData?.name}</CardTitle>
              <CardDescription>
                {selectedChildData?.year_group} • {selectedChildData?.form_class} • Student #{selectedChildData?.student_number}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <Timer className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.completed / stats.totalAssignments) * 100)}%</div>
            <p className="text-xs text-muted-foreground">{stats.completed}/{stats.totalAssignments} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Time Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTimeRate}%</div>
            <p className="text-xs text-muted-foreground">Submitted on time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAssignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({overdueAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>
                Assignments due in the coming days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming assignments</p>
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(assignment)}
                            <h3 className="font-semibold">{assignment.title}</h3>
                            <Badge variant="outline" className={getStatusColor(assignment)}>
                              {getStatusText(assignment)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDueDate(assignment.due_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {assignment.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {assignment.total_marks} marks
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {assignment.teacherName}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Remind
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Assignments</CardTitle>
              <CardDescription>
                Assignments submitted by {selectedChildData?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAssignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(assignment)}
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <Badge variant="outline" className={getStatusColor(assignment)}>
                            {getStatusText(assignment)}
                          </Badge>
                          {assignment.grade !== null && (
                            <Badge variant="secondary">
                              {assignment.grade}/{assignment.total_marks} ({Math.round((assignment.grade / assignment.total_marks) * 100)}%)
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Submitted: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {assignment.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {assignment.teacherName}
                          </span>
                        </div>
                        
                        {assignment.feedback && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Teacher Feedback</span>
                            </div>
                            <p className="text-sm text-blue-700">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average grades by subject</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.percentage}% ({subject.assignments} assignments)
                      </span>
                    </div>
                    <Progress value={subject.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Trends</CardTitle>
                <CardDescription>Performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Performance charts coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className={overdueAssignments.length > 0 ? "border-red-200" : ""}>
            <CardHeader>
              <CardTitle className={overdueAssignments.length > 0 ? "text-red-700" : ""}>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-5 w-5 ${overdueAssignments.length > 0 ? "text-red-600" : "text-muted-foreground"}`} />
                  Assignment Alerts
                </div>
              </CardTitle>
              <CardDescription>
                {overdueAssignments.length > 0 
                  ? `${overdueAssignments.length} overdue assignment${overdueAssignments.length !== 1 ? 's' : ''} requiring attention`
                  : "No current alerts"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overdueAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">No overdue assignments</p>
                  <p className="text-sm text-muted-foreground">Great work staying on top of everything!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overdueAssignments.map((assignment) => (
                    <div key={assignment.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <h3 className="font-semibold text-red-800">{assignment.title}</h3>
                            <Badge variant="destructive">Overdue</Badge>
                          </div>
                          <p className="text-sm text-red-700 mb-2">{assignment.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-red-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDueDate(assignment.due_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {assignment.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {assignment.teacherName}
                            </span>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Urgent Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};