import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  FileText,
  Mail,
  Download,
  AlertCircle,
  Edit
} from 'lucide-react';

interface Assessment {
  id: string;
  application_id: string;
  student_name: string;
  assessment_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  location: string;
  assessor: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
  notes?: string;
  result?: string;
  score?: number;
}

interface AssessmentManagerProps {
  applicationId?: string;
}

export function AssessmentManager({ applicationId }: AssessmentManagerProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [letterDialogOpen, setLetterDialogOpen] = useState(false);
  
  // Form states
  const [assessmentType, setAssessmentType] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [assessor, setAssessor] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState('');
  const [letterType, setLetterType] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
  }, [applicationId]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // In a real implementation, you'd fetch from an assessments table
      // For now, we'll use mock data or application-based data
      setAssessments([
        {
          id: '1',
          application_id: applicationId || 'mock',
          student_name: 'Emma Thompson',
          assessment_type: 'Academic Assessment',
          scheduled_date: '2024-01-15',
          scheduled_time: '09:00',
          duration: 120,
          location: 'Assessment Room A',
          assessor: 'Dr. Sarah Wilson',
          status: 'scheduled',
          notes: 'Standard academic assessment for Year 7 entry'
        },
        {
          id: '2',
          application_id: applicationId || 'mock',
          student_name: 'James Chen',
          assessment_type: 'Personal Interview',
          scheduled_date: '2024-01-16',
          scheduled_time: '11:00',
          duration: 60,
          location: 'Head Teacher Office',
          assessor: 'Mrs. Elizabeth Brown',
          status: 'completed',
          result: 'Excellent communication skills and motivation',
          score: 85
        }
      ]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduleAssessment = async () => {
    if (!assessmentType || !scheduledDate || !scheduledTime || !assessor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newAssessment: Assessment = {
        id: Date.now().toString(),
        application_id: applicationId || 'new',
        student_name: 'New Student', // This would come from the application
        assessment_type: assessmentType,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        duration: parseInt(duration),
        location: location || 'TBD',
        assessor: assessor,
        status: 'scheduled',
        notes: notes
      };

      setAssessments(prev => [...prev, newAssessment]);
      
      // In a real implementation, save to database
      if (applicationId) {
        const { error } = await supabase
          .from('enrollment_applications')
          .update({ 
            status: 'assessment_scheduled',
            last_activity_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        if (error) throw error;
      }

      toast({
        title: "Assessment Scheduled",
        description: `${assessmentType} has been scheduled for ${scheduledDate} at ${scheduledTime}`,
      });
      
      // Reset form
      setAssessmentType('');
      setScheduledDate('');
      setScheduledTime('');
      setDuration('60');
      setLocation('');
      setAssessor('');
      setNotes('');
      setScheduleDialogOpen(false);
    } catch (error) {
      console.error('Error scheduling assessment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule assessment",
        variant: "destructive"
      });
    }
  };

  const completeAssessment = async () => {
    if (!selectedAssessment || !result) {
      toast({
        title: "Error",
        description: "Please provide assessment results",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedAssessment = {
        ...selectedAssessment,
        status: 'completed' as const,
        result: result,
        score: score ? parseInt(score) : undefined
      };

      setAssessments(prev => 
        prev.map(assessment => 
          assessment.id === selectedAssessment.id ? updatedAssessment : assessment
        )
      );

      // Update application status if this was the last required assessment
      if (applicationId) {
        const { error } = await supabase
          .from('enrollment_applications')
          .update({ 
            status: 'assessment_complete',
            last_activity_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        if (error) throw error;
      }

      toast({
        title: "Assessment Completed",
        description: "Assessment results have been recorded successfully",
      });
      
      setResult('');
      setScore('');
      setCompleteDialogOpen(false);
      setSelectedAssessment(null);
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error",
        description: "Failed to complete assessment",
        variant: "destructive"
      });
    }
  };

  const generateLetter = async () => {
    if (!selectedAssessment || !letterType) {
      toast({
        title: "Error",
        description: "Please select a letter type",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate letter generation
      const letterData = {
        type: letterType,
        student_name: selectedAssessment.student_name,
        assessment_type: selectedAssessment.assessment_type,
        assessment_date: selectedAssessment.scheduled_date,
        result: selectedAssessment.result,
        score: selectedAssessment.score,
        generated_at: new Date().toISOString()
      };

      toast({
        title: "Letter Generated",
        description: `${letterType.replace('_', ' ')} letter has been generated successfully`,
      });
      
      setLetterType('');
      setLetterDialogOpen(false);
      setSelectedAssessment(null);
    } catch (error) {
      console.error('Error generating letter:', error);
      toast({
        title: "Error",
        description: "Failed to generate letter",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rescheduled': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Assessment Management</h3>
          <p className="text-muted-foreground">Schedule and manage student assessments</p>
        </div>
        <Button onClick={() => setScheduleDialogOpen(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Assessment
        </Button>
      </div>

      {/* Assessment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {assessments.filter(a => a.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {assessments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {assessments.filter(a => a.status === 'rescheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Rescheduled</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {assessments.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {assessments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assessments Scheduled</h3>
              <p className="text-muted-foreground">Schedule assessments to track student progress</p>
            </CardContent>
          </Card>
        ) : (
          assessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{assessment.student_name}</h4>
                      <Badge className={getStatusColor(assessment.status)}>
                        {getStatusIcon(assessment.status)}
                        <span className="ml-1">{assessment.status}</span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{assessment.assessment_type}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {assessment.status === 'scheduled' && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedAssessment(assessment);
                          setCompleteDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {assessment.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedAssessment(assessment);
                          setLetterDialogOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Letter
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(assessment.scheduled_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.scheduled_time} ({assessment.duration}min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{assessment.assessor}</span>
                  </div>
                </div>

                {assessment.result && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-green-800">Assessment Result</p>
                        <p className="text-sm text-green-700">{assessment.result}</p>
                      </div>
                      {assessment.score && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Score: {assessment.score}%
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Schedule Assessment Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Assessment</DialogTitle>
            <DialogDescription>
              Create a new assessment appointment for the student
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Assessment Type</label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Assessment</SelectItem>
                  <SelectItem value="interview">Personal Interview</SelectItem>
                  <SelectItem value="entrance_exam">Entrance Examination</SelectItem>
                  <SelectItem value="portfolio_review">Portfolio Review</SelectItem>
                  <SelectItem value="practical_assessment">Practical Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assessor</label>
              <Select value={assessor} onValueChange={setAssessor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Wilson">Dr. Sarah Wilson</SelectItem>
                  <SelectItem value="Mr. David Brown">Mr. David Brown</SelectItem>
                  <SelectItem value="Mrs. Elizabeth Brown">Mrs. Elizabeth Brown</SelectItem>
                  <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input 
                type="time" 
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input 
                placeholder="Assessment Room A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Additional notes about the assessment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={scheduleAssessment} className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Assessment
            </Button>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Assessment Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Assessment</DialogTitle>
            <DialogDescription>
              Record the results for {selectedAssessment?.student_name}'s {selectedAssessment?.assessment_type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Assessment Result</label>
              <Textarea 
                placeholder="Provide detailed assessment results and observations..."
                value={result}
                onChange={(e) => setResult(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Score (optional)</label>
              <Input 
                type="number"
                placeholder="85"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={completeAssessment} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Assessment
              </Button>
              <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Letter Dialog */}
      <Dialog open={letterDialogOpen} onOpenChange={setLetterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Letter</DialogTitle>
            <DialogDescription>
              Generate a letter based on {selectedAssessment?.student_name}'s assessment results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Letter Type</label>
              <Select value={letterType} onValueChange={setLetterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select letter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offer_letter">Offer Letter</SelectItem>
                  <SelectItem value="rejection_letter">Rejection Letter</SelectItem>
                  <SelectItem value="waitlist_letter">Waitlist Letter</SelectItem>
                  <SelectItem value="assessment_report">Assessment Report</SelectItem>
                  <SelectItem value="interview_feedback">Interview Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Assessment Summary</h4>
              <p className="text-sm text-blue-700">
                <strong>Type:</strong> {selectedAssessment?.assessment_type}<br/>
                <strong>Date:</strong> {selectedAssessment?.scheduled_date}<br/>
                <strong>Score:</strong> {selectedAssessment?.score || 'N/A'}%<br/>
                <strong>Result:</strong> {selectedAssessment?.result || 'N/A'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={generateLetter} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate Letter
              </Button>
              <Button variant="outline" onClick={() => setLetterDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}