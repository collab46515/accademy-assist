import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  year_group: string;
}

interface ReportCardGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'individual' | 'bulk';
}

export function ReportCardGenerator({ open, onOpenChange, mode }: ReportCardGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [yearGroup, setYearGroup] = useState('');
  const [academicTerm, setAcademicTerm] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const { toast } = useToast();

  const yearGroups = ['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'];
  const terms = ['Autumn 2024', 'Spring 2025', 'Summer 2025'];
  const years = ['2024-2025', '2023-2024', '2022-2023'];

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open, yearGroup]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      // For now, let's use demo data with proper UUIDs
      const demoStudents = [
        { id: '550e8400-e29b-41d4-a716-446655440001', first_name: 'John', last_name: 'Smith', year_group: 'Year 7' },
        { id: '550e8400-e29b-41d4-a716-446655440002', first_name: 'Emma', last_name: 'Johnson', year_group: 'Year 7' },
        { id: '550e8400-e29b-41d4-a716-446655440003', first_name: 'Michael', last_name: 'Brown', year_group: 'Year 8' },
        { id: '550e8400-e29b-41d4-a716-446655440004', first_name: 'Sarah', last_name: 'Wilson', year_group: 'Year 8' },
        { id: '550e8400-e29b-41d4-a716-446655440005', first_name: 'David', last_name: 'Taylor', year_group: 'Year 9' },
        { id: '550e8400-e29b-41d4-a716-446655440006', first_name: 'Lucy', last_name: 'Anderson', year_group: 'Year 9' },
      ];
      
      // Filter by year group if selected
      const filteredStudents = yearGroup 
        ? demoStudents.filter(student => student.year_group === yearGroup)
        : demoStudents;
        
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (mode === 'individual') {
        // For demo purposes, we'll create a mock report since we don't have actual grade data
        const selectedStudent = students.find(s => s.id === studentId);
        if (!selectedStudent) {
          throw new Error('Student not found');
        }

        // Create report card record directly (skip the RPC for now since we may not have grade data)
        const { error: insertError } = await supabase
          .from('report_cards')
          .insert({
            student_id: studentId,
            school_id: crypto.randomUUID(), // Temporary - should come from context
            academic_term: academicTerm,
            academic_year: academicYear,
            class_name: yearGroup,
            teacher_id: crypto.randomUUID(), // Should come from auth
            teacher_name: 'Current Teacher',
            student_name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
            year_group: yearGroup,
            generated_by: crypto.randomUUID(), // Should come from auth
            grades_data: [], // Empty for now
            attendance_data: {},
            status: 'draft'
          });

        if (insertError) {
          throw insertError;
        }

        toast({
          title: "Report Generated Successfully",
          description: `Report card created for ${selectedStudent.first_name} ${selectedStudent.last_name}`,
        });
      } else {
        // Bulk generation - this would iterate through multiple students
        toast({
          title: "Bulk Generation Started",
          description: `Generating reports for all students in ${yearGroup} - ${academicTerm}`,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the report card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'individual' ? <FileText className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            {mode === 'individual' ? 'Generate Individual Report' : 'Bulk Generate Reports'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'individual' 
              ? 'Create a report card for a specific student'
              : 'Generate report cards for multiple students at once'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">Academic Term</Label>
            <Select value={academicTerm} onValueChange={setAcademicTerm}>
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term} value={term.toLowerCase().replace(' ', '_')}>{term}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearGroup">Year Group</Label>
            <Select value={yearGroup} onValueChange={setYearGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select year group" />
              </SelectTrigger>
              <SelectContent>
                {yearGroups.map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === 'individual' && (
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingStudents ? "Loading students..." : "Select student"} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} ({student.year_group})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleGenerate}
              disabled={loading || !academicTerm || !academicYear || !yearGroup || (mode === 'individual' && !studentId)}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Generating...' : `Generate ${mode === 'individual' ? 'Report' : 'Reports'}`}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}