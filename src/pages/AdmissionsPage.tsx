import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Download
} from "lucide-react";

const AdmissionsPage = () => {
  const applications = [
    {
      id: "APP2024001",
      student: "Emma Thompson",
      year: "Year 7",
      stage: "Interview Scheduled",
      progress: 60,
      status: "In Progress",
      submitted: "15 Oct 2024",
      interview: "22 Oct 2024"
    },
    {
      id: "APP2024002", 
      student: "Marcus Rodriguez",
      year: "Year 9",
      stage: "Documents Under Review",
      progress: 40,
      status: "Pending",
      submitted: "12 Oct 2024",
      interview: "TBD"
    },
    {
      id: "APP2024003",
      student: "Aisha Patel",
      year: "Year 12",
      stage: "Offer Sent",
      progress: 90,
      status: "Awaiting Response",
      submitted: "8 Oct 2024",
      interview: "Completed"
    }
  ];

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="portal">Application Portal</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers & Enrollment</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Current Applications</CardTitle>
              <CardDescription>Track and manage all incoming applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
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
                            <Button variant="outline" size="sm">
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
                ))}
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
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button size="sm">View Details</Button>
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
                          <Button variant="outline" size="sm">
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
    </div>
  );
};

export default AdmissionsPage;