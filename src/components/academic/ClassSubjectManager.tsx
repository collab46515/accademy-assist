import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRBAC } from '@/hooks/useRBAC';
import { Plus, Edit, Trash2, GraduationCap, BookOpen, Users, School } from 'lucide-react';

interface Class {
  id: string;
  class_name: string;
  year_group: string;
  capacity: number;
  form_tutor_id?: string;
  form_tutor_name?: string;
  room?: string;
  is_active: boolean;
  created_at: string;
}

interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  department?: string;
  year_groups: string[];
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface TeacherAssignment {
  id: string;
  teacher_id: string;
  teacher_name: string;
  class_id?: string;
  class_name?: string;
  subject_id?: string;
  subject_name?: string;
  year_group: string;
  assignment_type: 'class_teacher' | 'subject_teacher';
  is_active: boolean;
}

export function ClassSubjectManager() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  
  // Dialog states
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { currentSchool } = useRBAC();

  useEffect(() => {
    if (currentSchool) {
      fetchData();
    }
  }, [currentSchool]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
  // For real implementation, we fetch from subjects database
  const { data: subjectsData } = await supabase
    .from('subjects')
    .select('*')
    .eq('school_id', currentSchool.id);

  const subjectsList = subjectsData || [];
      // In a real implementation, these would be actual Supabase queries
      
      setClasses([
        {
          id: '1',
          class_name: '7A',
          year_group: 'Year 7',
          capacity: 30,
          form_tutor_name: 'Ms. Johnson',
          room: 'Room 101',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          class_name: '8B',
          year_group: 'Year 8',
          capacity: 28,
          form_tutor_name: 'Mr. Smith',
          room: 'Room 205',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]);

      setSubjects([
        {
          id: '1',
          subject_name: 'Mathematics',
          subject_code: 'MATH',
          department: 'Sciences',
          year_groups: ['Year 7', 'Year 8', 'Year 9'],
          description: 'Core mathematics curriculum',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          subject_name: 'English Language',
          subject_code: 'ENG',
          department: 'Languages',
          year_groups: ['Year 7', 'Year 8', 'Year 9', 'Year 10'],
          description: 'English language and literature',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]);

      setAssignments([
        {
          id: '1',
          teacher_id: 'teacher1',
          teacher_name: 'Ms. Johnson',
          class_id: '1',
          class_name: '7A',
          year_group: 'Year 7',
          assignment_type: 'class_teacher',
          is_active: true
        },
        {
          id: '2',
          teacher_id: 'teacher2',
          teacher_name: 'Mr. Smith',
          subject_id: '1',
          subject_name: 'Mathematics',
          year_group: 'Year 8',
          assignment_type: 'subject_teacher',
          is_active: true
        }
      ]);

      // Fetch teachers
      const { data: teacherProfiles } = await supabase
        .from('profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email
        `)
        .in('user_id', 
          Array.from(new Set([
            'teacher1', 'teacher2', 'teacher3'
          ]))
        );

      setTeachers(teacherProfiles || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load class and subject data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClass: Class = {
      id: Date.now().toString(),
      class_name: formData.get('className') as string,
      year_group: formData.get('yearGroup') as string,
      capacity: parseInt(formData.get('capacity') as string),
      room: formData.get('room') as string,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setClasses(prev => [...prev, newClass]);
    setClassDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Class created successfully"
    });
  };

  const handleCreateSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const yearGroups = (formData.get('yearGroups') as string).split(',').map(y => y.trim());
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      subject_name: formData.get('subjectName') as string,
      subject_code: formData.get('subjectCode') as string,
      department: formData.get('department') as string,
      year_groups: yearGroups,
      description: formData.get('description') as string,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setSubjects(prev => [...prev, newSubject]);
    setSubjectDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Subject created successfully"
    });
  };

  const handleCreateAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assignmentType = formData.get('assignmentType') as 'class_teacher' | 'subject_teacher';
    
    const newAssignment: TeacherAssignment = {
      id: Date.now().toString(),
      teacher_id: formData.get('teacherId') as string,
      teacher_name: teachers.find(t => t.user_id === formData.get('teacherId'))?.first_name + ' ' + 
                   teachers.find(t => t.user_id === formData.get('teacherId'))?.last_name || 'Unknown',
      year_group: formData.get('yearGroup') as string,
      assignment_type: assignmentType,
      is_active: true,
      ...(assignmentType === 'class_teacher' ? {
        class_id: formData.get('classId') as string,
        class_name: classes.find(c => c.id === formData.get('classId'))?.class_name
      } : {
        subject_id: formData.get('subjectId') as string,
        subject_name: subjects.find(s => s.id === formData.get('subjectId'))?.subject_name
      })
    };

    setAssignments(prev => [...prev, newAssignment]);
    setAssignmentDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Teacher assignment created successfully"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Academic Management</h2>
          <p className="text-muted-foreground">
            Manage classes, subjects, and teacher assignments
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Classes ({classes.length})
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects ({subjects.length})
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teacher Assignments ({assignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Classes</h3>
            <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                  <DialogDescription>
                    Add a new class to the school system
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateClass} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input id="className" name="className" placeholder="e.g., 7A" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearGroup">Year Group</Label>
                      <Select name="yearGroup" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Year 7">Year 7</SelectItem>
                          <SelectItem value="Year 8">Year 8</SelectItem>
                          <SelectItem value="Year 9">Year 9</SelectItem>
                          <SelectItem value="Year 10">Year 10</SelectItem>
                          <SelectItem value="Year 11">Year 11</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input id="capacity" name="capacity" type="number" placeholder="30" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room">Room</Label>
                      <Input id="room" name="room" placeholder="e.g., Room 101" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Class</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Year Group</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Form Tutor</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.class_name}</TableCell>
                      <TableCell>{cls.year_group}</TableCell>
                      <TableCell>{cls.capacity}</TableCell>
                      <TableCell>{cls.form_tutor_name || 'Not assigned'}</TableCell>
                      <TableCell>{cls.room || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={cls.is_active ? "default" : "secondary"}>
                          {cls.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Subjects</h3>
            <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Subject</DialogTitle>
                  <DialogDescription>
                    Add a new subject to the curriculum
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSubject} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subjectName">Subject Name</Label>
                      <Input id="subjectName" name="subjectName" placeholder="e.g., Mathematics" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjectCode">Subject Code</Label>
                      <Input id="subjectCode" name="subjectCode" placeholder="e.g., MATH" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" placeholder="e.g., Sciences" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearGroups">Year Groups (comma-separated)</Label>
                    <Input id="yearGroups" name="yearGroups" placeholder="e.g., Year 7, Year 8, Year 9" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Brief description" />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Subject</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year Groups</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.subject_name}</TableCell>
                      <TableCell>{subject.subject_code}</TableCell>
                      <TableCell>{subject.department || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.year_groups.map((year, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {year}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.is_active ? "default" : "secondary"}>
                          {subject.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Teacher Assignments</h3>
            <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Teacher Assignment</DialogTitle>
                  <DialogDescription>
                    Assign a teacher to a class or subject
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherId">Teacher</Label>
                    <Select name="teacherId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.user_id} value={teacher.user_id}>
                            {teacher.first_name} {teacher.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assignmentType">Assignment Type</Label>
                    <Select name="assignmentType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class_teacher">Class Teacher</SelectItem>
                        <SelectItem value="subject_teacher">Subject Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearGroup">Year Group</Label>
                    <Select name="yearGroup" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Year 7">Year 7</SelectItem>
                        <SelectItem value="Year 8">Year 8</SelectItem>
                        <SelectItem value="Year 9">Year 9</SelectItem>
                        <SelectItem value="Year 10">Year 10</SelectItem>
                        <SelectItem value="Year 11">Year 11</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classId">Class (for Class Teacher)</Label>
                    <Select name="classId">
                      <SelectTrigger>
                        <SelectValue placeholder="Select class (if class teacher)" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.class_name} - {cls.year_group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjectId">Subject (for Subject Teacher)</Label>
                    <Select name="subjectId">
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject (if subject teacher)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.subject_name} ({subject.subject_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="submit">Create Assignment</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Year Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.teacher_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {assignment.assignment_type === 'class_teacher' ? 'Class Teacher' : 'Subject Teacher'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.assignment_type === 'class_teacher' 
                          ? assignment.class_name 
                          : assignment.subject_name}
                      </TableCell>
                      <TableCell>{assignment.year_group}</TableCell>
                      <TableCell>
                        <Badge variant={assignment.is_active ? "default" : "secondary"}>
                          {assignment.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}