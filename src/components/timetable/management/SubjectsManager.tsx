import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, Palette } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useTimetableData } from '@/hooks/useTimetableData';

interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  color_code: string;
  periods_per_week: number;
  requires_lab: boolean;
}

const predefinedColors = [
  '#3B82F6', '#10B981', '#EF4444', '#F59E0B', 
  '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
];

// British Curriculum Subjects
const britishSubjects = [
  'English Language', 'English Literature', 'Mathematics', 'Biology', 'Chemistry', 'Physics',
  'Religious Education', 'History', 'Geography', 'Design & Technology', 'Computing',
  'Art & Design', 'Music', 'Physical Education', 'French', 'Spanish', 'German',
  'Drama', 'Business Studies', 'Psychology', 'Form Time', 'Assembly'
];

export function SubjectsManager() {
  const { toast } = useToast();
  const { subjects: fetchedSubjects, fetchSubjects } = useTimetableData();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    color_code: '#3B82F6',
    periods_per_week: 5,
    requires_lab: false
  });

  useEffect(() => {
    setSubjects(fetchedSubjects);
  }, [fetchedSubjects]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSave = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...editingSubject, ...formData }
          : s
      ));
      toast({ title: "Subject updated successfully" });
    } else {
      const newSubject: Subject = {
        id: Math.random().toString(),
        ...formData
      };
      setSubjects([...subjects, newSubject]);
      toast({ title: "Subject added successfully" });
    }
    
    setIsOpen(false);
    setEditingSubject(null);
    setFormData({
      subject_name: '',
      subject_code: '',
      color_code: '#3B82F6',
      periods_per_week: 5,
      requires_lab: false
    });
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      color_code: subject.color_code,
      periods_per_week: subject.periods_per_week,
      requires_lab: subject.requires_lab
    });
    setIsOpen(true);
  };

  const handleDelete = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
    toast({ title: "Subject deleted successfully" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Manage Subjects
          </span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingSubject(null);
                setFormData({
                  subject_name: '',
                  subject_code: '',
                  color_code: '#3B82F6',
                  periods_per_week: 5,
                  requires_lab: false
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject_name">Subject Name</Label>
                  <Input
                    id="subject_name"
                    value={formData.subject_name}
                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                    placeholder="e.g., Mathematics, English Language"
                    list="british-subjects"
                  />
                  <datalist id="british-subjects">
                    {britishSubjects.map((subject) => (
                      <option key={subject} value={subject} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="subject_code">Subject Code</Label>
                  <Input
                    id="subject_code"
                    value={formData.subject_code}
                    onChange={(e) => setFormData({ ...formData, subject_code: e.target.value.toUpperCase() })}
                    placeholder="e.g., MATH"
                  />
                </div>
                <div>
                  <Label htmlFor="periods_per_week">Periods per Week</Label>
                  <Input
                    id="periods_per_week"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.periods_per_week}
                    onChange={(e) => setFormData({ ...formData, periods_per_week: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label>Subject Color</Label>
                  <div className="flex gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color_code === color ? 'border-foreground' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color_code: color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires_lab"
                    checked={formData.requires_lab}
                    onCheckedChange={(checked) => setFormData({ ...formData, requires_lab: !!checked })}
                  />
                  <Label htmlFor="requires_lab">Requires Laboratory</Label>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: subject.color_code }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{subject.subject_name}</span>
                    <Badge variant="outline">{subject.subject_code}</Badge>
                    {subject.requires_lab && (
                      <Badge variant="secondary">Lab Required</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subject.periods_per_week} periods/week
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(subject)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(subject.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}