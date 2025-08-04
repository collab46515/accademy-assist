import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  CheckCircle,
  Bell,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HODPortal() {
  const navigate = useNavigate();

  const departmentStats = [
    { title: 'Coverage Rate', value: '87%', target: '90%', status: 'good', icon: Target, color: 'text-success' },
    { title: 'Critical Gaps', value: '3', change: '-2', status: 'warning', icon: AlertTriangle, color: 'text-warning' },
    { title: 'Teachers', value: '15', active: '12', status: 'info', icon: Users, color: 'text-info' },
    { title: 'Pending Reviews', value: '8', priority: 'high', status: 'urgent', icon: FileText, color: 'text-destructive' }
  ];

  const todaysPriorities = [
    { 
      task: 'Review Year 8 Algebra lesson plans', 
      time: '10:00 AM', 
      priority: 'high', 
      teacher: 'John Smith',
      type: 'review'
    },
    { 
      task: 'Support meeting - Differentiation strategies', 
      time: '11:30 AM', 
      priority: 'medium', 
      teacher: 'Sarah Wilson',
      type: 'meeting'
    },
    { 
      task: 'Coverage assessment - Year 7 Fractions', 
      time: '2:00 PM', 
      priority: 'high', 
      teacher: 'Multiple',
      type: 'assessment'
    },
    { 
      task: 'Department planning session', 
      time: '3:30 PM', 
      priority: 'medium', 
      teacher: 'Team',
      type: 'planning'
    }
  ];

  const coverageOverview = [
    { yearGroup: 'Year 7', coverage: 92, onTrack: true, topics: 12, completed: 11 },
    { yearGroup: 'Year 8', coverage: 85, onTrack: true, topics: 14, completed: 12 },
    { yearGroup: 'Year 9', coverage: 78, onTrack: false, topics: 16, completed: 12 },
    { yearGroup: 'Year 10', coverage: 88, onTrack: true, topics: 18, completed: 16 },
    { yearGroup: 'Year 11', coverage: 95, onTrack: true, topics: 15, completed: 14 }
  ];

  const recentAlerts = [
    { 
      title: 'Fractions topic behind schedule', 
      message: 'Year 4 - 5 days overdue',
      severity: 'high',
      time: '2 hours ago',
      teacher: 'Emma Davis'
    },
    { 
      title: 'Support request received', 
      message: 'Help with differentiation needed',
      severity: 'medium',
      time: '4 hours ago',
      teacher: 'Michael Brown'
    },
    { 
      title: 'Lesson plan approved', 
      message: 'Year 9 Trigonometry - excellent work',
      severity: 'low',
      time: '6 hours ago',
      teacher: 'Lisa Chen'
    }
  ];

  const quickActions = [
    { title: 'HOD Dashboard', description: 'Full coverage dashboard', icon: BarChart3, path: '/hod-dashboard', color: 'bg-primary' },
    { title: 'Review Plans', description: '8 pending approvals', icon: FileText, path: '/curriculum', color: 'bg-blue-500' },
    { title: 'Support Teachers', description: '3 active requests', icon: Users, path: '/hr-management', color: 'bg-green-500' },
    { title: 'Reports', description: 'Generate coverage reports', icon: TrendingUp, path: '/analytics', color: 'bg-purple-500' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'review': return FileText;
      case 'meeting': return Users;
      case 'assessment': return BarChart3;
      case 'planning': return Calendar;
      default: return CheckCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">HOD Portal</h1>
            <p className="text-muted-foreground">Monitor, support, and lead your department to excellence</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/hod-dashboard')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Full Dashboard
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts (3)
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long' })}</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Department Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <Badge variant={stat.status === 'urgent' ? 'destructive' : 'outline'} className="text-xs">
                    {stat.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  {stat.target && (
                    <p className="text-xs text-muted-foreground">Target: {stat.target}</p>
                  )}
                  {stat.change && (
                    <p className="text-xs text-success">{stat.change} this week</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Priorities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysPriorities.map((item, index) => {
                    const TaskIcon = getTaskIcon(item.type);
                    return (
                      <div key={index} className={`flex items-center gap-4 p-3 rounded-lg border ${getPriorityColor(item.priority)}`}>
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs font-medium">{item.time}</p>
                        </div>
                        <TaskIcon className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.task}</p>
                          <p className="text-xs opacity-70">{item.teacher}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-start gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full mt-1 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                        <span className="text-xs">•</span>
                        <p className="text-xs text-muted-foreground">{alert.teacher}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Curriculum Coverage Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coverageOverview.map((year, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-sm min-w-[80px]">{year.yearGroup}</span>
                      <Progress value={year.coverage} className="flex-1 max-w-xs" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{year.coverage}%</span>
                      <span className="text-xs text-muted-foreground">
                        {year.completed}/{year.topics} topics
                      </span>
                      <Badge variant={year.onTrack ? 'secondary' : 'destructive'} className="text-xs">
                        {year.onTrack ? 'On Track' : 'Behind'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg ${action.color} text-white flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(action.path)}
                    >
                      Open
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}