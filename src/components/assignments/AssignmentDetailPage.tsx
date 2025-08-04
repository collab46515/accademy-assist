import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
  MessageSquare,
  Download,
  Send,
  GraduationCap
} from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useStudentData } from '@/hooks/useStudentData';
import { GradingInterface } from './GradingInterface';

export const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignments } = useAssignmentData();
  const { students } = useStudentData();
  const [activeTab, setActiveTab] = useState('overview');

  const assignment = assignments.find(a => a.id === id);

  if (!assignment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Assignment not found</p>
          <Button variant="outline" onClick={() => navigate('/academics/assignments')} className="mt-4">
            Back to Assignments
          </Button>
        </div>
      </div>
    );
  }

  // Mock submission data
  const mockSubmissions = [
    {
      id: '1',
      student_id: 'student-1',
      student_name: 'Emma Thompson',
      status: 'submitted',
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      submission_text: 'I have completed all the fraction exercises. Here are my answers...',
      attachment_urls: ['worksheet.pdf'],
      marks_awarded: null,
      feedback: null,
      is_late: false
    },
    {
      id: '2',
      student_id: 'student-2',
      student_name: 'Oliver Johnson',
      status: 'not_submitted',
      submitted_at: null,
      submission_text: null,
      attachment_urls: [],
      marks_awarded: null,
      feedback: null,
      is_late: false
    },
    {
      id: '3',
      student_id: 'student-3',
      student_name: 'Sophie Williams',
      status: 'graded',
      submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      submission_text: 'Here is my completed work on fractions.',
      attachment_urls: ['sophie_fractions.pdf'],
      marks_awarded: 18,
      feedback: 'Excellent work! Very clear explanations.',
      is_late: false
    },
    {
      id: '4',
      student_id: 'student-4',
      student_name: 'James Brown',
      status: 'late',
      submitted_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      submission_text: 'Sorry for the late submission. Here is my work.',
      attachment_urls: [],
      marks_awarded: null,
      feedback: null,
      is_late: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'graded':
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case 'late':
        return <Timer className="h-4 w-4 text-orange-600" />;
      case 'not_submitted':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'graded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'late':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not_submitted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const submissionStats = {
    total: mockSubmissions.length,
    submitted: mockSubmissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
    graded: mockSubmissions.filter(s => s.status === 'graded').length,
    notSubmitted: mockSubmissions.filter(s => s.status === 'not_submitted').length,
    late: mockSubmissions.filter(s => s.is_late).length
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/academics/assignments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{assignment.title}</h1>
          <p className="text-muted-foreground">{assignment.subject} • {assignment.year_group}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats.submitted}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((submissionStats.submitted / submissionStats.total) * 100)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats.graded}</div>
            <p className="text-xs text-muted-foreground">
              {submissionStats.submitted - submissionStats.graded} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late/Missing</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats.late + submissionStats.notSubmitted}</div>
            <p className="text-xs text-muted-foreground">
              {submissionStats.late} late, {submissionStats.notSubmitted} missing
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({submissionStats.total})</TabsTrigger>
          <TabsTrigger value="grading">Grade All</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Due:</strong> {formatDueDate(assignment.due_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Total Marks:</strong> {assignment.total_marks}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Type:</strong> {assignment.assignment_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  </div>

                  {assignment.instructions && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <p className="text-sm text-muted-foreground">{assignment.instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest student activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSubmissions
                    .filter(s => s.submitted_at)
                    .sort((a, b) => new Date(b.submitted_at!).getTime() - new Date(a.submitted_at!).getTime())
                    .slice(0, 5)
                    .map((submission) => (
                      <div key={submission.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {submission.student_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{submission.student_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {new Date(submission.submitted_at!).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusIcon(submission.status)}
                      </div>
                    ))
                  }
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
              <CardDescription>
                View and manage all student submissions for this assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubmissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {submission.student_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{submission.student_name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getStatusIcon(submission.status)}
                            <Badge variant="outline" className={getStatusColor(submission.status)}>
                              {submission.status.replace('_', ' ')}
                            </Badge>
                            {submission.submitted_at && (
                              <span>• {new Date(submission.submitted_at).toLocaleDateString()}</span>
                            )}
                            {submission.is_late && <span className="text-orange-600">• Late</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {submission.marks_awarded !== null && (
                          <Badge variant="secondary">
                            {submission.marks_awarded}/{assignment.total_marks}
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          {submission.status === 'graded' ? 'Review' : 'Grade'}
                        </Button>
                      </div>
                    </div>
                    
                    {submission.submission_text && (
                      <div className="mt-3 p-3 bg-muted rounded">
                        <p className="text-sm">{submission.submission_text}</p>
                      </div>
                    )}
                    
                    {submission.attachment_urls && submission.attachment_urls.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {submission.attachment_urls.map((url, index) => (
                          <Button key={index} variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {url}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {submission.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Teacher Feedback</span>
                        </div>
                        <p className="text-sm text-blue-700">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grading">
          <GradingInterface 
            assignment={assignment}
            submissions={mockSubmissions}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Analytics</CardTitle>
              <CardDescription>Performance insights and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};