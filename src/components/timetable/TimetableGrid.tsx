import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimetableCard } from './TimetableCard';
import { useTimetableData, TimetablePeriod } from '@/hooks/useTimetableData';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimetableGridProps {
  classId: string;
  showAttendanceStatus?: boolean;
  onPeriodClick?: (entry: any, period: TimetablePeriod, day: string) => void;
}

export function TimetableGrid({ 
  classId, 
  showAttendanceStatus = false, 
  onPeriodClick 
}: TimetableGridProps) {
  const { 
    periods, 
    getTimetableGrid, 
    getCurrentPeriod,
    loading 
  } = useTimetableData();

  const timetableGrid = getTimetableGrid(classId);
  const currentPeriod = getCurrentPeriod();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Filter out break periods for the grid display
  const classPeriods = periods.filter(period => !period.is_break);
  
  // Get current day
  const currentDay = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
  const currentDayName = currentDay === 0 ? null : days[currentDay - 1];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading timetable...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCurrentPeriod = (period: TimetablePeriod, day: string) => {
    return currentPeriod?.id === period.id && currentDayName === day;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Weekly Timetable - {classId}
          {showAttendanceStatus && (
            <Badge variant="outline" className="ml-auto">
              Attendance View
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[800px]">
            {/* Header row */}
            <div className="font-semibold text-sm p-2 text-center border-b">
              Time
            </div>
            {days.map((day) => (
              <div 
                key={day} 
                className={cn(
                  "font-semibold text-sm p-2 text-center border-b",
                  currentDayName === day && "bg-primary/10 text-primary rounded-t-lg"
                )}
              >
                {day}
                {currentDayName === day && (
                  <Badge variant="secondary" className="ml-1 text-xs">Today</Badge>
                )}
              </div>
            ))}

            {/* Timetable grid */}
            {classPeriods.map((period) => {
              const periodElements = [
                // Time column
                <div key={`time-${period.id}`} className="p-2 text-xs text-center border-r bg-muted/50 flex flex-col justify-center">
                  <div className="font-medium">{period.period_name}</div>
                  <div className="text-muted-foreground">
                    {period.start_time} - {period.end_time}
                  </div>
                </div>,
                // Day columns
                ...days.map((day) => (
                  <div key={`${day}-${period.id}`} className="p-1">
                    <TimetableCard
                      entry={timetableGrid[day]?.[period.id] || null}
                      period={period}
                      isCurrentPeriod={isCurrentPeriod(period, day)}
                      showAttendanceStatus={showAttendanceStatus}
                      onClick={() => {
                        const entry = timetableGrid[day]?.[period.id];
                        if (entry && onPeriodClick) {
                          onPeriodClick(entry, period, day);
                        }
                      }}
                    />
                  </div>
                ))
              ];
              return periodElements;
            })}
          </div>
        </div>

        {/* Legend */}
        {showAttendanceStatus && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Attendance Status:</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="default" className="bg-success text-success-foreground">
                ✓ Present
              </Badge>
              <Badge variant="destructive">
                ✗ Absent
              </Badge>
              <Badge variant="outline" className="border-warning text-warning">
                ⏳ Late
              </Badge>
              <Badge variant="secondary">
                ← Left Early
              </Badge>
              <Badge variant="outline">
                No Status
              </Badge>
            </div>
          </div>
        )}

        {/* Current period indicator */}
        {currentPeriod && currentDayName && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Current Period: {currentPeriod.period_name} ({currentPeriod.start_time} - {currentPeriod.end_time})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}