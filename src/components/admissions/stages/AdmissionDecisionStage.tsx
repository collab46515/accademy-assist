import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, User, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdmissionDecisionStageProps {
  applicationId: string;
  onMoveToNext: () => void;
}

export function AdmissionDecisionStage({ applicationId, onMoveToNext }: AdmissionDecisionStageProps) {
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadApplicationData();
  }, [applicationId]);

  const loadApplicationData = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select(`
          *,
          students:student_id (
            student_number,
            year_group,
            form_class
          )
        `)
        .eq('id', applicationId)
        .maybeSingle();

      if (error) {
        console.error('Error loading application:', error);
        toast.error('Failed to load application data');
        return;
      }

      if (!data) {
        toast.error('Application not found');
        return;
      }

      console.log('Loaded application data:', data);
      setApplicationData(data);

      // Load existing decision if any
      if (data.status === 'approved') {
        setDecision('approved');
      } else if (data.status === 'rejected') {
        setDecision('rejected');
      }

      // Load decision notes from additional_data if exists
      if (data.additional_data) {
        const additionalData = data.additional_data as any;
        if (additionalData?.decision_notes) {
          setDecisionNotes(additionalData.decision_notes);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load application');
      setLoading(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      toast.error('Please select a decision (Approve or Reject)');
      return;
    }

    if (!decisionNotes.trim()) {
      toast.error('Please provide decision notes');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update application with decision
      const additionalData = applicationData.additional_data as any || {};
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          status: decision,
          additional_data: {
            ...additionalData,
            decision_notes: decisionNotes,
            decision_made_at: new Date().toISOString(),
            decision_made_by: (await supabase.auth.getUser()).data.user?.id
          } as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating decision:', error);
        toast.error('Failed to save decision');
        setIsSubmitting(false);
        return;
      }

      if (decision === 'approved') {
        toast.success('Application approved successfully!');
      } else {
        toast.error('Application rejected');
      }

      // Reload data
      await loadApplicationData();
    } catch (error) {
      console.error('Error submitting decision:', error);
      toast.error('Failed to submit decision');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading application data...</p>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Application not found</p>
      </div>
    );
  }

  // Parse assessment and interview data
  const assessmentData = applicationData.assessment_data as any;
  const interviewData = applicationData.interview_data as any;
  
  // Calculate overall assessment score
  const calculateOverallScore = () => {
    if (!assessmentData?.assessments) return 0;
    const assessments = assessmentData.assessments;
    const totalMarks = assessments.reduce((sum: number, a: any) => sum + parseFloat(a.marks || '0'), 0);
    const totalMaxMarks = assessments.reduce((sum: number, a: any) => sum + parseFloat(a.maxMarks || '0'), 0);
    return totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 100) : 0;
  };

  const overallScore = calculateOverallScore();

  return (
    <div className="space-y-6">
      {/* Application Summary - Real Data */}
      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student Name</p>
              <p className="font-medium">{applicationData.student_first_name} {applicationData.student_last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Application Number</p>
              <p className="font-medium">{applicationData.application_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year Group</p>
              <p className="font-medium">{applicationData.year_group_applying}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="font-medium text-primary">{overallScore}/100</p>
            </div>
          </div>
          
          {/* Assessment Scores */}
          {assessmentData?.assessments && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Assessment Scores:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assessmentData.assessments.map((assessment: any, index: number) => (
                  <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {assessment.marks}/{assessment.maxMarks}
                    </div>
                    <div className="text-sm text-muted-foreground">{assessment.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {assessment.marks && assessment.maxMarks ? 
                        `${((parseFloat(assessment.marks) / parseFloat(assessment.maxMarks)) * 100).toFixed(0)}%` : '0%'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Result */}
          {interviewData?.result && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-1">Interview Result:</p>
              <div className="flex items-center gap-2">
                {interviewData.result === 'pass' ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">PASSED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium">FAILED</span>
                  </>
                )}
              </div>
              {interviewData.comments && (
                <p className="text-sm text-muted-foreground mt-2">{interviewData.comments}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Committee Review / Decision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Head of Admissions Decision
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applicationData.status === 'approved' || applicationData.status === 'rejected' ? (
            // Show readonly decision
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                applicationData.status === 'approved' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {applicationData.status === 'approved' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Application APPROVED</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-800">Application REJECTED</span>
                    </>
                  )}
                </div>
                {decisionNotes && (
                  <>
                    <p className="text-sm font-medium mb-1">Decision Notes:</p>
                    <p className="text-sm text-muted-foreground">{decisionNotes}</p>
                  </>
                )}
              </div>
              
              {applicationData.status === 'approved' && (
                <Button onClick={onMoveToNext} size="lg" className="w-full">
                  Move to Fee Payment Stage
                </Button>
              )}
            </div>
          ) : (
            // Show decision form
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Decision Pending</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Head of Admissions needs to review and approve/reject this application
                </p>
              </div>

              <div>
                <Label>Decision *</Label>
                <RadioGroup value={decision || ''} onValueChange={(v: any) => setDecision(v)} className="mt-2">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50">
                    <RadioGroupItem value="approved" id="approved" />
                    <Label htmlFor="approved" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Approve</div>
                        <div className="text-xs text-muted-foreground">Accept this student for admission</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-red-50">
                    <RadioGroupItem value="rejected" id="rejected" />
                    <Label htmlFor="rejected" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium">Reject</div>
                        <div className="text-xs text-muted-foreground">Decline this application</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Decision Notes *</Label>
                <Textarea
                  placeholder="Provide detailed reasoning for your decision..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleSubmitDecision} 
                disabled={isSubmitting || !decision}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Decision'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
