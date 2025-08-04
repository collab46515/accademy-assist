import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ApplicationsList } from './applications/ApplicationsList';
import { ApplicationDetail } from './applications/ApplicationDetail';
import { WorkflowDashboard } from './workflow/WorkflowDashboard';
import { AssessmentScheduler } from './assessment/AssessmentScheduler';
import { DocumentManager } from './documents/DocumentManager';
import { ReportsAndAnalytics } from './reports/ReportsAndAnalytics';
import { Search, Filter, Users, Clock, CheckCircle, AlertTriangle, Calendar, FileText, BarChart3 } from 'lucide-react';

interface ApplicationManagementProps {
  initialFilter?: string;
}

export function ApplicationManagement({ initialFilter = 'all' }: ApplicationManagementProps) {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [activeTab, setActiveTab] = useState('applications');

  // Check URL parameters for initial filter state
  // Update filter when initialFilter prop changes
  React.useEffect(() => {
    console.log('ApplicationManagement - initialFilter changed:', initialFilter);
    setStatusFilter(initialFilter);
  }, [initialFilter]);

  // Also check URL parameters for filter changes
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    console.log('ApplicationManagement mounted');
    console.log('URL filter param:', filterParam);
    console.log('Current statusFilter:', statusFilter);
    
    if (filterParam && filterParam !== statusFilter) {
      // Only set valid filters, otherwise default to 'all'
      const validFilters = ['all', 'submitted', 'under_review', 'assessment_scheduled', 'interview_scheduled', 'pending_approval', 'approved'];
      const filterToSet = validFilters.includes(filterParam) ? filterParam : 'all';
      console.log('Setting statusFilter to:', filterToSet);
      setStatusFilter(filterToSet);
    }
  }, [window.location.search]); // Watch for URL changes

  // State for real stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    assessed: 0,
    approved: 0,
    waitlisted: 0,
    rejected: 0
  });

  // Fetch real stats from applications
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: applications } = await supabase
          .from('enrollment_applications')
          .select('status');
        
        if (applications) {
          const newStats = {
            total: applications.length,
            pending: applications.filter(app => app.status === 'submitted').length,
            reviewing: applications.filter(app => app.status === 'under_review').length,
            assessed: applications.filter(app => app.status === 'assessment_scheduled').length,
            approved: applications.filter(app => app.status === 'approved').length,
            waitlisted: applications.filter(app => app.status === 'documents_pending').length, // Use valid status
            rejected: applications.filter(app => app.status === 'rejected').length
          };
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use mock data as fallback
        setStats({
          total: 11,
          pending: 2,
          reviewing: 3,
          assessed: 2,
          approved: 2,
          waitlisted: 1,
          rejected: 1
        });
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-slate-100 text-slate-700 border-slate-200',
      submitted: 'bg-blue-100 text-blue-700 border-blue-200',
      under_review: 'bg-amber-100 text-amber-700 border-amber-200',
      assessment_scheduled: 'bg-purple-100 text-purple-700 border-purple-200',
      interview_scheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      pending_approval: 'bg-orange-100 text-orange-700 border-orange-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      waitlisted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      committed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      onboarding: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      enrolled: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  if (selectedApplication) {
    return (
      <ApplicationDetail
        applicationId={selectedApplication}
        onBack={() => setSelectedApplication(null)}
        getStatusColor={getStatusColor}
      />
    );
  }

  console.log('ApplicationManagement render - activeTab:', activeTab);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Application Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage enrollment applications and track progress through the admissions process
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="assessment_scheduled">Assessment Scheduled</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card 
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('all');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 cursor-pointer hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('submitted');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('under_review');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Reviewing</p>
                  <p className="text-2xl font-bold">{stats.reviewing}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 cursor-pointer hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('assessment_scheduled');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Assessment</p>
                  <p className="text-2xl font-bold">{stats.assessed}</p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('approved');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('waitlisted');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Waitlisted</p>
                  <p className="text-2xl font-bold">{stats.waitlisted}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 cursor-pointer hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              setStatusFilter('rejected');
              setActiveTab('applications');
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => {
          console.log('Tab changed to:', value);
          setActiveTab(value);
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border shadow-sm h-12 p-1">
            <TabsTrigger 
              value="applications" 
              className="flex items-center gap-2 h-10 rounded-md transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50 data-[state=active]:hover:bg-blue-600"
            >
              <Users className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="workflow" 
              className="flex items-center gap-2 h-10 rounded-md transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50 data-[state=active]:hover:bg-blue-600"
            >
              <Clock className="h-4 w-4" />
              Progress Tracking
            </TabsTrigger>
            <TabsTrigger 
              value="assessments" 
              className="flex items-center gap-2 h-10 rounded-md transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50 data-[state=active]:hover:bg-blue-600"
            >
              <Calendar className="h-4 w-4" />
              Assessments
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2 h-10 rounded-md transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50 data-[state=active]:hover:bg-blue-600"
            >
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 h-10 rounded-md transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50 data-[state=active]:hover:bg-blue-600"
            >
              <BarChart3 className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <ApplicationsList
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSelectApplication={setSelectedApplication}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="workflow">
            <WorkflowDashboard getStatusColor={getStatusColor} />
          </TabsContent>

          <TabsContent value="assessments">
            <AssessmentScheduler />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManager />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAndAnalytics />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}