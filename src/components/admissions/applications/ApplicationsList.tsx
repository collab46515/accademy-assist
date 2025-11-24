import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  application_number: string;
  student_name: string;
  year_group: string;
  pathway: string;
  status: string;
  submitted_at: string;
  date_of_birth: string;
  parent_email: string;
  parent_phone: string;
  workflow_completion_percentage: number;
  priority_score: number;
  nationality?: string;
  previous_school?: string;
}

interface ApplicationsListProps {
  searchTerm: string;
  statusFilter: string;
  stageStatuses?: string[]; // Optional array of statuses for stage filtering
  onSelectApplication: (id: string) => void;
  getStatusColor: (status: string) => string;
}

export function ApplicationsList({ 
  searchTerm, 
  statusFilter,
  stageStatuses,
  onSelectApplication, 
  getStatusColor 
}: ApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('Fetching applications from database...');
      
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      console.log('Database response - data:', data);
      console.log('Database response - error:', error);
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      // If we have real data, use it
      if (data && data.length > 0) {
        console.log('Setting applications data:', data.length, 'applications');
        setApplications(data);
      } else {
        // No applications yet - show empty state
        console.log('No applications found');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Set empty array on error
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Add debug logs at component level
  console.log('ApplicationsList render - statusFilter:', statusFilter, 'searchTerm:', searchTerm);
  console.log('ApplicationsList render - applications count:', applications.length);

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = 
        app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.parent_email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status - support both single status filter and stage statuses array
      let matchesStatus = false;
      
      if (stageStatuses && stageStatuses.length > 0) {
        // Stage filtering: check if app status is in the allowed statuses for this stage
        matchesStatus = stageStatuses.includes(app.status);
        console.log('Stage filtering - app:', app.student_name, 'status:', app.status, 'allowed:', stageStatuses, 'matches:', matchesStatus);
      } else {
        // Regular filtering: check against statusFilter
        const validFilters = ['all', 'submitted', 'under_review', 'assessment_scheduled', 'interview_scheduled', 'pending_approval', 'approved', 'on_hold', 'rejected'];
        const effectiveFilter = validFilters.includes(statusFilter) ? statusFilter : 'all';
        matchesStatus = effectiveFilter === 'all' || app.status === effectiveFilter;
        console.log('Regular filtering - app:', app.student_name, 'status:', app.status, 'filter:', effectiveFilter, 'matches:', matchesStatus);
      }
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
          break;
        case 'priority':
          comparison = (a.priority_score || 0) - (b.priority_score || 0);
          break;
        case 'progress':
          comparison = (a.workflow_completion_percentage || 0) - (b.workflow_completion_percentage || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-amber-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPriorityIcon = (score: number) => {
    if (score >= 80) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (score >= 60) return <Clock className="h-4 w-4 text-amber-500" />;
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      assessment_scheduled: 'Assessment Scheduled',
      interview_scheduled: 'Interview Scheduled',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      waitlisted: 'Waitlisted',
      on_hold: 'Waitlisted',
      rejected: 'Rejected',
      committed: 'Committed',
      onboarding: 'Onboarding',
      enrolled: 'Enrolled'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <div className="flex gap-2">
          {[
            { value: 'date', label: 'Date Submitted' },
            { value: 'priority', label: 'Priority Score' },
            { value: 'progress', label: 'Progress' }
          ].map(option => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(option.value as any)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-6">
        {filteredApplications.map((application) => (
          <Card 
            key={application.id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500"
            onClick={() => onSelectApplication(application.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="text-white font-semibold">
                      {application.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-foreground">
                        {application.student_name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {application.application_number}
                      </Badge>
                      {getPriorityIcon(application.priority_score || 0)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Year {application.year_group}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(application.date_of_birth), 'dd MMM yyyy')}
                      </span>
                      {application.nationality && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {application.nationality}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusLabel(application.status)}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pathway</p>
                  <p className="text-sm font-medium capitalize">{application.pathway.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Parent Contact</p>
                  <p className="text-sm">{application.parent_email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                  <p className="text-sm">{format(new Date(application.submitted_at), 'dd MMM yyyy, HH:mm')}</p>
                </div>
              </div>

              {application.previous_school && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Previous School</p>
                  <p className="text-sm">{application.previous_school}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs text-muted-foreground">Progress:</span>
                  <div className="flex-1 max-w-xs">
                    <Progress 
                      value={application.workflow_completion_percentage || 0} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {application.workflow_completion_percentage || 0}%
                  </span>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'No applications have been submitted yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}