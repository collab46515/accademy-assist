import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart3, 
  Search, 
  Plus,
  TrendingUp,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  subject: string;
  year: string;
  type: "test" | "assignment" | "exam" | "coursework";
  dueDate: string;
  maxScore: number;
  avgScore: number;
  completed: number;
  total: number;
  status: "draft" | "active" | "completed" | "overdue";
}

const mockAssessments: Assessment[] = [
  {
    id: "1",
    title: "Algebra Fundamentals Test",
    subject: "Mathematics",
    year: "Year 7",
    type: "test",
    dueDate: "2024-01-20",
    maxScore: 100,
    avgScore: 78,
    completed: 25,
    total: 28,
    status: "active"
  },
  {
    id: "2",
    title: "Shakespeare Essay",
    subject: "English Literature", 
    year: "Year 10",
    type: "assignment",
    dueDate: "2024-01-25",
    maxScore: 50,
    avgScore: 42,
    completed: 22,
    total: 24,
    status: "active"
  },
  {
    id: "3",
    title: "Physics Practical Exam",
    subject: "Physics",
    year: "Year 11",
    type: "exam",
    dueDate: "2024-01-18",
    maxScore: 80,
    avgScore: 65,
    completed: 20,
    total: 22,
    status: "overdue"
  }
];

const AssessmentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assessments] = useState(mockAssessments);

  const getStatusBadge = (status: Assessment["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
    }
  };

  const getTypeBadge = (type: Assessment["type"]) => {
    const variants = {
      test: "default",
      assignment: "secondary", 
      exam: "outline",
      coursework: "secondary"
    } as const;
    
    return <Badge variant={variants[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.year.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(a => a.status === "active").length;
  const overdueAssessments = assessments.filter(a => a.status === "overdue").length;
  const avgCompletionRate = Math.round(
    assessments.reduce((sum, a) => sum + (a.completed / a.total), 0) / assessments.length * 100
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Academic Tracking & Assessment</h1>
        <p className="text-muted-foreground">Manage ENC standards and assessment levels with curriculum mapping and progress tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-3xl font-bold text-primary">{totalAssessments}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{activeAssessments}</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-primary">{avgCompletionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-destructive">{overdueAssessments}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Assessment Management</span>
              </CardTitle>
              <CardDescription>Track academic assessments and student progress</CardDescription>
            </div>
            <Button className="shadow-[var(--shadow-elegant)]">
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments, subjects, or year groups..."
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
                  <TableHead>Assessment Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Year Group</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.title}</TableCell>
                    <TableCell>{assessment.subject}</TableCell>
                    <TableCell>{assessment.year}</TableCell>
                    <TableCell>{getTypeBadge(assessment.type)}</TableCell>
                    <TableCell>{assessment.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(assessment.completed / assessment.total) * 100} 
                          className="w-16"
                        />
                        <span className="text-sm text-muted-foreground">
                          {assessment.completed}/{assessment.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-warning" />
                        <span>{assessment.avgScore}/{assessment.maxScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(assessment.status)}</TableCell>
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
    </div>
  );
};

export default AssessmentPage;