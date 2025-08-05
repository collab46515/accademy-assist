import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Clock, GraduationCap, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AcademicStructureSetupProps {
  onNext: () => void;
  onBack: () => void;
}

export function AcademicStructureSetup({ onNext, onBack }: AcademicStructureSetupProps) {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [terms, setTerms] = useState([
    {
      name: 'Autumn Term',
      startDate: '2024-09-01',
      endDate: '2024-12-20',
      weeks: 16
    },
    {
      name: 'Spring Term',
      startDate: '2025-01-08',
      endDate: '2025-04-04',
      weeks: 13
    },
    {
      name: 'Summer Term',
      startDate: '2025-04-22',
      endDate: '2025-07-18',
      weeks: 13
    }
  ]);

  const [schoolDays, setSchoolDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [periodsPerDay, setPeriodsPerDay] = useState(8);
  const [periodDuration, setPeriodDuration] = useState(45);
  const [breakTimes, setBreakTimes] = useState([
    { name: 'Morning Break', start: '10:30', end: '10:45', period: 3 },
    { name: 'Lunch Break', start: '12:30', end: '13:15', period: 6 }
  ]);

  const [holidays, setHolidays] = useState([
    { name: 'Half Term', startDate: '2024-10-28', endDate: '2024-11-01' },
    { name: 'Christmas Holiday', startDate: '2024-12-21', endDate: '2025-01-07' },
    { name: 'February Half Term', startDate: '2025-02-17', endDate: '2025-02-21' }
  ]);

  const weekdays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const addTerm = () => {
    setTerms([...terms, {
      name: '',
      startDate: '',
      endDate: '',
      weeks: 0
    }]);
  };

  const removeTerm = (index: number) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const updateTerm = (index: number, field: string, value: any) => {
    const updated = [...terms];
    updated[index] = { ...updated[index], [field]: value };
    setTerms(updated);
  };

  const addHoliday = () => {
    setHolidays([...holidays, { name: '', startDate: '', endDate: '' }]);
  };

  const removeHoliday = (index: number) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const updateHoliday = (index: number, field: string, value: string) => {
    const updated = [...holidays];
    updated[index] = { ...updated[index], [field]: value };
    setHolidays(updated);
  };

  const toggleSchoolDay = (day: string) => {
    if (schoolDays.includes(day)) {
      setSchoolDays(schoolDays.filter(d => d !== day));
    } else {
      setSchoolDays([...schoolDays, day]);
    }
  };

  const addBreakTime = () => {
    setBreakTimes([...breakTimes, { name: '', start: '', end: '', period: 0 }]);
  };

  const removeBreakTime = (index: number) => {
    setBreakTimes(breakTimes.filter((_, i) => i !== index));
  };

  const updateBreakTime = (index: number, field: string, value: any) => {
    const updated = [...breakTimes];
    updated[index] = { ...updated[index], [field]: value };
    setBreakTimes(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CalendarDays className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Academic Structure Setup</h2>
        <p className="text-muted-foreground">Configure your school's academic calendar and daily structure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Year & Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Academic Year & Terms</span>
            </CardTitle>
            <CardDescription>Set up your academic year and term structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="academic-year">Academic Year</Label>
              <Input
                id="academic-year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024-2025"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Terms</Label>
                <Button variant="outline" size="sm" onClick={addTerm}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Term
                </Button>
              </div>
              
              <div className="space-y-3">
                {terms.map((term, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Term name"
                        value={term.name}
                        onChange={(e) => updateTerm(index, 'name', e.target.value)}
                        className="flex-1 mr-2"
                      />
                      {terms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTerm(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <Input
                          type="date"
                          value={term.startDate}
                          onChange={(e) => updateTerm(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Date</Label>
                        <Input
                          type="date"
                          value={term.endDate}
                          onChange={(e) => updateTerm(index, 'endDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Weeks</Label>
                        <Input
                          type="number"
                          value={term.weeks}
                          onChange={(e) => updateTerm(index, 'weeks', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Holidays</Label>
                <Button variant="outline" size="sm" onClick={addHoliday}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Holiday
                </Button>
              </div>
              
              <div className="space-y-3">
                {holidays.map((holiday, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Holiday name"
                        value={holiday.name}
                        onChange={(e) => updateHoliday(index, 'name', e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHoliday(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <Input
                          type="date"
                          value={holiday.startDate}
                          onChange={(e) => updateHoliday(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Date</Label>
                        <Input
                          type="date"
                          value={holiday.endDate}
                          onChange={(e) => updateHoliday(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Daily Structure</span>
            </CardTitle>
            <CardDescription>Configure daily schedule and periods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">School Days</Label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={schoolDays.includes(day.id)}
                      onCheckedChange={() => toggleSchoolDay(day.id)}
                    />
                    <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Selected: {schoolDays.map(day => 
                    weekdays.find(w => w.id === day)?.label
                  ).join(', ')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="periods-per-day">Periods per Day</Label>
                <Input
                  id="periods-per-day"
                  type="number"
                  value={periodsPerDay}
                  onChange={(e) => setPeriodsPerDay(parseInt(e.target.value))}
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <Label htmlFor="period-duration">Period Duration (minutes)</Label>
                <Input
                  id="period-duration"
                  type="number"
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(parseInt(e.target.value))}
                  min="30"
                  max="120"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Break Times</Label>
                <Button variant="outline" size="sm" onClick={addBreakTime}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Break
                </Button>
              </div>
              
              <div className="space-y-3">
                {breakTimes.map((breakTime, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        placeholder="Break name"
                        value={breakTime.name}
                        onChange={(e) => updateBreakTime(index, 'name', e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBreakTime(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Input
                          type="time"
                          value={breakTime.start}
                          onChange={(e) => updateBreakTime(index, 'start', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Input
                          type="time"
                          value={breakTime.end}
                          onChange={(e) => updateBreakTime(index, 'end', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">After Period</Label>
                        <Input
                          type="number"
                          value={breakTime.period}
                          onChange={(e) => updateBreakTime(index, 'period', parseInt(e.target.value))}
                          min="1"
                          max={periodsPerDay}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Summary</CardTitle>
          <CardDescription>Review your academic structure configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Academic Year</h4>
              <Badge variant="outline">{academicYear}</Badge>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{terms.length} terms configured</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">School Schedule</h4>
              <p className="text-sm">{schoolDays.length} days per week</p>
              <p className="text-sm">{periodsPerDay} periods per day</p>
              <p className="text-sm">{periodDuration} minutes per period</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Break Times</h4>
              {breakTimes.map((bt, i) => (
                <p key={i} className="text-sm">{bt.name}: {bt.start} - {bt.end}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Next: Subject Configuration
        </Button>
      </div>
    </div>
  );
}