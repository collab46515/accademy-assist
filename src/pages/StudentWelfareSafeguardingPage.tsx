import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Plus, AlertTriangle, Users, Clock, CheckCircle, FileText, Eye } from "lucide-react";
import { useState } from "react";
import { SafeguardingForm } from "@/components/safeguarding";
import { useSafeguardingData } from "@/hooks/useSafeguardingData";
import { CSVReportSection } from "@/components/shared/CSVReportSection";

const StudentWelfareSafeguardingPage = () => {
  const [activeTab, setActiveTab] = useState("concerns");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { concerns, stats, loading } = useSafeguardingData();

  const handleReportConcern = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
  };

  const getActiveConcerns = () => {
    return concerns.filter(concern => 
      concern.status === 'open' || concern.status === 'in_progress'
    );
  };

  const displayConcerns = activeTab === "concerns" ? getActiveConcerns() : concerns;
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "bg-red-200 text-red-900";
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "escalated": return "bg-orange-100 text-orange-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
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
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleReportConcern} className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Report Concern
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Report Safeguarding Concern</DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              <SafeguardingForm onSubmit={handleFormSubmit} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("concerns")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Concerns</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.active}</div>
            <p className="text-xs text-muted-foreground">Requiring monitoring</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("high-priority")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("monthly")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">New concerns reported</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("resolved")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="concerns">Active Concerns</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="reports">📊 Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="concerns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Safeguarding Concerns</CardTitle>
              <CardDescription>Current concerns requiring attention and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Loading concerns...</p>
                </div>
              ) : displayConcerns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No active concerns</p>
                  <p className="text-sm">All concerns have been resolved</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayConcerns.map((concern) => (
                    <div key={concern.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{concern.concern_number}</span>
                          <Badge variant="outline" className={getStatusColor(concern.status)}>
                            {concern.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getRiskLevelColor(concern.risk_level)}>
                            {concern.risk_level.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold capitalize">{concern.concern_type.replace('_', ' ')} Concern</h4>
                        <p className="text-sm text-muted-foreground">
                          Assigned to {concern.dsl_assigned || 'DSL'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reported {new Date(concern.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high-priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Concerns</CardTitle>
              <CardDescription>Critical and high-risk concerns requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Loading high priority concerns...</p>
                </div>
              ) : concerns.filter(c => (c.risk_level === 'high' || c.risk_level === 'critical') && (c.status === 'open' || c.status === 'in_progress')).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No high priority concerns</p>
                  <p className="text-sm">All high-risk concerns have been addressed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {concerns.filter(c => (c.risk_level === 'high' || c.risk_level === 'critical') && (c.status === 'open' || c.status === 'in_progress')).map((concern) => (
                    <div key={concern.id} className="flex items-center justify-between p-4 border-2 border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{concern.concern_number}</span>
                          <Badge variant="outline" className={getRiskLevelColor(concern.risk_level)}>
                            {concern.risk_level.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <h4 className="font-semibold capitalize text-red-800">{concern.concern_type.replace('_', ' ')} Concern</h4>
                        <p className="text-sm text-red-700">
                          Assigned to {concern.dsl_assigned || 'DSL'}
                        </p>
                        <p className="text-xs text-red-600">
                          Reported {new Date(concern.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Concerns</CardTitle>
              <CardDescription>Successfully resolved and closed safeguarding concerns</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Loading resolved concerns...</p>
                </div>
              ) : concerns.filter(c => c.status === 'resolved' || c.status === 'closed').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No resolved concerns yet</p>
                  <p className="text-sm">Resolved concerns will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {concerns.filter(c => c.status === 'resolved' || c.status === 'closed').map((concern) => (
                    <div key={concern.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{concern.concern_number}</span>
                          <Badge variant="outline" className={getStatusColor(concern.status)}>
                            {concern.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold capitalize">{concern.concern_type.replace('_', ' ')} Concern</h4>
                        <p className="text-sm text-muted-foreground">
                          Resolved by {concern.dsl_assigned || 'DSL'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Closed {concern.closed_at ? new Date(concern.closed_at).toLocaleDateString() : 'Date not available'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Record
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <CSVReportSection
            title="Safeguarding Reports"
            description="Generate comprehensive safeguarding reports for analysis, compliance, and record keeping"
            moduleName="safeguarding"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentWelfareSafeguardingPage;