import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Clock, CheckCircle, AlertTriangle, Users } from "lucide-react";

const ComplaintsPage = () => {
  const mockComplaints = [
    {
      id: "COMP-2024-0001",
      title: "Late Bus Service",
      complainant: "Sarah Johnson",
      type: "Transport",
      priority: "Medium",
      status: "Open",
      submittedDate: "2024-01-15",
      assignedTo: "Transport Manager"
    },
    {
      id: "COMP-2024-0002", 
      title: "Cafeteria Food Quality",
      complainant: "Mike Wilson",
      type: "Facilities",
      priority: "Low",
      status: "Under Review",
      submittedDate: "2024-01-14",
      assignedTo: "Facilities Team"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
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
        <Button onClick={() => console.log('New Complaint button clicked')}>
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2</div>
            <p className="text-xs text-muted-foreground">Days to resolve</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4" onValueChange={(value) => console.log('Complaints tab changed to:', value)}>
        <TabsList>
          <TabsTrigger value="active" onClick={() => console.log('Active complaints tab clicked')}>Active Complaints</TabsTrigger>
          <TabsTrigger value="all" onClick={() => console.log('All complaints tab clicked')}>All Complaints</TabsTrigger>
          <TabsTrigger value="analytics" onClick={() => console.log('Analytics tab clicked')}>Analytics</TabsTrigger>
          <TabsTrigger value="communications" onClick={() => console.log('Communications tab clicked')}>Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Complaints</CardTitle>
              <CardDescription>Complaints currently being processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{complaint.id}</span>
                        <Badge variant="outline" className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{complaint.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        By {complaint.complainant} • {complaint.type} • Assigned to {complaint.assignedTo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {complaint.submittedDate}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => console.log('View Details clicked for:', complaint.id)}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
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
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Complaint history will be displayed here</p>
                <p className="text-sm">Use filters to search through complaint records</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Analytics</CardTitle>
              <CardDescription>Insights and trends in complaint management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Analytics dashboard coming soon</p>
                <p className="text-sm">Track complaint trends and resolution metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Communications</CardTitle>
              <CardDescription>Track communications related to complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No communications recorded</p>
                <p className="text-sm">Communication logs will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplaintsPage;