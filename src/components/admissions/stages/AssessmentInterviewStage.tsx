import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AssessmentInterviewStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

interface SubjectAssessment {
  subject: string;
  marks: string;
  maxMarks: string;
  status: 'pending' | 'pass' | 'fail';
  comments: string;
}

export function AssessmentInterviewStage({ applicationId, onMoveToNext }: AssessmentInterviewStageProps) {
  const [assessments, setAssessments] = useState<SubjectAssessment[]>([
    { subject: 'Mathematics', marks: '', maxMarks: '100', status: 'pending', comments: '' },
    { subject: 'English', marks: '', maxMarks: '100', status: 'pending', comments: '' },
    { subject: 'Science', marks: '', maxMarks: '100', status: 'pending', comments: '' },
    { subject: 'Hindi', marks: '', maxMarks: '100', status: 'pending', comments: '' }
  ]);
  
  const [assessmentStatus, setAssessmentStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [assessmentResult, setAssessmentResult] = useState<'pass' | 'fail' | null>(null);
  const [overallComments, setOverallComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interview state - simplified, no scheduling step
  const [showInterviewScheduling, setShowInterviewScheduling] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<'not_started' | 'completed'>('not_started');
  const [interviewResult, setInterviewResult] = useState<'pass' | 'fail' | null>(null);
  const [interviewComments, setInterviewComments] = useState('');

  // Load application status on mount
  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        const { data: application, error } = await supabase
          .from('enrollment_applications')
          .select('status, assessment_data, interview_data')
          .eq('id', applicationId)
          .maybeSingle();

        if (error) {
          console.error('Error loading application:', error);
          setIsLoading(false);
          return;
        }

        if (!application) {
          console.warn('No application found');
          setIsLoading(false);
          return;
        }

        console.log('Application data loaded:', application);

        // If status is interview_scheduled or interview_complete, assessment must be passed
        if (application.status === 'interview_scheduled' || 
            application.status === 'interview_complete') {
          
          // Load assessment data if available, otherwise use defaults with pass status
          if (application.assessment_data && application.assessment_data !== null) {
            const data = application.assessment_data as any;
            console.log('Loading saved assessment data:', data);
            if (data.assessments && Array.isArray(data.assessments)) {
              setAssessments(data.assessments);
            }
            if (data.overallComments) setOverallComments(data.overallComments);
            if (data.result) setAssessmentResult(data.result);
          } else {
            // No saved data but assessment was passed (status proves it)
            console.log('No assessment data saved, but status indicates assessment passed');
            setOverallComments('Assessment completed (detailed marks not recorded)');
          }
          
          setAssessmentStatus('completed');
          setAssessmentResult('pass');
          setShowInterviewScheduling(true);
        }

        if (application.status === 'interview_scheduled' || 
            application.status === 'interview_complete') {
          
          // Load interview results if available
          if (application.interview_data && application.interview_data !== null) {
            const data = application.interview_data as any;
            console.log('Loading saved interview data:', data);
            if (data.result) setInterviewResult(data.result);
            if (data.comments) setInterviewComments(data.comments);
          }
        }

        if (application.status === 'interview_complete') {
          setInterviewStatus('completed');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading application data:', error);
        setIsLoading(false);
      }
    };

    loadApplicationData();
  }, [applicationId]);

  useEffect(() => {
    // Check if any marks are entered
    const hasMarks = assessments.some(a => a.marks !== '');
    if (hasMarks && assessmentStatus === 'not_started') {
      setAssessmentStatus('in_progress');
    }
  }, [assessments, assessmentStatus]);

  const updateAssessment = (index: number, field: keyof SubjectAssessment, value: string) => {
    const updated = [...assessments];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate pass/fail based on marks
    if (field === 'marks' && value) {
      const marks = parseFloat(value);
      const maxMarks = parseFloat(updated[index].maxMarks);
      const percentage = (marks / maxMarks) * 100;
      updated[index].status = percentage >= 40 ? 'pass' : 'fail';
    }
    
    setAssessments(updated);
  };

  const calculateOverallResult = () => {
    const allCompleted = assessments.every(a => a.marks !== '');
    if (!allCompleted) {
      toast.error('Please enter marks for all subjects');
      return null;
    }

    const totalMarks = assessments.reduce((sum, a) => sum + parseFloat(a.marks || '0'), 0);
    const totalMaxMarks = assessments.reduce((sum, a) => sum + parseFloat(a.maxMarks || '0'), 0);
    const percentage = (totalMarks / totalMaxMarks) * 100;
    
    return percentage >= 40 ? 'pass' : 'fail';
  };

  const handleCompleteAssessment = async () => {
    const result = calculateOverallResult();
    if (!result) return;

    if (!overallComments.trim()) {
      toast.error('Please add overall assessment comments');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare assessment data
      const assessmentData = {
        assessments,
        overallComments,
        result,
        completedAt: new Date().toISOString()
      };

      // Update application with status and assessment data
      const { error: statusError } = await supabase
        .from('enrollment_applications')
        .update({ 
          status: 'assessment_complete',
          assessment_data: assessmentData as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (statusError) {
        console.error('Error updating status:', statusError);
        toast.error('Failed to update application status');
        setIsSubmitting(false);
        return;
      }

      console.log('Assessment saved successfully');

      setAssessmentStatus('completed');
      setAssessmentResult(result);
      
      if (result === 'pass') {
        toast.success('Assessment completed successfully! Student passed. You can now schedule an interview.');
        setShowInterviewScheduling(true);
      } else {
        toast.error('Assessment completed. Student failed. Application will be rejected.');
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error('Failed to save assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectApplication = async () => {
    setIsSubmitting(true);
    try {
      await supabase
        .from('enrollment_applications')
        .update({ status: 'rejected', rejection_reason: 'Failed Assessment' })
        .eq('id', applicationId);
      
      toast.success('Application has been rejected');
      // You might want to navigate away or refresh
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed handleScheduleInterview - no longer needed

  const handleCompleteInterview = async () => {
    if (!interviewResult) {
      toast.error('Please select interview result (Pass/Fail)');
      return;
    }

    if (!interviewComments.trim()) {
      toast.error('Please add interview comments');
      return;
    }

    setIsSubmitting(true);
    try {
      const interviewData = {
        result: interviewResult,
        comments: interviewComments,
        completedAt: new Date().toISOString()
      };

      // Update application with completion status and interview results
      const { error: statusError } = await supabase
        .from('enrollment_applications')
        .update({ 
          status: 'interview_complete',
          interview_data: interviewData as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (statusError) {
        console.error('Error updating status:', statusError);
        toast.error('Failed to update application status');
        setIsSubmitting(false);
        return;
      }

      console.log('Interview completed successfully');

      setInterviewStatus('completed');
      
      if (interviewResult === 'pass') {
        toast.success('Interview completed! Student passed. Ready to move to next stage.');
      } else {
        toast.error('Interview completed. Student failed. Application will be rejected.');
      }
    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error('Failed to complete interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading application data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Assessment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Academic Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, index) => (
              <Card key={assessment.subject}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{assessment.subject}</h4>
                      {getStatusBadge(assessment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Marks Obtained</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={assessment.marks}
                          onChange={(e) => updateAssessment(index, 'marks', e.target.value)}
                          disabled={assessmentStatus === 'completed'}
                        />
                      </div>
                      <div>
                        <Label>Max Marks</Label>
                        <Input
                          type="number"
                          value={assessment.maxMarks}
                          onChange={(e) => updateAssessment(index, 'maxMarks', e.target.value)}
                          disabled={assessmentStatus === 'completed'}
                        />
                      </div>
                    </div>
                    
                    {assessment.marks && (
                      <div className="text-sm text-muted-foreground">
                        Percentage: {((parseFloat(assessment.marks) / parseFloat(assessment.maxMarks)) * 100).toFixed(1)}%
                      </div>
                    )}
                    
                    <div>
                      <Label>Comments</Label>
                      <Textarea
                        placeholder="Add assessment comments..."
                        value={assessment.comments}
                        onChange={(e) => updateAssessment(index, 'comments', e.target.value)}
                        disabled={assessmentStatus === 'completed'}
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {assessmentStatus !== 'completed' && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Label>Overall Assessment Comments</Label>
                    <Textarea
                      placeholder="Provide overall assessment comments and recommendations..."
                      value={overallComments}
                      onChange={(e) => setOverallComments(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handleCompleteAssessment} 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Completing...' : 'Complete Assessment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {assessmentStatus === 'completed' && assessmentResult && (
              <>
                {/* Show assessment marks breakdown only if we have data */}
                {assessments.some(a => a.marks !== '') ? (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Assessment Results Summary</h4>
                      <div className="space-y-2">
                        {assessments.map((assessment) => (
                          <div key={assessment.subject} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{assessment.subject}:</span>
                            <div className="flex items-center gap-2">
                              <span>{assessment.marks}/{assessment.maxMarks}</span>
                              <span className="text-muted-foreground">
                                ({assessment.marks && assessment.maxMarks ? 
                                  ((parseFloat(assessment.marks) / parseFloat(assessment.maxMarks)) * 100).toFixed(1) : 0}%)
                              </span>
                              {getStatusBadge(assessment.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                {/* Overall result card */}
                <Card className={assessmentResult === 'pass' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {assessmentResult === 'pass' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className="font-semibold">
                        Assessment Result: {assessmentResult === 'pass' ? 'PASSED' : 'FAILED'}
                      </h4>
                    </div>
                    {overallComments && (
                      <>
                        <p className="text-sm text-muted-foreground mb-2"><strong>Comments:</strong></p>
                        <p className="text-sm text-muted-foreground">{overallComments}</p>
                      </>
                    )}
                    
                    {assessmentResult === 'fail' && (
                      <Button 
                        variant="destructive" 
                        onClick={handleRejectApplication}
                        disabled={isSubmitting}
                        className="w-full mt-3"
                      >
                        {isSubmitting ? 'Rejecting...' : 'Reject Application'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interview Section - Simplified, no separate scheduling */}
      {showInterviewScheduling && assessmentResult === 'pass' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Interview Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interviewStatus === 'completed' && interviewResult ? (
              <Card className={interviewResult === 'pass' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      {interviewResult === 'pass' ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Interview Result: PASSED
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          Interview Result: FAILED
                        </>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{interviewComments}</p>
                    
                    {interviewResult === 'pass' ? (
                      <Button 
                        onClick={onMoveToNext}
                        className="w-full mt-3"
                        size="lg"
                      >
                        Complete Interview & Move to Admission Decision
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        onClick={handleRejectApplication}
                        disabled={isSubmitting}
                        className="w-full mt-3"
                      >
                        {isSubmitting ? 'Rejecting...' : 'Reject Application'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Interview Result *</Label>
                  <RadioGroup value={interviewResult || ''} onValueChange={(v: any) => setInterviewResult(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pass" id="pass" />
                      <Label htmlFor="pass" className="font-normal cursor-pointer flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Pass
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fail" id="fail" />
                      <Label htmlFor="fail" className="font-normal cursor-pointer flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Fail
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Interview Comments *</Label>
                  <Textarea
                    placeholder="Provide detailed interview feedback and observations..."
                    value={interviewComments}
                    onChange={(e) => setInterviewComments(e.target.value)}
                    rows={6}
                  />
                </div>
                
                <Button 
                  onClick={handleCompleteInterview} 
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Interview'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
