import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Table, Calendar, Smartphone, Users, GraduationCap, UserCheck } from "lucide-react";
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

interface ExportOptions {
  format: 'pdf' | 'excel' | 'ical' | 'google_calendar';
  viewType: 'admin' | 'teacher' | 'student';
  dateRange: 'current_week' | 'current_month' | 'full_term';
  includeBreaks: boolean;
  includeRooms: boolean;
  mobileOptimized: boolean;
  selectedTeachers?: string[];
  selectedClasses?: string[];
}

export function ExportManager() {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    viewType: 'admin',
    dateRange: 'current_week',
    includeBreaks: true,
    includeRooms: true,
    mobileOptimized: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock timetable data for export
  const mockTimetableData = {
    Monday: [
      { period: 1, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '08:00-08:45', class: 'Year 10A' },
      { period: 2, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '08:45-09:30', class: 'Year 10A' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45', class: '' },
      { period: 4, subject: 'Physics', teacher: 'Dr. Brown', room: 'Physics Lab', time: '09:45-10:30', class: 'Year 10A' },
      { period: 5, subject: 'History', teacher: 'Ms. Davis', room: 'Room 103', time: '10:30-11:15', class: 'Year 10A' },
    ],
    Tuesday: [
      { period: 1, subject: 'Chemistry', teacher: 'Dr. Lee', room: 'Chemistry Lab', time: '08:00-08:45', class: 'Year 10A' },
      { period: 2, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '08:45-09:30', class: 'Year 10A' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45', class: '' },
      { period: 4, subject: 'Geography', teacher: 'Mr. Green', room: 'Room 105', time: '09:45-10:30', class: 'Year 10A' },
      { period: 5, subject: 'Biology', teacher: 'Dr. White', room: 'Biology Lab', time: '10:30-11:15', class: 'Year 10A' },
    ],
    Wednesday: [
      { period: 1, subject: 'Biology', teacher: 'Dr. White', room: 'Biology Lab', time: '08:00-08:45', class: 'Year 10A' },
      { period: 2, subject: 'French', teacher: 'Mme. Martin', room: 'Room 104', time: '08:45-09:30', class: 'Year 10A' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45', class: '' },
      { period: 4, subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101', time: '09:45-10:30', class: 'Year 10A' },
      { period: 5, subject: 'Chemistry', teacher: 'Dr. Lee', room: 'Chemistry Lab', time: '10:30-11:15', class: 'Year 10A' },
    ],
    Thursday: [
      { period: 1, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '08:00-08:45', class: 'Year 10A' },
      { period: 2, subject: 'Physics', teacher: 'Dr. Brown', room: 'Physics Lab', time: '08:45-09:30', class: 'Year 10A' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45', class: '' },
      { period: 4, subject: 'Art', teacher: 'Ms. Turner', room: 'Art Studio', time: '09:45-10:30', class: 'Year 10A' },
      { period: 5, subject: 'French', teacher: 'Mme. Martin', room: 'Room 104', time: '10:30-11:15', class: 'Year 10A' },
    ],
    Friday: [
      { period: 1, subject: 'History', teacher: 'Ms. Davis', room: 'Room 103', time: '08:00-08:45', class: 'Year 10A' },
      { period: 2, subject: 'PE', teacher: 'Mr. Wilson', room: 'Gymnasium', time: '08:45-09:30', class: 'Year 10A' },
      { period: 3, subject: 'Break', teacher: '', room: '', time: '09:30-09:45', class: '' },
      { period: 4, subject: 'English', teacher: 'Mr. Smith', room: 'Room 102', time: '09:45-10:30', class: 'Year 10A' },
      { period: 5, subject: 'Physics', teacher: 'Dr. Brown', room: 'Physics Lab', time: '10:30-11:15', class: 'Year 10A' },
    ]
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Professional printable format' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: Table, description: 'Editable spreadsheet format' },
    { value: 'ical', label: 'iCal File', icon: Calendar, description: 'Import to any calendar app' },
    { value: 'google_calendar', label: 'Google Calendar', icon: Calendar, description: 'Direct sync to Google Calendar' }
  ];

  const viewTypes = [
    { value: 'admin', label: 'Admin View', icon: Users, description: 'Complete school timetable' },
    { value: 'teacher', label: 'Teacher View', icon: GraduationCap, description: 'Individual teacher schedules' },
    { value: 'student', label: 'Student View', icon: UserCheck, description: 'Class-specific timetables' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          downloadFile();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('School Timetable', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${exportOptions.viewType.toUpperCase()} VIEW - ${exportOptions.dateRange.replace('_', ' ').toUpperCase()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Table headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const headers = ['Day', 'Time', 'Subject', 'Teacher'];
    if (exportOptions.includeRooms) headers.push('Room');
    
    const colWidth = pageWidth / headers.length;
    headers.forEach((header, index) => {
      doc.text(header, 10 + (index * colWidth), yPosition);
    });
    yPosition += 8;
    
    // Draw line under headers
    doc.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 5;
    
    // Table content
    doc.setFont('helvetica', 'normal');
    Object.entries(mockTimetableData).forEach(([day, periods]) => {
      periods.forEach((period) => {
        if (!exportOptions.includeBreaks && (period.subject === 'Break' || period.subject === 'Lunch')) {
          return;
        }
        
        if (yPosition > 250) { // Check if we need a new page
          doc.addPage();
          yPosition = 20;
        }
        
        const rowData = [day, period.time, period.subject, period.teacher];
        if (exportOptions.includeRooms) rowData.push(period.room);
        
        rowData.forEach((data, index) => {
          doc.text(data || '', 10 + (index * colWidth), yPosition);
        });
        yPosition += 6;
        
        // Only show day name for first period of each day
        day = '';
      });
    });
    
    // Save the PDF
    const filename = `timetable_${exportOptions.viewType}_${Date.now()}.pdf`;
    doc.save(filename);
    
    toast({
      title: "Success",
      description: `PDF exported successfully: ${filename}`,
    });
  };

  const generateExcel = () => {
    // Create CSV content (simple Excel alternative)
    let csvContent = 'Day,Time,Subject,Teacher';
    if (exportOptions.includeRooms) csvContent += ',Room';
    csvContent += '\n';
    
    Object.entries(mockTimetableData).forEach(([day, periods]) => {
      periods.forEach((period) => {
        if (!exportOptions.includeBreaks && (period.subject === 'Break' || period.subject === 'Lunch')) {
          return;
        }
        
        let row = `${day},${period.time},${period.subject},${period.teacher}`;
        if (exportOptions.includeRooms) row += `,${period.room}`;
        csvContent += row + '\n';
        
        // Only show day name for first period of each day
        day = '';
      });
    });
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `timetable_${exportOptions.viewType}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Excel file exported successfully!",
    });
  };

  const generateICalendar = () => {
    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//School//Timetable//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
    
    Object.entries(mockTimetableData).forEach(([day, periods], dayIndex) => {
      periods.forEach((period) => {
        if (!exportOptions.includeBreaks && (period.subject === 'Break' || period.subject === 'Lunch')) {
          return;
        }
        
        const eventDate = new Date(startOfWeek);
        eventDate.setDate(startOfWeek.getDate() + dayIndex);
        
        const [startTime, endTime] = period.time.split('-');
        const startDateTime = new Date(`${eventDate.toDateString()} ${startTime}`);
        const endDateTime = new Date(`${eventDate.toDateString()} ${endTime}`);
        
        const formatDate = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        icalContent.push(
          'BEGIN:VEVENT',
          `UID:${period.subject}-${dayIndex}-${period.period}@school.edu`,
          `DTSTART:${formatDate(startDateTime)}`,
          `DTEND:${formatDate(endDateTime)}`,
          `SUMMARY:${period.subject}`,
          `DESCRIPTION:Teacher: ${period.teacher}${exportOptions.includeRooms ? `\\nRoom: ${period.room}` : ''}`,
          `LOCATION:${period.room}`,
          'END:VEVENT'
        );
      });
    });
    
    icalContent.push('END:VCALENDAR');
    
    const blob = new Blob([icalContent.join('\n')], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `timetable_${exportOptions.viewType}_${Date.now()}.ics`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "iCalendar file exported successfully!",
    });
  };

  const downloadFile = () => {
    switch (exportOptions.format) {
      case 'pdf':
        generatePDF();
        break;
      case 'excel':
        generateExcel();
        break;
      case 'ical':
      case 'google_calendar':
        generateICalendar();
        break;
      default:
        toast({
          title: "Error",
          description: "Unsupported export format",
          variant: "destructive"
        });
    }
  };

  const getFormatIcon = (format: string) => {
    const option = formatOptions.find(opt => opt.value === format);
    return option ? option.icon : FileText;
  };

  const getViewIcon = (viewType: string) => {
    const option = viewTypes.find(opt => opt.value === viewType);
    return option ? option.icon : Users;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Timetable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      exportOptions.format === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: option.value as any }))}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* View Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">View Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {viewTypes.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      exportOptions.viewType === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setExportOptions(prev => ({ ...prev, viewType: option.value as any }))}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Select 
                  value={exportOptions.dateRange} 
                  onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_week">Current Week</SelectItem>
                    <SelectItem value="current_month">Current Month</SelectItem>
                    <SelectItem value="full_term">Full Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {exportOptions.viewType === 'teacher' && (
                <div>
                  <Label htmlFor="teachers">Select Teachers</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose teachers..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="mark">Mark Williams</SelectItem>
                      <SelectItem value="emily">Emily Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {exportOptions.viewType === 'student' && (
                <div>
                  <Label htmlFor="classes">Select Classes</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose classes..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="10a">Year 10A</SelectItem>
                      <SelectItem value="10b">Year 10B</SelectItem>
                      <SelectItem value="11a">Year 11A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Breaks</Label>
                  <p className="text-sm text-muted-foreground">Show break and lunch periods</p>
                </div>
                <Switch
                  checked={exportOptions.includeBreaks}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeBreaks: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Room Numbers</Label>
                  <p className="text-sm text-muted-foreground">Display room assignments</p>
                </div>
                <Switch
                  checked={exportOptions.includeRooms}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeRooms: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <Label>Mobile Optimized</Label>
                    <p className="text-sm text-muted-foreground">Format for mobile viewing</p>
                  </div>
                </div>
                <Switch
                  checked={exportOptions.mobileOptimized}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, mobileOptimized: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Export Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Export Preview</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {React.createElement(getFormatIcon(exportOptions.format), { className: "h-4 w-4" })}
                <span>{formatOptions.find(f => f.value === exportOptions.format)?.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {React.createElement(getViewIcon(exportOptions.viewType), { className: "h-4 w-4" })}
                <span>{viewTypes.find(v => v.value === exportOptions.viewType)?.label}</span>
              </div>
              <Badge variant="outline">{exportOptions.dateRange.replace('_', ' ')}</Badge>
              {exportOptions.mobileOptimized && (
                <Badge variant="secondary">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Mobile
                </Badge>
              )}
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating {exportOptions.format.toUpperCase()}...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Timetable'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" onClick={() => {
              setExportOptions({ ...exportOptions, format: 'pdf', viewType: 'admin' });
              handleExport();
            }}>
              <FileText className="h-4 w-4 mr-2" />
              Admin PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setExportOptions({ ...exportOptions, format: 'pdf', viewType: 'teacher' });
              handleExport();
            }}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Teacher PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setExportOptions({ ...exportOptions, format: 'ical', viewType: 'student' });
              handleExport();
            }}>
              <Calendar className="h-4 w-4 mr-2" />
              Student iCal
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setExportOptions({ ...exportOptions, format: 'excel', viewType: 'admin' });
              handleExport();
            }}>
              <Table className="h-4 w-4 mr-2" />
              Excel Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}