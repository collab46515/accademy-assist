import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Search, 
  Plus, 
  Filter, 
  Download,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  GraduationCap,
  AlertTriangle
} from "lucide-react";

const StudentsPage = () => {
  const students = [
    {
      id: "STU20241001",
      name: "Emily Johnson",
      year: "Year 9",
      form: "9A",
      house: "Churchill",
      status: "Active",
      attendance: "96.5%",
      lastUpdate: "2 hours ago"
    },
    {
      id: "STU20241002",
      name: "James Wilson",
      year: "Year 11",
      form: "11B",
      house: "Darwin",
      status: "Active",
      attendance: "92.1%",
      lastUpdate: "1 day ago"
    },
    {
      id: "STU20241003",
      name: "Sophie Chen",
      year: "Year 7",
      form: "7C",
      house: "Newton",
      status: "Active",
      attendance: "98.2%",
      lastUpdate: "3 hours ago"
    }
  ];

  const stats = [
    { label: "Total Students", value: "2,847", icon: User, color: "text-primary" },
    { label: "Active Enrollments", value: "2,791", icon: GraduationCap, color: "text-success" },
    { label: "New This Term", value: "156", icon: Plus, color: "text-info" },
    { label: "Requiring Attention", value: "23", icon: AlertTriangle, color: "text-warning" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Information System</h1>
        <p className="text-muted-foreground">Central database for all student data, demographics, and enrollment information</p>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="families">Families</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Actions */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>Search and manage student records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search students by name, ID, or year group..." className="pl-10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="border-border/50 hover:border-primary/20 transition-[var(--transition-smooth)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs bg-muted px-2 py-1 rounded">{student.year}</span>
                              <span className="text-xs bg-muted px-2 py-1 rounded">{student.form}</span>
                              <span className="text-xs bg-muted px-2 py-1 rounded">{student.house}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">Attendance: {student.attendance}</p>
                            <p className="text-xs text-muted-foreground">Updated {student.lastUpdate}</p>
                          </div>
                          <Badge variant="outline" className="text-success border-success">
                            {student.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Demographics Overview</span>
              </CardTitle>
              <CardDescription>Student population statistics and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Year Group Distribution</h4>
                  <div className="space-y-2">
                    {["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"].map((year, index) => (
                      <div key={year} className="flex justify-between items-center">
                        <span className="text-sm">{year}</span>
                        <Badge variant="secondary">{380 + index * 20}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Nationality Breakdown</h4>
                  <div className="space-y-2">
                    {["British", "American", "Chinese", "Indian", "European", "Other"].map((nationality, index) => (
                      <div key={nationality} className="flex justify-between items-center">
                        <span className="text-sm">{nationality}</span>
                        <Badge variant="secondary">{[1420, 487, 324, 298, 267, 51][index]}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Special Requirements</h4>
                  <div className="space-y-2">
                    {["SEN Support", "EAL Students", "Pupil Premium", "Looked After", "Medical Needs"].map((category, index) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <Badge variant="secondary">{[234, 156, 89, 12, 67][index]}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Enrollment Management</span>
              </CardTitle>
              <CardDescription>Track student enrollment history and transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">2,791</h4>
                      <p className="text-sm text-muted-foreground">Currently Enrolled</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">156</h4>
                      <p className="text-sm text-muted-foreground">New This Academic Year</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-lg">89</h4>
                      <p className="text-sm text-muted-foreground">Transfers/Leavers</p>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Recent Enrollment Activity</h4>
                  <div className="space-y-3">
                    {[
                      { action: "New Enrollment", student: "Alex Thompson", date: "15 Oct 2024", year: "Year 9" },
                      { action: "Year Transition", student: "Sarah Williams", date: "12 Oct 2024", year: "Year 11" },
                      { action: "Transfer Out", student: "Michael Brown", date: "10 Oct 2024", year: "Year 8" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.student}</p>
                          <p className="text-sm text-muted-foreground">{activity.action} - {activity.year}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="families" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Family Connections</span>
              </CardTitle>
              <CardDescription>Manage sibling relationships and family contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Johnson Family</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Emily Johnson</span>
                          <Badge variant="secondary">Year 9</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Thomas Johnson</span>
                          <Badge variant="secondary">Year 7</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 pt-2 border-t">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">johnson.family@email.com</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Chen Family</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Sophie Chen</span>
                          <Badge variant="secondary">Year 7</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>David Chen</span>
                          <Badge variant="secondary">Year 12</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 pt-2 border-t">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">chen.family@email.com</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Student Reports</span>
              </CardTitle>
              <CardDescription>Generate comprehensive student data reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Student Directory", description: "Complete student listing with contact details" },
                  { name: "Enrollment Report", description: "Historical enrollment data and trends" },
                  { name: "Demographics Analysis", description: "Population statistics and breakdowns" },
                  { name: "Family Contacts", description: "Parent and guardian contact information" },
                  { name: "SEN Register", description: "Students with special educational needs" },
                  { name: "Year Group Summary", description: "Statistics by academic year group" }
                ].map((report, index) => (
                  <Card key={index} className="border-border/50 hover:border-primary/20 transition-[var(--transition-smooth)]">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{report.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentsPage;