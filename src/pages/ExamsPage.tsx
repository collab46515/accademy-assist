import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Users, FileText, Search, Plus, Download, Filter } from "lucide-react";
import { useExamData } from "@/hooks/useExamData";
import { format } from "date-fns";
import { ExamBoardManager } from "@/components/exams/ExamBoardManager";
import { ExamSchedulingForm } from "@/components/exams/ExamSchedulingForm";

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const { exams, examResults, loading } = useExamData();

  console.log('ExamsPage render - exams:', exams);
  console.log('ExamsPage render - exams.length:', exams.length);

  // Filter exams based on search term
  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.exam_board.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log('Filtered exams:', filteredExams);
  console.log('Search term:', searchTerm);

  // Helper function to get status badge color
  const getStatusBadge = (type: string) => {
    switch (type) {
      case "internal":
        return <Badge variant="secondary">Internal</Badge>;
      case "external":
        return <Badge variant="default">External</Badge>;
      case "mock":
        return <Badge variant="outline">Mock</Badge>;
      case "assessment":
        return <Badge variant="destructive">Assessment</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  // Helper function to get level badge
  const getLevelBadge = (level: string) => {
    return <Badge variant="outline">{level}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Examinations"
          description="Manage exam schedules, results, and assessment data"
          breadcrumbItems={[
            { label: "Academics", href: "/academics" },
            { label: "Exams" }
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations"
        description="Manage exam schedules, results, and assessment data"
        breadcrumbItems={[
          { label: "Academics", href: "/academics" },
          { label: "Exams" }
        ]}
        actions={
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Exam</DialogTitle>
                <DialogDescription>
                  Create a new examination session for your students.
                </DialogDescription>
              </DialogHeader>
              <ExamSchedulingForm onClose={() => setShowScheduleDialog(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setActiveTab("schedule")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">
              Click to view all exams
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => {
            setActiveTab("schedule");
            setSearchTerm("internal");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internal Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter(e => e.exam_type === "internal").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to filter internal exams
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => {
            setActiveTab("schedule");
            setSearchTerm("external");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Exams</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter(e => e.exam_type === "external").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to filter external exams
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setActiveTab("results")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examResults.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Click to view results
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="boards">Exam Boards</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Exam Schedule</CardTitle>
                  <CardDescription>Manage and track examination schedules</CardDescription>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
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
                      <TableHead>Title</TableHead>
                      <TableHead>Board</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.exam_board}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{getLevelBadge(exam.grade_level)}</TableCell>
                        <TableCell>{format(new Date(exam.exam_date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{exam.duration_minutes} min</TableCell>
                        <TableCell>{exam.total_marks}</TableCell>
                        <TableCell>{getStatusBadge(exam.exam_type)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Examination Results</CardTitle>
              <CardDescription>View and manage student exam results</CardDescription>
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
                      <TableHead>Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.student_id}</TableCell>
                        <TableCell>{result.exam_id}</TableCell>
                        <TableCell>{result.marks_obtained}</TableCell>
                        <TableCell>{result.percentage}%</TableCell>
                        <TableCell>
                          <Badge variant={result.grade === "A*" || result.grade === "A" ? "default" : "secondary"}>
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.rank || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boards" className="space-y-4">
          <ExamBoardManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}