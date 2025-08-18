import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TimetableGrid } from './TimetableGrid';
import { useTimetableData } from '@/hooks/useTimetableData';
import { useStudentData } from '@/hooks/useStudentData';
import { useRBAC } from '@/hooks/useRBAC';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  MapPin,
  Download,
  RefreshCw
} from 'lucide-react';

export function StudentTimetableView() {
  const { currentSchool, hasRole } = useRBAC();
  const { students } = useStudentData();
  const { 
    fetchTimetableForClass, 
    getCurrentPeriod, 
    getNextPeriod,
    periods,
    timetableEntries,
    loading 
  } = useTimetableData();
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  // Fetch all available classes from database
  useEffect(() => {
    const fetchClasses = async () => {
      if (!currentSchool) return;

      try {
        // Fetch classes from classes table
        const { data: classesData, error } = await supabase
          .from('classes')
          .select('class_name, year_group')
          .eq('school_id', currentSchool.id)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching classes:', error);
          return;
        }

        // Create class options: combine class_name with year_group for display
        const classOptions = (classesData || []).map(c => ({
          id: c.class_name,
          display: `${c.year_group} ${c.class_name}`,
          class_name: c.class_name,
          year_group: c.year_group
        }));

        // Get unique class names for the dropdown
        const uniqueClasses = [...new Set(classOptions.map(c => c.class_name))].sort();

        console.log('Available classes found:', uniqueClasses.length, uniqueClasses);
        setAvailableClasses(uniqueClasses);

        // Auto-select first class if none selected
        if (uniqueClasses.length > 0 && !selectedClass) {
          setSelectedClass(uniqueClasses[0]);
        }

      } catch (error) {
        console.error('Error fetching classes:', error);
        // Fallback to student-based classes if database fetch fails
        const studentClasses = [...new Set([
          ...students.map(s => s.form_class).filter(Boolean),
          ...students.map(s => s.year_group).filter(Boolean)
        ])].sort();
        setAvailableClasses(studentClasses);
      }
    };

    fetchClasses();
  }, [currentSchool, students]);

  // Auto-select class if user is a student
  useEffect(() => {
    if (hasRole('student') && students.length > 0) {
      const studentRecord = students[0]; // Assuming current user's student record
      const classId = studentRecord.form_class || studentRecord.year_group;
      if (classId) {
        setSelectedClass(classId);
      }
    } else if (availableClasses.length > 0 && !selectedClass) {
      // For teachers/admin, default to first available class
      setSelectedClass(availableClasses[0]);
    }
  }, [students, hasRole]);

  // Fetch timetable when class changes
  useEffect(() => {
    console.log('StudentTimetableView: selectedClass changed to:', selectedClass);
    if (selectedClass) {
      console.log('StudentTimetableView: calling fetchTimetableForClass with:', selectedClass);
      fetchTimetableForClass(selectedClass);
    }
  }, [selectedClass, fetchTimetableForClass]);

  const currentPeriod = getCurrentPeriod();
  const nextPeriod = getNextPeriod();
  
  // Get current class entry
  const getCurrentClassEntry = () => {
    if (!currentPeriod) return null;
    
    const currentDay = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
    if (currentDay === 0 || currentDay === 6) return null; // Weekend
    
    return timetableEntries.find(entry => 
      entry.period_id === currentPeriod.id && 
      entry.day_of_week === currentDay
    );
  };

  const currentClassEntry = getCurrentClassEntry();

  const handlePeriodClick = (entry: any, period: any, day: string) => {
    // Handle period click - could open attendance marking or details
    console.log('Period clicked:', { entry, period, day });
  };

  const exportTimetable = () => {
    // TODO: Implement PDF export
    console.log('Export timetable for:', selectedClass);
  };

  if (!currentSchool) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No School Selected</h3>
          <p className="text-muted-foreground text-center">
            Please select a school to view the timetable.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Period Alert */}
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
                    {currentClassEntry.subject?.subject_name} • {currentClassEntry.classroom?.room_name} • {currentClassEntry.teacher_name}
                  </p>
                </div>
              </div>
              <Badge 
                variant="default" 
                style={{ backgroundColor: currentClassEntry.subject?.color_code }}
                className="text-white"
              >
                {currentPeriod?.period_name}
              </Badge>
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
              <Calendar className="h-5 w-5" />
              Timetable View
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportTimetable}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchTimetableForClass(selectedClass)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map(classId => (
                    <SelectItem key={classId} value={classId}>
                      {classId}
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
              <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{periods.filter(p => !p.is_break).length}</div>
              <div className="text-xs text-muted-foreground">Periods/Day</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{timetableEntries.length}</div>
              <div className="text-xs text-muted-foreground">Classes/Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {timetableEntries.filter(e => e.attendance_status === 'present').length}
              </div>
              <div className="text-xs text-muted-foreground">Attended</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {Math.round((timetableEntries.filter(e => e.attendance_status === 'present').length / 
                  Math.max(timetableEntries.filter(e => e.attendance_status).length, 1)) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      {selectedClass && (
        <TimetableGrid
          classId={selectedClass}
          showAttendanceStatus={true}
          onPeriodClick={handlePeriodClick}
        />
      )}

      {/* No timetable message */}
      {!loading && selectedClass && timetableEntries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Timetable Available</h3>
            <p className="text-muted-foreground text-center">
              No timetable entries found for {selectedClass}. 
              <br />
              Use the AI Timetable Generator in the Manage tab to create timetables.
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