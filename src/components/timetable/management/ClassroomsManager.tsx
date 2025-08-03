import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Classroom {
  id: string;
  room_name: string;
  room_type: string;
  capacity: number;
}

const roomTypes = [
  'classroom',
  'laboratory',
  'computer_lab',
  'workshop',
  'art_room', 
  'music_room',
  'drama_studio',
  'gym',
  'library',
  'auditorium',
  'common_room'
];

export function ClassroomsManager() {
  const { toast } = useToast();
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: '1',
      room_name: 'Room 101',
      room_type: 'classroom',
      capacity: 30
    },
    {
      id: '2',
      room_name: 'Biology Lab',
      room_type: 'laboratory',
      capacity: 24
    },
    {
      id: '3',
      room_name: 'Computer Suite 1',
      room_type: 'computer_lab',
      capacity: 20
    },
    {
      id: '4',
      room_name: 'Main Gym',
      room_type: 'gym',
      capacity: 60
    },
    {
      id: '5',
      room_name: 'DT Workshop',
      room_type: 'workshop',
      capacity: 16
    },
    {
      id: '6',
      room_name: 'Drama Studio',
      room_type: 'drama_studio',
      capacity: 30
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const [formData, setFormData] = useState({
    room_name: '',
    room_type: 'classroom',
    capacity: 30
  });

  const handleSave = () => {
    if (editingClassroom) {
      setClassrooms(classrooms.map(c => 
        c.id === editingClassroom.id 
          ? { ...editingClassroom, ...formData }
          : c
      ));
      toast({ title: "Classroom updated successfully" });
    } else {
      const newClassroom: Classroom = {
        id: Math.random().toString(),
        ...formData
      };
      setClassrooms([...classrooms, newClassroom]);
      toast({ title: "Classroom added successfully" });
    }
    
    setIsOpen(false);
    setEditingClassroom(null);
    setFormData({
      room_name: '',
      room_type: 'classroom',
      capacity: 30
    });
  };

  const handleEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      room_name: classroom.room_name,
      room_type: classroom.room_type,
      capacity: classroom.capacity
    });
    setIsOpen(true);
  };

  const handleDelete = (classroomId: string) => {
    setClassrooms(classrooms.filter(c => c.id !== classroomId));
    toast({ title: "Classroom deleted successfully" });
  };

  const getRoomTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoomTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      classroom: 'default',
      laboratory: 'destructive',
      computer_lab: 'secondary',
      workshop: 'outline',
      art_room: 'secondary',
      music_room: 'secondary', 
      drama_studio: 'secondary',
      gym: 'outline',
      library: 'secondary',
      auditorium: 'outline',
      common_room: 'secondary'
    };
    return colors[type] || 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Manage Classrooms
          </span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingClassroom(null);
                setFormData({
                  room_name: '',
                  room_type: 'classroom',
                  capacity: 30
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Classroom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room_name">Room Name</Label>
                  <Input
                    id="room_name"
                    value={formData.room_name}
                    onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                    placeholder="e.g., Room 101, Science Lab 1"
                  />
                </div>
                <div>
                  <Label htmlFor="room_type">Room Type</Label>
                  <Select
                    value={formData.room_type}
                    onValueChange={(value) => setFormData({ ...formData, room_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getRoomTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingClassroom ? 'Update Classroom' : 'Add Classroom'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classrooms.map((classroom) => (
            <div key={classroom.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{classroom.room_name}</span>
                    <Badge variant={getRoomTypeColor(classroom.room_type) as any}>
                      {getRoomTypeLabel(classroom.room_type)}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Capacity: {classroom.capacity} students
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(classroom)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(classroom.id)}
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