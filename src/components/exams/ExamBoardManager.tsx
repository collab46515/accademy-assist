import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ExamBoard {
  id: string;
  name: string;
  code: string;
  website: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  subjects: string[];
  is_active: boolean;
  created_at: string;
}

export function ExamBoardManager() {
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([
    {
      id: '1',
      name: 'Cambridge Assessment International Education',
      code: 'CAIE',
      website: 'https://www.cambridgeinternational.org',
      contact_email: 'info@cambridgeinternational.org',
      contact_phone: '+44 1223 553554',
      description: 'Cambridge International provides learners with excellent preparation for university, employment and life.',
      subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Edexcel/Pearson',
      code: 'EDEXCEL',
      website: 'https://qualifications.pearson.com',
      contact_email: 'support@pearson.com',
      contact_phone: '+44 190 484 7750',
      description: 'Edexcel is a leading provider of academic and vocational qualifications globally.',
      subjects: ['Mathematics', 'English Literature', 'Physics', 'Chemistry', 'Biology'],
      is_active: true,
      created_at: '2024-01-02T00:00:00Z'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<ExamBoard | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    website: '',
    contact_email: '',
    contact_phone: '',
    description: '',
    subjects: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      website: '',
      contact_email: '',
      contact_phone: '',
      description: '',
      subjects: ''
    });
    setEditingBoard(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (board: ExamBoard) => {
    setEditingBoard(board);
    setFormData({
      name: board.name,
      code: board.code,
      website: board.website,
      contact_email: board.contact_email,
      contact_phone: board.contact_phone,
      description: board.description,
      subjects: board.subjects.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      toast.error('Please fill in required fields');
      return;
    }

    const boardData: ExamBoard = {
      id: editingBoard?.id || Date.now().toString(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      website: formData.website,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      description: formData.description,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
      is_active: true,
      created_at: editingBoard?.created_at || new Date().toISOString()
    };

    if (editingBoard) {
      setExamBoards(prev => prev.map(board => 
        board.id === editingBoard.id ? boardData : board
      ));
      toast.success('Exam board updated successfully');
    } else {
      setExamBoards(prev => [...prev, boardData]);
      toast.success('Exam board added successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exam board?')) {
      setExamBoards(prev => prev.filter(board => board.id !== id));
      toast.success('Exam board deleted successfully');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Exam Board Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exam Board
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBoard ? 'Edit Exam Board' : 'Add New Exam Board'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Board Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Cambridge Assessment"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Board Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., CAIE"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contact@examboard.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="+44 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                  <Input
                    id="subjects"
                    value={formData.subjects}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjects: e.target.value }))}
                    placeholder="Mathematics, English, Science"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the exam board"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingBoard ? 'Update' : 'Add'} Exam Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examBoards.map((board) => (
                <TableRow key={board.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{board.name}</div>
                      {board.website && (
                        <a 
                          href={board.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Website
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{board.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {board.subjects.slice(0, 3).map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {board.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{board.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {board.contact_email && (
                        <div>{board.contact_email}</div>
                      )}
                      {board.contact_phone && (
                        <div className="text-muted-foreground">{board.contact_phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={board.is_active ? "default" : "secondary"}>
                      {board.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(board)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(board.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}