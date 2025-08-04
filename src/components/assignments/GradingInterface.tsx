import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Save, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Star,
  ThumbsUp,
  Eye,
  Mic,
  MicOff,
  Play,
  Pause,
  Bold,
  Italic,
  List,
  Link,
  Download,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { Assignment } from '@/hooks/useAssignmentData';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  status: string;
  submitted_at: string | null;
  submission_text: string | null;
  attachment_urls: string[];
  marks_awarded: number | null;
  feedback: string | null;
  is_late: boolean;
}

interface GradingInterfaceProps {
  assignment: Assignment;
  submissions: Submission[];
}

export const GradingInterface: React.FC<GradingInterfaceProps> = ({
  assignment,
  submissions
}) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'individual' | 'bulk'>('individual');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { grade: string; feedback: string; voiceNote?: string }>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [currentVoiceNote, setCurrentVoiceNote] = useState<string | null>(null);

  // Get submissions that need grading
  const submissionsToGrade = submissions.filter(s => 
    s.status === 'submitted' || s.status === 'late'
  );

  const selectedSubmission = selectedStudent 
    ? submissions.find(s => s.id === selectedStudent)
    : null;

  // Grading scales based on year group
  const getGradingScale = () => {
    const yearNum = parseInt(assignment.year_group.replace('Year ', ''));
    if (yearNum <= 6) {
      return ['WT', 'WA', 'GDS']; // Primary scale: Working Towards, Working At, Greater Depth
    } else {
      return ['9', '8', '7', '6', '5', '4', '3', '2', '1']; // Secondary scale
    }
  };

  const gradingScale = getGradingScale();

  const handleGradeChange = (submissionId: string, field: 'grade' | 'feedback', value: string) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        grade: field === 'grade' ? value : prev[submissionId]?.grade || '',
        feedback: field === 'feedback' ? value : prev[submissionId]?.feedback || ''
      }
    }));
  };

  const handleSaveGrade = async (submissionId: string, returnToStudent = false) => {
    const grade = grades[submissionId];
    if (!grade?.grade) {
      toast({
        title: "Error",
        description: "Please select a grade before saving",
        variant: "destructive"
      });
      return;
    }

    // TODO: Save to database and update gradebook
    const action = returnToStudent ? 'returned' : 'saved as draft';
    toast({
      title: `Grade ${returnToStudent ? 'Returned' : 'Saved'}`,
      description: `Student grade has been ${action}`
    });

    if (returnToStudent) {
      // Update gradebook_records
      console.log('Updating gradebook with:', {
        student_id: submissionId,
        topic_id: assignment.curriculum_topic_id,
        grade_text: grade.grade,
        assessment_type: 'assignment',
        assessment_id: assignment.id
      });
    }
  };

  const handleBulkSave = async (returnSelected = false) => {
    const gradesToSave = Object.keys(grades).filter(id => grades[id]?.grade);
    
    if (gradesToSave.length === 0) {
      toast({
        title: "Error",
        description: "No grades to save",
        variant: "destructive"
      });
      return;
    }

    // TODO: Bulk save to database
    toast({
      title: `${gradesToSave.length} Grades ${returnSelected ? 'Returned' : 'Saved'}`,
      description: `Successfully ${returnSelected ? 'returned' : 'saved'} grades for ${gradesToSave.length} students`
    });
  };

  const quickFeedbackOptions = [
    "Excellent work! Well done.",
    "Good effort. Clear explanations.",
    "Well structured answer.",
    "Good work, but check your calculations.",
    "Please show more working out.",
    "Remember to check your answers.",
    "Great improvement from last time!",
    "Try using examples to explain your thinking."
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast({
        title: "Voice Note Saved",
        description: "Voice feedback has been attached to the grade"
      });
    } else {
      // Start recording
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak your feedback now..."
      });
    }
  };

  if (submissionsToGrade.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grading Complete</CardTitle>
          <CardDescription>All submissions have been graded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">No submissions pending grading</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">📋 Grade: {assignment.title}</h2>
          <p className="text-muted-foreground">
            {submissionsToGrade.length} submission{submissionsToGrade.length !== 1 ? 's' : ''} to grade
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'individual' ? 'default' : 'outline'}
            onClick={() => setViewMode('individual')}
          >
            Individual
          </Button>
          <Button 
            variant={viewMode === 'bulk' ? 'default' : 'outline'}
            onClick={() => setViewMode('bulk')}
          >
            Bulk Grade
          </Button>
        </div>
      </div>

      {viewMode === 'individual' ? (
        /* Individual Grading View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Students to Grade</h3>
            {submissionsToGrade.map((submission) => (
              <Card 
                key={submission.id}
                className={`cursor-pointer transition-colors ${
                  selectedStudent === submission.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedStudent(submission.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {submission.student_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{submission.student_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {submission.submitted_at ? formatDateTime(submission.submitted_at) : 'Not submitted'}
                      </p>
                      {grades[submission.id]?.grade && (
                        <Badge variant="secondary" className="mt-1">
                          {grades[submission.id].grade}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Individual Grading Panel */}
          {selectedSubmission && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Grade: {selectedSubmission.student_name}
                  </CardTitle>
                  <CardDescription>
                    Assignment: {assignment.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Submission Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        📎 <strong>Submitted:</strong> {selectedSubmission.submitted_at ? formatDateTime(selectedSubmission.submitted_at) : 'Not submitted'}
                      </span>
                      {selectedSubmission.is_late && (
                        <Badge variant="destructive">Late</Badge>
                      )}
                    </div>
                    
                    {selectedSubmission.attachment_urls.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">📄 Attachments:</p>
                        {selectedSubmission.attachment_urls.map((url, index) => (
                          <Button key={index} variant="outline" size="sm" className="mr-2">
                            <FileText className="h-4 w-4 mr-2" />
                            {url} [ View ]
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {selectedSubmission.submission_text && (
                      <div>
                        <p className="text-sm font-medium mb-2">📝 Student Response:</p>
                        <div className="p-4 bg-muted rounded border-l-4 border-blue-500">
                          <p className="text-sm italic">"{selectedSubmission.submission_text}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Grading Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade">🎯 Grade:</Label>
                        <Select 
                          value={grades[selectedSubmission.id]?.grade || ''}
                          onValueChange={(value) => 
                            handleGradeChange(selectedSubmission.id, 'grade', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select grade (${gradingScale.join('/')})`} />
                          </SelectTrigger>
                          <SelectContent>
                            {gradingScale.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>🎤 Voice Note (Optional):</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={isRecording ? "destructive" : "outline"}
                            size="sm"
                            onClick={handleVoiceRecording}
                          >
                            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            {isRecording ? 'Stop' : 'Record'}
                          </Button>
                          {currentVoiceNote && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                              Play
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feedback">💬 Feedback:</Label>
                      <div className="space-y-2">
                        {/* Rich Text Toolbar */}
                        <div className="flex gap-1 border-b pb-2">
                          <Button variant="ghost" size="sm">
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <List className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Textarea
                          id="feedback"
                          placeholder="Enter detailed feedback for the student..."
                          value={grades[selectedSubmission.id]?.feedback || ''}
                          onChange={(e) => 
                            handleGradeChange(selectedSubmission.id, 'feedback', e.target.value)
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    {/* Quick Feedback Options */}
                    <div className="space-y-2">
                      <Label>Quick Feedback:</Label>
                      <div className="flex flex-wrap gap-2">
                        {quickFeedbackOptions.slice(0, 4).map((feedback, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => 
                              handleGradeChange(selectedSubmission.id, 'feedback', feedback)
                            }
                          >
                            {feedback.split('.')[0]}...
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleSaveGrade(selectedSubmission.id, false)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button 
                      onClick={() => handleSaveGrade(selectedSubmission.id, true)}
                      disabled={!grades[selectedSubmission.id]?.grade}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Return to Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* Bulk Grading View */
        <Card>
          <CardHeader>
            <CardTitle>📋 Bulk Grade: {assignment.title}</CardTitle>
            <CardDescription>
              Grade multiple students quickly using the table below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsToGrade.map((submission) => {
                  const currentGrade = grades[submission.id] || { grade: '', feedback: '' };
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {submission.student_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{submission.student_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {submission.submitted_at ? formatDateTime(submission.submitted_at) : 'Not submitted'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Select 
                          value={currentGrade.grade}
                          onValueChange={(value) => 
                            handleGradeChange(submission.id, 'grade', value)
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradingScale.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-2">
                          <Input
                            placeholder="Quick feedback..."
                            value={currentGrade.feedback}
                            onChange={(e) => 
                              handleGradeChange(submission.id, 'feedback', e.target.value)
                            }
                            className="text-sm"
                          />
                          <div className="flex gap-1">
                            {quickFeedbackOptions.slice(0, 2).map((feedback, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => 
                                  handleGradeChange(submission.id, 'feedback', feedback)
                                }
                              >
                                {feedback.split(' ').slice(0, 2).join(' ')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStudent(submission.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {submission.attachment_urls.length > 0 && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Bulk Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button 
                variant="outline"
                onClick={() => handleBulkSave(false)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
              <Button 
                onClick={() => handleBulkSave(true)}
                disabled={Object.keys(grades).filter(id => grades[id]?.grade).length === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Return Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Grading Modal */}
      {selectedStudent && viewMode === 'bulk' && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Grade: {selectedSubmission?.student_name}
              </DialogTitle>
              <DialogDescription>
                View submission details and provide detailed feedback
              </DialogDescription>
            </DialogHeader>
            
            {selectedSubmission && (
              <div className="space-y-4">
                {/* Submission content */}
                {selectedSubmission.submission_text && (
                  <div>
                    <h4 className="font-medium mb-2">Student Response</h4>
                    <div className="p-4 bg-muted rounded">
                      <p className="text-sm whitespace-pre-wrap">{selectedSubmission.submission_text}</p>
                    </div>
                  </div>
                )}
                
                {selectedSubmission.attachment_urls.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {selectedSubmission.attachment_urls.map((url, index) => (
                        <Button key={index} variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          {url}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};