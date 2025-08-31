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
      // First check if this application has already been processed
      if (application.additional_data?.student_record_id) {
        console.log(`Application ${application.application_number} already processed - skipping`);
        return { success: true, message: 'Already processed' };
      }

      // Check if student already exists by email or similar application data
      const sourceData = application.additional_data?.submitted_data || application.additional_data?.pathway_data || {};
      const potentialEmail = sourceData.student_email || 
                           `${application.application_number.replace(/[^0-9a-z]/gi, '').toLowerCase()}@school.edu`;
      
      // First check if email already exists in profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', potentialEmail)
        .maybeSingle();

      if (existingProfile) {
        console.log(`Email ${potentialEmail} already exists - skipping application ${application.application_number}`);
        return { success: false, error: `Email ${potentialEmail} already in use` };
      }

      // Extract student and parent data from the application
      const applicationData = application.additional_data as any;
      
      // Try submitted_data first (most complete), then pathway_data, then fallback to application fields
      const enrollmentSourceData = applicationData?.submitted_data || applicationData?.pathway_data || {};
      
      // Ensure we have student name
      const fullStudentName = enrollmentSourceData.student_name || application.student_name || 'Unknown Student';
      const nameParts = fullStudentName.split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || 'Student';
      
      // Build robust student data
      const studentData = {
        first_name: firstName,
        last_name: lastName,
        email: enrollmentSourceData.student_email || `${application.application_number.replace(/[^0-9a-z]/gi, '')}@school.edu`,
        student_number: application.application_number.replace(/[^0-9]/g, '') || `STU${Date.now().toString().slice(-6)}`,
        year_group: enrollmentSourceData.year_group || application.year_group || 'Year 7',
        form_class: enrollmentSourceData.form_class_preference || application.form_class_preference || null,
        date_of_birth: enrollmentSourceData.date_of_birth || application.date_of_birth || null,
        emergency_contact_name: enrollmentSourceData.emergency_contact_name || application.emergency_contact_name || `${firstName} Emergency Contact`,
        emergency_contact_phone: enrollmentSourceData.emergency_contact_phone || enrollmentSourceData.parent_phone || application.parent_phone || null,
        medical_notes: enrollmentSourceData.medical_information || application.medical_information || null,
        phone: enrollmentSourceData.student_phone || application.student_phone || null,
      };

      // Build robust student data with temporary password
      const studentTempPassword = `Temp${studentData.student_number}!`;
      const studentDataWithAuth = {
        ...studentData,
        password: studentTempPassword
      };

      // Extract parent data with better fallbacks
      const parentFullName = enrollmentSourceData.parent_name || application.parent_name || 'Parent Guardian';
      const parentNameParts = parentFullName.split(' ');
      const parentFirstName = parentNameParts[0] || 'Parent';
      const parentLastName = parentNameParts.slice(1).join(' ') || 'Guardian';
      
      const parentTempPassword = `Parent${Date.now().toString().slice(-6)}!`;
      const parentData = {
        first_name: parentFirstName,
        last_name: parentLastName,
        email: enrollmentSourceData.parent_email || application.parent_email || null,
        phone: enrollmentSourceData.parent_phone || application.parent_phone || null,
        relationship: enrollmentSourceData.parent_relationship || enrollmentSourceData.emergency_contact_relationship || 'Parent',
        password: parentTempPassword
      };

      console.log('Creating complete student enrollment with data:', { 
        applicationNumber: application.application_number,
        studentData: studentDataWithAuth, 
        parentData,
        sourceDataKeys: Object.keys(enrollmentSourceData)
      });

      // Create complete student enrollment with student and parent accounts
      const { data, error } = await supabase
        .functions.invoke('create-student-accounts', {
          body: {
            student_data: studentDataWithAuth,
            parent_data: parentData,
            school_id: application.school_id,
            application_id: application.id
          }
        });

      if (error) {
        console.error('❌ ERROR creating complete student enrollment for', application.application_number);
        console.error('Full error details:', error);
        console.error('Student data:', studentDataWithAuth);
        console.error('Parent data:', parentData);
        console.error('School ID:', application.school_id);
        console.error('Application ID:', application.id);
        throw error;
      }

      console.log('✅ Complete student enrollment created successfully:', data);
      
      // Cast data to proper type and return detailed result including credentials
      const enrollmentData = data as any;
      
      // Send welcome emails automatically
      try {
        const emailData = {
          studentData: {
            email: studentDataWithAuth.email,
            name: enrollmentSourceData.student_name || application.student_name || `${firstName} ${lastName}`,
            studentNumber: studentDataWithAuth.student_number,
            yearGroup: studentDataWithAuth.year_group,
            tempPassword: studentTempPassword
          },
          parentData: parentData.email ? {
            email: parentData.email,
            name: `${parentData.first_name} ${parentData.last_name}`,
            tempPassword: parentTempPassword,
            relationship: parentData.relationship
          } : undefined,
          schoolName: 'Doxa Academy'
        };

        console.log('Sending enrollment emails with data:', emailData);

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
            email: studentDataWithAuth.email,
            password: studentTempPassword
          },
          parent: parentData.email ? {
            email: parentData.email,
            password: parentTempPassword
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

    // Deduplicate applications - keep only the latest per student name
    const deduplicatedApps = new Map();
    applications.forEach(app => {
      const studentName = app.student_name?.toLowerCase().trim();
      if (!studentName) return;
      
      const existing = deduplicatedApps.get(studentName);
      if (!existing || new Date(app.created_at) > new Date(existing.created_at)) {
        deduplicatedApps.set(studentName, app);
      }
    });

    const uniqueApplications = Array.from(deduplicatedApps.values());
    console.log(`Deduplicated ${applications.length} applications to ${uniqueApplications.length} unique students`);

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < uniqueApplications.length; i++) {
      const app = uniqueApplications[i];
      console.log(`Processing application ${i + 1}/${uniqueApplications.length}: ${app.application_number} (${app.student_name})`);
      
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
      description: `Successfully created ${successCount} students from ${uniqueApplications.length} unique applications (deduplicated from ${applications.length} total). ${failedCount} failed.`,
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