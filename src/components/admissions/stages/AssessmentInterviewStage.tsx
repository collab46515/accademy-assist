import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, BookOpen, CheckCircle, XCircle, AlertCircle, Mail, MessageSquare, User } from 'lucide-react';
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
  
  // Interview state
  const [showInterviewScheduling, setShowInterviewScheduling] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [notificationMethod, setNotificationMethod] = useState<'manual' | 'email' | 'sms'>('manual');
  const [interviewStatus, setInterviewStatus] = useState<'not_scheduled' | 'scheduled' | 'completed'>('not_scheduled');
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
          .single();

        if (error) {
          console.error('Error loading application:', error);
          setIsLoading(false);
          return;
        }

        console.log('Application status:', application.status);

        // Check status and set appropriate state
        if (application.status === 'assessment_complete' || 
            application.status === 'interview_scheduled' || 
            application.status === 'interview_complete') {
          
          // Load assessment data if available
          if (application.assessment_data) {
            const data = application.assessment_data as any;
            if (data.assessments) setAssessments(data.assessments);
            if (data.overallComments) setOverallComments(data.overallComments);
            if (data.result) setAssessmentResult(data.result);
          }
          
          setAssessmentStatus('completed');
          setAssessmentResult('pass'); // Only pass moves to interview
          setShowInterviewScheduling(true);
        }

        if (application.status === 'interview_scheduled' || 
            application.status === 'interview_complete') {
          
          // Load interview data if available
          if (application.interview_data) {
            const data = application.interview_data as any;
            if (data.date) setInterviewDate(data.date);
            if (data.time) setInterviewTime(data.time);
            if (data.interviewer) setInterviewer(data.interviewer);
            if (data.notificationMethod) setNotificationMethod(data.notificationMethod);
          }
          
          setInterviewScheduled(true);
          setInterviewStatus('scheduled');
        }

        if (application.status === 'interview_complete') {
          // Load interview results
          if (application.interview_data) {
            const data = application.interview_data as any;
            if (data.result) setInterviewResult(data.result);
            if (data.comments) setInterviewComments(data.comments);
          }
          
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

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime || !interviewer) {
      toast.error('Please fill in all interview details');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare interview scheduling data
      const interviewData = {
        date: interviewDate,
        time: interviewTime,
        interviewer,
        notificationMethod,
        scheduledAt: new Date().toISOString()
      };

      // Update application with status and interview data
      const { error: statusError } = await supabase
        .from('enrollment_applications')
        .update({ 
          status: 'interview_scheduled',
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

      console.log('Interview scheduled successfully');

      // Send notification based on method
      if (notificationMethod === 'email') {
        toast.success('Interview scheduled! Email notification sent to applicant.');
      } else if (notificationMethod === 'sms') {
        toast.success('Interview scheduled! SMS notification sent to applicant.');
      } else {
        toast.success('Interview scheduled successfully!');
      }

      setInterviewScheduled(true);
      setInterviewStatus('scheduled');
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
      // Get existing interview data and add completion info
      const { data: currentApp } = await supabase
        .from('enrollment_applications')
        .select('interview_data')
        .eq('id', applicationId)
        .single();

      const updatedInterviewData = {
        ...(currentApp?.interview_data as any || {}),
        result: interviewResult,
        comments: interviewComments,
        completedAt: new Date().toISOString()
      };

      // Update application with completion status and interview results
      const { error: statusError } = await supabase
        .from('enrollment_applications')
        .update({ 
          status: 'interview_complete',
          interview_data: updatedInterviewData as any,
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
                  <p className="text-sm text-muted-foreground">{overallComments}</p>
                  
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interview Scheduling Section */}
      {showInterviewScheduling && assessmentResult === 'pass' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Interview Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="schedule">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule">Schedule Interview</TabsTrigger>
                <TabsTrigger value="complete" disabled={!interviewScheduled}>Complete Interview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule" className="space-y-4">
                {!interviewScheduled ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Interview Date *</Label>
                        <Input
                          type="date"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Interview Time *</Label>
                        <Input
                          type="time"
                          value={interviewTime}
                          onChange={(e) => setInterviewTime(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Interviewer *</Label>
                      <Input
                        placeholder="Enter interviewer name"
                        value={interviewer}
                        onChange={(e) => setInterviewer(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Notification Method</Label>
                      <RadioGroup value={notificationMethod} onValueChange={(v: any) => setNotificationMethod(v)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="manual" />
                          <Label htmlFor="manual" className="font-normal cursor-pointer">
                            Manual (No notification)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="font-normal cursor-pointer flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Send Email Notification
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sms" id="sms" />
                          <Label htmlFor="sms" className="font-normal cursor-pointer flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Send SMS Notification
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Button 
                      onClick={handleScheduleInterview} 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
                    </Button>
                  </div>
                ) : (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                          Interview Scheduled
                        </h4>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <strong>Date:</strong> {new Date(interviewDate).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <strong>Time:</strong> {interviewTime}
                          </p>
                          <p className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <strong>Interviewer:</strong> {interviewer}
                          </p>
                          <p className="flex items-center gap-2">
                            {notificationMethod === 'email' ? <Mail className="h-4 w-4" /> : 
                             notificationMethod === 'sms' ? <MessageSquare className="h-4 w-4" /> : 
                             <AlertCircle className="h-4 w-4" />}
                            <strong>Notification:</strong> {notificationMethod === 'manual' ? 'Manual' : notificationMethod === 'email' ? 'Email Sent' : 'SMS Sent'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="complete" className="space-y-4">
                {interviewStatus !== 'completed' ? (
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
                    >
                      {isSubmitting ? 'Completing...' : 'Complete Interview'}
                    </Button>
                  </div>
                ) : (
                  <Card className={interviewResult === 'pass' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
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
                        
                        {interviewResult === 'fail' && (
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
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Next Stage Button */}
      {assessmentResult === 'pass' && interviewStatus === 'completed' && interviewResult === 'pass' && (
        <Card>
          <CardHeader>
            <CardTitle>Stage Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Assessment and Interview Completed Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Student has passed both assessment and interview. Ready to proceed to Admission Decision stage.
                </p>
              </div>
              <Button onClick={onMoveToNext} size="lg">
                Move to Admission Decision
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
