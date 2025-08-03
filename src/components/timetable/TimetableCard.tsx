import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TimetableEntry } from '@/hooks/useTimetableData';
import { Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TimetableCardProps {
  entry: TimetableEntry | null;
  period: any;
  isCurrentPeriod?: boolean;
  showAttendanceStatus?: boolean;
  onClick?: () => void;
}

export function TimetableCard({ 
  entry, 
  period, 
  isCurrentPeriod = false, 
  showAttendanceStatus = false,
  onClick 
}: TimetableCardProps) {
  if (!entry) {
    // Empty period slot
    return (
      <div className="h-20 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Free Period</span>
      </div>
    );
  }

  const getAttendanceIcon = () => {
    if (!showAttendanceStatus || !entry.attendance_status) return null;
    
    switch (entry.attendance_status) {
      case 'present':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'absent':
        return <XCircle className="h-3 w-3 text-destructive" />;
      case 'late':
        return <AlertCircle className="h-3 w-3 text-warning" />;
      case 'left_early':
        return <AlertCircle className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getAttendanceBadge = () => {
    if (!showAttendanceStatus || !entry.attendance_status) return null;
    
    switch (entry.attendance_status) {
      case 'present':
        return <Badge variant="default" className="bg-success text-success-foreground text-xs">✓ Present</Badge>;
      case 'absent':
        return <Badge variant="destructive" className="text-xs">✗ Absent</Badge>;
      case 'late':
        return <Badge variant="outline" className="border-warning text-warning text-xs">⏳ Late</Badge>;
      case 'left_early':
        return <Badge variant="secondary" className="text-xs">← Left Early</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "h-20 cursor-pointer transition-all duration-200 hover:shadow-md",
        isCurrentPeriod && "ring-2 ring-primary ring-offset-2 shadow-lg",
        onClick && "hover:scale-105"
      )}
      style={{ 
        borderLeftColor: entry.subject?.color_code || '#6B7280',
        borderLeftWidth: '4px'
      }}
      onClick={onClick}
    >
      <CardContent className="p-2 h-full">
        <div className="flex flex-col justify-between h-full">
          {/* Subject and Time */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 
                className="font-semibold text-xs truncate"
                style={{ color: entry.subject?.color_code || '#374151' }}
              >
                {entry.subject?.subject_name || 'Unknown Subject'}
              </h4>
              {getAttendanceIcon()}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{period?.start_time} - {period?.end_time}</span>
            </div>
          </div>

          {/* Bottom section - Teacher, Room, Attendance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground truncate">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{entry.teacher_name || 'Teacher'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{entry.classroom?.room_name || 'Room'}</span>
              </div>
              
              {getAttendanceBadge()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}