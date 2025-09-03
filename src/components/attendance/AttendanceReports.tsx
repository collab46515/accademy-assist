import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  BarChart3, 
  TrendingDown, 
  TrendingUp,
  Users,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface AttendanceData {
  studentId: string;
  studentName: string;
  yearGroup: string;
  formClass: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
}

export function AttendanceReports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [reportType, setReportType] = useState<string>('summary');

  // Mock attendance data
  const attendanceData: AttendanceData[] = [
    {
      studentId: 'STU001',
      studentName: 'Emma Thompson',
      yearGroup: 'Year 10',
      formClass: '10A',
      totalSessions: 95,
      presentCount: 92,
      absentCount: 2,
      lateCount: 1,
      attendancePercentage: 96.8
    },
    {
      studentId: 'STU002',
      studentName: 'James Wilson',
      yearGroup: 'Year 9',
      formClass: '9B',
      totalSessions: 95,
      absentCount: 8,
      lateCount: 3,
      presentCount: 84,
      attendancePercentage: 88.4
    },
    {
      studentId: 'STU003',
      studentName: 'Sophie Chen',
      yearGroup: 'Year 11',
      formClass: '11C',
      totalSessions: 95,
      presentCount: 89,
      absentCount: 4,
      lateCount: 2,
      attendancePercentage: 93.7
    },
    {
      studentId: 'STU004',
      studentName: 'Michael Brown',
      yearGroup: 'Year 8',
      formClass: '8A',
      totalSessions: 95,
      presentCount: 78,
      absentCount: 15,
      lateCount: 2,
      attendancePercentage: 82.1
    }
  ];

  const classes = ['all', '8A', '9B', '10A', '11C'];
  const reportTypes = [
    { value: 'summary', label: 'Attendance Summary' },
    { value: 'detailed', label: 'Detailed Report' },
    { value: 'trends', label: 'Attendance Trends' },
    { value: 'alerts', label: 'Attendance Alerts' }
  ];

  const filteredData = selectedClass === 'all' 
    ? attendanceData 
    : attendanceData.filter(student => student.formClass === selectedClass);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 95) return { status: 'excellent', color: 'bg-green-500', icon: TrendingUp };
    if (percentage >= 90) return { status: 'good', color: 'bg-blue-500', icon: TrendingUp };
    if (percentage >= 85) return { status: 'concern', color: 'bg-yellow-500', icon: TrendingDown };
    return { status: 'critical', color: 'bg-red-500', icon: AlertTriangle };
  };

  const generateReport = () => {
    // Simulate report generation
    const reportData = {
      dateRange: `${dateRange?.from ? format(dateRange.from, 'dd/MM/yyyy') : 'N/A'} - ${dateRange?.to ? format(dateRange.to, 'dd/MM/yyyy') : 'N/A'}`,
      class: selectedClass,
      type: reportType,
      generated: new Date().toISOString()
    };
    
    console.log('Generating report:', reportData);
    
    // Create and download CSV
    const csvContent = [
      ['Student Name', 'Year Group', 'Form Class', 'Total Sessions', 'Present', 'Absent', 'Late', 'Attendance %'].join(','),
      ...filteredData.map(student => [
        student.studentName,
        student.yearGroup,
        student.formClass,
        student.totalSessions,
        student.presentCount,
        student.absentCount,
        student.lateCount,
        student.attendancePercentage.toFixed(1) + '%'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const overallStats = {
    totalStudents: filteredData.length,
    averageAttendance: filteredData.reduce((sum, student) => sum + student.attendancePercentage, 0) / filteredData.length,
    excellentAttendance: filteredData.filter(s => s.attendancePercentage >= 95).length,
    concernAttendance: filteredData.filter(s => s.attendancePercentage < 85).length
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Attendance Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from && dateRange?.to 
                      ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                      : dateRange?.from 
                        ? format(dateRange.from, "dd/MM/yyyy")
                        : "Pick a date range"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Class Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.filter(c => c !== 'all').map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Report Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <Button onClick={generateReport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-primary">{overallStats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Attendance</p>
                <p className="text-3xl font-bold text-primary">{overallStats.averageAttendance.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Excellent (95%+)</p>
                <p className="text-3xl font-bold text-success">{overallStats.excellentAttendance}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Support (Below 85%)</p>
                <p className="text-3xl font-bold text-destructive">{overallStats.concernAttendance}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((student) => {
                  const status = getAttendanceStatus(student.attendancePercentage);
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={student.studentId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-sm text-muted-foreground">{student.yearGroup}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.formClass}</Badge>
                      </TableCell>
                      <TableCell>{student.totalSessions}</TableCell>
                      <TableCell>
                        <span className="text-success font-medium">{student.presentCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-destructive font-medium">{student.absentCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-warning font-medium">{student.lateCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{student.attendancePercentage.toFixed(1)}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${status.color}`} />
                          <StatusIcon className="h-4 w-4" />
                          <span className="capitalize text-sm">{status.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}