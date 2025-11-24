import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationManagement } from "@/components/admissions/ApplicationManagement";
import { AdmissionsWorkflow } from "@/components/admissions/AdmissionsWorkflow";
import { AdmissionsFlowVisualization } from "@/components/admissions/AdmissionsFlowVisualization";
import { StageDetailBreakdown } from "@/components/admissions/StageDetailBreakdown";
import { ApplicationTaskManager } from "@/components/admissions/ApplicationTaskManager";
import { AdmissionStagesBreadcrumb } from "@/components/admissions/AdmissionStagesBreadcrumb";
import { EnrollmentProcessor } from "@/components/admissions/EnrollmentProcessor";
import { StageNavigator } from "@/components/admissions/StageNavigator";
import { StudentIntegrationVerifier } from "@/components/admissions/StudentIntegrationVerifier";
import { ResendEnrollmentEmails } from "@/components/admin/ResendEnrollmentEmails";
import { WorkflowValidation } from "@/components/admissions/WorkflowValidation";
import { ArrowLeft, UserPlus, FileText, Phone, Globe, Calendar, Upload } from "lucide-react";

const UnifiedAdmissionsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("management");
  const [loading, setLoading] = useState(false);

  // Handle application type selection
  const handleStartApplication = (applicationType: string) => {
    console.log(`Starting ${applicationType} application`);
    // For now, show a toast and navigate to enrollment form
    toast({
      title: "Starting Application",
      description: `Redirecting to ${applicationType} enrollment form...`,
    });
    
    // Navigate to enrollment with application type
    navigate(`/admissions/enroll?type=${applicationType.toLowerCase().replace(' ', '_')}`);
  };

  // Stage to status mapping for filtering
  const stageToStatusMap = [
    { stage: 1, statuses: ['submitted'], filter: 'submitted' },
    { stage: 2, statuses: ['under_review', 'documents_pending'], filter: 'under_review' },
    { stage: 3, statuses: ['assessment_scheduled', 'assessment_complete', 'interview_scheduled', 'interview_complete'], filter: 'assessment_scheduled' },
    { stage: 4, statuses: ['pending_approval', 'approved', 'on_hold'], filter: 'pending_approval' },
    { stage: 5, statuses: ['offer_sent'], filter: 'offer_sent' },
    { stage: 6, statuses: ['offer_accepted', 'offer_declined'], filter: 'offer_accepted' },
    { stage: 7, statuses: ['enrolled'], filter: 'enrolled' }
  ];

  // Simple stage detection - Convert 1-based URL param to stage info
  const stageParam = searchParams.get('stage');
  const isStageView = stageParam !== null;
  const stageNumber = isStageView ? parseInt(stageParam) : null;
  const stageInfo = stageNumber ? stageToStatusMap.find(s => s.stage === stageNumber) : null;

  // If viewing a specific stage, show filtered application management
  if (isStageView && stageInfo) {
    const stageTitles = [
      'Application Submitted',
      'Application Review & Verify',
      'Assessment/Interview',
      'Admission Decision',
      'Fee Payment',
      'Enrollment Confirmation',
      'Welcome & Onboarding'
    ];
    
    const stageTitle = stageTitles[stageNumber! - 1] || 'Unknown Stage';
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admissions')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Admissions
          </Button>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Stage {stageNumber}: {stageTitle}
            </h1>
            <p className="text-muted-foreground">
              Viewing all applications in this stage • Filter shows: {stageInfo.statuses.join(', ')}
            </p>
          </div>
          
          {/* Stage breadcrumb for navigation */}
          <AdmissionStagesBreadcrumb />
        </div>
        
        {/* Show Application Management filtered by stage */}
        <ApplicationManagement 
          initialFilter={stageInfo.filter}
          stageStatuses={stageInfo.statuses}
        />
      </div>
    );
  }

  // Main admissions page
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">✅ Unified Admissions System</h1>
        <p className="text-muted-foreground">
          Complete admissions management with 6 enrollment pathways, workflow automation, and approval processes
        </p>
        
        {/* Admission Stages Breadcrumb */}
        <AdmissionStagesBreadcrumb />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="management">Application Management</TabsTrigger>
          <TabsTrigger value="workflow">Unified Workflow</TabsTrigger>
          <TabsTrigger value="pathways">New Applications</TabsTrigger>
          <TabsTrigger value="processor">Enrollment Processor</TabsTrigger>
          <TabsTrigger value="integration">Student Integration</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        {/* Application Management Tab */}
        <TabsContent value="management" className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Application Overview</TabsTrigger>
              <TabsTrigger value="tasks">Task Management</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <ApplicationManagement />
            </TabsContent>
            <TabsContent value="tasks">
              <ApplicationTaskManager />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Unified Workflow Tab - Merged from basic + enhanced workflows */}
        <TabsContent value="workflow" className="space-y-6">
          <StageNavigator />
          <AdmissionsFlowVisualization />
          <StageDetailBreakdown />
          <AdmissionsWorkflow />
        </TabsContent>

        {/* New Applications Tab */}
        <TabsContent value="pathways" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Online Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Standard digital application form for new student admissions
                </p>
                <Button 
                  className="w-full"
                  onClick={() => handleStartApplication("Online Application")}
                >
                  Start New Application
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sibling Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Simplified application for siblings of current students
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleStartApplication("Sibling Application")}
                >
                  Sibling Application
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Enquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create application from phone enquiry or walk-in
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleStartApplication("Phone Enquiry")}
                >
                  Phone Application
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  International Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Specialized pathway for international student applications
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleStartApplication("International Student")}
                >
                  International Application
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Mid-Year Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Application for mid-year or term-time entry
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleStartApplication("Mid-Year Entry")}
                >
                  Mid-Year Application
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Bulk Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Import multiple applications from external sources
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleStartApplication("Bulk Import")}
                >
                  Bulk Import
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enrollment Processor Tab */}
        <TabsContent value="processor" className="space-y-6">
          <EnrollmentProcessor />
          
          {/* Resend Enrollment Emails */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">📧 Resend Enrollment Emails</h2>
            <p className="text-green-700 text-sm mb-4">Resend welcome emails with login credentials to all enrolled students and parents</p>
            <ResendEnrollmentEmails />
          </div>
        </TabsContent>

        {/* Student Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <StudentIntegrationVerifier />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <WorkflowValidation />
          
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Additional reports and analytics functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAdmissionsPage;