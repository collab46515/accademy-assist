import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
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
import { ApplicationForms } from "@/components/admissions/ApplicationForms";
import { ApplicationManagement } from "@/components/admissions/ApplicationManagement";
import { AdmissionsWorkflow } from "@/components/admissions/AdmissionsWorkflow";
import { AdmissionsFlowVisualization } from "@/components/admissions/AdmissionsFlowVisualization";
import { StageDetailBreakdown } from "@/components/admissions/StageDetailBreakdown";
import { ApplicationTaskManager } from "@/components/admissions/ApplicationTaskManager";
import { StageWorkflowManager } from "@/components/admissions/StageWorkflowManager";
import { AdmissionStagesBreadcrumb } from "@/components/admissions/AdmissionStagesBreadcrumb";
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
  RotateCcw,
  ArrowLeft,
  X
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("management");
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
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [currentApplicationData, setCurrentApplicationData] = useState<any>(null);
  const [applicationProgress, setApplicationProgress] = useState(0);

  // Check if we're viewing a specific stage
  const stageParam = searchParams.get('stage');
  const currentStage = stageParam ? parseInt(stageParam) : null;
  
  // Force stage view to show when stage parameter exists
  const isStageView = stageParam !== null && !isNaN(parseInt(stageParam));

  // Mock data for development
  const mockApplications = [
    {
      id: "1",
      application_number: "APP202400001",
      pathway: "standard_digital",
      status: "submitted",
      student_name: "Emma Thompson",
      year_group: "Year 7",
      workflow_completion_percentage: 30,
      submitted_at: "2024-01-15T10:30:00Z",
      last_activity_at: "2024-01-20T14:20:00Z"
    },
    {
      id: "2",
      application_number: "APP202400002",
      pathway: "sibling_automatic",
      status: "submitted",
      student_name: "James Wilson",
      year_group: "Year 9",
      workflow_completion_percentage: 25,
      submitted_at: "2024-01-18T09:15:00Z",
      last_activity_at: "2024-01-22T11:45:00Z"
    },
    {
      id: "3",
      application_number: "APP202400003",
      pathway: "staff_child",
      status: "submitted",
      student_name: "Sophie Chen",
      year_group: "Year 8",
      workflow_completion_percentage: 20,
      submitted_at: "2024-01-20T14:30:00Z",
      last_activity_at: "2024-01-20T14:30:00Z"
    },
    {
      id: "4",
      application_number: "BULK202400001",
      pathway: "internal_progression",
      status: "approved",
      student_name: "Year 6 to 7 Promotion",
      year_group: "Bulk Operation",
      workflow_completion_percentage: 100,
      submitted_at: "2024-01-10T08:00:00Z",
      last_activity_at: "2024-01-25T16:30:00Z"
    },
    {
      id: "5",
      application_number: "APP202400004",
      pathway: "emergency_safeguarding",
      status: "interview_scheduled",
      student_name: "Marcus Rodriguez",
      year_group: "Year 10",
      workflow_completion_percentage: 60,
      submitted_at: "2024-01-22T09:15:00Z",
      last_activity_at: "2024-01-22T11:45:00Z"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL parameters for tab and filter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    const filterParam = urlParams.get('filter');
    
    if (tabParam) {
      setActiveTab(tabParam === 'management' ? 'applications' : tabParam);
    }
    if (filterParam) {
      // Map filter parameter to status for consistency
      if (filterParam === 'submitted') {
        setFilterStatus('submitted');
      } else {
        setFilterStatus(filterParam);
      }
    }
  }, [location.search]);

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
    setShowCreateDialog(false);
    setShowApplicationForm(true);
    setApplicationProgress(10); // Starting progress
    toast({
      title: "Application Started",
      description: `Starting ${ENROLLMENT_PATHWAYS[pathway as keyof typeof ENROLLMENT_PATHWAYS]?.name} process`,
    });
  };

  const handleApplicationSubmit = async (data: any) => {
    try {
      setApplicationProgress(50);
      
      // Here we would normally submit to Supabase
      console.log('Submitting application:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplicationProgress(100);
      
      toast({
        title: "Application Submitted Successfully",
        description: "Your application has been received and is being processed",
      });

      // Reset form state
      setShowApplicationForm(false);
      setSelectedPathway("");
      setApplicationProgress(0);
      
      // Refresh applications list
      loadData();
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleApplicationCancel = () => {
    setShowApplicationForm(false);
    setSelectedPathway("");
    setApplicationProgress(0);
    toast({
      title: "Application Cancelled",
      description: "Application process has been cancelled",
    });
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

  // If showing application form, render just the form
  if (showApplicationForm && selectedPathway) {
    return (
      <div className="min-h-screen bg-background">
        {/* Progress Header */}
        <div className="bg-card border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleApplicationCancel}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h2 className="text-xl font-semibold">
                    {ENROLLMENT_PATHWAYS[selectedPathway as keyof typeof ENROLLMENT_PATHWAYS]?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complete your application below
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleApplicationCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Admissions Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Application Progress</span>
                <span className="font-medium">{applicationProgress}%</span>
              </div>
              <Progress value={applicationProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Started</span>
                <span>In Progress</span>
                <span>Submitted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ApplicationForms onBackToDashboard={handleApplicationCancel} />
        </div>
      </div>
    );
  }

  // If viewing a specific workflow stage, show the StageWorkflowManager
  if (isStageView && currentStage !== null) {
    return (
      <div className="min-h-screen bg-background">
        {/* Stage Header */}
        <div className="bg-card border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admissions')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admissions Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Stage {currentStage + 1}: Application Management</h1>
                  <p className="text-sm text-muted-foreground">
                    Managing applications in this workflow stage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <StageWorkflowManager currentStage={currentStage} />
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
        
        {/* Admission Stages Breadcrumb */}
        <AdmissionStagesBreadcrumb />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="management">Application Management</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="pathways">New Applications</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <AdmissionsFlowVisualization />
          <StageDetailBreakdown />
          <AdmissionsWorkflow />
        </TabsContent>

        {/* Application Management Tab */}
        <TabsContent value="management" className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Application Overview</TabsTrigger>
              <TabsTrigger value="tasks">Task Management</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <ApplicationManagement initialFilter={filterStatus !== "all" ? filterStatus : undefined} />
            </TabsContent>
            <TabsContent value="tasks">
              <ApplicationTaskManager />
            </TabsContent>
          </Tabs>
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
                  onClick={() => handleStartApplication(key)}
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