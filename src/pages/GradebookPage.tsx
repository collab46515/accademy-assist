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
  FileText, 
  Search, 
  Download,
  TrendingUp,
  TrendingDown,
  Target,
  Bot,
  Star
} from "lucide-react";

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  assessment: string;
  score: number;
  maxScore: number;
  grade: string;
  term: string;
  effort: "excellent" | "good" | "satisfactory" | "needs improvement";
  comments?: string;
}

interface Report {
  id: string;
  studentId: string;
  studentName: string;
  term: string;
  year: string;
  averageGrade: string;
  subjects: number;
  status: "draft" | "completed" | "sent";
  generatedAt: string;
}

const mockGrades: Grade[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Emma Thompson",
    subject: "Mathematics",
    assessment: "Algebra Test",
    score: 85,
    maxScore: 100,
    grade: "A-",
    term: "Autumn",
    effort: "excellent",
    comments: "Excellent understanding of algebraic concepts"
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "James Wilson",
    subject: "English Literature",
    assessment: "Essay Analysis",
    score: 78,
    maxScore: 100,
    grade: "B+",
    term: "Autumn",
    effort: "good",
    comments: "Good analytical skills, needs to work on structure"
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Sophie Chen",
    subject: "Physics",
    assessment: "Lab Report",
    score: 92,
    maxScore: 100,
    grade: "A*",
    term: "Autumn",
    effort: "excellent",
    comments: "Outstanding practical work and scientific reasoning"
  }
];

const mockReports: Report[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Emma Thompson",
    term: "Autumn Term",
    year: "Year 7",
    averageGrade: "A-",
    subjects: 8,
    status: "completed",
    generatedAt: "2024-01-15"
  },
  {
    id: "2",
    studentId: "STU002", 
    studentName: "James Wilson",
    term: "Autumn Term",
    year: "Year 8",
    averageGrade: "B+",
    subjects: 9,
    status: "sent",
    generatedAt: "2024-01-14"
  }
];

const GradebookPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [grades] = useState(mockGrades);
  const [reports] = useState(mockReports);

  const getEffortBadge = (effort: Grade["effort"]) => {
    switch (effort) {
      case "excellent":
        return <Badge className="bg-success text-success-foreground"><Star className="h-3 w-3 mr-1" />Excellent</Badge>;
      case "good":
        return <Badge className="bg-primary text-primary-foreground">Good</Badge>;
      case "satisfactory":
        return <Badge variant="secondary">Satisfactory</Badge>;
      case "needs improvement":
        return <Badge variant="destructive">Needs Improvement</Badge>;
    }
  };

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "sent":
        return <Badge variant="outline">Sent</Badge>;
    }
  };

  const filteredGrades = grades.filter(grade =>
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.assessment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGrades = grades.length;
  const averageScore = Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length);
  const excellentEffort = grades.filter(g => g.effort === "excellent").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Gradebook & Reporting</h1>
        <p className="text-muted-foreground">Termly reports with UK-style comments, AI-assisted generation, and parent portal access</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Grades</p>
                <p className="text-3xl font-bold text-primary">{totalGrades}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-success">{averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Excellent Effort</p>
                <p className="text-3xl font-bold text-warning">{excellentEffort}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports Sent</p>
                <p className="text-3xl font-bold text-primary">{reports.filter(r => r.status === "sent").length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grades">Grade Management</TabsTrigger>
          <TabsTrigger value="reports">Term Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Student Grades</span>
                  </CardTitle>
                  <CardDescription>Manage individual assessment grades and feedback</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Comments
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students, subjects, or assessments..."
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
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Effort</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.studentName}</TableCell>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.assessment}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span>{grade.score}/{grade.maxScore}</span>
                            {grade.score >= 85 ? (
                              <TrendingUp className="h-4 w-4 text-success" />
                            ) : grade.score < 70 ? (
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold">
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{grade.term}</TableCell>
                        <TableCell>{getEffortBadge(grade.effort)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {grade.comments || "-"}
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

        <TabsContent value="reports">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Term Reports</span>
                  </CardTitle>
                  <CardDescription>Generate and manage termly student reports</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4 mr-2" />
                    Auto Generate
                  </Button>
                  <Button size="sm" className="shadow-[var(--shadow-elegant)]">
                    <FileText className="h-4 w-4 mr-2" />
                    New Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Year Group</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Average Grade</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.studentName}</TableCell>
                        <TableCell>{report.year}</TableCell>
                        <TableCell>{report.term}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold">
                            {report.averageGrade}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.subjects}</TableCell>
                        <TableCell>{report.generatedAt}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-1 justify-end">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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

export default GradebookPage;