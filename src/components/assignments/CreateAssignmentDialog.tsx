import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAssignmentData, Assignment } from '@/hooks/useAssignmentData';
import { useToast } from '@/hooks/use-toast';

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAssignmentDialog: React.FC<CreateAssignmentDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { createAssignment } = useAssignmentData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    due_date: '',
    total_marks: 10,
    assignment_type: 'homework' as Assignment['assignment_type'],
    subject: '',
    year_group: '',
    submission_type: 'both' as Assignment['submission_type'],
    allow_late_submissions: true,
    late_penalty_percentage: 10,
    status: 'draft' as Assignment['status']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.due_date || !formData.subject || !formData.year_group) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createAssignment(formData);
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        due_date: '',
        total_marks: 10,
        assignment_type: 'homework',
        subject: '',
        year_group: '',
        submission_type: 'both',
        allow_late_submissions: true,
        late_penalty_percentage: 10,
        status: 'draft'
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 'Geography', 
    'Art', 'Music', 'Physical Education', 'Computing', 'Languages'
  ];

  const yearGroups = [
    'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 
    'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 
    'Year 10', 'Year 11', 'Year 12', 'Year 13'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment or homework for your students
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Assignment title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignment_type">Type</Label>
                <Select 
                  value={formData.assignment_type}
                  onValueChange={(value: Assignment['assignment_type']) => 
                    setFormData(prev => ({ ...prev, assignment_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="classwork">Classwork</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assignment"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Detailed instructions for students"
                rows={4}
              />
            </div>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select 
                value={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_group">Year Group *</Label>
              <Select 
                value={formData.year_group}
                onValueChange={(value) => setFormData(prev => ({ ...prev, year_group: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year group" />
                </SelectTrigger>
                <SelectContent>
                  {yearGroups.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_marks">Total Marks</Label>
              <Input
                id="total_marks"
                type="number"
                min="1"
                value={formData.total_marks}
                onChange={(e) => setFormData(prev => ({ ...prev, total_marks: parseInt(e.target.value) || 10 }))}
              />
            </div>
          </div>

          {/* Submission Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submission_type">Submission Type</Label>
              <Select 
                value={formData.submission_type}
                onValueChange={(value: Assignment['submission_type']) => 
                  setFormData(prev => ({ ...prev, submission_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file_upload">File Upload Only</SelectItem>
                  <SelectItem value="text_entry">Text Entry Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow_late">Allow Late Submissions</Label>
                <p className="text-sm text-muted-foreground">
                  Students can submit after the due date
                </p>
              </div>
              <Switch
                id="allow_late"
                checked={formData.allow_late_submissions}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, allow_late_submissions: checked }))
                }
              />
            </div>

            {formData.allow_late_submissions && (
              <div className="space-y-2">
                <Label htmlFor="late_penalty">Late Penalty (%)</Label>
                <Input
                  id="late_penalty"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.late_penalty_percentage}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    late_penalty_percentage: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status}
              onValueChange={(value: Assignment['status']) => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};