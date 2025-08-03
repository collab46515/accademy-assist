import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserPlus, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Users,
  Mail,
  Upload,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  Plus,
  UserCheck,
  GraduationCap,
  ArrowRight,
  Shield,
  BookOpen,
  Building,
  Heart,
  Workflow,
  RotateCcw
} from "lucide-react";

// Enrollment pathway configuration
const ENROLLMENT_PATHWAYS = {
  standard_digital: {
    name: "Standard Digital Admissions",
    description: "Full online application process for external families",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-800",
    features: ["Online Application", "Assessment Required", "Interview", "Full Documentation", "Payment Required"]
  },
  sibling_automatic: {
    name: "Sibling Automatic Enrolment",
    description: "Priority enrollment for siblings of current students",
    icon: Users,
    color: "bg-green-100 text-green-800",
    features: ["Priority Placement", "Reduced Assessment", "Family Verification", "Same House Placement"]
  },
  internal_progression: {
    name: "Internal Year Group Progression",
    description: "Automatic promotion between year groups",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-800",
    features: ["Batch Processing", "Auto Class Assignment", "Retain Pastoral Data", "Parent Notification"]
  },
  staff_child: {
    name: "Staff Child Placement",
    description: "Preferential entry for children of staff members",
    icon: Shield,
    color: "bg-orange-100 text-orange-800",
    features: ["Fast Track", "Fee Waiver Available", "Minimal Requirements", "Employment Verification"]
  },
  partner_school: {
    name: "Partner School Acquisition",
    description: "Bulk intake from feeder/partner schools",
    icon: Building,
    color: "bg-indigo-100 text-indigo-800",
    features: ["Bulk Import", "CSV Processing", "Partner Verification", "Group Processing"]
  },
  emergency_safeguarding: {
    name: "Emergency/Safeguarding Referral",
    description: "Urgent enrollment for vulnerable children",
    icon: Heart,
    color: "bg-red-100 text-red-800",
    features: ["Immediate Placement", "DSL Assignment", "No Fees", "Minimal Data Required"]
  }
};

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  documents_pending: "bg-orange-100 text-orange-800",
  assessment_scheduled: "bg-purple-100 text-purple-800",
  assessment_complete: "bg-indigo-100 text-indigo-800",
  interview_scheduled: "bg-cyan-100 text-cyan-800",
  interview_complete: "bg-teal-100 text-teal-800",
  pending_approval: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  offer_sent: "bg-lime-100 text-lime-800",
  offer_accepted: "bg-emerald-100 text-emerald-800",
  offer_declined: "bg-slate-100 text-slate-800",
  enrolled: "bg-green-200 text-green-900",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-200 text-gray-800",
  on_hold: "bg-yellow-200 text-yellow-800",
  requires_override: "bg-pink-100 text-pink-800"
};

const UnifiedAdmissionsPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [applications, setApplications] = useState<any[]>([]);
  const [enrollmentTypes, setEnrollmentTypes] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPathway, setFilterPathway] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState("");

  // Mock data for development
  const mockApplications = [
    {
      id: "1",
      application_number: "APP202400001",
      pathway: "standard_digital",
      status: "interview_scheduled",
      student_name: "Emma Thompson",
      year_group: "Year 7",
      workflow_completion_percentage: 60,
      submitted_at: "2024-01-15T10:30:00Z",
      last_activity_at: "2024-01-20T14:20:00Z"
    },
    {
      id: "2",
      application_number: "APP202400002",
      pathway: "sibling_automatic",
      status: "pending_approval",
      student_name: "James Wilson",
      year_group: "Year 9",
      workflow_completion_percentage: 80,
      submitted_at: "2024-01-18T09:15:00Z",
      last_activity_at: "2024-01-22T11:45:00Z"
    },
    {
      id: "3",
      application_number: "BULK202400001",
      pathway: "internal_progression",
      status: "approved",
      student_name: "Year 6 to 7 Promotion",
      year_group: "Bulk Operation",
      workflow_completion_percentage: 100,
      submitted_at: "2024-01-10T08:00:00Z",
      last_activity_at: "2024-01-25T16:30:00Z"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load enrollment types
      const { data: types } = await supabase
        .from('enrollment_types')
        .select('*')
        .eq('is_active', true)
        .order('priority_level');

      if (types) {
        setEnrollmentTypes(types);
      }

      // Load workflows
      const { data: workflowData } = await supabase
        .from('enrollment_workflows')
        .select('*')
        .eq('is_active', true);

      if (workflowData) {
        setWorkflows(workflowData);
      }

      // For now, use mock data for applications
      setApplications(mockApplications);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load admissions data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.application_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPathway = filterPathway === "all" || app.pathway === filterPathway;
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesPathway && matchesStatus;
  });

  const handleStartApplication = (pathway: string) => {
    setSelectedPathway(pathway);
    setShowCreateDialog(true);
  };

  const handleViewApplication = (app: any) => {
    setSelectedApplication(app);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStats = () => {
    const total = applications.length;
    const inProgress = applications.filter(app => 
      ['submitted', 'under_review', 'interview_scheduled'].includes(app.status)
    ).length;
    const approved = applications.filter(app => 
      ['approved', 'offer_sent', 'enrolled'].includes(app.status)
    ).length;
    const pending = applications.filter(app => 
      ['pending_approval', 'requires_override'].includes(app.status)
    ).length;

    return { total, inProgress, approved, pending };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admissions system...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Unified Admissions System</h1>
        <p className="text-muted-foreground">
          Complete admissions management with 6 enrollment pathways, workflow automation, and approval processes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pathways">Enrollment Pathways</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Management</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest application activity across all pathways</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => {
                  const pathwayConfig = ENROLLMENT_PATHWAYS[app.pathway as keyof typeof ENROLLMENT_PATHWAYS];
                  const IconComponent = pathwayConfig?.icon || FileText;
                  
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/20 transition-[var(--transition-smooth)]">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${pathwayConfig?.color || 'bg-gray-100'}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{app.student_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {app.application_number} • {pathwayConfig?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={STATUS_COLORS[app.status as keyof typeof STATUS_COLORS]}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getProgressColor(app.workflow_completion_percentage)}`}>
                            {app.workflow_completion_percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(app.last_activity_at)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewApplication(app)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollment Pathways Tab */}
        <TabsContent value="pathways" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(ENROLLMENT_PATHWAYS).map(([key, pathway]) => {
              const IconComponent = pathway.icon;
              
              return (
                <Card key={key} className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${pathway.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pathway.name}</CardTitle>
                        <CardDescription className="text-sm">{pathway.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {pathway.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleStartApplication(key)}
                      >
                        Start {pathway.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Applications</CardTitle>
                  <CardDescription>Manage and track all enrollment applications</CardDescription>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name or application number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterPathway} onValueChange={setFilterPathway}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by pathway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pathways</SelectItem>
                    {Object.entries(ENROLLMENT_PATHWAYS).map(([key, pathway]) => (
                      <SelectItem key={key} value={key}>{pathway.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {filteredApplications.map((app) => {
                  const pathwayConfig = ENROLLMENT_PATHWAYS[app.pathway as keyof typeof ENROLLMENT_PATHWAYS];
                  const IconComponent = pathwayConfig?.icon || FileText;
                  
                  return (
                    <Card key={app.id} className="border-border/50 hover:border-primary/20 transition-[var(--transition-smooth)]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${pathwayConfig?.color || 'bg-gray-100'}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{app.student_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {app.application_number} • {app.year_group} • {pathwayConfig?.name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge className={STATUS_COLORS[app.status as keyof typeof STATUS_COLORS]}>
                                {app.status.replace('_', ' ')}
                              </Badge>
                              <div className="flex items-center space-x-2 mt-1">
                                <Progress value={app.workflow_completion_percentage} className="w-16 h-2" />
                                <span className={`text-xs ${getProgressColor(app.workflow_completion_percentage)}`}>
                                  {app.workflow_completion_percentage}%
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewApplication(app)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Management Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="h-5 w-5" />
                <span>Workflow Management</span>
              </CardTitle>
              <CardDescription>Configure and manage enrollment workflows for each pathway</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Pathway:</span>
                          <Badge variant="secondary">
                            {ENROLLMENT_PATHWAYS[workflow.pathway as keyof typeof ENROLLMENT_PATHWAYS]?.name || workflow.pathway}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <Badge variant={workflow.is_active ? "default" : "destructive"}>
                            {workflow.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Default:</span>
                          <Badge variant={workflow.is_default ? "default" : "secondary"}>
                            {workflow.is_default ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Configure Workflow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve enrollment applications and overrides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Approvals</h3>
                <p className="text-muted-foreground">All applications are up to date</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate comprehensive reports on admissions data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Application Summary</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Pathway Analysis</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Timeline Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Details Modal */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details - {selectedApplication.student_name}</DialogTitle>
              <DialogDescription>
                {selectedApplication.application_number} • {ENROLLMENT_PATHWAYS[selectedApplication.pathway as keyof typeof ENROLLMENT_PATHWAYS]?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={STATUS_COLORS[selectedApplication.status as keyof typeof STATUS_COLORS]}>
                    {selectedApplication.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedApplication.workflow_completion_percentage} className="flex-1" />
                    <span className="text-sm">{selectedApplication.workflow_completion_percentage}%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Close
                </Button>
                <Button>
                  Manage Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Application Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Enrollment Pathway</DialogTitle>
            <DialogDescription>
              Choose the appropriate enrollment pathway for this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {Object.entries(ENROLLMENT_PATHWAYS).map(([key, pathway]) => {
              const IconComponent = pathway.icon;
              
              return (
                <Button
                  key={key}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    setSelectedPathway(key);
                    setShowCreateDialog(false);
                    toast({
                      title: "Pathway Selected",
                      description: `Starting ${pathway.name} application process`,
                    });
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${pathway.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{pathway.name}</div>
                      <div className="text-xs text-muted-foreground">{pathway.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedAdmissionsPage;