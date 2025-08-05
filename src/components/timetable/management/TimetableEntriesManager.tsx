import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Search, Grid3X3, Save, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

// Comprehensive mock data for demonstration
const mockEntries: TimetableEntry[] = [
  // Monday - Year 10A
  { id: '1', year_group: 'Year 10', form_class: '10A', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', period: 1, day: 'Monday', color: '#3B82F6' },
  { id: '2', year_group: 'Year 10', form_class: '10A', subject: 'English Language', teacher: 'Ms. Smith', room: 'Room 102', period: 2, day: 'Monday', color: '#10B981' },
  { id: '3', year_group: 'Year 10', form_class: '10A', subject: 'Chemistry', teacher: 'Dr. Brown', room: 'Lab 1', period: 4, day: 'Monday', color: '#F59E0B' },
  { id: '4', year_group: 'Year 10', form_class: '10A', subject: 'History', teacher: 'Mr. Davis', room: 'Room 203', period: 5, day: 'Monday', color: '#EF4444' },
  { id: '5', year_group: 'Year 10', form_class: '10A', subject: 'PE', teacher: 'Ms. Wilson', room: 'Gym', period: 6, day: 'Monday', color: '#8B5CF6' },
  
  // Tuesday - Year 10A
  { id: '6', year_group: 'Year 10', form_class: '10A', subject: 'Physics', teacher: 'Mr. Taylor', room: 'Lab 2', period: 1, day: 'Tuesday', color: '#06B6D4' },
  { id: '7', year_group: 'Year 10', form_class: '10A', subject: 'English Literature', teacher: 'Ms. Smith', room: 'Room 102', period: 2, day: 'Tuesday', color: '#10B981' },
  { id: '8', year_group: 'Year 10', form_class: '10A', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', period: 4, day: 'Tuesday', color: '#3B82F6' },
  { id: '9', year_group: 'Year 10', form_class: '10A', subject: 'Geography', teacher: 'Ms. Miller', room: 'Room 204', period: 5, day: 'Tuesday', color: '#84CC16' },
  { id: '10', year_group: 'Year 10', form_class: '10A', subject: 'Art', teacher: 'Mr. Lee', room: 'Art Studio', period: 6, day: 'Tuesday', color: '#F97316' },
  
  // Wednesday - Year 10A
  { id: '11', year_group: 'Year 10', form_class: '10A', subject: 'Biology', teacher: 'Dr. Green', room: 'Lab 3', period: 1, day: 'Wednesday', color: '#22C55E' },
  { id: '12', year_group: 'Year 10', form_class: '10A', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', period: 2, day: 'Wednesday', color: '#3B82F6' },
  { id: '13', year_group: 'Year 10', form_class: '10A', subject: 'French', teacher: 'Mme. Dubois', room: 'Room 105', period: 4, day: 'Wednesday', color: '#EC4899' },
  { id: '14', year_group: 'Year 10', form_class: '10A', subject: 'Computer Science', teacher: 'Mr. Ahmed', room: 'IT Lab', period: 5, day: 'Wednesday', color: '#6366F1' },
  { id: '15', year_group: 'Year 10', form_class: '10A', subject: 'Music', teacher: 'Ms. Garcia', room: 'Music Room', period: 6, day: 'Wednesday', color: '#D946EF' },
  
  // Thursday - Year 10A
  { id: '16', year_group: 'Year 10', form_class: '10A', subject: 'English Language', teacher: 'Ms. Smith', room: 'Room 102', period: 1, day: 'Thursday', color: '#10B981' },
  { id: '17', year_group: 'Year 10', form_class: '10A', subject: 'Chemistry', teacher: 'Dr. Brown', room: 'Lab 1', period: 2, day: 'Thursday', color: '#F59E0B' },
  { id: '18', year_group: 'Year 10', form_class: '10A', subject: 'PE', teacher: 'Ms. Wilson', room: 'Gym', period: 4, day: 'Thursday', color: '#8B5CF6' },
  { id: '19', year_group: 'Year 10', form_class: '10A', subject: 'Religious Studies', teacher: 'Mr. Patel', room: 'Room 206', period: 5, day: 'Thursday', color: '#14B8A6' },
  { id: '20', year_group: 'Year 10', form_class: '10A', subject: 'Drama', teacher: 'Ms. Clark', room: 'Drama Studio', period: 6, day: 'Thursday', color: '#F43F5E' },
  
  // Friday - Year 10A
  { id: '21', year_group: 'Year 10', form_class: '10A', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', period: 1, day: 'Friday', color: '#3B82F6' },
  { id: '22', year_group: 'Year 10', form_class: '10A', subject: 'History', teacher: 'Mr. Davis', room: 'Room 203', period: 2, day: 'Friday', color: '#EF4444' },
  { id: '23', year_group: 'Year 10', form_class: '10A', subject: 'Physics', teacher: 'Mr. Taylor', room: 'Lab 2', period: 4, day: 'Friday', color: '#06B6D4' },
  { id: '24', year_group: 'Year 10', form_class: '10A', subject: 'Design Technology', teacher: 'Mr. Wright', room: 'Workshop', period: 5, day: 'Friday', color: '#A855F7' },
  { id: '25', year_group: 'Year 10', form_class: '10A', subject: 'PSHE', teacher: 'Form Tutor', room: 'Room 10A', period: 6, day: 'Friday', color: '#64748B' },
];

const subjects = ['Mathematics', 'English Language', 'English Literature', 'Chemistry', 'Physics', 'Biology', 'History', 'Geography', 'Art', 'Music', 'PE', 'Computer Science', 'French', 'Spanish', 'Drama', 'Design Technology', 'Religious Studies', 'PSHE'];
const teachers = ['Mr. Johnson', 'Ms. Smith', 'Dr. Brown', 'Mr. Davis', 'Ms. Wilson', 'Mr. Taylor', 'Ms. Miller', 'Mr. Lee', 'Dr. Green', 'Mme. Dubois', 'Mr. Ahmed', 'Ms. Garcia', 'Mr. Patel', 'Ms. Clark', 'Mr. Wright'];
const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105', 'Lab 1', 'Lab 2', 'Lab 3', 'Gym', 'Art Studio', 'Music Room', 'IT Lab', 'Drama Studio', 'Workshop'];
const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];
const formClasses = ['7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B', '13A', '13B'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

const subjectColors = {
  'Mathematics': '#3B82F6',
  'English Language': '#10B981',
  'English Literature': '#10B981',
  'Chemistry': '#F59E0B',
  'Physics': '#06B6D4',
  'Biology': '#22C55E',
  'History': '#EF4444',
  'Geography': '#84CC16',
  'Art': '#F97316',
  'Music': '#D946EF',
  'PE': '#8B5CF6',
  'Computer Science': '#6366F1',
  'French': '#EC4899',
  'Spanish': '#F472B6',
  'Drama': '#F43F5E',
  'Design Technology': '#A855F7',
  'Religious Studies': '#14B8A6',
  'PSHE': '#64748B'
};

export function TimetableEntriesManager() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimetableEntry[]>(mockEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYearGroup, setSelectedYearGroup] = useState<string>('Year 10');
  const [selectedClass, setSelectedClass] = useState<string>('10A');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state
  const [formData, setFormData] = useState({
    year_group: 'Year 10',
    form_class: '10A',
    subject: '',
    teacher: '',
    room: '',
    period: 1,
    day: 'Monday'
  });

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYearGroup = entry.year_group === selectedYearGroup;
    const matchesClass = entry.form_class === selectedClass;
    
    return matchesSearch && matchesYearGroup && matchesClass;
  });

  const handleSubmit = () => {
    const color = subjectColors[formData.subject as keyof typeof subjectColors] || '#64748B';
    
    if (editingEntry) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...editingEntry, ...formData, color }
          : entry
      ));
      toast({
        title: "Entry Updated",
        description: "Timetable entry has been updated successfully.",
      });
    } else {
      const newEntry: TimetableEntry = {
        id: Date.now().toString(),
        ...formData,
        color
      };
      setEntries(prev => [...prev, newEntry]);
      toast({
        title: "Entry Added",
        description: "New timetable entry has been added successfully.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
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
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Timetable entry has been deleted successfully.",
    });
  };

  const resetForm = () => {
    setFormData({
      year_group: selectedYearGroup,
      form_class: selectedClass,
      subject: '',
      teacher: '',
      room: '',
      period: 1,
      day: 'Monday'
    });
    setEditingEntry(null);
  };

  const renderTimetableGrid = () => {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-2 mb-4">
            <div className="font-semibold text-center p-2">Period / Day</div>
            {days.map(day => (
              <div key={day} className="font-semibold text-center p-2 bg-muted rounded">
                {day}
              </div>
            ))}
          </div>
          
          {periods.map(period => (
            <div key={period} className="grid grid-cols-6 gap-2 mb-2">
              <div className="flex items-center justify-center p-2 bg-muted rounded font-medium">
                Period {period}
              </div>
              {days.map(day => {
                const entry = filteredEntries.find(e => e.day === day && e.period === period);
                return (
                  <div key={`${day}-${period}`} className="min-h-[80px] border rounded p-2 relative group">
                    {entry ? (
                      <div 
                        className="h-full w-full rounded p-2 text-white text-xs cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: entry.color }}
                        onClick={() => handleEdit(entry)}
                      >
                        <div className="font-semibold truncate">{entry.subject}</div>
                        <div className="truncate">{entry.teacher}</div>
                        <div className="truncate">{entry.room}</div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(entry.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="h-full w-full border-2 border-dashed border-muted-foreground/20 rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, day, period }));
                          setIsDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manual Timetable Creation
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year Group" />
            </SelectTrigger>
            <SelectContent>
              {yearGroups.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {formClasses.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedYearGroup('Year 10');
              setSelectedClass('10A');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Timetable Content */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
          <TabsContent value="grid">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedYearGroup} - {selectedClass} Timetable
                </h3>
                <Badge variant="secondary">
                  {filteredEntries.length} entries
                </Badge>
              </div>
              
              {renderTimetableGrid()}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Timetable Entries List</h3>
                <Badge variant="secondary">{filteredEntries.length} entries</Badge>
              </div>
              
              <div className="grid gap-4">
                {filteredEntries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-8 rounded"
                          style={{ backgroundColor: entry.color }}
                        />
                        <div>
                          <div className="font-semibold">{entry.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.day}, Period {entry.period} • {entry.teacher} • {entry.room}
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
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year_group">Year Group</Label>
                  <Select 
                    value={formData.year_group} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, year_group: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearGroups.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="form_class">Form Class</Label>
                  <Select 
                    value={formData.form_class} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, form_class: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formClasses.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
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
                <Label htmlFor="teacher">Teacher</Label>
                <Select 
                  value={formData.teacher} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, teacher: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="room">Room</Label>
                <Select 
                  value={formData.room} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, room: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="day">Day</Label>
                  <Select 
                    value={formData.day} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, day: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select 
                    value={formData.period.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, period: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map(period => (
                        <SelectItem key={period} value={period.toString()}>
                          Period {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingEntry ? 'Update' : 'Add'} Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}