import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Filter
} from 'lucide-react';
import { useAdvancedRecruitment } from '@/hooks/useAdvancedRecruitment';
import { JobRequisitionsManager } from './JobRequisitionsManager';
import { CandidatePool } from './CandidatePool';
import { ApplicationsManager } from './ApplicationsManager';
import { InterviewManager } from './InterviewManager';
import { OffersManager } from './OffersManager';
import { OnboardingManager } from './OnboardingManager';

export function RecruitmentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    loading,
    jobRequisitions,
    candidates,
    jobApplications,
    interviewSchedules,
    jobOffers,
    onboardingProgress
  } = useAdvancedRecruitment();

  // Calculate dashboard statistics
  const stats = {
    activeRequisitions: jobRequisitions.filter(req => req.status === 'approved').length,
    totalCandidates: candidates.length,
    pendingApplications: jobApplications.filter(app => app.status === 'submitted').length,
    scheduledInterviews: interviewSchedules.filter(int => int.status === 'scheduled').length,
    pendingOffers: jobOffers.filter(offer => offer.status === 'pending').length,
    activeOnboarding: onboardingProgress.filter(prog => prog.status === 'in_progress').length
  };

  const recentActivities = [
    ...jobApplications.slice(0, 3).map(app => ({
      id: app.id,
      type: 'application',
      title: `New application received`,
      description: `Application for ${app.job_posting_id}`,
      time: app.created_at,
      status: app.status
    })),
    ...interviewSchedules.slice(0, 3).map(interview => ({
      id: interview.id,
      type: 'interview',
      title: `Interview scheduled`,
      description: `${interview.stage_id} interview`,
      time: interview.scheduled_date,
      status: interview.status
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recruitment Management</h1>
          <p className="text-muted-foreground">
            End-to-end recruitment process management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requisitions</CardTitle>
                <Briefcase className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.activeRequisitions}</div>
                <p className="text-xs text-muted-foreground">Open positions to fill</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidate Pool</CardTitle>
                <Users className="h-4 w-4 text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.totalCandidates}</div>
                <p className="text-xs text-muted-foreground">Total candidates</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <FileText className="h-4 w-4 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-foreground">{stats.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Interviews</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.scheduledInterviews}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOffers}</div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Onboarding</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeOnboarding}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest recruitment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'application' ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : (
                          <Calendar className="h-4 w-4 text-accent-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common recruitment tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab('requisitions')}>
                    <Plus className="h-4 w-4" />
                    <span className="text-xs">New Requisition</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab('candidates')}>
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Add Candidate</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab('interviews')}>
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Schedule Interview</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab('offers')}>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Make Offer</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requisitions">
          <JobRequisitionsManager />
        </TabsContent>

        <TabsContent value="candidates">
          <CandidatePool />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsManager />
        </TabsContent>

        <TabsContent value="interviews">
          <InterviewManager />
        </TabsContent>

        <TabsContent value="offers">
          <OffersManager />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}