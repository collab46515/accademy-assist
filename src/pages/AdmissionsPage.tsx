import { useState } from "react";
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
  GraduationCap
} from "lucide-react";

const AdmissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [enrollmentData, setEnrollmentData] = useState({
    studentId: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalInfo: "",
    previousSchool: "",
    startDate: ""
  });

  const [applications, setApplications] = useState([
    {
      id: "APP2024001",
      student: "Emma Thompson",
      year: "Year 7",
      stage: "Interview Scheduled",
      progress: 60,
      status: "In Progress",
      submitted: "15 Oct 2024",
      interview: "22 Oct 2024",
      email: "emma.thompson@email.com",
      phone: "+44 7700 900001",
      documents: ["Birth Certificate", "School Reports"],
      notes: "Strong academic background"
    },
    {
      id: "APP2024002", 
      student: "Marcus Rodriguez",
      year: "Year 9",
      stage: "Documents Under Review",
      progress: 40,
      status: "Pending",
      submitted: "12 Oct 2024",
      interview: "TBD",
      email: "marcus.rodriguez@email.com",
      phone: "+44 7700 900002",
      documents: ["Birth Certificate", "Passport"],
      notes: "Transfer student from Spain"
    },
    {
      id: "APP2024003",
      student: "Aisha Patel",
      year: "Year 12",
      stage: "Offer Sent",
      progress: 90,
      status: "Awaiting Response",
      submitted: "8 Oct 2024",
      interview: "Completed",
      email: "aisha.patel@email.com",
      phone: "+44 7700 900003",
      documents: ["Birth Certificate", "School Reports", "Medical Records"],
      notes: "Excellent interview performance"
    },
    {
      id: "APP2024004",
      student: "James Wilson",
      year: "Year 7",
      stage: "Enrolled",
      progress: 100,
      status: "Enrolled",
      submitted: "5 Oct 2024",
      interview: "Completed",
      email: "james.wilson@email.com",
      phone: "+44 7700 900004",
      documents: ["All documents verified"],
      notes: "Enrollment completed successfully"
    }
  ]);

  const stats = [
    { label: "Total Applications", value: "342", icon: FileText, color: "text-primary" },
    { label: "Pending Review", value: "89", icon: Clock, color: "text-warning" },
    { label: "Interviews Scheduled", value: "45", icon: Calendar, color: "text-info" },
    { label: "Offers Made", value: "156", icon: CheckCircle, color: "text-success" }
  ];

  const stageColors = {
    "Application Received": "bg-blue-100 text-blue-800",
    "Documents Under Review": "bg-yellow-100 text-yellow-800",
    "Interview Scheduled": "bg-purple-100 text-purple-800",
    "Assessment Complete": "bg-indigo-100 text-indigo-800",
    "Offer Sent": "bg-green-100 text-green-800",
    "Enrolled": "bg-emerald-100 text-emerald-800"
  };

  // Filter applications based on search and stage
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === "all" || app.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  // Handler functions
  const handleViewApplication = (app: any) => {
    setSelectedApplication(app);
    toast({
      title: "Application Viewed",
      description: `Viewing application for ${app.student}`,
    });
  };

  const handleEditApplication = (app: any) => {
    toast({
      title: "Edit Application",
      description: `Opening edit form for ${app.student}`,
    });
  };

  const handleScheduleInterview = (student: string) => {
    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled for ${student}`,
    });
  };

  const handleSendOffer = (student: string) => {
    toast({
      title: "Offer Sent",
      description: `Offer letter sent to ${student}`,
    });
  };

  const handleEnrollStudent = () => {
    if (!enrollmentData.studentId || !enrollmentData.parentName || !enrollmentData.parentEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Update application status to enrolled
    setApplications(prev => prev.map(app => 
      app.id === enrollmentData.studentId 
        ? { ...app, stage: "Enrolled", progress: 100, status: "Enrolled" }
        : app
    ));

    toast({
      title: "Student Enrolled Successfully",
      description: `Student has been enrolled and added to the school system`,
    });

    // Reset form
    setEnrollmentData({
      studentId: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalInfo: "",
      previousSchool: "",
      startDate: ""
    });
  };

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated and downloaded`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admissions & Applications</h1>
        <p className="text-muted-foreground">End-to-end digital admissions with e-signatures and document management</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="enrollment">Student Enrollment</TabsTrigger>
          <TabsTrigger value="portal">Application Portal</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers & Enrollment</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Current Applications</CardTitle>
                  <CardDescription>Track and manage all incoming applications</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleGenerateReport("Applications")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name or application ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Application Received">Application Received</SelectItem>
                    <SelectItem value="Documents Under Review">Documents Under Review</SelectItem>
                    <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="Assessment Complete">Assessment Complete</SelectItem>
                    <SelectItem value="Offer Sent">Offer Sent</SelectItem>
                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id} className="border-border/50 hover:border-primary/20 transition-[var(--transition-smooth)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{app.student}</h3>
                          <p className="text-sm text-muted-foreground">{app.id} • Applying for {app.year}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={stageColors[app.stage as keyof typeof stageColors] || ""}
                        >
                          {app.stage}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Application Progress</span>
                            <span>{app.progress}%</span>
                          </div>
                          <Progress value={app.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <p className="font-medium">{app.submitted}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Interview:</span>
                            <p className="font-medium">{app.interview}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p className="font-medium">{app.status}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewApplication(app)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditApplication(app)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Student Enrollment Process</span>
              </CardTitle>
              <CardDescription>Complete the enrollment process for accepted students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrollment Form */}
                <div className="space-y-6">
                  <h4 className="font-medium text-lg">Enrollment Form</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="studentId">Select Application</Label>
                      <Select value={enrollmentData.studentId} onValueChange={(value) => 
                        setEnrollmentData(prev => ({ ...prev, studentId: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose student application" />
                        </SelectTrigger>
                        <SelectContent>
                          {applications.filter(app => app.stage === "Offer Sent").map(app => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.student} - {app.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                        <Input
                          id="parentName"
                          value={enrollmentData.parentName}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, parentName: e.target.value }))}
                          placeholder="Enter parent name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parentEmail">Parent Email *</Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          value={enrollmentData.parentEmail}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, parentEmail: e.target.value }))}
                          placeholder="parent@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentPhone">Parent Phone</Label>
                        <Input
                          id="parentPhone"
                          value={enrollmentData.parentPhone}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, parentPhone: e.target.value }))}
                          placeholder="+44 7700 900000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={enrollmentData.startDate}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          value={enrollmentData.emergencyContact}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          placeholder="Emergency contact name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={enrollmentData.emergencyPhone}
                          onChange={(e) => setEnrollmentData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                          placeholder="+44 7700 900000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="previousSchool">Previous School</Label>
                      <Input
                        id="previousSchool"
                        value={enrollmentData.previousSchool}
                        onChange={(e) => setEnrollmentData(prev => ({ ...prev, previousSchool: e.target.value }))}
                        placeholder="Name of previous school"
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicalInfo">Medical Information</Label>
                      <Textarea
                        id="medicalInfo"
                        value={enrollmentData.medicalInfo}
                        onChange={(e) => setEnrollmentData(prev => ({ ...prev, medicalInfo: e.target.value }))}
                        placeholder="Any medical conditions or special requirements"
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleEnrollStudent}
                      className="w-full"
                      size="lg"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Complete Enrollment
                    </Button>
                  </div>
                </div>

                {/* Enrollment Checklist */}
                <div className="space-y-6">
                  <h4 className="font-medium text-lg">Enrollment Checklist</h4>
                  <div className="space-y-4">
                    {[
                      "Offer letter accepted",
                      "Enrollment deposit paid",
                      "All required documents verified",
                      "Parent/guardian information collected",
                      "Emergency contacts provided",
                      "Medical information recorded",
                      "Previous school records transferred",
                      "School uniform ordered",
                      "Transport arrangements confirmed",
                      "Student ID card created"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Recent Enrollments</h5>
                    <div className="space-y-2">
                      {applications.filter(app => app.stage === "Enrolled").map(app => (
                        <div key={app.id} className="flex items-center justify-between text-sm">
                          <span className="text-blue-800">{app.student}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Enrolled
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Online Application Portal</span>
              </CardTitle>
              <CardDescription>Parent-facing application system with document upload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Portal Features</h4>
                  <div className="space-y-3">
                    {[
                      "Online application form",
                      "Document upload system",
                      "Application progress tracking",
                      "Email notifications",
                      "Mobile-responsive design",
                      "Multi-language support"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Required Documents</h4>
                  <div className="space-y-2">
                    {[
                      "Birth Certificate",
                      "Previous School Reports",
                      "Passport/ID Document",
                      "Medical Records",
                      "Parent/Guardian ID",
                      "Proof of Address"
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{doc}</span>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Interview & Assessment Scheduling</span>
              </CardTitle>
              <CardDescription>Manage interview slots and assessment sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">45</h4>
                      <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">23</h4>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">89</h4>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Upcoming Interviews</h4>
                  <div className="space-y-3">
                    {[
                      { student: "Emma Thompson", date: "22 Oct 2024", time: "10:00 AM", interviewer: "Dr. Smith" },
                      { student: "James Wilson", date: "22 Oct 2024", time: "11:30 AM", interviewer: "Ms. Johnson" },
                      { student: "Sophie Chen", date: "23 Oct 2024", time: "2:00 PM", interviewer: "Mr. Brown" }
                    ].map((interview, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{interview.student}</p>
                          <p className="text-sm text-muted-foreground">
                            {interview.date} at {interview.time} with {interview.interviewer}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleScheduleInterview(interview.student)}
                          >
                            Reschedule
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleViewApplication({ student: interview.student })}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Offers & Enrollment</span>
              </CardTitle>
              <CardDescription>Manage offer letters and track enrollment confirmations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">156</h4>
                      <p className="text-sm text-muted-foreground">Offers Made</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">89</h4>
                      <p className="text-sm text-muted-foreground">Accepted</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">23</h4>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">44</h4>
                      <p className="text-sm text-muted-foreground">Declined</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Recent Offers</h4>
                  <div className="space-y-3">
                    {[
                      { student: "Aisha Patel", year: "Year 12", status: "Sent", date: "20 Oct 2024", deposit: "Pending" },
                      { student: "Michael Zhang", year: "Year 9", status: "Accepted", date: "18 Oct 2024", deposit: "Paid" },
                      { student: "Lucy Williams", year: "Year 7", status: "Declined", date: "16 Oct 2024", deposit: "N/A" }
                    ].map((offer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{offer.student}</p>
                          <p className="text-sm text-muted-foreground">
                            {offer.year} • Offer {offer.status} on {offer.date}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">Deposit: {offer.deposit}</p>
                          </div>
                          <Badge 
                            variant={offer.status === "Accepted" ? "default" : 
                                   offer.status === "Declined" ? "destructive" : "secondary"}
                          >
                            {offer.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSendOffer(offer.student)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Offer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Waitlist Management</span>
              </CardTitle>
              <CardDescription>Manage waiting lists and priority placement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">67</h4>
                      <p className="text-sm text-muted-foreground">On Waitlist</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">12</h4>
                      <p className="text-sm text-muted-foreground">Priority</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">8</h4>
                      <p className="text-sm text-muted-foreground">Moved to Offers</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Waitlist by Year Group</h4>
                  <div className="space-y-3">
                    {[
                      { year: "Year 7", count: 23, priority: 4 },
                      { year: "Year 8", count: 15, priority: 2 },
                      { year: "Year 9", count: 18, priority: 3 },
                      { year: "Year 10", count: 8, priority: 2 },
                      { year: "Year 11", count: 3, priority: 1 }
                    ].map((group, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{group.year}</p>
                          <p className="text-sm text-muted-foreground">
                            {group.count} students waiting, {group.priority} priority
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View List
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
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
              <DialogTitle>Application Details - {selectedApplication.student}</DialogTitle>
              <DialogDescription>
                Application ID: {selectedApplication.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedApplication.student}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Year Group</Label>
                  <p className="text-sm text-muted-foreground">{selectedApplication.year}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">{selectedApplication.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Stage</Label>
                  <Badge className={stageColors[selectedApplication.stage as keyof typeof stageColors]}>
                    {selectedApplication.stage}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedApplication.progress} className="flex-1" />
                    <span className="text-sm">{selectedApplication.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Documents Submitted</Label>
                <div className="mt-2 space-y-1">
                  {selectedApplication.documents?.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedApplication.notes}</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </Button>
                <Button onClick={() => handleEditApplication(selectedApplication)}>
                  Edit Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdmissionsPage;