import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as z from 'zod';
import { Plus, ExternalLink, FileText, Settings, Edit, Eye } from 'lucide-react';

interface ExamBoard {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  website?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

const boardSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
  full_name: z.string().min(1, 'Full name is required'),
  description: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
});

type BoardFormData = z.infer<typeof boardSchema>;

export function ExamBoardManager() {
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<ExamBoard | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

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

  const editForm = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
  });

  // Fetch exam boards from database
  const fetchExamBoards = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('exam_boards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setExamBoards(data || []);
    } catch (error) {
      console.error('Error fetching exam boards:', error);
      toast({
        title: "Error",
        description: "Failed to load exam boards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamBoards();
  }, []);

  const filteredBoards = examBoards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: BoardFormData) => {
    try {
      const { error } = await supabase
        .from('exam_boards')
        .insert([{
          name: data.name,
          full_name: data.full_name,
          description: data.description || null,
          website: data.website || null,
          contact_email: data.contact_email || null,
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Exam board added successfully",
      });

      setShowAddDialog(false);
      form.reset();
      fetchExamBoards(); // Refresh the list
    } catch (error) {
      console.error('Error adding exam board:', error);
      toast({
        title: "Error",
        description: "Failed to add exam board",
        variant: "destructive",
      });
    }
  };

  const onEdit = async (data: BoardFormData) => {
    if (!selectedBoard) return;
    
    try {
      const { error } = await supabase
        .from('exam_boards')
        .update({
          name: data.name,
          full_name: data.full_name,
          description: data.description || null,
          website: data.website || null,
          contact_email: data.contact_email || null,
        })
        .eq('id', selectedBoard.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Exam board updated successfully",
      });

      setShowEditDialog(false);
      setSelectedBoard(null);
      editForm.reset();
      fetchExamBoards(); // Refresh the list
    } catch (error) {
      console.error('Error updating exam board:', error);
      toast({
        title: "Error",
        description: "Failed to update exam board",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (board: ExamBoard) => {
    setSelectedBoard(board);
    editForm.reset({
      name: board.name,
      full_name: board.full_name,
      description: board.description || '',
      website: board.website || '',
      contact_email: board.contact_email || '',
    });
    setShowEditDialog(true);
  };

  const handleView = (board: ExamBoard) => {
    setSelectedBoard(board);
    setShowViewDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading exam boards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Exam Board Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage exam boards and their associated qualifications
              </p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exam Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Exam Board</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board Code/Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., AQA" {...field} />
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
                            <Input placeholder="e.g., Assessment and Qualifications Alliance" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Brief description of the exam board..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
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
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@examboard.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Board</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Search exam boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Exam Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.map((board) => (
          <Card key={board.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{board.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{board.full_name}</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{board.description || 'No description available'}</p>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  {board.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={board.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleView(board)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(board)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Board Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Board</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoards.map((board) => (
                  <TableRow key={board.id}>
                    <TableCell className="font-medium">{board.name}</TableCell>
                    <TableCell>{board.full_name}</TableCell>
                    <TableCell>{board.contact_email || '-'}</TableCell>
                    <TableCell>{new Date(board.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(board)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleView(board)}>
                          View Details
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

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Board Details</DialogTitle>
          </DialogHeader>
          {selectedBoard && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{selectedBoard.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedBoard.full_name}</p>
              </div>
              {selectedBoard.description && (
                <div>
                  <h5 className="font-medium">Description</h5>
                  <p className="text-sm">{selectedBoard.description}</p>
                </div>
              )}
              {selectedBoard.website && (
                <div>
                  <h5 className="font-medium">Website</h5>
                  <a href={selectedBoard.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {selectedBoard.website}
                  </a>
                </div>
              )}
              {selectedBoard.contact_email && (
                <div>
                  <h5 className="font-medium">Contact Email</h5>
                  <p className="text-sm">{selectedBoard.contact_email}</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam Board</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Code/Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AQA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Assessment and Qualifications Alliance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of the exam board..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@examboard.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Board</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}