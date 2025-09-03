import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useExamData } from '@/hooks/useExamData';
import { toast } from 'sonner';

interface ExamSchedulingFormProps {
  onClose: () => void;
}

export function ExamSchedulingForm({ onClose }: ExamSchedulingFormProps) {
  const { createExam } = useExamData();
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    exam_board: '',
    exam_type: 'internal' as 'internal' | 'external' | 'mock' | 'assessment',
    grade_level: '',
    academic_term: '',
    academic_year: '2024-2025',
    total_marks: 100,
    duration_minutes: 60,
    exam_date: undefined as Date | undefined,
    start_time: '09:00',
    end_time: '10:00',
    instructions: '',
    room: '',
    invigilator: '',
    max_candidates: 30
  });

  const [saving, setSaving] = useState(false);

  const subjects = [
    'Mathematics', 'English Language', 'English Literature', 'Physics', 
    'Chemistry', 'Biology', 'History', 'Geography', 'French', 'Spanish',
    'Art & Design', 'Music', 'Physical Education', 'Computer Science'
  ];

  const examBoards = [
    'Cambridge', 'Edexcel', 'AQA', 'OCR', 'WJEC', 'CIE', 'Internal'
  ];

  const gradeLevels = [
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ];

  const academicTerms = [
    'Term 1', 'Term 2', 'Term 3', 'Autumn Term', 'Spring Term', 'Summer Term'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.exam_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await createExam({
        title: formData.title,
        subject: formData.subject,
        exam_board: formData.exam_board,
        exam_type: formData.exam_type,
        grade_level: formData.grade_level,
        academic_term: formData.academic_term,
        academic_year: formData.academic_year,
        total_marks: formData.total_marks,
        duration_minutes: formData.duration_minutes,
        exam_date: format(formData.exam_date, 'yyyy-MM-dd'),
        start_time: formData.start_time,
        end_time: formData.end_time,
        instructions: formData.instructions,
        is_active: true
      });

      // Small delay to ensure state update is processed
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Error scheduling exam:', error);
      toast.error('Failed to schedule exam');
    } finally {
      setSaving(false);
    }
  };

  const updateDuration = () => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2024-01-01 ${formData.start_time}`);
      const end = new Date(`2024-01-01 ${formData.end_time}`);
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      setFormData(prev => ({ ...prev, duration_minutes: Math.max(0, diffMinutes) }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Exam Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Mathematics End of Term Assessment"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exam_board">Exam Board</Label>
            <Select value={formData.exam_board} onValueChange={(value) => setFormData(prev => ({ ...prev, exam_board: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam board" />
              </SelectTrigger>
              <SelectContent>
                {examBoards.map(board => (
                  <SelectItem key={board} value={board}>{board}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exam_type">Exam Type</Label>
            <Select value={formData.exam_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, exam_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
                <SelectItem value="mock">Mock</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="grade_level">Grade Level</Label>
            <Select value={formData.grade_level} onValueChange={(value) => setFormData(prev => ({ ...prev, grade_level: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="academic_term">Academic Term</Label>
            <Select value={formData.academic_term} onValueChange={(value) => setFormData(prev => ({ ...prev, academic_term: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {academicTerms.map(term => (
                  <SelectItem key={term} value={term}>{term}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="academic_year">Academic Year</Label>
            <Input
              id="academic_year"
              value={formData.academic_year}
              onChange={(e) => setFormData(prev => ({ ...prev, academic_year: e.target.value }))}
              placeholder="2024-2025"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduling Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Exam Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.exam_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.exam_date ? format(formData.exam_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.exam_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, exam_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input
              id="duration_minutes"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
              min="1"
              max="480"
            />
          </div>

          <div>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, start_time: e.target.value }));
                setTimeout(updateDuration, 100);
              }}
            />
          </div>

          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, end_time: e.target.value }));
                setTimeout(updateDuration, 100);
              }}
            />
          </div>

          <div>
            <Label htmlFor="total_marks">Total Marks</Label>
            <Input
              id="total_marks"
              type="number"
              value={formData.total_marks}
              onChange={(e) => setFormData(prev => ({ ...prev, total_marks: parseInt(e.target.value) || 0 }))}
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="max_candidates">Max Candidates</Label>
            <Input
              id="max_candidates"
              type="number"
              value={formData.max_candidates}
              onChange={(e) => setFormData(prev => ({ ...prev, max_candidates: parseInt(e.target.value) || 0 }))}
              min="1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instructions">Exam Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Enter specific instructions for candidates..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Scheduling...' : 'Schedule Exam'}
        </Button>
      </div>
    </form>
  );
}