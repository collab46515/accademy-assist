import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, MapPin, Users, CheckCircle, XCircle } from "lucide-react";

interface Conflict {
  id: string;
  type: 'room_double_booking' | 'teacher_double_booking' | 'student_clash' | 'resource_unavailable';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedPeriods: Array<{
    day: string;
    period: number;
    time: string;
  }>;
  affectedResources: Array<{
    type: 'teacher' | 'room' | 'class' | 'student';
    name: string;
    id: string;
  }>;
  autoFixable: boolean;
  detectedAt: string;
}

export function ConflictDetector() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date());

  // Mock real-time conflicts
  const mockConflicts: Conflict[] = [
    {
      id: 'conflict-1',
      type: 'room_double_booking',
      severity: 'critical',
      title: 'Room Double Booking',
      description: 'Room S201 is booked for both Physics (Year 11B) and Chemistry (Year 10A) at the same time',
      affectedPeriods: [
        { day: 'Monday', period: 3, time: '11:00-12:00' }
      ],
      affectedResources: [
        { type: 'room', name: 'S201', id: 'room-s201' },
        { type: 'teacher', name: 'Sarah Johnson', id: 'teacher-1' },
        { type: 'teacher', name: 'Mark Williams', id: 'teacher-2' },
        { type: 'class', name: 'Year 11B', id: 'class-11b' },
        { type: 'class', name: 'Year 10A', id: 'class-10a' }
      ],
      autoFixable: true,
      detectedAt: new Date().toISOString()
    },
    {
      id: 'conflict-2',
      type: 'teacher_double_booking',
      severity: 'high',
      title: 'Teacher Double Booking',
      description: 'Emily Davis is scheduled for Mathematics in M101 and Physics in S202 simultaneously',
      affectedPeriods: [
        { day: 'Tuesday', period: 2, time: '09:30-10:30' }
      ],
      affectedResources: [
        { type: 'teacher', name: 'Emily Davis', id: 'teacher-3' },
        { type: 'room', name: 'M101', id: 'room-m101' },
        { type: 'room', name: 'S202', id: 'room-s202' },
        { type: 'class', name: 'Year 9A', id: 'class-9a' },
        { type: 'class', name: 'Year 10C', id: 'class-10c' }
      ],
      autoFixable: false,
      detectedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate real-time conflict detection
        setLastCheck(new Date());
        // In real implementation, this would check against live timetable data
        if (Math.random() > 0.8) {
          setConflicts(mockConflicts);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'room_double_booking': return <MapPin className="h-4 w-4" />;
      case 'teacher_double_booking': return <Users className="h-4 w-4" />;
      case 'student_clash': return <Users className="h-4 w-4" />;
      case 'resource_unavailable': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const resolveConflict = (conflictId: string, method: 'auto' | 'manual') => {
    if (method === 'auto') {
      // Auto-resolve logic would go here
      setConflicts(conflicts.filter(c => c.id !== conflictId));
    } else {
      // Manual resolution would open detailed editor
      console.log(`Manual resolution for conflict ${conflictId}`);
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Real-Time Conflict Detection
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last check: {lastCheck.toLocaleTimeString()}
              </div>
              <Button
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
                onClick={toggleMonitoring}
              >
                {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm">
              Monitoring Status: {isMonitoring ? 'Active' : 'Stopped'}
            </span>
            {conflicts.length > 0 && (
              <Badge variant="destructive">
                {conflicts.length} conflict{conflicts.length > 1 ? 's' : ''} detected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {conflicts.length === 0 && isMonitoring && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            No conflicts detected. Timetable is running smoothly.
          </AlertDescription>
        </Alert>
      )}

      {conflicts.map((conflict) => (
        <Card key={conflict.id} className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(conflict.severity)}`} />
                <div className="flex items-center gap-2">
                  {getTypeIcon(conflict.type)}
                  <h3 className="font-medium">{conflict.title}</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {conflict.severity.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(conflict.detectedAt).toLocaleTimeString()}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{conflict.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Affected Periods
                </h4>
                {conflict.affectedPeriods.map((period, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{period.day}</Badge>
                    <span>Period {period.period}</span>
                    <span className="text-muted-foreground">({period.time})</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Affected Resources</h4>
                <div className="space-y-1">
                  {conflict.affectedResources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {resource.type === 'teacher' && <Users className="h-3 w-3" />}
                      {resource.type === 'room' && <MapPin className="h-3 w-3" />}
                      {resource.type === 'class' && <Users className="h-3 w-3" />}
                      <span className="capitalize">{resource.type}:</span>
                      <span className="font-medium">{resource.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {conflict.autoFixable && (
                <Button
                  size="sm"
                  onClick={() => resolveConflict(conflict.id, 'auto')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Auto-Resolve
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => resolveConflict(conflict.id, 'manual')}
              >
                Manual Fix
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConflicts(conflicts.filter(c => c.id !== conflict.id))}
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}