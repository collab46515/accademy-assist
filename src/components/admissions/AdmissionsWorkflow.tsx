import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdmissionsFeeService } from '@/services/AdmissionsFeeService';
import { FeesDisplay } from './FeesDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  AlertTriangle,
  ArrowRight,
  Edit3,
  Send
} from 'lucide-react';

interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  source: 'online' | 'referral' | 'call_centre' | 'walk_in';
  currentStage: 'submission' | 'application_fee' | 'enrollment' | 'review' | 'assessment' | 'decision' | 'deposit' | 'confirmed' | 'class_allocation';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
  yearGroup: string;
  submittedAt: string;
  progress: number;
}

const WORKFLOW_STAGES = [
  { 
    key: 'submission', 
    label: 'Application Submission', 
    description: 'Initial application received from various sources',
    icon: UserPlus,
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    key: 'application_fee', 
    label: 'Application Fee', 
    description: 'Application fee payment processing',
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-800'
  },
  { 
    key: 'enrollment', 
    label: 'Enrollment Processing', 
    description: 'Basic enrollment requirements processing',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-800'
  },
  { 
    key: 'review', 
    label: 'Detailed Review', 
    description: 'Comprehensive review of all application details',
    icon: Eye,
    color: 'bg-amber-100 text-amber-800'
  },
  { 
    key: 'assessment', 
    label: 'Assessment/Interview', 
    description: 'Online assessment or personal interview conducted',
    icon: Calendar,
    color: 'bg-indigo-100 text-indigo-800'
  },
  { 
    key: 'decision', 
    label: 'Admission Decision', 
    description: 'Final decision: Approved, Rejected, or On Hold',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800'
  },
  { 
    key: 'deposit', 
    label: 'Deposit Payment', 
    description: 'Deposit payment processing (if approved)',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-800'
  },
  { 
    key: 'confirmed', 
    label: 'Admission Confirmed', 
    description: 'Final admission confirmation',
    icon: CheckCircle,
    color: 'bg-green-200 text-green-900'
  },
  { 
    key: 'class_allocation', 
    label: 'Class Allocation', 
    description: 'Class assignment and final setup',
    icon: GraduationCap,
    color: 'bg-blue-200 text-blue-900'
  }
];


export function AdmissionsWorkflow() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealApplications();
  }, []);

  const fetchRealApplications = async () => {
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
  };

  const mapPathwayToSource = (pathway: string): 'online' | 'referral' | 'call_centre' | 'walk_in' => {
    switch (pathway) {
      case 'standard_digital': return 'online';
      case 'sibling_automatic': return 'referral';
      case 'staff_child': return 'referral';
      case 'phone_enquiry': return 'call_centre';
      default: return 'online';
    }
  };

  const mapStatusToStage = (status: string): 'submission' | 'application_fee' | 'enrollment' | 'review' | 'assessment' | 'decision' | 'deposit' | 'confirmed' | 'class_allocation' => {
    switch (status) {
      case 'draft': return 'submission';
      case 'submitted': return 'application_fee';
      case 'under_review': return 'review';
      case 'assessment_scheduled': return 'assessment';
      case 'approved': return 'decision';
      case 'fee_payment': return 'deposit';
      case 'confirmed': return 'confirmed';
      case 'enrolled': return 'class_allocation';
      default: return 'submission';
    }
  };

  const mapStatusToWorkflowStatus = (status: string): 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold' => {
    switch (status) {
      case 'draft': return 'pending';
      case 'submitted': case 'under_review': case 'assessment_scheduled': return 'in_progress';
      case 'approved': case 'confirmed': case 'enrolled': return 'completed';
      case 'rejected': return 'rejected';
      case 'on_hold': return 'on_hold';
      default: return 'pending';
    }
  };

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'draft': return 10;
      case 'submitted': return 20;
      case 'under_review': return 40;
      case 'assessment_scheduled': return 60;
      case 'approved': return 80;
      case 'confirmed': return 90;
      case 'enrolled': return 100;
      default: return 0;
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
        if (nextStage.key === 'class_allocation') {
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
      case 'submission': return 'draft';
      case 'application_fee': return 'submitted';
      case 'enrollment': return 'submitted';
      case 'review': return 'under_review';
      case 'assessment': return 'assessment_scheduled';
      case 'decision': return 'approved';
      case 'deposit': return 'fee_payment';
      case 'confirmed': return 'confirmed';
      case 'class_allocation': return 'enrolled';
      default: return 'draft';
    }
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
          const currentStageInfo = WORKFLOW_STAGES[currentStageIndex];
          
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

      {/* Edit Dialog would go here */}
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