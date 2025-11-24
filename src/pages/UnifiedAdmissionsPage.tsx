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
import { StageWorkflowManager } from "@/components/admissions/StageWorkflowManager";
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
  const [activeTab, setActiveTab] = useState("pathways");
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

  // Simple stage detection - Convert 1-based URL param to 0-based array index
  const stageParam = searchParams.get('stage');
  const isStageView = stageParam !== null;
  const currentStage = isStageView ? parseInt(stageParam) - 1 : null;

  // If viewing a specific stage, show stage view
  if (isStageView && currentStage !== null) {
    // Display as 1-based for users (currentStage is 0-based internally)
    const displayStageNumber = currentStage + 1;
    
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">🎯 Stage View Working!</h1>
          <p className="text-xl">You are viewing Stage {displayStageNumber}</p>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/admissions')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Admissions
          </Button>
        </div>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Applications for Stage {displayStageNumber}</h2>
          <StageWorkflowManager currentStage={currentStage} />
        </div>
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="pathways">Applications</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
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
      </Tabs>
    </div>
  );
};

export default UnifiedAdmissionsPage;