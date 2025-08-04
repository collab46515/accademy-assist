import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, AlertTriangle, Users, Clock, CheckCircle } from "lucide-react";

const StudentWelfareSafeguardingPage = () => {
  const mockConcerns = [
    {
      id: "SF-2024-001",
      studentName: "Anonymous Student",
      type: "Welfare",
      severity: "Medium",
      status: "Under Investigation",
      reportedDate: "2024-01-15",
      assignedTo: "Safeguarding Lead",
      lastUpdate: "2024-01-16"
    },
    {
      id: "SF-2024-002",
      studentName: "Anonymous Student",
      type: "Bullying",
      severity: "High",
      status: "Action Plan Active",
      reportedDate: "2024-01-10",
      assignedTo: "DSL",
      lastUpdate: "2024-01-14"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800";
      case "Under Investigation": return "bg-yellow-100 text-yellow-800";
      case "Action Plan Active": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safeguarding</h1>
          <p className="text-muted-foreground">
            Manage safeguarding concerns and protect student welfare
          </p>
        </div>
        <Button onClick={() => console.log('Report Concern button clicked')}>
          <Plus className="mr-2 h-4 w-4" />
          Report Concern
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Concerns</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requiring monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">New concerns reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="concerns" className="space-y-4" onValueChange={(value) => console.log('Safeguarding tab changed to:', value)}>
        <TabsList>
          <TabsTrigger value="concerns" onClick={() => console.log('Concerns tab clicked')}>Active Concerns</TabsTrigger>
          <TabsTrigger value="actions" onClick={() => console.log('Actions tab clicked')}>Actions & Plans</TabsTrigger>
          <TabsTrigger value="reviews" onClick={() => console.log('Reviews tab clicked')}>Reviews</TabsTrigger>
          <TabsTrigger value="reports" onClick={() => console.log('Reports tab clicked')}>Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="concerns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Safeguarding Concerns</CardTitle>
              <CardDescription>Current concerns requiring attention and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConcerns.map((concern) => (
                  <div key={concern.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{concern.id}</span>
                        <Badge variant="outline" className={getStatusColor(concern.status)}>
                          {concern.status}
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(concern.severity)}>
                          {concern.severity}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{concern.type} Concern</h4>
                      <p className="text-sm text-muted-foreground">
                        Student: {concern.studentName} • Assigned to {concern.assignedTo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported {concern.reportedDate} • Last updated {concern.lastUpdate}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => console.log('View Details clicked for:', concern.id)}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safeguarding Actions</CardTitle>
              <CardDescription>Action plans and interventions for safeguarding concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No active action plans</p>
                <p className="text-sm">Safeguarding action plans will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safeguarding Reviews</CardTitle>
              <CardDescription>Regular reviews and assessments of safeguarding cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No reviews scheduled</p>
                <p className="text-sm">Safeguarding reviews will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safeguarding Reports</CardTitle>
              <CardDescription>Generate and view safeguarding reports and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Reports and analytics coming soon</p>
                <p className="text-sm">Comprehensive safeguarding reporting tools</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentWelfareSafeguardingPage;