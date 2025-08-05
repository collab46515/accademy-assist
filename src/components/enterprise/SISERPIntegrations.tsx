import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Database, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Users,
  BookOpen,
  DollarSign,
  Webhook,
  Key,
  RefreshCw,
  TestTube
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: 'sis' | 'erp' | 'lms' | 'finance' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  description: string;
  lastSync?: string;
  dataTypes: string[];
  vendor?: string;
  icon: string;
  webhook?: string;
  syncFrequency: string;
  settings: Record<string, any>;
}

export function SISERPIntegrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [showAddIntegration, setShowAddIntegration] = useState(false);

  // Mock integrations data
  const mockIntegrations: Integration[] = [
    {
      id: 'powerschool',
      name: 'PowerSchool SIS',
      type: 'sis',
      status: 'connected',
      description: 'Student Information System integration for student data sync',
      lastSync: '2024-01-05T14:30:00Z',
      dataTypes: ['Students', 'Teachers', 'Classes', 'Grades', 'Attendance'],
      vendor: 'PowerSchool',
      icon: '🎓',
      webhook: 'https://api.academyassist.com/webhooks/powerschool',
      syncFrequency: 'hourly',
      settings: {
        apiKey: '***************',
        serverUrl: 'https://school.powerschool.com',
        syncStudents: true,
        syncGrades: true,
        syncAttendance: true
      }
    },
    {
      id: 'sap',
      name: 'SAP ERP',
      type: 'erp',
      status: 'connected',
      description: 'Enterprise Resource Planning for financial and HR data',
      lastSync: '2024-01-05T12:00:00Z',
      dataTypes: ['Finance', 'HR', 'Payroll', 'Budgets', 'Assets'],
      vendor: 'SAP',
      icon: '💼',
      webhook: 'https://api.academyassist.com/webhooks/sap',
      syncFrequency: 'daily',
      settings: {
        clientId: '***************',
        serverHost: 'sap.school.edu',
        syncFinance: true,
        syncHR: true,
        syncPayroll: false
      }
    },
    {
      id: 'moodle',
      name: 'Moodle LMS',
      type: 'lms',
      status: 'error',
      description: 'Learning Management System for course and assignment data',
      lastSync: '2024-01-04T08:15:00Z',
      dataTypes: ['Courses', 'Assignments', 'Submissions', 'Grades'],
      vendor: 'Moodle',
      icon: '📚',
      webhook: 'https://api.academyassist.com/webhooks/moodle',
      syncFrequency: 'realtime',
      settings: {
        apiToken: '***************',
        moodleUrl: 'https://learn.school.edu',
        syncCourses: true,
        syncGrades: true,
        syncAssignments: true
      }
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      type: 'finance',
      status: 'disconnected',
      description: 'Financial management and accounting system',
      dataTypes: ['Invoices', 'Payments', 'Expenses', 'Reports'],
      vendor: 'Intuit',
      icon: '💰',
      syncFrequency: 'daily',
      settings: {}
    }
  ];

  const availableIntegrations = [
    { id: 'infinite-campus', name: 'Infinite Campus', type: 'sis', icon: '🏫' },
    { id: 'clever', name: 'Clever', type: 'sis', icon: '🔗' },
    { id: 'google-classroom', name: 'Google Classroom', type: 'lms', icon: '📖' },
    { id: 'canvas', name: 'Canvas LMS', type: 'lms', icon: '🎨' },
    { id: 'oracle-erp', name: 'Oracle ERP Cloud', type: 'erp', icon: '🏛️' },
    { id: 'microsoft-dynamics', name: 'Microsoft Dynamics', type: 'erp', icon: '🖥️' },
    { id: 'stripe', name: 'Stripe', type: 'finance', icon: '💳' },
    { id: 'wise', name: 'Wise', type: 'finance', icon: '🌍' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending': return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sis': return <Users className="h-4 w-4" />;
      case 'erp': return <Database className="h-4 w-4" />;
      case 'lms': return <BookOpen className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const handleTestConnection = (integrationId: string) => {
    console.log(`Testing connection for ${integrationId}`);
    // Mock test connection
  };

  const handleSync = (integrationId: string) => {
    console.log(`Manual sync for ${integrationId}`);
    // Mock sync
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              SIS & ERP Integrations
            </CardTitle>
            <Button onClick={() => setShowAddIntegration(true)}>
              <Zap className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Integration Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockIntegrations.length}</div>
                    <div className="text-sm text-muted-foreground">Total Integrations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {mockIntegrations.filter(i => i.status === 'connected').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {mockIntegrations.filter(i => i.status === 'error').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-muted-foreground">Sync Schedule</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Integrations */}
          <div className="space-y-4">
            {mockIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge variant="outline">{integration.type.toUpperCase()}</Badge>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`} />
                            {getStatusIcon(integration.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        {integration.lastSync && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last sync: {new Date(integration.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(integration.id)}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        disabled={integration.status !== 'connected'}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-1">
                      {integration.dataTypes.map((dataType) => (
                        <Badge key={dataType} variant="secondary" className="text-xs">
                          {dataType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
              <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Available Integrations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableIntegrations.map((integration) => (
                    <Card key={integration.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">{integration.icon}</div>
                          <div>
                            <h5 className="font-medium">{integration.name}</h5>
                            <Badge variant="outline" className="text-xs mt-1">
                              {integration.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <Button className="w-full mt-3" variant="outline" size="sm">
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="webhooks" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Webhook Configuration</h4>
                <div className="space-y-4">
                  {mockIntegrations.filter(i => i.webhook).map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Webhook className="h-4 w-4" />
                          <span className="font-medium">{integration.name}</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input value={integration.webhook} readOnly />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">API Access & Security</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Key className="h-4 w-4" />
                        <span className="font-medium">API Key Management</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Academy Assist API Key</Label>
                          <Input value="aa_key_***************" readOnly />
                        </div>
                        <Button variant="outline" size="sm">
                          Regenerate Key
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-3">Security Settings</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>IP Whitelisting</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Rate Limiting</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Audit Logging</Label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sync" className="mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Synchronization Settings</h4>
                <div className="space-y-4">
                  {mockIntegrations.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{integration.icon}</span>
                          <span className="font-medium">{integration.name}</span>
                        </div>
                        <Select defaultValue={integration.syncFrequency}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {integration.dataTypes.map((dataType) => (
                          <div key={dataType} className="flex items-center gap-1">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>{dataType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}