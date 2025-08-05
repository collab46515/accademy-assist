import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, AlertTriangle, Clock, CheckCircle, Settings, Zap } from "lucide-react";

interface ChangeEvent {
  id: string;
  type: 'teacher_absence' | 'room_unavailable' | 'class_cancelled' | 'new_subject' | 'schedule_change';
  severity: 'minor' | 'major' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  requiresRegeneration: boolean;
  autoProcessed: boolean;
}

interface RegenerationTask {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  estimatedDuration: number;
  affectedPeriods: number;
  preservedConstraints: number;
  totalConstraints: number;
}

export function AutoRegeneration() {
  const [autoMode, setAutoMode] = useState(true);
  const [threshold, setThreshold] = useState<'minor' | 'major' | 'critical'>('major');
  const [changes, setChanges] = useState<ChangeEvent[]>([]);
  const [currentTask, setCurrentTask] = useState<RegenerationTask | null>(null);

  // Mock change events
  const mockChanges: ChangeEvent[] = [
    {
      id: 'change-1',
      type: 'teacher_absence',
      severity: 'major',
      title: 'Long-term Teacher Absence',
      description: 'Sarah Johnson will be absent for 2 weeks starting Monday',
      timestamp: new Date().toISOString(),
      requiresRegeneration: true,
      autoProcessed: false
    },
    {
      id: 'change-2',
      type: 'room_unavailable',
      severity: 'critical',
      title: 'Science Lab Closure',
      description: 'S201 closed for maintenance - all Physics practicals need relocation',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      requiresRegeneration: true,
      autoProcessed: true
    },
    {
      id: 'change-3',
      type: 'schedule_change',
      severity: 'minor',
      title: 'Assembly Schedule Change',
      description: 'Weekly assembly moved from Monday to Friday',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      requiresRegeneration: false,
      autoProcessed: true
    }
  ];

  const mockTask: RegenerationTask = {
    id: 'task-1',
    status: 'running',
    progress: 65,
    startedAt: new Date().toISOString(),
    estimatedDuration: 300, // seconds
    affectedPeriods: 45,
    preservedConstraints: 127,
    totalConstraints: 134
  };

  const triggerRegeneration = (changeIds: string[]) => {
    setCurrentTask(mockTask);
    
    // Simulate progress
    const interval = setInterval(() => {
      setCurrentTask(prev => {
        if (!prev || prev.progress >= 100) {
          clearInterval(interval);
          return prev ? { ...prev, status: 'completed', progress: 100 } : null;
        }
        return { ...prev, progress: prev.progress + 5 };
      });
    }, 1000);

    // Mark changes as processed
    setChanges(prev => 
      prev.map(change => 
        changeIds.includes(change.id) 
          ? { ...change, autoProcessed: true }
          : change
      )
    );
  };

  const addMockChange = () => {
    setChanges([...changes, ...mockChanges]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'minor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teacher_absence': return '👨‍🏫';
      case 'room_unavailable': return '🏫';
      case 'class_cancelled': return '❌';
      case 'new_subject': return '📚';
      case 'schedule_change': return '📅';
      default: return '⚡';
    }
  };

  const pendingChanges = changes.filter(c => c.requiresRegeneration && !c.autoProcessed);
  const shouldAutoTrigger = autoMode && pendingChanges.some(c => 
    (threshold === 'minor') ||
    (threshold === 'major' && ['major', 'critical'].includes(c.severity)) ||
    (threshold === 'critical' && c.severity === 'critical')
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Automatic Timetable Regeneration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Switch 
                  checked={autoMode} 
                  onCheckedChange={setAutoMode}
                />
                <span className="font-medium">Auto-regeneration</span>
                <Badge variant={autoMode ? "default" : "secondary"}>
                  {autoMode ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically regenerate timetable when major changes occur
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>

          {autoMode && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h4 className="font-medium">Trigger Threshold</h4>
              <div className="flex gap-2">
                {(['minor', 'major', 'critical'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={threshold === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setThreshold(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-regenerate when changes reach <strong>{threshold}</strong> severity or higher
              </p>
            </div>
          )}

          <Button onClick={addMockChange} variant="outline">
            Simulate Changes
          </Button>
        </CardContent>
      </Card>

      {shouldAutoTrigger && pendingChanges.length > 0 && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {pendingChanges.length} pending change{pendingChanges.length > 1 ? 's' : ''} require regeneration
            </span>
            <Button 
              size="sm"
              onClick={() => triggerRegeneration(pendingChanges.map(c => c.id))}
            >
              Auto-Regenerate Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {currentTask && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 ${currentTask.status === 'running' ? 'animate-spin' : ''}`} />
              Regeneration in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{currentTask.progress}%</span>
              </div>
              <Progress value={currentTask.progress} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">Status</div>
                <Badge variant={currentTask.status === 'running' ? "default" : "secondary"}>
                  {currentTask.status}
                </Badge>
              </div>
              <div>
                <div className="font-medium">Affected Periods</div>
                <div>{currentTask.affectedPeriods}</div>
              </div>
              <div>
                <div className="font-medium">Constraints</div>
                <div>{currentTask.preservedConstraints}/{currentTask.totalConstraints}</div>
              </div>
              <div>
                <div className="font-medium">Time Remaining</div>
                <div>
                  {Math.round((currentTask.estimatedDuration * (100 - currentTask.progress)) / 100)}s
                </div>
              </div>
            </div>

            {currentTask.status === 'completed' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Timetable regeneration completed successfully. {currentTask.affectedPeriods} periods updated.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {changes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {changes.map((change) => (
              <div key={change.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(change.type)}</span>
                    <div>
                      <h4 className="font-medium">{change.title}</h4>
                      <p className="text-sm text-muted-foreground">{change.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(change.severity)}`} />
                    <Badge variant="outline" className="text-xs">
                      {change.severity}
                    </Badge>
                    {change.autoProcessed && (
                      <Badge variant="default" className="text-xs">
                        Processed
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(change.timestamp).toLocaleString()}</span>
                  {change.requiresRegeneration && !change.autoProcessed && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => triggerRegeneration([change.id])}
                    >
                      Regenerate Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}