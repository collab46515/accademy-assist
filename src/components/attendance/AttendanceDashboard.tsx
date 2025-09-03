import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { useStudentData } from '@/hooks/useStudentData';
import { useRBAC } from '@/hooks/useRBAC';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export function AttendanceDashboard() {
  const { currentSchool } = useRBAC();
  const { 
    attendanceRecords, 
    fetchAttendanceRecords, 
    getAttendanceStats,
    loading 
  } = useAttendanceData();
  const { students } = useStudentData();
  
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Calculate date ranges
  const today = new Date();
  const getDateRange = () => {
    switch (timeRange) {
      case 'today':
        return { 
          start: format(today, 'yyyy-MM-dd'), 
          end: format(today, 'yyyy-MM-dd') 
        };
      case 'week':
        return { 
          start: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'), 
          end: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd') 
        };
      case 'month':
        return { 
          start: format(startOfMonth(today), 'yyyy-MM-dd'), 
          end: format(endOfMonth(today), 'yyyy-MM-dd') 
        };
      default:
        return { 
          start: format(today, 'yyyy-MM-dd'), 
          end: format(today, 'yyyy-MM-dd') 
        };
    }
  };

  // Auto-refresh data every 5 seconds to ensure real-time updates
  useEffect(() => {
    const { start, end } = getDateRange();
    fetchAttendanceRecords(start, end);
    
    const interval = setInterval(() => {
      fetchAttendanceRecords(start, end);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [timeRange, currentSchool]);

  // Calculate statistics
  const stats = getAttendanceStats(attendanceRecords);
  const totalStudents = students.length;
  
  // Get today's attendance specifically
  const todayRecords = attendanceRecords.filter(
    record => record.date === format(today, 'yyyy-MM-dd')
  );
  const todayStats = getAttendanceStats(todayRecords);
  const studentsMarkedToday = new Set(todayRecords.map(r => r.student_id)).size;
  const studentsNotMarkedToday = totalStudents - studentsMarkedToday;

  // Calculate class-wise statistics
  const classStats = students.reduce((acc, student) => {
    const className = student.form_class || student.year_group;
    if (!acc[className]) {
      acc[className] = { total: 0, present: 0, absent: 0, late: 0, notMarked: 0 };
    }
    acc[className].total++;
    
    const studentRecord = todayRecords.find(r => r.student_id === student.id);
    if (studentRecord) {
      if (studentRecord.status === 'present') acc[className].present++;
      else if (studentRecord.status === 'absent') acc[className].absent++;
      else if (studentRecord.status === 'late') acc[className].late++;
    } else {
      acc[className].notMarked++;
    }
    
    return acc;
  }, {} as Record<string, { total: number; present: number; absent: number; late: number; notMarked: number }>);

  // Get alerts (students with consecutive absences, etc.)
  const getAlerts = () => {
    const alerts = [];
    
    // Students not marked today
    if (studentsNotMarkedToday > 0) {
      alerts.push({
        type: 'warning',
        message: `${studentsNotMarkedToday} students not marked today`,
        count: studentsNotMarkedToday
      });
    }
    
    // High absence classes
    Object.entries(classStats).forEach(([className, classStat]) => {
      const absentRate = classStat.total > 0 ? (classStat.absent / classStat.total) * 100 : 0;
      if (absentRate > 20) {
        alerts.push({
          type: 'error',
          message: `High absence rate in ${className} (${Math.round(absentRate)}%)`,
          count: classStat.absent
        });
      }
    });
    
    return alerts;
  };

  const alerts = getAlerts();

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Attendance Dashboard
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeRange === 'today' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('today')}
              >
                Today
              </Button>
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                This Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                This Month
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{todayStats.present}</div>
            <p className="text-xs text-muted-foreground">
              {todayStats.total > 0 ? Math.round((todayStats.present / todayStats.total) * 100) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{todayStats.absent}</div>
            <p className="text-xs text-muted-foreground">
              {studentsNotMarkedToday} not yet marked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Today</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{todayStats.late}</div>
            <p className="text-xs text-muted-foreground">
              Late arrivals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">{alert.message}</span>
                  <Badge variant={alert.type === 'error' ? 'destructive' : 'secondary'}>
                    {alert.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class-wise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Class Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(classStats).map(([className, classStat]) => {
              const attendanceRate = classStat.total > 0 ? (classStat.present / classStat.total) * 100 : 0;
              return (
                <div key={className} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{className}</div>
                    <div className="text-sm text-muted-foreground">
                      {classStat.present}/{classStat.total} present ({Math.round(attendanceRate)}%)
                    </div>
                  </div>
                  <Progress value={attendanceRate} className="h-2" />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      Present: {classStat.present}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      Absent: {classStat.absent}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      Late: {classStat.late}
                    </span>
                    {classStat.notMarked > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        Not marked: {classStat.notMarked}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overall Period Stats for selected range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'} Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.attendanceRate}%</div>
              <div className="text-sm text-muted-foreground">Attendance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.late}</div>
              <div className="text-sm text-muted-foreground">Late Arrivals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{stats.leftEarly}</div>
              <div className="text-sm text-muted-foreground">Left Early</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}