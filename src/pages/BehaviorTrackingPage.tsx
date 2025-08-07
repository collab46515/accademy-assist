import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Award, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Users,
  CalendarDays,
  FileText,
  Star,
  Zap,
  Shield,
  Target,
  CheckCircle,
  XCircle,
  Timer,
  Bell
} from 'lucide-react';
import { BehaviorIncidents } from '@/components/behavior/BehaviorIncidents';
import { MeritDemeritSystem } from '@/components/behavior/MeritDemeritSystem';
import { DetentionManagement } from '@/components/behavior/DetentionManagement';
import { BehaviorAnalytics } from '@/components/behavior/BehaviorAnalytics';
import { InterventionPlans } from '@/components/behavior/InterventionPlans';
import { BehaviorRewards } from '@/components/behavior/BehaviorRewards';

export default function BehaviorTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for behavior statistics
  const behaviorStats = {
    totalIncidents: 23,
    resolvedIncidents: 18,
    activeDetentions: 5,
    meritsThisWeek: 142,
    demeritThisWeek: 31,
    studentsOnWatch: 8,
    interventionPlans: 12,
    rewardsGiven: 67
  };

  const recentIncidents = [
    {
      id: 1,
      student: 'Sarah Johnson',
      class: '9A',
      type: 'Disruption',
      severity: 'Minor',
      status: 'Resolved',
      date: '2024-01-15',
      teacher: 'Mr. Smith'
    },
    {
      id: 2,
      student: 'Mike Chen',
      class: '10B',
      type: 'Late to Class',
      severity: 'Minor',
      status: 'Active',
      date: '2024-01-15',
      teacher: 'Ms. Davis'
    },
    {
      id: 3,
      student: 'Emma Wilson',
      class: '8C',
      type: 'Bullying',
      severity: 'Major',
      status: 'Under Review',
      date: '2024-01-14',
      teacher: 'Mrs. Brown'
    }
  ];

  const upcomingDetentions = [
    {
      id: 1,
      student: 'Alex Thompson',
      class: '11A',
      date: '2024-01-16',
      time: '15:30',
      duration: '1 hour',
      supervisor: 'Mr. Johnson',
      reason: 'Repeated tardiness'
    },
    {
      id: 2,
      student: 'Jessica Lee',
      class: '9B',
      date: '2024-01-17',
      time: '15:30',
      duration: '30 minutes',
      supervisor: 'Ms. Williams',
      reason: 'Homework not completed'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Behavior Tracking</h1>
          <p className="text-muted-foreground">
            Comprehensive student behavior management and intervention system
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log New Incident
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students, incidents, or classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="merits">Merits & Demerits</TabsTrigger>
          <TabsTrigger value="detentions">Detentions</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{behaviorStats.totalIncidents}</div>
                <p className="text-xs text-muted-foreground">
                  {behaviorStats.resolvedIncidents} resolved this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Merit Points</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{behaviorStats.meritsThisWeek}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Detentions</CardTitle>
                <Clock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{behaviorStats.activeDetentions}</div>
                <p className="text-xs text-muted-foreground">
                  2 scheduled for today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intervention Plans</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{behaviorStats.interventionPlans}</div>
                <p className="text-xs text-muted-foreground">
                  3 new this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{incident.student}</div>
                        <div className="text-sm text-muted-foreground">
                          {incident.class} • {incident.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={incident.severity === 'Major' ? 'destructive' : 'secondary'}
                          className="mb-1"
                        >
                          {incident.severity}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{incident.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Detentions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Detentions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDetentions.map((detention) => (
                    <div key={detention.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{detention.student}</div>
                        <div className="text-sm text-muted-foreground">
                          {detention.class} • {detention.reason}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{detention.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {detention.time} ({detention.duration})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  Log Incident
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Award className="h-6 w-6 mb-2" />
                  Award Merit
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Clock className="h-6 w-6 mb-2" />
                  Schedule Detention
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Target className="h-6 w-6 mb-2" />
                  Create Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tab Contents */}
        <TabsContent value="incidents">
          <BehaviorIncidents />
        </TabsContent>

        <TabsContent value="merits">
          <MeritDemeritSystem />
        </TabsContent>

        <TabsContent value="detentions">
          <DetentionManagement />
        </TabsContent>

        <TabsContent value="interventions">
          <InterventionPlans />
        </TabsContent>

        <TabsContent value="rewards">
          <BehaviorRewards />
        </TabsContent>
      </Tabs>
    </div>
  );
}
