import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  ArrowLeft,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';
import { DocumentViewer } from '@/components/admissions/documents/DocumentViewer';

type Application = Database['public']['Tables']['enrollment_applications']['Row'];
type ApplicationDocument = Database['public']['Tables']['application_documents']['Row'];

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentSchool } = useRBAC();
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerDocName, setViewerDocName] = useState('');
  const [viewerMimeType, setViewerMimeType] = useState('');
  const [currentViewFilePath, setCurrentViewFilePath] = useState('');
  
  const applicationId = searchParams.get('id');

  useEffect(() => {
    if (applicationId && currentSchool?.id) {
      fetchApplicationData();
    }
  }, [applicationId, currentSchool?.id]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);

      // Fetch application
      const { data: appData, error: appError } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('school_id', currentSchool.id)
        .single();

      if (appError) throw appError;
      setApplication(appData);

      // Fetch documents
      const { data: docsData, error: docsError } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docsData || []);

    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const viewDocumentInline = async (doc: ApplicationDocument) => {
    try {
      if (!doc.file_path) throw new Error('Missing file path');

      const { data, error } = await supabase.storage
        .from('application-documents')
        .createSignedUrl(doc.file_path, 3600);

      if (error) throw error;

      setViewerUrl(data.signedUrl);
      setViewerDocName(doc.document_name || 'Document');
      setViewerMimeType(doc.mime_type || '');
      setCurrentViewFilePath(doc.file_path);
      setViewerOpen(true);
    } catch (error) {
      console.error('Error opening document:', error);
      toast.error('Failed to open document');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; icon: React.ReactNode; color: string }> = {
      draft: { variant: 'outline', label: 'Draft', icon: <Clock className="h-4 w-4" />, color: 'text-muted-foreground' },
      submitted: { variant: 'secondary', label: 'Submitted', icon: <FileText className="h-4 w-4" />, color: 'text-blue-600' },
      under_review: { variant: 'default', label: 'Under Review', icon: <AlertCircle className="h-4 w-4" />, color: 'text-amber-600' },
      documents_pending: { variant: 'outline', label: 'Documents Pending', icon: <AlertCircle className="h-4 w-4" />, color: 'text-orange-600' },
      assessment_scheduled: { variant: 'secondary', label: 'Assessment Scheduled', icon: <Clock className="h-4 w-4" />, color: 'text-purple-600' },
      assessment_complete: { variant: 'secondary', label: 'Assessment Complete', icon: <CheckCircle className="h-4 w-4" />, color: 'text-purple-600' },
      interview_scheduled: { variant: 'secondary', label: 'Interview Scheduled', icon: <Clock className="h-4 w-4" />, color: 'text-indigo-600' },
      interview_complete: { variant: 'secondary', label: 'Interview Complete', icon: <CheckCircle className="h-4 w-4" />, color: 'text-indigo-600' },
      offer_sent: { variant: 'default', label: 'Offer Sent', icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
      approved: { variant: 'default', label: 'Approved', icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
      enrolled: { variant: 'default', label: 'Enrolled', icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
      rejected: { variant: 'destructive', label: 'Rejected', icon: <XCircle className="h-4 w-4" />, color: 'text-white' },
      withdrawn: { variant: 'outline', label: 'Withdrawn', icon: <AlertCircle className="h-4 w-4" />, color: 'text-gray-600' },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getDocumentStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'outline', label: 'Pending' },
      verified: { variant: 'default', label: 'Verified' },
      rejected: { variant: 'destructive', label: 'Rejected' }
    };
    const statusConfig = config[status] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Application Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The application you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/admissions/applications')}>
              Back to Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const additionalData = application.additional_data as any;
  const pathwayData = additionalData?.pathway_data || {};
  const assessmentData = application.assessment_data as any;
  const interviewData = application.interview_data as any;
  const reviewData = application.review_data as any;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/admissions/applications')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{application.student_name}</h1>
            {getStatusBadge(application.status)}
          </div>
          <p className="text-muted-foreground mt-1">
            Application #{application.application_number} • Created {format(new Date(application.created_at), 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student">Student Details</TabsTrigger>
          <TabsTrigger value="parent">Parent/Guardian</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="assessment">Assessment & Interview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {getStatusBadge(application.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated {format(new Date(application.updated_at), 'dd MMM yyyy, HH:mm')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Pathway</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold capitalize mb-2">
                  {application.pathway?.replace('_', ' ') || 'Standard'}
                </div>
                <p className="text-sm text-muted-foreground">
                  Enrollment pathway
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Year Group</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {application.year_group || pathwayData.year_group || 'Not specified'}
                </div>
                <p className="text-sm text-muted-foreground">
                  Requested grade level
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Student Name</div>
                    <div className="text-sm text-muted-foreground">{application.student_name || pathwayData.student_name}</div>
                  </div>
                </div>
                {(application.date_of_birth || pathwayData.date_of_birth) && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Date of Birth</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(application.date_of_birth || pathwayData.date_of_birth), 'dd MMM yyyy')}
                      </div>
                    </div>
                  </div>
                )}
                {(application.previous_school || pathwayData.school_last_studied) && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Previous School</div>
                      <div className="text-sm text-muted-foreground">{application.previous_school || pathwayData.school_last_studied}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {(application.parent_name || pathwayData.father_name) && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Parent/Guardian</div>
                      <div className="text-sm text-muted-foreground">{application.parent_name || pathwayData.father_name}</div>
                    </div>
                  </div>
                )}
                {(application.parent_email || pathwayData.father_email) && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{application.parent_email || pathwayData.father_email}</div>
                    </div>
                  </div>
                )}
                {(application.parent_phone || pathwayData.father_mobile) && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{application.parent_phone || pathwayData.father_mobile}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Details Tab */}
        <TabsContent value="student" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="text-base">{application.student_name || pathwayData.student_name}</div>
                </div>
                {(application.date_of_birth || pathwayData.date_of_birth) && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                    <div className="text-base">
                      {format(new Date(application.date_of_birth || pathwayData.date_of_birth), 'dd MMM yyyy')}
                    </div>
                  </div>
                )}
                {pathwayData.gender && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Gender</div>
                    <div className="text-base">{pathwayData.gender}</div>
                  </div>
                )}
                {pathwayData.nationality && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Nationality</div>
                    <div className="text-base">{pathwayData.nationality}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Year Group</div>
                  <div className="text-base">{application.year_group || pathwayData.year_group || pathwayData.class_seeking_admission}</div>
                </div>
                {(application.previous_school || pathwayData.school_last_studied) && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Previous School</div>
                    <div className="text-base">{application.previous_school || pathwayData.school_last_studied}</div>
                  </div>
                )}
                {pathwayData.mother_tongue && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Mother Tongue</div>
                    <div className="text-base">{pathwayData.mother_tongue}</div>
                  </div>
                )}
                {pathwayData.apar_id && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">APAR ID</div>
                    <div className="text-base">{pathwayData.apar_id}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parent Details Tab */}
        <TabsContent value="parent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Father's Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathwayData.father_name && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                    <div className="text-base">{pathwayData.father_name}</div>
                  </div>
                )}
                {pathwayData.father_email && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div className="text-base">{pathwayData.father_email}</div>
                  </div>
                )}
                {pathwayData.father_mobile && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div className="text-base">{pathwayData.father_mobile}</div>
                  </div>
                )}
                {pathwayData.father_profession && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Profession</div>
                    <div className="text-base">{pathwayData.father_profession}</div>
                  </div>
                )}
                {pathwayData.father_monthly_income && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Monthly Income</div>
                    <div className="text-base">₹{pathwayData.father_monthly_income}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mother's Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathwayData.mother_name && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                    <div className="text-base">{pathwayData.mother_name}</div>
                  </div>
                )}
                {pathwayData.mother_email && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div className="text-base">{pathwayData.mother_email}</div>
                  </div>
                )}
                {pathwayData.mother_mobile && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div className="text-base">{pathwayData.mother_mobile}</div>
                  </div>
                )}
                {pathwayData.mother_profession && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Profession</div>
                    <div className="text-base">{pathwayData.mother_profession}</div>
                  </div>
                )}
                {pathwayData.mother_monthly_income && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Monthly Income</div>
                    <div className="text-base">₹{pathwayData.mother_monthly_income}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(application.emergency_contact_name || pathwayData.guardian_mobile) && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.emergency_contact_name && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Contact Name</div>
                      <div className="text-base">{application.emergency_contact_name}</div>
                    </div>
                  )}
                  {(application.emergency_contact_phone || pathwayData.guardian_mobile) && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Contact Phone</div>
                      <div className="text-base">{application.emergency_contact_phone || pathwayData.guardian_mobile}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No documents uploaded yet
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Double-click a document row to preview it on screen.
                  </p>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onDoubleClick={() => viewDocumentInline(doc)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium">{doc.document_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : 'Unknown size'} • 
                              Uploaded {doc.uploaded_at ? format(new Date(doc.uploaded_at), 'dd MMM yyyy') : 'Unknown date'}
                            </div>
                            {doc.verification_notes && (
                              <div className="text-sm text-muted-foreground mt-1">
                                Note: {doc.verification_notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getDocumentStatusBadge(doc.status)}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewDocumentInline(doc)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment & Interview Tab */}
        <TabsContent value="assessment" className="space-y-6">
          {assessmentData && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment Results</CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentData.assessments && assessmentData.assessments.length > 0 ? (
                  <div className="space-y-4">
                    {assessmentData.assessments.map((assessment: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{assessment.subject}</div>
                          <Badge variant={assessment.status === 'pass' ? 'default' : 'destructive'}>
                            {assessment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Marks:</span> {assessment.marks}/{assessment.maxMarks}
                          </div>
                          {assessment.comments && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Comments:</span> {assessment.comments}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {assessmentData.overallComments && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="font-medium mb-2">Overall Comments</div>
                        <div className="text-sm">{assessmentData.overallComments}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No assessment data available
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {interviewData && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviewData.scheduledDate && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Scheduled Date</div>
                        <div className="text-base">{format(new Date(interviewData.scheduledDate), 'dd MMM yyyy')}</div>
                      </div>
                    )}
                    {interviewData.scheduledTime && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Time</div>
                        <div className="text-base">{interviewData.scheduledTime}</div>
                      </div>
                    )}
                    {interviewData.interviewer && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Interviewer</div>
                        <div className="text-base">{interviewData.interviewer}</div>
                      </div>
                    )}
                    {interviewData.result && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Result</div>
                        <Badge variant={interviewData.result === 'pass' ? 'default' : 'destructive'}>
                          {interviewData.result}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {interviewData.comments && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="font-medium mb-2">Interview Comments</div>
                      <div className="text-sm">{interviewData.comments}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {reviewData && (
            <Card>
              <CardHeader>
                <CardTitle>Review Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reviewData.academicScore && (
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{reviewData.academicScore}</div>
                      <div className="text-sm text-muted-foreground">Academic</div>
                    </div>
                  )}
                  {reviewData.behaviorScore && (
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{reviewData.behaviorScore}</div>
                      <div className="text-sm text-muted-foreground">Behavior</div>
                    </div>
                  )}
                  {reviewData.communicationScore && (
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{reviewData.communicationScore}</div>
                      <div className="text-sm text-muted-foreground">Communication</div>
                    </div>
                  )}
                  {reviewData.overallScore && (
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{reviewData.overallScore}</div>
                      <div className="text-sm text-muted-foreground">Overall</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {additionalData?.decision_made_at && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-8">
                      <div className="font-medium">Decision Made</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(additionalData.decision_made_at), 'dd MMM yyyy, HH:mm')}
                      </div>
                      {additionalData.decision_notes && (
                        <div className="text-sm mt-1">Note: {additionalData.decision_notes}</div>
                      )}
                    </div>
                  </div>
                )}
                {interviewData?.completedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-8">
                      <div className="font-medium">Interview Completed</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(interviewData.completedAt), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                  </div>
                )}
                {assessmentData?.completedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-8">
                      <div className="font-medium">Assessment Completed</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(assessmentData.completedAt), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                  </div>
                )}
                {reviewData?.reviewedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-8">
                      <div className="font-medium">Application Reviewed</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(reviewData.reviewedAt), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                  </div>
                )}
                {application.submitted_at && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-border"></div>
                    </div>
                    <div className="pb-8">
                      <div className="font-medium">Application Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(application.submitted_at), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                  </div>
                  <div>
                    <div className="font-medium">Application Created</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(application.created_at), 'dd MMM yyyy, HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setViewerUrl(null);
          }}
          documentUrl={viewerUrl}
          documentName={viewerDocName}
          mimeType={viewerMimeType}
          onDownload={() => {
            if (currentViewFilePath) {
              // simple download by opening signed URL in new tab from viewer only
              window.open(viewerUrl || '', '_blank');
            }
          }}
        />
      </div>
    );
  }

