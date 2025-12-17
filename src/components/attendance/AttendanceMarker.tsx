import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { useStudentData } from '@/hooks/useStudentData';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Save, 
  UserCheck, 
  UserX, 
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Sun,
  Sunset,
  ClipboardCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

type Session = 'morning' | 'afternoon';

interface AttendanceState {
  [studentId: string]: {
    status: 'present' | 'absent' | 'late' | 'left_early';
    reason?: string;
    notes?: string;
  };
}

interface SessionSummary {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  isSubmitted: boolean;
  submittedAt?: string;
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

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSession, setSelectedSession] = useState<Session>(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'morning' : 'afternoon';
  });
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({});
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionSummaries, setSessionSummaries] = useState<{morning?: SessionSummary, afternoon?: SessionSummary}>({});
  const [manualSummary, setManualSummary] = useState({ presentCount: '', absentCount: '' });
  const [showVerification, setShowVerification] = useState(false);
  
  // Track the initialization key to prevent unwanted resets
  const lastInitKey = useRef<string>('');

  // Fetch session summaries
  const fetchSessionSummaries = async () => {
    if (!currentSchool?.id || selectedClass === 'all') return;
    
    const { data, error } = await supabase
      .from('attendance_session_summaries')
      .select('*')
      .eq('school_id', currentSchool.id)
      .eq('class_id', selectedClass)
      .eq('date', selectedDate);
    
    if (data && !error) {
      const summaries: {morning?: SessionSummary, afternoon?: SessionSummary} = {};
      data.forEach((item: any) => {
        summaries[item.session as Session] = {
          totalStudents: item.total_students,
          presentCount: item.present_count,
          absentCount: item.absent_count,
          lateCount: item.late_count,
          isSubmitted: item.is_submitted,
          submittedAt: item.submitted_at
        };
      });
      setSessionSummaries(summaries);
    }
  };

  // Get existing attendance for the selected date and session
  useEffect(() => {
    if (currentSchool?.id && selectedDate) {
      fetchAttendanceRecords(selectedDate, selectedDate);
      fetchSessionSummaries();
    }
  }, [currentSchool?.id, selectedDate, selectedClass, fetchAttendanceRecords]);

  // Initialize attendance state - DEFAULT TO PRESENT
  // Only reset when session, date, or class changes - NOT when attendanceRecords updates
  useEffect(() => {
    const initKey = `${selectedDate}-${selectedSession}-${selectedClass}`;
    
    // Skip if we've already initialized for this combination
    if (lastInitKey.current === initKey) {
      return;
    }
    
    lastInitKey.current = initKey;
    
    const filteredStudents = getFilteredStudents();
    const existingRecords = attendanceRecords.filter(
      r => r.date === selectedDate && (r as any).session === selectedSession
    );
    
    const initialState: AttendanceState = {};
    
    // First, set all students to present by default
    filteredStudents.forEach(student => {
      initialState[student.id] = {
        status: 'present', // Default to present
        reason: '',
        notes: '',
      };
    });
    
    // Then override with existing records
    existingRecords.forEach(record => {
      initialState[record.student_id] = {
        status: record.status,
        reason: record.reason || '',
        notes: record.notes || '',
      };
    });

    setAttendanceState(initialState);
  }, [selectedDate, selectedSession, selectedClass, students]);

  // Update state from records when they load (only for records matching current session)
  useEffect(() => {
    if (attendanceRecords.length === 0) return;
    
    const existingRecords = attendanceRecords.filter(
      r => r.date === selectedDate && (r as any).session === selectedSession
    );
    
    if (existingRecords.length > 0) {
      setAttendanceState(prev => {
        const updated = { ...prev };
        existingRecords.forEach(record => {
          updated[record.student_id] = {
            status: record.status,
            reason: record.reason || '',
            notes: record.notes || '',
          };
        });
        return updated;
      });
    }
  }, [attendanceRecords, selectedDate, selectedSession]);

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
    });
    return Array.from(classes).sort();
  };

  const getStatusCounts = useMemo(() => {
    const filtered = getFilteredStudents();
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      unmarked: 0,
      total: filtered.length
    };

    filtered.forEach(student => {
      const attendance = attendanceState[student.id];
      if (attendance?.status) {
        if (attendance.status === 'present' || attendance.status === 'left_early') {
          counts.present++;
        } else if (attendance.status === 'absent') {
          counts.absent++;
        } else if (attendance.status === 'late') {
          counts.late++;
        }
      } else {
        counts.unmarked++;
      }
    });

    return counts;
  }, [attendanceState, students, selectedClass, searchTerm]);

  const updateAttendance = (studentId: string, field: keyof AttendanceState[string], value: any) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] ?? { status: 'present', reason: '', notes: '' }),
        [field]: value,
      },
    }));
  };

  const markAllAs = (status: 'present' | 'absent' | 'late') => {
    const filteredStudents = getFilteredStudents();
    const newState = { ...attendanceState };
    
    filteredStudents.forEach(student => {
      newState[student.id] = {
        ...(newState[student.id] ?? { reason: '', notes: '' }),
        status,
      };
    });
    
    setAttendanceState(newState);
  };

  // Check for mismatch between manual summary and actual counts
  const hasMismatch = useMemo(() => {
    if (!manualSummary.presentCount && !manualSummary.absentCount) return false;
    
    const manualPresent = parseInt(manualSummary.presentCount) || 0;
    const manualAbsent = parseInt(manualSummary.absentCount) || 0;
    
    return manualPresent !== getStatusCounts.present || manualAbsent !== getStatusCounts.absent;
  }, [manualSummary, getStatusCounts]);

  const handleSave = async () => {
    const filteredStudents = getFilteredStudents();
    const attendanceList = filteredStudents
      .filter(student => attendanceState[student.id]?.status)
      .map(student => ({
        student_id: student.id,
        date: selectedDate,
        status: attendanceState[student.id].status,
        reason: attendanceState[student.id].reason,
        notes: attendanceState[student.id].notes,
        session: selectedSession,
      }));

    if (attendanceList.length === 0) {
      toast.error('No attendance to save');
      return;
    }

    setIsSaving(true);
    const success = await markBulkAttendance(attendanceList);
    
    if (success) {
      fetchAttendanceRecords(selectedDate, selectedDate);
      toast.success('Attendance saved');
    }
    
    setIsSaving(false);
  };

  const handleSubmitSession = async () => {
    if (selectedClass === 'all') {
      toast.error('Please select a specific class to submit attendance');
      return;
    }

    if (getStatusCounts.unmarked > 0) {
      toast.error('Please mark attendance for all students before submitting');
      return;
    }

    // First save the attendance
    await handleSave();

    setIsSubmitting(true);

    // Create or update session summary
    const { error } = await supabase
      .from('attendance_session_summaries')
      .upsert({
        school_id: currentSchool?.id,
        class_id: selectedClass,
        date: selectedDate,
        session: selectedSession,
        total_students: getStatusCounts.total,
        present_count: getStatusCounts.present,
        absent_count: getStatusCounts.absent,
        late_count: getStatusCounts.late,
        is_submitted: true,
        submitted_by: currentUserId,
        submitted_at: new Date().toISOString()
      }, {
        onConflict: 'school_id,class_id,date,session'
      });

    if (error) {
      console.error('Error submitting session:', error);
      toast.error('Failed to submit attendance');
      setIsSubmitting(false);
    } else {
      toast.success(`${selectedSession === 'morning' ? 'Morning' : 'Afternoon'} attendance submitted!`);
      await fetchSessionSummaries();
      setIsSubmitting(false);
    }
  };

  const filteredStudents = getFilteredStudents();
  const uniqueClasses = getUniqueClasses();
  const currentSessionSummary = sessionSummaries[selectedSession];
  const isSessionSubmitted = currentSessionSummary?.isSubmitted || false;

  // Check if both sessions are submitted for end-of-day verification
  const canVerifyEndOfDay = sessionSummaries.morning?.isSubmitted && sessionSummaries.afternoon?.isSubmitted;

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Selection Header */}
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
            </div>
          </CardTitle>
          <CardDescription>
            Select a session and class to mark attendance. Students default to "Present".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Session Selection */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={selectedSession === 'morning' ? 'default' : 'outline'}
              onClick={() => setSelectedSession('morning')}
              className="flex-1 gap-2"
            >
              <Sun className="h-4 w-4" />
              Morning Session
              {sessionSummaries.morning?.isSubmitted && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Marked
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedSession === 'afternoon' ? 'default' : 'outline'}
              onClick={() => setSelectedSession('afternoon')}
              className="flex-1 gap-2"
            >
              <Sunset className="h-4 w-4" />
              Afternoon Session
              {sessionSummaries.afternoon?.isSubmitted && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Marked
                </Badge>
              )}
            </Button>
          </div>

          {/* Session Status Alert */}
          {isSessionSubmitted && (
            <Alert className="mb-4 border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Attendance Marked</AlertTitle>
              <AlertDescription>
                {selectedSession === 'morning' ? 'Morning' : 'Afternoon'} attendance has been submitted for {selectedClass !== 'all' ? selectedClass : 'this class'}.
                {currentSessionSummary?.submittedAt && (
                  <span className="ml-2 text-muted-foreground">
                    at {format(new Date(currentSessionSummary.submittedAt), 'h:mm a')}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
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
                <SelectValue placeholder="Select class" />
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

          {/* Warning if class not selected */}
          {selectedClass === 'all' && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Select a Class</AlertTitle>
              <AlertDescription>
                Please select a specific class to enable attendance submission and tracking.
              </AlertDescription>
            </Alert>
          )}

          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{getStatusCounts.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{getStatusCounts.present}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{getStatusCounts.absent}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{getStatusCounts.late}</div>
              <div className="text-sm text-muted-foreground">Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{getStatusCounts.unmarked}</div>
              <div className="text-sm text-muted-foreground">Unmarked</div>
            </div>
          </div>

          {/* Session Summary Input */}
          {selectedClass !== 'all' && (
            <Card className="mb-6 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Session Summary Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Students Present</label>
                    <Input
                      type="number"
                      placeholder={String(getStatusCounts.present)}
                      value={manualSummary.presentCount}
                      onChange={(e) => setManualSummary(prev => ({ ...prev, presentCount: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Students Absent</label>
                    <Input
                      type="number"
                      placeholder={String(getStatusCounts.absent)}
                      value={manualSummary.absentCount}
                      onChange={(e) => setManualSummary(prev => ({ ...prev, absentCount: e.target.value }))}
                    />
                  </div>
                </div>
                
                {hasMismatch && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Summary Mismatch</AlertTitle>
                    <AlertDescription>
                      Your entered summary doesn't match the marked attendance. 
                      Expected: {getStatusCounts.present} present, {getStatusCounts.absent} absent. 
                      Please verify and correct the attendance.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
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
            <div className="flex-1" />
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              variant="outline"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={handleSubmitSession}
              disabled={isSubmitting || selectedClass === 'all' || getStatusCounts.unmarked > 0 || hasMismatch}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Student List */}
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const attendance = attendanceState[student.id] || { status: 'present', reason: '', notes: '' };
              const hasExistingRecord = attendanceRecords.some(r => 
                r.student_id === student.id && r.date === selectedDate && (r as any).session === selectedSession
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
                        className={attendance.status === 'present' ? 'bg-success hover:bg-success/90' : ''}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={attendance.status === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'status', 'absent')}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={attendance.status === 'late' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'status', 'late')}
                        className={attendance.status === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                      >
                        <Clock className="h-4 w-4" />
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

      {/* End-of-Day Verification */}
      {selectedClass !== 'all' && canVerifyEndOfDay && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              End-of-Day Verification
            </CardTitle>
            <CardDescription>
              Both sessions have been submitted. Review the daily summary below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="h-4 w-4" />
                  <span className="font-medium">Morning Session</span>
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Submitted
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Present: <span className="font-medium text-success">{sessionSummaries.morning?.presentCount}</span></div>
                  <div>Absent: <span className="font-medium text-destructive">{sessionSummaries.morning?.absentCount}</span></div>
                  <div>Late: <span className="font-medium text-warning">{sessionSummaries.morning?.lateCount}</span></div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sunset className="h-4 w-4" />
                  <span className="font-medium">Afternoon Session</span>
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Submitted
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Present: <span className="font-medium text-success">{sessionSummaries.afternoon?.presentCount}</span></div>
                  <div>Absent: <span className="font-medium text-destructive">{sessionSummaries.afternoon?.absentCount}</span></div>
                  <div>Late: <span className="font-medium text-warning">{sessionSummaries.afternoon?.lateCount}</span></div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
