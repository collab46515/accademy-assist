import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  Shield,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ManagementPortal() {
  const navigate = useNavigate();

  const quickStats = [
    { title: 'Total Students', value: '1,247', change: '+12', icon: Users, color: 'text-blue-600' },
    { title: 'Active Staff', value: '89', change: '+3', icon: GraduationCap, color: 'text-green-600' },
    { title: 'Applications', value: '156', change: '+24', icon: FileText, color: 'text-purple-600' },
    { title: 'Revenue (MTD)', value: '£45,230', change: '+8%', icon: DollarSign, color: 'text-orange-600' }
  ];

  const quickActions = [
    { title: 'View Analytics', description: 'School performance insights', icon: BarChart3, path: '/analytics', color: 'bg-blue-500' },
    { title: 'Staff Management', description: 'HR and staffing', icon: Users, path: '/hr-management', color: 'bg-green-500' },
    { title: 'Financial Reports', description: 'Revenue and expenses', icon: DollarSign, path: '/accounting', color: 'bg-orange-500' },
    { title: 'System Settings', description: 'School configuration', icon: Settings, path: '/master-data', color: 'bg-purple-500' }
  ];

  const alerts = [
    { type: 'urgent', message: 'Staff meeting scheduled for 2:00 PM', time: '10 min ago' },
    { type: 'info', message: 'New admission applications pending review', time: '1 hour ago' },
    { type: 'warning', message: 'Attendance rate below 95% this week', time: '2 hours ago' }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Management Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your school overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change} this month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => navigate(action.path)}
                        >
                          Access
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs opacity-70">{alert.time}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '09:00', event: 'Senior Leadership Team Meeting', location: 'Conference Room A' },
                { time: '11:30', event: 'Parent-Teacher Conference Review', location: 'Main Office' },
                { time: '14:00', event: 'Budget Planning Session', location: 'Finance Office' },
                { time: '16:00', event: 'Safeguarding Committee Meeting', location: 'Conference Room B' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                  <div className="text-center">
                    <p className="text-sm font-medium">{item.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                  </div>
                  <Badge variant="outline">Today</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}