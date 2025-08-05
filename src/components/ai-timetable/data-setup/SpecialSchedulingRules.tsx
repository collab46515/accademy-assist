import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  RotateCcw, 
  Link2, 
  Users2, 
  ArrowRight, 
  Calendar,
  Clock,
  Plus,
  X,
  AlertTriangle,
  BookOpen,
  Activity
} from "lucide-react";
import { useTimetableData } from "@/hooks/useTimetableData";

interface SpecialSchedulingRulesProps {
  onNext: () => void;
  onBack: () => void;
}

interface RotatingCycle {
  id: string;
  name: string;
  cycleLength: number;
  dayLabels: string[];
  isActive: boolean;
}

interface DoublePeriodRule {
  id: string;
  subjectId: string;
  subjectName: string;
  yearGroups: string[];
  frequency: 'always' | 'preferred' | 'sometimes';
  maxConsecutive: number;
  allowBreakSplit: boolean;
}

interface SplitClassRule {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacher1Id: string;
  teacher2Id: string;
  splitRatio: string; // e.g., "50/50", "60/40"
  rotationType: 'weekly' | 'termly' | 'custom';
}

interface SequencingRule {
  id: string;
  name: string;
  ruleType: 'avoid_after' | 'must_follow' | 'avoid_consecutive' | 'time_restriction';
  firstSubject: string;
  secondSubject?: string;
  timeSlots?: string[];
  yearGroups: string[];
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface ExamSchedulingConfig {
  enabled: boolean;
  examPeriods: string[];
  conflictChecking: boolean;
  bufferTime: number; // minutes between exams
  maxExamsPerDay: number;
  specialVenues: string[];
  invigilation: {
    teachersPerRoom: number;
    maxDutiesPerTeacher: number;
  };
}

export function SpecialSchedulingRules({ onNext, onBack }: SpecialSchedulingRulesProps) {
  const { subjects, yearGroups } = useTimetableData();
  
  // Rotating timetables
  const [rotatingCycles, setRotatingCycles] = useState<RotatingCycle[]>([
    {
      id: '1',
      name: 'Standard Week',
      cycleLength: 5,
      dayLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isActive: true
    }
  ]);

  // Double periods
  const [doublePeriodRules, setDoublePeriodRules] = useState<DoublePeriodRule[]>([]);

  // Split classes
  const [splitClassRules, setSplitClassRules] = useState<SplitClassRule[]>([]);

  // Subject sequencing
  const [sequencingRules, setSequencingRules] = useState<SequencingRule[]>([
    {
      id: '1',
      name: 'No PE after lunch',
      ruleType: 'time_restriction',
      firstSubject: 'PE',
      timeSlots: ['Period 5', 'Period 6', 'Period 7', 'Period 8'],
      yearGroups: [],
      priority: 'high',
      description: 'Avoid scheduling PE immediately after lunch periods'
    }
  ]);

  // Exam scheduling
  const [examConfig, setExamConfig] = useState<ExamSchedulingConfig>({
    enabled: false,
    examPeriods: [],
    conflictChecking: true,
    bufferTime: 15,
    maxExamsPerDay: 2,
    specialVenues: [],
    invigilation: {
      teachersPerRoom: 2,
      maxDutiesPerTeacher: 3
    }
  });

  const timeSlots = [
    'Period 1', 'Period 2', 'Period 3', 'Period 4',
    'Period 5', 'Period 6', 'Period 7', 'Period 8'
  ];

  // Rotating Cycles
  const addRotatingCycle = () => {
    const newCycle: RotatingCycle = {
      id: Date.now().toString(),
      name: `Cycle ${rotatingCycles.length + 1}`,
      cycleLength: 6,
      dayLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
      isActive: false
    };
    setRotatingCycles([...rotatingCycles, newCycle]);
  };

  const updateRotatingCycle = (id: string, field: string, value: any) => {
    setRotatingCycles(cycles => 
      cycles.map(cycle => 
        cycle.id === id ? { ...cycle, [field]: value } : cycle
      )
    );
  };

  const deleteRotatingCycle = (id: string) => {
    setRotatingCycles(cycles => cycles.filter(c => c.id !== id));
  };

  // Double Period Rules
  const addDoublePeriodRule = () => {
    const newRule: DoublePeriodRule = {
      id: Date.now().toString(),
      subjectId: '',
      subjectName: '',
      yearGroups: [],
      frequency: 'preferred',
      maxConsecutive: 2,
      allowBreakSplit: false
    };
    setDoublePeriodRules([...doublePeriodRules, newRule]);
  };

  const updateDoublePeriodRule = (id: string, field: string, value: any) => {
    setDoublePeriodRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const deleteDoublePeriodRule = (id: string) => {
    setDoublePeriodRules(rules => rules.filter(r => r.id !== id));
  };

  // Split Class Rules
  const addSplitClassRule = () => {
    const newRule: SplitClassRule = {
      id: Date.now().toString(),
      classId: '',
      className: '',
      subjectId: '',
      subjectName: '',
      teacher1Id: '',
      teacher2Id: '',
      splitRatio: '50/50',
      rotationType: 'weekly'
    };
    setSplitClassRules([...splitClassRules, newRule]);
  };

  const updateSplitClassRule = (id: string, field: string, value: any) => {
    setSplitClassRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const deleteSplitClassRule = (id: string) => {
    setSplitClassRules(rules => rules.filter(r => r.id !== id));
  };

  // Sequencing Rules
  const addSequencingRule = () => {
    const newRule: SequencingRule = {
      id: Date.now().toString(),
      name: '',
      ruleType: 'avoid_consecutive',
      firstSubject: '',
      yearGroups: [],
      priority: 'medium',
      description: ''
    };
    setSequencingRules([...sequencingRules, newRule]);
  };

  const updateSequencingRule = (id: string, field: string, value: any) => {
    setSequencingRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const deleteSequencingRule = (id: string) => {
    setSequencingRules(rules => rules.filter(r => r.id !== id));
  };

  const getRuleTypeDescription = (ruleType: string) => {
    switch (ruleType) {
      case 'avoid_after':
        return 'Avoid scheduling the second subject immediately after the first';
      case 'must_follow':
        return 'The second subject must follow the first subject';
      case 'avoid_consecutive':
        return 'Avoid scheduling these subjects in consecutive periods';
      case 'time_restriction':
        return 'Restrict subject to specific time slots';
      default:
        return '';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Special Scheduling Rules</h2>
        <p className="text-muted-foreground">Configure advanced scheduling constraints and flexibility options</p>
      </div>

      <Tabs defaultValue="rotating" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rotating">Rotating Cycles</TabsTrigger>
          <TabsTrigger value="double">Double Periods</TabsTrigger>
          <TabsTrigger value="split">Split Classes</TabsTrigger>
          <TabsTrigger value="sequencing">Sequencing</TabsTrigger>
          <TabsTrigger value="exams">Exam Mode</TabsTrigger>
        </TabsList>

        {/* Rotating Timetables */}
        <TabsContent value="rotating">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <RotateCcw className="h-5 w-5" />
                    <span>Rotating Timetable Cycles</span>
                  </CardTitle>
                  <CardDescription>Set up non-standard week cycles (e.g., 6-day rotation)</CardDescription>
                </div>
                <Button onClick={addRotatingCycle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cycle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rotatingCycles.map((cycle) => (
                  <div key={cycle.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={cycle.isActive}
                          onCheckedChange={(checked) => updateRotatingCycle(cycle.id, 'isActive', checked)}
                        />
                        <Input
                          value={cycle.name}
                          onChange={(e) => updateRotatingCycle(cycle.id, 'name', e.target.value)}
                          className="w-48"
                          placeholder="Cycle name"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        {cycle.isActive && <Badge className="bg-success text-success-foreground">Active</Badge>}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRotatingCycle(cycle.id)}
                          disabled={rotatingCycles.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Cycle Length (days)</Label>
                        <Input
                          type="number"
                          value={cycle.cycleLength}
                          onChange={(e) => {
                            const length = parseInt(e.target.value);
                            updateRotatingCycle(cycle.id, 'cycleLength', length);
                            const labels = Array.from({ length }, (_, i) => `Day ${i + 1}`);
                            updateRotatingCycle(cycle.id, 'dayLabels', labels);
                          }}
                          min="1"
                          max="10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Day Labels</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cycle.dayLabels.map((label, index) => (
                            <Input
                              key={index}
                              value={label}
                              onChange={(e) => {
                                const newLabels = [...cycle.dayLabels];
                                newLabels[index] = e.target.value;
                                updateRotatingCycle(cycle.id, 'dayLabels', newLabels);
                              }}
                              className="w-20 text-center"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Double Periods */}
        <TabsContent value="double">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5" />
                    <span>Double Period Rules</span>
                  </CardTitle>
                  <CardDescription>Configure subjects that require consecutive periods</CardDescription>
                </div>
                <Button onClick={addDoublePeriodRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doublePeriodRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Double Period Rule</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDoublePeriodRule(rule.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Subject</Label>
                        <Select
                          value={rule.subjectId}
                          onValueChange={(value) => {
                            const subject = subjects.find(s => s.id === value);
                            updateDoublePeriodRule(rule.id, 'subjectId', value);
                            updateDoublePeriodRule(rule.id, 'subjectName', subject?.subject_name || '');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.subject_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Frequency</Label>
                        <Select
                          value={rule.frequency}
                          onValueChange={(value) => updateDoublePeriodRule(rule.id, 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Always Required</SelectItem>
                            <SelectItem value="preferred">Preferred</SelectItem>
                            <SelectItem value="sometimes">Sometimes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Max Consecutive</Label>
                        <Input
                          type="number"
                          value={rule.maxConsecutive}
                          onChange={(e) => updateDoublePeriodRule(rule.id, 'maxConsecutive', parseInt(e.target.value))}
                          min="2"
                          max="4"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                          id={`break-split-${rule.id}`}
                          checked={rule.allowBreakSplit}
                          onCheckedChange={(checked) => updateDoublePeriodRule(rule.id, 'allowBreakSplit', checked)}
                        />
                        <Label htmlFor={`break-split-${rule.id}`} className="text-sm">
                          Allow break between periods
                        </Label>
                      </div>
                      <div>
                        <Label className="text-sm">Year Groups</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {yearGroups.slice(0, 3).map((yg) => (
                            <Badge key={yg} variant="outline" className="text-xs">{yg}</Badge>
                          ))}
                          {yearGroups.length > 3 && <Badge variant="outline" className="text-xs">+{yearGroups.length - 3}</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {doublePeriodRules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No double period rules configured</p>
                    <p className="text-sm">Add rules for subjects that need consecutive periods</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Split Classes */}
        <TabsContent value="split">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users2 className="h-5 w-5" />
                    <span>Split Class Rules</span>
                  </CardTitle>
                  <CardDescription>Configure classes shared between multiple teachers</CardDescription>
                </div>
                <Button onClick={addSplitClassRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {splitClassRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Split Class Configuration</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSplitClassRule(rule.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Class</Label>
                        <Input
                          value={rule.className}
                          onChange={(e) => updateSplitClassRule(rule.id, 'className', e.target.value)}
                          placeholder="e.g., Year 10A"
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Select
                          value={rule.subjectId}
                          onValueChange={(value) => {
                            const subject = subjects.find(s => s.id === value);
                            updateSplitClassRule(rule.id, 'subjectId', value);
                            updateSplitClassRule(rule.id, 'subjectName', subject?.subject_name || '');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.subject_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Split Ratio</Label>
                        <Select
                          value={rule.splitRatio}
                          onValueChange={(value) => updateSplitClassRule(rule.id, 'splitRatio', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50/50">50/50</SelectItem>
                            <SelectItem value="60/40">60/40</SelectItem>
                            <SelectItem value="70/30">70/30</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Rotation Type</Label>
                        <Select
                          value={rule.rotationType}
                          onValueChange={(value) => updateSplitClassRule(rule.id, 'rotationType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="termly">Per Term</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Auto-assigned teachers</span>
                      </div>
                    </div>
                  </div>
                ))}
                {splitClassRules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No split class rules configured</p>
                    <p className="text-sm">Add rules for classes shared between teachers</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subject Sequencing */}
        <TabsContent value="sequencing">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <ArrowRight className="h-5 w-5" />
                    <span>Subject Sequencing Rules</span>
                  </CardTitle>
                  <CardDescription>Define subject ordering and timing restrictions</CardDescription>
                </div>
                <Button onClick={addSequencingRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sequencingRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Input
                          value={rule.name}
                          onChange={(e) => updateSequencingRule(rule.id, 'name', e.target.value)}
                          placeholder="Rule name"
                          className="font-medium"
                        />
                        {getPriorityBadge(rule.priority)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSequencingRule(rule.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Rule Type</Label>
                        <Select
                          value={rule.ruleType}
                          onValueChange={(value) => updateSequencingRule(rule.id, 'ruleType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="avoid_after">Avoid After</SelectItem>
                            <SelectItem value="must_follow">Must Follow</SelectItem>
                            <SelectItem value="avoid_consecutive">Avoid Consecutive</SelectItem>
                            <SelectItem value="time_restriction">Time Restriction</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getRuleTypeDescription(rule.ruleType)}
                        </p>
                      </div>
                      <div>
                        <Label>Priority Level</Label>
                        <Select
                          value={rule.priority}
                          onValueChange={(value) => updateSequencingRule(rule.id, 'priority', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Subject</Label>
                        <Select
                          value={rule.firstSubject}
                          onValueChange={(value) => updateSequencingRule(rule.id, 'firstSubject', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.subject_name}>
                                {subject.subject_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {rule.ruleType !== 'time_restriction' && (
                        <div>
                          <Label>Second Subject</Label>
                          <Select
                            value={rule.secondSubject || ''}
                            onValueChange={(value) => updateSequencingRule(rule.id, 'secondSubject', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.subject_name}>
                                  {subject.subject_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {rule.ruleType === 'time_restriction' && (
                      <div>
                        <Label>Restricted Time Slots</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {timeSlots.map((slot) => (
                            <div key={slot} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${rule.id}-${slot}`}
                                checked={rule.timeSlots?.includes(slot) || false}
                                onCheckedChange={(checked) => {
                                  const currentSlots = rule.timeSlots || [];
                                  const newSlots = checked
                                    ? [...currentSlots, slot]
                                    : currentSlots.filter(s => s !== slot);
                                  updateSequencingRule(rule.id, 'timeSlots', newSlots);
                                }}
                              />
                              <Label htmlFor={`${rule.id}-${slot}`} className="text-sm">{slot}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={rule.description}
                        onChange={(e) => updateSequencingRule(rule.id, 'description', e.target.value)}
                        placeholder="Describe the reasoning for this rule..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exam Scheduling */}
        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Exam Scheduling Mode</span>
              </CardTitle>
              <CardDescription>Configure special exam timetabling with conflict detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={examConfig.enabled}
                  onCheckedChange={(checked) => setExamConfig(prev => ({ ...prev, enabled: checked }))}
                />
                <Label className="text-base font-medium">Enable Exam Scheduling Mode</Label>
              </div>

              {examConfig.enabled && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Buffer Time (minutes)</Label>
                      <Input
                        type="number"
                        value={examConfig.bufferTime}
                        onChange={(e) => setExamConfig(prev => ({ 
                          ...prev, 
                          bufferTime: parseInt(e.target.value) || 0 
                        }))}
                        min="0"
                        max="60"
                      />
                    </div>
                    <div>
                      <Label>Max Exams per Day</Label>
                      <Input
                        type="number"
                        value={examConfig.maxExamsPerDay}
                        onChange={(e) => setExamConfig(prev => ({ 
                          ...prev, 
                          maxExamsPerDay: parseInt(e.target.value) || 1 
                        }))}
                        min="1"
                        max="8"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={examConfig.conflictChecking}
                      onCheckedChange={(checked) => setExamConfig(prev => ({ 
                        ...prev, 
                        conflictChecking: checked === true 
                      }))}
                    />
                    <Label>Enable automatic conflict detection</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Teachers per Room</Label>
                      <Input
                        type="number"
                        value={examConfig.invigilation.teachersPerRoom}
                        onChange={(e) => setExamConfig(prev => ({
                          ...prev,
                          invigilation: {
                            ...prev.invigilation,
                            teachersPerRoom: parseInt(e.target.value) || 1
                          }
                        }))}
                        min="1"
                        max="5"
                      />
                    </div>
                    <div>
                      <Label>Max Duties per Teacher</Label>
                      <Input
                        type="number"
                        value={examConfig.invigilation.maxDutiesPerTeacher}
                        onChange={(e) => setExamConfig(prev => ({
                          ...prev,
                          invigilation: {
                            ...prev.invigilation,
                            maxDutiesPerTeacher: parseInt(e.target.value) || 1
                          }
                        }))}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Exam Mode Features</p>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Automatic conflict detection for students with multiple exams</li>
                          <li>• Buffer time enforcement between consecutive exams</li>
                          <li>• Invigilation duty assignment optimization</li>
                          <li>• Special venue allocation for exam conditions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Special Rules Summary</CardTitle>
          <CardDescription>Review configured special scheduling rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Rotating Cycles</p>
              <p className="text-2xl font-bold text-primary">{rotatingCycles.filter(c => c.isActive).length}</p>
              <p className="text-xs text-muted-foreground">Active cycles</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Link2 className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="font-medium">Double Periods</p>
              <p className="text-2xl font-bold text-success">{doublePeriodRules.length}</p>
              <p className="text-xs text-muted-foreground">Configured rules</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users2 className="h-8 w-8 mx-auto mb-2 text-warning" />
              <p className="font-medium">Split Classes</p>
              <p className="text-2xl font-bold text-warning">{splitClassRules.length}</p>
              <p className="text-xs text-muted-foreground">Shared classes</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <ArrowRight className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="font-medium">Sequencing Rules</p>
              <p className="text-2xl font-bold text-destructive">{sequencingRules.length}</p>
              <p className="text-xs text-muted-foreground">Sequence constraints</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Exam Mode</p>
              <p className="text-2xl font-bold text-purple-600">{examConfig.enabled ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-muted-foreground">Special scheduling</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back: Facilities & Resources
        </Button>
        <Button onClick={onNext}>
          Next: AI Generation
        </Button>
      </div>
    </div>
  );
}