import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ApplicationNotesProps {
  applicationId: string;
}

interface Note {
  id: string;
  content: string;
  author_name: string;
  author_role: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  category: string;
  author_id: string;
}

export function ApplicationNotes({ applicationId }: ApplicationNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('General');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    'General', 'Academic', 'SEN', 'Interview', 'Administrative', 'Safeguarding', 'Medical'
  ];

  useEffect(() => {
    fetchNotes();
  }, [applicationId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_notes')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load application notes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;

    try {
      setSaving(true);
      
      // Get user profile for author name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single();
      
      const authorName = profile 
        ? `${profile.first_name} ${profile.last_name}`.trim() 
        : user.email?.split('@')[0] || 'Unknown User';

      const { data, error } = await supabase
        .from('application_notes')
        .insert([{
          application_id: applicationId,
          content: newNote.trim(),
          author_id: user.id,
          author_name: authorName,
          author_role: 'Staff', // You might want to get this from user roles
          category: newNoteCategory,
          is_private: isPrivate
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the new note to the list
      setNotes(prev => [data, ...prev]);
      
      // Reset form
      setNewNote('');
      setNewNoteCategory('General');
      setIsPrivate(false);
      setIsAddingNote(false);

      toast({
        title: "Success",
        description: "Note saved successfully"
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('application_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Success", 
        description: "Note deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-slate-100 text-slate-700 border-slate-200',
      'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
      'SEN': 'bg-purple-100 text-purple-700 border-purple-200',
      'Interview': 'bg-green-100 text-green-700 border-green-200',
      'Administrative': 'bg-amber-100 text-amber-700 border-amber-200',
      'Safeguarding': 'bg-red-100 text-red-700 border-red-200',
      'Medical': 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading notes...</div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{notes.filter(n => n.is_private).length}</p>
              </div>
              <EyeOff className="h-6 w-6 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Contributors</p>
                <p className="text-2xl font-bold">{new Set(notes.map(n => n.author_name)).size}</p>
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
          <CardContent className="border-t space-y-4">
            <Textarea
              placeholder="Add your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={newNoteCategory} onValueChange={setNewNoteCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-50">
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="private-note"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="private-note" className="text-sm">
                  Private note (restricted access)
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleAddNote} 
                disabled={!newNote.trim() || saving}
              >
                {saving ? 'Saving...' : 'Save Note'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote('');
                  setNewNoteCategory('General');
                  setIsPrivate(false);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
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
                      {note.author_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{note.author_name}</p>
                    <p className="text-sm text-muted-foreground">{note.author_role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(note.category)}>
                    {note.category}
                  </Badge>
                  {note.is_private && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-foreground leading-relaxed">{note.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{format(new Date(note.created_at), 'dd MMM yyyy, HH:mm')}</span>
                {note.updated_at !== note.created_at && (
                  <span className="italic">Updated {format(new Date(note.updated_at), 'dd MMM yyyy, HH:mm')}</span>
                )}
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