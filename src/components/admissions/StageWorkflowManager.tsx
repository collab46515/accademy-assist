import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, User, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ApplicationSubmittedStage } from './stages/ApplicationSubmittedStage';
import { ApplicationReviewVerifyStage } from './stages/ApplicationReviewVerifyStage';
import { AssessmentInterviewStage } from './stages/AssessmentInterviewStage';
import { AdmissionDecisionStage } from './stages/AdmissionDecisionStage';
import { FeePaymentStage } from './stages/FeePaymentStage';
import { EnrollmentConfirmationStage } from './stages/EnrollmentConfirmationStage';
import { WelcomeOnboardingStage } from './stages/WelcomeOnboardingStage';

interface StageWorkflowManagerProps {
  currentStage: number;
}

export function StageWorkflowManager({ currentStage }: StageWorkflowManagerProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const { toast } = useToast();

  const stages = [
    { title: 'Application Submitted', status: 'submitted' },
    { title: 'Application Review & Verify', status: 'under_review' },
    { title: 'Assessment/Interview', status: 'assessment_scheduled' },
    { title: 'Admission Decision', status: 'approved' },
    { title: 'Fee Payment', status: 'offer_sent' },
    { title: 'Enrollment Confirmation', status: 'offer_accepted' },
    { title: 'Welcome & Onboarding', status: 'enrolled' }
  ];

  const stageComponents = [
    ApplicationSubmittedStage,
    ApplicationReviewVerifyStage,
    AssessmentInterviewStage,
    AdmissionDecisionStage,
    FeePaymentStage,
    EnrollmentConfirmationStage,
    WelcomeOnboardingStage
  ];

  useEffect(() => {
    fetchApplicationsForStage();
  }, [currentStage]);

  const fetchApplicationsForStage = async () => {
    try {
      setLoading(true);
      
      // Fetch real applications from the database
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by status after fetching to avoid TypeScript issues
      const filteredData = (data || []).filter(app => 
        app.status === (stages[currentStage]?.status || 'submitted')
      );

      if (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
        return;
      }

      // Transform the data to match our UI expectations
      const transformedApplications = filteredData.map(app => ({
        id: app.id,
        application_number: app.application_number,
        student_name: app.student_name || 'Unknown Student',
        year_group: app.year_group || 'Not specified',
        status: app.status,
        submitted_at: app.submitted_at || app.created_at,
        parent_email: app.parent_email || 'No email',
        pathway: app.pathway || 'standard_digital',
        priority_score: app.priority_score || 0
      }));

      setApplications(transformedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSelect = (application: any) => {
    setSelectedApplication(application);
  };

  const handleBackToList = () => {
    setSelectedApplication(null);
  };

  const handleNextStage = async () => {
    if (!selectedApplication || isMoving) return;
    
    try {
      setIsMoving(true);
      
      // Check if this is the final stage
      const nextStageIndex = currentStage + 1;
      if (nextStageIndex >= stages.length) {
        toast({
          title: "Final Stage Reached",
          description: "This application has completed all admission stages.",
          variant: "default",
        });
        setIsMoving(false);
        return;
      }
      
      const nextStatus = stages[nextStageIndex].status;
      const nextStageTitle = stages[nextStageIndex].title;
      
      // Update application status in database
      const { error } = await supabase
        .from('enrollment_applications')
        .update({ status: nextStatus as any })
        .eq('id', selectedApplication.id);
      
      if (error) {
        console.error('Error updating application:', error);
        toast({
          title: "Error Moving Application",
          description: "Failed to update application stage. Please try again.",
          variant: "destructive",
        });
        setIsMoving(false);
        return;
      }
      
      console.log(`✅ Moved application ${selectedApplication.application_number} to stage: ${nextStageTitle}`);
      
      toast({
        title: "Application Moved Successfully",
        description: `${selectedApplication.student_name} has been moved to ${nextStageTitle}`,
        variant: "default",
      });
      
      // Go back to list and refresh
      setSelectedApplication(null);
      fetchApplicationsForStage();
    } catch (error) {
      console.error('Error moving to next stage:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMoving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline', label: 'Draft' },
      submitted: { variant: 'secondary', label: 'Submitted' },
      under_review: { variant: 'default', label: 'Under Review' },
      documents_pending: { variant: 'outline', label: 'Docs Pending' },
      assessment_scheduled: { variant: 'secondary', label: 'Assessment' },
      assessment_complete: { variant: 'secondary', label: 'Assessment Done' },
      interview_scheduled: { variant: 'secondary', label: 'Interview' },
      interview_complete: { variant: 'secondary', label: 'Interview Done' },
      pending_approval: { variant: 'outline', label: 'Decision Pending' },
      approved: { variant: 'default', label: 'Approved' },
      offer_sent: { variant: 'destructive', label: 'Payment Due' },
      offer_accepted: { variant: 'default', label: 'Confirming' },
      enrolled: { variant: 'default', label: 'Enrolled' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      withdrawn: { variant: 'outline', label: 'Withdrawn' },
      on_hold: { variant: 'outline', label: 'On Hold' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const filteredApplications = applications.filter(app =>
    app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.application_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedApplication) {
    const CurrentStageComponent = stageComponents[currentStage];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={handleBackToList} className="mb-2">
              ← Back to Applications List
            </Button>
            <h2 className="text-2xl font-bold">{stages[currentStage]?.title}</h2>
            <p className="text-muted-foreground">
              Working on: {selectedApplication.student_name} ({selectedApplication.application_number})
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Stage {currentStage + 1} of {stages.length}
          </div>
        </div>
        
        <CurrentStageComponent
          applicationId={selectedApplication.id}
          applicationData={selectedApplication}
          onMoveToNext={handleNextStage}
        />
        
        {isMoving && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-[300px]">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Moving application to next stage...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{stages[currentStage]?.title}</h2>
          <p className="text-muted-foreground">
            Applications currently in this stage
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Stage {currentStage + 1} of {stages.length}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or application number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found in this stage
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleApplicationSelect(application)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{application.student_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {application.application_number} • {application.year_group}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(application.submitted_at).toLocaleDateString()}
                        </span>
                        <span>{application.parent_email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">Score: {application.priority_score}</div>
                      <div className="text-xs text-muted-foreground">{application.pathway}</div>
                    </div>
                    {getStatusBadge(application.status)}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}