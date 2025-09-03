import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { useStudentData } from '@/hooks/useStudentData';
import { useRBAC } from '@/hooks/useRBAC';
import { format } from 'date-fns';
import { 
  Save, 
  UserCheck, 
  UserX, 
  Clock,
  Search,
  Filter,
  CheckCircle
} from 'lucide-react';

interface AttendanceState {
  [studentId: string]: {
    status: 'present' | 'absent' | 'late' | 'left_early';
    reason?: string;
    notes?: string;
  };
}

export function AttendanceMarker() {
  const { currentSchool } = useRBAC();
  const { students, loading: studentsLoading } = useStudentData();
  const { 
    markBulkAttendance, 
    fetchAttendanceRecords, 
    attendanceRecords,
    loading 
  } = useAttendanceData();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({});
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Get existing attendance for the selected date
  useEffect(() => {
    if (currentSchool?.id && selectedDate) {
      fetchAttendanceRecords(selectedDate, selectedDate);
    }
  }, [currentSchool?.id, selectedDate, fetchAttendanceRecords]);

  // Initialize attendance state with existing records
  useEffect(() => {
    const existingRecords = attendanceRecords.filter(r => r.date === selectedDate);
    const initialState: AttendanceState = {};
    
    existingRecords.forEach(record => {
      initialState[record.student_id] = {
        status: record.status,
        reason: record.reason || '',
        notes: record.notes || '',
      };
    });

    setAttendanceState(initialState);
  }, [attendanceRecords, selectedDate]);

  const updateAttendance = (studentId: string, field: keyof AttendanceState[string], value: any) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const markAllAs = (status: 'present' | 'absent' | 'late') => {
    const filteredStudents = getFilteredStudents();
    const newState = { ...attendanceState };
    
    filteredStudents.forEach(student => {
      newState[student.id] = {
        ...newState[student.id],
        status,
      };
    });
    
    setAttendanceState(newState);
  };

  const handleSave = async () => {
    const attendanceList = Object.entries(attendanceState)
      .filter(([_, attendance]) => attendance.status)
      .map(([studentId, attendance]) => ({
        student_id: studentId,
        date: selectedDate,
        status: attendance.status,
        reason: attendance.reason,
        notes: attendance.notes,
      }));

    if (attendanceList.length === 0) {
      return;
    }

    setIsSaving(true);
    const success = await markBulkAttendance(attendanceList);
    
    if (success) {
      // Refresh the data
      fetchAttendanceRecords(selectedDate, selectedDate);
    }
    
    setIsSaving(false);
  };

  const getFilteredStudents = () => {
    let filtered = students;

    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => 
        student.form_class === selectedClass || student.year_group === selectedClass
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        `${student.profiles?.first_name || ''} ${student.profiles?.last_name || ''}`.toLowerCase().includes(term) ||
        student.student_number?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const getUniqueClasses = () => {
    const classes = new Set<string>();
    students.forEach(student => {
      if (student.form_class) classes.add(student.form_class);
      if (student.year_group) classes.add(student.year_group);
    });
    return Array.from(classes).sort();
  };

  const getStatusCounts = () => {
    const filtered = getFilteredStudents();
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      unmarked: 0,
    };

    filtered.forEach(student => {
      const attendance = attendanceState[student.id];
      if (attendance?.status) {
        counts[attendance.status === 'left_early' ? 'present' : attendance.status]++;
      } else {
        counts.unmarked++;
      }
    });

    return counts;
  };

  const filteredStudents = getFilteredStudents();
  const statusCounts = getStatusCounts();
  const uniqueClasses = getUniqueClasses();

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mark Attendance</span>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button 
                onClick={handleSave} 
                disabled={isSaving || Object.keys(attendanceState).length === 0}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(className => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{statusCounts.present}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{statusCounts.absent}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{statusCounts.late}</div>
              <div className="text-sm text-muted-foreground">Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{statusCounts.unmarked}</div>
              <div className="text-sm text-muted-foreground">Unmarked</div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={() => markAllAs('present')} className="gap-1">
              <UserCheck className="h-4 w-4" />
              Mark All Present
            </Button>
            <Button variant="outline" size="sm" onClick={() => markAllAs('absent')} className="gap-1">
              <UserX className="h-4 w-4" />
              Mark All Absent
            </Button>
            <Button variant="outline" size="sm" onClick={() => markAllAs('late')} className="gap-1">
              <Clock className="h-4 w-4" />
              Mark All Late
            </Button>
          </div>

          <div className="space-y-4">
            {filteredStudents.map((student) => {
              const attendance = attendanceState[student.id] || { status: undefined, reason: '', notes: '' };
              const hasExistingRecord = attendanceRecords.some(r => 
                r.student_id === student.id && r.date === selectedDate
              );

              return (
                <Card key={student.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">
                          {student.profiles?.first_name || ''} {student.profiles?.last_name || ''}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.student_number} • {student.form_class || student.year_group}
                        </div>
                      </div>
                      {hasExistingRecord && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={attendance.status === 'present' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'status', 'present')}
                        className="gap-1"
                      >
                        <UserCheck className="h-4 w-4" />
                        Present
                      </Button>
                      <Button
                        variant={attendance.status === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'status', 'absent')}
                        className="gap-1"
                      >
                        <UserX className="h-4 w-4" />
                        Absent
                      </Button>
                      <Button
                        variant={attendance.status === 'late' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'status', 'late')}
                        className="gap-1"
                      >
                        <Clock className="h-4 w-4" />
                        Late
                      </Button>
                    </div>
                  </div>

                  {(attendance.status === 'absent' || attendance.status === 'late') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Reason (optional)"
                        value={attendance.reason || ''}
                        onChange={(e) => updateAttendance(student.id, 'reason', e.target.value)}
                      />
                      <Textarea
                        placeholder="Notes (optional)"
                        value={attendance.notes || ''}
                        onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                        className="min-h-[38px]"
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No students found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}