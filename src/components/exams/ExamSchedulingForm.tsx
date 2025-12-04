import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Clock, FileText, Users, Loader2 } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import { CreateExamData } from '@/hooks/useExamData';
import { supabase } from '@/integrations/supabase/client';

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  exam_board: z.string().optional(),
  exam_type: z.string().min(1, 'Exam type is required'),
  grade_level: z.string().optional(),
  academic_term: z.string().optional(),
  academic_year: z.string().min(1, 'Academic year is required'),
  exam_date: z.string().min(1, 'Exam date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute'),
  total_marks: z.number().min(1, 'Total marks must be at least 1'),
  instructions: z.string().optional(),
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamSchedulingFormProps {
  createExam: (data: CreateExamData) => Promise<any>;
  onClose: () => void;
}

interface ExamBoard {
  id: string;
  name: string;
  full_name: string;
}

interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
}

interface YearGroup {
  id: string;
  year_name: string;
  year_code: string;
}

export function ExamSchedulingForm({ createExam, onClose }: ExamSchedulingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMasterData, setLoadingMasterData] = useState(true);
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
  const { currentSchool } = useRBAC();

  // Fetch master data on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      setLoadingMasterData(true);
      try {
        // Get school_id from user_roles
        const { data: { user } } = await supabase.auth.getUser();
        let schoolId: string | null = null;
        
        if (user) {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('school_id')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();
          schoolId = userRoles?.school_id || null;
        }

        // Fetch exam boards (global, not school-specific)
        const { data: boardsData, error: boardsError } = await supabase
          .from('exam_boards')
          .select('id, name, full_name')
          .eq('is_active', true)
          .order('name');

        if (!boardsError && boardsData) {
          setExamBoards(boardsData);
        }

        // Fetch subjects (school-specific)
        const subjectsQuery = supabase
          .from('subjects')
          .select('id, subject_name, subject_code')
          .eq('is_active', true)
          .order('subject_name');

        if (schoolId) {
          subjectsQuery.eq('school_id', schoolId);
        }

        const { data: subjectsData, error: subjectsError } = await subjectsQuery;

        if (!subjectsError && subjectsData) {
          setSubjects(subjectsData);
        }

        // Fetch year groups (school-specific)
        const yearGroupsQuery = supabase
          .from('year_groups')
          .select('id, year_name, year_code')
          .eq('is_active', true)
          .order('sort_order');

        if (schoolId) {
          yearGroupsQuery.eq('school_id', schoolId);
        }

        const { data: yearGroupsData, error: yearGroupsError } = await yearGroupsQuery;

        if (!yearGroupsError && yearGroupsData) {
          setYearGroups(yearGroupsData);
        }

      } catch (error) {
        console.error('Error fetching master data:', error);
      } finally {
        setLoadingMasterData(false);
      }
    };

    fetchMasterData();
  }, []);

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      subject: '',
      exam_board: '',
      exam_type: 'internal' as const,
      grade_level: '',
      academic_term: '',
      academic_year: new Date().getFullYear().toString(),
      exam_date: '',
      start_time: '09:00',
      end_time: '11:00',
      duration_minutes: 120,
      total_marks: 100,
      instructions: '',
    },
  });

  const onSubmit = async (data: ExamFormData) => {
    try {
      setIsSubmitting(true);
      await createExam({
        title: data.title,
        subject: data.subject,
        exam_board: data.exam_board,
        exam_type: data.exam_type as 'internal' | 'external' | 'mock' | 'assessment',
        grade_level: data.grade_level,
        academic_term: data.academic_term,
        academic_year: data.academic_year,
        exam_date: data.exam_date,
        start_time: data.start_time,
        end_time: data.end_time,
        duration_minutes: data.duration_minutes,
        total_marks: data.total_marks,
        instructions: data.instructions,
      });
      onClose();
    } catch (error) {
      console.error('Error creating exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate duration when start/end times change
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) return 0;
    
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  };

  // Update duration when times change
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'start_time' || name === 'end_time') {
        const duration = calculateDuration(value.start_time || '', value.end_time || '');
        if (duration > 0) {
          form.setValue('duration_minutes', duration);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (loadingMasterData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading master data...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                <h3 className="font-semibold">Basic Information</h3>
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mathematics Mid-Term Exam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.length > 0 ? (
                          subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.subject_name}>
                              {subject.subject_name} ({subject.subject_code})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="_no_subjects" disabled>
                            No subjects in master data
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {subjects.length === 0 && (
                      <p className="text-xs text-amber-600">
                        Add subjects in Master Data → Academic Settings
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exam_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">Internal Assessment</SelectItem>
                        <SelectItem value="external">External Exam</SelectItem>
                        <SelectItem value="mock">Mock Exam</SelectItem>
                        <SelectItem value="assessment">Continuous Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exam_board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Board (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examBoards.length > 0 ? (
                          examBoards.map((board) => (
                            <SelectItem key={board.id} value={board.name}>
                              {board.name} - {board.full_name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="_no_boards" disabled>
                            No exam boards in master data
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {examBoards.length === 0 && (
                      <p className="text-xs text-amber-600">
                        Add exam boards in Exams → Exam Boards tab
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Academic Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                <h3 className="font-semibold">Academic Details</h3>
              </div>

              <FormField
                control={form.control}
                name="grade_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearGroups.length > 0 ? (
                          yearGroups.map((yg) => (
                            <SelectItem key={yg.id} value={yg.year_name}>
                              {yg.year_name} ({yg.year_code})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="_no_year_groups" disabled>
                            No year groups in master data
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {yearGroups.length === 0 && (
                      <p className="text-xs text-amber-600">
                        Add year groups in Master Data → Academic Settings
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Term 1">Term 1</SelectItem>
                        <SelectItem value="Term 2">Term 2</SelectItem>
                        <SelectItem value="Term 3">Term 3</SelectItem>
                        <SelectItem value="Autumn Term">Autumn Term</SelectItem>
                        <SelectItem value="Spring Term">Spring Term</SelectItem>
                        <SelectItem value="Summer Term">Summer Term</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Marks</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Schedule Information */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              <h3 className="font-semibold">Schedule Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="exam_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any special instructions for students..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Exam'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
