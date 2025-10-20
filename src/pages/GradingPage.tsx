import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAssignmentData } from '@/hooks/useAssignmentData';
import { useRBAC } from '@/hooks/useRBAC';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GradingInterface } from '@/components/assignments/GradingInterface';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function GradingPage() {
  const navigate = useNavigate();
  const { currentSchool } = useRBAC();
  const { assignments, submissions, loading } = useAssignmentData(currentSchool?.id);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Fetch student data
  const { data: students = [] } = useQuery({
    queryKey: ['students-with-names', currentSchool?.id],
    queryFn: async () => {
      if (!currentSchool?.id) return [];
      const { data, error } = await supabase
        .from('students')
        .select('id, student_number')
        .eq('school_id', currentSchool.id);
      
      if (error) {
        console.error('Error fetching students:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!currentSchool?.id,
  });

  // Enrich submissions with student names and ensure required fields
  const enrichedSubmissions = submissions.map(sub => {
    const student = students.find(s => s.id === sub.student_id);
    const studentName = student?.student_number || 'Unknown Student';
    
    return {
      ...sub,
      student_name: studentName,
      submitted_at: sub.submitted_at || null,
      submission_text: sub.submission_text || null,
      attachment_urls: sub.attachment_urls || [],
      marks_awarded: sub.marks_awarded || null,
      feedback: sub.feedback || null,
      is_late: sub.is_late || false,
      status: sub.status || 'not_submitted',
    };
  });

  // Filter assignments that have submissions needing grading
  const pendingGradingAssignments = assignments.filter(a => {
    const assignmentSubmissions = enrichedSubmissions.filter(s => s.assignment_id === a.id);
    return assignmentSubmissions.some(s => 
      (s.status === 'submitted' || s.status === 'in_progress') && 
      s.marks_awarded === null
    );
  });

  if (selectedAssignment) {
    const assignmentSubmissions = enrichedSubmissions.filter(
      s => s.assignment_id === selectedAssignment.id
    );

    return (
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setSelectedAssignment(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Grading Overview
          </Button>
        </div>
        <GradingInterface 
          assignment={selectedAssignment}
          submissions={assignmentSubmissions as any}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title="Grade Assignments"
        description="Review and grade pending student submissions"
      />

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Loading assignments...</p>
            </CardContent>
          </Card>
        ) : pendingGradingAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">No assignments pending grading</p>
            </CardContent>
          </Card>
        ) : (
          pendingGradingAssignments.map(assignment => {
            const assignmentSubmissions = enrichedSubmissions.filter(s => s.assignment_id === assignment.id);
            const pendingCount = assignmentSubmissions.filter(
              s => s.marks_awarded === null && s.status === 'submitted'
            ).length;

            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {assignment.title}
                      </CardTitle>
                      <CardDescription>
                        {assignment.subject} • {assignment.year_group} • Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {pendingCount} pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {assignmentSubmissions.length} total submissions
                    </div>
                    <Button onClick={() => setSelectedAssignment(assignment)}>
                      Start Grading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
