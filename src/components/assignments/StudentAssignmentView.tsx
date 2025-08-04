import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Timer,
  BookOpen,
  MessageSquare,
  Download,
  Save,
  Send
} from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useRBAC } from '@/hooks/useRBAC';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const StudentAssignmentView = () => {
  const { currentSchool } = useRBAC();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { assignments } = useAssignmentData(currentSchool?.id);
  const { toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, { text: string; files: File[] }>>({});

  // Mock student assignments - filter for student's assignments
  const studentAssignments = assignments.map(assignment => ({
    ...assignment,
    // Mock submission status for each assignment
    submissionStatus: Math.random() > 0.5 ? 'submitted' : 'not_submitted',
    grade: Math.random() > 0.7 ? Math.floor(Math.random() * assignment.total_marks) : null,
    feedback: Math.random() > 0.8 ? "Good work! Keep it up." : null,
    submittedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null
  }));

  const upcomingAssignments = studentAssignments.filter(a => 
    new Date(a.due_date) > new Date() && a.submissionStatus === 'not_submitted'
  ).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const overdueAssignments = studentAssignments.filter(a => 
    new Date(a.due_date) < new Date() && a.submissionStatus === 'not_submitted'
  );

  const completedAssignments = studentAssignments.filter(a => 
    a.submissionStatus === 'submitted'
  );

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

  const handleSubmissionChange = (assignmentId: string, field: 'text' | 'files', value: string | File[]) => {
    setSubmissions(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        text: field === 'text' ? value as string : prev[assignmentId]?.text || '',
        files: field === 'files' ? value as File[] : prev[assignmentId]?.files || []
      }
    }));
  };

  const handleFileUpload = (assignmentId: string, files: FileList) => {
    const fileArray = Array.from(files);
    handleSubmissionChange(assignmentId, 'files', fileArray);
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    const submission = submissions[assignmentId];
    if (!submission?.text && (!submission?.files || submission.files.length === 0)) {
      toast({
        title: "Error",
        description: "Please add some content or files before submitting",
        variant: "destructive"
      });
      return;
    }

    // TODO: Submit to database
    toast({
      title: "Assignment Submitted",
      description: "Your assignment has been submitted successfully"
    });

    setSelectedAssignment(null);
  };

  const selectedAssignmentData = selectedAssignment 
    ? studentAssignments.find(a => a.id === selectedAssignment)
    : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground">Track and submit your homework</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Timer className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent - Due Soon */}
          {upcomingAssignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-yellow-600" />
                  Due Soon
                </CardTitle>
                <CardDescription>
                  {upcomingAssignments.length} assignment{upcomingAssignments.length !== 1 ? 's' : ''} due in the next week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAssignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <Badge variant="outline" className={getStatusColor(assignment)}>
                            {getStatusText(assignment)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDueDate(assignment.due_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {assignment.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {assignment.total_marks} marks
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => navigate(`/academics/assignments/${assignment.id}/submit`)}
                        variant={assignment.submissionStatus === 'submitted' ? 'outline' : 'default'}
                      >
                        {assignment.submissionStatus === 'submitted' ? 'View Submission' : 'Submit Work'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Overdue */}
          {overdueAssignments.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Overdue
                </CardTitle>
                <CardDescription>
                  {overdueAssignments.length} assignment{overdueAssignments.length !== 1 ? 's' : ''} past due date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {overdueAssignments.map((assignment) => (
                  <div key={assignment.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-red-800">{assignment.title}</h3>
                          <Badge variant="destructive">Overdue</Badge>
                        </div>
                        <p className="text-sm text-red-700 mb-2">{assignment.description}</p>
                        <div className="flex items-center gap-4 text-sm text-red-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDueDate(assignment.due_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {assignment.subject}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setSelectedAssignment(assignment.id)}
                        variant="destructive"
                      >
                        Submit Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* All Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>Complete assignment history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentAssignments.map((assignment) => (
                <div key={assignment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
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
                            {assignment.grade}/{assignment.total_marks}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDueDate(assignment.due_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {assignment.subject}
                        </span>
                        {assignment.submittedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Submitted {new Date(assignment.submittedAt).toLocaleDateString()}
                          </span>
                        )}
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
                    <Button 
                      onClick={() => setSelectedAssignment(assignment.id)}
                      variant="outline"
                      size="sm"
                    >
                      {assignment.submissionStatus === 'submitted' ? 'View' : 'Work on it'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Assignments Completed</span>
                  <span>{completedAssignments.length}/{studentAssignments.length}</span>
                </div>
                <Progress value={(completedAssignments.length / studentAssignments.length) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>On Time Submissions</span>
                  <span>85%</span>
                </div>
                <Progress value={85} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Download All Feedback
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Teacher
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission Modal */}
      {selectedAssignmentData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedAssignmentData.title}</CardTitle>
                  <CardDescription>
                    {selectedAssignmentData.subject} • {formatDueDate(selectedAssignmentData.due_date)}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Assignment Details */}
              <div>
                <h3 className="font-semibold mb-2">Assignment Description</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedAssignmentData.description}</p>
                
                {selectedAssignmentData.instructions && (
                  <>
                    <h4 className="font-medium mb-2">Instructions</h4>
                    <p className="text-sm text-muted-foreground mb-4">{selectedAssignmentData.instructions}</p>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Due Date:</strong> {new Date(selectedAssignmentData.due_date).toLocaleString()}
                  </div>
                  <div>
                    <strong>Total Marks:</strong> {selectedAssignmentData.total_marks}
                  </div>
                  <div>
                    <strong>Submission Type:</strong> {selectedAssignmentData.submission_type.replace('_', ' ')}
                  </div>
                  <div>
                    <strong>Late Submissions:</strong> {selectedAssignmentData.allow_late_submissions ? 'Allowed' : 'Not allowed'}
                  </div>
                </div>
              </div>

              {/* Submission Form */}
              {selectedAssignmentData.submissionStatus === 'not_submitted' && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold">Submit Your Work</h3>
                  
                  {(selectedAssignmentData.submission_type === 'text_entry' || selectedAssignmentData.submission_type === 'both') && (
                    <div className="space-y-2">
                      <Label htmlFor="submission-text">Your Response</Label>
                      <Textarea
                        id="submission-text"
                        placeholder="Type your answer here..."
                        value={submissions[selectedAssignmentData.id]?.text || ''}
                        onChange={(e) => handleSubmissionChange(selectedAssignmentData.id, 'text', e.target.value)}
                        rows={8}
                      />
                    </div>
                  )}
                  
                  {(selectedAssignmentData.submission_type === 'file_upload' || selectedAssignmentData.submission_type === 'both') && (
                    <div className="space-y-2">
                      <Label htmlFor="submission-files">Upload Files</Label>
                      <Input
                        id="submission-files"
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(selectedAssignmentData.id, e.target.files)}
                      />
                      {submissions[selectedAssignmentData.id]?.files && submissions[selectedAssignmentData.id].files.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">Selected files:</p>
                          {submissions[selectedAssignmentData.id].files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleSubmitAssignment(selectedAssignmentData.id)}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                </div>
              )}

              {/* Already Submitted */}
              {selectedAssignmentData.submissionStatus === 'submitted' && (
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Assignment Submitted</h3>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-2">
                      Submitted on {selectedAssignmentData.submittedAt ? new Date(selectedAssignmentData.submittedAt).toLocaleString() : 'Unknown date'}
                    </p>
                    
                    {selectedAssignmentData.grade !== null ? (
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          Grade: {selectedAssignmentData.grade}/{selectedAssignmentData.total_marks}
                        </Badge>
                        {selectedAssignmentData.feedback && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700">{selectedAssignmentData.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-green-600">Awaiting teacher feedback</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};