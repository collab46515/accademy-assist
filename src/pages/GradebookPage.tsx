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
  Star,
  Plus,
  Edit,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGradingData, type Grade } from "@/hooks/useGradingData";
import { useStudentData } from "@/hooks/useStudentData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Remove duplicate interfaces - using ones from the hook

// Remove mock data - using data from the hook

const GradebookPage = () => {
  const { toast } = useToast();
  const { students } = useStudentData();
  const { 
    loading, 
    grades, 
    gradingRubrics, 
    gradeBoundaries, 
    reports,
    createGrade,
    updateGrade,
    calculateGrade,
    generateAnalytics
  } = useGradingData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isAICommentDialogOpen, setIsAICommentDialogOpen] = useState(false);
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);
  const [generatedComment, setGeneratedComment] = useState("");

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case "excellent":
        return <Badge className="bg-success text-success-foreground"><Star className="h-3 w-3 mr-1" />Excellent</Badge>;
      case "good":
        return <Badge className="bg-primary text-primary-foreground">Good</Badge>;
      case "satisfactory":
        return <Badge variant="secondary">Satisfactory</Badge>;
      case "needs improvement":
        return <Badge variant="destructive">Needs Improvement</Badge>;
      default:
        return <Badge variant="outline">Not Set</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "completed":
      case "generated":
        return <Badge className="bg-success text-success-foreground">Generated</Badge>;
      case "sent":
        return <Badge variant="outline">Sent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);

  const handleStatCardClick = (cardType: string) => {
    setSelectedStatCard(cardType);
  };

  const getStatCardDetails = (cardType: string) => {
    switch (cardType) {
      case "Total Grades":
        const subjectBreakdown = grades.reduce((acc, grade) => {
          acc[grade.subject] = (acc[grade.subject] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return {
          title: "Grades by Subject",
          data: Object.entries(subjectBreakdown).map(([subject, count]) => ({
            label: subject,
            value: count,
            percentage: Math.round((count / totalGrades) * 100)
          }))
        };
      
      case "Average Score":
        const gradeDistribution = grades.reduce((acc, grade) => {
          const range = grade.score >= 90 ? "90-100%" : 
                       grade.score >= 80 ? "80-89%" :
                       grade.score >= 70 ? "70-79%" :
                       grade.score >= 60 ? "60-69%" : "Below 60%";
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return {
          title: "Score Distribution",
          data: Object.entries(gradeDistribution).map(([range, count]) => ({
            label: range,
            value: count,
            percentage: Math.round((count / totalGrades) * 100)
          }))
        };
        
      case "Excellent Effort":
        const effortBreakdown = grades.reduce((acc, grade) => {
          acc[grade.effort] = (acc[grade.effort] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return {
          title: "Effort Distribution",
          data: Object.entries(effortBreakdown).map(([effort, count]) => ({
            label: effort.charAt(0).toUpperCase() + effort.slice(1),
            value: count,
            percentage: Math.round((count / totalGrades) * 100)
          }))
        };
        
      case "Reports Sent":
        const reportStatus = reports.reduce((acc, report) => {
          acc[report.status] = (acc[report.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return {
          title: "Report Status",
          data: Object.entries(reportStatus).map(([status, count]) => ({
            label: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            percentage: Math.round((count / reports.length) * 100)
          }))
        };
        
      default:
        return { title: "", data: [] };
    }
  };

  const handleExportGrades = () => {
    toast({
      title: "Export Started",
      description: "Exporting grades to CSV format...",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Grades have been exported successfully.",
      });
    }, 2000);
  };

  const generateAIComment = async (grade: Grade) => {
    setIsGeneratingComment(true);
    setGeneratedComment("");
    
    // Simulate AI comment generation
    setTimeout(() => {
      const comments = [
        `${grade.student_name} demonstrates excellent understanding in ${grade.subject}. The ${grade.score}% score on ${grade.assessment_name} reflects consistent effort and strong grasp of concepts. Continue encouraging analytical thinking and problem-solving skills.`,
        `Strong performance by ${grade.student_name} in ${grade.subject}. The ${grade.grade} grade on ${grade.assessment_name} shows good progress. Focus on developing deeper understanding and application of key concepts.`,
        `${grade.student_name} shows promising potential in ${grade.subject}. With continued effort and focus on fundamental concepts, there is excellent scope for improvement. The current ${grade.effort} effort level is commendable.`
      ];
      
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      setGeneratedComment(randomComment);
      setIsGeneratingComment(false);
    }, 3000);
  };

  const filteredGrades = grades.filter(grade =>
    grade.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.assessment_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGrades = grades.length;
  const averageScore = grades.length > 0 ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length) : 0;
  const excellentEffort = grades.filter(g => g.effort === "excellent").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Gradebook & Reporting</h1>
        <p className="text-muted-foreground">Termly reports with UK-style comments, AI-assisted generation, and parent portal access</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card 
          className="shadow-[var(--shadow-card)] cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleStatCardClick("Total Grades")}
        >
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
        <Card 
          className="shadow-[var(--shadow-card)] cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleStatCardClick("Average Score")}
        >
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
        <Card 
          className="shadow-[var(--shadow-card)] cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleStatCardClick("Excellent Effort")}
        >
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
        <Card 
          className="shadow-[var(--shadow-card)] cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleStatCardClick("Reports Sent")}
        >
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

      {/* Statistics Detail Dialog */}
      <Dialog open={!!selectedStatCard} onOpenChange={(open) => !open && setSelectedStatCard(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedStatCard && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStatCard} Breakdown</DialogTitle>
                <DialogDescription>
                  Detailed statistics and distribution
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <h4 className="font-semibold">{getStatCardDetails(selectedStatCard).title}</h4>
                <div className="space-y-3">
                  {getStatCardDetails(selectedStatCard).data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-sm text-muted-foreground">{item.value} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
                  <Dialog open={isAICommentDialogOpen} onOpenChange={setIsAICommentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Bot className="h-4 w-4 mr-2" />
                        AI Comments
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>AI Comment Generator</DialogTitle>
                        <DialogDescription>
                          Generate personalized comments for student assessments using AI
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="student-select">Select Student Grade</Label>
                          <Select onValueChange={(value) => setSelectedGrade(grades.find(g => g.id === value) || null)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a grade to generate comment for" />
                            </SelectTrigger>
                            <SelectContent>
                              {grades.map((grade) => (
                                <SelectItem key={grade.id} value={grade.id}>
                                  {grade.student_name} - {grade.subject} ({grade.grade})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedGrade && (
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">Selected Grade Details:</h4>
                            <p><strong>Student:</strong> {selectedGrade.student_name}</p>
                            <p><strong>Subject:</strong> {selectedGrade.subject}</p>
                            <p><strong>Assessment:</strong> {selectedGrade.assessment_name}</p>
                            <p><strong>Score:</strong> {selectedGrade.score}% ({selectedGrade.grade})</p>
                            <p><strong>Effort:</strong> {selectedGrade.effort}</p>
                          </div>
                        )}
                        <div>
                          <Label htmlFor="comment-output">Generated Comment</Label>
                          <Textarea
                            id="comment-output"
                            value={isGeneratingComment ? "Generating personalized comment..." : generatedComment}
                            placeholder="Generated AI comment will appear here"
                            className="min-h-32"
                            readOnly={isGeneratingComment}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => selectedGrade && generateAIComment(selectedGrade)}
                            disabled={!selectedGrade || isGeneratingComment}
                            className="flex-1"
                          >
                            {isGeneratingComment ? "Generating..." : "Generate AI Comment"}
                          </Button>
                          {generatedComment && (
                            <Button 
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedComment);
                                toast({
                                  title: "Copied!",
                                  description: "Comment copied to clipboard",
                                });
                              }}
                            >
                              Copy
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={handleExportGrades}>
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
                        <TableCell className="font-medium">{grade.student_name}</TableCell>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.assessment_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span>{grade.score}/{grade.max_score}</span>
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
                        <TableCell className="font-medium">{report.student_name}</TableCell>
                        <TableCell>{report.year}</TableCell>
                        <TableCell>{report.term}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold">
                            {report.average_grade}%
                          </Badge>
                        </TableCell>
                        <TableCell>{report.subject_count}</TableCell>
                        <TableCell>{report.generated_date}</TableCell>
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