import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { useStudentData } from '@/hooks/useStudentData';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  CheckCircle, 
  XCircle, 
  Clock, 
  LogOut,
  Search,
  Users,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentAttendance {
  student_id: string;
  student_name: string;
  student_number: string;
  form_class: string;
  year_group: string;
  avatar_url?: string;
  status?: 'present' | 'absent' | 'late' | 'left_early';
  reason?: string;
  notes?: string;
}

export function AttendanceMarker() {
  const { currentSchool } = useRBAC();
  const { 
    markAttendance, 
    markBulkAttendance, 
    attendanceSettings, 
    getCurrentClass,
    classSchedules,
    schoolPeriods 
  } = useAttendanceData();
  const { students, getStudentsByClass } = useStudentData();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all_classes');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsAttendance, setStudentsAttendance] = useState<StudentAttendance[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'present' | 'absent' | 'late' | 'left_early'>('present');
  const [saving, setSaving] = useState(false);

  // Get unique year groups and form classes
  const yearGroups = [...new Set(students.map(s => s.year_group))].sort();
  const formClasses = [...new Set(students.map(s => s.form_class))].filter(Boolean).sort();

  // Filter students based on selected class and search term
  const filteredStudents = students.filter(student => {
    const firstName = student.profiles?.first_name || '';
    const lastName = student.profiles?.last_name || '';
    const matchesSearch = firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all_classes' || !selectedClass || 
                        student.year_group === selectedClass || 
                        student.form_class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Initialize students attendance and fetch existing records
  useEffect(() => {
    const initializeAttendance = async () => {
      if (!currentSchool) return;
      
      // Fetch existing attendance records for the selected date
      const { data: existingRecords, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('school_id', currentSchool.id)
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('period', selectedPeriod);

      if (error) {
        console.error('Error fetching existing attendance:', error);
      }

      const attendanceList: StudentAttendance[] = filteredStudents.map(student => {
        // Find existing attendance record for this student
        const existingRecord = existingRecords?.find(record => record.student_id === student.id);
        
        // Ensure status is valid or undefined
        const validStatuses = ['present', 'absent', 'late', 'left_early'];
        const status = existingRecord?.status && validStatuses.includes(existingRecord.status) 
          ? existingRecord.status as 'present' | 'absent' | 'late' | 'left_early'
          : undefined;
        
        return {
          student_id: student.id,
          student_name: `${student.profiles?.first_name || ''} ${student.profiles?.last_name || ''}`.trim(),
          student_number: student.student_number,
          form_class: student.form_class || '',
          year_group: student.year_group,
          avatar_url: student.profiles?.avatar_url,
          status: status,
          reason: existingRecord?.reason || '',
          notes: existingRecord?.notes || '',
        };
      });
      
      setStudentsAttendance(attendanceList);
    };

    initializeAttendance();
  }, [filteredStudents.length, selectedDate, selectedPeriod, currentSchool]); // Use stable dependencies

  // Get current class suggestion
  const currentClass = getCurrentClass();

  // Update student attendance status
  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'left_early', reason?: string, notes?: string) => {
    setStudentsAttendance(prev => 
      prev.map(student => 
        student.student_id === studentId 
          ? { ...student, status, reason, notes }
          : student
      )
    );
  };

  // Mark all students with bulk status
  const markAllAs = (status: 'present' | 'absent' | 'late' | 'left_early') => {
    setStudentsAttendance(prev => 
      prev.map(student => ({ ...student, status }))
    );
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!currentSchool) return;

    setSaving(true);
    try {
      const attendanceToSave = studentsAttendance
        .filter(student => student.status) // Only save students with status set
        .map(student => ({
          student_id: student.student_id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          period: selectedPeriod || null,
          subject: currentClass?.subject || null,
          status: student.status!,
          reason: student.reason || null,
          notes: student.notes || null,
        }));

      if (attendanceToSave.length === 0) {
        alert('Please mark attendance for at least one student before saving.');
        return;
      }

      console.log('Saving attendance:', attendanceToSave);
      
      // Save to database
      const success = await markBulkAttendance(attendanceToSave);
      
      if (success) {
        // Don't reset the form - keep the marked attendance visible
        // The attendance has been successfully saved to the database
        console.log('Attendance successfully saved - keeping UI state');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'absent': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'late': return <Clock className="h-4 w-4 text-warning" />;
      case 'left_early': return <LogOut className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'present': return <Badge variant="default" className="bg-success text-success-foreground">Present</Badge>;
      case 'absent': return <Badge variant="destructive">Absent</Badge>;
      case 'late': return <Badge variant="outline" className="border-warning text-warning">Late</Badge>;
      case 'left_early': return <Badge variant="secondary">Left Early</Badge>;
      default: return <Badge variant="outline">Not Marked</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Current Class Info */}
      {currentClass && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              Current Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Subject:</span> {currentClass.subject}
              </div>
              <div>
                <span className="font-medium">Year:</span> {currentClass.year_group}
              </div>
              <div>
                <span className="font-medium">Room:</span> {currentClass.room || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Period:</span> {currentClass.period?.period_name}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Class/Year Group Filter */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_classes">All Classes</SelectItem>
                {yearGroups.map(year => (
                  <SelectItem key={year} value={year}>Year {year}</SelectItem>
                ))}
                {formClasses.map(formClass => (
                  <SelectItem key={formClass} value={formClass}>{formClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Period Selection (if period-based attendance) */}
            {attendanceSettings?.attendance_mode === 'period' && (
              <Select value={selectedPeriod?.toString() || 'daily'} onValueChange={(value) => setSelectedPeriod(value === 'daily' ? null : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Attendance</SelectItem>
                  {schoolPeriods.map(period => (
                    <SelectItem key={period.id} value={period.period_number.toString()}>
                      {period.period_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Mark all as:</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => markAllAs('present')}
              className="text-success border-success hover:bg-success hover:text-success-foreground"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Present
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => markAllAs('absent')}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Absent
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => markAllAs('late')}
              className="text-warning border-warning hover:bg-warning hover:text-warning-foreground"
            >
              <Clock className="h-3 w-3 mr-1" />
              Late
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Students ({studentsAttendance.length})</span>
            <Button 
              onClick={handleSaveAttendance}
              disabled={saving || studentsAttendance.every(s => !s.status)}
              className="ml-auto"
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentsAttendance.map((student) => (
              <div key={student.student_id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={student.avatar_url} />
                  <AvatarFallback>
                    {student.student_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{student.student_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.student_number} • {student.form_class || student.year_group}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(student.status)}
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      onClick={() => updateStudentStatus(student.student_id, 'present')}
                      className={cn(
                        student.status === 'present' && "bg-success hover:bg-success/90 text-success-foreground"
                      )}
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      onClick={() => updateStudentStatus(student.student_id, 'absent')}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      onClick={() => updateStudentStatus(student.student_id, 'late')}
                      className={cn(
                        student.status === 'late' && "bg-warning hover:bg-warning/90 text-warning-foreground"
                      )}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'left_early' ? 'secondary' : 'outline'}
                      onClick={() => updateStudentStatus(student.student_id, 'left_early')}
                    >
                      <LogOut className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {studentsAttendance.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No students found. Try adjusting your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}