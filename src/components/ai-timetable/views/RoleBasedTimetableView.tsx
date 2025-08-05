import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Clock, 
  MapPin, 
  BookOpen,
  Calendar,
  Smartphone,
  Eye
} from "lucide-react";

interface RoleBasedTimetableViewProps {
  role: 'admin' | 'teacher' | 'student';
  userId?: string;
}

export function RoleBasedTimetableView({ role, userId }: RoleBasedTimetableViewProps) {
  const [selectedView, setSelectedView] = useState<'grid' | 'list' | 'mobile'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mock data for different roles
  const adminData = {
    totalClasses: 24,
    totalTeachers: 18,
    totalPeriods: 192,
    utilizationRate: 87
  };

  const teacherData = {
    teacherId: 'teacher-1',
    name: 'Sarah Johnson',
    subjects: ['Mathematics', 'Physics'],
    totalPeriods: 24,
    freeSlots: 6,
    schedule: [
      { day: 'Monday', period: 1, subject: 'Mathematics', class: 'Year 10A', room: 'M101', time: '08:00-08:45' },
      { day: 'Monday', period: 3, subject: 'Physics', class: 'Year 11B', room: 'S201', time: '09:45-10:30' },
      { day: 'Tuesday', period: 2, subject: 'Mathematics', class: 'Year 12C', room: 'M102', time: '08:45-09:30' },
    ]
  };

  const studentData = {
    studentId: 'student-1',
    name: 'Alex Smith',
    class: 'Year 10A',
    schedule: [
      { day: 'Monday', period: 1, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'M101', time: '08:00-08:45' },
      { day: 'Monday', period: 2, subject: 'English', teacher: 'Mr. Smith', room: 'E102', time: '08:45-09:30' },
      { day: 'Monday', period: 4, subject: 'Physics', teacher: 'Dr. Brown', room: 'S201', time: '09:45-10:30' },
    ]
  };

  const renderAdminView = () => (
    <div className="space-y-6">
      {/* Admin Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{adminData.totalClasses}</div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{adminData.totalTeachers}</div>
                <div className="text-sm text-muted-foreground">Teachers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{adminData.totalPeriods}</div>
                <div className="text-sm text-muted-foreground">Total Periods</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{adminData.utilizationRate}%</div>
                <div className="text-sm text-muted-foreground">Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection */}
      <div className="flex items-center gap-4">
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select class..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="10a">Year 10A</SelectItem>
            <SelectItem value="10b">Year 10B</SelectItem>
            <SelectItem value="11a">Year 11A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Master Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Master Timetable - {selectedFilter === 'all' ? 'All Classes' : selectedFilter.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-full">
              <div className="font-medium p-2">Time</div>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="font-medium p-2 text-center">{day}</div>
              ))}
              
              {Array.from({ length: 8 }, (_, i) => (
                <React.Fragment key={i}>
                  <div className="p-2 text-sm text-muted-foreground">
                    Period {i + 1}<br />
                    08:00-08:45
                  </div>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={`${day}-${i}`} className="p-2 border rounded">
                      <div className="text-xs space-y-1">
                        <div className="font-medium">Mathematics</div>
                        <div className="text-muted-foreground">Year 10A</div>
                        <div className="text-muted-foreground">Ms. Johnson</div>
                        <div className="text-muted-foreground">Room M101</div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      {/* Teacher Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {teacherData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Subjects</div>
              <div className="flex gap-1 mt-1">
                {teacherData.subjects.map(subject => (
                  <Badge key={subject} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Periods</div>
              <div className="text-xl font-bold">{teacherData.totalPeriods}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Free Slots</div>
              <div className="text-xl font-bold text-green-600">{teacherData.freeSlots}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Workload</div>
              <div className="text-xl font-bold">{Math.round((teacherData.totalPeriods / 30) * 100)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Your Teaching Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teacherData.schedule.map((lesson, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{lesson.day}</Badge>
                    <div>
                      <div className="font-medium">{lesson.subject}</div>
                      <div className="text-sm text-muted-foreground">{lesson.class}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {lesson.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {lesson.room}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentView = () => (
    <div className="space-y-6">
      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {studentData.name} - {studentData.class}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Your personalized class timetable
          </div>
        </CardContent>
      </Card>

      {/* Student Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Your Class Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.schedule.map((lesson, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge>{lesson.day}</Badge>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {lesson.subject}
                      </div>
                      <div className="text-sm text-muted-foreground">with {lesson.teacher}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      {lesson.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {lesson.room}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMobileOptimized = () => (
    <div className="max-w-sm mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(role === 'student' ? studentData.schedule : teacherData.schedule).slice(0, 3).map((item, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-sm">{item.subject}</div>
                <Badge variant="outline" className="text-xs">{item.time}</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.room}
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  {role === 'student' ? item.teacher : item.class}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {role === 'admin' && <Users className="h-6 w-6 text-primary" />}
          {role === 'teacher' && <GraduationCap className="h-6 w-6 text-primary" />}
          {role === 'student' && <UserCheck className="h-6 w-6 text-primary" />}
          <h2 className="text-xl font-semibold capitalize">{role} Timetable View</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={selectedView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('grid')}
          >
            Grid
          </Button>
          <Button
            variant={selectedView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('list')}
          >
            List
          </Button>
          <Button
            variant={selectedView === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            Mobile
          </Button>
        </div>
      </div>

      {selectedView === 'mobile' ? renderMobileOptimized() : (
        <>
          {role === 'admin' && renderAdminView()}
          {role === 'teacher' && renderTeacherView()}
          {role === 'student' && renderStudentView()}
        </>
      )}
    </div>
  );
}