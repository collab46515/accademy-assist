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
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  examBoard: string;
  subject: string;
  level: string;
  date: string;
  time: string;
  duration: number;
  venue: string;
  candidates: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

interface Result {
  id: string;
  studentId: string;
  studentName: string;
  exam: string;
  grade: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  rank: number;
  boardResult: string;
}

const mockExams: Exam[] = [
  {
    id: "1",
    title: "GCSE Mathematics Paper 1",
    examBoard: "Edexcel",
    subject: "Mathematics",
    level: "GCSE",
    date: "2024-05-15",
    time: "09:00",
    duration: 90,
    venue: "Main Hall",
    candidates: 45,
    status: "scheduled"
  },
  {
    id: "2",
    title: "A-Level Physics Paper 2",
    examBoard: "AQA",
    subject: "Physics",
    level: "A-Level",
    date: "2024-05-20",
    time: "14:00",
    duration: 120,
    venue: "Science Block",
    candidates: 22,
    status: "scheduled"
  },
  {
    id: "3",
    title: "GCSE English Literature",
    examBoard: "OCR",
    subject: "English Literature",
    level: "GCSE",
    date: "2024-05-10",
    time: "09:00",
    duration: 105,
    venue: "Exam Hall A",
    candidates: 38,
    status: "completed"
  }
];

const mockResults: Result[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Emma Thompson",
    exam: "GCSE English Literature",
    grade: "A*",
    marks: 95,
    maxMarks: 100,
    percentage: 95,
    rank: 1,
    boardResult: "A*"
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "James Wilson",
    exam: "GCSE English Literature",
    grade: "A",
    marks: 88,
    maxMarks: 100,
    percentage: 88,
    rank: 3,
    boardResult: "A"
  }
];

const ExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [exams] = useState(mockExams);
  const [results] = useState(mockResults);

  const getStatusBadge = (status: Exam["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-primary text-primary-foreground"><Calendar className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "in-progress":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Cancelled</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "GCSE": "bg-blue-500 text-white",
      "A-Level": "bg-purple-500 text-white", 
      "AS-Level": "bg-green-500 text-white"
    };
    
    return <Badge className={colors[level as keyof typeof colors] || "bg-gray-500 text-white"}>{level}</Badge>;
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examBoard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExams = exams.length;
  const scheduledExams = exams.filter(e => e.status === "scheduled").length;
  const completedExams = exams.filter(e => e.status === "completed").length;
  const totalCandidates = exams.reduce((sum, exam) => sum + exam.candidates, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Exams & Qualifications</h1>
        <p className="text-muted-foreground">Full exam board lifecycle with entry management, access arrangements, and results tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-3xl font-bold text-primary">{totalExams}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold text-warning">{scheduledExams}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success">{completedExams}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Candidates</p>
                <p className="text-3xl font-bold text-primary">{totalCandidates}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="exams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="boards">Exam Boards</TabsTrigger>
        </TabsList>

        <TabsContent value="exams">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Exam Management</span>
                  </CardTitle>
                  <CardDescription>Schedule and manage examinations</CardDescription>
                </div>
                <Button className="shadow-[var(--shadow-elegant)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Exam
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams, subjects, or exam boards..."
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
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Board</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Candidates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.examBoard}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{getLevelBadge(exam.level)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{exam.date}</div>
                            <div className="text-sm text-muted-foreground">{exam.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{exam.duration} mins</TableCell>
                        <TableCell>{exam.venue}</TableCell>
                        <TableCell>{exam.candidates}</TableCell>
                        <TableCell>{getStatusBadge(exam.status)}</TableCell>
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

        <TabsContent value="results">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Exam Results</span>
                  </CardTitle>
                  <CardDescription>View and manage examination results</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Import Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Board Result</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.studentName}</TableCell>
                        <TableCell>{result.exam}</TableCell>
                        <TableCell>{result.marks}/{result.maxMarks}</TableCell>
                        <TableCell>{result.percentage}%</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold">
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success text-success-foreground">
                            {result.boardResult}
                          </Badge>
                        </TableCell>
                        <TableCell>#{result.rank}</TableCell>
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

        <TabsContent value="boards">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Exam Boards</span>
              </CardTitle>
              <CardDescription>Manage exam board partnerships and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Exam Board Management</h3>
                <p className="text-muted-foreground">Partnership details and board-specific requirements coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamsPage;