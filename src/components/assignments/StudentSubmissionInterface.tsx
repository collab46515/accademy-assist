import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  Download,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  User,
  BookOpen
} from 'lucide-react';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, parseISO, isPast, format } from 'date-fns';

interface SubmissionDraft {
  text_response: string;
  uploaded_files: File[];
  last_saved: string;
}

export function StudentSubmissionInterface() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assignments, submissions, updateSubmission, getSubmissionByAssignmentId } = useAssignmentData();
  
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [textResponse, setTextResponse] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLateWarning, setShowLateWarning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Find assignment and submission
  useEffect(() => {
    if (id && assignments.length > 0) {
      const foundAssignment = assignments.find(a => a.id === id);
      setAssignment(foundAssignment);
      
      if (foundAssignment) {
        const existingSubmission = getSubmissionByAssignmentId(id);
        setSubmission(existingSubmission);
        
        // Load draft if exists
        if (existingSubmission?.submission_text) {
          setTextResponse(existingSubmission.submission_text);
        }
      }
    }
  }, [id, assignments, getSubmissionByAssignmentId]);

  // Auto-save draft every 2 minutes
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (textResponse || uploadedFiles.length > 0) {
        saveDraft();
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(autoSave);
  }, [textResponse, uploadedFiles]);

  const saveDraft = useCallback(async () => {
    if (!assignment) return;
    
    setIsDraftSaving(true);
    try {
      await updateSubmission(assignment.id, {
        submission_text: textResponse,
        status: textResponse || uploadedFiles.length > 0 ? 'in_progress' : 'not_submitted'
      });
      
      setLastSaved(new Date());
      toast({
        title: "Draft saved",
        description: "Your progress has been saved automatically.",
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsDraftSaving(false);
    }
  }, [assignment, textResponse, uploadedFiles, updateSubmission, toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!assignment) return;
    
    const dueDate = parseISO(assignment.due_date);
    const isLate = isPast(dueDate);
    
    if (isLate && !assignment.allow_late_submissions) {
      toast({
        title: "Submission not allowed",
        description: "Late submissions are not permitted for this assignment.",
        variant: "destructive"
      });
      return;
    }
    
    if (isLate && assignment.allow_late_submissions) {
      setShowLateWarning(true);
      return;
    }
    
    await submitAssignment();
  };

  const submitAssignment = async () => {
    if (!assignment) return;
    
    setIsSubmitting(true);
    try {
      const dueDate = parseISO(assignment.due_date);
      const isLate = isPast(dueDate);
      
      await updateSubmission(assignment.id, {
        submission_text: textResponse,
        submitted_at: new Date().toISOString(),
        status: isLate ? 'late' : 'submitted',
        is_late: isLate
      });
      
      toast({
        title: "Assignment submitted!",
        description: isLate ? "Your late submission has been recorded." : "Your assignment has been submitted successfully.",
      });
      
      navigate('/portals/student');
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setShowLateWarning(false);
    }
  };

  if (!assignment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading assignment...</p>
        </div>
      </div>
    );
  }

  const dueDate = parseISO(assignment.due_date);
  const isOverdue = isPast(dueDate);
  const timeUntilDue = formatDistanceToNow(dueDate, { addSuffix: true });
  const isSubmitted = submission?.status === 'submitted' || submission?.status === 'graded' || submission?.status === 'late';
  const isInProgress = submission?.status === 'in_progress';

  const getStatusInfo = () => {
    if (isSubmitted) {
      return {
        icon: CheckCircle,
        text: `Submitted on ${format(parseISO(submission.submitted_at), 'MMM d, yyyy \'at\' h:mm a')}`,
        color: 'text-green-600'
      };
    }
    if (isInProgress) {
      return {
        icon: Clock,
        text: 'In Progress',
        color: 'text-orange-600'
      };
    }
    return {
      icon: FileText,
      text: 'Not Started',
      color: 'text-muted-foreground'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/portals/student')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground">{assignment.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {assignment.year_group} | {assignment.subject}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {format(dueDate, 'MMM d, yyyy \'at\' h:mm a')}
                </div>
                <div className="flex items-center gap-1">
                  <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                  <span className={statusInfo.color}>{statusInfo.text}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            {isOverdue && !isSubmitted && (
              <Badge variant="destructive" className="mb-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
            {!isOverdue && !isSubmitted && (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {timeUntilDue}
              </Badge>
            )}
          </div>
        </div>

        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{assignment.description}</p>
              </div>
            )}
            
            {assignment.instructions && (
              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <p className="text-muted-foreground leading-relaxed">{assignment.instructions}</p>
              </div>
            )}

            {assignment.attachment_urls && assignment.attachment_urls.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Attachments</h4>
                <div className="space-y-2">
                  {assignment.attachment_urls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm">{url.split('/').pop() || 'Download file'}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Interface */}
        {!isSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Your Submission
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Save your progress — you can come back later to finish.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Response */}
              {(assignment.submission_type === 'text_entry' || assignment.submission_type === 'both') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Response {assignment.submission_type === 'both' && '(Optional)'}
                  </label>
                  <Textarea
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    placeholder="You can type your answer here if required..."
                    className="min-h-[120px] resize-none"
                    disabled={isSubmitting || isDraftSaving}
                  />
                </div>
              )}

              {/* File Upload */}
              {(assignment.submission_type === 'file_upload' || assignment.submission_type === 'both') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    File Upload {assignment.submission_type === 'both' && '(Optional)'}
                  </label>
                  
                  <div className="border border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      onChange={handleFileUpload}
                      disabled={isSubmitting || isDraftSaving}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Files
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepted: PDF, JPG, PNG, DOCX (max 10MB each)
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-lg">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {lastSaved && (
                    <p className="text-xs text-muted-foreground">
                      Last saved: {format(lastSaved, 'h:mm a')}
                    </p>
                  )}
                  {isDraftSaving && (
                    <p className="text-xs text-orange-600">Saving...</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isDraftSaving || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isDraftSaving || (!textResponse && uploadedFiles.length === 0)}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submitted View */}
        {isSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Assignment Submitted
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your assignment was submitted on {format(parseISO(submission.submitted_at), 'MMM d, yyyy \'at\' h:mm a')}.
                {submission.is_late && " This was a late submission."}
              </p>
              
              {submission.submission_text && (
                <div>
                  <h4 className="font-medium mb-2">Your Response</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{submission.submission_text}</p>
                  </div>
                </div>
              )}

              {submission.feedback && (
                <div>
                  <h4 className="font-medium mb-2">Teacher Feedback</h4>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm">{submission.feedback}</p>
                    {submission.marks_awarded && (
                      <p className="text-sm font-medium mt-2">
                        Grade: {submission.marks_awarded}/{assignment.total_marks}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Late Warning Modal */}
        {showLateWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Late Submission Warning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This assignment is past its due date. Are you sure you want to submit it as a late submission?
                  {assignment.late_penalty_percentage && (
                    <span className="block mt-2 font-medium">
                      Note: A {assignment.late_penalty_percentage}% penalty may be applied.
                    </span>
                  )}
                </p>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowLateWarning(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitAssignment}
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Yes, Submit Late
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}