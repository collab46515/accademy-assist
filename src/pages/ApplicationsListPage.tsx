import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  FileText, 
  Search, 
  Filter,
  ArrowLeft,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Application {
  id: string;
  application_number: string;
  student_name: string;
  year_group: string;
  status: string;
  pathway: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  parent_email: string;
  parent_phone: string;
}

export default function ApplicationsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentSchool } = useRBAC();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterParam = searchParams.get('filter') || 'all';

  useEffect(() => {
    if (currentSchool?.id) {
      fetchApplications();
    }
  }, [currentSchool?.id, filterParam]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('enrollment_applications')
        .select('*')
        .eq('school_id', currentSchool.id)
        .order('created_at', { ascending: false });

      // Apply filters based on URL parameter
      if (filterParam === 'pending') {
        query = query.in('status', ['under_review', 'documents_pending', 'submitted']);
      } else if (filterParam === 'approved') {
        query = query.in('status', ['approved', 'enrolled']);
      } else if (filterParam === 'rejected') {
        query = query.eq('status', 'rejected');
      } else if (filterParam === 'verified') {
        query = query.not('status', 'in', '(under_review,documents_pending,submitted)');
      } else if (filterParam === 'assessment_complete') {
        query = query.in('status', ['assessment_complete', 'interview_scheduled', 'interview_complete', 'approved', 'enrolled']);
      } else if (filterParam === 'interview_complete') {
        query = query.in('status', ['interview_complete', 'approved', 'enrolled']);
      }

      const { data, error } = await query;

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; icon: React.ReactNode; color: string }> = {
      draft: { variant: 'outline', label: 'Draft', icon: <Clock className="h-3 w-3" />, color: 'text-muted-foreground' },
      submitted: { variant: 'secondary', label: 'Submitted', icon: <FileText className="h-3 w-3" />, color: 'text-blue-600' },
      under_review: { variant: 'default', label: 'Under Review', icon: <Eye className="h-3 w-3" />, color: 'text-amber-600' },
      documents_pending: { variant: 'outline', label: 'Docs Pending', icon: <AlertCircle className="h-3 w-3" />, color: 'text-orange-600' },
      assessment_scheduled: { variant: 'secondary', label: 'Assessment Scheduled', icon: <Clock className="h-3 w-3" />, color: 'text-purple-600' },
      assessment_complete: { variant: 'secondary', label: 'Assessment Complete', icon: <CheckCircle className="h-3 w-3" />, color: 'text-purple-600' },
      interview_scheduled: { variant: 'secondary', label: 'Interview Scheduled', icon: <Clock className="h-3 w-3" />, color: 'text-indigo-600' },
      interview_complete: { variant: 'secondary', label: 'Interview Complete', icon: <CheckCircle className="h-3 w-3" />, color: 'text-indigo-600' },
      approved: { variant: 'default', label: 'Approved', icon: <CheckCircle className="h-3 w-3" />, color: 'text-green-600' },
      enrolled: { variant: 'default', label: 'Enrolled', icon: <CheckCircle className="h-3 w-3" />, color: 'text-green-600' },
      rejected: { variant: 'destructive', label: 'Rejected', icon: <XCircle className="h-3 w-3" />, color: 'text-red-600' },
      withdrawn: { variant: 'outline', label: 'Withdrawn', icon: <AlertCircle className="h-3 w-3" />, color: 'text-gray-600' },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getFilterTitle = () => {
    const titles: Record<string, string> = {
      all: 'All Applications',
      pending: 'Pending Applications',
      approved: 'Approved Applications',
      rejected: 'Rejected Applications',
      verified: 'Verified Applications',
      assessment_complete: 'Assessment Complete',
      interview_complete: 'Interview Complete'
    };
    return titles[filterParam] || 'All Applications';
  };

  const filteredApplications = applications.filter(app => 
    searchTerm === '' ||
    app.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.application_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.parent_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
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
            onClick={() => navigate('/admissions')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{getFilterTitle()}</h1>
            <p className="text-muted-foreground mt-1">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        <Button onClick={() => navigate('/admissions/enroll')}>
          New Application
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, application number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No applications found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'No applications match the selected filter'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card 
              key={application.id} 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/admissions?stage=1&applicationId=${application.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{application.student_name || 'Unnamed Application'}</CardTitle>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>#{application.application_number}</span>
                      <span>•</span>
                      <span>Year {application.year_group || 'Not specified'}</span>
                      <span>•</span>
                      <span>{format(new Date(application.created_at), 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Parent Email</div>
                    <div className="font-medium">{application.parent_email || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone</div>
                    <div className="font-medium">{application.parent_phone || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Pathway</div>
                    <div className="font-medium capitalize">{application.pathway?.replace('_', ' ') || 'Standard'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Updated</div>
                    <div className="font-medium">{format(new Date(application.updated_at), 'dd MMM yyyy')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
