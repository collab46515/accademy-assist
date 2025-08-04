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
import { 
  Save, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Star,
  ThumbsUp,
  Eye
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
  const [grades, setGrades] = useState<Record<string, { marks: number | null; feedback: string }>>({});
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get submissions that need grading
  const submissionsToGrade = submissions.filter(s => 
    s.status === 'submitted' || s.status === 'late'
  );

  const handleGradeChange = (submissionId: string, marks: number | null, feedback: string) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: { marks, feedback }
    }));
  };

  const handleSaveGrade = async (submissionId: string) => {
    const grade = grades[submissionId];
    if (!grade) return;

    // TODO: Save to database
    toast({
      title: "Grade Saved",
      description: "Student grade has been saved successfully"
    });
  };

  const handleSaveAllGrades = async () => {
    // TODO: Bulk save all grades
    toast({
      title: "All Grades Saved",
      description: `Saved grades for ${Object.keys(grades).length} students`
    });
  };

  const selectedSubmission = selectedStudent 
    ? submissions.find(s => s.id === selectedStudent)
    : null;

  // Grading scale options (could be configurable)
  const gradingScales = {
    percentage: Array.from({ length: 21 }, (_, i) => i * 5),
    gcse: ['9', '8', '7', '6', '5', '4', '3', '2', '1'],
    primary: ['GDS', 'WA', 'WT', 'BWT']
  };

  const getGradeOptions = () => {
    // For now, use percentage based on total marks
    return Array.from({ length: assignment.total_marks + 1 }, (_, i) => i);
  };

  const quickFeedbackOptions = [
    "Excellent work! Well done.",
    "Good effort. Nice explanations.",
    "Well structured answer.",
    "Good work, but check your calculations.",
    "Please show more working out.",
    "Remember to check your answers.",
    "Great improvement from last time!",
    "Clear explanations throughout."
  ];

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
          <h2 className="text-xl font-semibold">Grade Submissions</h2>
          <p className="text-muted-foreground">
            {submissionsToGrade.length} submission{submissionsToGrade.length !== 1 ? 's' : ''} pending grading
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button onClick={handleSaveAllGrades} disabled={Object.keys(grades).length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save All Grades
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {submissionsToGrade.map((submission) => {
            const currentGrade = grades[submission.id] || { marks: submission.marks_awarded, feedback: submission.feedback || '' };
            
            return (
              <Card key={submission.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {submission.student_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{submission.student_name}</CardTitle>
                        <CardDescription>
                          Submitted {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'Not submitted'}
                          {submission.is_late && <Badge variant="destructive" className="ml-2">Late</Badge>}
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedStudent(submission.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Submission Preview */}
                  {submission.submission_text && (
                    <div className="p-3 bg-muted rounded text-sm">
                      <p className="line-clamp-3">{submission.submission_text}</p>
                    </div>
                  )}
                  
                  {submission.attachment_urls.length > 0 && (
                    <div className="flex gap-2">
                      {submission.attachment_urls.map((url, index) => (
                        <Button key={index} variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          {url}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Grading Controls */}
                  <div className="space-y-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`marks-${submission.id}`}>Marks</Label>
                        <Select 
                          value={currentGrade.marks?.toString() || ''}
                          onValueChange={(value) => 
                            handleGradeChange(submission.id, parseInt(value), currentGrade.feedback)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {getGradeOptions().map((mark) => (
                              <SelectItem key={mark} value={mark.toString()}>
                                {mark}/{assignment.total_marks}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          onClick={() => handleSaveGrade(submission.id)}
                          disabled={!currentGrade.marks}
                          className="w-full"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`feedback-${submission.id}`}>Feedback</Label>
                      <Textarea
                        id={`feedback-${submission.id}`}
                        placeholder="Enter feedback for the student..."
                        value={currentGrade.feedback}
                        onChange={(e) => 
                          handleGradeChange(submission.id, currentGrade.marks, e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                    
                    {/* Quick Feedback */}
                    <div className="flex flex-wrap gap-1">
                      {quickFeedbackOptions.slice(0, 3).map((feedback, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => 
                            handleGradeChange(submission.id, currentGrade.marks, feedback)
                          }
                        >
                          {feedback.split('.')[0]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {submissionsToGrade.map((submission, index) => {
                const currentGrade = grades[submission.id] || { marks: submission.marks_awarded, feedback: submission.feedback || '' };
                
                return (
                  <div key={submission.id} className={`p-4 ${index !== submissionsToGrade.length - 1 ? 'border-b' : ''}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {submission.student_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{submission.student_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'Not submitted'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                        <Select 
                          value={currentGrade.marks?.toString() || ''}
                          onValueChange={(value) => 
                            handleGradeChange(submission.id, parseInt(value), currentGrade.feedback)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {getGradeOptions().map((mark) => (
                              <SelectItem key={mark} value={mark.toString()}>
                                {mark}/{assignment.total_marks}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          placeholder="Quick feedback..."
                          value={currentGrade.feedback}
                          onChange={(e) => 
                            handleGradeChange(submission.id, currentGrade.marks, e.target.value)
                          }
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedStudent(submission.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleSaveGrade(submission.id)}
                          disabled={!currentGrade.marks}
                          size="sm"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed View Modal/Sidebar would go here */}
      {selectedSubmission && (
        <Card className="fixed inset-4 lg:inset-x-1/4 lg:inset-y-8 z-50 overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedSubmission.student_name}'s Submission</CardTitle>
              <CardDescription>
                Submitted {selectedSubmission.submitted_at ? new Date(selectedSubmission.submitted_at).toLocaleDateString() : 'Not submitted'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Close
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};