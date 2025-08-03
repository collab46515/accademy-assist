import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Settings, 
  Plug,
  CheckCircle,
  AlertTriangle,
  Globe,
  Key,
  Zap,
  Users,
  BookOpen,
  CreditCard
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "lms" | "sso" | "payment" | "communication" | "analytics";
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  enabled: boolean;
  users: number;
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Google Workspace",
    description: "Single Sign-On and email integration",
    category: "sso",
    status: "connected",
    lastSync: "2024-01-15 14:30",
    enabled: true,
    users: 847
  },
  {
    id: "2",
    name: "Moodle LMS",
    description: "Learning Management System integration",
    category: "lms",
    status: "connected",
    lastSync: "2024-01-15 13:45",
    enabled: true,
    users: 623
  },
  {
    id: "3",
    name: "Stripe Payments",
    description: "Online payment processing",
    category: "payment",
    status: "connected",
    lastSync: "2024-01-15 15:20",
    enabled: true,
    users: 156
  },
  {
    id: "4",
    name: "Microsoft Teams",
    description: "Video conferencing and communication",
    category: "communication",
    status: "error",
    lastSync: "2024-01-14 16:30",
    enabled: false,
    users: 0
  }
];

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
    }
  };

  const getCategoryIcon = (category: Integration["category"]) => {
    switch (category) {
      case "lms":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "sso":
        return <Key className="h-4 w-4 text-green-500" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-500" />;
      case "communication":
        return <Users className="h-4 w-4 text-orange-500" />;
      case "analytics":
        return <Zap className="h-4 w-4 text-red-500" />;
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));
  };

  const connectedIntegrations = integrations.filter(i => i.status === "connected").length;
  const totalUsers = integrations.reduce((sum, integration) => sum + integration.users, 0);
  const errorIntegrations = integrations.filter(i => i.status === "error").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Integration & API Platform</h1>
        <p className="text-muted-foreground">Connect with external tools via SSO, LMS integration, and third-party app marketplace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-3xl font-bold text-success">{connectedIntegrations}</p>
              </div>
              <Plug className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-primary">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-3xl font-bold text-destructive">{errorIntegrations}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API Calls</p>
                <p className="text-3xl font-bold text-primary">24.7K</p>
              </div>
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Active Integrations</span>
              </CardTitle>
              <CardDescription>Manage your connected third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Enabled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations.map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(integration.category)}
                            <span className="capitalize">{integration.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(integration.status)}</TableCell>
                        <TableCell>{integration.lastSync}</TableCell>
                        <TableCell>{integration.users}</TableCell>
                        <TableCell>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Configure</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Integration Marketplace</span>
              </CardTitle>
              <CardDescription>Discover and connect new services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">Browse hundreds of pre-built integrations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-primary" />
                <span>API Management</span>
              </CardTitle>
              <CardDescription>Manage API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">API Configuration</h3>
                <p className="text-muted-foreground">API key management and webhook configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;