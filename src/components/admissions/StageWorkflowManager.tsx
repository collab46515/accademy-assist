import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, User, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ApplicationSubmittedStage } from './stages/ApplicationSubmittedStage';
import { DocumentVerificationStage } from './stages/DocumentVerificationStage';
import { ApplicationReviewStage } from './stages/ApplicationReviewStage';
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

  const stages = [
    { title: 'Application Submitted', status: 'submitted' },
    { title: 'Document Verification', status: 'document_verification' },
    { title: 'Application Review', status: 'under_review' },
    { title: 'Assessment/Interview', status: 'assessment_scheduled' },
    { title: 'Admission Decision', status: 'pending_approval' },
    { title: 'Fee Payment', status: 'fee_payment' },
    { title: 'Enrollment Confirmation', status: 'enrollment_confirmation' },
    { title: 'Welcome & Onboarding', status: 'onboarding' }
  ];

  const stageComponents = [
    ApplicationSubmittedStage,
    DocumentVerificationStage,
    ApplicationReviewStage,
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
      
      // For demo purposes, create mock applications for each stage
      // In a real app, you'd filter by actual stage status from the database
      const mockApplications = [
        {
          id: 'APP-2024-001',
          application_number: 'APP-2024-001',
          student_name: 'John Smith',
          year_group: 'Year 7',
          status: stages[currentStage]?.status || 'submitted',
          submitted_at: '2024-01-15T10:00:00Z',
          parent_email: 'john.smith@email.com',
          pathway: 'standard_digital',
          priority_score: 85
        },
        {
          id: 'APP-2024-002',
          application_number: 'APP-2024-002',
          student_name: 'Emma Johnson',
          year_group: 'Year 8',
          status: stages[currentStage]?.status || 'submitted',
          submitted_at: '2024-01-16T14:30:00Z',
          parent_email: 'emma.johnson@email.com',
          pathway: 'standard_digital',
          priority_score: 92
        },
        {
          id: 'APP-2024-003',
          application_number: 'APP-2024-003',
          student_name: 'Michael Brown',
          year_group: 'Year 9',
          status: stages[currentStage]?.status || 'submitted',
          submitted_at: '2024-01-17T09:15:00Z',
          parent_email: 'michael.brown@email.com',
          pathway: 'sibling_automatic',
          priority_score: 78
        }
      ];

      setApplications(mockApplications);
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

  const handleNextStage = () => {
    // Move application to next stage and go back to list
    setSelectedApplication(null);
    fetchApplicationsForStage();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { variant: 'secondary', label: 'Submitted' },
      document_verification: { variant: 'outline', label: 'Docs Pending' },
      under_review: { variant: 'default', label: 'Under Review' },
      assessment_scheduled: { variant: 'secondary', label: 'Assessment' },
      pending_approval: { variant: 'outline', label: 'Decision Pending' },
      fee_payment: { variant: 'destructive', label: 'Payment Due' },
      enrollment_confirmation: { variant: 'default', label: 'Confirming' },
      onboarding: { variant: 'default', label: 'Onboarding' }
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