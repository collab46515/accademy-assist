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
import { ArrowLeft } from "lucide-react";

const UnifiedAdmissionsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("management");
  const [loading, setLoading] = useState(false);

  // Simple stage detection
  const stageParam = searchParams.get('stage');
  const isStageView = stageParam !== null;
  const currentStage = isStageView ? parseInt(stageParam) : null;

  // If viewing a specific stage, show stage view
  if (isStageView && currentStage !== null) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">🎯 Stage View Working!</h1>
          <p className="text-xl">You are viewing Stage {currentStage}</p>
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
          <h2 className="text-2xl font-bold mb-4">Applications for Stage {currentStage}</h2>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="management">Application Management</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="pathways">New Applications</TabsTrigger>
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

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <AdmissionsFlowVisualization />
          <StageDetailBreakdown />
          <AdmissionsWorkflow />
        </TabsContent>

        {/* New Applications Tab */}
        <TabsContent value="pathways" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Application Pathways</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Application creation functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Reports and analytics functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAdmissionsPage;