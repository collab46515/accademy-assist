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
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['enrollment_applications']['Row'];

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentSchool } = useRBAC();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  
  const applicationId = searchParams.get('id');

  useEffect(() => {
    if (applicationId && currentSchool?.id) {
      fetchApplication();
    }
  }, [applicationId, currentSchool?.id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('school_id', currentSchool.id)
        .single();

      if (error) throw error;

      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
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
      approved: { variant: 'default', label: 'Approved', icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
      enrolled: { variant: 'default', label: 'Enrolled', icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600' },
      rejected: { variant: 'destructive', label: 'Rejected', icon: <XCircle className="h-4 w-4" />, color: 'text-red-600' },
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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <div className="flex gap-2">
          <Button variant="outline">Print</Button>
          <Button>Update Status</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student">Student Details</TabsTrigger>
          <TabsTrigger value="parent">Parent/Guardian</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  Year {application.year_group || 'Not specified'}
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
                    <div className="text-sm text-muted-foreground">{application.student_name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Date of Birth</div>
                    <div className="text-sm text-muted-foreground">
                      {application.date_of_birth 
                        ? format(new Date(application.date_of_birth), 'dd MMM yyyy')
                        : 'Not provided'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Previous School</div>
                    <div className="text-sm text-muted-foreground">{application.previous_school || 'Not provided'}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Parent/Guardian</div>
                    <div className="text-sm text-muted-foreground">{application.parent_name || 'Not provided'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{application.parent_email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{application.parent_phone || 'Not provided'}</div>
                  </div>
                </div>
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
                  <div className="text-base">{application.student_name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                  <div className="text-base">
                    {application.date_of_birth 
                      ? format(new Date(application.date_of_birth), 'dd MMM yyyy')
                      : 'Not provided'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Year Group</div>
                  <div className="text-base">Year {application.year_group || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Previous School</div>
                  <div className="text-base">{application.previous_school || 'Not provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parent Details Tab */}
        <TabsContent value="parent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="text-base">{application.parent_name || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="text-base">{application.parent_email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone Number</div>
                  <div className="text-base">{application.parent_phone || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="text-base">{(application.additional_data as any)?.address || 'Not provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Contact Name</div>
                  <div className="text-base">{application.emergency_contact_name || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Contact Phone</div>
                  <div className="text-base">{application.emergency_contact_phone || 'Not provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Application Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Document management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
    </div>
  );
}
