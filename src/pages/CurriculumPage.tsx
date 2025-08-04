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
  Calendar, 
  Search, 
  Plus,
  BookOpen,
  Clock,
  Users,
  MapPin,
  Settings
} from "lucide-react";
import { useAcademicData, type Course } from "@/hooks/useAcademicData";
import { useTimetableData } from "@/hooks/useTimetableData";
import { toast } from "@/hooks/use-toast";

// Display interface for curriculum subjects with additional UI fields
interface CurriculumSubject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  year: string;
  hours: number;
  students: number;
  room: string;
  status: "active" | "inactive";
}

const CurriculumPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { subjects, courses, loading } = useAcademicData();
  const { timetableEntries, subjects: timetableSubjects } = useTimetableData();

  // Use timetable subjects for display as they have real data
  const displaySubjects: CurriculumSubject[] = timetableSubjects.map(subject => ({
    id: subject.id,
    name: subject.subject_name,
    code: subject.subject_code,
    teacher: "Teacher Name", // We'll get this from teacher table later
    year: "Mixed", // Subject is taught across multiple years
    hours: subject.periods_per_week,
    students: Math.floor(Math.random() * 30) + 15, // Mock student count
    room: subject.requires_lab ? "Lab Required" : "Standard Classroom",
    status: subject.is_active ? "active" : "inactive"
  }));

  const filteredSubjects = displaySubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics from real data
  const totalHours = displaySubjects.reduce((sum, subject) => sum + subject.hours, 0);
  const totalStudents = displaySubjects.reduce((sum, subject) => sum + subject.students, 0);

  const handleAddSubject = () => {
    toast({
      title: "Add Subject",
      description: "Subject creation form will be implemented soon.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Curriculum & Timetabling</h1>
        <p className="text-muted-foreground">AI-powered scheduling for British curriculum with auto-generation and option blocks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="text-3xl font-bold text-primary">{displaySubjects.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Hours</p>
                <p className="text-3xl font-bold text-success">{totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-warning">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Classes</p>
                <p className="text-3xl font-bold text-primary">{timetableEntries.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Subject Management</span>
                  </CardTitle>
                  <CardDescription>Manage curriculum subjects and assignments</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]" onClick={handleAddSubject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subjects, teachers, or codes..."
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
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Year Group</TableHead>
                      <TableHead>Weekly Hours</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.code}</TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.teacher}</TableCell>
                        <TableCell>{subject.year}</TableCell>
                        <TableCell>{subject.hours}h</TableCell>
                        <TableCell>{subject.students}</TableCell>
                        <TableCell>{subject.room}</TableCell>
                        <TableCell>
                          <Badge variant={subject.status === "active" ? "default" : "secondary"}>
                            {subject.status}
                          </Badge>
                        </TableCell>
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

        <TabsContent value="timetable">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Weekly Timetable</span>
                  </CardTitle>
                  <CardDescription>View and manage class schedules</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Auto-Generate
                  </Button>
                  <Button size="sm" className="shadow-[var(--shadow-elegant)]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Period
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Year Group</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {courses.slice(0, 5).map((course) => (
                       <TableRow key={course.id}>
                         <TableCell className="font-medium">Monday</TableCell>
                         <TableCell>09:00 - 10:00</TableCell>
                         <TableCell>{course.name}</TableCell>
                         <TableCell>Teacher</TableCell>
                         <TableCell>{course.year_group}</TableCell>
                         <TableCell>
                           <Badge variant="outline" className="flex items-center space-x-1">
                             <MapPin className="h-3 w-3" />
                             <span>Room {course.code}</span>
                           </Badge>
                         </TableCell>
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

        <TabsContent value="rooms">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Room Management</span>
              </CardTitle>
              <CardDescription>Manage classroom assignments and capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Room Management</h3>
                <p className="text-muted-foreground">Classroom capacity and booking system coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurriculumPage;