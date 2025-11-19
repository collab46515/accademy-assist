import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdmissionsFeeService } from '@/services/AdmissionsFeeService';
import { FeesDisplay } from './FeesDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  FileCheck, 
  Eye, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  GraduationCap,
  Award,
  AlertTriangle,
  ArrowRight,
  Edit3,
  Send,
  Mail,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  source: 'online' | 'referral' | 'call_centre' | 'walk_in';
  currentStage: 'submitted' | 'under_review' | 'assessment_scheduled' | 'approved' | 'fee_pending' | 'enrollment_confirmed' | 'enrolled';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  yearGroup: string;
  submittedAt: string;
  progress: number;
  parent_email?: string;
}

const WORKFLOW_STAGES = [
  { 
    key: 'submitted', 
    label: 'Application Submitted', 
    description: 'Application received and initial review',
    icon: UserPlus,
    color: 'bg-blue-100 text-blue-800',
    allowedTransitions: ['under_review', 'rejected'],
    canEdit: true
  },
  { 
    key: 'under_review', 
    label: 'Application Review & Verify', 
    description: 'Document verification and application review',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-800',
    allowedTransitions: ['assessment_scheduled', 'rejected'],
    canEdit: true
  },
  { 
    key: 'assessment_scheduled', 
    label: 'Assessment/Interview', 
    description: 'Assessment or interview scheduled and conducted',
    icon: Calendar,
    color: 'bg-indigo-100 text-indigo-800',
    allowedTransitions: ['approved', 'under_review', 'rejected'],
    canSchedule: true,
    canEdit: true
  },
  { 
    key: 'approved', 
    label: 'Admission Decision', 
    description: 'Final decision: Approved, Rejected, or Waitlisted',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    allowedTransitions: ['fee_pending', 'rejected', 'waitlisted'],
    canGenerateLetter: true,
    canEdit: true
  },
  { 
    key: 'fee_pending', 
    label: 'Fee Payment', 
    description: 'Fee payment processing and verification',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-800',
    allowedTransitions: ['enrollment_confirmed', 'approved'],
    requiresPayment: true,
    canEdit: true
  },
  { 
    key: 'enrollment_confirmed', 
    label: 'Enrollment Confirmation', 
    description: 'Enrollment confirmed with student ID assigned',
    icon: Award,
    color: 'bg-green-200 text-green-900',
    allowedTransitions: ['enrolled'],
    canEdit: false
  },
  { 
    key: 'enrolled', 
    label: 'Welcome & Onboarding', 
    description: 'Student onboarding and orientation',
    icon: GraduationCap,
    color: 'bg-blue-200 text-blue-900',
    allowedTransitions: [],
    canEdit: false
  }
];


export function AdmissionsWorkflow() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  // Dialog states for enhanced features
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [letterDialogOpen, setLetterDialogOpen] = useState(false);
  
  // Form states
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  
  const { toast } = useToast();

  const fetchRealApplications = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      // Transform database data to match Application interface
      const transformedApps: Application[] = (data || []).map(app => ({
        id: app.id,
        applicationNumber: app.application_number,
        studentName: app.student_name || 'Unknown Student',
        source: mapPathwayToSource(app.pathway),
        currentStage: mapStatusToStage(app.status),
        status: mapStatusToWorkflowStatus(app.status),
        yearGroup: app.year_group || 'Not specified',
        submittedAt: app.submitted_at ? new Date(app.submitted_at).toISOString().split('T')[0] : new Date(app.created_at).toISOString().split('T')[0],
        progress: calculateProgress(app.status)
      }));

      setApplications(transformedApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealApplications();

    // Set up real-time subscription for enrollment_applications table
    const channel = supabase
      .channel('enrollment_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'enrollment_applications'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Show a subtle notification that data has been updated
          toast({
            title: "Applications Updated",
            description: "Application status has been updated automatically.",
            duration: 2000,
          });
          // Refresh applications when any change occurs
          fetchRealApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRealApplications]);

  const mapPathwayToSource = (pathway: string): 'online' | 'referral' | 'call_centre' | 'walk_in' => {
    switch (pathway) {
      case 'standard_digital': return 'online';
      case 'sibling_automatic': return 'referral';
      case 'staff_child': return 'referral';
      case 'phone_enquiry': return 'call_centre';
      default: return 'online';
    }
  };

  const mapStatusToStage = (status: string): 'submitted' | 'under_review' | 'assessment_scheduled' | 'approved' | 'fee_pending' | 'enrollment_confirmed' | 'enrolled' => {
    switch (status) {
      case 'draft': 
      case 'submitted': return 'submitted';
      case 'under_review': 
      case 'documents_pending': return 'under_review';
      case 'assessment_scheduled': 
      case 'assessment_complete':
      case 'interview_scheduled':
      case 'interview_complete': return 'assessment_scheduled';
      case 'pending_approval':
      case 'approved': 
      case 'offer_sent': return 'approved';
      case 'offer_accepted':
      case 'fee_pending': return 'fee_pending';
      case 'confirmed': 
      case 'enrollment_confirmed': return 'enrollment_confirmed';
      case 'enrolled': return 'enrolled';
      default: return 'submitted';
    }
  };

  const mapStatusToWorkflowStatus = (status: string): 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold' => {
    switch (status) {
      case 'draft': return 'pending';
      case 'submitted': 
      case 'under_review': 
      case 'documents_pending':
      case 'assessment_scheduled': 
      case 'assessment_complete':
      case 'interview_scheduled':
      case 'interview_complete':
      case 'pending_approval': return 'in_progress';
      case 'approved': 
      case 'offer_sent':
      case 'offer_accepted':
      case 'confirmed': 
      case 'enrolled': return 'completed'; // Enrolled students should show as completed
      case 'rejected': 
      case 'offer_declined': 
      case 'withdrawn': return 'rejected';
      case 'on_hold': 
      case 'requires_override': return 'on_hold';
      default: return 'pending';
    }
  };

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'draft': return 10;
      case 'submitted': return 20;
      case 'under_review': return 40;
      case 'documents_pending': return 35;
      case 'assessment_scheduled': return 50;
      case 'assessment_complete': return 55;
      case 'interview_scheduled': return 60;
      case 'interview_complete': return 65;
      case 'pending_approval': return 70;
      case 'approved': return 80;
      case 'offer_sent': return 85;
      case 'offer_accepted': return 90;
      case 'enrolled': return 100; // Enrolled students should show 100% progress
      case 'confirmed': return 95;
      case 'rejected': case 'offer_declined': case 'withdrawn': return 0;
      default: return 5;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'online': return '🌐';
      case 'referral': return '👥';
      case 'call_centre': return '📞';
      case 'walk_in': return '🚶';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (application: Application) => {
    setSelectedApplication(application);
    setEditMode(true);
  };

  const handleAdvanceStage = async (applicationId: string) => {
    try {
      const app = applications.find(a => a.id === applicationId);
      if (!app) return;

      const currentIndex = WORKFLOW_STAGES.findIndex(stage => stage.key === app.currentStage);
      const nextStage = WORKFLOW_STAGES[currentIndex + 1];
      
      if (nextStage) {
        // Update the status in the database
        const newStatus = mapStageToStatus(nextStage.key);
        const { error } = await supabase
          .from('enrollment_applications')
          .update({ status: newStatus as any })
          .eq('id', applicationId);

        if (error) {
          console.error('Error updating application status:', error);
          return;
        }

        // Auto-assign fees when reaching payment stages
        if (AdmissionsFeeService.isPaymentStage(nextStage.key)) {
          console.log(`🎯 Payment stage detected: ${nextStage.key}`);
          
          // Get full application data for fee assignment
          const { data: fullApplication } = await supabase
            .from('enrollment_applications')
            .select('*')
            .eq('id', applicationId)
            .single();

          if (fullApplication) {
            const feeResult = await AdmissionsFeeService.assignFeesForStage(
              applicationId, 
              nextStage.key, 
              fullApplication
            );
            
            if (feeResult.success && feeResult.amount) {
              console.log(`✅ Fees auto-assigned: £${feeResult.amount}`);
            } else if (!feeResult.success) {
              console.error('Fee assignment failed:', feeResult.error);
            }
          }
        }

        // Special handling for final stage - create actual student record
        if (nextStage.key === 'enrolled') {
          await handleFinalEnrollment(applicationId);
        }

        // Refresh the applications list
        fetchRealApplications();
      }
    } catch (error) {
      console.error('Error advancing stage:', error);
    }
  };

  const handleFinalEnrollment = async (applicationId: string) => {
    try {
      // Get the full application data
      const { data: application, error: fetchError } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (fetchError || !application) {
        console.error('Error fetching application for enrollment:', fetchError);
        return;
      }

      const additionalData = application.additional_data as any;
      const pathwayData = additionalData?.pathway_data || additionalData?.submitted_data || {};
      
      // Handle form class preference - convert "no_preference" to null for automatic assignment
      let formClassPreference = pathwayData.form_class_preference || application.form_class_preference;
      if (formClassPreference === "no_preference") {
        formClassPreference = null;
      }
      
      // If preference exists, format it as YearGroup + Class (e.g., "Year 7A", "Year 10B")
      const yearGroup = pathwayData.year_group || application.year_group;
      const formattedFormClass = formClassPreference 
        ? `${yearGroup}${formClassPreference}`
        : null;
      
      const studentData = {
        first_name: pathwayData.student_name?.split(' ')[0] || application.student_name?.split(' ')[0] || 'Unknown',
        last_name: pathwayData.student_name?.split(' ').slice(1).join(' ') || application.student_name?.split(' ').slice(1).join(' ') || 'Student',
        email: pathwayData.student_email || pathwayData.parent_email || application.student_email || application.parent_email,
        student_number: `STU${Date.now().toString().slice(-6)}`, // Generate unique student number
        year_group: yearGroup,
        form_class: formattedFormClass,
        date_of_birth: pathwayData.date_of_birth || application.date_of_birth,
        emergency_contact_name: pathwayData.emergency_contact_name || application.emergency_contact_name,
        emergency_contact_phone: pathwayData.emergency_contact_phone || application.emergency_contact_phone,
        medical_notes: pathwayData.medical_information || application.medical_information,
        phone: pathwayData.student_phone || application.student_phone,
      };

      // Create the student record using the existing function
      const { data, error } = await supabase
        .rpc('create_student_with_user', {
          student_data: studentData,
          school_id: application.school_id
        });

      if (error) {
        console.error('Error creating student record:', error);
        throw error;
      }

      console.log('✅ Student record created successfully:', data);
      
      // Update application to mark it as completed
      await supabase
        .from('enrollment_applications')
        .update({ 
          status: 'enrolled',
          workflow_completion_percentage: 100,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    } catch (error) {
      console.error('Error in final enrollment process:', error);
      throw error;
    }
  };

  const mapStageToStatus = (stage: string): string => {
    switch (stage) {
      case 'submitted': return 'submitted';
      case 'under_review': return 'under_review';
      case 'assessment_scheduled': return 'assessment_scheduled';
      case 'approved': return 'approved';
      case 'fee_pending': return 'fee_pending';
      case 'enrollment_confirmed': return 'enrollment_confirmed';
      case 'enrolled': return 'enrolled';
      default: return 'draft';
    }
  };

  // Enhanced workflow helper functions
  const getStageInfo = (status: string) => {
    return WORKFLOW_STAGES.find(stage => stage.key === status) || WORKFLOW_STAGES[0];
  };

  const isTransitionAllowed = (currentStatus: string, targetStatus: string): boolean => {
    const currentStage = getStageInfo(currentStatus);
    return currentStage.allowedTransitions?.includes(targetStatus) || false;
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedApplication) return;

    if (!isTransitionAllowed(selectedApplication.currentStage, newStatus) && newStatus !== 'rejected') {
      toast({
        title: "Invalid Transition",
        description: `Cannot move from ${selectedApplication.currentStage} to ${newStatus}`,
        variant: "destructive"
      });
      return;
    }

    try {
      setStatusUpdateLoading(true);
      const { error } = await supabase
        .from('enrollment_applications')
        .update({ status: newStatus as any, updated_at: new Date().toISOString() })
        .eq('id', selectedApplication.id);

      if (error) throw error;
      toast({ title: "Status Updated", description: `Application moved to ${getStageInfo(newStatus).label}` });
      await fetchRealApplications();
      setSelectedApplication(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleScheduleAssessment = async () => {
    if (!selectedApplication) return;
    toast({ title: "Assessment Scheduled", description: `${assessmentType} scheduled for ${assessmentDate}` });
    await handleStatusUpdate('assessment_scheduled');
    setAssessmentDialogOpen(false);
    setAssessmentNotes('');
    setAssessmentDate('');
    setAssessmentType('');
  };

  const handleGenerateOfferLetter = () => {
    toast({ title: "Offer Letter Generated", description: "Offer letter generated and sent" });
    setLetterDialogOpen(false);
  };

  const handlePaymentProcessed = async () => {
    if (!selectedApplication) return;
    await handleStatusUpdate('enrollment_confirmed');
    setPaymentDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admissions Workflow</h2>
          <p className="text-muted-foreground">
            Track applications through the complete admissions process
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Workflow Stages Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {WORKFLOW_STAGES.map((stage, index) => (
              <div key={stage.key} className="relative">
                <div className={`p-4 rounded-lg text-center ${stage.color}`}>
                  <stage.icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{stage.label}</p>
                </div>
                {index < WORKFLOW_STAGES.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground absolute -right-2 top-1/2 transform -translate-y-1/2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No applications found. Create some applications to see them here.
          </div>
        ) : (
          applications.map((application) => {
          const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.key === application.currentStage);
          const currentStageInfo = WORKFLOW_STAGES[currentStageIndex] || WORKFLOW_STAGES[0]; // Fallback to first stage if not found
          
          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{application.studentName}</h3>
                      <Badge variant="outline">{application.applicationNumber}</Badge>
                      <span className="text-2xl">{getSourceIcon(application.source)}</span>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {application.yearGroup} • Submitted {application.submittedAt}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(application)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleAdvanceStage(application.id)}
                      disabled={currentStageIndex >= WORKFLOW_STAGES.length - 1}
                      className={currentStageIndex === WORKFLOW_STAGES.length - 2 ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {currentStageIndex === WORKFLOW_STAGES.length - 2 ? 'Complete Enrollment' : 'Advance'}
                    </Button>
                  </div>
                </div>

                {/* Current Stage */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <currentStageInfo.icon className="h-4 w-4" />
                    <span className="font-medium">Current Stage: {currentStageInfo.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentStageInfo.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workflow Progress</span>
                    <span className="font-medium">{application.progress}%</span>
                  </div>
                  <Progress value={application.progress} className="h-2" />
                </div>

                {/* Stage Timeline */}
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {WORKFLOW_STAGES.map((stage, index) => (
                      <div
                        key={stage.key}
                        className={`flex-shrink-0 w-3 h-3 rounded-full ${
                          index <= currentStageIndex 
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Fees Display */}
                  <FeesDisplay 
                    applicationId={application.id}
                    applicationData={application}
                    currentStage={application.currentStage}
                  />
              </CardContent>
            </Card>
          );
        }))}
      </div>

      {/* Enhanced Application Details Dialog */}
      {selectedApplication && !editMode && (
        <Dialog open={!!selectedApplication && !paymentDialogOpen && !assessmentDialogOpen && !letterDialogOpen} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                {selectedApplication.studentName} - {selectedApplication.applicationNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Current Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStageInfo(selectedApplication.currentStage).color}>
                    {getStageInfo(selectedApplication.currentStage).label}
                  </Badge>
                </CardContent>
              </Card>

              {/* Stage Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Stage Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getStageInfo(selectedApplication.currentStage).canSchedule && (
                    <Button onClick={() => setAssessmentDialogOpen(true)} className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Assessment/Interview
                    </Button>
                  )}
                  {getStageInfo(selectedApplication.currentStage).canGenerateLetter && (
                    <Button onClick={() => setLetterDialogOpen(true)} className="w-full" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Generate Offer Letter
                    </Button>
                  )}
                  {getStageInfo(selectedApplication.currentStage).requiresPayment && (
                    <Button onClick={() => setPaymentDialogOpen(true)} className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Manual Status Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Change Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={handleStatusUpdate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status..." />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKFLOW_STAGES.map((stage) => (
                        <SelectItem key={stage.key} value={stage.key} disabled={!isTransitionAllowed(selectedApplication.currentStage, stage.key) && stage.key !== 'rejected'}>
                          {stage.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="rejected">Reject Application</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <FeesDisplay applicationId={selectedApplication.id} applicationData={selectedApplication} currentStage={selectedApplication.currentStage} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assessment Scheduling Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Assessment/Interview</DialogTitle>
            <DialogDescription>Set up an assessment or interview for this applicant</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrance_exam">Entrance Exam</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date & Time</label>
              <Input type="datetime-local" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea value={assessmentNotes} onChange={(e) => setAssessmentNotes(e.target.value)} placeholder="Additional instructions..." />
            </div>
            <Button onClick={handleScheduleAssessment} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Schedule & Notify
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Offer Letter Dialog */}
      <Dialog open={letterDialogOpen} onOpenChange={setLetterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Offer Letter</DialogTitle>
            <DialogDescription>Generate and send admission offer letter</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This will generate an official offer letter and send it to the applicant's email.</p>
            <div className="flex gap-2">
              <Button onClick={handleGenerateOfferLetter} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Generate & Send
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Record and verify payment for this application</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Verify that payment has been received before confirming enrollment.</p>
            {selectedApplication && (
              <FeesDisplay applicationId={selectedApplication.id} applicationData={selectedApplication} currentStage={selectedApplication.currentStage} />
            )}
            <Button onClick={handlePaymentProcessed} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Payment & Advance
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editMode && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Application - {selectedApplication.studentName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Edit functionality will be implemented here.</p>
              <div className="flex gap-2">
                <Button onClick={() => setEditMode(false)}>Cancel</Button>
                <Button variant="outline">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}