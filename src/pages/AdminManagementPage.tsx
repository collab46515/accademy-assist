import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkflowDashboard } from '@/components/admissions/workflow/WorkflowDashboard';
import { SystemResetManager } from '@/components/admin/SystemResetManager';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Activity,
  Zap
} from 'lucide-react';

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [quickSetupOpen, setQuickSetupOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleQuickAction = (action: string) => {
    // Navigate to appropriate pages based on action
    switch (action) {
      case "Create Workflow":
        setActiveTab('workflows');
        break;
      case "Add User":
      case "Add New User":
        navigate('/user-management');
        break;
      case "Setup School":
      case "Manage Schools":
        navigate('/master-data');
        break;
      case "Edit Template":
      case "Email Templates":
      case "Manage All Templates":
        toast({
          title: "Feature Coming Soon",
          description: "Template management is under development.",
        });
        break;
      case "School Configuration":
        navigate('/master-data');
        break;
      case "User Roles Setup":
      case "Manage Roles":
        navigate('/user-management');
        break;
      case "Academic Structure":
      case "Year Groups":
      case "Subjects Setup":
        navigate('/master-data');
        break;
      case "Fee Structure":
      case "Fee Categories":
        navigate('/school-management/fee-management');
        break;
      case "View All Users":
        navigate('/user-management');
        break;
      case "Configure All Master Data":
        navigate('/master-data');
        break;
      case "General Settings":
      case "Security Settings":
      case "Advanced Configuration":
        toast({
          title: "Settings",
          description: `Opening ${action}...`,
        });
        setActiveTab('settings');
        break;
      default:
        toast({
          title: "Action Initiated",
          description: `${action} feature is being prepared...`,
        });
    }
  };

  const quickSetupSteps = [
    { id: 1, title: "School Configuration", description: "Set up basic school information and settings", completed: true },
    { id: 2, title: "User Roles Setup", description: "Define user roles and permissions", completed: true },
    { id: 3, title: "Academic Structure", description: "Configure year groups, subjects, and classes", completed: false },
    { id: 4, title: "Fee Structure", description: "Set up fee categories and payment schedules", completed: false },
    { id: 5, title: "Communication Templates", description: "Configure email and SMS templates", completed: false },
  ];

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
          <Dialog open={quickSetupOpen} onOpenChange={setQuickSetupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Quick Setup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>System Quick Setup</DialogTitle>
                <DialogDescription>
                  Complete these essential setup steps to get your system running smoothly
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {quickSetupSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : <span>{step.id}</span>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <Button 
                      variant={step.completed ? "outline" : "default"} 
                      size="sm"
                      onClick={() => handleQuickAction(step.title)}
                    >
                      {step.completed ? "Review" : "Setup"}
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => toast({ title: "System Health", description: `Current system health: ${systemStats.systemHealth}%. All services running optimally.` })}
          >
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

          <Card 
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => toast({ title: "Active Schools", description: `${systemStats.activeSchools} schools are currently active in the system.` })}
          >
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

          <Card 
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => toast({ title: "Total Users", description: `${systemStats.totalUsers} users are registered across all schools.` })}
          >
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

          <Card 
            className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => toast({ title: "Pending Approvals", description: `${systemStats.pendingApprovals} items require your attention.` })}
          >
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
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                      onClick={() => handleQuickAction("Create Workflow")}
                    >
                      <GitBranch className="h-6 w-6" />
                      <span className="text-sm">Create Workflow</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                      onClick={() => handleQuickAction("Add User")}
                    >
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Add User</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                      onClick={() => handleQuickAction("Setup School")}
                    >
                      <School className="h-6 w-6" />
                      <span className="text-sm">Setup School</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                      onClick={() => handleQuickAction("Edit Template")}
                    >
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
            <WorkflowDashboard getStatusColor={(status: string) => {
              switch (status) {
                case 'completed': return 'text-green-600';
                case 'pending': return 'text-amber-600';
                case 'error': return 'text-red-600';
                default: return 'text-slate-600';
              }
            }} />
          </TabsContent>

          <TabsContent value="users">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User & Role Management</CardTitle>
                  <CardDescription>Manage system users, roles, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Add New User")}
                      >
                        <Users className="h-5 w-5" />
                        <span className="text-sm">Add User</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Manage Roles")}
                      >
                        <Shield className="h-5 w-5" />
                        <span className="text-sm">Manage Roles</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("User Permissions")}
                      >
                        <Settings className="h-5 w-5" />
                        <span className="text-sm">Permissions</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Bulk Import Users")}
                      >
                        <Database className="h-5 w-5" />
                        <span className="text-sm">Bulk Import</span>
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleQuickAction("View All Users")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View All Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                  <CardDescription>Latest user management activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "New teacher added", user: "John Smith", time: "2 hours ago" },
                      { action: "Role updated", user: "Sarah Wilson", time: "4 hours ago" },
                      { action: "Permission granted", user: "Mike Johnson", time: "1 day ago" },
                      { action: "User deactivated", user: "Lisa Brown", time: "2 days ago" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="masterdata">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Master Data Management</CardTitle>
                  <CardDescription>Configure system-wide data and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Manage Schools")}
                      >
                        <School className="h-5 w-5" />
                        <span className="text-sm">Schools</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Year Groups")}
                      >
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">Year Groups</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Subjects Setup")}
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Subjects</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Fee Categories")}
                      >
                        <Database className="h-5 w-5" />
                        <span className="text-sm">Fee Categories</span>
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleQuickAction("Configure All Master Data")}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Configure All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Statistics</CardTitle>
                  <CardDescription>Overview of configured master data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Schools Configured", value: "15", color: "text-blue-600" },
                      { label: "Year Groups", value: "12", color: "text-green-600" },
                      { label: "Subjects", value: "45", color: "text-purple-600" },
                      { label: "Fee Categories", value: "8", color: "text-amber-600" }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{stat.label}</span>
                        <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Template Management</CardTitle>
                  <CardDescription>Manage document templates and communication templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Email Templates")}
                      >
                        <Mail className="h-5 w-5" />
                        <span className="text-sm">Email Templates</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Document Templates")}
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Documents</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Report Templates")}
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span className="text-sm">Reports</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Form Templates")}
                      >
                        <Database className="h-5 w-5" />
                        <span className="text-sm">Forms</span>
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleQuickAction("Manage All Templates")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Manage All Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Template Library</CardTitle>
                  <CardDescription>Available templates and recent changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Admission Letter", type: "Document", updated: "2 days ago" },
                      { name: "Welcome Email", type: "Email", updated: "1 week ago" },
                      { name: "Report Card", type: "Report", updated: "3 days ago" },
                      { name: "Fee Invoice", type: "Document", updated: "5 days ago" }
                    ].map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{template.updated}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleQuickAction(`Edit ${template.name}`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Global system configuration and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("General Settings")}
                      >
                        <Settings className="h-5 w-5" />
                        <span className="text-sm">General</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Security Settings")}
                      >
                        <Shield className="h-5 w-5" />
                        <span className="text-sm">Security</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Integration Settings")}
                      >
                        <Activity className="h-5 w-5" />
                        <span className="text-sm">Integrations</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleQuickAction("Backup Settings")}
                      >
                        <Database className="h-5 w-5" />
                        <span className="text-sm">Backup</span>
                      </Button>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleQuickAction("Advanced Configuration")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Advanced Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Current system configuration and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "System Version", value: "v2.4.1", status: "success" },
                      { label: "Database Version", value: "PostgreSQL 14", status: "success" },
                      { label: "Last Backup", value: "2 hours ago", status: "success" },
                      { label: "Security Scan", value: "Clean", status: "success" }
                    ].map((info, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{info.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{info.value}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* System Reset Section */}
            <SystemResetManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}