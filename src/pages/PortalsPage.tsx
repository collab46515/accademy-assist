import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  User, 
  Smartphone,
  Eye,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell
} from "lucide-react";

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: "parent" | "student";
  lastLogin: string;
  status: "active" | "inactive" | "pending";
  children?: string[];
  yearGroup?: string;
}

interface PortalActivity {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  type: "view" | "download" | "message" | "payment";
}

const mockUsers: PortalUser[] = [
  {
    id: "1",
    name: "Mrs. Sarah Thompson",
    email: "s.thompson@parent.school.edu",
    role: "parent",
    lastLogin: "2024-01-15 09:30",
    status: "active",
    children: ["Emma Thompson (Year 7)", "Jack Thompson (Year 9)"]
  },
  {
    id: "2",
    name: "Emma Thompson",
    email: "e.thompson@student.school.edu",
    role: "student",
    lastLogin: "2024-01-15 14:20",
    status: "active",
    yearGroup: "Year 7"
  },
  {
    id: "3",
    name: "Mr. David Wilson",
    email: "d.wilson@parent.school.edu",
    role: "parent",
    lastLogin: "2024-01-14 19:45",
    status: "active",
    children: ["James Wilson (Year 8)"]
  },
  {
    id: "4",
    name: "Sophie Chen",
    email: "s.chen@student.school.edu",
    role: "student",
    lastLogin: "2024-01-13 16:15",
    status: "active",
    yearGroup: "Year 9"
  }
];

const mockActivity: PortalActivity[] = [
  {
    id: "1",
    user: "Mrs. Sarah Thompson",
    action: "Downloaded",
    resource: "Year 7 Progress Report",
    timestamp: "2024-01-15 09:35",
    type: "download"
  },
  {
    id: "2",
    user: "Emma Thompson", 
    action: "Viewed",
    resource: "Mathematics Assignment",
    timestamp: "2024-01-15 14:22",
    type: "view"
  },
  {
    id: "3",
    user: "Mr. David Wilson",
    action: "Made Payment",
    resource: "School Trip Fee",
    timestamp: "2024-01-14 19:50",
    type: "payment"
  },
  {
    id: "4",
    user: "Mrs. Sarah Thompson",
    action: "Sent Message",
    resource: "Mathematics Teacher",
    timestamp: "2024-01-14 15:30",
    type: "message"
  }
];

const PortalsPage = () => {
  const [users] = useState(mockUsers);
  const [activity] = useState(mockActivity);

  const getStatusBadge = (status: PortalUser["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getRoleBadge = (role: PortalUser["role"]) => {
    return (
      <Badge variant={role === "parent" ? "default" : "secondary"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getActivityIcon = (type: PortalActivity["type"]) => {
    switch (type) {
      case "view":
        return <Eye className="h-4 w-4 text-primary" />;
      case "download":
        return <FileText className="h-4 w-4 text-success" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-warning" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-500" />;
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const parentUsers = users.filter(u => u.role === "parent").length;
  const studentUsers = users.filter(u => u.role === "student").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Parent & Student Portals</h1>
        <p className="text-muted-foreground">Mobile-first engagement with real-time grades, attendance, assignments, and fee payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-primary">{totalUsers}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-success">{activeUsers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Parents</p>
                <p className="text-3xl font-bold text-warning">{parentUsers}</p>
              </div>
              <User className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-3xl font-bold text-primary">{studentUsers}</p>
              </div>
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Portal Users</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Portal Access Management</span>
                  </CardTitle>
                  <CardDescription>Manage parent and student portal accounts</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile Stats
                  </Button>
                  <Button size="sm" className="shadow-[var(--shadow-elegant)]">
                    <User className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {user.role === "parent" && user.children ? (
                            <div className="text-sm text-muted-foreground">
                              {user.children.join(", ")}
                            </div>
                          ) : user.role === "student" && user.yearGroup ? (
                            <Badge variant="outline">{user.yearGroup}</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Portal Activity</span>
              </CardTitle>
              <CardDescription>Monitor portal usage and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activity.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.user}</TableCell>
                        <TableCell>{item.action}</TableCell>
                        <TableCell>{item.resource}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActivityIcon(item.type)}
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Parent Portal Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-success" />
                  <span>View grades and reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Track attendance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-warning" />
                  <span>Message teachers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  <span>Make payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Book parent evenings</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span>Student Portal Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-success" />
                  <span>View assignments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Track progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-warning" />
                  <span>Check timetable</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <span>Submit homework</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span>Receive notifications</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalsPage;