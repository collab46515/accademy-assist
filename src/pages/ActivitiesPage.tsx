import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Trophy, 
  Search, 
  Plus,
  Users,
  Calendar,
  Award,
  MapPin,
  Clock,
  Star,
  CheckCircle
} from "lucide-react";

interface Activity {
  id: string;
  name: string;
  category: "sports" | "arts" | "academic" | "service" | "duke-of-edinburgh";
  instructor: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: "active" | "full" | "cancelled" | "completed";
  cost?: number;
}

interface Participation {
  id: string;
  studentId: string;
  studentName: string;
  activity: string;
  category: string;
  enrolledDate: string;
  status: "active" | "completed" | "withdrawn";
  attendance: number;
  achievements?: string[];
}

interface HousePoint {
  id: string;
  studentId: string;
  studentName: string;
  house: string;
  points: number;
  reason: string;
  awardedBy: string;
  date: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    name: "Football Club",
    category: "sports",
    instructor: "Mr. Johnson",
    schedule: "Wednesday 15:30-16:30",
    location: "Sports Field",
    capacity: 25,
    enrolled: 22,
    status: "active"
  },
  {
    id: "2",
    name: "Drama Society",
    category: "arts",
    instructor: "Ms. Williams",
    schedule: "Thursday 16:00-17:30",
    location: "Drama Studio",
    capacity: 20,
    enrolled: 18,
    status: "active"
  },
  {
    id: "3",
    name: "Duke of Edinburgh Bronze",
    category: "duke-of-edinburgh",
    instructor: "Mrs. Davis",
    schedule: "Saturday 09:00-15:00",
    location: "Various",
    capacity: 15,
    enrolled: 15,
    status: "full",
    cost: 150
  },
  {
    id: "4",
    name: "Chess Club",
    category: "academic",
    instructor: "Mr. Smith",
    schedule: "Tuesday 12:30-13:30",
    location: "Library",
    capacity: 16,
    enrolled: 12,
    status: "active"
  }
];

const mockParticipation: Participation[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Emma Thompson",
    activity: "Drama Society",
    category: "arts",
    enrolledDate: "2024-01-08",
    status: "active",
    attendance: 95,
    achievements: ["Lead Role - Romeo & Juliet"]
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "James Wilson",
    activity: "Football Club",
    category: "sports",
    enrolledDate: "2024-01-05",
    status: "active",
    attendance: 88
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Sophie Chen",
    activity: "Duke of Edinburgh Bronze",
    category: "duke-of-edinburgh",
    enrolledDate: "2024-01-10",
    status: "active",
    attendance: 100,
    achievements: ["Expedition Complete", "Volunteering 20hrs"]
  }
];

const mockHousePoints: HousePoint[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Emma Thompson",
    house: "Gryffindor",
    points: 10,
    reason: "Outstanding drama performance",
    awardedBy: "Ms. Williams",
    date: "2024-01-15"
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "James Wilson",
    house: "Hufflepuff",
    points: 5,
    reason: "Team spirit in football",
    awardedBy: "Mr. Johnson",
    date: "2024-01-14"
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Sophie Chen",
    house: "Ravenclaw",
    points: 15,
    reason: "DofE expedition leadership",
    awardedBy: "Mrs. Davis",
    date: "2024-01-13"
  }
];

const ActivitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activities] = useState(mockActivities);
  const [participation] = useState(mockParticipation);
  const [housePoints] = useState(mockHousePoints);

  const getStatusBadge = (status: Activity["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "full":
        return <Badge className="bg-warning text-warning-foreground">Full</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
    }
  };

  const getCategoryBadge = (category: Activity["category"]) => {
    const colors = {
      sports: "bg-blue-500 text-white",
      arts: "bg-purple-500 text-white",
      academic: "bg-green-500 text-white",
      service: "bg-orange-500 text-white",
      "duke-of-edinburgh": "bg-red-500 text-white"
    };
    
    return <Badge className={colors[category]}>{category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</Badge>;
  };

  const getHouseBadge = (house: string) => {
    const colors = {
      "Gryffindor": "bg-red-600 text-white",
      "Hufflepuff": "bg-yellow-600 text-white",
      "Ravenclaw": "bg-blue-600 text-white",
      "Slytherin": "bg-green-600 text-white"
    };
    
    return <Badge className={colors[house as keyof typeof colors] || "bg-gray-500 text-white"}>{house}</Badge>;
  };

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivities = activities.length;
  const activeActivities = activities.filter(a => a.status === "active").length;
  const totalParticipants = activities.reduce((sum, activity) => sum + activity.enrolled, 0);
  const totalHousePoints = housePoints.reduce((sum, hp) => sum + hp.points, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Extracurricular Activities</h1>
        <p className="text-muted-foreground">Track co-curricular engagement, DofE, house points, and trip participation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-3xl font-bold text-primary">{totalActivities}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{activeActivities}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-3xl font-bold text-primary">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">House Points</p>
                <p className="text-3xl font-bold text-warning">{totalHousePoints}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="house-points">House Points</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Activity Management</span>
                  </CardTitle>
                  <CardDescription>Manage extracurricular activities and clubs</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities by name, instructor, or category..."
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
                      <TableHead>Activity Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell>{getCategoryBadge(activity.category)}</TableCell>
                        <TableCell>{activity.instructor}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{activity.schedule}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{activity.enrolled}/{activity.capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(activity.status)}</TableCell>
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

        <TabsContent value="participation">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Student Participation</span>
              </CardTitle>
              <CardDescription>Track individual student involvement in activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Achievements</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participation.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.activity}</TableCell>
                        <TableCell>{getCategoryBadge(record.category as Activity["category"])}</TableCell>
                        <TableCell>{record.enrolledDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm">{record.attendance}%</div>
                            {record.attendance >= 90 && <CheckCircle className="h-4 w-4 text-success" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={record.status === "active" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.achievements && record.achievements.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {record.achievements.map((achievement, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Award className="h-3 w-3 mr-1" />
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
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

        <TabsContent value="house-points">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>House Points System</span>
                  </CardTitle>
                  <CardDescription>Award and track house points for student achievements</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Award Points
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>House</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Awarded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {housePoints.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.studentName}</TableCell>
                        <TableCell>{getHouseBadge(point.house)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-warning" />
                            <span className="font-bold">{point.points}</span>
                          </div>
                        </TableCell>
                        <TableCell>{point.reason}</TableCell>
                        <TableCell>{point.awardedBy}</TableCell>
                        <TableCell>{point.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivitiesPage;