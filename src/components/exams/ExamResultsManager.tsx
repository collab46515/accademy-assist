import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Search, Download, Upload, Edit, Users, GraduationCap } from 'lucide-react';
import { useExamData } from '@/hooks/useExamData';
import { useStudentData } from '@/hooks/useStudentData';
import { format } from 'date-fns';

const resultSchema = z.object({
  exam_id: z.string().min(1, 'Exam is required'),
  student_id: z.string().min(1, 'Student is required'),
  marks_obtained: z.number().min(0, 'Marks must be 0 or greater'),
  grade: z.string().optional(),
  feedback: z.string().optional(),
});

type ResultFormData = z.infer<typeof resultSchema>;

export function ExamResultsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const { exams, examResults, recordExamResult, loading } = useExamData();
  const { students } = useStudentData();

  const form = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      exam_id: '',
      student_id: '',
      marks_obtained: 0,
      grade: '',
      feedback: '',
    },
  });

  // Filter results based on search and selected exam
  const filteredResults = examResults.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === '' || result.exam_id === selectedExam;
    return matchesSearch && matchesExam;
  });

  // Get exam title by ID
  const getExamTitle = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? `${exam.title} - ${exam.subject}` : 'Unknown Exam';
  };

  // Get student name by ID
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.profiles?.first_name} ${student.profiles?.last_name}` : 'Unknown Student';
  };

  // Calculate grade from percentage
  const calculateGrade = (percentage: number) => {
    if (percentage >= 90) return 'A*';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  };

  const onSubmitResult = async (data: ResultFormData) => {
    try {
      const exam = exams.find(e => e.id === data.exam_id);
      if (!exam) return;

      const percentage = (data.marks_obtained / exam.total_marks) * 100;
      const autoGrade = calculateGrade(percentage);

      await recordExamResult({
        exam_id: data.exam_id,
        student_id: data.student_id,
        marks_obtained: data.marks_obtained,
        grade: data.grade || autoGrade,
        feedback: data.feedback,
      });

      setShowAddDialog(false);
      form.reset();
    } catch (error) {
      console.error('Error recording result:', error);
    }
  };

  // Generate demo results for demonstration
  const generateDemoResults = async () => {
    if (exams.length === 0 || students.length === 0) return;

    const demoResults = [];
    const selectedStudents = students.slice(0, 5); // Take first 5 students
    const selectedExams = exams.slice(0, 3); // Take first 3 exams

    for (const exam of selectedExams) {
      for (const student of selectedStudents) {
        const marks = Math.floor(Math.random() * exam.total_marks * 0.8) + Math.floor(exam.total_marks * 0.2); // 20-100% range
        const percentage = (marks / exam.total_marks) * 100;
        const grade = calculateGrade(percentage);

        try {
          await recordExamResult({
            exam_id: exam.id,
            student_id: student.id,
            marks_obtained: marks,
            grade,
            feedback: `Good performance in ${exam.subject}`,
          });
        } catch (error) {
          console.error('Error creating demo result:', error);
        }
      }
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A*':
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-yellow-100 text-yellow-700';
      case 'D': return 'bg-orange-100 text-orange-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Exam Results Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Record and manage student exam results
              </p>
            </div>
            <div className="flex gap-2">
              {examResults.length === 0 && (
                <Button variant="outline" onClick={generateDemoResults}>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Generate Demo Results
                </Button>
              )}
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Import Results</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with student results. Expected format:
                    </p>
                    <div className="bg-muted p-3 rounded-md text-sm font-mono">
                      student_id,exam_id,marks_obtained,grade,feedback
                    </div>
                    <Input type="file" accept=".csv" />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                        Cancel
                      </Button>
                      <Button>Import Results</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Exam Result</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitResult)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="exam_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exam</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select exam" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {exams.map((exam) => (
                                  <SelectItem key={exam.id} value={exam.id}>
                                    {exam.title} - {exam.subject} ({exam.total_marks} marks)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="student_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {students.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.profiles?.first_name} {student.profiles?.last_name} ({student.student_number})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="marks_obtained"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marks Obtained</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="85" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Auto-calculated from marks" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A*">A*</SelectItem>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="E">E</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="feedback"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Feedback (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Teacher feedback..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Record Result</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filter by exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Exams</SelectItem>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title} - {exam.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Results ({filteredResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">
                {examResults.length === 0 
                  ? "Start by adding exam results or generating demo data"
                  : "Try adjusting your search filters"
                }
              </p>
              {examResults.length === 0 && (
                <Button onClick={generateDemoResults}>
                  Generate Demo Results
                </Button>
              )}
            </div>
          ) : (
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
                    <TableHead>Date Marked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {getStudentName(result.student_id)}
                      </TableCell>
                      <TableCell>{getExamTitle(result.exam_id)}</TableCell>
                      <TableCell>{result.marks_obtained}</TableCell>
                      <TableCell>{result.percentage}%</TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(result.grade || '')}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.rank || '-'}</TableCell>
                      <TableCell>
                        {result.marked_at ? format(new Date(result.marked_at), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}