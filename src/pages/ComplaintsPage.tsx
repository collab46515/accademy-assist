import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, Clock, CheckCircle, AlertTriangle, Users, FileText, Download } from "lucide-react";
import { useState } from "react";
import { ComplaintForm, ComplaintDetailsModal } from "@/components/complaints";
import { useComplaintsData } from "@/hooks/useComplaintsData";
import { CSVReportSection } from "@/components/shared/CSVReportSection";

const ComplaintsPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { complaints, stats, loading } = useComplaintsData();

  console.log('Complaints data:', { complaints, stats, loading }); // Debug log

  const handleNewComplaint = () => {
    setIsFormOpen(true);
  };

  const handleViewDetails = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
  };
  const getTodaysComplaints = () => {
    const today = new Date().toISOString().split('T')[0];
    return complaints.filter(complaint => 
      complaint.created_at.startsWith(today)
    );
  };

  const getOpenComplaints = () => {
    return complaints.filter(complaint => 
      complaint.status === 'open' || complaint.status === 'in_progress'
    );
  };

  const displayComplaints = activeTab === "active" ? getOpenComplaints() : complaints;

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-200 text-red-900";
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
          <p className="text-muted-foreground">
            Track and resolve student and parent complaints
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewComplaint}>
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Submit New Complaint</DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              <ComplaintForm onSubmit={handleFormSubmit} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {console.log('Clicked Total'); setActiveTab("all")}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.total}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("active")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.open}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.avgResolutionDays}</div>
            <p className="text-xs text-muted-foreground">Days to resolve</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Complaints</TabsTrigger>
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="reports">📊 Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Complaints</CardTitle>
              <CardDescription>Complaints currently being processed</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Loading complaints...</p>
                </div>
              ) : displayComplaints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No active complaints</p>
                  <p className="text-sm">All complaints have been resolved</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayComplaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{complaint.complaint_number}</span>
                          <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {complaint.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                            {complaint.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          By {complaint.complainant_name} • {complaint.complaint_type} • Assigned to {complaint.assigned_to || 'Unassigned'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint.id)}>
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Complaints</CardTitle>
              <CardDescription>Complete history of complaints</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Loading complaints...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No complaints found</p>
                  <p className="text-sm">Submit the first complaint to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{complaint.complaint_number}</span>
                          <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {complaint.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                            {complaint.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          By {complaint.complainant_name} • {complaint.complaint_type} • {complaint.assigned_to || 'Unassigned'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint.id)}>
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
              <CardTitle>Resolved Complaints</CardTitle>
              <CardDescription>Successfully resolved and closed complaints</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Loading resolved complaints...</p>
                </div>
              ) : complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No resolved complaints yet</p>
                  <p className="text-sm">Resolved complaints will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.filter(c => c.status === 'resolved' || c.status === 'closed').map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{complaint.complaint_number}</span>
                          <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {complaint.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{complaint.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          By {complaint.complainant_name} • {complaint.complaint_type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Resolved {complaint.resolved_at ? new Date(complaint.resolved_at).toLocaleDateString() : 'Date not available'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint.id)}>
                        View Details
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
            title="Complaints Reports"
            description="Generate comprehensive reports of complaints data for analysis and record keeping"
            moduleName="complaints"
          />
        </TabsContent>
      </Tabs>

      {/* Complaint Details Modal */}
      <ComplaintDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        complaintId={selectedComplaintId}
      />
    </div>
  );
};

export default ComplaintsPage;