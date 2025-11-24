import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, AlertCircle, FileText, User, Download, Loader2, Mail, Phone, MapPin, School } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApplicationSubmittedStageProps {
  applicationId: string;
  applicationData: any;
  onMoveToNext: () => void;
}

export function ApplicationSubmittedStage({ applicationId, applicationData, onMoveToNext }: ApplicationSubmittedStageProps) {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      
      // Merge data from additional_data into the main object
      const additionalData = data.additional_data as any;
      const mergedData = {
        ...data,
        ...(additionalData?.pathway_data || {}),
        ...(additionalData?.submitted_data || {})
      };
      
      setApplication(mergedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch application details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadApplication = () => {
    if (!application) return;

    const content = `
ENROLLMENT APPLICATION SUMMARY
================================

Application Number: ${application.application_number || 'N/A'}
Submission Date: ${application.submitted_at ? new Date(application.submitted_at).toLocaleString() : 'N/A'}
Status: ${application.status || 'N/A'}

STUDENT INFORMATION
-------------------
Name: ${application.student_name || 'N/A'}
Date of Birth: ${application.date_of_birth || 'N/A'}
Gender: ${application.gender || 'N/A'}
Mother Tongue: ${application.mother_tongue || 'N/A'}
Religion: ${application.religion || 'N/A'}
Nationality: ${application.nationality || 'N/A'}

PARENT/GUARDIAN INFORMATION
---------------------------
Father's Email: ${application.father_email || 'N/A'}
Father's Mobile: ${application.father_mobile || 'N/A'}

Mother's Name: ${application.mother_name || 'N/A'}
Mother's Profession: ${application.mother_profession || 'N/A'}
Mother's Mobile: ${application.mother_mobile || 'N/A'}
Mother's Email: ${application.mother_email || 'N/A'}

ADDRESS
-------
House No: ${application.communication_house_no || 'N/A'}
Street: ${application.communication_street || 'N/A'}
City: ${application.communication_city || 'N/A'}
District: ${application.communication_district || 'N/A'}
State: ${application.communication_state || application.state || 'N/A'}
Postal Code: ${application.communication_postal_code || 'N/A'}
Country: ${application.country || 'N/A'}

ACADEMIC INFORMATION
--------------------
Year Group: ${application.year_group || 'N/A'}
APAR ID: ${application.apar_id || 'N/A'}
Sibling in School: ${application.has_sibling_in_school || 'N/A'}

MEDICAL INFORMATION
-------------------
Chronic Diseases: ${application.chronic_diseases || 'None'}
Medicine/Treatment: ${application.medicine_treatment || 'None'}

ADDITIONAL INFORMATION
----------------------
Pathway: ${application.pathway || 'N/A'}
Bursary Application: ${application.bursary_application ? 'Yes' : 'No'}
Scholarship Application: ${application.scholarship_application ? 'Yes' : 'No'}

Notes: ${application.academic_notes || 'None'}

================================
Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application-${application.application_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Application summary downloaded successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Application not found</p>
        </CardContent>
      </Card>
    );
  }

  const validationChecks = [
    { 
      id: 'personal_details', 
      label: 'Personal Details Complete', 
      status: application.student_name && application.date_of_birth && application.gender ? 'completed' : 'pending'
    },
    { 
      id: 'parent_details', 
      label: 'Parent/Guardian Details', 
      status: (application.mother_name && (application.father_email || application.mother_email)) ? 'completed' : 'pending'
    },
    { 
      id: 'address', 
      label: 'Address Information', 
      status: (application.communication_street && application.communication_city && application.communication_state) ? 'completed' : 'pending'
    },
    { 
      id: 'medical_info', 
      label: 'Medical Information', 
      status: (application.chronic_diseases || application.medicine_treatment) ? 'completed' : 'pending'
    },
    { 
      id: 'academic_info', 
      label: 'Academic Information', 
      status: application.year_group ? 'completed' : 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>;
      case 'pending': return <Badge variant="secondary">Incomplete</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Application Number</p>
              <p className="font-medium">{application.application_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student Name</p>
              <p className="font-medium">{application.student_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year Group</p>
              <p className="font-medium">{application.year_group}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>
              <p className="font-medium">{new Date(application.submitted_at || application.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Initial Validation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {validationChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <span className="font-medium">{check.label}</span>
                </div>
                {getStatusBadge(check.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                View Full Application Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view complete application information including student details, parent/guardian information, address, and academic history
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Application Details</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="parents">Parents/Guardian</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{application.student_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{application.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mother Tongue</p>
                  <p className="font-medium">{application.mother_tongue || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Religion</p>
                  <p className="font-medium">{application.religion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{application.nationality || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Caste</p>
                  <p className="font-medium">{application.caste || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{application.blood_group || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Food Choice</p>
                  <p className="font-medium">{application.food_choice || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">APAR ID</p>
                  <p className="font-medium">{application.apar_id || 'N/A'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="parents" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Father's Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-medium">{application.father_email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Mobile
                    </p>
                    <p className="font-medium">{application.father_mobile || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mother's Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{application.mother_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profession</p>
                    <p className="font-medium">{application.mother_profession || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Mobile
                    </p>
                    <p className="font-medium">{application.mother_mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-medium">{application.mother_email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Medical Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Chronic Diseases</p>
                    <p className="font-medium">{application.chronic_diseases || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Medicine/Treatment</p>
                    <p className="font-medium">{application.medicine_treatment || 'None'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">House No</p>
                  <p className="font-medium">{application.communication_house_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Street</p>
                  <p className="font-medium">{application.communication_street || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{application.communication_city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="font-medium">{application.communication_district || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium">{application.communication_state || application.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Postal Code</p>
                  <p className="font-medium">{application.communication_postal_code || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{application.country || 'N/A'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="academic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Applying for Year Group</p>
                  <p className="font-medium">{application.year_group || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pathway</p>
                  <p className="font-medium">{application.pathway || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">APAR ID</p>
                  <p className="font-medium">{application.apar_id || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sibling Information</h3>
                <div>
                  <p className="text-sm text-muted-foreground">Has Sibling in School</p>
                  <p className="font-medium">{application.has_sibling_in_school || 'N/A'}</p>
                </div>
              </div>

              {application.bursary_application && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Bursary Application: Yes</p>
                  <p className="text-sm text-blue-700 mt-1">This family has applied for financial assistance</p>
                </div>
              )}

              {application.academic_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Additional Notes</p>
                  <p className="font-medium">{application.academic_notes}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownloadApplication}
            >
              <Download className="h-4 w-4" />
              Download Application Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Stage Action */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ready to proceed to Document Verification?</p>
              <p className="text-sm text-muted-foreground">
                Ensure all validation checks are complete before moving to the next stage.
              </p>
            </div>
            <Button onClick={onMoveToNext} className="ml-4">
              Move to Document Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
