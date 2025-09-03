import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TimetableGrid } from './TimetableGrid';
import { useTimetableData } from '@/hooks/useTimetableData';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  MapPin,
  Download,
  RefreshCw,
  Users,
  Bell,
  FileText
} from 'lucide-react';

interface TeacherSchedule {
  teacher_id: string;
  teacher_name: string;
  total_periods: number;
  subjects: string[];
  classes: string[];
}

export function TeacherTimetableView() {
  const { currentSchool, hasRole } = useRBAC();
  const { 
    fetchTimetableForClass, 
    getCurrentPeriod, 
    getNextPeriod,
    periods,
    timetableEntries,
    loading 
  } = useTimetableData();
  
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');
  const [viewMode, setViewMode] = useState<'schedule' | 'classes'>('schedule');
  const [teachers, setTeachers] = useState<TeacherSchedule[]>([]);

  // Fetch teachers from the school
  useEffect(() => {
    const fetchTeachers = async () => {
      if (!currentSchool) return;

      try {
        console.log('Fetching teachers for school:', currentSchool.id);
        
        // Mock teacher data for now
        const mockTeachers: TeacherSchedule[] = [
          {
            teacher_id: 'teacher-1',
            teacher_name: 'John Smith',
            total_periods: 15,
            subjects: ['Mathematics', 'Statistics'],
            classes: ['7A', '8B', '9C', '10A']
          },
          {
            teacher_id: 'teacher-2', 
            teacher_name: 'Sarah Wilson',
            total_periods: 12,
            subjects: ['English', 'Literature'],
            classes: ['7B', '8A', '9A', '10A']
          },
          {
            teacher_id: 'teacher-3',
            teacher_name: 'Mike Johnson',
            total_periods: 18,
            subjects: ['Science', 'Physics'],
            classes: ['8A', '9B', '10A']
          }
        ];

        // Add current user if they're a teacher
        if (hasRole('teacher')) {
          mockTeachers.unshift({
            teacher_id: 'current-user',
            teacher_name: 'Your Schedule',
            total_periods: 0,
            subjects: ['Mathematics', 'Science'],
            classes: ['7A', '7B', '8A', '10A']
          });
        }

        console.log('Teacher list:', mockTeachers);
        setTeachers(mockTeachers);

        // Auto-select first teacher
        if (mockTeachers.length > 0 && !selectedTeacher) {
          const defaultTeacher = hasRole('teacher') ? 
            (mockTeachers.find(t => t.teacher_id === 'current-user')?.teacher_id || mockTeachers[0].teacher_id) :
            mockTeachers[0].teacher_id;
          setSelectedTeacher(defaultTeacher);
        }

      } catch (error) {
        console.error('Error in fetchTeachers:', error);
      }
    };

    fetchTeachers();
  }, [currentSchool, hasRole, selectedTeacher]);

  // Fetch timetable when teacher changes
  useEffect(() => {
    if (selectedTeacher) {
      console.log('Fetching timetable for teacher:', selectedTeacher);
      // For now, using general timetable fetch as placeholder
      fetchTimetableForClass('10A'); // This would be teacher-specific in real implementation
    }
  }, [selectedTeacher, fetchTimetableForClass]);

  const currentPeriod = getCurrentPeriod();
  const nextPeriod = getNextPeriod();
  const selectedTeacherData = teachers.find(t => t.teacher_id === selectedTeacher);
  
  // Get current class entry for teacher (mock data)
  const getCurrentClassEntry = () => {
    if (!currentPeriod || !selectedTeacherData) return null;
    
    const currentDay = new Date().getDay();
    if (currentDay === 0 || currentDay === 6) return null;
    
    // Mock current class data
    return {
      subject_name: selectedTeacherData.subjects[0] || 'Mathematics',
      class_id: selectedTeacherData.classes[0] || '10A',
      room_name: 'Room 201'
    };
  };

  const currentClassEntry = getCurrentClassEntry();

  const exportTimetable = () => {
    console.log('Export timetable for teacher:', selectedTeacher);
  };

  const quickActions = [
    { 
      title: 'Mark Attendance', 
      icon: Users, 
      action: () => console.log('Mark attendance'),
      description: 'Quick attendance marking'
    },
    { 
      title: 'Class Notes', 
      icon: FileText, 
      action: () => console.log('Class notes'),
      description: 'Add lesson notes'
    },
    { 
      title: 'Lesson Plans', 
      icon: BookOpen, 
      action: () => console.log('Lesson plans'),
      description: 'View lesson plans'
    },
    { 
      title: 'Reminders', 
      icon: Bell, 
      action: () => console.log('Reminders'),
      description: 'Set class reminders'
    }
  ];

  if (!currentSchool) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No School Selected</h3>
          <p className="text-muted-foreground text-center">
            Please select a school to view teacher timetables.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Class Alert */}
      {currentClassEntry && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Current Class</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentClassEntry.subject_name} • {currentClassEntry.class_id} • {currentClassEntry.room_name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  Attendance
                </Button>
                <Badge variant="default" className="text-white">
                  {currentPeriod?.period_name}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Period Preview */}
      {nextPeriod && !currentClassEntry && (
        <Card className="border-muted-foreground/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Next Period</h4>
                <p className="text-sm text-muted-foreground">
                  {nextPeriod.period_name} starts at {nextPeriod.start_time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Teacher Timetable
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportTimetable}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Teacher Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Teacher</label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.teacher_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Week Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Week</label>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="next">Next Week</SelectItem>
                  <SelectItem value="previous">Previous Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div>
              <label className="text-sm font-medium mb-2 block">View</label>
              <Select value={viewMode} onValueChange={(value: 'schedule' | 'classes') => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">Schedule View</SelectItem>
                  <SelectItem value="classes">Classes View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Teacher Summary */}
          {selectedTeacherData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{selectedTeacherData.total_periods}</div>
                <div className="text-xs text-muted-foreground">Periods/Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{selectedTeacherData.classes.length}</div>
                <div className="text-xs text-muted-foreground">Classes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{selectedTeacherData.subjects.length}</div>
                <div className="text-xs text-muted-foreground">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">95%</div>
                <div className="text-xs text-muted-foreground">Attendance Rate</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={action.action}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Schedule Display */}
      {selectedTeacher && viewMode === 'schedule' && (
        <div className="space-y-4">
          {/* Subject Badges */}
          {selectedTeacherData && selectedTeacherData.subjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Teaching Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacherData.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timetable Grid for teacher's classes */}
          {selectedTeacherData?.classes && selectedTeacherData.classes.length > 0 && (
            <TimetableGrid
              classId={selectedTeacherData.classes[0]} // Show first class as example
              showAttendanceStatus={true}
              onPeriodClick={(entry, period, day) => {
                console.log('Teacher clicked period:', { entry, period, day });
              }}
            />
          )}
        </div>
      )}

      {/* Classes View */}
      {selectedTeacher && viewMode === 'classes' && selectedTeacherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Classes - {selectedTeacherData.teacher_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedTeacherData.classes.map((classId, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{classId}</h3>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{selectedTeacherData.subjects[index % selectedTeacherData.subjects.length]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Room {200 + index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{28 + index} students</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No schedule message */}
      {!loading && selectedTeacher && selectedTeacherData && selectedTeacherData.classes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Schedule Available</h3>
            <p className="text-muted-foreground text-center">
              No classes assigned to {selectedTeacherData.teacher_name}. 
              <br />
              Contact your administrator to set up the timetable.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}