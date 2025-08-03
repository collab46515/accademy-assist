import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Plus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ApplicationNotesProps {
  applicationId: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  isPrivate: boolean;
  category: string;
}

export function ApplicationNotes({ applicationId }: ApplicationNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Mock notes data
  const notes: Note[] = [
    {
      id: '1',
      content: 'Student shows strong academic potential based on previous school reports. Recommend for assessment.',
      author: 'Sarah Wilson',
      authorRole: 'Admissions Officer',
      createdAt: '2024-01-12T10:30:00Z',
      isPrivate: false,
      category: 'Academic'
    },
    {
      id: '2',
      content: 'Parent mentioned specific learning support needs during phone call. Flagged for SENCO review.',
      author: 'David Brown',
      authorRole: 'Admin',
      createdAt: '2024-01-11T14:15:00Z',
      isPrivate: true,
      category: 'SEN'
    },
    {
      id: '3',
      content: 'Excellent interview performance. Student demonstrated maturity and strong communication skills.',
      author: 'Emma Clarke',
      authorRole: 'Head of Year',
      createdAt: '2024-01-10T16:45:00Z',
      isPrivate: false,
      category: 'Interview'
    }
  ];

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In real implementation, this would save to database
      console.log('Adding note:', newNote);
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
      'SEN': 'bg-purple-100 text-purple-700 border-purple-200',
      'Interview': 'bg-green-100 text-green-700 border-green-200',
      'Administrative': 'bg-amber-100 text-amber-700 border-amber-200',
      'Safeguarding': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Notes Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <MessageSquare className="h-6 w-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Private Notes</p>
                <p className="text-2xl font-bold">{notes.filter(n => n.isPrivate).length}</p>
              </div>
              <Edit2 className="h-6 w-6 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Contributors</p>
                <p className="text-2xl font-bold">{new Set(notes.map(n => n.author)).size}</p>
              </div>
              <Plus className="h-6 w-6 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Note */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Application Notes</CardTitle>
            {!isAddingNote && (
              <Button onClick={() => setIsAddingNote(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            )}
          </div>
        </CardHeader>
        
        {isAddingNote && (
          <CardContent className="border-t">
            <div className="space-y-4">
              <Textarea
                placeholder="Add your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex items-center gap-3">
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Save Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="text-white text-sm font-semibold">
                      {note.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{note.author}</p>
                    <p className="text-sm text-muted-foreground">{note.authorRole}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(note.category)}>
                    {note.category}
                  </Badge>
                  {note.isPrivate && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Private
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{note.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{format(new Date(note.createdAt), 'dd MMM yyyy, HH:mm')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking important information about this application
            </p>
            <Button onClick={() => setIsAddingNote(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Note
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}