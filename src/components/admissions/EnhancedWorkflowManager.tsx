import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AdmissionsFeeService } from '@/services/AdmissionsFeeService';

interface Application {
  id: string;
  application_number: string;
  student_name: string;
  year_group: string;
  status: string;
  parent_email: string;
  school_id: string;
  submitted_at: string;
  additional_data?: any;
}

export function EnhancedWorkflowManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  const stages = [
    { key: 'submitted', title: 'Application Submitted', nextKey: 'under_review', autoProgress: false },
    { key: 'under_review', title: 'Application Review & Verify', nextKey: 'assessment_scheduled', autoProgress: false },
    { key: 'assessment_scheduled', title: 'Assessment/Interview', nextKey: 'approved', autoProgress: false },
    { key: 'approved', title: 'Admission Decision', nextKey: 'offer_sent', autoProgress: false },
    { key: 'offer_sent', title: 'Fee Payment', nextKey: 'offer_accepted', autoProgress: true },
    { key: 'offer_accepted', title: 'Enrollment Confirmation', nextKey: 'enrolled', autoProgress: false },
    { key: 'enrolled', title: 'Welcome & Onboarding', nextKey: null, autoProgress: false }
  ];

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    }
  };

  const processStageTransition = async (application: Application, newStage: string) => {
    try {
      // Check if fees need to be assigned for this stage
      if (AdmissionsFeeService.isPaymentStage(newStage)) {
        console.log(`🎯 Assigning fees for stage: ${newStage}`);
        const feeResult = await AdmissionsFeeService.assignFeesForStage(
          application.id,
          newStage,
          application
        );

        if (!feeResult.success) {
          throw new Error(`Fee assignment failed: ${feeResult.error}`);
        }

        console.log(`✅ Fees assigned successfully for ${application.student_name}`);
      }

      // Update application status
      const { error } = await supabase
        .from('enrollment_applications')
        .update({ 
          status: newStage as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error processing stage transition:', error);
      return { success: false, error: error.message };
    }
  };

  const processAllStages = async () => {
    setProcessing(true);
    setProcessedCount(0);
    setResults({ success: 0, failed: 0, errors: [] });

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process each application through appropriate stage transitions
    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      const currentStageIndex = stages.findIndex(s => s.key === app.status);
      
      if (currentStageIndex === -1 || currentStageIndex === stages.length - 1) {
        setProcessedCount(i + 1);
        continue; // Skip if stage not found or already at final stage
      }

      const currentStage = stages[currentStageIndex];
      if (currentStage.nextKey && currentStage.autoProgress) {
        console.log(`Processing ${app.student_name} from ${currentStage.title} to next stage`);
        
        const result = await processStageTransition(app, currentStage.nextKey);
        
        if (result.success) {
          successCount++;
          console.log(`✅ ${app.student_name} advanced to ${currentStage.nextKey}`);
        } else {
          failedCount++;
          errors.push(`${app.application_number}: ${result.error}`);
        }
      }
      
      setProcessedCount(i + 1);
      setResults({ success: successCount, failed: failedCount, errors });
      
      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setProcessing(false);
    
    // Refresh data after processing
    await fetchAllApplications();
    
    toast({
      title: "Processing Complete",
      description: `Successfully processed ${successCount} applications. ${failedCount} failed.`,
      variant: successCount > 0 ? "default" : "destructive"
    });
  };

  const moveApplicationToNextStage = async (application: Application) => {
    const currentStageIndex = stages.findIndex(s => s.key === application.status);
    if (currentStageIndex === -1 || currentStageIndex === stages.length - 1) {
      toast({
        title: "No Next Stage",
        description: "Application is already at the final stage",
        variant: "destructive"
      });
      return;
    }

    const nextStage = stages[currentStageIndex + 1];
    const result = await processStageTransition(application, nextStage.key);

    if (result.success) {
      toast({
        title: "Stage Advanced",
        description: `${application.student_name} moved to ${nextStage.title}`,
      });
      await fetchAllApplications();
    } else {
      toast({
        title: "Stage Transition Failed",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const getStageStats = () => {
    const stats = stages.map(stage => ({
      ...stage,
      count: applications.filter(app => app.status === stage.key).length
    }));
    return stats;
  };

  const stageStats = getStageStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Enhanced Workflow Manager
          </CardTitle>
          <p className="text-muted-foreground">
            Automated stage progression with fee assignment and status tracking
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Processing Progress */}
          {processing && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing Applications</span>
                    <span>{processedCount} / {applications.length}</span>
                  </div>
                  <Progress 
                    value={applications.length > 0 ? (processedCount / applications.length) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={processAllStages}
              disabled={processing || applications.length === 0}
              className="flex-1"
            >
              {processing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing Stages...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Process Auto-Progress Stages
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={fetchAllApplications}
              disabled={processing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Results Display */}
          {(results.success > 0 || results.failed > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.success}</div>
                    <div className="text-sm text-muted-foreground">Successfully Processed</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Errors Display */}
          {results.errors.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Errors encountered:</div>
                  <div className="text-sm space-y-1">
                    {results.errors.slice(0, 5).map((error, index) => (
                      <div key={index} className="text-red-600">• {error}</div>
                    ))}
                    {results.errors.length > 5 && (
                      <div className="text-muted-foreground">... and {results.errors.length - 5} more</div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Stage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stageStats.map((stage, index) => (
              <Card key={stage.key}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{stage.title}</h4>
                      <Badge variant={stage.autoProgress ? "default" : "secondary"}>
                        {stage.autoProgress ? "Auto" : "Manual"}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{stage.count}</div>
                    <div className="text-xs text-muted-foreground">
                      Stage {index + 1} of {stages.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications by Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Applications by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stageStats.filter(stage => stage.count > 0).map((stage) => (
              <div key={stage.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{stage.title} ({stage.count})</h4>
                  {stage.autoProgress && (
                    <Badge variant="outline">Auto-Progress Enabled</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {applications
                    .filter(app => app.status === stage.key)
                    .slice(0, 5)
                    .map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{app.student_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.application_number} • {app.year_group}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{stage.title}</Badge>
                          {!stage.autoProgress && stage.nextKey && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveApplicationToNextStage(app)}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  {applications.filter(app => app.status === stage.key).length > 5 && (
                    <div className="text-center text-sm text-muted-foreground">
                      ... and {applications.filter(app => app.status === stage.key).length - 5} more applications
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}