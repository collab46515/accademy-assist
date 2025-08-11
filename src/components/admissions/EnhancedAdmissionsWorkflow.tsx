import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Send,
  Mail,
  Download,
  Edit,
  AlertTriangle,
  Users,
  ArrowRight
} from 'lucide-react';

interface Application {
  id: string;
  application_number: string;
  student_name: string;
  status: string;
  year_group: string;
  parent_email: string;
  created_at: string;
  additional_data?: any;
}

const ENHANCED_WORKFLOW_STAGES = [
  { 
    key: 'submitted', 
    label: 'Application Submitted', 
    description: 'Application has been submitted and is awaiting initial review',
    color: 'bg-blue-100 text-blue-800',
    allowedTransitions: ['under_review', 'rejected'],
    canEdit: true
  },
  { 
    key: 'under_review', 
    label: 'Application Fee Required', 
    description: 'Application fee payment required to proceed',
    color: 'bg-yellow-100 text-yellow-800',
    allowedTransitions: ['assessment_scheduled', 'rejected', 'documents_pending'],
    requiresPayment: true,
    canEdit: true
  },
  { 
    key: 'assessment_scheduled', 
    label: 'Assessment/Interview', 
    description: 'Assessment or interview has been scheduled',
    color: 'bg-purple-100 text-purple-800',
    allowedTransitions: ['assessment_complete', 'under_review', 'rejected'],
    canSchedule: true,
    canEdit: true
  },
  { 
    key: 'assessment_complete', 
    label: 'Review', 
    description: 'Assessment completed, application under detailed review',
    color: 'bg-indigo-100 text-indigo-800',
    allowedTransitions: ['approved', 'rejected', 'on_hold'],
    canEdit: true
  },
  { 
    key: 'approved', 
    label: 'Admission Decision', 
    description: 'Application approved, awaiting enrollment confirmation',
    color: 'bg-green-100 text-green-800',
    allowedTransitions: ['fee_payment', 'rejected'],
    canGenerateLetter: true,
    canEdit: true
  },
  { 
    key: 'fee_payment', 
    label: 'Deposit Payment', 
    description: 'Enrollment deposit payment required',
    color: 'bg-emerald-100 text-emerald-800',
    allowedTransitions: ['confirmed', 'approved'],
    requiresPayment: true,
    canEdit: true
  },
  { 
    key: 'confirmed', 
    label: 'Confirmed', 
    description: 'Enrollment confirmed, student ready for class allocation',
    color: 'bg-green-200 text-green-900',
    allowedTransitions: ['enrolled'],
    canEdit: false
  },
  { 
    key: 'enrolled', 
    label: 'Enrolled', 
    description: 'Student successfully enrolled and allocated to class',
    color: 'bg-green-300 text-green-900',
    allowedTransitions: [],
    canEdit: false
  }
];

export function EnhancedAdmissionsWorkflow() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [letterDialogOpen, setLetterDialogOpen] = useState(false);
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
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
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      setStatusUpdateLoading(true);
      
      const updateData: any = { 
        status: newStatus,
        last_activity_at: new Date().toISOString()
      };

      if (notes) {
        const existingData = applications.find(app => app.id === applicationId)?.additional_data || {};
        updateData.additional_data = {
          ...existingData,
          status_change_history: [
            ...(existingData.status_change_history || []),
            {
              timestamp: new Date().toISOString(),
              from_status: applications.find(app => app.id === applicationId)?.status,
              to_status: newStatus,
              notes,
              changed_by: 'admin' // You could get this from auth
            }
          ]
        };
      }

      const { error } = await supabase
        .from('enrollment_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      // Refresh applications
      await fetchApplications();
      
      toast({
        title: "Success",
        description: `Application status updated to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handlePaymentInitiation = async (application: Application) => {
    setSelectedApplication(application);
    setPaymentDialogOpen(true);
  };

  const processPayment = async () => {
    if (!selectedApplication) return;
    
    try {
      // Here you would integrate with your payment system (Stripe, PayPal, etc.)
      // For now, we'll simulate payment processing
      
      toast({
        title: "Payment Initiated",
        description: "Payment processing has been started. Awaiting confirmation.",
      });
      
      // Update status to indicate payment is being processed
      const currentStage = ENHANCED_WORKFLOW_STAGES.find(stage => stage.key === selectedApplication.status);
      if (currentStage?.requiresPayment) {
        await updateApplicationStatus(
          selectedApplication.id, 
          selectedApplication.status, 
          'Payment processing initiated'
        );
      }
      
      setPaymentDialogOpen(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleAssessmentSubmission = async () => {
    if (!selectedApplication || !assessmentDate || !assessmentType) {
      toast({
        title: "Error",
        description: "Please fill in all assessment details",
        variant: "destructive"
      });
      return;
    }

    try {
      const assessmentData = {
        type: assessmentType,
        scheduled_date: assessmentDate,
        notes: assessmentNotes,
        status: 'scheduled',
        created_at: new Date().toISOString()
      };

      await updateApplicationStatus(
        selectedApplication.id, 
        'assessment_scheduled',
        `Assessment scheduled: ${assessmentType} on ${assessmentDate}`
      );

      // You could also create a separate assessment record here
      
      toast({
        title: "Success",
        description: "Assessment has been scheduled successfully",
      });
      
      setAssessmentDialogOpen(false);
      setAssessmentDate('');
      setAssessmentType('');
      setAssessmentNotes('');
    } catch (error) {
      console.error('Error scheduling assessment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule assessment",
        variant: "destructive"
      });
    }
  };

  const generateOfferLetter = async (application: Application) => {
    try {
      // Here you would integrate with a document generation service
      // For now, we'll simulate letter generation
      
      const letterData = {
        student_name: application.student_name,
        application_number: application.application_number,
        year_group: application.year_group,
        generated_at: new Date().toISOString(),
        letter_type: 'offer_letter'
      };

      toast({
        title: "Letter Generated",
        description: `Offer letter has been generated for ${application.student_name}`,
      });
      
      // You could update the application with letter details
      await updateApplicationStatus(
        application.id,
        application.status,
        'Offer letter generated and ready for sending'
      );
      
    } catch (error) {
      console.error('Error generating letter:', error);
      toast({
        title: "Error",
        description: "Failed to generate offer letter",
        variant: "destructive"
      });
    }
  };

  const getStageInfo = (status: string) => {
    return ENHANCED_WORKFLOW_STAGES.find(stage => stage.key === status) || ENHANCED_WORKFLOW_STAGES[0];
  };

  const canTransitionTo = (currentStatus: string, targetStatus: string) => {
    const currentStage = getStageInfo(currentStatus);
    return currentStage.allowedTransitions.includes(targetStatus);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Admissions Workflow</h2>
          <p className="text-muted-foreground">
            Comprehensive application management with payment integration and status tracking
          </p>
        </div>
        <Button onClick={fetchApplications} variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Refresh Applications
        </Button>
      </div>

      {/* Workflow Stages Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {ENHANCED_WORKFLOW_STAGES.map((stage, index) => (
              <div key={stage.key} className="relative">
                <div className={`p-3 rounded-lg text-center text-xs ${stage.color}`}>
                  <div className="font-medium">{stage.label}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {applications.filter(app => app.status === stage.key).length} apps
                  </div>
                </div>
                {index < ENHANCED_WORKFLOW_STAGES.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground absolute -right-1 top-1/2 transform -translate-y-1/2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">No submitted applications to display</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => {
            const stageInfo = getStageInfo(application.status);
            
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{application.student_name}</h3>
                        <Badge variant="outline">{application.application_number}</Badge>
                        <Badge className={stageInfo.color}>
                          {stageInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {application.year_group} • {stageInfo.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Status Change Options */}
                      <Select
                        onValueChange={(newStatus) => updateApplicationStatus(application.id, newStatus)}
                        disabled={statusUpdateLoading}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {ENHANCED_WORKFLOW_STAGES
                            .filter(stage => canTransitionTo(application.status, stage.key))
                            .map(stage => (
                              <SelectItem key={stage.key} value={stage.key}>
                                {stage.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Stage-specific Actions */}
                  <div className="flex gap-2 mt-4">
                    {stageInfo.requiresPayment && (
                      <Button 
                        size="sm" 
                        onClick={() => handlePaymentInitiation(application)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Process Payment
                      </Button>
                    )}
                    
                    {stageInfo.canSchedule && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(application);
                          setAssessmentDialogOpen(true);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Assessment
                      </Button>
                    )}
                    
                    {stageInfo.canGenerateLetter && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateOfferLetter(application)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Letter
                      </Button>
                    )}
                    
                    <Button size="sm" variant="ghost">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact Parent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Payment Processing Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Process payment for {selectedApplication?.student_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Amount</label>
              <Input placeholder="£75.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={processPayment} className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Scheduling Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Assessment</DialogTitle>
            <DialogDescription>
              Schedule assessment for {selectedApplication?.student_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Assessment Type</label>
              <Select value={assessmentType} onValueChange={setAssessmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Assessment</SelectItem>
                  <SelectItem value="interview">Personal Interview</SelectItem>
                  <SelectItem value="entrance_exam">Entrance Examination</SelectItem>
                  <SelectItem value="portfolio_review">Portfolio Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Assessment Date</label>
              <Input 
                type="datetime-local" 
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Additional notes about the assessment..."
                value={assessmentNotes}
                onChange={(e) => setAssessmentNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAssessmentSubmission} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Assessment
              </Button>
              <Button variant="outline" onClick={() => setAssessmentDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}