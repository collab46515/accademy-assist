import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  GraduationCap,
  Target,
  User,
  FileDown,
  Mail,
  BookOpen,
  Eye,
  Edit,
  X,
  Circle
} from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { GradingInterface } from './GradingInterface';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignments } = useAssignmentData();
  const [showGrading, setShowGrading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

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

  // Enhanced assignment metadata to match spec
  const assignmentMeta = {
    ...assignment,
    class: 'Year 4A',
    topic_name: 'Recognise equivalent fractions',
    created_by_name: 'Mr. Ade',
    created_date: '2025-03-07',
    attachment_urls: ['fractions-worksheet.pdf'],
    lesson_plan_title: 'Lesson on Equivalent Fractions' // If created from lesson plan
  };

  // Enhanced mock submission data to match the spec exactly
  const mockSubmissions = [
    {
      id: '1',
      student_id: 'student-1',
      student_name: 'Ada Nwosu',
      status: 'submitted',
      submitted_at: '2025-04-08T09:12:00Z',
      submission_text: 'I have completed all the fraction exercises using fraction walls.',
      attachment_urls: ['ada_fractions.pdf'],
      marks_awarded: null,
      feedback: null,
      is_late: false
    },
    {
      id: '2',
      student_id: 'student-2',
      student_name: 'Tunde Okon',
      status: 'submitted',
      submitted_at: '2025-04-08T10:05:00Z',
      submission_text: 'Here is my completed worksheet.',
      attachment_urls: ['tunde_work.pdf'],
      marks_awarded: null,
      feedback: null,
      is_late: false
    },
    {
      id: '3',
      student_id: 'student-3',
      student_name: 'Chinedu Okeke',
      status: 'in_progress',
      submitted_at: null,
      submission_text: null,
      attachment_urls: [],
      marks_awarded: null,
      feedback: null,
      is_late: false
    },
    {
      id: '4',
      student_id: 'student-4',
      student_name: 'Bisi Adebayo',
      status: 'not_submitted',
      submitted_at: null,
      submission_text: null,
      attachment_urls: [],
      marks_awarded: null,
      feedback: null,
      is_late: false
    },
    {
      id: '5',
      student_id: 'student-5',
      student_name: 'Kemi Okafor',
      status: 'late',
      submitted_at: '2025-04-09T14:30:00Z',
      submission_text: 'Sorry for late submission. Here is my work.',
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
      case 'in_progress':
        return <Circle className="h-4 w-4 text-orange-500" />;
      case 'late':
        return <Timer className="h-4 w-4 text-red-600" />;
      case 'not_submitted':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return '✅ Submitted';
      case 'graded':
        return '✅ Graded';
      case 'in_progress':
        return '🟠 In Progress';
      case 'late':
        return '⏳ Late';
      case 'not_submitted':
        return '❌ Not Started';
      default:
        return status;
    }
  };

  const submissionStats = {
    total: 32, // Total students in class
    submitted: mockSubmissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
    graded: mockSubmissions.filter(s => s.status === 'graded').length,
    notSubmitted: mockSubmissions.filter(s => s.status === 'not_submitted').length,
    late: mockSubmissions.filter(s => s.is_late).length,
    inProgress: mockSubmissions.filter(s => s.status === 'in_progress').length
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendReminder = (studentIds?: string[]) => {
    // TODO: Implement reminder functionality
    console.log('Sending reminder to:', studentIds || 'all late students');
  };

  const handleExportSubmissions = () => {
    // TODO: Implement export functionality
    console.log('Exporting submissions as ZIP');
  };

  const handleCloseAssignment = () => {
    // TODO: Implement close assignment functionality
    console.log('Closing assignment - no more submissions allowed');
  };

  if (showGrading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setShowGrading(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignment Details
          </Button>
        </div>
        <GradingInterface 
          assignment={assignment}
          submissions={mockSubmissions}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/academics/assignments')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
        </div>
      </div>

      {/* Assignment Header - Matching the spec format */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">📌 Assignment: {assignmentMeta.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <span><strong>Class:</strong> {assignmentMeta.class}</span>
                  <span>|</span>
                  <span><strong>Subject:</strong> {assignmentMeta.subject}</span>
                  <span>|</span>
                  <Button variant="link" className="h-auto p-0 text-sm text-blue-600">
                    <strong>Topic:</strong> {assignmentMeta.topic_name}
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span><strong>Due:</strong> {new Date(assignmentMeta.due_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>|</span>
                  <Badge variant="secondary">{assignmentMeta.status}</Badge>
                  <span>|</span>
                  <span><strong>Submissions:</strong> {submissionStats.submitted}/{submissionStats.total} ({Math.round((submissionStats.submitted / submissionStats.total) * 100)}%)</span>
                </div>
              </div>
            </div>
            
            <hr className="border-muted" />
            
            {/* Description Section */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">📝 Description</h3>
                <p className="text-sm text-muted-foreground mt-1">{assignmentMeta.description}</p>
                {assignmentMeta.attachment_urls && assignmentMeta.attachment_urls.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm"><strong>Attachment:</strong></span>
                    {assignmentMeta.attachment_urls.map((url, index) => (
                      <Button key={index} variant="link" className="h-auto p-0 ml-2 text-blue-600">
                        [ {url} ]
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>📅 <strong>Created:</strong> {assignmentMeta.created_date}</span>
                <span>|</span>
                <span><strong>By:</strong> {assignmentMeta.created_by_name}</span>
                {assignmentMeta.lesson_plan_title && (
                  <>
                    <span>|</span>
                    <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                      Created from: {assignmentMeta.lesson_plan_title}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Student Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Student Submissions ({submissionStats.submitted}/{submissionStats.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {submission.student_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{submission.student_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <span className="text-sm">{getStatusText(submission.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {submission.submitted_at ? formatDateTime(submission.submitted_at) : '—'}
                  </TableCell>
                  <TableCell>
                    {submission.status === 'submitted' || submission.status === 'late' ? (
                      <Button variant="outline" size="sm">
                        [ Grade ]
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendReminder([submission.student_id])}
                      >
                        [ Send Reminder ]
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowGrading(true)}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Grade All
            </Button>
            <Button variant="outline" onClick={handleExportSubmissions}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Submissions
            </Button>
            <Button variant="outline" onClick={() => handleSendReminder()}>
              <Mail className="h-4 w-4 mr-2" />
              Send Reminder to All Late
            </Button>
            <Button variant="outline" onClick={handleCloseAssignment}>
              <X className="h-4 w-4 mr-2" />
              Close Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};