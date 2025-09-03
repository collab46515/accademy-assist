import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useRBAC } from '@/hooks/useRBAC';
import { Search, Database, Eye, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TimetableEntryDebug {
  id: string;
  class_id: string;
  day_of_week: number;
  period_id: string;
  period_name?: string;
  period_number?: number;
  subject_name?: string;
  teacher_name?: string;
  room_name?: string;
  notes: string;
}

export function TimetableDebugger() {
  const { currentSchool } = useRBAC();
  const [entries, setEntries] = useState<TimetableEntryDebug[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDebugData = async () => {
    if (!currentSchool) return;

    setLoading(true);
    try {
      // Get timetable entries and periods separately since there's no foreign key relationship
      const [entriesResult, periodsResult] = await Promise.all([
        supabase
          .from('timetable_entries')
          .select('*')
          .eq('school_id', currentSchool.id)
          .eq('is_active', true),
        supabase
          .from('timetable_periods')
          .select('*')
          .eq('school_id', currentSchool.id)
          .eq('is_active', true)
      ]);

      if (entriesResult.error) throw entriesResult.error;
      if (periodsResult.error) throw periodsResult.error;

      // Create a lookup map for periods
      const periodsMap = new Map();
      (periodsResult.data || []).forEach(period => {
        periodsMap.set(period.id, period);
      });

      const transformedEntries = (entriesResult.data || []).map(entry => {
        const period = periodsMap.get(entry.period_id);
        const notesParts = entry.notes?.split(' - ') || [];
        
        return {
          id: entry.id,
          class_id: entry.class_id,
          day_of_week: entry.day_of_week,
          period_id: entry.period_id,
          period_name: period?.period_name || 'Unknown Period',
          period_number: period?.period_number || 0,
          subject_name: notesParts[0] || 'Unknown Subject',
          teacher_name: notesParts[1] || 'Unknown Teacher', 
          room_name: notesParts[2] || 'Unknown Room',
          notes: entry.notes || ''
        };
      });

      // Sort by class, day, then period
      transformedEntries.sort((a, b) => 
        a.class_id.localeCompare(b.class_id) ||
        a.day_of_week - b.day_of_week || 
        a.period_number - b.period_number
      );

      setEntries(transformedEntries);
    } catch (error) {
      console.error('Debug load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebugData();
  }, [currentSchool]);

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  const getClassEntries = (classId: string) => {
    return entries.filter(entry => entry.class_id === classId);
  };

  const uniqueClasses = [...new Set(entries.map(e => e.class_id))].sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Timetable Database Debug Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={loadDebugData} disabled={loading} size="sm">
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{entries.length}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{uniqueClasses.length}</div>
            <div className="text-sm text-muted-foreground">Classes with Data</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{getClassEntries('1A').length}</div>
            <div className="text-sm text-muted-foreground">Class 1A Entries</div>
          </div>
        </div>

        {uniqueClasses.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Classes with Scheduled Entries:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {uniqueClasses.map(classId => (
                <Badge key={classId} variant="outline">
                  {classId} ({getClassEntries(classId).length} entries)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {getClassEntries('1A').length > 0 ? (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Class 1A Detailed Schedule (This should appear in timetable view):
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getClassEntries('1A').map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{getDayName(entry.day_of_week)}</TableCell>
                    <TableCell>{entry.period_name}</TableCell>
                    <TableCell className="font-medium">{entry.subject_name}</TableCell>
                    <TableCell>{entry.teacher_name}</TableCell>
                    <TableCell>{entry.room_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">No entries found for Class 1A in the database.</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">All Scheduled Entries:</h3>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className={entry.class_id === '1A' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                    <TableCell className="font-medium">{entry.class_id}</TableCell>
                    <TableCell>{getDayName(entry.day_of_week)}</TableCell>
                    <TableCell>{entry.period_name}</TableCell>
                    <TableCell>{entry.subject_name}</TableCell>
                    <TableCell>{entry.teacher_name}</TableCell>
                    <TableCell>{entry.room_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}