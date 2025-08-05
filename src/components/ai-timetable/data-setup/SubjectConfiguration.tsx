import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Plus, Edit2, Trash2, FlaskConical, Computer, Clock } from "lucide-react";
import { useTimetableData } from "@/hooks/useTimetableData";

interface SubjectConfigurationProps {
  onNext: () => void;
  onBack: () => void;
}

interface SubjectConfig {
  id: string;
  name: string;
  code: string;
  color: string;
  yearGroups: string[];
  periodsPerWeek: Record<string, number>;
  periodDuration: number;
  requiresLab: boolean;
  requiresComputer: boolean;
  requiresProjector: boolean;
  maxClassSize: number;
  consecutivePeriods: boolean;
  preferredTimeSlots: string[];
  restrictedTimeSlots: string[];
}

export function SubjectConfiguration({ onNext, onBack }: SubjectConfigurationProps) {
  const { subjects, yearGroups } = useTimetableData();
  const [subjectConfigs, setSubjectConfigs] = useState<SubjectConfig[]>([]);
  const [editingSubject, setEditingSubject] = useState<SubjectConfig | null>(null);
  const [isNewSubject, setIsNewSubject] = useState(false);

  // Initialize with existing subjects
  useEffect(() => {
    const configs = subjects.map(subject => ({
      id: subject.id,
      name: subject.subject_name,
      code: subject.subject_code,
      color: subject.color_code,
      yearGroups: [],
      periodsPerWeek: {},
      periodDuration: 45,
      requiresLab: subject.requires_lab,
      requiresComputer: false,
      requiresProjector: false,
      maxClassSize: 30,
      consecutivePeriods: false,
      preferredTimeSlots: [],
      restrictedTimeSlots: []
    }));
    setSubjectConfigs(configs);
  }, [subjects]);

  const timeSlots = [
    'Period 1 (8:00-8:45)',
    'Period 2 (8:45-9:30)',
    'Period 3 (9:45-10:30)',
    'Period 4 (10:30-11:15)',
    'Period 5 (12:00-12:45)',
    'Period 6 (12:45-13:30)',
    'Period 7 (13:30-14:15)',
    'Period 8 (14:15-15:00)'
  ];

  const defaultSubject: SubjectConfig = {
    id: '',
    name: '',
    code: '',
    color: '#3B82F6',
    yearGroups: [],
    periodsPerWeek: {},
    periodDuration: 45,
    requiresLab: false,
    requiresComputer: false,
    requiresProjector: false,
    maxClassSize: 30,
    consecutivePeriods: false,
    preferredTimeSlots: [],
    restrictedTimeSlots: []
  };

  const handleEditSubject = (subject?: SubjectConfig) => {
    if (subject) {
      setEditingSubject({ ...subject });
      setIsNewSubject(false);
    } else {
      setEditingSubject({ ...defaultSubject, id: Date.now().toString() });
      setIsNewSubject(true);
    }
  };

  const handleSaveSubject = () => {
    if (!editingSubject) return;

    if (isNewSubject) {
      setSubjectConfigs([...subjectConfigs, editingSubject]);
    } else {
      setSubjectConfigs(subjectConfigs.map(s => 
        s.id === editingSubject.id ? editingSubject : s
      ));
    }
    setEditingSubject(null);
    setIsNewSubject(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjectConfigs(subjectConfigs.filter(s => s.id !== id));
  };

  const updateEditingSubject = (field: string, value: any) => {
    if (!editingSubject) return;
    setEditingSubject({ ...editingSubject, [field]: value });
  };

  const toggleYearGroup = (yearGroup: string) => {
    if (!editingSubject) return;
    const yearGroups = editingSubject.yearGroups.includes(yearGroup)
      ? editingSubject.yearGroups.filter(yg => yg !== yearGroup)
      : [...editingSubject.yearGroups, yearGroup];
    updateEditingSubject('yearGroups', yearGroups);
  };

  const updatePeriodsPerWeek = (yearGroup: string, periods: number) => {
    if (!editingSubject) return;
    const periodsPerWeek = { ...editingSubject.periodsPerWeek, [yearGroup]: periods };
    updateEditingSubject('periodsPerWeek', periodsPerWeek);
  };

  const toggleTimeSlot = (slot: string, type: 'preferred' | 'restricted') => {
    if (!editingSubject) return;
    const field = type === 'preferred' ? 'preferredTimeSlots' : 'restrictedTimeSlots';
    const currentSlots = editingSubject[field];
    const newSlots = currentSlots.includes(slot)
      ? currentSlots.filter(s => s !== slot)
      : [...currentSlots, slot];
    updateEditingSubject(field, newSlots);
  };

  const getRequirementsText = (subject: SubjectConfig) => {
    const requirements = [];
    if (subject.requiresLab) requirements.push('Lab');
    if (subject.requiresComputer) requirements.push('Computer');
    if (subject.requiresProjector) requirements.push('Projector');
    return requirements.length > 0 ? requirements.join(', ') : 'None';
  };

  const getTotalPeriodsForSubject = (subject: SubjectConfig) => {
    return Object.values(subject.periodsPerWeek).reduce((sum, periods) => sum + periods, 0);
  };

  if (editingSubject) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">
            {isNewSubject ? 'Add New Subject' : 'Edit Subject'}
          </h2>
          <p className="text-muted-foreground">Configure subject requirements and constraints</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    value={editingSubject.name}
                    onChange={(e) => updateEditingSubject('name', e.target.value)}
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-code">Subject Code</Label>
                  <Input
                    id="subject-code"
                    value={editingSubject.code}
                    onChange={(e) => updateEditingSubject('code', e.target.value)}
                    placeholder="MATH"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject-color">Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="subject-color"
                      type="color"
                      value={editingSubject.color}
                      onChange={(e) => updateEditingSubject('color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={editingSubject.color}
                      onChange={(e) => updateEditingSubject('color', e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="period-duration">Period Duration (min)</Label>
                  <Input
                    id="period-duration"
                    type="number"
                    value={editingSubject.periodDuration}
                    onChange={(e) => updateEditingSubject('periodDuration', parseInt(e.target.value))}
                    min="30"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="max-class-size">Maximum Class Size</Label>
                <Input
                  id="max-class-size"
                  type="number"
                  value={editingSubject.maxClassSize}
                  onChange={(e) => updateEditingSubject('maxClassSize', parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires-lab"
                    checked={editingSubject.requiresLab}
                    onCheckedChange={(checked) => updateEditingSubject('requiresLab', checked)}
                  />
                  <Label htmlFor="requires-lab" className="flex items-center space-x-2">
                    <FlaskConical className="h-4 w-4" />
                    <span>Requires Laboratory</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires-computer"
                    checked={editingSubject.requiresComputer}
                    onCheckedChange={(checked) => updateEditingSubject('requiresComputer', checked)}
                  />
                  <Label htmlFor="requires-computer" className="flex items-center space-x-2">
                    <Computer className="h-4 w-4" />
                    <span>Requires Computer Room</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires-projector"
                    checked={editingSubject.requiresProjector}
                    onCheckedChange={(checked) => updateEditingSubject('requiresProjector', checked)}
                  />
                  <Label htmlFor="requires-projector" className="flex items-center space-x-2">
                    <span>📹</span>
                    <span>Requires Projector</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consecutive-periods"
                    checked={editingSubject.consecutivePeriods}
                    onCheckedChange={(checked) => updateEditingSubject('consecutivePeriods', checked)}
                  />
                  <Label htmlFor="consecutive-periods" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Consecutive Periods Preferred</span>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year Groups & Periods */}
          <Card>
            <CardHeader>
              <CardTitle>Year Groups & Periods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Taught to Year Groups</Label>
                <div className="grid grid-cols-3 gap-2">
                  {yearGroups.map((yearGroup) => (
                    <div key={yearGroup} className="flex items-center space-x-2">
                      <Checkbox
                        id={`year-${yearGroup}`}
                        checked={editingSubject.yearGroups.includes(yearGroup)}
                        onCheckedChange={() => toggleYearGroup(yearGroup)}
                      />
                      <Label htmlFor={`year-${yearGroup}`} className="text-sm">{yearGroup}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Periods per Week by Year Group</Label>
                <div className="space-y-2">
                  {editingSubject.yearGroups.map((yearGroup) => (
                    <div key={yearGroup} className="flex items-center space-x-2">
                      <Label className="w-20 text-sm">{yearGroup}:</Label>
                      <Input
                        type="number"
                        value={editingSubject.periodsPerWeek[yearGroup] || 0}
                        onChange={(e) => updatePeriodsPerWeek(yearGroup, parseInt(e.target.value) || 0)}
                        min="0"
                        max="10"
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">periods/week</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Time Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Preferred Time Slots</Label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-${slot}`}
                        checked={editingSubject.preferredTimeSlots.includes(slot)}
                        onCheckedChange={() => toggleTimeSlot(slot, 'preferred')}
                      />
                      <Label htmlFor={`pref-${slot}`} className="text-sm">{slot}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Restricted Time Slots</Label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rest-${slot}`}
                        checked={editingSubject.restrictedTimeSlots.includes(slot)}
                        onCheckedChange={() => toggleTimeSlot(slot, 'restricted')}
                      />
                      <Label htmlFor={`rest-${slot}`} className="text-sm">{slot}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setEditingSubject(null)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSubject}>
            {isNewSubject ? 'Add Subject' : 'Save Changes'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Subject Configuration</h2>
        <p className="text-muted-foreground">Configure subjects with their requirements and constraints</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{subjectConfigs.length}</p>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {subjectConfigs.filter(s => s.requiresLab).length}
              </p>
              <p className="text-sm text-muted-foreground">Lab Required</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {subjectConfigs.reduce((sum, s) => sum + getTotalPeriodsForSubject(s), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Periods/Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {subjectConfigs.filter(s => s.yearGroups.length === 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Need Configuration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Subjects Overview</CardTitle>
              <CardDescription>Configure each subject's requirements and scheduling preferences</CardDescription>
            </div>
            <Button onClick={() => handleEditSubject()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Year Groups</TableHead>
                  <TableHead>Periods/Week</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Max Class Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectConfigs.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">{subject.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subject.yearGroups.map(yg => (
                          <Badge key={yg} variant="outline" className="text-xs">{yg}</Badge>
                        ))}
                        {subject.yearGroups.length === 0 && (
                          <Badge variant="destructive" className="text-xs">Not Set</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTotalPeriodsForSubject(subject)} total
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{getRequirementsText(subject)}</p>
                    </TableCell>
                    <TableCell>{subject.periodDuration}m</TableCell>
                    <TableCell>{subject.maxClassSize}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSubject(subject)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={subjectConfigs.length === 0}>
          Next: Teacher Management
        </Button>
      </div>
    </div>
  );
}