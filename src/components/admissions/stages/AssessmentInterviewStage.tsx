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
    { subject: 'General Knowledge', marks: '', maxMarks: '100', status: 'pending', comments: '' },
    { subject: 'Hindi', marks: '', maxMarks: '100', status: 'pending', comments: '' }
  ]);
  
  const [assessmentStatus, setAssessmentStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [assessmentResult, setAssessmentResult] = useState<'pass' | 'fail' | null>(null);
  const [overallComments, setOverallComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interview state - with scheduling step
  const [showInterviewScheduling, setShowInterviewScheduling] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [notificationTemplate, setNotificationTemplate] = useState('');
  const [interviewStatus, setInterviewStatus] = useState<'not_started' | 'scheduled' | 'completed'>('not_started');
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

        // Handle assessment completion
        if (application.status === 'assessment_complete' || 
            application.status === 'interview_scheduled' || 
            application.status === 'interview_complete') {
          
          // Load assessment data
          let loadedResult: 'pass' | 'fail' = 'pass';
          if (application.assessment_data && application.assessment_data !== null) {
            const data = application.assessment_data as any;
            console.log('Loading saved assessment data:', data);
            if (data.assessments && Array.isArray(data.assessments)) {
              setAssessments(data.assessments);
            }
            if (data.overallComments) setOverallComments(data.overallComments);
            if (data.result) {
              loadedResult = data.result;
              setAssessmentResult(data.result);
            }
          } else {
            console.log('No assessment data saved, but status indicates assessment passed');
            setOverallComments('Assessment completed (detailed marks not recorded)');
          }
          
          setAssessmentStatus('completed');
          setAssessmentResult(loadedResult);
          
          // Only show scheduling form if assessment passed
          if (application.status === 'assessment_complete' && loadedResult === 'pass') {
            setShowInterviewScheduling(true);
          }
        }
        
        // Handle rejected applications (failed assessment)
        if (application.status === 'rejected') {
          if (application.assessment_data && application.assessment_data !== null) {
            const data = application.assessment_data as any;
            if (data.assessments && Array.isArray(data.assessments)) {
              setAssessments(data.assessments);
            }
            if (data.overallComments) setOverallComments(data.overallComments);
            if (data.result) setAssessmentResult(data.result);
          }
          setAssessmentStatus('completed');
          setShowInterviewScheduling(false);
        }

        // Handle interview scheduling
        if (application.status === 'interview_scheduled' || 
            application.status === 'interview_complete') {
          
          // Load interview schedule if available
          if (application.interview_data && application.interview_data !== null) {
            const data = application.interview_data as any;
            console.log('Loading saved interview data:', data);
            if (data.scheduledDate) setInterviewDate(data.scheduledDate);
            if (data.scheduledTime) setInterviewTime(data.scheduledTime);
            if (data.interviewer) setInterviewer(data.interviewer);
            if (data.notificationMethod) setNotificationMethod(data.notificationMethod);
            if (data.result) setInterviewResult(data.result);
            if (data.comments) setInterviewComments(data.comments);
          }
          
          setInterviewScheduled(true);
          setShowInterviewScheduling(true);
          setInterviewStatus('scheduled');
        }

        // Handle interview completion
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

    // Check if any subject failed - if so, overall result is fail
    const anySubjectFailed = assessments.some(a => a.status === 'fail');
    
    return anySubjectFailed ? 'fail' : 'pass';
  };

  const handleEditAssessment = () => {
    setAssessmentStatus('in_progress');
    setAssessmentResult(null);
    toast.info('Assessment unlocked for editing');
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
      
      // ALWAYS allow scheduling interview regardless of assessment result
      toast.success('Assessment completed successfully! You can now schedule an interview.');
      setShowInterviewScheduling(true);
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

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime || !interviewer) {
      toast.error('Please fill in all interview scheduling details');
      return;
    }

    setIsSubmitting(true);
    try {
      const interviewData = {
        scheduledDate: interviewDate,
        scheduledTime: interviewTime,
        interviewer: interviewer,
        notificationMethod: notificationMethod,
        scheduledAt: new Date().toISOString()
      };

      // Update application status to interview_scheduled
      const { error: statusError } = await supabase
        .from('enrollment_applications')
        .update({ 
          status: 'interview_scheduled',
          interview_data: interviewData as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (statusError) {
        console.error('Error scheduling interview:', statusError);
        toast.error('Failed to schedule interview');
        setIsSubmitting(false);
        return;
      }

      console.log('Interview scheduled successfully');
      
      setInterviewScheduled(true);
      setInterviewStatus('scheduled');
      toast.success('Interview scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      // Load existing interview data to preserve schedule info
      const { data: existingApp } = await supabase
        .from('enrollment_applications')
        .select('interview_data')
        .eq('id', applicationId)
        .maybeSingle();

      const existingData = (existingApp?.interview_data as any) || {};

      const interviewData = {
        ...existingData, // Preserve scheduling information
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
                      <div className="mt-3 space-y-2">
                        <div className="p-3 bg-amber-100 border border-amber-300 rounded text-sm text-amber-800">
                          <p className="font-medium mb-1">Student did not meet minimum passing criteria.</p>
                          <p>You may still proceed to schedule an interview if desired.</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <Button 
                        onClick={handleEditAssessment}
                        variant="outline"
                        className="w-full"
                      >
                        Edit Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interview Section - With Scheduling Step */}
      {showInterviewScheduling && assessmentResult !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admission Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Schedule Interview */}
            {!interviewScheduled && interviewStatus === 'not_started' && (
              <div className="space-y-4">
                <div className={`p-4 border rounded-lg ${assessmentResult === 'pass' ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-sm ${assessmentResult === 'pass' ? 'text-blue-800' : 'text-amber-800'}`}>
                    {assessmentResult === 'pass' 
                      ? 'Assessment completed successfully! Please schedule an interview for the candidate.'
                      : 'Assessment completed. You may proceed to schedule an interview for further evaluation.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Interview Date *</Label>
                    <Input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Interview Time *</Label>
                    <Input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Interviewer Name *</Label>
                  <Input
                    placeholder="Enter interviewer name"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Notification Method</Label>
                  <Select value={notificationMethod} onValueChange={setNotificationMethod}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(notificationMethod === 'email' || notificationMethod === 'sms' || notificationMethod === 'whatsapp') && (
                  <div>
                    <Label>Message Template</Label>
                    <Textarea
                      value={notificationTemplate}
                      onChange={(e) => setNotificationTemplate(e.target.value)}
                      placeholder={`Enter ${notificationMethod} template message...

Example: 
Dear Parent,

Your child's interview has been scheduled for {date} at {time} with {interviewer}.

Please ensure your child arrives 10 minutes early.

Best regards,
School Administration`}
                      rows={6}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use placeholders: {'{date}'}, {'{time}'}, {'{interviewer}'}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleScheduleInterview} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
                </Button>
              </div>
            )}

            {/* Step 2: Interview Scheduled - Show Details & Complete Interview Form */}
            {interviewScheduled && interviewStatus === 'scheduled' && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Interview Scheduled</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                    <div><strong>Date:</strong> {interviewDate}</div>
                    <div><strong>Time:</strong> {interviewTime}</div>
                    <div><strong>Interviewer:</strong> {interviewer}</div>
                    <div><strong>Notification:</strong> {notificationMethod}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Complete Interview</h4>
                  
                  <div>
                    <Label>Interview Result *</Label>
                    <RadioGroup value={interviewResult || ''} onValueChange={(v: any) => setInterviewResult(v)} className="mt-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50">
                        <RadioGroupItem value="pass" id="interview-pass" />
                        <Label htmlFor="interview-pass" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="font-medium">Pass</div>
                            <div className="text-xs text-muted-foreground">Student performed well in interview</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-red-50">
                        <RadioGroupItem value="fail" id="interview-fail" />
                        <Label htmlFor="interview-fail" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <div>
                            <div className="font-medium">Fail</div>
                            <div className="text-xs text-muted-foreground">Student did not meet interview criteria</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="mt-4">
                    <Label>Interview Comments *</Label>
                    <Textarea
                      placeholder="Record interview observations, strengths, concerns, and recommendations..."
                      value={interviewComments}
                      onChange={(e) => setInterviewComments(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    onClick={handleCompleteInterview} 
                    disabled={isSubmitting || !interviewResult}
                    className="w-full mt-4"
                  >
                    {isSubmitting ? 'Completing...' : 'Complete Interview'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Interview Completed - Show Results */}
            {interviewStatus === 'completed' && interviewResult && (
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
                    
                    {interviewDate && interviewTime && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Conducted on:</strong> {interviewDate} at {interviewTime}
                        {interviewer && <> by {interviewer}</>}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">{interviewComments}</p>
                    
                    {interviewResult === 'pass' ? (
                      <Button 
                        onClick={onMoveToNext}
                        className="w-full mt-3"
                        size="lg"
                      >
                        Move to Admission Decision
                      </Button>
                    ) : (
                      <div className="space-y-2 mt-3">
                        <div className="p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                          Student did not pass the interview. Application will be rejected.
                        </div>
                        <Button 
                          variant="destructive" 
                          onClick={handleRejectApplication}
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
