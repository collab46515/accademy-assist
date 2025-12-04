import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, FileText, Search, Plus, Download, Filter } from "lucide-react";
import { useExamData } from "@/hooks/useExamData";
import { format } from "date-fns";
import { ExamBoardManager } from "@/components/exams/ExamBoardManager";
import { ExamSchedulingForm } from "@/components/exams/ExamSchedulingForm";
import { ExamResultsManager } from "@/components/exams/ExamResultsManager";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { supabase } from "@/integrations/supabase/client";

export default function ExamsPage() {
  return (
    <ModuleGuard moduleName="Examinations">
      <ExamsPageContent />
    </ModuleGuard>
  );
}

function ExamsPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("all");
  const [yearGroups, setYearGroups] = useState<{ id: string; year_name: string }[]>([]);
  const { exams, examResults, loading, refreshTrigger, createExam } = useExamData();

  // Fetch year groups from master data
  useEffect(() => {
    const fetchYearGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('school_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      const schoolId = userRoles?.school_id;

      const query = supabase
        .from('year_groups')
        .select('id, year_name')
        .eq('is_active', true)
        .order('sort_order');

      if (schoolId) {
        query.eq('school_id', schoolId);
      }

      const { data } = await query;
      if (data) {
        setYearGroups(data);
      }
    };

    fetchYearGroups();
  }, []);

  console.log('ExamsPage render - refreshTrigger:', refreshTrigger);
  console.log('ExamsPage render - exams:', exams);
  console.log('ExamsPage render - exams.length:', exams.length);

  // Filter exams based on search term and filters
  const filteredExams = (exams || []).filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.exam_board?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = examTypeFilter === "all" || exam.exam_type === examTypeFilter;
    const matchesLevel = gradeLevelFilter === "all" || exam.grade_level === gradeLevelFilter;
    
    return matchesSearch && matchesType && matchesLevel;
  });
  
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
              <ExamSchedulingForm createExam={createExam} onClose={() => setShowScheduleDialog(false)} />
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
            <div className="text-2xl font-bold">{exams?.length || 0}</div>
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
              {(exams || []).filter(e => e.exam_type === "internal").length}
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
              {(exams || []).filter(e => e.exam_type === "external").length}
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
                   <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                     <SelectTrigger className="w-32">
                       <SelectValue placeholder="Type" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Types</SelectItem>
                       <SelectItem value="internal">Internal</SelectItem>
                       <SelectItem value="external">External</SelectItem>
                       <SelectItem value="mock">Mock</SelectItem>
                       <SelectItem value="assessment">Assessment</SelectItem>
                     </SelectContent>
                   </Select>
                   <Select value={gradeLevelFilter} onValueChange={setGradeLevelFilter}>
                     <SelectTrigger className="w-32">
                       <SelectValue placeholder="Level" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Levels</SelectItem>
                       {yearGroups.length > 0 ? (
                         yearGroups.map((yg) => (
                           <SelectItem key={yg.id} value={yg.year_name}>
                             {yg.year_name}
                           </SelectItem>
                         ))
                       ) : (
                         <SelectItem value="_no_data" disabled>No year groups</SelectItem>
                       )}
                     </SelectContent>
                   </Select>
                   <Button variant="outline" size="sm" onClick={() => {
                     // Reset filters
                     setSearchTerm("");
                     setExamTypeFilter("all");
                     setGradeLevelFilter("all");
                   }}>
                     <Filter className="h-4 w-4 mr-2" />
                     Clear Filters
                   </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    // Export as CSV instead of JSON
                    const headers = ['Title', 'Board', 'Subject', 'Level', 'Date', 'Duration (min)', 'Total Marks', 'Type'];
                    const csvData = filteredExams.map(exam => [
                      exam.title,
                      exam.exam_board || '',
                      exam.subject,
                      exam.grade_level || '',
                      format(new Date(exam.exam_date), "MMM dd, yyyy"),
                      exam.duration_minutes,
                      exam.total_marks,
                      exam.exam_type
                    ]);
                    
                    const csvContent = [
                      headers.join(','),
                      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
                    ].join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'exam-schedule.csv';
                    link.click();
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
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
                        <TableCell>{exam.exam_board || '-'}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{exam.grade_level ? getLevelBadge(exam.grade_level) : '-'}</TableCell>
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
          <ExamResultsManager />
        </TabsContent>

        <TabsContent value="boards" className="space-y-4">
          <ExamBoardManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}