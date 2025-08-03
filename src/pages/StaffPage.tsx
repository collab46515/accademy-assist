import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Users, 
  Search, 
  Plus,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Shield
} from "lucide-react";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employeeId: string;
  startDate: string;
  status: "active" | "on-leave" | "inactive";
  subjects?: string[];
  qualifications?: string[];
}

const mockStaff: Staff[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "s.johnson@school.edu",
    phone: "+44 20 7946 0958",
    role: "Head of Mathematics",
    department: "Mathematics",
    employeeId: "EMP001",
    startDate: "2020-09-01",
    status: "active",
    subjects: ["Mathematics", "Further Mathematics"],
    qualifications: ["BSc Mathematics", "PGCE", "MSc Applied Mathematics"]
  },
  {
    id: "2",
    firstName: "David",
    lastName: "Smith",
    email: "d.smith@school.edu",
    phone: "+44 20 7946 0959",
    role: "English Teacher",
    department: "English",
    employeeId: "EMP002",
    startDate: "2019-01-15",
    status: "active",
    subjects: ["English Literature", "English Language"],
    qualifications: ["BA English Literature", "PGCE"]
  },
  {
    id: "3",
    firstName: "Maria",
    lastName: "Garcia",
    email: "m.garcia@school.edu",
    phone: "+44 20 7946 0960",
    role: "Physics Teacher",
    department: "Science",
    employeeId: "EMP003",
    startDate: "2021-09-01",
    status: "on-leave",
    subjects: ["Physics", "Chemistry"],
    qualifications: ["PhD Physics", "PGCE Science"]
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Wilson",
    email: "j.wilson@school.edu",
    phone: "+44 20 7946 0961",
    role: "Assistant Head",
    department: "Leadership",
    employeeId: "EMP004",
    startDate: "2018-04-20",
    status: "active",
    qualifications: ["MA Education Management", "NPQH"]
  }
];

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staff] = useState(mockStaff);

  const getStatusBadge = (status: Staff["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "on-leave":
        return <Badge variant="secondary">On Leave</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  const filteredStaff = staff.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === "active").length;
  const onLeave = staff.filter(s => s.status === "on-leave").length;
  const departments = [...new Set(staff.map(s => s.department))].length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Teacher & Staff Management</h1>
        <p className="text-muted-foreground">HR for academic and non-academic staff with contracts, CPD tracking, and performance reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-3xl font-bold text-primary">{totalStaff}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{activeStaff}</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-3xl font-bold text-warning">{onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-3xl font-bold text-primary">{departments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="cpd">CPD Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Staff Directory</span>
                  </CardTitle>
                  <CardDescription>Manage academic and non-academic staff records</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff by name, email, department, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.firstName[0]}{member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              {member.subjects && (
                                <div className="text-sm text-muted-foreground">
                                  {member.subjects.join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{member.employeeId}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{member.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.startDate}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Performance Reviews</span>
              </CardTitle>
              <CardDescription>Track staff performance and development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Performance Management</h3>
                <p className="text-muted-foreground">Staff appraisals and performance tracking coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cpd">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>CPD Tracking</span>
              </CardTitle>
              <CardDescription>Monitor continuing professional development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">CPD Management</h3>
                <p className="text-muted-foreground">Professional development tracking and certification coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffPage;