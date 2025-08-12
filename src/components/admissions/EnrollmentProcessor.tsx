import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertTriangle, UserPlus, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function EnrollmentProcessor() {
  const [processing, setProcessing] = useState(false);
  const [enrolledApps, setEnrolledApps] = useState<any[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  const fetchEnrolledApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('status', 'enrolled')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrolledApps(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching enrolled applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch enrolled applications",
        variant: "destructive"
      });
      return [];
    }
  };

  const processEnrolledApplication = async (application: any) => {
    try {
      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('school_id', application.school_id)
        .ilike('student_number', `%${application.application_number}%`)
        .single();

      if (existingStudent) {
        console.log(`Student already exists for application ${application.application_number}`);
        return { success: true, message: 'Already exists' };
      }

      // Extract student and parent data from the application
      const additionalData = application.additional_data as any;
      const pathwayData = additionalData?.pathway_data || additionalData?.submitted_data || {};
      
      const studentData = {
        first_name: pathwayData.student_name?.split(' ')[0] || application.student_name?.split(' ')[0] || 'Unknown',
        last_name: pathwayData.student_name?.split(' ').slice(1).join(' ') || application.student_name?.split(' ').slice(1).join(' ') || 'Student',
        email: pathwayData.student_email || `${application.application_number.replace(/[^0-9a-z]/gi, '')}@school.edu`,
        student_number: application.application_number.replace(/[^0-9]/g, '') || `STU${Date.now().toString().slice(-6)}`,
        year_group: pathwayData.year_group || application.year_group || 'Year 7',
        form_class: pathwayData.form_class_preference || application.form_class_preference,
        date_of_birth: pathwayData.date_of_birth || application.date_of_birth,
        emergency_contact_name: pathwayData.emergency_contact_name || application.emergency_contact_name || pathwayData.parent_name || application.parent_name,
        emergency_contact_phone: pathwayData.emergency_contact_phone || application.emergency_contact_phone || pathwayData.parent_phone || application.parent_phone,
        medical_notes: pathwayData.medical_information || application.medical_information,
        phone: pathwayData.student_phone || application.student_phone,
      };

      // Extract parent data
      const parentData = {
        first_name: pathwayData.parent_name?.split(' ')[0] || application.parent_name?.split(' ')[0] || 'Parent',
        last_name: pathwayData.parent_name?.split(' ').slice(1).join(' ') || application.parent_name?.split(' ').slice(1).join(' ') || 'Parent',
        email: pathwayData.parent_email || application.parent_email,
        phone: pathwayData.parent_phone || application.parent_phone,
        relationship: pathwayData.parent_relationship || 'Parent'
      };

      console.log('Creating complete student enrollment with data:', { studentData, parentData });

      // Create complete student enrollment with student and parent accounts
      const { data, error } = await supabase
        .rpc('create_complete_student_enrollment', {
          student_data: studentData,
          parent_data: parentData,
          school_id: application.school_id,
          application_id: application.id
        });

      if (error) {
        console.error('Error creating complete student enrollment:', error);
        throw error;
      }

      console.log('✅ Complete student enrollment created successfully:', data);
      
      // Cast data to proper type and return detailed result including credentials
      const enrollmentData = data as any;
      
      // Send welcome emails automatically
      try {
        const emailData = {
          studentData: {
            email: enrollmentData.student_email,
            name: pathwayData.student_name || application.student_name || 'Student',
            studentNumber: studentData.student_number,
            yearGroup: studentData.year_group,
            tempPassword: enrollmentData.student_temp_password
          },
          parentData: enrollmentData.parent_email ? {
            email: enrollmentData.parent_email,
            name: pathwayData.parent_name || application.parent_name || 'Parent',
            tempPassword: enrollmentData.parent_temp_password,
            relationship: parentData.relationship
          } : undefined,
          schoolName: 'Your School' // You can make this dynamic from school settings
        };

        const emailResult = await supabase.functions.invoke('send-enrollment-emails', {
          body: emailData
        });

        if (emailResult.error) {
          console.warn('Failed to send enrollment emails:', emailResult.error);
        } else {
          console.log('✅ Enrollment emails sent successfully:', emailResult.data);
        }
      } catch (emailError) {
        console.warn('Error sending enrollment emails:', emailError);
        // Don't fail the enrollment process if emails fail
      }
      
      return { 
        success: true, 
        data: enrollmentData,
        credentials: {
          student: {
            email: enrollmentData.student_email,
            password: enrollmentData.student_temp_password
          },
          parent: enrollmentData.parent_email ? {
            email: enrollmentData.parent_email,
            password: enrollmentData.parent_temp_password
          } : null
        }
      };

    } catch (error: any) {
      console.error('Error processing application:', error);
      return { success: false, error: error.message };
    }
  };

  const processAllEnrolledApplications = async () => {
    setProcessing(true);
    setProcessedCount(0);
    setResults({ success: 0, failed: 0, errors: [] });

    const applications = await fetchEnrolledApplications();
    
    if (applications.length === 0) {
      toast({
        title: "No Applications",
        description: "No enrolled applications found to process"
      });
      setProcessing(false);
      return;
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      console.log(`Processing application ${i + 1}/${applications.length}: ${app.application_number}`);
      
      const result = await processEnrolledApplication(app);
      
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
        errors.push(`${app.application_number}: ${result.error}`);
      }
      
      setProcessedCount(i + 1);
      setResults({ success: successCount, failed: failedCount, errors });
      
      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setProcessing(false);
    
    toast({
      title: "Processing Complete",
      description: `Successfully created ${successCount} students and sent welcome emails. ${failedCount} failed.`,
      variant: successCount > 0 ? "default" : "destructive"
    });
  };

  React.useEffect(() => {
    fetchEnrolledApplications();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          Enrollment Processor
        </CardTitle>
        <p className="text-muted-foreground">
          Convert enrolled applications to actual student records in the system
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{enrolledApps.length}</div>
                <div className="text-sm text-muted-foreground">Enrolled Applications</div>
              </div>
            </CardContent>
          </Card>
          
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

        {/* Processing Progress */}
        {processing && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing Applications</span>
                  <span>{processedCount} / {enrolledApps.length}</span>
                </div>
                <Progress 
                  value={enrolledApps.length > 0 ? (processedCount / enrolledApps.length) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={processAllEnrolledApplications}
            disabled={processing || enrolledApps.length === 0}
            className="flex-1"
          >
            {processing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Process All Enrolled Applications
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={fetchEnrolledApplications}
            disabled={processing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

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

        {/* Applications List */}
        {enrolledApps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {enrolledApps.slice(0, 10).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{app.student_name || 'Unknown Student'}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.application_number} • {app.year_group || 'No year group'}
                      </div>
                    </div>
                    <Badge variant="secondary">Enrolled</Badge>
                  </div>
                ))}
                {enrolledApps.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    ... and {enrolledApps.length - 10} more applications
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}