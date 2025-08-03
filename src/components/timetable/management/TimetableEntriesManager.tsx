import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TimetableEntry {
  id: string;
  year_group: string;
  form_class: string;
  subject: string;
  teacher: string;
  room: string;
  period: number;
  day: string;
  color: string;
}

const mockEntries: TimetableEntry[] = [
  {
    id: '1',
    year_group: 'Year 10',
    form_class: '10A',
    subject: 'Mathematics',
    teacher: 'Mr. Johnson',
    room: 'Room 101',
    period: 1,
    day: 'Monday',
    color: '#3B82F6'
  },
  {
    id: '2',
    year_group: 'Year 10',
    form_class: '10A',
    subject: 'English Language',
    teacher: 'Ms. Smith',
    room: 'Room 102',
    period: 2,
    day: 'Monday',
    color: '#10B981'
  },
  {
    id: '3',
    year_group: 'Year 11',
    form_class: '11B',
    subject: 'Physics',
    teacher: 'Dr. Brown',
    room: 'Physics Lab',
    period: 3,
    day: 'Tuesday',
    color: '#EF4444'
  },
  {
    id: '4',
    year_group: 'Year 9',
    form_class: '9A',
    subject: 'French',
    teacher: 'Mme. Dubois',
    room: 'Room 201',
    period: 1,
    day: 'Wednesday',
    color: '#F59E0B'
  }
];

export function TimetableEntriesManager() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimetableEntry[]>(mockEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const [formData, setFormData] = useState({
    year_group: '',
    form_class: '',
    subject: '',
    teacher: '',
    room: '',
    period: 1,
    day: 'Monday'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const classes = ['7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B', '13A', '13B'];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.form_class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || entry.form_class === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleSave = () => {
    if (editingEntry) {
      setEntries(entries.map(e => 
        e.id === editingEntry.id 
          ? { ...editingEntry, ...formData, color: getSubjectColor(formData.subject) }
          : e
      ));
      toast({ title: "Timetable entry updated successfully" });
    } else {
      const newEntry: TimetableEntry = {
        id: Math.random().toString(),
        ...formData,
        color: getSubjectColor(formData.subject)
      };
      setEntries([...entries, newEntry]);
      toast({ title: "Timetable entry added successfully" });
    }
    
    setIsOpen(false);
    setEditingEntry(null);
    setFormData({
      year_group: '',
      form_class: '',
      subject: '',
      teacher: '',
      room: '',
      period: 1,
      day: 'Monday'
    });
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      year_group: entry.year_group,
      form_class: entry.form_class,
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room,
      period: entry.period,
      day: entry.day
    });
    setIsOpen(true);
  };

  const handleDelete = (entryId: string) => {
    setEntries(entries.filter(e => e.id !== entryId));
    toast({ title: "Timetable entry deleted successfully" });
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': '#3B82F6',
      'English Language': '#10B981',
      'English Literature': '#059669',
      'Physics': '#EF4444',
      'Chemistry': '#F59E0B',
      'Biology': '#22C55E',
      'History': '#F97316',
      'Geography': '#06B6D4',
      'French': '#EF4444',
      'Spanish': '#F59E0B',
      'German': '#6B7280',
      'Art & Design': '#EC4899',
      'Music': '#A855F7',
      'Physical Education': '#22C55E',
      'Computing': '#6366F1',
      'Design & Technology': '#84CC16',
      'Religious Education': '#8B5CF6'
    };
    return colors[subject] || '#6B7280';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Timetable Entries
          </span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingEntry(null);
                setFormData({
                  year_group: '',
                  form_class: '',
                  subject: '',
                  teacher: '',
                  room: '',
                  period: 1,
                  day: 'Monday'
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Year Group</Label>
                    <Input
                      value={formData.year_group}
                      onChange={(e) => setFormData({ ...formData, year_group: e.target.value })}
                      placeholder="Year 8"
                    />
                  </div>
                  <div>
                    <Label>Form Class</Label>
                    <Select
                      value={formData.form_class}
                      onValueChange={(value) => setFormData({ ...formData, form_class: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <Label>Teacher</Label>
                  <Input
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder="Mr. Johnson"
                  />
                </div>
                <div>
                  <Label>Room</Label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Room 101"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Day</Label>
                    <Select
                      value={formData.day}
                      onValueChange={(value) => setFormData({ ...formData, day: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Period</Label>
                    <Select
                      value={formData.period.toString()}
                      onValueChange={(value) => setFormData({ ...formData, period: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period} value={period.toString()}>
                            Period {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingEntry ? 'Update Entry' : 'Add Entry'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject, teacher, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.subject}</span>
                    <Badge variant="outline">{entry.form_class}</Badge>
                    <Badge variant="secondary">{entry.day}</Badge>
                    <Badge variant="secondary">P{entry.period}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.teacher} • {entry.room}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(entry)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No timetable entries found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}