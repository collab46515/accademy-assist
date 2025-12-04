import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Search, Edit, Trash, ExternalLink, Download, Upload, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExamBoard {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  website: string | null;
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
}

const boardSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
  full_name: z.string().min(1, 'Full name is required'),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  contact_email: z.string().email().optional().or(z.literal('')),
});

type BoardFormData = z.infer<typeof boardSchema>;

export function ExamBoardsMasterData() {
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<ExamBoard | null>(null);

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
      full_name: '',
      description: '',
      website: '',
      contact_email: '',
    },
  });

  useEffect(() => {
    fetchExamBoards();
  }, []);

  const fetchExamBoards = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_boards')
        .select('*')
        .order('name');

      if (error) throw error;
      setExamBoards(data || []);
    } catch (error) {
      console.error('Error fetching exam boards:', error);
      toast.error('Failed to load exam boards');
    } finally {
      setLoading(false);
    }
  };

  const filteredBoards = examBoards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: BoardFormData) => {
    try {
      if (editingBoard) {
        const { error } = await supabase
          .from('exam_boards')
          .update({
            name: data.name,
            full_name: data.full_name,
            description: data.description || null,
            website: data.website || null,
            contact_email: data.contact_email || null,
          })
          .eq('id', editingBoard.id);

        if (error) throw error;
        toast.success('Exam board updated successfully');
      } else {
        const { error } = await supabase
          .from('exam_boards')
          .insert({
            name: data.name,
            full_name: data.full_name,
            description: data.description || null,
            website: data.website || null,
            contact_email: data.contact_email || null,
            is_active: true,
          });

        if (error) throw error;
        toast.success('Exam board created successfully');
      }

      setDialogOpen(false);
      setEditingBoard(null);
      form.reset();
      fetchExamBoards();
    } catch (error) {
      console.error('Error saving exam board:', error);
      toast.error('Failed to save exam board');
    }
  };

  const handleEdit = (board: ExamBoard) => {
    setEditingBoard(board);
    form.reset({
      name: board.name,
      full_name: board.full_name,
      description: board.description || '',
      website: board.website || '',
      contact_email: board.contact_email || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam board?')) return;

    try {
      const { error } = await supabase
        .from('exam_boards')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Exam board deleted successfully');
      fetchExamBoards();
    } catch (error) {
      console.error('Error deleting exam board:', error);
      toast.error('Failed to delete exam board');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Full Name', 'Description', 'Website', 'Contact Email', 'Status'];
    const csvData = filteredBoards.map(board => [
      board.name,
      board.full_name,
      board.description || '',
      board.website || '',
      board.contact_email || '',
      board.is_active ? 'Active' : 'Inactive'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-boards.csv';
    link.click();
    toast.success('Exam boards exported successfully');
  };

  const handleDownloadTemplate = () => {
    const template = [
      'Name,Full Name,Description,Website,Contact Email',
      'CBSE,Central Board of Secondary Education,National education board for public and private schools,https://cbse.gov.in,info@cbse.gov.in',
      'ICSE,Indian Certificate of Secondary Education,Private board of school education,https://cisce.org,council@cisce.org'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-boards-template.csv';
    link.click();
    toast.success('Template downloaded');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

        const records = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          return {
            name: values[headers.indexOf('name')] || '',
            full_name: values[headers.indexOf('full name')] || values[headers.indexOf('full_name')] || '',
            description: values[headers.indexOf('description')] || null,
            website: values[headers.indexOf('website')] || null,
            contact_email: values[headers.indexOf('contact email')] || values[headers.indexOf('contact_email')] || null,
            is_active: true,
          };
        }).filter(r => r.name && r.full_name);

        if (records.length === 0) {
          toast.error('No valid records found in file');
          return;
        }

        const { error } = await supabase.from('exam_boards').insert(records);
        if (error) throw error;

        toast.success(`Imported ${records.length} exam boards`);
        fetchExamBoards();
      } catch (error) {
        console.error('Error importing:', error);
        toast.error('Failed to import exam boards');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading exam boards...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Exam Boards Management
            </CardTitle>
            <CardDescription>
              Manage examination boards used across the school
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exam boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingBoard(null);
                form.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exam Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingBoard ? 'Edit' : 'Add'} Exam Board</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board Name (Short)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CBSE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Central Board of Secondary Education" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Brief description of the exam board..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@board.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingBoard ? 'Update' : 'Add'} Exam Board</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredBoards.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exam boards found</h3>
            <p className="text-muted-foreground">Create your first exam board to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Board Name</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBoards.map((board) => (
                <TableRow key={board.id}>
                  <TableCell className="font-medium">{board.name}</TableCell>
                  <TableCell>
                    <div>
                      <p>{board.full_name}</p>
                      {board.description && (
                        <p className="text-xs text-muted-foreground">{board.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {board.website ? (
                      <a 
                        href={board.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{board.contact_email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={board.is_active ? 'default' : 'secondary'}>
                      {board.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(board)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(board.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
