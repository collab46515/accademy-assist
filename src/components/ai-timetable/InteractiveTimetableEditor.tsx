import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Square,
  Eye,
  EyeOff,
  Zap
} from "lucide-react";

// Custom node types for the timetable
const TimeSlotNode = ({ data }: { data: any }) => {
  return (
    <div className={`time-slot-node ${data.type}`}>
      <div className="time-label">{data.time}</div>
      <div className="day-label">{data.day}</div>
    </div>
  );
};

const ClassPeriodNode = ({ data }: { data: any }) => {
  const hasConflict = data.conflicts && data.conflicts.length > 0;
  const hasWarning = data.warnings && data.warnings.length > 0;
  
  return (
    <div className={`class-period-node ${hasConflict ? 'conflict' : ''} ${hasWarning ? 'warning' : ''}`}>
      <div className="subject-header" style={{ backgroundColor: data.subjectColor }}>
        <div className="subject-name">{data.subject}</div>
        {(hasConflict || hasWarning) && (
          <div className="status-indicators">
            {hasConflict && <AlertTriangle className="h-3 w-3 text-destructive" />}
            {hasWarning && <AlertTriangle className="h-3 w-3 text-warning" />}
          </div>
        )}
      </div>
      <div className="class-details">
        <div className="class-name">{data.className}</div>
        <div className="teacher-name">{data.teacher}</div>
        <div className="room-name">{data.room}</div>
      </div>
      {data.isSimulation && (
        <div className="simulation-badge">
          <Badge variant="outline" className="text-xs">Simulation</Badge>
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  timeSlot: TimeSlotNode,
  classPeriod: ClassPeriodNode,
};

interface TimetableEditorProps {
  timetableData?: any;
  initialTimetable?: any;
  onSave?: (timetable: any) => void;
  onClose?: () => void;
  onValidationChange?: (isValid: boolean, issues: any[]) => void;
}

export function InteractiveTimetableEditor({ 
  timetableData,
  initialTimetable, 
  onSave, 
  onClose,
  onValidationChange 
}: TimetableEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [originalNodes, setOriginalNodes] = useState<Node[]>([]);
  const [validationResults, setValidationResults] = useState<any>({
    isValid: true,
    conflicts: [],
    warnings: [],
    suggestions: []
  });
  const [isValidating, setIsValidating] = useState(false);
  const [showConstraints, setShowConstraints] = useState(true);

  // Days and time slots configuration
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { id: 'p1', label: 'Period 1', time: '08:00-08:45' },
    { id: 'p2', label: 'Period 2', time: '08:45-09:30' },
    { id: 'p3', label: 'Break', time: '09:30-09:45', isBreak: true },
    { id: 'p4', label: 'Period 3', time: '09:45-10:30' },
    { id: 'p5', label: 'Period 4', time: '10:30-11:15' },
    { id: 'p6', label: 'Lunch', time: '11:15-12:00', isBreak: true },
    { id: 'p7', label: 'Period 5', time: '12:00-12:45' },
    { id: 'p8', label: 'Period 6', time: '12:45-13:30' },
  ];

  // Initialize timetable grid
  useEffect(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // Create time slot nodes (grid positions)
    days.forEach((day, dayIndex) => {
      timeSlots.forEach((slot, slotIndex) => {
        if (!slot.isBreak) {
          const nodeId = `slot-${day}-${slot.id}`;
          initialNodes.push({
            id: nodeId,
            type: 'timeSlot',
            position: { x: dayIndex * 200, y: slotIndex * 120 },
            data: {
              day,
              time: slot.time,
              type: 'time-slot'
            },
            selectable: false,
            draggable: false,
          });
        }
      });
    });

    // Add mock class period nodes
    const mockClasses = [
      {
        id: 'class-math-mon-p1',
        subject: 'Mathematics',
        className: 'Year 10A',
        teacher: 'Mr. Smith',
        room: 'Room 101',
        day: 'Monday',
        period: 'p1',
        subjectColor: '#3B82F6',
        conflicts: [],
        warnings: []
      },
      {
        id: 'class-physics-mon-p2',
        subject: 'Physics',
        className: 'Year 11B',
        teacher: 'Dr. Johnson',
        room: 'Physics Lab',
        day: 'Monday',
        period: 'p2',
        subjectColor: '#EF4444',
        conflicts: ['Room conflict with Chemistry'],
        warnings: []
      },
      {
        id: 'class-english-tue-p1',
        subject: 'English Literature',
        className: 'Year 10A',
        teacher: 'Ms. Wilson',
        room: 'Room 102',
        day: 'Tuesday',
        period: 'p1',
        subjectColor: '#10B981',
        conflicts: [],
        warnings: ['Teacher has back-to-back classes']
      }
    ];

    mockClasses.forEach((classData, index) => {
      const dayIndex = days.indexOf(classData.day);
      const slotIndex = timeSlots.findIndex(slot => slot.id === classData.period);
      
      initialNodes.push({
        id: classData.id,
        type: 'classPeriod',
        position: { 
          x: dayIndex * 200 + 10, 
          y: slotIndex * 120 + 10 
        },
        data: {
          ...classData,
          isSimulation: isSimulationMode
        },
        draggable: true,
      });
    });

    setNodes(initialNodes);
    setOriginalNodes([...initialNodes]);
  }, [isSimulationMode]);

  // Real-time validation when nodes change
  const validateTimetable = useCallback(async (currentNodes: Node[]) => {
    setIsValidating(true);
    
    // Simulate AI validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const classPeriods = currentNodes.filter(node => node.type === 'classPeriod');
    const conflicts: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for overlapping positions (same teacher, same time)
    classPeriods.forEach((node1, i) => {
      classPeriods.slice(i + 1).forEach(node2 => {
        const pos1 = node1.position;
        const pos2 = node2.position;
        
        // If nodes are very close (same time slot)
        if (Math.abs(pos1.x - pos2.x) < 50 && Math.abs(pos1.y - pos2.y) < 50) {
          if (node1.data.teacher === node2.data.teacher) {
            conflicts.push(`Teacher ${node1.data.teacher} has overlapping classes`);
          }
          if (node1.data.room === node2.data.room) {
            conflicts.push(`Room ${node1.data.room} is double-booked`);
          }
        }
      });
    });

      // Check for constraint violations
      classPeriods.forEach(node => {
        const data = node.data;
        
        // Check if PE is scheduled after lunch
        if (data.subject && typeof data.subject === 'string' && data.subject === 'Physical Education') {
          const yPos = node.position.y;
          const lunchSlotY = timeSlots.findIndex(slot => slot.id === 'p6') * 120;
          if (yPos > lunchSlotY) {
            warnings.push(`PE scheduled after lunch for ${data.className}`);
          }
        }
        
        // Check lab requirements
        if (data.subject && typeof data.subject === 'string' && 
            (data.subject.includes('Physics') || data.subject.includes('Chemistry'))) {
          if (data.room && typeof data.room === 'string' && !data.room.includes('Lab')) {
            warnings.push(`${data.subject} needs laboratory, currently in ${data.room}`);
          }
        }
      });

    // Generate suggestions
    if (conflicts.length === 0 && warnings.length < 3) {
      suggestions.push('Consider balancing teacher workload across days');
      suggestions.push('Room utilization could be optimized');
    }

    const results = {
      isValid: conflicts.length === 0,
      conflicts,
      warnings,
      suggestions
    };

    setValidationResults(results);
    onValidationChange?.(results.isValid, [...conflicts, ...warnings]);
    setIsValidating(false);
  }, [onValidationChange]);

  // Handle node drag end - trigger validation
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    
    // If it's a position change, trigger validation
    const hasPositionChange = changes.some((change: any) => 
      change.type === 'position' && change.dragging === false
    );
    
    if (hasPositionChange) {
      // Update the nodes and validate
      setNodes(currentNodes => {
        const updatedNodes = [...currentNodes];
        setTimeout(() => validateTimetable(updatedNodes), 100);
        return updatedNodes;
      });
    }
  }, [onNodesChange, validateTimetable]);

  const handleSave = () => {
    if (isSimulationMode) {
      // Apply simulation changes to main timetable
      setOriginalNodes([...nodes]);
      setIsSimulationMode(false);
    }
    onSave?.(nodes);
  };

  const handleRevert = () => {
    if (isSimulationMode) {
      setNodes([...originalNodes]);
    }
  };

  const toggleSimulationMode = () => {
    if (!isSimulationMode) {
      // Entering simulation mode - save current state
      setOriginalNodes([...nodes]);
    }
    setIsSimulationMode(!isSimulationMode);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Controls */}
      <div className="flex justify-between items-center p-4 bg-background border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">Interactive Timetable Editor</h2>
          {isValidating && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">Validating...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showConstraints}
              onCheckedChange={setShowConstraints}
            />
            <Label>Show Constraints</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={isSimulationMode}
              onCheckedChange={toggleSimulationMode}
            />
            <Label className="flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>Simulation Mode</span>
            </Label>
          </div>

          {isSimulationMode && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleRevert} size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Revert
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          )}
          
          {!isSimulationMode && (
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Timetable
            </Button>
          )}
        </div>
      </div>

      {/* Validation Status */}
      {(validationResults.conflicts.length > 0 || validationResults.warnings.length > 0) && (
        <div className="px-4">
          {validationResults.conflicts.length > 0 && (
            <Alert className="mb-2 border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Conflicts detected:</strong>
                <ul className="list-disc list-inside mt-1">
                  {validationResults.conflicts.map((conflict: string, index: number) => (
                    <li key={index} className="text-sm">{conflict}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {validationResults.warnings.length > 0 && (
            <Alert className="border-warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warnings:</strong>
                <ul className="list-disc list-inside mt-1">
                  {validationResults.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Simulation Mode Banner */}
      {isSimulationMode && (
        <div className="px-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Play className="h-4 w-4" />
            <AlertDescription>
              <strong>Simulation Mode Active</strong> - You can freely experiment with changes. 
              Use "Apply Changes" to make them permanent or "Revert" to discard.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Timetable Editor */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          className={`bg-muted/20 ${isSimulationMode ? 'simulation-mode' : ''}`}
        >
          <Background gap={20} size={1} />
          <Controls />
          <MiniMap 
            nodeStrokeColor={(n) => n.type === 'classPeriod' ? '#000' : '#ccc'}
            nodeColor={(n) => {
              if (n.type === 'classPeriod' && n.data?.subjectColor) {
                return String(n.data.subjectColor);
              }
              return n.type === 'classPeriod' ? '#666' : '#f0f0f0';
            }}
          />
        </ReactFlow>
      </div>

      {/* Validation Results Panel */}
      <div className="p-4 border-t bg-background">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                {validationResults.isValid ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                <span>Validation Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validationResults.isValid ? 'Valid' : 'Issues Found'}
              </div>
              <p className="text-sm text-muted-foreground">
                {validationResults.conflicts.length} conflicts, {validationResults.warnings.length} warnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>AI Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{validationResults.suggestions.length}</div>
              <p className="text-sm text-muted-foreground">
                Optimization opportunities available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Square className="h-4 w-4 text-warning" />
                <span>Utilization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-sm text-muted-foreground">
                Room and teacher utilization
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}