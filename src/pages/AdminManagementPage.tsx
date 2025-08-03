import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Database, 
  GitBranch, 
  Shield, 
  School,
  FileText,
  Calendar,
  Mail,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const systemStats = {
    totalUsers: 2847,
    activeSchools: 15,
    totalWorkflows: 24,
    pendingApprovals: 12,
    systemHealth: 98.5,
    lastBackup: '2 hours ago'
  };

  const recentActivity = [
    {
      id: 1,
      type: 'workflow',
      description: 'Standard Admissions workflow updated',
      user: 'Sarah Johnson',
      timestamp: '10 minutes ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'user',
      description: 'New school admin role assigned',
      user: 'Michael Chen',
      timestamp: '1 hour ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'system',
      description: 'Database backup completed',
      user: 'System',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'approval',
      description: 'Emergency enrollment approval required',
      user: 'Lisa Thompson',
      timestamp: '3 hours ago',
      status: 'pending'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workflow': return <GitBranch className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'system': return <Database className="h-4 w-4" />;
      case 'approval': return <Shield className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-amber-600';
      case 'error': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Management
            </h1>
            <p className="text-muted-foreground mt-1">
              System configuration, workflows, master data, and user management
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Setup
          </Button>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">System Health</p>
                  <p className="text-3xl font-bold">{systemStats.systemHealth}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Schools</p>
                  <p className="text-3xl font-bold">{systemStats.activeSchools}</p>
                </div>
                <School className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{systemStats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Pending Approvals</p>
                  <p className="text-3xl font-bold">{systemStats.pendingApprovals}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="masterdata" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Master Data
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system changes and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                        <div className={`p-2 rounded-lg bg-slate-100 ${getStatusColor(activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            by {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <GitBranch className="h-6 w-6" />
                      <span className="text-sm">Create Workflow</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Add User</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <School className="h-6 w-6" />
                      <span className="text-sm">Setup School</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Edit Template</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system performance and health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Performance</span>
                      <span className="text-sm text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm text-green-600">120ms</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm text-amber-600">78%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Management</CardTitle>
                <CardDescription>Configure and manage admission workflows across all schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Workflow Configuration</h3>
                    <p className="text-muted-foreground mb-4">
                      Set up admission workflows, approval processes, and automation rules
                    </p>
                    <Button>Configure Workflows</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User & Role Management</CardTitle>
                <CardDescription>Manage system users, roles, and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">User Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Add users, assign roles, and configure permissions across schools
                    </p>
                    <Button>Manage Users</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="masterdata">
            <Card>
              <CardHeader>
                <CardTitle>Master Data Management</CardTitle>
                <CardDescription>Configure system-wide data and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Master Data</h3>
                    <p className="text-muted-foreground mb-4">
                      Manage schools, year groups, subjects, and other core data
                    </p>
                    <Button>Configure Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Template Management</CardTitle>
                <CardDescription>Manage document templates and communication templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Templates</h3>
                    <p className="text-muted-foreground mb-4">
                      Create and edit email templates, document templates, and forms
                    </p>
                    <Button>Manage Templates</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Global system configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
                    <p className="text-muted-foreground mb-4">
                      Configure system-wide settings, integrations, and preferences
                    </p>
                    <Button>Configure Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}