import React, { useState } from 'react';
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
import * as z from 'zod';
import { Plus, ExternalLink, FileText, Settings } from 'lucide-react';

// Demo data for exam boards
const examBoards = [
  {
    id: '1',
    name: 'AQA',
    full_name: 'Assessment and Qualifications Alliance',
    description: 'Leading UK exam board offering GCSEs, A-levels, and vocational qualifications',
    website: 'https://www.aqa.org.uk',
    contact_email: 'info@aqa.org.uk',
    subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography'],
    active_exams: 12,
    last_updated: '2024-01-15'
  },
  {
    id: '2',
    name: 'OCR',
    full_name: 'Oxford Cambridge and RSA Examinations',
    description: 'Established exam board providing innovative qualifications',
    website: 'https://www.ocr.org.uk',
    contact_email: 'general.qualifications@ocr.org.uk',
    subjects: ['Computer Science', 'Business Studies', 'Art & Design'],
    active_exams: 8,
    last_updated: '2024-01-10'
  },
  {
    id: '3',
    name: 'Edexcel',
    full_name: 'Pearson Edexcel',
    description: 'Part of Pearson, offering GCSE, A-level and BTEC qualifications',
    website: 'https://qualifications.pearson.com',
    contact_email: 'edexcel@pearson.com',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    active_exams: 15,
    last_updated: '2024-01-20'
  }
];

const boardSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
  full_name: z.string().min(1, 'Full name is required'),
  description: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contact_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
});

type BoardFormData = z.infer<typeof boardSchema>;

export function ExamBoardManager() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredBoards = examBoards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: BoardFormData) => {
    console.log('Adding exam board:', data);
    // In a real app, this would save to the database
    setShowAddDialog(false);
    form.reset();
  };

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
                <Badge variant="outline">{board.active_exams} exams</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{board.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {board.subjects.slice(0, 3).map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {board.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{board.subjects.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

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
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
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
                  <TableHead>Active Exams</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoards.map((board) => (
                  <TableRow key={board.id}>
                    <TableCell className="font-medium">{board.name}</TableCell>
                    <TableCell>{board.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{board.active_exams}</Badge>
                    </TableCell>
                    <TableCell>{board.subjects.length} subjects</TableCell>
                    <TableCell>{board.last_updated}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
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
    </div>
  );
}