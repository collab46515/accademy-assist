import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { HODCoverageDashboard } from '@/components/curriculum/HODCoverageDashboard';
import { GapAlertsSystem } from '@/components/curriculum/GapAlertsSystem';
import { PlanNextLessonButton } from '@/components/curriculum/PlanNextLessonButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  FileText,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function HODDashboardPage() {
  const { currentSchool, hasRole } = useRBAC();

  if (!currentSchool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>School Selection Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please select a school to access the HOD Dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has HOD permissions
  const isHOD = hasRole('hod') || hasRole('school_admin') || hasRole('super_admin');
  
  if (!isHOD) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This dashboard is only accessible to Head of Department (HOD) users and administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock HOD-specific stats
  const hodStats = [
    { 
      title: 'Department Coverage', 
      value: '87%', 
      change: '+5%', 
      icon: Target, 
      color: 'text-primary',
      description: 'Overall curriculum completion'
    },
    { 
      title: 'Critical Gaps', 
      value: '3', 
      change: '-2', 
      icon: AlertTriangle, 
      color: 'text-destructive',
      description: 'Require immediate attention'
    },
    { 
      title: 'Teachers Supported', 
      value: '12', 
      change: '+3', 
      icon: Users, 
      color: 'text-success',
      description: 'Active support cases'
    },
    { 
      title: 'Lessons Reviewed', 
      value: '45', 
      change: '+15', 
      icon: BookOpen, 
      color: 'text-info',
      description: 'This week'
    }
  ];

  const quickActions = [
    {
      title: 'Review Lesson Plans',
      description: 'Approve pending lesson plans',
      icon: FileText,
      action: 'review',
      count: 8,
      color: 'bg-blue-500'
    },
    {
      title: 'Support Requests',
      description: 'Teachers needing assistance',
      icon: Users,
      action: 'support',
      count: 3,
      color: 'bg-orange-500'
    },
    {
      title: 'Coverage Reports',
      description: 'Generate department reports',
      icon: BarChart3,
      action: 'reports',
      count: 0,
      color: 'bg-green-500'
    },
    {
      title: 'Upcoming Deadlines',
      description: 'Topics due this week',
      icon: Calendar,
      action: 'deadlines',
      count: 7,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      time: '10 min ago',
      activity: 'John Smith submitted Year 8 Algebra lesson plan',
      type: 'lesson_plan',
      status: 'pending'
    },
    {
      time: '1 hour ago',
      activity: 'Sarah Wilson requested support for differentiation strategies',
      type: 'support',
      status: 'active'
    },
    {
      time: '2 hours ago',
      activity: 'Mathematics Year 7 coverage updated to 92%',
      type: 'coverage',
      status: 'complete'
    },
    {
      time: '3 hours ago',
      activity: 'Alert: Fractions topic behind schedule (Year 4)',
      type: 'alert',
      status: 'urgent'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_plan': return BookOpen;
      case 'support': return Users;
      case 'coverage': return TrendingUp;
      case 'alert': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'text-destructive';
      case 'pending': return 'text-warning';
      case 'active': return 'text-info';
      case 'complete': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader 
        title="HOD Dashboard" 
        description="Head of Department curriculum management and oversight"
      />
      
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Monitor curriculum coverage, support your team, and ensure excellence across your department.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PlanNextLessonButton 
              schoolId={currentSchool.id} 
              teacherId={'current-user-id'} 
            />
            <div className="text-right">
              <p className="text-sm font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long' })}</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* HOD Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hodStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {stat.change} this week
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        {action.count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {action.count} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{action.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Open
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="coverage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="coverage" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Coverage Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Gap Alerts
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coverage" className="mt-0">
            <HODCoverageDashboard schoolId={currentSchool.id} />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <GapAlertsSystem schoolId={currentSchool.id} />
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Department Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                          <div className={`p-1 rounded ${getStatusColor(activity.status)}`}>
                            <ActivityIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.activity}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Department Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Department Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                      <h3 className="text-2xl font-bold text-primary mb-2">87%</h3>
                      <p className="text-sm text-muted-foreground">Overall Coverage Rate</p>
                      <p className="text-xs text-success mt-1">+5% from last week</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 border rounded-lg">
                        <p className="text-lg font-semibold">12/15</p>
                        <p className="text-xs text-muted-foreground">Teachers On Track</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-lg font-semibold">94%</p>
                        <p className="text-xs text-muted-foreground">Lesson Approval Rate</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Detailed Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}