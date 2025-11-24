import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock, CheckCircle, Eye, Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pathwayConfig } from '@/lib/enrollment-schemas';
import { Database } from '@/integrations/supabase/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PathwayType = Database['public']['Enums']['enrollment_pathway'];

interface Application {
  id: string;
  application_number: string;
  student_name: string;
  year_group: string;
  status: string;
  pathway: PathwayType;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  parent_email: string;
}

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If not logged in, prompt for email
        toast.error('Please log in to view your applications');
        return;
      }

      setUserEmail(user.email || '');

      // Fetch applications for this user's email
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('parent_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeApplication = (applicationId: string, pathway: PathwayType) => {
    navigate(`/admissions/enroll?type=${pathway}&applicationId=${applicationId}`);
  };

  const handleViewApplication = (applicationId: string) => {
    navigate(`/admissions?stage=1&applicationId=${applicationId}`);
  };

  const handleDeleteDraft = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Draft deleted successfully');
      fetchUserApplications(); // Refresh the list
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; icon: React.ReactNode }> = {
      draft: { variant: 'outline', label: 'Draft', icon: <Clock className="h-3 w-3" /> },
      submitted: { variant: 'secondary', label: 'Submitted', icon: <FileText className="h-3 w-3" /> },
      under_review: { variant: 'default', label: 'Under Review', icon: <Eye className="h-3 w-3" /> },
      documents_pending: { variant: 'outline', label: 'Pending Docs', icon: <AlertCircle className="h-3 w-3" /> },
      assessment_scheduled: { variant: 'secondary', label: 'Assessment Scheduled', icon: <Clock className="h-3 w-3" /> },
      interview_scheduled: { variant: 'secondary', label: 'Interview Scheduled', icon: <Clock className="h-3 w-3" /> },
      offer_made: { variant: 'default', label: 'Offer Made', icon: <CheckCircle className="h-3 w-3" /> },
      enrolled: { variant: 'default', label: 'Enrolled', icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { variant: 'destructive', label: 'Not Accepted', icon: <AlertCircle className="h-3 w-3" /> },
      withdrawn: { variant: 'outline', label: 'Withdrawn', icon: <AlertCircle className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const renderApplicationCard = (application: Application) => {
    const isDraft = application.status === 'draft';
    
    // Map database pathway to display name
    const pathwayDisplay: Record<PathwayType, string> = {
      'standard_digital': 'Standard Admission',
      'sibling_automatic': 'Sibling Application',
      'staff_child': 'Staff Child',
      'partner_school': 'Partner School',
      'emergency_safeguarding': 'Emergency Enrollment',
      'internal_progression': 'Internal Progression',
    };

    return (
      <Card key={application.id} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{application.student_name || 'New Application'}</CardTitle>
              <CardDescription className="mt-1">
                {pathwayDisplay[application.pathway] || 'Standard Admission'} • {application.year_group || 'Not specified'}
              </CardDescription>
            </div>
            {getStatusBadge(application.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application #</span>
              <span className="font-medium">{application.application_number}</span>
            </div>
            
            {application.submitted_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">{format(new Date(application.submitted_at), 'dd MMM yyyy')}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{isDraft ? 'Last Saved' : 'Updated'}</span>
              <span className="font-medium">{format(new Date(application.updated_at), 'dd MMM yyyy, HH:mm')}</span>
            </div>

            <div className="flex gap-2 pt-2">
              {isDraft ? (
                <>
                  <Button 
                    onClick={() => handleResumeApplication(application.id, application.pathway)}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Resume Application
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setApplicationToDelete(application.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => handleViewApplication(application.id)}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const draftApplications = applications.filter(app => app.status === 'draft');
  const submittedApplications = applications.filter(app => app.status !== 'draft');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground mt-1">
              Manage your enrollment applications
            </p>
          </div>
          <Button onClick={() => navigate('/admissions/enroll')}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftApplications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No applications yet</h3>
                <p className="text-muted-foreground">
                  Start your first application to begin the enrollment process
                </p>
              </div>
              <Button onClick={() => navigate('/admissions/enroll')}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftApplications.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({submittedApplications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map(renderApplicationCard)}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              {draftApplications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">No draft applications</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {draftApplications.map(renderApplicationCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              {submittedApplications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">No submitted applications</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {submittedApplications.map(renderApplicationCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your draft application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApplicationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => applicationToDelete && handleDeleteDraft(applicationToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
