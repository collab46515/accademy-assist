import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Clock, FileText, Users } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import { CreateExamData } from '@/hooks/useExamData';

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

export function ExamSchedulingForm({ createExam, onClose }: ExamSchedulingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentSchool } = useRBAC();

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      subject: '',
      exam_board: '',
      exam_type: 'internal',
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
        exam_type: data.exam_type,
        grade_level: data.grade_level,
        academic_term: data.academic_term,
        academic_year: data.academic_year,
        exam_date: data.exam_date,
        start_time: data.start_time,
        end_time: data.end_time,
        duration_minutes: data.duration_minutes,
        total_marks: data.total_marks,
        instructions: data.instructions,
        school_id: currentSchool?.id
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
                    <FormControl>
                      <Input placeholder="e.g., Mathematics" {...field} />
                    </FormControl>
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
                        <SelectItem value="AQA">AQA</SelectItem>
                        <SelectItem value="OCR">OCR</SelectItem>
                        <SelectItem value="Edexcel">Edexcel</SelectItem>
                        <SelectItem value="WJEC">WJEC</SelectItem>
                        <SelectItem value="Internal">Internal</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="Year 7">Year 7</SelectItem>
                        <SelectItem value="Year 8">Year 8</SelectItem>
                        <SelectItem value="Year 9">Year 9</SelectItem>
                        <SelectItem value="Year 10">Year 10</SelectItem>
                        <SelectItem value="Year 11">Year 11</SelectItem>
                        <SelectItem value="Year 12">Year 12</SelectItem>
                        <SelectItem value="Year 13">Year 13</SelectItem>
                      </SelectContent>
                    </Select>
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