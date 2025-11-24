import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ApplicationWorkflow } from './ApplicationWorkflow';
import { ApplicationTimeline } from './ApplicationTimeline';
import { ApplicationDocuments } from './ApplicationDocuments';
import { ApplicationNotes } from './ApplicationNotes';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  School,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Send,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ApplicationDetailProps {
  applicationId: string;
  onBack: () => void;
  getStatusColor: (status: string) => string;
}

interface ApplicationData {
  id: string;
  application_number: string;
  student_name: string;
  year_group: string;
  pathway: string;
  status: string;
  submitted_at: string;
  date_of_birth: string;
  gender?: string;
  nationality?: string;
  parent_name: string;
  parent_email: string;
  parent_phone?: string;
  parent_relationship?: string;
  home_address?: string;
  postal_code?: string;
  country?: string;
  previous_school?: string;
  current_year_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  medical_information?: string;
  special_requirements?: string;
  workflow_completion_percentage?: number;
  priority_score?: number;
  additional_data?: any;
  school_id?: string;
}

export function ApplicationDetail({ applicationId, onBack, getStatusColor }: ApplicationDetailProps) {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      
      // Merge additional_data into main application object
      const additionalData = data.additional_data as any;
      const mergedData = {
        ...data,
        ...(additionalData?.pathway_data || {}),
        ...(additionalData?.submitted_data || {}),
      };
      
      setApplication(mergedData);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .update({ status: newStatus as any })
        .eq('id', applicationId);

      if (error) throw error;
      
      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const handleFollowUp = async () => {
    if (!application) return;
    
    try {
      // Create a follow-up communication record
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) {
        throw new Error('User not authenticated');
      }

      const followUpMessage = {
        title: `Follow-up: ${application.student_name} Application`,
        content: `This is a follow-up regarding the application for ${application.student_name} (${application.application_number}). Please provide the requested documents or information to proceed with the application process.`,
        communication_type: 'parent_communication' as const,
        audience_type: 'specific_parents' as const,
        status: 'draft' as const,
        priority: 'normal' as const,
        school_id: application.school_id,
        created_by: user.data.user.id,
        audience_details: {
          parent_emails: [application.parent_email]
        },
        metadata: {
          application_id: applicationId,
          follow_up_type: 'document_request'
        }
      };

      const { error } = await supabase
        .from('communications')
        .insert([followUpMessage]);

      if (error) throw error;

      toast({
        title: "Follow-up Created",
        description: `Follow-up communication created for ${application.student_name}'s application`,
      });
    } catch (error) {
      console.error('Error creating follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to create follow-up communication",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDraft = async () => {
    if (!application) return;
    
    if (!confirm(`Are you sure you want to delete the draft application for ${application.student_name}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Draft Deleted",
        description: `Draft application for ${application.student_name} has been deleted successfully`,
      });

      // Go back to applications list
      onBack();
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete draft application",
        variant: "destructive"
      });
    }
  };

  const handleReschedule = async () => {
    if (!application) return;
    
    toast({
      title: "Reschedule Request",
      description: `Reschedule options for ${application.student_name} will be available soon. Please contact the applicant directly for now.`,
    });
  };

  const handleViewStudentProfile = () => {
    if (!application?.additional_data?.student_record_id) {
      toast({
        title: "Error",
        description: "Student record not found. The enrollment may not be complete.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to students page with the specific student ID as a parameter
    navigate(`/students?highlight=${application.additional_data.student_record_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-24 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Application not found</h3>
              <p className="text-muted-foreground">The requested application could not be loaded.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusActions = (status: string) => {
    const actions = {
      submitted: [
        { label: 'Start Review', action: () => handleStatusUpdate('under_review'), variant: 'default' as const },
        { label: 'Request Documents', action: () => handleStatusUpdate('documents_pending'), variant: 'outline' as const }
      ],
      under_review: [
        { label: 'Schedule Assessment', action: () => handleStatusUpdate('assessment_scheduled'), variant: 'default' as const },
        { label: 'Request Interview', action: () => handleStatusUpdate('interview_scheduled'), variant: 'outline' as const },
        { label: 'Reject Application', action: () => handleStatusUpdate('rejected'), variant: 'destructive' as const }
      ],
      documents_pending: [
        { label: 'Documents Received', action: () => handleStatusUpdate('under_review'), variant: 'default' as const },
        { label: 'Follow Up', action: handleFollowUp, variant: 'outline' as const }
      ],
      assessment_scheduled: [
        { label: 'Assessment Complete', action: () => handleStatusUpdate('assessment_complete'), variant: 'default' as const },
        { label: 'Reschedule', action: handleReschedule, variant: 'outline' as const }
      ],
      assessment_complete: [
        { label: 'Schedule Interview', action: () => handleStatusUpdate('interview_scheduled'), variant: 'default' as const },
        { label: 'Move to Decision', action: () => handleStatusUpdate('pending_approval'), variant: 'outline' as const }
      ],
      interview_scheduled: [
        { label: 'Interview Complete', action: () => handleStatusUpdate('interview_complete'), variant: 'default' as const },
        { label: 'Reschedule', action: handleReschedule, variant: 'outline' as const }
      ],
      interview_complete: [
        { label: 'Move to Decision', action: () => handleStatusUpdate('pending_approval'), variant: 'default' as const }
      ],
      pending_approval: [
        { label: 'Approve', action: () => handleStatusUpdate('approved'), variant: 'default' as const },
        { label: 'Put on Hold', action: () => handleStatusUpdate('on_hold'), variant: 'outline' as const },
        { label: 'Reject', action: () => handleStatusUpdate('rejected'), variant: 'destructive' as const }
      ],
      approved: [
        { label: 'Send Offer', action: () => handleStatusUpdate('offer_sent'), variant: 'default' as const }
      ],
      offer_sent: [
        { label: 'Offer Accepted', action: () => handleStatusUpdate('offer_accepted'), variant: 'default' as const },
        { label: 'Offer Declined', action: () => handleStatusUpdate('offer_declined'), variant: 'outline' as const }
      ],
      offer_accepted: [
        { label: 'Complete Enrollment', action: () => handleStatusUpdate('enrolled'), variant: 'default' as const }
      ],
      on_hold: [
        { label: 'Resume Application', action: () => handleStatusUpdate('under_review'), variant: 'default' as const },
        { label: 'Request Documents', action: () => handleStatusUpdate('documents_pending'), variant: 'outline' as const },
        { label: 'Reject Application', action: () => handleStatusUpdate('rejected'), variant: 'destructive' as const }
      ],
      draft: [
        { label: 'Submit Application', action: () => handleStatusUpdate('submitted'), variant: 'default' as const },
        { label: 'Delete Draft', action: () => handleDeleteDraft(), variant: 'destructive' as const }
      ],
      rejected: [
        { label: 'Reconsider Application', action: () => handleStatusUpdate('under_review'), variant: 'outline' as const }
      ],
      enrolled: [
        { label: 'View Student Profile', action: handleViewStudentProfile, variant: 'outline' as const }
      ]
    };
    return actions[status as keyof typeof actions] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {application.student_name}
              </h1>
              <p className="text-muted-foreground">
                Application {application.application_number}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Student Summary Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600">
                <AvatarFallback className="text-white font-semibold text-lg">
                  {application.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Student Details</p>
                  <div className="space-y-1">
                    <p className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {application.student_name}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(application.date_of_birth), 'dd MMM yyyy')}
                    </p>
                    {application.nationality && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {application.nationality}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Academic Info</p>
                  <div className="space-y-1">
                    <p className="font-medium">Year {application.year_group}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {application.pathway.replace('_', ' ')} Pathway
                    </p>
                    {application.previous_school && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <School className="h-4 w-4" />
                        {application.previous_school}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Parent Contact</p>
                  <div className="space-y-1">
                    <p className="font-medium">{application.parent_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {application.parent_email}
                    </p>
                    {application.parent_phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {application.parent_phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Progress</p>
                  <div className="space-y-2">
                    <Progress value={application.workflow_completion_percentage || 0} className="h-2" />
                    <p className="text-sm font-medium">
                      {application.workflow_completion_percentage || 0}% Complete
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Priority Score: {application.priority_score || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
              {getStatusActions(application.status).map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="sm"
                  onClick={action.action}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full Application Details Dialog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              View Full Application Details
            </CardTitle>
            <CardDescription>
              View comprehensive application information including all submitted data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Open Full Application Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Complete Application Details: {application.student_name}</DialogTitle>
                </DialogHeader>
                
                {/* Standard/SEN Pathway */}
                {(application.pathway === 'standard' || application.pathway === 'sen') && (
                  <Tabs defaultValue="student" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="student">Student</TabsTrigger>
                      <TabsTrigger value="family">Family</TabsTrigger>
                      <TabsTrigger value="address">Address</TabsTrigger>
                      <TabsTrigger value="academic">Academic</TabsTrigger>
                      {application.pathway === 'sen' && <TabsTrigger value="sen">SEN Info</TabsTrigger>}
                      {application.pathway === 'standard' && <TabsTrigger value="references">References</TabsTrigger>}
                    </TabsList>

                    <TabsContent value="student" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Student Name</p><p className="text-sm">{(application as any).student_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Date of Birth</p><p className="text-sm">{(application as any).date_of_birth ? format(new Date((application as any).date_of_birth), 'dd MMM yyyy') : 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Gender</p><p className="text-sm">{(application as any).gender || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Mother Tongue</p><p className="text-sm">{(application as any).mother_tongue || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">State</p><p className="text-sm">{(application as any).state || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Blood Group</p><p className="text-sm">{(application as any).blood_group || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Nationality</p><p className="text-sm">{(application as any).nationality || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Religion</p><p className="text-sm">{(application as any).religion || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">APAR ID</p><p className="text-sm">{(application as any).apar_id || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Caste</p><p className="text-sm">{(application as any).caste || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Caste Classification</p><p className="text-sm">{(application as any).caste_classification || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Aadhaar Number</p><p className="text-sm">{(application as any).aadhaar_number || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Ration Card Number</p><p className="text-sm">{(application as any).ration_card_number || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">UDISE Number</p><p className="text-sm">{(application as any).udise_number || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Food Choice</p><p className="text-sm">{(application as any).food_choice || 'Not specified'}</p></div>
                        <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Chronic Diseases</p><p className="text-sm">{(application as any).chronic_diseases || 'Not provided'}</p></div>
                        <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Medicine Treatment</p><p className="text-sm">{(application as any).medicine_treatment || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Year Group</p><p className="text-sm">{(application as any).year_group || 'Not specified'}</p></div>
                      </div>
                    </TabsContent>

                    <TabsContent value="family" className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Father Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">Name</p><p className="text-sm">{(application as any).father_name || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Profession</p><p className="text-sm">{(application as any).father_profession || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Mobile</p><p className="text-sm">{(application as any).father_mobile || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Email</p><p className="text-sm">{(application as any).father_email || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Monthly Income</p><p className="text-sm">{(application as any).father_monthly_income || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Organization</p><p className="text-sm">{(application as any).father_organization || 'Not provided'}</p></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Mother Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">Name</p><p className="text-sm">{(application as any).mother_name || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Profession</p><p className="text-sm">{(application as any).mother_profession || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Mobile</p><p className="text-sm">{(application as any).mother_mobile || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Email</p><p className="text-sm">{(application as any).mother_email || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Monthly Income</p><p className="text-sm">{(application as any).mother_monthly_income || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Organization</p><p className="text-sm">{(application as any).mother_organization || 'Not provided'}</p></div>
                        </div>
                      </div>
                      {((application as any).guardian_name) && (
                        <div>
                          <h4 className="font-semibold mb-3">Guardian Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-sm font-medium text-muted-foreground">Name</p><p className="text-sm">{(application as any).guardian_name}</p></div>
                            <div><p className="text-sm font-medium text-muted-foreground">Profession</p><p className="text-sm">{(application as any).guardian_profession || 'Not provided'}</p></div>
                            <div><p className="text-sm font-medium text-muted-foreground">Mobile</p><p className="text-sm">{(application as any).guardian_mobile || 'Not provided'}</p></div>
                            <div><p className="text-sm font-medium text-muted-foreground">Email</p><p className="text-sm">{(application as any).guardian_email || 'Not provided'}</p></div>
                            <div><p className="text-sm font-medium text-muted-foreground">Monthly Income</p><p className="text-sm">{(application as any).guardian_monthly_income || 'Not provided'}</p></div>
                            <div><p className="text-sm font-medium text-muted-foreground">Organization</p><p className="text-sm">{(application as any).guardian_organization || 'Not provided'}</p></div>
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold mb-3">Sibling Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">Has Sibling in School</p><p className="text-sm">{(application as any).has_sibling_in_school || 'Not specified'}</p></div>
                          {((application as any).sibling_information) && (
                            <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Sibling Details</p><p className="text-sm">{(application as any).sibling_information}</p></div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="address" className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Permanent Address</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">House No</p><p className="text-sm">{(application as any).permanent_house_no || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Street</p><p className="text-sm">{(application as any).permanent_street || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">City</p><p className="text-sm">{(application as any).permanent_city || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">District</p><p className="text-sm">{(application as any).permanent_district || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">State</p><p className="text-sm">{(application as any).permanent_state || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Postal Code</p><p className="text-sm">{(application as any).permanent_postal_code || 'Not provided'}</p></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Communication Address</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">House No</p><p className="text-sm">{(application as any).communication_house_no || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Street</p><p className="text-sm">{(application as any).communication_street || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">City</p><p className="text-sm">{(application as any).communication_city || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">District</p><p className="text-sm">{(application as any).communication_district || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">State</p><p className="text-sm">{(application as any).communication_state || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Postal Code</p><p className="text-sm">{(application as any).communication_postal_code || 'Not provided'}</p></div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="academic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Class Last Studied</p><p className="text-sm">{(application as any).class_last_studied || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">School Last Studied</p><p className="text-sm">{(application as any).school_last_studied || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Class Seeking Admission</p><p className="text-sm">{(application as any).class_seeking_admission || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Last School Location</p><p className="text-sm">{(application as any).last_school_location || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Language Studied</p><p className="text-sm">{(application as any).language_studied || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Last Syllabus</p><p className="text-sm">{(application as any).last_syllabus || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Group First Choice</p><p className="text-sm">{(application as any).group_first_choice || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Group Second Choice</p><p className="text-sm">{(application as any).group_second_choice || 'Not provided'}</p></div>
                      </div>
                    </TabsContent>

                    {application.pathway === 'sen' && (
                      <TabsContent value="sen" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">SEN Status</p><p className="text-sm">{(application as any).sen_status || 'Not specified'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">EHCP Number</p><p className="text-sm">{(application as any).ehcp_number || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">EHCP Expiry Date</p><p className="text-sm">{(application as any).ehcp_expiry_date ? format(new Date((application as any).ehcp_expiry_date), 'dd MMM yyyy') : 'Not provided'}</p></div>
                          <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Current SEN Provision</p><p className="text-sm">{(application as any).current_sen_provision || 'Not provided'}</p></div>
                          <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Mobility Requirements</p><p className="text-sm">{(application as any).mobility_requirements || 'None specified'}</p></div>
                          <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Communication Needs</p><p className="text-sm">{(application as any).communication_needs || 'None specified'}</p></div>
                          <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Learning Support Needs</p><p className="text-sm">{(application as any).learning_support_needs || 'None specified'}</p></div>
                          <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Behaviour Support Needs</p><p className="text-sm">{(application as any).behaviour_support_needs || 'None specified'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">SENCO Contact Name</p><p className="text-sm">{(application as any).senco_contact_name || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">SENCO Email</p><p className="text-sm">{(application as any).senco_contact_email || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">SENCO Phone</p><p className="text-sm">{(application as any).senco_contact_phone || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Educational Psychologist</p><p className="text-sm">{(application as any).educational_psychologist || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Previous SEN School</p><p className="text-sm">{(application as any).previous_sen_school || 'Not provided'}</p></div>
                          <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">SEN Transition Notes</p><p className="text-sm">{(application as any).sen_transition_notes || 'Not provided'}</p></div>
                        </div>
                      </TabsContent>
                    )}

                    {application.pathway === 'standard' && (
                      <TabsContent value="references" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm font-medium text-muted-foreground">Reference 1 Name</p><p className="text-sm">{(application as any).reference1_name || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Reference 1 Mobile</p><p className="text-sm">{(application as any).reference1_mobile || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Reference 2 Name</p><p className="text-sm">{(application as any).reference2_name || 'Not provided'}</p></div>
                          <div><p className="text-sm font-medium text-muted-foreground">Reference 2 Mobile</p><p className="text-sm">{(application as any).reference2_mobile || 'Not provided'}</p></div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                )}

                {/* Staff Child Pathway */}
                {application.pathway === 'staff_child' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Student Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Student Name</p><p className="text-sm">{(application as any).student_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Date of Birth</p><p className="text-sm">{(application as any).date_of_birth ? format(new Date((application as any).date_of_birth), 'dd MMM yyyy') : 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Gender</p><p className="text-sm">{(application as any).gender || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Year Group</p><p className="text-sm">{(application as any).year_group || 'Not specified'}</p></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Staff Member Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Staff Member Name</p><p className="text-sm">{(application as any).staff_member_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Staff Member ID</p><p className="text-sm">{(application as any).staff_member_id || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Email</p><p className="text-sm">{(application as any).staff_member_email || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Department</p><p className="text-sm">{(application as any).staff_member_department || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Role</p><p className="text-sm">{(application as any).staff_member_role || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Relationship to Staff</p><p className="text-sm">{(application as any).relationship_to_staff || 'Not provided'}</p></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Emergency Contact</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Name</p><p className="text-sm">{(application as any).emergency_contact_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Phone</p><p className="text-sm">{(application as any).emergency_contact_phone || 'Not provided'}</p></div>
                        <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Medical Information</p><p className="text-sm">{(application as any).medical_information || 'None provided'}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Enrollment Pathway */}
                {application.pathway === 'emergency' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Student Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">First Name</p><p className="text-sm">{(application as any).student_first_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Last Name</p><p className="text-sm">{(application as any).student_last_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Date of Birth</p><p className="text-sm">{(application as any).student_dob ? format(new Date((application as any).student_dob), 'dd MMM yyyy') : 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Gender</p><p className="text-sm">{(application as any).student_gender || 'Not specified'}</p></div>
                        <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Known Risks</p><p className="text-sm">{(application as any).student_known_risks || 'None specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Immigration Status</p><p className="text-sm">{(application as any).student_immigration_status || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Visa Status</p><p className="text-sm">{(application as any).student_visa_status || 'Not provided'}</p></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Referral Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Referral Source Type</p><p className="text-sm">{(application as any).referral_source_type || 'Not specified'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Referral Source Name</p><p className="text-sm">{(application as any).referral_source_name || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Referral Email</p><p className="text-sm">{(application as any).referral_source_email || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Referral Phone</p><p className="text-sm">{(application as any).referral_source_phone || 'Not provided'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Referral Date</p><p className="text-sm">{(application as any).referral_date ? format(new Date((application as any).referral_date), 'dd MMM yyyy') : 'Not provided'}</p></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Urgent Needs</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Uniform</p><p className="text-sm">{(application as any).urgent_needs_uniform ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Meals</p><p className="text-sm">{(application as any).urgent_needs_meals ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Device</p><p className="text-sm">{(application as any).urgent_needs_device ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Transport</p><p className="text-sm">{(application as any).urgent_needs_transport ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Counselling</p><p className="text-sm">{(application as any).urgent_needs_counselling ? 'Yes' : 'No'}</p></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Safeguarding</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Has Been in Care</p><p className="text-sm">{(application as any).safeguarding_has_been_in_care ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Subject to Protection Plan</p><p className="text-sm">{(application as any).safeguarding_subject_to_child_protection_plan ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Referral Document Provided</p><p className="text-sm">{(application as any).safeguarding_referral_document ? 'Yes' : 'No'}</p></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Assignments</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm font-medium text-muted-foreground">Assigned DSL</p><p className="text-sm">{(application as any).assigned_dsl_id || 'Not assigned'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Assigned Form Tutor</p><p className="text-sm">{(application as any).assigned_form_tutor_id || 'Not assigned'}</p></div>
                        <div><p className="text-sm font-medium text-muted-foreground">Assigned House</p><p className="text-sm">{(application as any).assigned_house || 'Not assigned'}</p></div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{application.student_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{format(new Date(application.date_of_birth), 'dd MMM yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{application.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nationality</p>
                      <p className="font-medium">{application.nationality || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {application.medical_information && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Medical Information</p>
                      <p className="text-sm bg-slate-50 p-3 rounded">{application.medical_information}</p>
                    </div>
                  )}
                  
                  {application.special_requirements && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Special Requirements</p>
                      <p className="text-sm bg-slate-50 p-3 rounded">{application.special_requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Parent/Guardian</p>
                    <div className="space-y-2">
                      <p className="font-medium">{application.parent_name}</p>
                      <p className="text-sm">{application.parent_relationship || 'Parent'}</p>
                      <p className="text-sm">{application.parent_email}</p>
                      {application.parent_phone && <p className="text-sm">{application.parent_phone}</p>}
                    </div>
                  </div>
                  
                  {application.home_address && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Address</p>
                      <div className="text-sm bg-slate-50 p-3 rounded">
                        <p>{application.home_address}</p>
                        {application.postal_code && <p>{application.postal_code}</p>}
                        <p>{application.country || 'India'}</p>
                      </div>
                    </div>
                  )}
                  
                  {application.emergency_contact_name && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Emergency Contact</p>
                      <div className="space-y-1">
                        <p className="font-medium">{application.emergency_contact_name}</p>
                        {application.emergency_contact_phone && <p className="text-sm">{application.emergency_contact_phone}</p>}
                        {application.emergency_contact_relationship && <p className="text-sm">{application.emergency_contact_relationship}</p>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflow">
            <ApplicationWorkflow 
              applicationId={applicationId} 
              currentStatus={application.status}
              onStatusChange={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <ApplicationTimeline applicationId={applicationId} />
          </TabsContent>

          <TabsContent value="documents">
            <ApplicationDocuments applicationId={applicationId} />
          </TabsContent>

          <TabsContent value="notes">
            <ApplicationNotes applicationId={applicationId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}